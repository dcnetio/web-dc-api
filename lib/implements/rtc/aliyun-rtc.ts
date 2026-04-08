import { IRTCOperations, IRTCAuthInfo, IRTCMember, IRTCStreamConfig } from '../../interfaces/rtc-interface';

export class AliyunRTCOperations implements IRTCOperations {
  private rtcClient: any = null;
  private rtmClient: any = null;
  private textEncoder: TextEncoder;
  private textDecoder: TextDecoder;
  private cameraTrack: any = null;
  private micTrack: any = null;
  private authInfo: IRTCAuthInfo | null = null;
  private currentToken: string = '';
  private authExpiresAtMs: number | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  private isMcuSubscribed: boolean = false;
  private remoteVideoTracks: Map<string, any> = new Map();
  private mcuAudioTrack: any = null;
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  constructor() {
    this.rtcClient = null;
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
  }

  private async fetchAndStoreAuthInfo(forceRefresh: boolean = false): Promise<string> {
    if (!this.authInfo) throw new Error('Missing auth info');

    if (this.authInfo.fetchAuthInfo) {
      const res = await this.authInfo.fetchAuthInfo(forceRefresh);
      this.currentToken = res.token;
      if (res.expiresAt) {
        this.authExpiresAtMs = res.expiresAt * 1000; // expiresAt 是秒级时间戳，转换为毫秒
      } else {
        this.authExpiresAtMs = null;
      }
      this.scheduleRefresh();
      return this.currentToken;
    } else if (this.authInfo.token) {
      // 兼容旧的固定 token 传递方式
      this.currentToken = this.authInfo.token;
      return this.currentToken;
    } else {
      throw new Error('Neither token nor fetchAuthInfo is provided in authInfo');
    }
  }

  private scheduleRefresh() {
    if (!this.authExpiresAtMs) return;

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    const refreshBeforeMs = 30 * 1000; // 提前 30 秒刷新
    const delayMs = Math.max(this.authExpiresAtMs - Date.now() - refreshBeforeMs, 1000);

    this.refreshTimer = setTimeout(async () => {
      try {
        await this.fetchAndStoreAuthInfo(true);
        // 如果房间仍在且 token 变化，部分 SDK 可能支持更新未过期的 token; 或需要断线重连，这取决于 DingRTC SDK 是否有 updateToken
        if (this.rtcClient && this.currentToken) {
          // 这个动作依据 SDK 是否存在更新 token 函数为主
          // 例如可能存在 client.renewToken(this.currentToken) 等等，这里做下异常安全
        }
      } catch (err) {
        console.error('Failed to auto refresh RTC token', err);
        this.scheduleRefresh(); // 重试
      }
    }, delayMs);
  }

  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('RTC is only supported in browser environment.');
      return;
    }

    try {
      this.authInfo = authInfo;
      
      let DingRTC;
      if (typeof require !== 'undefined') {
        try {
          DingRTC = require('dingrtc').default || require('dingrtc');
        } catch (e) {
          DingRTC = (window as any).DingRTC;
        }
      } else {
        DingRTC = (window as any).DingRTC;
      }
      
      if (!DingRTC) {
        throw new Error('DingRTC SDK is not fully loaded. Ensure it is installed or included globally.');
      }
      
      // 创建客户端实例
      const RTCEngine = DingRTC.default || DingRTC;
      this.rtcClient = RTCEngine.createClient();

      if (this.authInfo?.enableRTM) {
        let RTM;
        if (typeof require !== 'undefined') {
          try {
            RTM = require('@dingrtc/rtm').default || require('@dingrtc/rtm');
          } catch (e) {
            RTM = (window as any).RTM?.default || (window as any).RTM || (window as any).AliyunRTM;
          }
        } else {
          RTM = (window as any).RTM?.default || (window as any).RTM || (window as any).AliyunRTM;
        }

        if (RTM) {
          // 复用 RTC 连接来初始化 RTM Client
          if (typeof RTM.createClient === 'function') {
            this.rtmClient = RTM.createClient({ rtcClient: this.rtcClient });
          } else {
            this.rtmClient = new RTM({});
            if (typeof this.rtcClient.register === 'function') {
              this.rtcClient.register(this.rtmClient);
            } else if (typeof this.rtmClient.attach === 'function') {
              this.rtmClient.attach(this.rtcClient);
            }
          }
          this.registerRTMListeners();
        } else {
          console.warn('@dingrtc/rtm not found. RTM features will be disabled.');
        }
      }

      this.registerSDKListeners();
    } catch (error) {
      console.error('Failed to init DingRTC Web SDK', error);
      throw error;
    }
  }

  public async joinChannel(): Promise<void> {
    if (!this.rtcClient || !this.authInfo) throw new Error('RTC instance or auth info is missing');
    
    // 如果存在动态 fetch 配置则先请求获取并更新 this.currentToken
    if (this.authInfo.fetchAuthInfo) {
      await this.fetchAndStoreAuthInfo();
    } else {
      this.currentToken = this.authInfo.token || '';
    }

    const { channelId, userId, appId } = this.authInfo;
    
    await this.rtcClient.join({
      appId: appId,
      userName: userId, 
      channel: channelId,
      uid: userId,
      token: this.currentToken,
    });

    // 如果开启了 RTM，则在加入 RTC 后订阅对应的话题（个人频道 + 公共频道）以接收消息
    if (this.rtmClient) {
      try {
        if (typeof this.rtmClient.subscribe === 'function') {
          await this.rtmClient.subscribe({ topic: userId });
          await this.rtmClient.subscribe({ topic: channelId });
        } else if (typeof this.rtmClient.joinSession === 'function') {
          await this.rtmClient.joinSession(channelId);
        }
      } catch (err) {
        console.warn('Aliyun RTM: Failed to subscribe primary topics', err);
      }
    }
    
    // 创建音视频轨道 (只在加入前/后创建，由上层通过 Mute 控制是否真的发布)
    let DingRTC;
    if (typeof require !== 'undefined') {
      try {
        DingRTC = require('dingrtc').default || require('dingrtc');
      } catch (e) {
        DingRTC = (window as any).DingRTC;
      }
    } else {
      DingRTC = (window as any).DingRTC;
    }
    const RTCEngine = DingRTC.default || DingRTC;

    this.cameraTrack = await RTCEngine.createCameraVideoTrack({
      frameRate: 15,
      dimension: 'VD_1280x720',
    });
    this.micTrack = await RTCEngine.createMicrophoneAudioTrack();

    // 默认尝试发布音视频轨道
    await this.rtcClient.publish([this.cameraTrack, this.micTrack]);
  }

  public async leaveChannel(): Promise<void> {
    if (this.rtmClient && this.authInfo) {
      try {
        if (typeof this.rtmClient.unsubscribe === 'function') {
          await this.rtmClient.unsubscribe({ topic: this.authInfo.userId });
          await this.rtmClient.unsubscribe({ topic: this.authInfo.channelId });
        } else if (typeof this.rtmClient.leaveSession === 'function') {
          if (this.authInfo.channelId) {
            await this.rtmClient.leaveSession(this.authInfo.channelId);
          }
        }
      } catch (err) {
        console.warn('Aliyun RTM: Failed to unsubscribe primary topics', err);
      }
    }
    if (this.rtcClient && typeof this.rtcClient.leave === 'function') {
      await this.rtcClient.leave();
    }
  }

  public destroy(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.authExpiresAtMs = null;
    
    if (this.rtcClient) {
      if (typeof this.rtcClient.leave === 'function') {
        this.rtcClient.leave().catch(() => {});
      }
      this.rtcClient = null;
    }
    if (this.rtmClient) {
      if (typeof this.rtmClient.logout === 'function') {
        this.rtmClient.logout().catch(() => {});
      } else if (typeof this.rtmClient.leave === 'function') {
        this.rtmClient.leave();
      }
      this.rtmClient = null;
    }
    if (this.cameraTrack) {
      if (typeof this.cameraTrack.close === 'function') this.cameraTrack.close();
      this.cameraTrack = null;
    }
    if (this.micTrack) {
      if (typeof this.micTrack.close === 'function') this.micTrack.close();
      this.micTrack = null;
    }
    
    for (const track of this.remoteVideoTracks.values()) {
      if (typeof track.stop === 'function') track.stop();
    }
    this.remoteVideoTracks.clear();
    
    if (this.mcuAudioTrack) {
      if (typeof this.mcuAudioTrack.stop === 'function') this.mcuAudioTrack.stop();
      this.mcuAudioTrack = null;
    }

    this.isMcuSubscribed = false;
    this.eventListeners.clear();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    if (!this.rtcClient || !this.cameraTrack) return;
    
    if (mute) {
      // API中可以使用 setEnabled 禁用轨道或取消发布
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(false);
      } else {
        await this.rtcClient.unpublish([this.cameraTrack]);
      }
    } else {
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(true);
      } else {
        await this.rtcClient.publish([this.cameraTrack]);
      }
    }
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    if (!this.rtcClient || !this.micTrack) return;

    if (mute) {
      if (typeof this.micTrack.setEnabled === 'function') {
        await this.micTrack.setEnabled(false);
      } else {
        await this.rtcClient.unpublish([this.micTrack]);
      }
    } else {
      if (typeof this.micTrack.setEnabled === 'function') {
        await this.micTrack.setEnabled(true);
      } else {
        await this.rtcClient.publish([this.micTrack]);
      }
    }
  }

  public async setDisplayRemoteVideo(userId: string, element: HTMLElement | null, videoStreamType: number = 1): Promise<void> {
    if (!this.rtcClient) return;

    // 假设 videoStreamType=1 为高清晰度 high/FHD，2为 low/LD。可以根据你的业务枚举约定调整这块映射。
    const rtcStreamType = videoStreamType === 1 ? 'high' : 'low';
    try {
      if (typeof this.rtcClient.setRemoteVideoStreamType === 'function') {
        await this.rtcClient.setRemoteVideoStreamType(userId, rtcStreamType);
      }
    } catch (e) {
      console.warn('Failed to set remote video stream type', e);
    }
    
    // 如果已经订阅并缓存了远端的 track，则直接挂载
    const track = this.remoteVideoTracks.get(userId);
    if (!track) {
      console.warn(`DingRTC: Could not find remote video track for userId ${userId}. Wait for subscription.`);
      return;
    }
    
    if (element) {
      if (typeof track.play === 'function') track.play(element);
    } else {
      if (typeof track.stop === 'function') track.stop();
    }
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    if (!this.cameraTrack) return;
    if (element) {
      // 传入元素选择器或者 DOM 对象本身
      this.cameraTrack.play(element);
    } else {
      // 停止播放或解除容器
      if (typeof this.cameraTrack.stop === 'function') {
        this.cameraTrack.stop();
      }
    }
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = false): Promise<void> {
    if (!this.rtmClient) throw new Error('RTM client is not initialized');
    const encodedMsg = this.textEncoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Message length exceeds 4KB, might fail to send via RTM.');
    }
    
    if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
      const sessionId = this.authInfo?.channelId || 'default';
      this.rtmClient.publish(sessionId, encodedMsg, userId);
    } else {
      await this.rtmClient.publish({
        topic: userId,  // 业务侧可以约定用户 topic 为 userId
        message: encodedMsg,
        qos: requireAck ? 1 : 0,
      });
    }
  }

  public async sendMessageToChannel(message: string): Promise<void> {
    if (!this.rtmClient) throw new Error('RTM client is not initialized');
    if (!this.authInfo) throw new Error('Auth info is missing');

    const encodedMsg = this.textEncoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Channel message length exceeds 4KB.');
    }
    
    // 我们假设共享同一房间的频道 ID 为 topic
    if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
      const sessionId = this.authInfo?.channelId || 'default';
      this.rtmClient.publish(sessionId, encodedMsg);
    } else {
      await this.rtmClient.publish({
        topic: this.authInfo.channelId,
        message: encodedMsg,
        qos: 0,
      });
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

  private registerRTMListeners() {
    if (!this.rtmClient) return;

    if (typeof this.rtmClient.on === 'function') {
      // 旧版 API
      this.rtmClient.on('MessageReceived', (event: any) => {
        let decodedMessage = '';
        if (event.message instanceof Uint8Array || event.message instanceof ArrayBuffer) {
          decodedMessage = this.textDecoder.decode(event.message);
        } else {
          decodedMessage = event.message;
        }
        this.emit('onMessageReceived', {
          topic: event.topic,
          message: decodedMessage,
          publisher: event.publisher,
        });
      });

      this.rtmClient.on('ConnectionStateChanged', (state: any, reason: any) => {
        this.emit('onRTMConnectionStateChanged', { state, reason });
      });

      // 新版 API
      this.rtmClient.on('message', (event: any) => {
        let decodedMessage = '';
        if (event.message instanceof Uint8Array || event.message instanceof ArrayBuffer) {
          decodedMessage = this.textDecoder.decode(event.message);
        } else {
          decodedMessage = event.message;
        }
        this.emit('onMessageReceived', {
          topic: event.sessionId,
          message: decodedMessage,
          publisher: event.uid,
        });
      });

      this.rtmClient.on('connection-state-changed', (currState: any, prevState: any, reason: any) => {
        this.emit('onRTMConnectionStateChanged', { state: currState, reason });
      });
    }
  }

  private registerSDKListeners() {
    if (!this.rtcClient) return;

    // 监听远端用户发布通知
    this.rtcClient.on('user-published', (user: any, mediaType: string, auxiliary: any) => {
      this.emit('onPublisher', { user, mediaType, auxiliary });

      if (mediaType === 'video') {
        this.rtcClient.subscribe(user.userId, mediaType, auxiliary).then((track: any) => {
          this.remoteVideoTracks.set(user.userId, track);
          
          this.emit('onTrackSubscribed', { userId: user.userId, track, mediaType });
        }).catch((err: any) => {
          console.error(`Failed to subscribe ${mediaType} track for user ${user.userId}`, err);
        });
      } else if (!this.isMcuSubscribed) {
        this.isMcuSubscribed = true;
        this.rtcClient.subscribe('mcu', 'audio').then((track: any) => {
          this.mcuAudioTrack = track;
          this.emit('onTrackSubscribed', { userId: 'mcu', track, mediaType: 'audio' });
          if (typeof track.play === 'function') track.play(); // 全局混音音频直接播放
        }).catch((err: any) => {
          console.error(`Failed to subscribe mcu audio track`, err);
          this.isMcuSubscribed = false;
        });
      }
    });

    // 监听远端取消发布
    this.rtcClient.on('user-unpublished', (user: any, mediaType: string) => {
      if (mediaType === 'video') {
        const track = this.remoteVideoTracks.get(user.userId);
        if (track && typeof track.stop === 'function') {
          track.stop();
        }
        this.remoteVideoTracks.delete(user.userId);
      }
      this.emit('onUnPublisher', { user, mediaType });
    });
    
    // 如果想要处理当前刚进房间前已在房间里的用户:
    if (this.rtcClient.remoteUsers && Array.isArray(this.rtcClient.remoteUsers)) {
      for (const user of this.rtcClient.remoteUsers) {
        if (user.hasVideo) {
          this.rtcClient.subscribe(user.userId, 'video').then((track: any) => {
            this.remoteVideoTracks.set(user.userId, track);
            this.emit('onTrackSubscribed', { userId: user.userId, track, mediaType: 'video' });
          }).catch((err: any) => console.error("Initial video subscribe fail", err));
        }
        if (user.hasAudio && !this.isMcuSubscribed) {
          this.isMcuSubscribed = true;
          this.rtcClient.subscribe('mcu', 'audio').then((track: any) => {
            this.mcuAudioTrack = track;
            this.emit('onTrackSubscribed', { userId: 'mcu', track, mediaType: 'audio' });
            if (typeof track.play === 'function') track.play();
          }).catch((err: any) => {
            this.isMcuSubscribed = false;
            console.error("Initial mcu audio subscribe fail", err);
          });
        }
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
}
