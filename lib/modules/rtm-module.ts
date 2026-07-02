import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTMAuthInfo, IRTMOperations, IRTMStandardMessage, RTMEventName, RTMEventPayloadMap, RTMGenericEventCallback, IRTMMessageReceivedPayload } from '../interfaces/rtm-interface';
import { AliyunRTMOperations } from '../implements/rtm/aliyun-rtm';
import { Encryption } from '../util/curve25519Encryption';
import { Ed25519PubKey } from "../common/dc-key/ed25519";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";

export class RTMModule implements DCModule, IRTMOperations {
  public readonly moduleName = CoreModuleName.RTM;
  
  public userBoxOps: AliyunRTMOperations | null = null;
  private maintainTimer: any = null;
  private mainTokenExpireAt: number = 0;
  private context?: DCContext;
  private authInfo: IRTMAuthInfo | null = null;

  // shared state map
  private pendingPings: Map<string, Set<(isOnline: boolean) => void>> = new Map();
  private pendingAcks: Map<string, Set<(success: boolean, err?: Error) => void>> = new Map();
  private _proxyListeners: Map<string, Set<RTMGenericEventCallback>> = new Map();

  // --- transient send infrastructure (per-target token cache / connection pool / send queue) ---
  /** 按目标用户缓存动态 token，避免每条消息都重新取 token */
  private transientTokenCache: Map<string, { token: string; rtcAppId?: string; expireAt: number }> = new Map();
  /** 按目标用户复用临时连接，空闲一段时间后自动断开 */
  private transientOps: Map<string, { op: AliyunRTMOperations; idleTimer: any }> = new Map();
  /** 按目标用户串行化发送，避免并发建连/发布相互竞争 */
  private transientSendQueues: Map<string, Promise<boolean>> = new Map();
  /** 临时连接空闲多久后断开 */
  private static readonly TRANSIENT_IDLE_MS = 30 * 1000;
  /** token 距过期小于该值时视为失效，提前刷新 */
  private static readonly TOKEN_SAFETY_MS = 30 * 1000;
  /** 缓存 token 未携带过期时间时的保守有效期 */
  private static readonly TOKEN_DEFAULT_TTL_MS = 10 * 60 * 1000;

  constructor() {}

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    this.context = context;
    return true;
  }

  public async shutdown(): Promise<void> {
    await this.logout();
  }

  public async login(authInfo: IRTMAuthInfo): Promise<void> {
    // RTM 登录的是主连接（当前登录用户的 userBox），其 userId 恒等于登录用户的公钥字符串，
    // 同时用作自动申请 aliyun token 时的 channelId 与 userId。因此一律以 SDK 内当前登录用户的
    // publicKey.string() 为准，不依赖调用方传入的 userId（自动生成的应用代码常遗漏或传错），
    // 从根源避免 "user undefined" / "missing channelId"。仅当公钥尚不可用时才回退到传入值。
    const loginUserId = this.context?.publicKey?.string() || authInfo.userId || "";
    this.authInfo = {
      ...authInfo,
      userId: loginUserId,
      rtcAppId: authInfo.rtcAppId || this.context?.appInfo?.rtcAppId,
      appId: authInfo.appId || this.context?.appInfo?.appId || ""
    };

    if (!this.authInfo.userId) {
      throw new Error(
        '[RTM] Login failed: no logged-in user. Ensure the user is logged in (dc.publicKey ready) before calling dc.rtm.login.'
      );
    }

    // Auto-fetch token for main userBox if no token is provided but native config exists
    if (!this.authInfo.token && (this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
      try {
        const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
          channelId: this.authInfo.userId,
          userId: this.authInfo.userId,
          appId: this.authInfo.appId,
          themeAuthor: this.authInfo.themeAuthor,
          configTheme: this.authInfo.configTheme,
          serviceName: this.authInfo.serviceName,
          forceRefresh: true
        });
        if (err || !authRes || !authRes.token) {
           throw err || new Error("empty response");
        }
        
        this.authInfo.token = authRes.token;
        this.mainTokenExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
        if (authRes.serviceAppId) this.authInfo.rtcAppId = authRes.serviceAppId;
      } catch (e: any) {
        throw new Error(`[RTM] Auto-fetch main auth info for user ${this.authInfo.userId} failed: ${e.message}`);
      }
    }

    if (!this.authInfo.token) {
        throw new Error('[RTM] Login failed: token is missing and auto-fetch properties (themeAuthor, configTheme, serviceName) are unset.');
    }
    
    if (!this.mainTokenExpireAt) this.mainTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    this.userBoxOps = new AliyunRTMOperations();
    
    if (this._proxyListeners) {
      this._proxyListeners.forEach((cbs, evt) => {
        cbs.forEach(cb => this.userBoxOps!.on(evt, cb));
      });
    }
    
    this.registerOpListeners(this.userBoxOps);
    await this.userBoxOps.connect(this.authInfo as any, this.authInfo!.userId);
    this.startMaintainTask();
  }

  public async logout(): Promise<void> {
    if (this.userBoxOps) {
      await this.userBoxOps.disconnect();
      this.userBoxOps = null;
    }
    // 清理所有临时连接与缓存，保证登出后无残留连接/定时器
    this.transientOps.forEach((entry) => {
      if (entry.idleTimer) clearTimeout(entry.idleTimer);
      entry.op.disconnect().catch(() => {});
    });
    this.transientOps.clear();
    this.transientTokenCache.clear();
    this.transientSendQueues.clear();
    this.authInfo = null;
    this.stopMaintainTask();
  }

  private registerOpListeners(op: AliyunRTMOperations) {
    // handleMessage 为 async：必须吞掉 rejection，避免出现 Unhandled Promise Rejection
    op.on('onMessageReceived', (msg) => {
      this.handleMessage(op, msg).catch((e: any) => {
        console.warn('[RTM] handleMessage error:', e?.message || e);
      });
    });
  }

  private async handleMessage(op: AliyunRTMOperations, data: IRTMMessageReceivedPayload) {
    const messageStr = data.message;
    let uid = data.userId || data.publisher;
    if (!uid) return;

    if (uid && uid.includes('_')) {
        uid = uid.split('_')[0];
        data.userId = uid;
    }

    // handle pings
    if (messageStr === '__DC_PING__') {
      try {
        const encodedPong = new TextEncoder().encode('__DC_PONG__');
        await this.sendTransientMessage(uid, encodedPong, false);
      } catch(e) {}
      return;
    }

    // handle pongs
    if (messageStr === '__DC_PONG__') {
      const set = this.pendingPings.get(uid);
      if (set) {
         set.forEach(cb => {
            try { cb(true); } catch(e){}
         });
      }
      return;
    }

    // handle ACKs
    if (messageStr.startsWith('__DC_ACK__:')) {
      const hashId = messageStr.substring(11);
      const ackKey = `${uid}_${hashId}`;
      const set = this.pendingAcks.get(ackKey);
      if (set) {
        set.forEach((cb) => cb(true));
      }
      return;
    }

    // sending ACK back if P2P message or directed broadcast
    const incomingSessionId = data.topic || data.sessionId;
    if (uid && uid !== this.authInfo?.userId && (!data.broadcast || incomingSessionId === this.authInfo?.userId)) {
      try {
        const msgBytes = new TextEncoder().encode(messageStr);
        const hashId = Array.from(msgBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
        const ackStr = `__DC_ACK__:${hashId}`;

        const sessionId = incomingSessionId || this.authInfo?.userId;
        // 就绪守卫：仅在主连接可用时回 ACK；首发失败（如 session is not ready）时短暂等待后静默重试一次
        if (this.userBoxOps && this.userBoxOps.client && sessionId) {
          const ackBytes = new TextEncoder().encode(ackStr);
          try {
            await this.userBoxOps.publish(sessionId, ackBytes);
          } catch (firstErr) {
            await new Promise(res => setTimeout(res, 300));
            if (this.userBoxOps && this.userBoxOps.client) {
              await this.userBoxOps.publish(sessionId, ackBytes);
            }
          }
        }
      } catch(e) {}
    }

    // For any userBox instance listeners mounted outside
    if (this.userBoxOps && op === this.userBoxOps) {
      this.userBoxOps.emit('__RTM_BUBBLE_MSG', data);
    }
  }

  private startMaintainTask() {
    if (this.maintainTimer) clearInterval(this.maintainTimer);
    this.maintainTimer = setInterval(async () => {
      const now = Date.now();
      const threshold = 20 * 1000;
      
      if (this.userBoxOps && this.mainTokenExpireAt && (this.mainTokenExpireAt - now <= threshold)) {
        this.mainTokenExpireAt = now + 60000;
        try {
          const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
            channelId: this.authInfo!.userId,
            userId: this.authInfo!.userId,
            appId: this.authInfo!.appId,
            themeAuthor: this.authInfo!.themeAuthor,
            configTheme: this.authInfo!.configTheme,
            serviceName: this.authInfo!.serviceName,
            forceRefresh: true
          });
          if (!err && authRes && authRes.token) {
            this.authInfo!.token = authRes.token;
            if (authRes.serviceAppId) this.authInfo!.rtcAppId = authRes.serviceAppId;
            this.mainTokenExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
            await this.userBoxOps.reconnect(this.authInfo!);
          }
        } catch(e) {}
      }
    }, 5000);
  }

  private stopMaintainTask() {
    if (this.maintainTimer) {
      clearInterval(this.maintainTimer);
      this.maintainTimer = null;
    }
  }

  /**
   * 获取发往 targetUserId 所需的动态 token（带本地缓存）。
   * 命中有效缓存直接返回；否则向 aiproxy 请求并按 expiresAt 缓存。
   */
  private async getTransientToken(targetUserId: string): Promise<string> {
    const cached = this.transientTokenCache.get(targetUserId);
    if (cached && cached.expireAt - Date.now() > RTMModule.TOKEN_SAFETY_MS) {
      return cached.token;
    }

    if (!(this.context as any)?.aiproxy || !this.authInfo?.themeAuthor) {
      throw new Error('Native config properties required to generate dynamic tokens for transient sending.');
    }

    const transientUserId = this.authInfo.userId + "_s";
    try {
      const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
        channelId: targetUserId,
        userId: transientUserId,
        appId: this.authInfo.appId,
        themeAuthor: this.authInfo.themeAuthor,
        configTheme: this.authInfo.configTheme,
        serviceName: this.authInfo.serviceName,
        forceRefresh: true
      });
      if (err || !authRes || !authRes.token) throw err || new Error("empty response");
      const expireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + RTMModule.TOKEN_DEFAULT_TTL_MS);
      this.transientTokenCache.set(targetUserId, { token: authRes.token, rtcAppId: authRes.serviceAppId, expireAt });
      return authRes.token;
    } catch (e: any) {
      throw new Error(`[RTM] Auto-fetch auth info for sending transient message failed: ${e.message}`);
    }
  }

  /** 释放并断开某目标的池化临时连接 */
  private dropTransientOp(targetUserId: string): void {
    const entry = this.transientOps.get(targetUserId);
    if (!entry) return;
    this.transientOps.delete(targetUserId);
    if (entry.idleTimer) clearTimeout(entry.idleTimer);
    entry.op.disconnect().catch(() => {});
  }

  /** 重置某目标临时连接的空闲断开计时 */
  private touchTransientOp(targetUserId: string): void {
    const entry = this.transientOps.get(targetUserId);
    if (!entry) return;
    if (entry.idleTimer) clearTimeout(entry.idleTimer);
    entry.idleTimer = setTimeout(() => {
      this.dropTransientOp(targetUserId);
    }, RTMModule.TRANSIENT_IDLE_MS);
  }

  /**
   * 获取（或建立）到 targetUserId 的池化临时连接。
   * 连接始终以非静默模式建立（注册监听），保证等 ACK / 收 PONG 均可用。
   */
  private async acquireTransientOp(targetUserId: string): Promise<AliyunRTMOperations> {
    // logout 竞态守卫：登出后在途/排队中的发送直接失败，避免用空认证信息建连
    if (!this.authInfo) throw new Error('Not logged in');
    const existing = this.transientOps.get(targetUserId);
    if (existing && existing.op.client) {
      // 复用期间先解除空闲断开计时，避免发送/等 ACK 途中被计时器断连；发送结束后由 touchTransientOp 重新计时
      if (existing.idleTimer) {
        clearTimeout(existing.idleTimer);
        existing.idleTimer = null;
      }
      return existing.op;
    }
    if (existing) this.dropTransientOp(targetUserId);

    const token = await this.getTransientToken(targetUserId);
    const channelAuthInfo = { ...this.authInfo!, sessionId: targetUserId, token, userId: this.authInfo!.userId + "_s" };
    const op = new AliyunRTMOperations();
    await op.connect(channelAuthInfo, targetUserId);
    this.transientOps.set(targetUserId, { op, idleTimer: null });
    return op;
  }

  /**
   * 发送瞬时点对点消息。同一目标串行排队，避免并发建连/发布相互竞争；
   * 不同目标之间互不影响。
   */
  private async sendTransientMessage(targetUserId: string, payload: Uint8Array | string, waitAckStr?: string | boolean): Promise<boolean> {
    if (!this.authInfo) throw new Error('Not logged in');

    let waitAckHash: string | undefined;
    if (waitAckStr === undefined || waitAckStr === true) {
        const payloadBytes = typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;
        waitAckHash = Array.from(payloadBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
    } else if (typeof waitAckStr === 'string' && waitAckStr !== "") {
        waitAckHash = waitAckStr;
    }

    const prev = this.transientSendQueues.get(targetUserId) || Promise.resolve(true);
    const task = prev.catch(() => false).then(() => this.doSendTransient(targetUserId, payload, waitAckHash));
    this.transientSendQueues.set(targetUserId, task);
    try {
      return await task;
    } finally {
      if (this.transientSendQueues.get(targetUserId) === task) {
        this.transientSendQueues.delete(targetUserId);
      }
    }
  }

  /** 实际的瞬时发送：复用池化连接；失败时失效缓存并重试一次（闭环自愈） */
  private async doSendTransient(targetUserId: string, payload: Uint8Array | string, waitAckHash?: string, isRetry: boolean = false): Promise<boolean> {
    let op: AliyunRTMOperations;
    try {
      op = await this.acquireTransientOp(targetUserId);
    } catch (e: any) {
      // 建连失败可能因缓存 token 已失效：失效缓存后重试一次；token 拉取本身失败则按原行为抛出
      this.transientTokenCache.delete(targetUserId);
      if (!isRetry && !String(e?.message).includes('Auto-fetch auth info')) {
        return this.doSendTransient(targetUserId, payload, waitAckHash, true);
      }
      throw e;
    }

    try {
      let ackPromise: Promise<boolean> | null = null;
      if (waitAckHash) {
          ackPromise = new Promise<boolean>((resolve) => {
              let done = false;
              const ackListener = (msg: IRTMMessageReceivedPayload) => {
                  if (done) return;
                  if (msg.message === `__DC_ACK__:${waitAckHash}` && msg.publisher == targetUserId) {
                      done = true;
                      clearTimeout(timeout);
                      op.off('onMessageReceived', ackListener);
                      resolve(true);
                  }
              };
              const timeout = setTimeout(() => {
                  done = true;
                  op.off('onMessageReceived', ackListener);
                  resolve(false);
              }, 3000);
              op.on('onMessageReceived', ackListener);
          });
      }

      await op.publish(targetUserId, payload);

      if (ackPromise) {
          return await ackPromise;
      }
      // 连接池化后不再立即断开，无需为消息落地等待 800ms
      return true;
    } catch (e: any) {
      // 发布失败：连接可能已失效（token 过期/断线）。丢弃连接与缓存后重试一次
      this.dropTransientOp(targetUserId);
      this.transientTokenCache.delete(targetUserId);
      if (!isRetry) {
        return this.doSendTransient(targetUserId, payload, waitAckHash, true);
      }
      console.error("[RTM] sendTransientMessage failed: ", e.message);
      return false;
    } finally {
      this.touchTransientOp(targetUserId);
    }
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = true, sendOffline: boolean = false): Promise<'success' | 'offline' | 'failed'> {
    if (!this.authInfo) throw new Error('Not logged in');

    const encoder = new TextEncoder();
    const encodedMsg = encoder.encode(message);

    if (!requireAck) {
        const res = await this.sendTransientMessage(userId, encodedMsg, false);
        return res ? 'success' : 'failed';
    }

    const msgHash = Array.from(encodedMsg.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
    const ackKey = `${userId}_${msgHash}`;

    return new Promise<'success' | 'offline' | 'failed'>(async (resolve, reject) => {
      let timeoutId: any;
      let isDone = false;

      const finish = async (success: boolean, err?: Error) => {
        if (isDone) return;
        isDone = true;
        if (timeoutId) clearTimeout(timeoutId);
        
        const set = this.pendingAcks.get(ackKey);
        if (set) {
          set.delete(finish as any);
          if (set.size === 0) this.pendingAcks.delete(ackKey);
        }

        if (success) {
          resolve('success');
        } else {
            // failed
            if (sendOffline) {
              const dc = this.context as any;
              if (dc && dc.message) {
                try {
                  await dc.message.sendMsgToUserBox(userId, message);
                  resolve('offline');
                } catch(err2: any) {
                  console.error("Fallback offline message box failed: " + err2.message);
                  resolve('failed');
                }
              } else {
                console.error("Message module not available for offline sending");
                resolve('failed');
              }
            } else {
              if (err) console.error("Message ACK timed out or peer offline: ", err.message);
              resolve('failed');
            }
        }
      };

      if (!this.pendingAcks.has(ackKey)) this.pendingAcks.set(ackKey, new Set());
      this.pendingAcks.get(ackKey)!.add(finish as any);

      // 挂起守卫：真正的 ACK 等待（3s）在 sendTransientMessage 内部完成；
      // 同目标发送会串行排队，外层若仍用 3s 会在排队阶段误判超时并可能触发离线兜底造成重复投递，
      // 故这里只作防死挂的兜底保护
      timeoutId = setTimeout(() => {
        finish(false);
      }, 15000);

      try {
        const success = await this.sendTransientMessage(userId, encodedMsg);
        finish(success);
      } catch (e: any) {
        finish(false, e);
      }
    });
  }

  public async queryPeerOnlineStatus(userId: string): Promise<boolean> {
    if (!this.authInfo) return false;
    
    return new Promise(async (resolve) => {
      let timeoutId: any;
      let isDone = false;

      const finish = (online: boolean) => {
        if (isDone) return;
        isDone = true;
        if (timeoutId) clearTimeout(timeoutId);
        
        const set = this.pendingPings.get(userId);
        if (set) {
          set.delete(finish);
          if (set.size === 0) this.pendingPings.delete(userId);
        }
        resolve(online);
      };

      if (!this.pendingPings.has(userId)) this.pendingPings.set(userId, new Set());
      this.pendingPings.get(userId)!.add(finish);

      try {
        const encodedPing = new TextEncoder().encode('__DC_PING__');
        const sent = await this.sendTransientMessage(userId, encodedPing, false);
        if (!sent) {
          finish(false);
          return;
        }
        // PING 已真正发出（排队结束）后才开始等 PONG，避免排队耗时吃掉等待窗口
        if (!isDone) {
          timeoutId = setTimeout(() => { finish(false); }, 3000);
        }
      } catch (e) {
        finish(false);
      }
    });
  }

  public on<E extends RTMEventName>(event: E, callback: (payload: RTMEventPayloadMap[E]) => void): void;
  public on(event: string, callback: RTMGenericEventCallback): void;
  public on(event: string, callback: RTMGenericEventCallback): void {
    const targetEvent = event === 'onMessageReceived' ? '__RTM_BUBBLE_MSG' : event;
    if (!this._proxyListeners) this._proxyListeners = new Map();
    if (!this._proxyListeners.has(targetEvent)) this._proxyListeners.set(targetEvent, new Set());
    this._proxyListeners.get(targetEvent)!.add(callback);

    if (this.userBoxOps) {
        this.userBoxOps.on(targetEvent, callback);
    }
  }

  public off<E extends RTMEventName>(event: E, callback: (payload: RTMEventPayloadMap[E]) => void): void;
  public off(event: string, callback: RTMGenericEventCallback): void;
  public off(event: string, callback: RTMGenericEventCallback): void {
    const targetEvent = event === 'onMessageReceived' ? '__RTM_BUBBLE_MSG' : event;
    if (this._proxyListeners && this._proxyListeners.has(targetEvent)) {
      this._proxyListeners.get(targetEvent)!.delete(callback);
    }

    if (this.userBoxOps) {
        this.userBoxOps.off(targetEvent, callback);
    }
  }
}
