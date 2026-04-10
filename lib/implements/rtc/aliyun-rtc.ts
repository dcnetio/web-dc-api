import { IRTCOperations, IRTCAuthInfo, IRTCMember, IRTCStreamConfig } from '../../interfaces/rtc-interface';
import DingRTC from 'dingrtc';
import RTM from '@dingrtc/rtm';

export class AliyunRTCOperations implements IRTCOperations {
  private rtcClient: any = null;
  private rtmClient: any = null;
  private textEncoder: TextEncoder;
  private textDecoder: TextDecoder;
  private cameraTrack: any = null;
  private micTrack: any = null;
  private authInfo: IRTCAuthInfo | null = null;
  private currentToken: string = '';
  private hasJoined: boolean = false; // Add joined status tracking
  private isJoiningFlow: boolean = false;
  private isLeavingFlow: boolean = false;

  private localVideoElement: HTMLElement | null = null;
  private isMcuSubscribed: boolean = false;
  private remoteVideoTracks: Map<string, any> = new Map();
  private mcuAudioTrack: any = null;
  private isRemoteAudioMuted: boolean = false;
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();
  private pendingPings: Map<string, Set<(isOnline: boolean) => void>> = new Map();
  private pendingAcks: Map<string, Set<(success: boolean, err?: Error) => void>> = new Map();

  constructor() {
    this.rtcClient = null;
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
  }



  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('RTC is only supported in browser environment.');
      return;
    }

    try {
      this.authInfo = authInfo;
      
      // 创建客户端实例
      const RTCEngine = (DingRTC as any).default || DingRTC;
      
      if (typeof RTCEngine.checkSystemRequirements === 'function') {
        const supported = RTCEngine.checkSystemRequirements();
        if (!supported) {
          throw new Error('Your browser does not support WebRTC required by DingRTC.');
        }
      }
      this.rtcClient = RTCEngine.createClient();

      if (this.authInfo?.enableRTM) {
        const RTMEngine = (RTM as any).default || RTM;

        if (RTMEngine) {
          // 复用 RTC 连接来初始化 RTM Client
          if (typeof RTMEngine.createClient === 'function') {
            this.rtmClient = RTMEngine.createClient({ rtcClient: this.rtcClient });
          } else {
            this.rtmClient = new RTMEngine();
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



  public renewToken(token: string): void {
    this.currentToken = token;
    if (this.authInfo) {
      this.authInfo.token = token;
    }

    if (!this.hasJoined) {
      // 还没正式进入房间，仅更新缓存，别擅自拉起推流和重新进房
      return;
    }

    // 原生不支持直接 renewToken，采用 leave 后重新 join 的方式刷新
    this.leaveChannel().then(() => {
      return this.joinChannel();
    }).catch(err => {
      console.error('Failed to renew token via leave and join:', err);
    });
  }

  public async joinRoom(channelId: string): Promise<void> {
    // leave logic handled by RTCModule before calling this
    if (this.authInfo) {
      this.authInfo.channelId = channelId;
    }
    return this.joinChannel();
  }

  public async joinChannel(): Promise<void> {
    if (!this.rtcClient || !this.authInfo) throw new Error('RTC instance or auth info is missing');
    if (this.isJoiningFlow || this.hasJoined) return;
    
    this.isJoiningFlow = true;
    try {
      this.currentToken = this.authInfo.token || '';

      const { channelId, userId,  rtcAppId } = this.authInfo;
      
      const joinResponse = await this.rtcClient.join({
      appId: rtcAppId,
      userName: userId, 
      channel: channelId,
      uid: userId,
      token: this.currentToken,
    });
    this.hasJoined = true;    
    // 官方规范：通过 RTC 客户端统一加入频道，RTM 会自动复用 channel 此处无需再次 join
    // 如果开启了 RTM，则在加入 RTC 后订阅对应的话题（个人频道 + 公共频道）以接收消息
    if (this.rtmClient && this.authInfo.enableRTM) {
      try {
        if (typeof this.rtmClient.subscribe === 'function') {
          // If we subscribe, we subscribe to both
          try { await this.rtmClient.subscribe({ topic: userId }); } catch(e){}

          await this.rtmClient.subscribe({ topic: channelId });
        } else if (typeof this.rtmClient.joinSession === 'function') {
          // Aliyun RTM V2: A client can only join one session at a time in joinSession() mode.
          await this.rtmClient.joinSession(channelId);
        }
      } catch (err) {
        console.warn('Aliyun RTM: Failed to subscribe primary topics', err);
      }
    }
    
    // 创建音视频轨道 (只在加入前/后创建，由上层通过 Mute 控制是否真的发布)
    const RTCEngine = (DingRTC as any).default || DingRTC;

    this.cameraTrack = await RTCEngine.createCameraVideoTrack({
      frameRate: 15,
      dimension: 'VD_1280x720',
    });
    this.micTrack = await RTCEngine.createMicrophoneAudioTrack();

    // 默认尝试发布音视频轨道
    await this.rtcClient.publish([this.cameraTrack, this.micTrack]);

    // 如果之前有绑定的本地视频容器，重新播放
    if (this.localVideoElement) {
      this.cameraTrack.play(this.localVideoElement);
    }

    // 处理当前刚进房间前已在房间里的用户
    const initialUsers = joinResponse?.remoteUsers || this.rtcClient.remoteUsers || [];
    if (initialUsers && Array.isArray(initialUsers)) {
      for (const user of initialUsers) {
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
            if (this.isRemoteAudioMuted) {
              if (typeof track.setVolume === 'function') track.setVolume(0);
              else if (typeof track.stopPlay === 'function') track.stopPlay();
            } else {
              if (typeof track.play === 'function') track.play();
            }
          }).catch((err: any) => {
            this.isMcuSubscribed = false;
            console.error("Initial mcu audio subscribe fail", err);
          });
        }
        }
      }
    } finally {
      this.isJoiningFlow = false;
    }
  }


  public async leaveChannel(): Promise<void> {
    if (this.isLeavingFlow) return;
    this.isLeavingFlow = true;

    try {
      this.hasJoined = false;

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
      if (this.cameraTrack) {
        if (typeof this.cameraTrack.close === 'function') this.cameraTrack.close();
        this.cameraTrack = null;
      }
      if (this.micTrack) {
        if (typeof this.micTrack.close === 'function') this.micTrack.close();
        this.micTrack = null;
      }
    } finally {
      this.isLeavingFlow = false;
    }
  }

  public async createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: any): Promise<string> {
    throw new Error('createRTCChannel not implemented in basic provider; use RTCModule');
  }

  public async acceptRTCChannelInvite(inviteMsg: any): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: any }> {
    throw new Error('acceptRTCChannelInvite not implemented in basic provider; use RTCModule');
  }

  public async getChannelUsers(channelId?: string): Promise<string[]> {
    if (!this.rtcClient) {
      return [];
    }
    const currentChannel = this.authInfo?.channelId;
    if (channelId && channelId !== currentChannel) {
      console.warn("RTC client is not in the specified channel, returning empty or current users");
    }
    const users = [];
    if (this.authInfo?.userId) {
      users.push(this.authInfo.userId);
    }
    if (this.rtcClient.remoteUsers && Array.isArray(this.rtcClient.remoteUsers)) {
      this.rtcClient.remoteUsers.forEach((u: any) => {
        if (u.userId) users.push(u.userId);
      });
    }
    return users;
  }

  public destroy(): void {
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
      if (typeof track.stopPlay === 'function') track.stopPlay();
      else if (typeof track.stop === 'function') track.stop();
    }
    this.remoteVideoTracks.clear();
    
    if (this.mcuAudioTrack) {
      if (typeof this.mcuAudioTrack.stopPlay === 'function') this.mcuAudioTrack.stopPlay();
      else if (typeof this.mcuAudioTrack.stop === 'function') this.mcuAudioTrack.stop();
      this.mcuAudioTrack = null;
    }

    this.isMcuSubscribed = false;
    this.eventListeners.clear();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    if (!this.rtcClient || !this.cameraTrack) return;
    
    if (mute) {
      // API中可以使用 setEnabled 禁用轨道，并使用 unpublish 停止推流告知远端，防止远端卡在最后一帧
      await this.rtcClient.unpublish([this.cameraTrack]).catch(() => {});
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(false);
      }
    } else {
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(true);
      }
      await this.rtcClient.publish([this.cameraTrack]).catch(() => {});
    }
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    if (!this.rtcClient || !this.micTrack) return;

    if (mute) {
      await this.rtcClient.unpublish([this.micTrack]).catch(() => {});
      if (typeof this.micTrack.setEnabled === 'function') {
        await this.micTrack.setEnabled(false);
      }
    } else {
      if (typeof this.micTrack.setEnabled === 'function') {
        await this.micTrack.setEnabled(true);
      }
      await this.rtcClient.publish([this.micTrack]).catch(() => {});
    }
  }

  public async muteRemoteAudio(mute: boolean): Promise<void> {
    this.isRemoteAudioMuted = mute;
    if (!this.mcuAudioTrack) {
      return;
    }
    try {
      if (mute) {
        if (typeof this.mcuAudioTrack.setVolume === 'function') {
          await this.mcuAudioTrack.setVolume(0);
        } else if (typeof this.mcuAudioTrack.stopPlay === 'function') {
          await this.mcuAudioTrack.stopPlay();
        } else if (typeof this.mcuAudioTrack.stop === 'function') {
          await this.mcuAudioTrack.stop();
        }
      } else {
        if (typeof this.mcuAudioTrack.setVolume === 'function') {
          await this.mcuAudioTrack.setVolume(100);
        } else if (typeof this.mcuAudioTrack.play === 'function') {
          await this.mcuAudioTrack.play();
        }
      }
    } catch(e) {
      console.warn("Failed to toggle remote audio mute", e);
    }
  }

  public async getCameras(): Promise<any[]> {
    const RTCEngine = (DingRTC as any).default || DingRTC;
    if (RTCEngine && typeof RTCEngine.getCameras === 'function') {
      return await RTCEngine.getCameras();
    }
    // Fallback logic
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'videoinput');
    }
    return [];
  }

  public async switchCamera(deviceId: string): Promise<void> {
    if (this.cameraTrack && typeof this.cameraTrack.setDevice === 'function') {
      await this.cameraTrack.setDevice(deviceId);
    } else {
      throw new Error("DingRTC SDK or current track does not support dynamic camera switching via setDevice");
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
      if (typeof track.stopPlay === 'function') track.stopPlay();
      else if (typeof track.stop === 'function') track.stop();
    }
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    this.localVideoElement = element;
    if (!this.cameraTrack) return;
    if (element) {
      this.cameraTrack.play(element);
    } else {
      if (typeof this.cameraTrack.stopPlay === 'function') {
        this.cameraTrack.stopPlay();
      } else if (typeof this.cameraTrack.stop === 'function') {
        this.cameraTrack.stop();
      }
    }
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = true, sendOffline: boolean = false): Promise<'success' | 'offline' | 'failed'> {
    console.log('[RTC] sendMessageToPeer wrapper triggered', { userId, msgLen: message?.length });
    if (!this.rtmClient) throw new Error('RTM client is not initialized');
    const encodedMsg = this.textEncoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Message length exceeds 4KB, might fail to send via RTM.');
    }
    
    const msgHash = Array.from(encodedMsg.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
    const ackKey = `${userId}_${msgHash}`;

    return new Promise<'success' | 'offline' | 'failed'>(async (resolve, reject) => {
      let timeoutId: any;
      let isDone = false;

      const finish = (success: boolean, err?: Error) => {
        if (isDone) return;
        isDone = true;
        if (timeoutId) clearTimeout(timeoutId);
        
        const set = this.pendingAcks.get(ackKey);
        if (set) {
          set.delete(finish);
          if (set.size === 0) this.pendingAcks.delete(ackKey);
        }

        if (success) {
          resolve('success');
        } else {
          if (sendOffline) {
            // fallback logic is handled in the module wrapper
            resolve('offline');
          } else {
            resolve('failed');
          }
        }
      };

      if (!this.pendingAcks.has(ackKey)) {
        this.pendingAcks.set(ackKey, new Set());
      }
      this.pendingAcks.get(ackKey)!.add(finish);

      timeoutId = setTimeout(() => {
        finish(false);
      }, 3000);

      try {
        const clientToUse = this.rtmClient;
        if (clientToUse && typeof clientToUse.publish === 'function' && clientToUse.publish.length > 1) {
          await clientToUse.publish(this.authInfo!.userId, encodedMsg, userId);
        } else {
          const clientToUse = this.rtmClient;
          if (clientToUse) {
             await clientToUse.publish({
               topic: userId,
               message: encodedMsg,
               qos: requireAck ? 1 : 0,
             });
          }
        }
      } catch (e: any) {
        finish(false, e);
      }
    });
  }

  public async sendMessageToSession(message: string): Promise<void> {
    if (!this.rtmClient) throw new Error('RTM client is not initialized');
    if (!this.authInfo) throw new Error('Auth info is missing');

    const encodedMsg = this.textEncoder.encode(message);
    if (encodedMsg.length > 4096) {
      console.warn('Channel message length exceeds 4KB.');
    }
    
    // 我们假设共享同一房间的频道 ID 为 topic
    if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
      const channelId = this.authInfo?.channelId || 'default';
      const clientToUse = this.rtmClient;
      if (clientToUse) clientToUse.publish(channelId, encodedMsg);
    } else {
      const clientToUse = this.rtmClient;
      if (clientToUse) await clientToUse.publish({
        topic: this.authInfo.channelId,
        message: encodedMsg,
        qos: 0,
      });
    }
  }

  public async queryPeerOnlineStatus(userId: string): Promise<boolean> {
    if (!this.rtmClient) throw new Error('RTM client is not initialized');

    return new Promise(async (resolve) => {
      let timeoutId: NodeJS.Timeout | null = null;
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

      if (!this.pendingPings.has(userId)) {
        this.pendingPings.set(userId, new Set());
      }
      this.pendingPings.get(userId)!.add(finish);

      timeoutId = setTimeout(() => {
        finish(false); // 超时当做离线返回
      }, 3000);

      try {
        const encodedPing = this.textEncoder.encode('__DC_PING__');
        if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
          await (this.rtmClient)?.publish(userId, encodedPing, userId);
        } else {
          await (this.rtmClient)?.publish({
            topic: userId,
            message: encodedPing,
            qos: 0,
          });
        }
      } catch (e) {
        finish(false);
      }
    });
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

  private registerRTMListeners(targetClient: any = this.rtmClient) {
    if (!targetClient) return;

    if (typeof this.rtmClient.on === 'function') {
      // 旧版 API
      targetClient.on('MessageReceived', (event: any) => {
        let decodedMessage = '';
        if (event.message instanceof Uint8Array || event.message instanceof ArrayBuffer) {
          decodedMessage = this.textDecoder.decode(event.message);
        } else if (typeof event.message === 'object' && event.message !== null) {
          decodedMessage = JSON.stringify(event.message);
        } else {
          decodedMessage = String(event.message);
        }

        if (decodedMessage === '__DC_PING__') {
          try {
            const encodedPong = this.textEncoder.encode('__DC_PONG__');
            if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
              const channelId = event.topic || this.authInfo?.channelId || 'default';
              (this.rtmClient)?.publish(event.publisher || channelId, encodedPong, event.publisher).catch(() => {});
            } else {
              (this.rtmClient)?.publish({
                topic: this.authInfo?.channelId || 'default',
                uid: event.publisher,
                message: encodedPong,
                qos: 0,
              }).catch(() => {});
            }
          } catch(e) {}
          return;
        }

        if (decodedMessage === '__DC_PONG__') {
          const set = this.pendingPings.get(event.publisher);
          if (set) {
             set.forEach(cb => cb(true));
          }
          return;
        }

        if (decodedMessage.startsWith('__DC_ACK__:')) {
          const hashId = decodedMessage.substring(11);
          const ackKey = `${event.publisher}_${hashId}`;
          const set = this.pendingAcks.get(ackKey);
          if (set) {
             set.forEach(cb => cb(true));
          }
          return;
        }

        // It's a real business payload, automatically send ACK back to sender
        if (event.publisher && event.publisher !== this.authInfo?.userId) {
           try {
              const msgContent = this.textEncoder.encode(decodedMessage);
              const hashId = Array.from(msgContent.slice(0, 16)).map((b: any) => b.toString(16).padStart(2, '0')).join('');
              const ackStr = `__DC_ACK__:${hashId}`;
              const encodedAck = this.textEncoder.encode(ackStr);
              if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
                const channelId = event.topic || this.authInfo?.channelId || 'default';
                (this.rtmClient)?.publish(event.publisher || channelId, encodedAck, event.publisher).catch(() => {});
              } else {
                (this.rtmClient)?.publish({
                  topic: this.authInfo?.channelId || 'default',
                  uid: event.publisher,
                  message: encodedAck,
                  qos: 0,
                }).catch(() => {});
              }
           } catch(e) {}
        }

        this.emit('onMessageReceived', {
          topic: event.topic,
          message: decodedMessage,
          publisher: event.publisher,
        });
      });

      targetClient.on('ConnectionStateChanged', (state: any, reason: any) => {
        this.emit('onRTMConnectionStateChanged', { state, reason });
      });

      // 新版 API
      targetClient.on('message', (event: any) => {
        let decodedMessage = '';
        if (event.message instanceof Uint8Array || event.message instanceof ArrayBuffer) {
          decodedMessage = this.textDecoder.decode(event.message);
        } else if (typeof event.message === 'object' && event.message !== null) {
          decodedMessage = JSON.stringify(event.message);
        } else {
          decodedMessage = String(event.message);
        }

        if (decodedMessage === '__DC_PING__') {
          try {
            const encodedPong = this.textEncoder.encode('__DC_PONG__');
            if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
              const channelId = event.channelId || this.authInfo?.channelId || 'default';
              (this.rtmClient)?.publish(event.uid || channelId, encodedPong, event.uid).catch(() => {});
            } else {
              (this.rtmClient)?.publish({
                topic: this.authInfo?.channelId || 'default',
                uid: event.uid,
                message: encodedPong,
                qos: 0,
              }).catch(() => {});
            }
          } catch(e) {}
          return;
        }

        if (decodedMessage === '__DC_PONG__') {
          const set = this.pendingPings.get(event.uid);
          if (set) {
             set.forEach(cb => cb(true));
          }
          return;
        }

        if (decodedMessage.startsWith('__DC_ACK__:')) {
          const hashId = decodedMessage.substring(11);
          const ackKey = `${event.uid}_${hashId}`;
          const set = this.pendingAcks.get(ackKey);
          if (set) {
             set.forEach(cb => cb(true));
          }
          return;
        }
        
        // It's a real business payload, automatically send ACK back to sender
        if (event.uid && event.uid !== this.authInfo?.userId && !event.broadcast) {
           try {
              const msgContent = this.textEncoder.encode(decodedMessage);
              const hashId = Array.from(msgContent.slice(0, 16)).map((b: any) => b.toString(16).padStart(2, '0')).join('');
              const ackStr = `__DC_ACK__:${hashId}`;
              const encodedAck = this.textEncoder.encode(ackStr);
              if (typeof this.rtmClient.publish === 'function' && this.rtmClient.publish.length > 1) {
                const channelId = event.channelId || this.authInfo?.channelId || 'default';
                (this.rtmClient)?.publish(event.uid || channelId, encodedAck, event.uid).catch(() => {});
              } else {
                (this.rtmClient)?.publish({
                  topic: this.authInfo?.channelId || 'default',
                  uid: event.uid,
                  message: encodedAck,
                  qos: 0,
                }).catch(() => {});
              }
           } catch(e) {}
        }

        this.emit('onMessageReceived', {
          topic: event.channelId,
          message: decodedMessage,
          publisher: event.uid,
        });
      });

      const c: any = this.rtmClient; if (c) c.on('connection-state-changed', (currState: any, prevState: any, reason: any) => {
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
          if (this.isRemoteAudioMuted) {
            if (typeof track.setVolume === 'function') track.setVolume(0);
            else if (typeof track.stopPlay === 'function') track.stopPlay();
          } else {
            if (typeof track.play === 'function') track.play(); // 全局混音音频直接播放
          }
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
        if (track) {
          if (typeof track.stopPlay === 'function') track.stopPlay();
          else if (typeof track.stop === 'function') track.stop();
        }
        this.remoteVideoTracks.delete(user.userId);
      }
      this.emit('onUnPublisher', { user, mediaType });
    });

    // 监听远端退出房间
    this.rtcClient.on('user-left', (user: any) => {
      // 当用户离开频道时，清理可能的视觉资源
      const track = this.remoteVideoTracks.get(user.userId);
      if (track) {
        if (typeof track.stopPlay === 'function') track.stopPlay();
        else if (typeof track.stop === 'function') track.stop();
      }
      this.remoteVideoTracks.delete(user.userId);
      this.emit('onUserLeft', { user });
    });
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
}
