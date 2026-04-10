import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTMAuthInfo, IRTMOperations, IRTMStandardMessage } from '../interfaces/rtm-interface';
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
  private _proxyListeners: Map<string, Set<(...args: any[]) => void>> = new Map();

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
    this.authInfo = {
      ...authInfo,
      rtcAppId: authInfo.rtcAppId || this.context?.appInfo?.rtcAppId,
      appId: authInfo.appId || this.context?.appInfo?.appId || ""
    };
    
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
        this.mainTokenExpireAt = authRes.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
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
    this.authInfo = null;
    this.stopMaintainTask();
  }

  private registerOpListeners(op: AliyunRTMOperations) {
    op.on('onMessageReceived', (msg: any) => this.handleMessage(op, msg));
  }

  private async handleMessage(op: AliyunRTMOperations, data: any) {
    const messageStr = data.message;
    let uid = data.userId;

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
         set.forEach((cb: any) => cb(true));
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
        if (this.userBoxOps && sessionId) {
          await this.userBoxOps.publish(sessionId, new TextEncoder().encode(ackStr));
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
            this.mainTokenExpireAt = authRes.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
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

  private async sendTransientMessage(targetUserId: string, payload: Uint8Array | string, waitAckStr?: string | boolean): Promise<boolean> {
    if (!this.authInfo) throw new Error('Not logged in');
    
    let waitAckHash: string | undefined;
    if (waitAckStr === undefined || waitAckStr === true) {
        const payloadBytes = typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;
        waitAckHash = Array.from(payloadBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
    } else if (typeof waitAckStr === 'string' && waitAckStr !== "") {
        waitAckHash = waitAckStr;
    }
    const transientUserId = this.authInfo.userId + "_s";
    
    let token = '';
    if ((this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
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
        token = authRes.token;
      } catch (e: any) {
        throw new Error(`[RTM] Auto-fetch auth info for sending transient message failed: ${e.message}`);
      }
    } else {
      throw new Error('Native config properties required to generate dynamic tokens for transient sending.');
    }

    const channelAuthInfo = { ...this.authInfo, sessionId: targetUserId, token, userId: transientUserId };
    const tempOp = new AliyunRTMOperations();
    
    try {
      // 如果需要等ack，则建连时不能完全静默，需要监听以接收回执
      await tempOp.connect(channelAuthInfo, targetUserId, !waitAckHash);
      
      let ackPromise: Promise<boolean> | null = null;
      if (waitAckHash) {
          ackPromise = new Promise<boolean>((resolve) => {
              let done = false;
              const timeout = setTimeout(() => { done = true; resolve(false); }, 3000);
              tempOp.on('onMessageReceived', (msg: any) => {
                  if (done) return;
                  if (msg.message === `__DC_ACK__:${waitAckHash}` && msg.publisher == targetUserId) {
                      done = true;
                      clearTimeout(timeout);
                      resolve(true);
                  }
              });
          });
      }

      await tempOp.publish(targetUserId, payload);
      
      if (ackPromise) {
          return await ackPromise;
      } else {
          await new Promise(res => setTimeout(res, 800));
          return true;
      }
    } catch (e: any) {
      console.error("[RTM] sendTransientMessage failed: ", e.message);
      return false;
    } finally {
      await tempOp.disconnect();
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

      timeoutId = setTimeout(() => {
        finish(false);
      }, 3000);

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

      timeoutId = setTimeout(() => { finish(false); }, 3000);

      try {
        const encodedPing = new TextEncoder().encode('__DC_PING__');
        await this.sendTransientMessage(userId, encodedPing, false);
      } catch (e) {
        finish(false);
      }
    });
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    const targetEvent = event === 'onMessageReceived' ? '__RTM_BUBBLE_MSG' : event;
    if (!this._proxyListeners) this._proxyListeners = new Map();
    if (!this._proxyListeners.has(targetEvent)) this._proxyListeners.set(targetEvent, new Set());
    this._proxyListeners.get(targetEvent)!.add(callback);

    if (this.userBoxOps) {
        this.userBoxOps.on(targetEvent, callback);
    }
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    const targetEvent = event === 'onMessageReceived' ? '__RTM_BUBBLE_MSG' : event;
    if (this._proxyListeners && this._proxyListeners.has(targetEvent)) {
      this._proxyListeners.get(targetEvent)!.delete(callback);
    }

    if (this.userBoxOps) {
        this.userBoxOps.off(targetEvent, callback);
    }
  }
}
