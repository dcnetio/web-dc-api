import { IRTMMetadata, IRTMAuthInfo } from '../../interfaces/rtm-interface';
import RTM from '@dingrtc/rtm';

export class AliyunRTMOperations {
  public client: any = null;
  public authInfo: IRTMAuthInfo | null = null;
  public sessionId: string | null = null;
  public channelId: string | null = null;
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();
  public sessionUsersMap: Map<string, Set<string>> = new Map();

  constructor() {
    this.client = null;
  }

  public async connect(authInfo: IRTMAuthInfo, sessionId: string, silent: boolean = false): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('RTM is typically supported in a browser context for this demo SDK.');
      return;
    }
    
    this.authInfo = authInfo;
    this.sessionId = sessionId;
    this.channelId = sessionId;
    
    const RTMEngine = (RTM as any).default || RTM;
    
    if (!RTMEngine) {
      throw new Error('@dingrtc/rtm SDK is missing. Please ensure it is installed.');
    }
    
    // 强制静态拦截所有 Logger
    if (RTMEngine.Logger) {
       RTMEngine.Logger.enableUpload = false;
       if (typeof RTMEngine.Logger.disableUpload === 'function') RTMEngine.Logger.disableUpload();
       if (typeof RTMEngine.Logger.setLogLevel === 'function') RTMEngine.Logger.setLogLevel('error');
    }

    
    // 原生拦截对阿里云日志的拉取/推送请求
    if (typeof window !== 'undefined' && !(window as any)._dc_rtm_patched) {
      (window as any)._dc_rtm_patched = true;
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && (args[0] as any).url ? (args[0] as any).url : '');
        if (url && (url.includes('log.aliyuncs.com/logstores') || url.includes('.aliyuncs.com'))) {
          // Mock successful empty response to prevent errors
          return new Response(JSON.stringify({}), {
             status: 200, 
             headers: { 'Content-Type': 'application/json' }
          });
        }
        return originalFetch.apply(window, args as any);
      };
    }
  
    this.client = new RTMEngine();
    // 尝试禁用 Aliyun RTM 内部的强制日志上报，避免浏览器抛出跨域/拦截错误
    if (this.client.logger && typeof this.client.logger.disableUpload === 'function') {
      this.client.logger.disableUpload();
    }
    if (this.client.setLogLevel) {
      this.client.setLogLevel('error');
    }
    if (RTMEngine.enableUploadLog) {
      RTMEngine.enableUploadLog = false;
    }
    if (RTMEngine.Logger && typeof RTMEngine.Logger.disableUpload === 'function') {
      RTMEngine.Logger.disableUpload();
    }
    try {
      if (typeof this.client.leave === 'function') {
        await this.client.leave();
      }
    } catch(e) {}
    
    const joinOptions = {
      appId: authInfo.rtcAppId || authInfo.appId,
      userName: authInfo.userId, 
      channel: this.channelId , 
      uid: authInfo.userId,
      token: authInfo.token
    };

    try {
      await this.client.join(joinOptions);
    } catch (joinErr: any) {
      if (joinErr?.message?.includes('already ready') || String(joinErr).includes('already')) {
        console.warn(`[RTM] instance join: channel ${this.channelId} is already ready.`);
      } else {
        throw joinErr;
      }
    }

    if (!silent) {
      this.registerSDKListeners(this.client);
    }

    try {
      if (typeof this.client.joinSession === 'function') {
        await this.client.joinSession(this.sessionId);
      } else if (typeof this.client.subscribe === 'function') {
        await this.client.subscribe({ topic: this.sessionId });
      }
    } catch (err: any) {
      console.warn('[RTM] instance joinSession/subscribe error', err);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      if (typeof this.client.leave === 'function') {
        try { 
          const res = this.client.leave();
          if (res && res.catch) res.catch(()=>{});
        } catch (e) {}
      }
      this.client = null;
    }
    this.eventListeners.clear();
  }

  public async reconnect(newAuthInfo?: IRTMAuthInfo): Promise<void> {
    if (newAuthInfo) {
      this.authInfo = newAuthInfo;
    }
    if (!this.authInfo || !this.channelId) {
      throw new Error('Missing authInfo or channelId for reconnect.');
    }
    if (this.client) {
      if (typeof this.client.leave === 'function') {
        try {
          await this.client.leave();
        } catch(e) {}
      }
      this.client = null;
    }
    await this.connect(this.authInfo, this.channelId);
  }

  public async publish(sessionId: string, message: string | Uint8Array, originalTargetId?: string): Promise<void> {
    if (!this.client) throw new Error('RTM instance not initialized.');
    const encodedMsg = typeof message === 'string' ? new TextEncoder().encode(message) : message;
    if (encodedMsg.length > 4096) {
      console.warn('Warning: RTM message length exceeds 4KB limit and may be lost.');
    }

    try {
      if (typeof this.client.joinSession === 'function') {
        const sessions = typeof this.client.sessions === 'function' ? this.client.sessions() : this.client.sessions;
        let targetSess = Array.isArray(sessions) 
          ? sessions.find((s: any) => s.id === sessionId || s.sessionId === sessionId || s.channel === sessionId)
          : sessions?.has?.(sessionId);
        
        if (!targetSess) {
            targetSess = await this.client.joinSession(sessionId);
        }
        
        if (!targetSess && this.client.sessions) {
          const freshSessions = typeof this.client.sessions === 'function' ? this.client.sessions() : this.client.sessions;
          targetSess = Array.isArray(freshSessions) ? freshSessions.find((s: any) => s.id === sessionId) : freshSessions?.get?.(sessionId);
        }
      } else if (typeof this.client.subscribe === 'function') {
        await this.client.subscribe({ topic: sessionId }).catch(() => {});
      }
    } catch(e) {
      console.warn("RTM joinSession pre-check warn:", e);
    }

    if (typeof this.client.publish === 'function' && this.client.publish.length > 1) {
      if (originalTargetId) {
        await this.client.publish(sessionId, encodedMsg, originalTargetId);
      } else {
        await this.client.publish(sessionId, encodedMsg); 
      }
    } else {
      await this.client.publish({ topic: sessionId, message: encodedMsg });
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    const callbacks = this.eventListeners.get(event);
    if (!callbacks) return;
    const idx = callbacks.indexOf(callback);
    if (idx > -1) {
      callbacks.splice(idx, 1);
    }
  }

  private registerSDKListeners(instance: any) {
    if (!instance) return;

    instance.on('message', async (data: any) => {
      // console.log('--- RTM MESSAGE ARRIVED ---', data);
      const message = data.message || data.messageData || data.data;
      const broadcast = data.broadcast;
      let uid = data.uid || data.publisher || data.userId || data.fromUser || data.senderId;
      if (uid.includes('_')) {
        uid = uid.split('_')[0]; // 提取出真的uid
      }
      const sessionId = data.sessionId || data.topic || data.sessionId;
      
      let msgStr = '';
      if (message instanceof Uint8Array || message instanceof ArrayBuffer) {
        msgStr = new TextDecoder().decode(message);
      } else if (typeof message === 'object' && message !== null) {
        msgStr = JSON.stringify(message);
      } else {
        msgStr = String(message);
      }

      this.emit('onMessageReceived', {
        message: msgStr,
        userId: uid,
        publisher: uid,
        sessionId: sessionId,
        topic: sessionId,
        broadcast,
        channelId: this.channelId
      });
    });

    instance.on('connection-state-change', (currState: any, prevState: any, reason: any) => {
      this.emit('onConnectionStateChanged', { currState, prevState, reason, channelId: this.channelId });
    });
    
    instance.on('session-add', (session: any) => {
      if (session) {
        const sid = session.sid || session.sessionId || session.channel || session.id;
        const users = session.users || session.members || [];
        if (sid) {
          const userSet = this.sessionUsersMap.get(sid) || new Set<string>();
          users.forEach((u: any) => {
            const uid = (typeof u === 'string') ? u : (u.uid || u.userId || u.id);
            if (uid) userSet.add(uid);
          });
          this.sessionUsersMap.set(sid, userSet);
        }
      }
      this.emit('onSessionAdd', session);
    });
    instance.on('session-remove', (session: any) => {
      if (session) {
        const sid = session.sid || session.sessionId || session.channel || session.id;
        if (sid) {
          this.sessionUsersMap.delete(sid);
        }
      }
      this.emit('onSessionRemove', session);
    });
    instance.on('session-user-join', (sessionId: string, uid: string) => {
      if (!this.sessionUsersMap.has(sessionId)) {
        this.sessionUsersMap.set(sessionId, new Set());
      }
      this.sessionUsersMap.get(sessionId)!.add(uid);
      this.emit('onSessionUserJoin', { sessionId, uid });
    });
    instance.on('session-user-left', (sessionId: string, uid: string) => {
      if (this.sessionUsersMap.has(sessionId)) {
        this.sessionUsersMap.get(sessionId)!.delete(uid);
      }
      this.emit('onSessionUserLeft', { sessionId, uid });
    });
  }

  public emit(event: string, ...args: any[]) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
}
