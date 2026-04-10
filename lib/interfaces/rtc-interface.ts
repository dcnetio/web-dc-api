export interface IRTCMember {
  userId: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface IRTCStreamConfig {
  video: boolean;
  audio: boolean;
}

export interface IRTCAuthInfo {
  token?: string;       // 如果外部有具体传入的 token，依然可用作默认或兜底
  channelId: string;
  appId: string;
  rtcAppId?: string;
  userId: string;
  themeAuthor?: string;
  configTheme?: string;
  serviceName?: string;
  // 通过回调由外部业务层按需获取或刷新 token（完全解耦架构）
  fetchAuthInfo?: (forceRefresh: boolean) => Promise<{ token: string, expiresAt?: number }>;
  // 配置是否在 RTC 初始化后自动集成 RTM
  enableRTM?: boolean;
}

export interface IRTCOperations {
  /**
   * 初始化 RTC (同时按需初始化 RTM 共享复用 RTC 客户端的网络通道)
   */
  init(authInfo: IRTCAuthInfo): Promise<void>;

  /**
   * 按指定的 channelId 主动加入聊天室/音视频会议
   * 此方法会自动退出现有频道、申请该该频道的 Token，并进入新的通道
   */
  joinRoom(channelId: string): Promise<void>;

  /**
   * 加入频道（由当前配置 authInfo.channelId 决定）
   */
  joinChannel(): Promise<void>;

  /**
   * 离开频道
   */
  leaveChannel(): Promise<void>;

  /**
   * 获取指定频道的在线用户列表
   */
  getChannelUsers(channelId?: string): Promise<string[]>;

  /**
   * 销毁并释放资源
   */
  destroy(): void;

  /**
   * 创建由 RTM 邀请的 RTC 频道 (例如语音/视频通话)
   * @param userIds 要邀请的用户 ID 数组
   * @param channelDescription 可选频道描述
   * @param rtcConfig 可选 RTC 配置 (如 video/audio 是否开启)
   * @returns 返回生成的 channelId
   */
  createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: any): Promise<string>;

  /**
   * 接受 RTC 频道的邀请，并返回频道的信息以便加入
   * @param inviteMsg 邀请消息内容
   */
  acceptRTCChannelInvite(inviteMsg: any): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: any }>;

  /**
   * 开启或关闭本地摄像头
   */
  muteLocalCamera(mute: boolean): Promise<void>;

  /**
   * 开启或关闭本地麦克风
   */
  muteLocalMic(mute: boolean): Promise<void>;

  /**
   * 静音远端音频（本地扬声器）
   */
  muteRemoteAudio(mute: boolean): Promise<void>;

  /**
   * 获取所有可用的摄像头设备列表
   */
  getCameras(): Promise<any[]>;

  /**
   * 动态切换指定的摄像头
   * @param deviceId 设备ID (可通过 getCameras 获得)
   */
  switchCamera(deviceId: string): Promise<void>;

  /**
   * 为远端用户设置挂载的视频 DOM 元素
   */
  setDisplayRemoteVideo(userId: string, element: HTMLElement | null, streamType?: number): Promise<void>;

  /**
   * 为本地用户设置挂载的视频 DOM 元素
   */
  setDisplayLocalVideo(element: HTMLElement | null): Promise<void>;

  /**
   * RTM 消息发送：给用户发单聊消息
   */
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean, sendOffline?: boolean): Promise<'success' | 'offline' | 'failed'>;

  /**
   * RTM 消息发送：给当前频道发群聊消息
   */
  sendMessageToSession(message: string): Promise<void>;

  /**
   * 注册事件监听
   */
  on(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * 移除事件监听
   */
  off(event: string, callback: (...args: any[]) => void): void;
}
