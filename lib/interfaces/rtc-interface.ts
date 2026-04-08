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
  userId: string;
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
   * 加入特定频道
   */
  joinChannel(): Promise<void>;

  /**
   * 离开频道
   */
  leaveChannel(): Promise<void>;

  /**
   * 销毁并释放资源
   */
  destroy(): void;

  /**
   * 开启或关闭本地摄像头
   */
  muteLocalCamera(mute: boolean): Promise<void>;

  /**
   * 开启或关闭本地麦克风
   */
  muteLocalMic(mute: boolean): Promise<void>;

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
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean): Promise<void>;

  /**
   * RTM 消息发送：给当前频道发群聊消息
   */
  sendMessageToChannel(message: string): Promise<void>;

  /**
   * 注册事件监听
   */
  on(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * 移除事件监听
   */
  off(event: string, callback: (...args: any[]) => void): void;
}
