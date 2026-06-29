import { IRTCOperations, IRTCAuthInfo, IRTCJoinRoomOptions, IRTCMember, IRTCStreamConfig, RTCChannelInviteMessage, IRTCCameraDevice, IRTCScreenShareConfig, RTCGenericEventCallback } from '../../interfaces/rtc-interface';
import DingRTC from 'dingrtc';
import RTM from '@dingrtc/rtm';
import { blockAliyunLogRequests } from '../util/aliyun-log-block';

type RTCRemoteUserLike = {
  userId: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
};

type RTCJoinResultLike = {
  remoteUsers?: RTCRemoteUserLike[];
};

type RTCClientLike = {
  join: (options: {
    appId?: string;
    userName?: string;
    channel?: string;
    uid?: string;
    token?: string;
  }) => Promise<RTCJoinResultLike>;
  leave: () => Promise<void>;
  publish: (tracks: unknown[]) => Promise<unknown>;
  unpublish: (tracks: unknown[]) => Promise<unknown>;
  subscribe: (...args: unknown[]) => Promise<unknown>;
  unsubscribe: (...args: unknown[]) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  register: (module: unknown) => void;
  setRemoteVideoStreamType: (userId: string, streamType: string) => Promise<unknown>;
  remoteUsers?: RTCRemoteUserLike[];
};

type RTMClientLike = {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  subscribe: (...args: unknown[]) => Promise<unknown>;
  unsubscribe: (...args: unknown[]) => Promise<unknown>;
  joinSession: (channelId: string) => Promise<unknown>;
  leaveSession: (channelId: string) => Promise<unknown>;
  publish: (...args: unknown[]) => Promise<unknown>;
  logout: () => Promise<unknown>;
  leave: () => void;
  attach: (rtcClient: RTCClientLike) => void;
};

export class AliyunRTCOperations implements IRTCOperations {
  private rtcClient: RTCClientLike | null = null;
  private rtmClient: RTMClientLike | null = null;
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

  private isRenderableElement(element: HTMLElement | null): element is HTMLElement {
    if (!element) return false;
    if (typeof element.isConnected === 'boolean' && !element.isConnected) return false;
    if (typeof document !== 'undefined' && document.contains && !document.contains(element)) return false;
    return true;
  }

  private safePlayTrack(track: any, element: HTMLElement, tag: string): boolean {
    if (!track || typeof track.play !== 'function') return false;
    try {
      track.play(element);
      return true;
    } catch (e) {
      console.warn(`[AliyunRTC] Failed to play ${tag}, wrapper may be invalid.`, e);
      return false;
    }
  }
  private isMcuSubscribed: boolean = false;
  // 是否已成功向 RTM 订阅 topic / 加入 session。仅当为 true 时 _doLeaveChannel 才会去
  // unsubscribe / leaveSession，避免「尚未进房就退房」时底层抛出「cannot find specified session」误报告警。
  private isRtmSubscribed: boolean = false;
  private remoteVideoTracks: Map<string, any> = new Map();
  private remoteScreenTracks: Map<string, any> = new Map();
  private mcuAudioTrack: any = null;
  private isRemoteAudioMuted: boolean = false;
  private isLocalMicMuted: boolean = false;
  private isLocalCameraMuted: boolean = false;
  private currentCameraDeviceId: string = '';
  private screenTrack: any = null;
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

    blockAliyunLogRequests();

    try {
      this.authInfo = authInfo;
      
      // 创建客户端实例
      const RTCEngine = (DingRTC as any).default || DingRTC;

      // 注意：DingRTC 新版的 setLogLevel 已废弃（调用会打印
      // "[dingrtc]: setLogLevel is deprecated" 且本身是空操作），故不再调用。
      // SDK 向 *.log.aliyuncs.com 的日志上报噪音由 blockAliyunLogRequests() 统一拦截。
      
      if (typeof RTCEngine.checkSystemRequirements === 'function') {
        const supported = RTCEngine.checkSystemRequirements();
        if (!supported) {
          throw new Error('Your browser does not support WebRTC required by DingRTC.');
        }
      }
      this.rtcClient = RTCEngine.createClient();
      const rtcClient = this.rtcClient;
      if (!rtcClient) {
        throw new Error('Failed to create RTC client instance.');
      }

      if (this.authInfo?.enableRTM) {
        const RTMEngine = (RTM as any).default || RTM;

        if (RTMEngine) {
          // 复用 RTC 连接来初始化 RTM Client
          if (typeof RTMEngine.createClient === 'function') {
            this.rtmClient = RTMEngine.createClient({ rtcClient });
          } else {
            this.rtmClient = new RTMEngine();
            const rtmClient = this.rtmClient;
            if (rtmClient && typeof rtcClient.register === 'function') {
              rtcClient.register(rtmClient);
            } else if (rtmClient && typeof rtmClient.attach === 'function') {
              rtmClient.attach(rtcClient);
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

  public async joinRoom(channelId: string, options?: IRTCJoinRoomOptions): Promise<void> {
    // leave logic handled by RTCModule before calling this
    if (this.authInfo) {
      this.authInfo.channelId = channelId;
    }
    
    // 初始化新房间状态，防止上次通话残留的静音/摄像头偏好导致 UI 和底层的时序不同步问题
    // audioPublish/videoPublish 默认 true，显式传 false 则跳过对应轨道创建
    this.isLocalCameraMuted = options?.videoPublish === false;
    this.isLocalMicMuted = options?.audioPublish === false;
    this.isRemoteAudioMuted = false;
    this.currentCameraDeviceId = '';

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
          // If we subscribe, we subscribe to both.
          // 任一 topic 订阅成功即标记，确保后续 _doLeaveChannel 能正确退订（含个人 topic 已订阅但公共 topic 失败的部分订阅场景）。
          try { await this.rtmClient.subscribe({ topic: userId }); this.isRtmSubscribed = true; } catch(e){}

          await this.rtmClient.subscribe({ topic: channelId });
          this.isRtmSubscribed = true;
        } else if (typeof this.rtmClient.joinSession === 'function') {
          // Aliyun RTM V2: A client can only join one session at a time in joinSession() mode.
          await this.rtmClient.joinSession(channelId);
          this.isRtmSubscribed = true;
        }
      } catch (err) {
        console.warn('Aliyun RTM: Failed to subscribe primary topics', err);
      }
    }
    
    // 按需创建本地音视频轨道：videoPublish/audioPublish 为 false 时不创建对应轨道，
    // 避免在纯信令/仅订阅场景下请求设备权限或抛出 TypeError
    const RTCEngine = (DingRTC as any).default || DingRTC;
    const tracksToPublish: any[] = [];

    if (!this.isLocalCameraMuted) {
      this.cameraTrack = await RTCEngine.createCameraVideoTrack({
        frameRate: 15,
        dimension: 'VD_1280x720',
      });
      // 如果之前设置过需要切换的摄像头（尤其是断连续命时），在此恢复指定设备
      if (this.currentCameraDeviceId && typeof this.cameraTrack.setDevice === 'function') {
        await this.cameraTrack.setDevice(this.currentCameraDeviceId).catch((e: Error) => console.warn(e));
      }
      tracksToPublish.push(this.cameraTrack);
    }

    if (!this.isLocalMicMuted) {
      this.micTrack = await RTCEngine.createMicrophoneAudioTrack();
      tracksToPublish.push(this.micTrack);
    }

    if (tracksToPublish.length > 0) {
      await this.rtcClient.publish(tracksToPublish).catch((e: Error) => console.warn(e));
    }

    // 如果之前有绑定的本地视频容器，且摄像头轨道已创建，重新播放
    if (this.cameraTrack && this.localVideoElement) {
      if (!this.isRenderableElement(this.localVideoElement) || !this.safePlayTrack(this.cameraTrack, this.localVideoElement, 'local video')) {
        this.localVideoElement = null;
      }
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


  private leavingFlowPromise: Promise<void> | null = null;

  public async leaveChannel(): Promise<void> {
    // If already leaving, wait for that leave to complete instead of returning early.
    if (this.leavingFlowPromise) return this.leavingFlowPromise;
    if (this.isLeavingFlow) return;
    this.isLeavingFlow = true;
    this.leavingFlowPromise = this._doLeaveChannel().finally(() => {
      this.isLeavingFlow = false;
      this.leavingFlowPromise = null;
    });
    return this.leavingFlowPromise;
  }

  private async _doLeaveChannel(): Promise<void> {
      this.hasJoined = false;

      // 仅在确实订阅/加入过 RTM session 时才退订，避免未进房就退房触发底层「cannot find specified session」误报。
      if (this.rtmClient && this.authInfo && this.isRtmSubscribed) {
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
          // 「cannot find specified session / not found」是预期内的良性场景：进房前 _doJoinRoom 会做
          // 防御性退房，而上一次 RTC leave() 或切换频道已使底层 RTM session 失效（isRtmSubscribed 尚未
          // 同步复位）。此时退订必然抛该错，但对功能无任何影响，故静默忽略，避免污染控制台；
          // 仅对真正未预期的错误保留告警。
          const msg = String((err as any)?.message ?? err ?? '');
          if (!/cannot find specified session|no\s*such\s*session|session\s*not\s*found|not\s*found/i.test(msg)) {
            console.warn('Aliyun RTM: Failed to unsubscribe primary topics', err);
          }
        }
      }
      if (this.rtcClient && typeof this.rtcClient.leave === 'function') {
        await this.rtcClient.leave();
      }
      if (this.cameraTrack) {
        if (typeof this.cameraTrack.close === 'function') this.cameraTrack.close();
        this.cameraTrack = null;
      }
      if (this.screenTrack) {
        if (typeof this.screenTrack.close === 'function') this.screenTrack.close();
        this.screenTrack = null;
      }
      if (this.micTrack) {
        if (typeof this.micTrack.close === 'function') this.micTrack.close();
        this.micTrack = null;
      }
      // 清理远端轨道缓存：不清理会导致重新加入后旧 track 仍滞留，
      // 且 isMcuSubscribed=true 会使重入后 mcu 音频无法重新订阅。
      for (const track of this.remoteVideoTracks.values()) {
        if (typeof track.stopPlay === 'function') track.stopPlay();
        else if (typeof track.stop === 'function') track.stop();
      }
      this.remoteVideoTracks.clear();
      for (const track of this.remoteScreenTracks.values()) {
        if (typeof track.stopPlay === 'function') track.stopPlay();
        else if (typeof track.stop === 'function') track.stop();
      }
      this.remoteScreenTracks.clear();
      if (this.mcuAudioTrack) {
        if (typeof this.mcuAudioTrack.stopPlay === 'function') this.mcuAudioTrack.stopPlay();
        else if (typeof this.mcuAudioTrack.stop === 'function') this.mcuAudioTrack.stop();
        this.mcuAudioTrack = null;
      }
      this.isMcuSubscribed = false;
      this.isRtmSubscribed = false;
  }

  public async createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: IRTCStreamConfig): Promise<string> {
    throw new Error('createRTCChannel not implemented in basic provider; use RTCModule');
  }

  public async parseRTCChannelInvite(inviteMsg: RTCChannelInviteMessage): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: IRTCStreamConfig }> {
    throw new Error('parseRTCChannelInvite not implemented in basic provider; use RTCModule');
  }

  public async callPeer(targetUserId: string, mediaType: 'video' | 'audio' | 'mixed' = 'video'): Promise<string> {
    throw new Error('callPeer signaling is handled by RTCModule; basic provider does not implement it directly');
  }

  public async acceptCall(targetUserId: string, channelId: string): Promise<void> {
    throw new Error('acceptCall signaling is handled by RTCModule; basic provider does not implement it directly');
  }

  public async rejectCall(targetUserId: string): Promise<void> {
    throw new Error('rejectCall signaling is handled by RTCModule; basic provider does not implement it directly');
  }

  public async endCall(targetUserId: string, channelId?: string): Promise<void> {
    throw new Error('endCall signaling is handled by RTCModule; basic provider does not implement it directly');
  }

  public async createPersistentSession(targetUserId: string, sessionDescription?: string): Promise<string> {
    throw new Error('createPersistentSession signaling is handled by RTCModule; basic provider does not implement it directly');
  }

  public async acceptPersistentSession(targetUserId: string, channelId: string): Promise<void> {
    throw new Error('acceptPersistentSession signaling is handled by RTCModule; basic provider does not implement it directly');
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
    // teardown 必须「未初始化 / 已销毁时安全跳过」：任何一步都不得抛错，
    // 否则会中断上层 leaveGame/destroy，并产生 "reading 'catch' of undefined"
    // 之类的二次异常（例如底层 leave()/logout() 在半初始化状态下返回非 Promise）。
    const safe = (fn: () => unknown): void => {
      try {
        const r = fn();
        if (r && typeof (r as any).catch === 'function') {
          (r as Promise<unknown>).catch(() => {});
        }
      } catch {
        /* 资源未初始化或已释放，安全跳过 */
      }
    };

    if (this.rtcClient) {
      const client = this.rtcClient;
      if (typeof client.leave === 'function') safe(() => client.leave());
      this.rtcClient = null;
    }

    if (this.rtmClient) {
      const rtm = this.rtmClient;
      if (typeof rtm.logout === 'function') safe(() => rtm.logout());
      else if (typeof rtm.leave === 'function') safe(() => rtm.leave());
      this.rtmClient = null;
    }
    if (this.cameraTrack) {
      const t = this.cameraTrack;
      if (typeof t.close === 'function') safe(() => t.close());
      this.cameraTrack = null;
    }
    if (this.screenTrack) {
      const t = this.screenTrack;
      if (typeof t.close === 'function') safe(() => t.close());
      this.screenTrack = null;
    }
    if (this.micTrack) {
      const t = this.micTrack;
      if (typeof t.close === 'function') safe(() => t.close());
      this.micTrack = null;
    }

    for (const track of this.remoteVideoTracks.values()) {
      if (typeof track.stopPlay === 'function') safe(() => track.stopPlay());
      else if (typeof track.stop === 'function') safe(() => track.stop());
    }
    this.remoteVideoTracks.clear();

    for (const track of this.remoteScreenTracks.values()) {
      if (typeof track.stopPlay === 'function') safe(() => track.stopPlay());
      else if (typeof track.stop === 'function') safe(() => track.stop());
    }
    this.remoteScreenTracks.clear();

    if (this.mcuAudioTrack) {
      const t = this.mcuAudioTrack;
      if (typeof t.stopPlay === 'function') safe(() => t.stopPlay());
      else if (typeof t.stop === 'function') safe(() => t.stop());
      this.mcuAudioTrack = null;
    }

    this.isMcuSubscribed = false;
    this.isRtmSubscribed = false;
    this.eventListeners.clear();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    this.isLocalCameraMuted = mute;
    if (!this.rtcClient) return;

    if (mute) {
      if (!this.cameraTrack) return;
      // unpublish 通知远端停止渲染，再 setEnabled 节省编码资源
      await this.rtcClient.unpublish([this.cameraTrack]).catch(() => {});
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(false);
      }
    } else {
      // 懒建轨道：纯信令模式下 joinRoom 未创建 cameraTrack，首次开启时创建
      if (!this.cameraTrack) {
        if (!this.hasJoined) return; // 还未入房，先等入房后由上层再调
        const RTCEngine = (DingRTC as any).default || DingRTC;
        this.cameraTrack = await RTCEngine.createCameraVideoTrack({
          frameRate: 15,
          dimension: 'VD_1280x720',
        });
        if (this.currentCameraDeviceId && typeof this.cameraTrack.setDevice === 'function') {
          await this.cameraTrack.setDevice(this.currentCameraDeviceId).catch((e: Error) => console.warn(e));
        }
        // 恢复本地预览
        if (this.localVideoElement && this.isRenderableElement(this.localVideoElement)) {
          this.safePlayTrack(this.cameraTrack, this.localVideoElement, 'local video');
        }
      }
      if (typeof this.cameraTrack.setEnabled === 'function') {
        await this.cameraTrack.setEnabled(true);
      }
      await this.rtcClient.publish([this.cameraTrack]).catch(() => {});
    }
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    this.isLocalMicMuted = mute;
    if (!this.rtcClient) return;

    if (mute) {
      if (!this.micTrack) return;
      await this.rtcClient.unpublish([this.micTrack]).catch(() => {});
      if (typeof this.micTrack.setEnabled === 'function') {
        await this.micTrack.setEnabled(false);
      }
    } else {
      // 懒建轨道：纯信令模式下 joinRoom 未创建 micTrack，首次开启时创建
      if (!this.micTrack) {
        if (!this.hasJoined) return;
        const RTCEngine = (DingRTC as any).default || DingRTC;
        this.micTrack = await RTCEngine.createMicrophoneAudioTrack();
      }
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

  public async getCameras(): Promise<IRTCCameraDevice[]> {
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
    this.currentCameraDeviceId = deviceId;
    if (!this.cameraTrack) {
      // 摄像头尚未创建（纯信令模式），偏好已记录，muteLocalCamera(false) 时会自动使用
      return;
    }
    if (typeof this.cameraTrack.setDevice === 'function') {
      await this.cameraTrack.setDevice(deviceId);
    } else {
      throw new Error("DingRTC SDK or current track does not support dynamic camera switching via setDevice");
    }
  }

  public async startScreenShare(config?: IRTCScreenShareConfig): Promise<void> {
    if (!this.rtcClient) throw new Error('RTC client is not initialized');
    
    const RTCEngine = (DingRTC as any).default || DingRTC;
    const defaultConfig = {
      dimension: 'VD_1920x1080',
      frameRate: 15,
      ...config
    };
    
    const result = await RTCEngine.createScreenVideoTrack(defaultConfig);
    const screenTrack = Array.isArray(result) ? result[0] : result;
    this.screenTrack = screenTrack;
    console.log('[DingRTC] screenTrack created:', screenTrack, 'trackId:', screenTrack?.id, 'type:', (screenTrack as any)?._trackType || (screenTrack as any)?.sourceType);

    // Publish screen track - DingRTC 会自动识别 createScreenVideoTrack 创建的 track 为 auxiliary
    try {
      await this.rtcClient.publish([this.screenTrack]);
      console.log('[DingRTC] screen track published successfully');
    } catch (pubErr) {
      console.error('[DingRTC] screen track publish FAILED:', pubErr);
      throw pubErr;
    }
    
    // Listen for the track ended event (e.g. user clicks "Stop sharing" on system prompt)
    if (this.screenTrack && typeof this.screenTrack.on === 'function') {
      this.screenTrack.on('track-ended', async () => {
        await this.stopScreenShare();
      });
    }
  }

  public async stopScreenShare(): Promise<void> {
    if (!this.rtcClient || !this.screenTrack) return;
    
    try {
      await this.rtcClient.unpublish([this.screenTrack]);
      if (typeof this.screenTrack.close === 'function') {
        this.screenTrack.close();
      }
    } catch (e) {
      console.warn('Failed to stop screen share properly', e);
    }
    
    this.screenTrack = null;
    this.emit('onLocalScreenShareStopped');
  }

  public async setDisplayRemoteScreenShare(userId: string, element: HTMLElement | null): Promise<void> {
    const track = this.remoteScreenTracks.get(userId);
    if (!track) {
      console.warn(`DingRTC: Could not find remote screen share track for userId ${userId}. Wait for subscription.`);
      return;
    }
    
    if (element) {
      if (!this.isRenderableElement(element)) {
        console.warn(`DingRTC: remote screen wrapper is invalid for userId ${userId}.`);
        return;
      }
      this.safePlayTrack(track, element, 'remote screen share');
    } else {
      if (typeof track.stopPlay === 'function') track.stopPlay();
      else if (typeof track.stop === 'function') track.stop();
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
      if (!this.isRenderableElement(element)) {
        console.warn(`DingRTC: remote video wrapper is invalid for userId ${userId}.`);
        return;
      }
      this.safePlayTrack(track, element, 'remote video');
    } else {
      if (typeof track.stopPlay === 'function') track.stopPlay();
      else if (typeof track.stop === 'function') track.stop();
    }
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    this.localVideoElement = element;
    if (!this.cameraTrack) return;
    if (element) {
      if (!this.isRenderableElement(element)) {
        this.localVideoElement = null;
        console.warn('DingRTC: local video wrapper is invalid, skip play.');
        return;
      }
      if (!this.safePlayTrack(this.cameraTrack, element, 'local video')) {
        this.localVideoElement = null;
      }
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
    if (!this.authInfo?.channelId) throw new Error('RTC channel is not initialized');
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
        const currentChannelId = this.authInfo?.channelId;
        if (clientToUse && typeof clientToUse.publish === 'function' && clientToUse.publish.length > 1) {
          await clientToUse.publish(currentChannelId, encodedMsg, userId);
        } else {
          const clientToUse = this.rtmClient;
          if (clientToUse) {
             await clientToUse.publish({
               topic: currentChannelId,
               uid: userId,
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
    if (!this.authInfo?.channelId) throw new Error('RTC channel is not initialized');
    const rtmClient = this.rtmClient;

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
        const currentChannelId = this.authInfo?.channelId;
        if (typeof rtmClient.publish === 'function' && rtmClient.publish.length > 1) {
          await rtmClient.publish(currentChannelId, encodedPing, userId);
        } else {
          await rtmClient.publish({
            topic: currentChannelId,
            uid: userId,
            message: encodedPing,
            qos: 0,
          });
        }
      } catch (e) {
        finish(false);
      }
    });
  }

  public on(event: string, callback: RTCGenericEventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  public off(event: string, callback: RTCGenericEventCallback): void {
    const callbacks = this.eventListeners.get(event);
    if (!callbacks) return;
    const idx = callbacks.indexOf(callback);
    if (idx > -1) {
      callbacks.splice(idx, 1);
    }
  }

  private registerRTMListeners(targetClient: RTMClientLike | null = this.rtmClient) {
    if (!targetClient) return;
    const rtmClient = targetClient;

    if (typeof rtmClient.on === 'function') {
      // 旧版 API
      rtmClient.on('MessageReceived', (event: any) => {
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
            if (typeof rtmClient.publish === 'function' && rtmClient.publish.length > 1) {
              const channelId = event.topic || this.authInfo?.channelId || 'default';
              rtmClient.publish(event.publisher || channelId, encodedPong, event.publisher).catch(() => {});
            } else {
              rtmClient.publish({
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
              if (typeof rtmClient.publish === 'function' && rtmClient.publish.length > 1) {
                const channelId = event.topic || this.authInfo?.channelId || 'default';
                rtmClient.publish(event.publisher || channelId, encodedAck, event.publisher).catch(() => {});
              } else {
                rtmClient.publish({
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

      rtmClient.on('ConnectionStateChanged', (state: any, reason: any) => {
        this.emit('onRTMConnectionStateChanged', { state, reason });
      });

      // 新版 API
      rtmClient.on('message', (event: any) => {
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
            if (typeof rtmClient.publish === 'function' && rtmClient.publish.length > 1) {
              const channelId = event.channelId || this.authInfo?.channelId || 'default';
              rtmClient.publish(event.uid || channelId, encodedPong, event.uid).catch(() => {});
            } else {
              rtmClient.publish({
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
              if (typeof rtmClient.publish === 'function' && rtmClient.publish.length > 1) {
                const channelId = event.channelId || this.authInfo?.channelId || 'default';
                rtmClient.publish(event.uid || channelId, encodedAck, event.uid).catch(() => {});
              } else {
                rtmClient.publish({
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

      rtmClient.on('connection-state-changed', (currState: any, prevState: any, reason: any) => {
        this.emit('onRTMConnectionStateChanged', { state: currState, reason });
      });
    }
  }

  private registerSDKListeners() {
    if (!this.rtcClient) return;
    const rtcClient = this.rtcClient;

    // 监听远端用户发布通知
    rtcClient.on('user-published', (...args: any[]) => { const [user, mediaType, auxiliary] = args;
      console.log(`[DingRTC] user-published: userId=${user?.userId}, mediaType=${mediaType}, auxiliary=`, auxiliary);
      this.emit('onPublisher', { user, mediaType, auxiliary });

      // DingRTC: mediaType='video' + auxiliary=true 表示屏幕共享
      const isScreenShare = Boolean(auxiliary);

      if (mediaType === 'video') {
        console.log(`[DingRTC] subscribing: userId=${user.userId}, mediaType=video, auxiliary(isScreen)=${isScreenShare}`);
        // 第三个参数传 isScreenShare(true/false)，告诉 SDK 订阅辅流(屏幕)还是主流(摄像头)
        rtcClient.subscribe(user.userId, 'video', isScreenShare).then((track: any) => {
          console.log(`[DingRTC] subscribe success: userId=${user.userId}, isScreenShare=${isScreenShare}, track=`, track);
          if (isScreenShare) {
            this.remoteScreenTracks.set(user.userId, track);
            this.emit('onScreenShareSubscribed', { userId: user.userId, track });
          } else {
            this.remoteVideoTracks.set(user.userId, track);
            this.emit('onTrackSubscribed', { userId: user.userId, track, mediaType });
          }
        }).catch((err: any) => {
          console.error(`Failed to subscribe video(auxiliary=${isScreenShare}) track for user ${user.userId}`, err);
        });
      } else if (mediaType === 'audio' && !this.isMcuSubscribed) {
        this.isMcuSubscribed = true;
        rtcClient.subscribe('mcu', 'audio').then((track: any) => {
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
    rtcClient.on('user-unpublished', async (...args: any[]) => { const [user, mediaType, auxiliary] = args;
      const isScreenShare = Boolean(auxiliary);
      if (mediaType === 'video' && isScreenShare) {
        const track = this.remoteScreenTracks.get(user.userId);
        if (track) {
          if (typeof track.stopPlay === 'function') track.stopPlay();
          else if (typeof track.stop === 'function') track.stop();
        }
        this.remoteScreenTracks.delete(user.userId);
        try { await rtcClient.unsubscribe(user.userId, 'video', true); } catch(e) {}
        this.emit('onScreenShareUnSubscribed', { userId: user.userId });
      } else if (mediaType === 'video' && !isScreenShare) {
        const track = this.remoteVideoTracks.get(user.userId);
        if (track) {
          if (typeof track.stopPlay === 'function') track.stopPlay();
          else if (typeof track.stop === 'function') track.stop();
        }
        this.remoteVideoTracks.delete(user.userId);
        try { await rtcClient.unsubscribe(user.userId, mediaType); } catch(e) {}
      }
      this.emit('onUnPublisher', { user, mediaType, auxiliary: isScreenShare });
    });

    // 监听远端退出房间
    rtcClient.on('user-left', (user: any) => {
      // 当用户离开频道时，清理可能的视觉资源
      const videoTrack = this.remoteVideoTracks.get(user.userId);
      if (videoTrack) {
        if (typeof videoTrack.stopPlay === 'function') videoTrack.stopPlay();
        else if (typeof videoTrack.stop === 'function') videoTrack.stop();
      }
      this.remoteVideoTracks.delete(user.userId);

      const screenTrack = this.remoteScreenTracks.get(user.userId);
      if (screenTrack) {
        if (typeof screenTrack.stopPlay === 'function') screenTrack.stopPlay();
        else if (typeof screenTrack.stop === 'function') screenTrack.stop();
      }
      this.remoteScreenTracks.delete(user.userId);

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
