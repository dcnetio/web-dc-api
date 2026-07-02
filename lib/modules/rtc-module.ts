import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTCOperations, IRTCAuthInfo, IRTCJoinRoomOptions, IRTCStreamConfig, CallSignalEvent, CallSignalEventPayloadMap, IRTCCameraDevice, IRTCScreenShareConfig, RTCGenericEventCallback, RTC_VIDEO_PROFILES, DEFAULT_RTC_VIDEO_PROFILE } from '../interfaces/rtc-interface';
import { RTCChannelInviteMessage } from '../interfaces/rtc-interface';
import { AliyunRTCOperations } from '../implements/rtc/aliyun-rtc';
import { Encryption } from '../util/curve25519Encryption';
import { Ed25519PubKey } from "../common/dc-key/ed25519";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { IRTMStandardMessage } from '../interfaces/rtm-interface';

export class RTCModule implements DCModule, IRTCOperations {
  public readonly moduleName = CoreModuleName.RTC;
  private readonly rtcOps: AliyunRTCOperations;

  private context?: DCContext;
  private customEventListeners: Map<CallSignalEvent, Array<(payload: CallSignalEventPayloadMap[CallSignalEvent]) => void>> = new Map();
  private rtmListenerAttached: boolean = false;
  private static readonly CALL_SIGNAL_EVENTS: ReadonlySet<CallSignalEvent> = new Set<CallSignalEvent>([
    'onCallRequest',
    'onCallAccept',
    'onCallReject',
    'onCallEnd',
    'onPersistentSessionRequest',
    'onPersistentSessionAccept'
  ]);

  constructor() {
    this.rtcOps = new AliyunRTCOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    this.context = context;
    return true;
  }
  
  public async shutdown(): Promise<void> {
    this.stopMaintainTask();
    this.destroy();
  }

  private authInfo: IRTCAuthInfo | null = null;
  private maintainTimer: any = null;
  private activeMediaRefreshTimer: any = null;
  private mainTokenExpireAt: number = 0;
  private tokenRefreshInFlight: Promise<void> | null = null;
  private joinRoomInFlight: Promise<void> | null = null;
  private hasJoinedChannel: boolean = false;
  private shouldPublishAudio: boolean = true;
  private shouldPublishVideo: boolean = true;
  private isScreenSharing: boolean = false;
  // 当前 token 已声明（授权）的推流媒体，用于事件驱动的一次性续期：仅当用户开启某路
  // 此前未授权的媒体时才刷新一次 token（补权限并切换计费档），避免重复续期与重复计费。
  private tokenGrantedAudio: boolean = false;
  private tokenGrantedVideo: boolean = false;
  private tokenGrantedScreen: boolean = false;
  private rtcStateListenerAttached: boolean = false;
  // 按实际用量增量结算（metered）：lastBilledAt 记录当前计费区间的起点（毫秒）。
  // 每次成功「续期 / 升降档结算 / 离开结算」后重置为当次时间戳；相邻两次结算之间的实际经过
  // 秒数通过请求头 billed_duration_sec 上报给服务端，服务端据此按「实际用量 × 当时媒体档」计费，
  // 从而避免「申请长用得短」的预付浪费与「升级重复扣」的重叠双扣。
  private lastBilledAt: number = 0;
  private settleInFlight: boolean = false;
  // 页面卸载兜底（方案B）：pagehide/beforeunload 时尽力补最后一笔结算，覆盖"直接关标签"场景。
  private unloadListenerAttached: boolean = false;

  private handleLocalScreenShareStopped = () => {
    // 用户通过浏览器原生 UI 停止共享：先按屏幕档结算已发生用量，再降档。
    const run = async () => {
      try { await this.settleCurrentUsageInterval(); } catch { /* 结算失败不阻断 */ }
      this.isScreenSharing = false;
    };
    void run();
  };

  // 页面卸载兜底（方案B）：浏览器 pagehide/beforeunload 时尽力补最后一笔结算。
  // 卸载期异步请求可能来不及完成，属 best-effort；周期心跳（方案A）已把异常断开的
  // 未结算窗口收敛到一个心跳周期内，本兜底进一步覆盖"用户主动关闭页面"的常见场景。
  private handlePageHide = () => {
    if (!this.hasJoinedChannel) return;
    try { void this.settleCurrentUsageInterval(); } catch { /* best-effort，不阻断卸载 */ }
  };

  private ensureRTCStateListener() {
    if (this.rtcStateListenerAttached) return;
    this.rtcStateListenerAttached = true;
    this.rtcOps.on('onLocalScreenShareStopped', this.handleLocalScreenShareStopped);
  }

  private detachRTCStateListener() {
    if (!this.rtcStateListenerAttached) return;
    this.rtcStateListenerAttached = false;
    this.rtcOps.off('onLocalScreenShareStopped', this.handleLocalScreenShareStopped);
  }

  private buildAliyunTokenRefreshHeaders(): Record<string, string> | undefined {
    if (!this.hasJoinedChannel) {
      return undefined;
    }

    const headers: Record<string, string> = {};
    headers.rtc_token = 'true'; //表明是 RTC 的鉴权请求，后端可以据此做特殊处理
    if (this.shouldPublishAudio) headers.audio_publish = 'true';
    if (this.shouldPublishVideo) {
      headers.video_publish = 'true';
      headers.video_resolution = this.currentVideoResolutionLabel();
    }
    if (this.isScreenSharing) headers.screen_publish = 'true';
    this.applyExpiresInHeader(headers);
    return Object.keys(headers).length > 0 ? headers : undefined;
  }

  // 将应用侧传入的 Token 有效期（秒）写入请求头 expires_in。
  // 服务端据此签发对应有效期的 Token；有效期仅决定 Token 何时过期，不再等于计费时长（见 billed_duration_sec）。
  private applyExpiresInHeader(headers: Record<string, string>): void {
    const expiresIn = this.authInfo?.expiresIn;
    if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
      headers.expires_in = String(Math.floor(expiresIn));
    }
  }

  // 当前视频计费档位标识（写入请求头 video_resolution），供后端按分辨率档查表计价。
  // 档位由 authInfo.videoProfile 决定，未配置时回退默认档（HD）；仅在声明了视频推流(video_publish)的请求里附带才有意义。
  private currentVideoResolutionLabel(): string {
    const profile = this.authInfo?.videoProfile;
    const spec = (profile && RTC_VIDEO_PROFILES[profile]) || RTC_VIDEO_PROFILES[DEFAULT_RTC_VIDEO_PROFILE];
    return spec.label;
  }

  // 写入本次结算的「实际经过秒数」billed_duration_sec = 距上次结算(lastBilledAt)的墙钟秒数（按秒、向下取整）。
  // 返回本次采样的时间戳；调用方应在请求成功后将 lastBilledAt 提交为该时间戳，以开启下一计费区间。
  private stampBilledDuration(headers: Record<string, string>): number {
    const now = Date.now();
    const base = this.lastBilledAt || now;
    const elapsedSec = Math.max(0, Math.floor((now - base) / 1000));
    headers.billed_duration_sec = String(elapsedSec);
    return now;
  }

  // 结算「上次计费点 -> 现在」这段按当前(旧)媒体档产生的用量（纯结算，不签发新 Token）。
  // 用于升/降档变更状态前、以及离开/销毁时补最后一笔。必须在变更媒体状态【之前】调用，
  // 以保证这段经过时间按其真实生效的媒体档计费。
  private async settleCurrentUsageInterval(): Promise<void> {
    if (!this.hasJoinedChannel) return;
    // 应用自管 token（fetchAuthInfo）不由 SDK 计费结算；仅 aliyun（themeAuthor）签发路径参与。
    if (this.authInfo?.fetchAuthInfo || !this.authInfo?.themeAuthor) return;
    if (this.settleInFlight) return;
    // 与周期续期互斥：若续期在途，等其完成（它已把 lastBilledAt 重置到最新），本次仅结算极小残余。
    if (this.tokenRefreshInFlight) {
      try { await this.tokenRefreshInFlight; } catch { /* ignore */ }
    }
    if (!this.lastBilledAt) { this.lastBilledAt = Date.now(); return; }
    const now = Date.now();
    const elapsedSec = Math.max(0, Math.floor((now - this.lastBilledAt) / 1000));
    if (elapsedSec <= 0) { this.lastBilledAt = now; return; }

    const headers: Record<string, string> = { rtc_token: 'true', settle_only: 'true' };
    if (this.shouldPublishAudio) headers.audio_publish = 'true';
    if (this.shouldPublishVideo) {
      headers.video_publish = 'true';
      headers.video_resolution = this.currentVideoResolutionLabel();
    }
    if (this.isScreenSharing) headers.screen_publish = 'true';
    headers.billed_duration_sec = String(elapsedSec);

    this.settleInFlight = true;
    try {
      await (this.context as any).aiproxy.GetAliyunV3Token({
        channelId: this.authInfo!.channelId || this.authInfo!.userId,
        userId: this.authInfo!.userId,
        appId: this.authInfo!.appId,
        themeAuthor: this.authInfo!.themeAuthor,
        configTheme: this.authInfo!.configTheme,
        serviceName: this.authInfo!.serviceName,
        headers,
        forceRefresh: false,
      });
    } catch { /* 结算失败不阻断媒体操作；下次结算/续期会覆盖该区间 */ }
    // 无论请求成败都推进计费点，避免失败重试导致重复计费；漏结算至多一个区间且随 Token 过期自愈。
    this.lastBilledAt = now;
    this.settleInFlight = false;
  }

  // 事件驱动的一次性续期：当用户开启某路此前 token 未授权的媒体时，立即刷新一次 token，
  // 补齐推流权限并让计费档位切换到新的媒体组合。非周期性——仅在"开启媒体"这一刻触发一次；
  // 若该媒体已在当前 token 中授权（如默认入会已声明），则不刷新，避免重复计费。
  private async ensureMediaPrivilege(): Promise<void> {
    if (!this.hasJoinedChannel) return;
    // 仅 aliyun（themeAuthor）签发路径由 SDK 构造能力头；fetchAuthInfo 由应用自管，跳过。
    if (this.authInfo?.fetchAuthInfo || !this.authInfo?.themeAuthor) return;
    const needAudio = this.shouldPublishAudio && !this.tokenGrantedAudio;
    const needVideo = this.shouldPublishVideo && !this.tokenGrantedVideo;
    const needScreen = this.isScreenSharing && !this.tokenGrantedScreen;
    if (!needAudio && !needVideo && !needScreen) return;
    await this.refreshRTCAuthToken(true);
  }

  private async refreshRTCAuthToken(forceRefresh: boolean): Promise<void> {
    if (!this.authInfo) return;

    if (this.tokenRefreshInFlight) {
      return this.tokenRefreshInFlight;
    }

    this.tokenRefreshInFlight = (async () => {
      let newToken = "";
      let newExpireAt = Date.now() + 60000;
      let newRtcAppId = this.authInfo!.rtcAppId;

      if (this.authInfo!.fetchAuthInfo) {
        const res = await this.authInfo!.fetchAuthInfo(forceRefresh);
        newToken = res.token;
        if (res.expiresAt) newExpireAt = res.expiresAt * 1000;
      } else if ((this.context as any)?.aiproxy && this.authInfo!.themeAuthor) {
        const refreshHeaders = this.buildAliyunTokenRefreshHeaders();
        // 本次续期同时结算「上次计费点 -> 现在」的实际用量：写入 billed_duration_sec，成功后提交计费点。
        // 续期（无媒体变更）时 billed≈整个有效期；升档前已先行 settle 并重置，故升档发新 token 时 billed≈0。
        let billedCommitTs = 0;
        if (refreshHeaders) billedCommitTs = this.stampBilledDuration(refreshHeaders);
        const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
          channelId: this.authInfo!.channelId || this.authInfo!.userId,
          userId: this.authInfo!.userId,
          appId: this.authInfo!.appId,
          themeAuthor: this.authInfo!.themeAuthor,
          configTheme: this.authInfo!.configTheme,
          serviceName: this.authInfo!.serviceName,
          headers: refreshHeaders,
          forceRefresh,
        });
        if (!err && authRes && authRes.token) {
          newToken = authRes.token;
          if (authRes.serviceAppId) newRtcAppId = authRes.serviceAppId;
          newExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
          // 记录本次 token 实际声明（授权）的媒体，供 ensureMediaPrivilege 判断是否需补权限。
          if (refreshHeaders) {
            this.tokenGrantedAudio = !!refreshHeaders.audio_publish;
            this.tokenGrantedVideo = !!refreshHeaders.video_publish;
            this.tokenGrantedScreen = !!refreshHeaders.screen_publish;
          }
          // 计费点推进到本次采样时刻，开启下一计费区间。
          if (billedCommitTs) this.lastBilledAt = billedCommitTs;
        }
      }

      if (!newToken) return;

      this.authInfo!.token = newToken;
      this.authInfo!.rtcAppId = newRtcAppId;
      this.mainTokenExpireAt = newExpireAt;
      if (typeof (this.rtcOps as any).renewToken === 'function') {
        (this.rtcOps as any).renewToken(this.authInfo!.token);
      } else {
        console.warn('The underlying RTC SDK driver does not support dynamic token renewal via renewToken');
      }
    })();

    try {
      await this.tokenRefreshInFlight;
    } finally {
      this.tokenRefreshInFlight = null;
    }
  }

  // 周期心跳结算（方案A，metered）：入房且走 aliyun 计费时，每 60 秒调一次 settleCurrentUsageInterval()，
  // 把"上次结算 -> 现在"的实际用量按当前媒体档即时结算（服务端按现有逻辑对该区间即时扣费）。
  // 目的：即便客户端异常断开（崩溃 / 断网 / 直接关闭页面，未走 leaveChannel/destroy），也最多只丢失
  // 一个心跳周期（≤60s）的用量，避免整段会话收不到费。Token 续期仍由 startMaintainTask 负责（临近过期
  // 才刷新），与本心跳相互独立。应用自管 token（fetchAuthInfo）不由 SDK 结算，故不为其启动心跳。
  // 注意：不再要求「有活跃推流媒体」——纯接收/观众（音视频/屏幕全不开）会话也可能被服务端按「连线底价」
  // (RtcBaseCost) 计费，故只要入房即启动心跳；服务端在未配置底价时对该区间结算返回 0（无害）。
  // 本方法在多处被调用以重新评估媒体状态，需保持幂等：已在运行则不重启定时器。
  private syncActiveMediaRefreshTask() {
    const isAliyunBilled = !this.authInfo?.fetchAuthInfo && !!this.authInfo?.themeAuthor;
    const shouldHeartbeat = this.hasJoinedChannel && isAliyunBilled;

    if (!shouldHeartbeat) {
      if (this.activeMediaRefreshTimer) {
        clearInterval(this.activeMediaRefreshTimer);
        this.activeMediaRefreshTimer = null;
      }
      return;
    }

    if (this.activeMediaRefreshTimer) return; // 已在运行，保持幂等
    this.activeMediaRefreshTimer = setInterval(() => {
      void this.settleCurrentUsageInterval().catch(() => { /* 结算失败不阻断，下次心跳/续期覆盖 */ });
    }, 60 * 1000); // 60s 心跳
  }

  /**
   * 初始化 RTC。
   *
   * 注意：本方法【不会】自动初始化全局 RTM 模块。
   * - 所有信令（callPeer / createPersistentSession 等）依赖全局 RTM 模块（CoreModuleName.RTM）收发消息，
   *   请确保在调用任何信令相关方法前，全局 RTM 已通过 dc.rtm.init() 完成初始化。
   * - 若传入 authInfo.enableRTM = true，底层 provider 会尝试复用 RTC 连接创建一个内置 RTM client
   *   用于实现 sendMessageToPeer / sendMessageToSession，与全局 RTM 模块是独立的两套机制。
   */
  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    // userId 同时用作申请 aliyun token 时的 userId 与 channelId 占位（channelId 缺省时回退到 userId）。
    // 与 RTM 一致：一律以 SDK 内当前登录用户的 publicKey.string() 为准，不依赖调用方传入
    // （自动生成的应用代码常遗漏或传错），从根源避免 "user undefined" / "missing channelId"。
    // 仅当公钥尚不可用时才回退到传入值。
    const loginUserId = this.context?.publicKey?.string() || authInfo.userId || "";
    this.authInfo = {
      ...authInfo,
      userId: loginUserId,
      rtcAppId: authInfo.rtcAppId || this.context?.appInfo?.rtcAppId,
      appId: authInfo.appId || this.context?.appInfo?.appId || ""
    };

    if (!this.authInfo.userId) {
      throw new Error(
        '[RTC] Init failed: no logged-in user. Ensure the user is logged in (dc.publicKey ready) before calling dc.rtc.init.'
      );
    }

    if (!this.authInfo.token && this.authInfo.fetchAuthInfo) {
      const res = await this.authInfo.fetchAuthInfo(true);
      this.authInfo.token = res.token;
      this.mainTokenExpireAt = res.expiresAt ? res.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
    }

    if (!this.authInfo.token && (this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
      try {
        const headers = this.buildAliyunTokenRefreshHeaders();
        const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
          channelId: this.authInfo.channelId || this.authInfo.userId, 
          userId: this.authInfo.userId,
          appId: this.authInfo.appId,
          themeAuthor: this.authInfo.themeAuthor,
          configTheme: this.authInfo.configTheme,
          serviceName: this.authInfo.serviceName,
          headers,
          forceRefresh: true
        });
        if (err || !authRes || !authRes.token) {
           throw err || new Error("empty response");
        }
        
        this.authInfo.token = authRes.token;
        this.mainTokenExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
        if (authRes.serviceAppId) this.authInfo.rtcAppId = authRes.serviceAppId;
      } catch (e: any) {
        throw new Error(`[RTC] Auto-fetch auth info for rtc failed: ${e.message}`);
      }
    }

    if (!this.mainTokenExpireAt) this.mainTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    // 默认按 RTC 行为，入房后会推音视频；屏幕共享默认关闭。
    this.hasJoinedChannel = false;
    this.shouldPublishAudio = true;
    this.shouldPublishVideo = true;
    this.isScreenSharing = false;
    this.lastBilledAt = 0;

    await this.rtcOps.init(this.authInfo);
    this.ensureRTCStateListener();
    if (typeof window !== 'undefined' && !this.unloadListenerAttached) {
      window.addEventListener('pagehide', this.handlePageHide);
      window.addEventListener('beforeunload', this.handlePageHide);
      this.unloadListenerAttached = true;
    }
    this.startMaintainTask();
  }

  private startMaintainTask() {
    if (this.maintainTimer) clearInterval(this.maintainTimer);
    this.maintainTimer = setInterval(async () => {
      const now = Date.now();
      const threshold = 20 * 1000; // 前20秒去刷新
      
      if (this.authInfo && this.mainTokenExpireAt && (this.mainTokenExpireAt - now <= threshold)) {
        this.mainTokenExpireAt = now + 60000; // prevent overlapping fetch
        try {
          await this.refreshRTCAuthToken(true);
        } catch(e) {}
      }
    }, 5000);
    this.syncActiveMediaRefreshTask();
  }

  private stopMaintainTask() {
    if (this.maintainTimer) {
      clearInterval(this.maintainTimer);
      this.maintainTimer = null;
    }
    if (this.activeMediaRefreshTimer) {
      clearInterval(this.activeMediaRefreshTimer);
      this.activeMediaRefreshTimer = null;
    }
  }


  public async joinRoom(channelId: string, options?: IRTCJoinRoomOptions): Promise<void> {
    // Deduplicate concurrent calls: subsequent callers piggyback on the in-flight join.
    if (this.joinRoomInFlight) return this.joinRoomInFlight;
    this.joinRoomInFlight = this._doJoinRoom(channelId, options).finally(() => {
      this.joinRoomInFlight = null;
    });
    return this.joinRoomInFlight;
  }

  private async _doJoinRoom(channelId: string, options?: IRTCJoinRoomOptions): Promise<void> {
    if (!this.authInfo) throw new Error('Not initialized');

    const nextAudioPublish = options?.audioPublish ?? true;
    const nextVideoPublish = options?.videoPublish ?? true;
    // screenPublish 默认 true：预先在 Token 里申请屏幕共享权限，避免用户临时开启共享时因权限缺失导致服务端拒绝转发辅流
    const nextScreenPublish = options?.screenPublish ?? true;

    // 在取 token 前先更新本地发布意图，确保本次入会的鉴权请求可带上正确能力声明。
    this.shouldPublishAudio = nextAudioPublish;
    this.shouldPublishVideo = nextVideoPublish;
    // 屏幕共享的「Token 预授权」与「实际计费」解耦：nextScreenPublish 仅决定是否在入会 Token 里
    // 预留屏幕推流权限（记入 tokenGrantedScreen，便于日后 startScreenShare 免刷新即可开启）；
    // 而 isScreenSharing 是「当前是否真的在共享」的计费口径，入会时尚未共享，应为 false，
    // 否则整段普通音视频会话会被按屏幕档计费（预授权≠正在用）。
    this.isScreenSharing = false;

    // If already in a channel, leave it first
    if (this.rtcOps) {
      await this.rtcOps.leaveChannel().catch(() => {});
    }
    this.hasJoinedChannel = false;
    this.syncActiveMediaRefreshTask();

    this.authInfo.channelId = channelId;
    this.authInfo.token = undefined; // force refresh
    this.mainTokenExpireAt = 0;

    // refetch token for the new channel
    if (this.authInfo.fetchAuthInfo) {
      const res = await this.authInfo.fetchAuthInfo(true);
      this.authInfo.token = res.token;
      this.mainTokenExpireAt = res.expiresAt ? res.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
      // fetchAuthInfo 由应用自行签发 token（SDK 不构造能力头），视为已授予全部推流权限，不触发补权限续期。
      this.tokenGrantedAudio = this.tokenGrantedVideo = this.tokenGrantedScreen = true;
      this.lastBilledAt = Date.now();
    } else if ((this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
      // 入会时直接声明能力，不经 buildAliyunTokenRefreshHeaders（后者仅用于续期场景，
      // 因 hasJoinedChannel=false 时会短路返回 undefined，导致能力头丢失）。
      // 后端 RTC 动态计费按"每次签发新 Token 都计费"：入会及后续每次续期（临近过期时）均按声明的媒体计费。
      const headers: Record<string, string> = { rtc_token: 'true' };
      if (nextAudioPublish) headers.audio_publish = 'true';
      if (nextVideoPublish) {
        headers.video_publish = 'true';
        headers.video_resolution = this.currentVideoResolutionLabel();
      }
      // 仅当应用声明需要屏幕权限时才预授（默认 true）；显式传 screenPublish:false 的减配会话
      // 入会不声明屏幕，避免整段按屏幕档计费——之后真正发起共享时由 ensureMediaPrivilege 按需补授权。
      if (nextScreenPublish) headers.screen_publish = 'true';
      this.applyExpiresInHeader(headers);
      // 入会=新会话的第一个计费区间起点，尚未产生用量：billed_duration_sec=0，服务端按分钟计费故不扣；
      // 首笔费用由后续心跳/升降档结算按实际经过秒数折算产生。
      headers.billed_duration_sec = '0';
      const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
        channelId: this.authInfo.channelId,
        userId: this.authInfo.userId,
        appId: this.authInfo.appId,
        themeAuthor: this.authInfo.themeAuthor,
        configTheme: this.authInfo.configTheme,
        serviceName: this.authInfo.serviceName,
        headers,
        forceRefresh: true
      });
      if (!err && authRes && authRes.token) {
        this.authInfo.token = authRes.token;
        if (authRes.serviceAppId) this.authInfo.rtcAppId = authRes.serviceAppId;
        this.mainTokenExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
        // 记录入会 token 授权的媒体：均按声明意图（screenPublish 默认 true，故默认仍预授屏幕权限）。
        this.tokenGrantedAudio = nextAudioPublish;
        this.tokenGrantedVideo = nextVideoPublish;
        this.tokenGrantedScreen = nextScreenPublish;
        // 开启首个计费区间：自此时刻起按实际用量结算。
        this.lastBilledAt = Date.now();
      } else {
        throw new Error('Failed to fetch token for new room');
      }
    }

    if (this.rtcOps && typeof (this.rtcOps as any).renewToken === 'function' && this.authInfo.token) {
      (this.rtcOps as any).renewToken(this.authInfo.token);
    } else if (this.rtcOps) {
      console.warn('The RTC provider does not explicitly implement renewToken, hoping SDK accepts token in join()');
    }

    await this.rtcOps.joinRoom(channelId, options);
    this.hasJoinedChannel = true;

    // provider joinRoom 默认会开麦开摄像头，这里按调用方指定能力回调到目标状态。
    if (!nextAudioPublish) {
      await this.rtcOps.muteLocalMic(true);
    }
    if (!nextVideoPublish) {
      await this.rtcOps.muteLocalCamera(true);
    }

    this.shouldPublishAudio = nextAudioPublish;
    this.shouldPublishVideo = nextVideoPublish;
    // 入会完成后仍未真正共享屏幕：计费口径 isScreenSharing 保持 false，屏幕权限已由 Token 预授权
    // （tokenGrantedScreen），实际共享由 startScreenShare 触发时再置 true 并开始按屏幕档计费。
    this.isScreenSharing = false;
    this.syncActiveMediaRefreshTask();
  }

  public async joinChannel(): Promise<void> {
    await this.rtcOps.joinChannel();
    this.hasJoinedChannel = true;
    this.syncActiveMediaRefreshTask();
  }

  public async leaveChannel(): Promise<void> {
    this.joinRoomInFlight = null; // 取消任何待执行的入会 piggyback
    // 离开前补最后一笔结算：按当前媒体档结算「上次计费点 -> 现在」的实际用量，只付真实用量。
    try { await this.settleCurrentUsageInterval(); } catch { /* 结算失败不阻断离开 */ }
    try {
      await this.rtcOps.leaveChannel();
    } finally {
      this.hasJoinedChannel = false;
      this.isScreenSharing = false;
      this.syncActiveMediaRefreshTask();
    }
  }

  public async createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: IRTCStreamConfig): Promise<string> {
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!this.context || !rtmModule) {
      throw new Error("RTM module is required for creating an RTC channel");
    }

    // 生成随机的16位 hex 字符串作为 channelId
    const buffer = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < 8; i++) buffer[i] = Math.floor(Math.random() * 256);
    }
    const channelId = Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');

    // RTM 中，我们需要加密发送给目标方
    for (const userId of userIds) {
      let targetPubKeyBytes;
      try {
        targetPubKeyBytes = Ed25519PubKey.edPubkeyFromStr(userId);
      } catch (e: any) {
        throw new Error(`目标的 User ID (${userId}) 格式无效，必须是合法的公钥字符串，请复制对方真实的 UserID 进行私聊邀请。`);
      }

      const invitePayload = {
        isInvite: true,
        channelId,
        channelDescription,
        rtcConfig
      };

      const payloadString = JSON.stringify(invitePayload);
      const payloadBytes = uint8ArrayFromString(payloadString);

      const encryptedBytes = await Encryption.encrypt(targetPubKeyBytes.bytes(), payloadBytes);
      const encryptedContent = uint8ArrayToString(encryptedBytes, 'base64');

      const inviteMsg: any = {
        appId: this.context.appInfo?.appId || 'unknown',
        sourceUserId: (this.context as any).accountInfo?.uid || (this.context.publicKey ? this.context.publicKey.string() : ''),
        messageType: 'RTC_INVITE',
        content: encryptedContent,
        timestamp: Date.now(),
        isEncrypted: true,
        isInvite: true
      };

      const appIdValue = new TextEncoder().encode(inviteMsg.appId);
      const messageTypeValue = new TextEncoder().encode(inviteMsg.messageType);
      const contentValue = new TextEncoder().encode(inviteMsg.content);
      const isEncryptedValue = new TextEncoder().encode(String(inviteMsg.isEncrypted));
      const timestampValue = new TextEncoder().encode(String(inviteMsg.timestamp));

      const preSign = new Uint8Array([
        ...appIdValue,
        ...messageTypeValue,
        ...contentValue,
        ...isEncryptedValue,
        ...timestampValue,
      ]);

      if (this.context.sign) {
        const signatureBytes = await this.context.sign(preSign);
        inviteMsg.signature = uint8ArrayToString(signatureBytes, 'base64');
      } else {
        inviteMsg.signature = "signature_placeholder";
      }

      // 通过 RTM 的 P2P 消息分发
      await rtmModule.sendMessageToPeer(userId, JSON.stringify(inviteMsg), true, true);
    }

    return channelId;
  }

  public async parseRTCChannelInvite(inviteMsg: RTCChannelInviteMessage): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: IRTCStreamConfig }> {
    if (typeof inviteMsg === 'string') {
      try {
        inviteMsg = JSON.parse(inviteMsg) as IRTMStandardMessage;
      } catch (e) {
        throw new Error("Failed to parse invite message");
      }
    }
  
    if (!inviteMsg.isInvite || !inviteMsg.sourceUserId || !inviteMsg.signature || !inviteMsg.content || inviteMsg.messageType !== 'RTC_INVITE') {
      throw new Error("Invalid RTC invite message format");
    }
  
    // 1. 提取发送者的公钥
    const senderPubKey = Ed25519PubKey.edPubkeyFromStr(inviteMsg.sourceUserId);
  
    // 2. 验证签名
    const appIdValue = new TextEncoder().encode(inviteMsg.appId || 'unknown');
    const messageTypeValue = new TextEncoder().encode(inviteMsg.messageType);
    const contentValue = new TextEncoder().encode(inviteMsg.content);
    const isEncryptedValue = new TextEncoder().encode(String(inviteMsg.isEncrypted));
    const timestampValue = new TextEncoder().encode(String(inviteMsg.timestamp));
  
    const preSign = new Uint8Array([
      ...appIdValue,
      ...messageTypeValue,
      ...contentValue,
      ...isEncryptedValue,
      ...timestampValue,
    ]);
  
    const signatureBytes = uint8ArrayFromString(inviteMsg.signature, 'base64');
  
    const isValid = senderPubKey.verify(preSign, signatureBytes);
    if (!isValid) {
      throw new Error("Invalid signature on RTC invite message");
    }
  
    // 3. 解密内容
    const encryptedBytes = uint8ArrayFromString(inviteMsg.content, 'base64');
    let decryptedBytes: Uint8Array;
    
    if (this.context?.privateKey) {
      decryptedBytes = await Encryption.decrypt(this.context.privateKey.raw, encryptedBytes);
    } else if (this.context && (this.context as any).auth) {
      decryptedBytes = await (this.context as any).auth.decryptWith(encryptedBytes);
    } else {
      throw new Error("Private key or auth module not available for decryption");
    }
    
    const decryptedString = new TextDecoder().decode(decryptedBytes);
    const payload = JSON.parse(decryptedString);
  
    if (!payload.channelId) {
      throw new Error("Invalid decrypted RTC invite payload");
    }
  
    return { 
      channelId: payload.channelId, 
      channelDescription: payload.channelDescription,
      rtcConfig: payload.rtcConfig
    };
  }

  public destroy(): void {
    // teardown 必须「未初始化时安全跳过」且整体不抛错：上层（生成应用的 leaveGame 等）
    // 常在 init 失败 / 从未入房的半初始化状态下调用 destroy，任何一步抛错都会变成
    // "Leave game error" 二次异常。这里逐步包裹，确保即便某模块未就绪也能完成清理。
    this.joinRoomInFlight = null;
    try {
      if (this.context) {
        const rtmModule = (this.context as any)?.getModule(CoreModuleName.RTM);
        if (rtmModule && this.rtmListenerAttached) {
          rtmModule.off('onMessageReceived', this.handleRTMMessage);
        }
      }
    } catch {
      /* RTM 模块未初始化，安全跳过 */
    }
    this.rtmListenerAttached = false;
    try { this.detachRTCStateListener(); } catch { /* 未注册监听，安全跳过 */ }
    try {
      if (typeof window !== 'undefined' && this.unloadListenerAttached) {
        window.removeEventListener('pagehide', this.handlePageHide);
        window.removeEventListener('beforeunload', this.handlePageHide);
      }
    } catch { /* 安全跳过 */ }
    this.unloadListenerAttached = false;
    // 若在未 leaveChannel 的情况下直接销毁且仍在房内，尽力补最后一笔结算（best-effort，不阻塞销毁）。
    // 已先调 leaveChannel 时 hasJoinedChannel=false，settleCurrentUsageInterval 内部守卫会直接跳过，不会重复结算。
    // （async 函数在首个 await 前同步执行，故媒体档/经过时长已在下方清零前同步采样。）
    if (this.hasJoinedChannel) {
      try { void this.settleCurrentUsageInterval(); } catch { /* 安全跳过 */ }
    }
    this.hasJoinedChannel = false;
    this.shouldPublishAudio = false;
    this.shouldPublishVideo = false;
    this.isScreenSharing = false;
    try { this.syncActiveMediaRefreshTask(); } catch { /* 安全跳过 */ }
    this.customEventListeners.clear();
    try {
      this.rtcOps.destroy();
    } catch {
      /* RTC provider 未初始化或已销毁，安全跳过 */
    }
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    const enabling = !mute;
    await this.rtcOps.muteLocalCamera(mute);
    // 先按当前(旧)媒体档结算已发生用量（此刻 shouldPublishVideo 仍为旧值），再变更状态。
    await this.settleCurrentUsageInterval();
    this.shouldPublishVideo = enabling;
    if (enabling) {
      // 开启摄像头（升档）：若当前 token 未授视频推流权限，补一次续期（补权限并按新档开启新计费区间，billed≈0）。
      await this.ensureMediaPrivilege();
    }
    // 媒体档变化后重新评估心跳：从「全静音」恢复媒体时启动、全部关闭时停止（幂等）。
    this.syncActiveMediaRefreshTask();
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    const enabling = !mute;
    await this.rtcOps.muteLocalMic(mute);
    // 先按当前(旧)媒体档结算已发生用量（此刻 shouldPublishAudio 仍为旧值），再变更状态。
    await this.settleCurrentUsageInterval();
    this.shouldPublishAudio = enabling;
    if (enabling) {
      // 开启麦克风（升档）：若当前 token 未授音频推流权限，补一次续期（补权限并按新档开启新计费区间，billed≈0）。
      await this.ensureMediaPrivilege();
    }
    // 媒体档变化后重新评估心跳：从「全静音」恢复媒体时启动、全部关闭时停止（幂等）。
    this.syncActiveMediaRefreshTask();
  }

  public async muteRemoteAudio(mute: boolean): Promise<void> {
    if (typeof (this.rtcOps as any).muteRemoteAudio === 'function') {
      return (this.rtcOps as any).muteRemoteAudio(mute);
    }
  }

  public async getCameras(): Promise<IRTCCameraDevice[]> {
    return this.rtcOps.getCameras();
  }

  public async switchCamera(deviceId: string): Promise<void> {
    return this.rtcOps.switchCamera(deviceId);
  }

  public async startScreenShare(config?: IRTCScreenShareConfig): Promise<void> {
    if (typeof (this.rtcOps as any).startScreenShare === 'function') {
      const prevScreenSharing = this.isScreenSharing;
      // 升档前先按旧档（屏幕仍为关）结算已发生用量，再切到屏幕档。
      await this.settleCurrentUsageInterval();
      this.isScreenSharing = true;
      try {
        // 先补屏幕推流权限：若当前 token 未授权，立即刷新一次 token 再开启，避免服务端拒绝辅流转发。
        await this.ensureMediaPrivilege();
        await (this.rtcOps as any).startScreenShare(config);
        // 开启屏幕共享后重新评估心跳（幂等，已运行则保持）。
        this.syncActiveMediaRefreshTask();
      } catch (e) {
        this.isScreenSharing = prevScreenSharing;
        throw e;
      }
    }
  }

  public async stopScreenShare(): Promise<void> {
    if (typeof (this.rtcOps as any).stopScreenShare === 'function') {
      try {
        await (this.rtcOps as any).stopScreenShare();
        // 结算屏幕档已发生用量（此刻 isScreenSharing 仍为 true），再降档到音视频档。
        await this.settleCurrentUsageInterval();
      } finally {
        this.isScreenSharing = false;
        // 停止共享后重新评估心跳：若屏幕是唯一媒体则停止，否则保持（幂等）。
        this.syncActiveMediaRefreshTask();
      }
    }
  }

  public async setDisplayRemoteScreenShare(userId: string, element: HTMLElement | null): Promise<void> {
    if (typeof (this.rtcOps as any).setDisplayRemoteScreenShare === 'function') {
      return (this.rtcOps as any).setDisplayRemoteScreenShare(userId, element);
    }
  }

  public async setDisplayRemoteVideo(userId: string, element: HTMLElement | null, streamType: number = 1): Promise<void> {
    return this.rtcOps.setDisplayRemoteVideo(userId, element, streamType);
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    return this.rtcOps.setDisplayLocalVideo(element);
  }

  // --- P2P 呼叫与信令处理 ---
  // 以下所有信令方法（callPeer / acceptCall / rejectCall / endCall /
  // createPersistentSession / acceptPersistentSession）均通过全局 RTM 模块
  //（CoreModuleName.RTM）发送信令消息，使用前必须确保全局 RTM 已初始化。
  public async callPeer(targetUserId: string, mediaType: 'video' | 'audio' | 'mixed' = 'video'): Promise<string> {
    const channelId = this.generateChannelId();
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!rtmModule) throw new Error("RTM module is required for signaling");

    const payload = {
      type: 'DC_RTC_CALL_REQUEST',
      channelId,
      mediaType,
      timestamp: Date.now()
    };
    
    // 使用 RTM 模块发消息给对方
    await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    return channelId;
  }

  public async acceptCall(targetUserId: string, channelId: string): Promise<void> {
    const payload = { type: 'DC_RTC_CALL_ACCEPT', channelId };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  public async rejectCall(targetUserId: string): Promise<void> {
    const payload = { type: 'DC_RTC_CALL_REJECT' };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  public async endCall(targetUserId: string, channelId?: string): Promise<void> {
    const payload = { type: 'DC_RTC_CALL_END', channelId };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  // 游戏邀请握手信令：同样依赖全局 RTM 模块，使用前确保 dc.rtm.init() 已完成。
  public async createPersistentSession(targetUserId: string, sessionDescription?: string): Promise<string> {
    const channelId = this.generateChannelId();
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!rtmModule) throw new Error("RTM module is required for signaling");

    const payload = {
      type: 'DC_RTC_PERSISTENT_SESSION_REQUEST',
      channelId,
      sessionDescription,
      timestamp: Date.now()
    };
    
    await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    return channelId;
  }

  public async acceptPersistentSession(targetUserId: string, channelId: string): Promise<void> {
    const payload = { type: 'DC_RTC_PERSISTENT_SESSION_ACCEPT', channelId };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  private generateChannelId(): string {
    const buffer = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < 8; i++) buffer[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = true, sendOffline: boolean = false): Promise<'success' | 'offline' | 'failed'> {
    let res: 'success' | 'offline' | 'failed' = 'failed';
    try {
      res = await this.rtcOps.sendMessageToPeer(userId, message, requireAck, sendOffline) as any;
    } catch (e: any) {
      res = 'failed';
    }
    
    if (res === 'offline' && sendOffline) {
       const dc = this.context as any;
       if (dc && dc.message) {
         try {
           await dc.message.sendMsgToUserBox(userId, message);
           return 'offline';
         } catch(err2: any) {
           return 'failed';
         }
       } else {
         return 'failed';
       }
    } else if (res === 'success') {
       return 'success';
    } else if (res === 'failed' && sendOffline) {
       const dc = this.context as any;
       if (dc && dc.message) {
         try {
           await dc.message.sendMsgToUserBox(userId, message);
           return 'offline';
         } catch(err2: any) {
           return 'failed';
         }
       } else {
         return 'failed';
       }
    } else {
       return res;
    }
  }

  public async sendMessageToSession(message: string): Promise<void> {
    return this.rtcOps.sendMessageToSession(message);
  }

  /**
   * 获取指定频道内的在线用户列表（可选参数 channelId，RTC主要指当前频道的用户列表）
   */
  public async getChannelUsers(channelId?: string): Promise<string[]> {
    return this.rtcOps.getChannelUsers(channelId);
  }

  public on<E extends CallSignalEvent>(event: E, callback: (payload: CallSignalEventPayloadMap[E]) => void): void;
  public on(event: string, callback: RTCGenericEventCallback): void;
  public on(event: string, callback: RTCGenericEventCallback): void {
    if (this.isCallSignalEvent(event)) {
      this.ensureRTMListener();
      if (!this.customEventListeners.has(event)) {
        this.customEventListeners.set(event, []);
      }
      this.customEventListeners.get(event)!.push(callback as (payload: CallSignalEventPayloadMap[CallSignalEvent]) => void);
    } else {
      this.rtcOps.on(event, callback);
    }
  }

  public off<E extends CallSignalEvent>(event: E, callback: (payload: CallSignalEventPayloadMap[E]) => void): void;
  public off(event: string, callback: RTCGenericEventCallback): void;
  public off(event: string, callback: RTCGenericEventCallback): void {
    if (this.isCallSignalEvent(event)) {
      const callbacks = this.customEventListeners.get(event);
      if (callbacks) {
        const idx = callbacks.indexOf(callback as (payload: CallSignalEventPayloadMap[CallSignalEvent]) => void);
        if (idx > -1) callbacks.splice(idx, 1);
      }
    } else {
      this.rtcOps.off(event, callback);
    }
  }

  private isCallSignalEvent(event: string): event is CallSignalEvent {
    return RTCModule.CALL_SIGNAL_EVENTS.has(event as CallSignalEvent);
  }

  private processedSignals = new Set<string>();

  private handleRTMMessage = (msgEvent: any) => {
    try {
      const payload = JSON.parse(msgEvent.message);
      if (payload && payload.type) {
        const uid = msgEvent.publisher || msgEvent.uid || '';
        const sigKey = `${payload.type}_${payload.channelId || ''}_${uid}_${payload.timestamp || ''}`;
        if (this.processedSignals.has(sigKey)) return;
        this.processedSignals.add(sigKey);
        setTimeout(() => this.processedSignals.delete(sigKey), 10000);

        if (payload.type === 'DC_RTC_CALL_REQUEST') {
          this.emitCustomEvent('onCallRequest', {
            callerId: uid,
            channelId: payload.channelId,
            mediaType: payload.mediaType,
            timestamp: payload.timestamp
          });
        } else if (payload.type === 'DC_RTC_CALL_ACCEPT') {
          this.emitCustomEvent('onCallAccept', {
            calleeId: uid,
            channelId: payload.channelId
          });
        } else if (payload.type === 'DC_RTC_CALL_REJECT') {
          this.emitCustomEvent('onCallReject', {
            calleeId: uid
          });
        } else if (payload.type === 'DC_RTC_CALL_END') {
          this.emitCustomEvent('onCallEnd', {
            userId: uid,
            channelId: payload.channelId
          });
        } else if (payload.type === 'DC_RTC_PERSISTENT_SESSION_REQUEST') {
          this.emitCustomEvent('onPersistentSessionRequest', {
            callerId: uid,
            channelId: payload.channelId,
            sessionDescription: payload.sessionDescription,
            timestamp: payload.timestamp
          });
        } else if (payload.type === 'DC_RTC_PERSISTENT_SESSION_ACCEPT') {
          this.emitCustomEvent('onPersistentSessionAccept', {
            calleeId: uid,
            channelId: payload.channelId
          });
        }
      }
    } catch (e) {
      // ignore
    }
  };

  private ensureRTMListener() {
    if (this.rtmListenerAttached) return;
    this.rtmListenerAttached = true;
    
    // We defer attaching slightly or rely on DCContext being fully initialized
    setTimeout(() => {
      const rtmModule = (this.context as any)?.getModule(CoreModuleName.RTM);
      if (rtmModule) {
        rtmModule.on('onMessageReceived', this.handleRTMMessage);
      } else {
        this.rtmListenerAttached = false; // try again next time if RTM is missing
      }
    }, 100);
  }

  private emitCustomEvent<E extends CallSignalEvent>(event: E, payload: CallSignalEventPayloadMap[E]) {
    const list = this.customEventListeners.get(event);
    if (list) {
      list.forEach(cb => cb(payload));
    }
  }
}
