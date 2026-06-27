export interface IRTMStandardMessage {
  appId: string;
  rtcAppId?: string;
  sourceUserId: string;
  messageType: 'P2P' | 'BROADCAST' | 'RTC_INVITE' | 'WHITEBOARD_INVITE' | string;
  content: string;
  timestamp: number;
  isEncrypted: boolean;
  isInvite?: boolean;
  signature?: string;
}

export interface IRTMAuthInfo {
  token?: string; // 可选，token为空时,dcapi会自动申请
  appId: string;
  rtcAppId?: string;
  userId?: string; // 可选：RTM 登录恒以当前登录用户公钥(publicKey.string())为准，无需调用方传入
  userName?: string;
  sessionId?: string;
  themeAuthor: string;
  configTheme: string;
  serviceName: string;
}

export interface IRTMMetadata {
  [key: string]: string;
}

export interface IRTMMessageReceivedPayload {
  message: string;
  userId?: string;
  publisher?: string;
  sessionId?: string;
  topic?: string;
  broadcast?: boolean;
  channelId?: string | null;
}

export interface IRTMConnectionStateChangedPayload {
  currState: unknown;
  prevState: unknown;
  reason?: unknown;
  channelId?: string | null;
}

export interface IRTMSessionUserChangedPayload {
  sessionId: string;
  uid: string;
}

export type IRTMSessionPayload = Record<string, unknown>;

export type RTMEventName =
  | 'onMessageReceived'
  | 'onConnectionStateChanged'
  | 'onSessionAdd'
  | 'onSessionRemove'
  | 'onSessionUserJoin'
  | 'onSessionUserLeft';

export interface RTMEventPayloadMap {
  onMessageReceived: IRTMMessageReceivedPayload;
  onConnectionStateChanged: IRTMConnectionStateChangedPayload;
  onSessionAdd: IRTMSessionPayload;
  onSessionRemove: IRTMSessionPayload;
  onSessionUserJoin: IRTMSessionUserChangedPayload;
  onSessionUserLeft: IRTMSessionUserChangedPayload;
}

export type RTMGenericEventCallback = (...args: unknown[]) => void;

export interface IRTMOperations {
  /**
  * 用户登录并连接到 RTM 网络（长连接）。
  * 成功后会自动利用自身的 userId 加入 RTM 网络，channelId、sessionId 都是 userId，
  * 别人可以直接通过 userId 找到这个用户并发送消息。
  *
  * 注意：userId 恒由 SDK 内当前登录用户的公钥(publicKey.string())决定，无需在 authInfo 中传入；
  * 即便传了也会被忽略。调用前请确保用户已登录（dc.publicKey 就绪）。
  *
  * 设计说明：
  * 1) 收消息与事件监听走这条长连接（onMessageReceived 等事件来源于此）
  * 2) 主动发消息默认走短连接发送链路（见 sendMessageToPeer 注释），两者职责分离
   * @param authInfo 登录信息，包括 appId、themeAuthor、configTheme、serviceName、token 等（userId 自动取当前登录用户公钥）
   */
  login(authInfo: IRTMAuthInfo): Promise<void>;
  
  /**
   * 登出并断开 RTM 网络连接
   */
  logout(): Promise<void>;
  
  /**
    * 发送点对点消息给指定用户
    *
    * 发送机制说明（重要）：
    * 1) 该接口默认通过短连接发送，不复用 login 建立的长连接
    * 2) 每次发送会创建一个临时发送身份：${userId}_s（即当前 userId 后追加 _s）
    * 3) 每次发送前都会按目标 userId 动态申请一次 token，再临时 connect -> publish -> disconnect
    * 4) 这种“监听长连接 + 发送短连接”的设计，能保持接收稳定并隔离发送链路
   * @param userId 目标用户 ID
   * @param message 消息内容
   * @param requireAck 是否需要对方接收回执校验，默认通常为 true
   * @param sendOffline 如果对方不在线，是否允许转离线消息发送，默认通常为 false
   * @returns 返回发送结果的状态：'success' | 'offline' | 'failed'
   */
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean, sendOffline?: boolean): Promise<'success' | 'offline' | 'failed'>;
  
  /**
   * 查询指定用户的当前在线状态
   * @param userId 需要查询的用户 ID
   * @returns 用户在线返回 true，离线返回 false
   */
  queryPeerOnlineStatus(userId: string): Promise<boolean>;
  
  /**
    * 注册 RTM 事件监听器（监听来源于 login 后的长连接）
   * @param event 事件名称 (例如: 'MessageFromPeer', 'ConnectionStateChanged' 等)
   * @param callback 事件触发时的回调处理函数
   */
  on<E extends RTMEventName>(event: E, callback: (payload: RTMEventPayloadMap[E]) => void): void;
  on(event: string, callback: RTMGenericEventCallback): void;
  
  /**
   * 移除 RTM 事件监听器
   * @param event 事件名称
   * @param callback 之前注册的回调函数引用
   */
  off<E extends RTMEventName>(event: E, callback: (payload: RTMEventPayloadMap[E]) => void): void;
  off(event: string, callback: RTMGenericEventCallback): void;
}
