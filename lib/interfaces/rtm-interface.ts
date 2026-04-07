export interface IRTMAuthInfo {
  token: string;
  appId: string;
  userId: string;
  channelId?: string;
}

export interface IRTMMetadata {
  [key: string]: string;
}

export interface IRTMOperations {
  /**
   * 初始化 RTM 系统 (登录)
   */
  login(authInfo: IRTMAuthInfo): Promise<void>;

  /**
   * 登出并释放资源
   */
  logout(): Promise<void>;

  /**
   * 发送端到端单聊消息 (Peer to Peer)
   */
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean): Promise<void>;

  /**
   * 订阅频道 (类似于加群)
   */
  subscribeChannel(channelId: string): Promise<void>;

  /**
   * 取消订阅频道
   */
  unsubscribeChannel(channelId: string): Promise<void>;

  /**
   * 频道内发送广播消息
   */
  sendMessageToChannel(channelId: string, message: string): Promise<void>;

  /**
   * 查询对方是否在线
   */
  queryPeerOnlineStatus(userId: string): Promise<boolean>;

  /**
   * 注册事件监听 (onMessageReceived, onPeerOnlineStatusChanged 等)
   */
  on(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * 移除事件监听
   */
  off(event: string, callback: (...args: any[]) => void): void;
}
