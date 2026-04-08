import { IRTMMetadata, IRTMAuthInfo, IRTMOperations } from '../../interfaces/rtm-interface';

export class AliyunRTMOperations implements IRTMOperations {
  private rtcClient: any = null;
  private rtmInstance: any = null;
  private authInfo: IRTMAuthInfo | null = null;
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  constructor() {
    this.rtmInstance = null;
    this.rtcClient = null;
  }

  public async login(authInfo: IRTMAuthInfo): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('RTM is typically supported in a browser context for this demo SDK.');
      return;
    }
    
    try {
      this.authInfo = authInfo;
      
      let DingRTC, RTMManager;
      if (typeof require !== 'undefined') {
        try {
          DingRTC = require('dingrtc').default || require('dingrtc');
        } catch (e) {
          DingRTC = (window as any).DingRTC;
        }
        try {
          RTMManager = require('@dingrtc/rtm').default || require('@dingrtc/rtm');
        } catch (e) {
          RTMManager = (window as any).RTM?.default || (window as any).RTM || (window as any).AliyunRTM;
        }
      } else {
        DingRTC = (window as any).DingRTC?.default || (window as any).DingRTC;
        RTMManager = (window as any).RTM?.default || (window as any).RTM || (window as any).AliyunRTM;
      }
      
      if (!RTMManager) {
        throw new Error('@dingrtc/rtm SDK is missing. Please ensure it is installed or available via window object.');
      }
      
      this.rtmInstance = new RTMManager();
      
      const joinOptions = {
        appId: authInfo.appId,
        userName: authInfo.userId, 
        channel: authInfo.channelId || 'default', 
        uid: authInfo.userId,
        token: authInfo.token
      };

      if (DingRTC) {
        // 配合 dingrtc 使用
        this.rtcClient = DingRTC.createClient();
        if (typeof this.rtcClient.register === 'function') {
          this.rtcClient.register(this.rtmInstance);
        }
        await this.rtcClient.join(joinOptions);
      } else {
        // 独立使用 rtm
        await this.rtmInstance.join(joinOptions);
      }
      
      this.registerSDKListeners();
    } catch (error) {
      console.error('Failed to init Aliyun RTM/RTC SDK', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    if (this.rtcClient) {
      if (typeof this.rtcClient.leave === 'function') {
        try {
          await this.rtcClient.leave();
        } catch (e) {
          console.warn('Error leaving rtc channel', e);
        }
      }
      this.rtcClient = null;
    } else if (this.rtmInstance) {
      // 独立使用场景尝试断开连接
      if (typeof this.rtmInstance.leave === 'function') {
        try {
          await this.rtmInstance.leave();
        } catch (e) {
          console.warn('Error leaving rtm independent session', e);
        }
      }
    }
    if (this.rtmInstance) {
      this.rtmInstance = null;
    }
    this.eventListeners.clear();
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = false): Promise<void> {
    if (!this.rtmInstance) throw new Error('RTM instance not initialized.');
    const sessionId = this.authInfo?.channelId || 'default';
    const encoder = new TextEncoder();
    const encodedMsg = encoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Warning: RTM message length exceeds 4KB limit and may be lost.');
    }
    await this.rtmInstance.publish(sessionId, encodedMsg, userId);
  }

  public async subscribeChannel(channelId: string): Promise<void> {
    if (!this.rtmInstance) throw new Error('RTM instance not initialized.');
    if (this.authInfo) {
      this.authInfo.channelId = channelId;
    }
    await this.rtmInstance.joinSession(channelId);
  }

  public async unsubscribeChannel(channelId: string): Promise<void> {
    if (!this.rtmInstance) throw new Error('RTM instance not initialized.');
    if (typeof this.rtmInstance.leaveSession === 'function') {
      this.rtmInstance.leaveSession(channelId);
    }
  }

  public async sendMessageToChannel(channelId: string, message: string): Promise<void> {
    if (!this.rtmInstance) throw new Error('RTM instance not initialized.');
    const encoder = new TextEncoder();
    const encodedMsg = encoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Warning: RTM message length exceeds 4KB limit and may be lost.');
    }
    await this.rtmInstance.publish(channelId, encodedMsg);
  }

  public async queryPeerOnlineStatus(userId: string): Promise<boolean> {
    if (!this.rtmInstance) throw new Error('RTM instance not initialized.');
    return false;
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

  private registerSDKListeners() {
    if (!this.rtmInstance) return;

    this.rtmInstance.on('message', (data: any) => {
      const { message, uid, sessionId, broadcast } = data;
      const decoder = new TextDecoder();
      const msgStr = decoder.decode(message);
      this.emit('onMessageReceived', {
        message: msgStr,
        userId: uid,
        channelId: sessionId,
        broadcast
      });
    });

    // 独立使用时关注，若与 dingrtc 配合使用则无需关注该事件在 rtm 上的绑定，这里保留以便外层知晓状态
    this.rtmInstance.on('connection-state-changed', (currState: any, prevState: any, reason: any) => {
      this.emit('onConnectionStateChanged', { currState, prevState, reason });
    });
    
    // 如果跟 dingrtc 配合使用，也可以把 RTC client 上的断开事件抛出去
    if (this.rtcClient) {
      // 部分版本可能有区别，这里做个安全的事件监听
      try {
        this.rtcClient.on('connection-state-change', (currState: any, prevState: any, reason: any) => {
          this.emit('onConnectionStateChanged', { currState, prevState, reason });
        });
      } catch (e) {
        console.warn('Could not bind rtcClient connection-state-change event', e);
      }
    }
    
    this.rtmInstance.on('session-add', (session: any) => this.emit('onSessionAdd', session));
    this.rtmInstance.on('session-remove', (session: any) => this.emit('onSessionRemove', session));
    this.rtmInstance.on('session-user-join', (sessionId: string, uid: string) => this.emit('onSessionUserJoin', { sessionId, uid }));
    this.rtmInstance.on('session-user-left', (sessionId: string, uid: string) => this.emit('onSessionUserLeft', { sessionId, uid }));
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
}
