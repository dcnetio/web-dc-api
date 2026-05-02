import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTCOperations, IRTCAuthInfo, IRTCJoinRoomOptions, IRTCStreamConfig, CallSignalEvent, CallSignalEventPayloadMap, IRTCCameraDevice, IRTCScreenShareConfig, RTCGenericEventCallback } from '../interfaces/rtc-interface';
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
  private rtcStateListenerAttached: boolean = false;

  private handleLocalScreenShareStopped = () => {
    this.isScreenSharing = false;
    this.syncActiveMediaRefreshTask();
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
    if (this.shouldPublishVideo) headers.video_publish = 'true';
    if (this.isScreenSharing) headers.screen_publish = 'true';
    return Object.keys(headers).length > 0 ? headers : undefined;
  }

  private isMediaPublishingActive(): boolean {
    return this.hasJoinedChannel && (this.shouldPublishAudio || this.shouldPublishVideo || this.isScreenSharing);
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

  private syncActiveMediaRefreshTask() {
    const shouldRun = this.isMediaPublishingActive();
    if (!shouldRun) {
      if (this.activeMediaRefreshTimer) {
        clearInterval(this.activeMediaRefreshTimer);
        this.activeMediaRefreshTimer = null;
      }
      return;
    }

    if (this.activeMediaRefreshTimer) {
      return;
    }

    this.activeMediaRefreshTimer = setInterval(async () => {
      if (!this.isMediaPublishingActive()) {
        this.syncActiveMediaRefreshTask();
        return;
      }
      try {
        await this.refreshRTCAuthToken(true);
      } catch (e) {}
    },  60 * 1000);
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
    this.authInfo = {
      ...authInfo,
      rtcAppId: authInfo.rtcAppId || this.context?.appInfo?.rtcAppId,
      appId: authInfo.appId || this.context?.appInfo?.appId || ""
    };

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

    await this.rtcOps.init(this.authInfo);
    this.ensureRTCStateListener();
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
    this.isScreenSharing = nextScreenPublish;

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
    } else if ((this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
      // 入会时直接声明能力，不经 buildAliyunTokenRefreshHeaders（后者仅用于续期场景，
      // 因 hasJoinedChannel=false 时会短路返回 undefined，导致能力头丢失）。
      const headers: Record<string, string> = { rtc_token: 'true' };
      if (nextAudioPublish) headers.audio_publish = 'true';
      if (nextVideoPublish) headers.video_publish = 'true';
      // 始终在 Token 里声明屏幕权限（即使当前不共享），保证用户随时可以发起共享
      headers.screen_publish = 'true';
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
    this.isScreenSharing = nextScreenPublish;
    this.syncActiveMediaRefreshTask();
  }

  public async joinChannel(): Promise<void> {
    await this.rtcOps.joinChannel();
    this.hasJoinedChannel = true;
    this.syncActiveMediaRefreshTask();
  }

  public async leaveChannel(): Promise<void> {
    this.joinRoomInFlight = null; // 取消任何待执行的入会 piggyback
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
    this.joinRoomInFlight = null;
    if (this.context) {
      const rtmModule = (this.context as any)?.getModule(CoreModuleName.RTM);
      if (rtmModule && this.rtmListenerAttached) {
        rtmModule.off('onMessageReceived', this.handleRTMMessage);
      }
    }
    this.rtmListenerAttached = false;
    this.detachRTCStateListener();
    this.hasJoinedChannel = false;
    this.shouldPublishAudio = false;
    this.shouldPublishVideo = false;
    this.isScreenSharing = false;
    this.syncActiveMediaRefreshTask();
    this.customEventListeners.clear();
    return this.rtcOps.destroy();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    const nextShouldPublishVideo = !mute;
    await this.rtcOps.muteLocalCamera(mute);
    this.shouldPublishVideo = nextShouldPublishVideo;
    this.syncActiveMediaRefreshTask();
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    const nextShouldPublishAudio = !mute;
    await this.rtcOps.muteLocalMic(mute);
    this.shouldPublishAudio = nextShouldPublishAudio;
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
      await (this.rtcOps as any).startScreenShare(config);
      this.isScreenSharing = true;
      this.syncActiveMediaRefreshTask();
    }
  }

  public async stopScreenShare(): Promise<void> {
    if (typeof (this.rtcOps as any).stopScreenShare === 'function') {
      try {
        await (this.rtcOps as any).stopScreenShare();
      } finally {
        this.isScreenSharing = false;
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
