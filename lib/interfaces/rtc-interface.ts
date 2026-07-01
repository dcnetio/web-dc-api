import { IRTMStandardMessage } from './rtm-interface';

export interface IRTCMember {
  userId: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface IRTCStreamConfig {
  video: boolean;
  audio: boolean;
}

export interface IRTCJoinRoomOptions {
  /** 是否允许发布音频，默认 true */
  audioPublish?: boolean;
  /** 是否允许发布视频，默认 true */
  videoPublish?: boolean;
  /** 是否声明会使用屏幕共享，默认 false */
  screenPublish?: boolean;
}

export type CallSignalEvent =
  | 'onCallRequest'
  | 'onCallAccept'
  | 'onCallReject'
  | 'onCallEnd'
  | 'onPersistentSessionRequest'
  | 'onPersistentSessionAccept';

export interface ICallRequestEventPayload {
  callerId: string;
  channelId: string;
  mediaType: 'video' | 'audio' | 'mixed';
  timestamp?: number;
}

export interface ICallAcceptEventPayload {
  calleeId: string;
  channelId: string;
}

export interface ICallRejectEventPayload {
  calleeId: string;
}

export interface ICallEndEventPayload {
  userId: string;
  channelId?: string;
}

export interface IPersistentSessionRequestEventPayload {
  callerId: string;
  channelId: string;
  sessionDescription?: string;
  timestamp?: number;
}

export interface IPersistentSessionAcceptEventPayload {
  calleeId: string;
  channelId: string;
}

export interface CallSignalEventPayloadMap {
  onCallRequest: ICallRequestEventPayload;
  onCallAccept: ICallAcceptEventPayload;
  onCallReject: ICallRejectEventPayload;
  onCallEnd: ICallEndEventPayload;
  onPersistentSessionRequest: IPersistentSessionRequestEventPayload;
  onPersistentSessionAccept: IPersistentSessionAcceptEventPayload;
}

export type RTCChannelInviteMessage = IRTMStandardMessage | string;

export interface IRTCCameraDevice {
  deviceId: string;
  label?: string;
  kind?: string;
  groupId?: string;
}

export type IRTCScreenShareConfig = Record<string, unknown>;
export type RTCGenericEventCallback = (...args: unknown[]) => void;

// RTC 视频计费档位（对齐阿里云「集合分辨率」分档，取 DingRTC 可用预设的子集）。
// 说明：DingRTC 的 dimension 预设最高到 VD_2560x1440(2K)，故摄像头不提供 2K+(4K) 档；
// 屏幕共享采集的是显示器原生分辨率，单独计价，不走本档位。
export type RtcVideoProfile = 'SD' | 'HD' | 'FHD' | '2K';

export interface RtcVideoProfileSpec {
  /** DingRTC 采集/编码规格预设（VideoDimension）。 */
  dimension: string;
  /** 上报给后端计费的档位标识（写入请求头 video_resolution）。 */
  label: RtcVideoProfile;
  /** 集合分辨率（宽×高像素数），便于与阿里云分档表对照。 */
  pixels: number;
}

// 档位 -> 采集规格/上报标识 映射。label 即后端查表用的档位键。
export const RTC_VIDEO_PROFILES: Record<RtcVideoProfile, RtcVideoProfileSpec> = {
  SD: { dimension: 'VD_640x480', label: 'SD', pixels: 640 * 480 },
  HD: { dimension: 'VD_1280x720', label: 'HD', pixels: 1280 * 720 },
  FHD: { dimension: 'VD_1920x1080', label: 'FHD', pixels: 1920 * 1080 },
  '2K': { dimension: 'VD_2560x1440', label: '2K', pixels: 2560 * 1440 },
};

// 未显式配置 videoProfile 时的默认档位（与历史写死的 VD_1280x720 保持一致，避免行为突变）。
export const DEFAULT_RTC_VIDEO_PROFILE: RtcVideoProfile = 'HD';

export interface IRTCAuthInfo {
  token?: string;       // 如果外部有具体传入的 token，依然可用作默认或兜底
  channelId: string; // 如果是 RTC 邀请场景，channelId 一般基于RTM信令协商生成;如果是RTM场景,channelId 一般为 RTM 通道 ID
  appId: string;
  rtcAppId?: string;
  userId?: string; // 可选：RTC 初始化恒以当前登录用户公钥(publicKey.string())为准，无需调用方传入
  themeAuthor?: string;
  configTheme?: string;
  serviceName?: string;
  // 通过回调由外部业务层按需获取或刷新 token（完全解耦架构）
  fetchAuthInfo?: (forceRefresh: boolean) => Promise<{ token: string, expiresAt?: number }>;
  // 配置是否在 RTC 初始化后自动集成 RTM
  enableRTM?: boolean;
  // Token 有效期（秒），由应用侧传入。仅决定 Token 有效性与自动续期节奏：
  // SDK 在临近过期时自动续期（而非固定周期刷新）。
  // 注意：RTC 按时长计费已改为「按实际使用时长增量结算」，计费时长不再等于本有效期——
  // SDK 会上报各计费区间的实际经过秒数（续期/升降档/离开时结算），避免申请长用得短的预付浪费。
  // 未设置时服务端使用默认有效期（约 12 小时）。
  expiresIn?: number;
  // 视频计费档位（分辨率档）。决定摄像头采集规格，并在计费请求头 video_resolution 中上报，
  // 供后端按分辨率档查表计价。未设置时取 DEFAULT_RTC_VIDEO_PROFILE（HD，与历史行为一致）。
  // 注意：仅影响摄像头视频流；屏幕共享按其单独单价计费，不受此档位影响。
  videoProfile?: RtcVideoProfile;
}

export interface IRTCOperations {
  /**
   * 开发者快速流程（建议先看）
   *
   * ⚠️ 全局前提：所有信令相关接口（callPeer / acceptCall / rejectCall / endCall /
   * createPersistentSession / acceptPersistentSession）内部均通过 context 中的
   * 全局 RTM 模块收发信令消息。使用前必须确保 dc.rtm.init() 已完成，
   * 即 context 中已存在可用的 RTM 模块实例，否则信令发送会抛出异常。
   *
   * 一、初始化阶段
   * 1) 先调用 dc.rtm.init() 初始化全局 RTM（信令通道依赖）
   * 2) 再调用 rtc.init(authInfo)
   * 3) 如需直接进房：调用 joinChannel() 或 joinRoom(channelId)
   *
    * 二、主动发起通话（邀请方，参考 handleSendVideoInvite）
    * 1) 调用 callPeer(targetUserId, 'video') 发送呼叫信令并获取 channelId
    * 2) 主叫立即 joinRoom(channelId) 先进入房间等待被叫
    * 3) 监听 onCallAccept / onCallReject，按结果更新 UI 状态
   *
    * 三、接收邀请（被邀请方）
    * 1) 监听 onCallRequest，拿到 callerId、channelId、mediaType
    * 2) 接听时先 acceptCall(callerId, channelId)
    * 3) 再调用 joinRoom(channelId) 入会（与 Demo 流程一致）
    * 4) 拒绝时调用 rejectCall(callerId)
   *
    * 四、点对点视频通话关键约束
    * 1) 前置条件：callPeer 不会自动 init，请先完成 init(authInfo)
    * 2) 呼叫信令仅做协商，不会自动 joinRoom
    * 3) 建议双方都监听 onCallEnd，收到后执行 leaveChannel 与界面清理
    *
    * 五、通话中控制
   * 1) 设备与媒体：muteLocalCamera/muteLocalMic/muteRemoteAudio/switchCamera
   * 2) 画面挂载：setDisplayLocalVideo/setDisplayRemoteVideo/setDisplayRemoteScreenShare
   * 3) 屏幕共享：startScreenShare/stopScreenShare
   *
    * 六、结束与释放
   * 1) 调用 leaveChannel() 离开频道
   * 2) 调用 destroy() 释放 RTC/RTM 资源
    *
    * 七、游戏实时互动消息（聊天室）
    * 1) 先完成 init(authInfo) 并设置 enableRTM: true，再 joinRoom(channelId) 进入房间
    *    （sendMessageToPeer/sendMessageToSession 依赖 RTC 内置 RTM client）
    * 2) 房间广播消息：调用 sendMessageToSession(message)
    * 3) 房间内定向消息：调用 sendMessageToPeer(userId, message, requireAck, sendOffline)
    * 4) 监听 MessageFromPeer / MessageFromSession（或业务封装事件）更新聊天区、战斗播报、组队协作状态
    * 5) 高频互动建议做消息体裁剪与节流（如位置同步/技能状态），避免无效刷屏
    *
    * 八、游戏邀请握手（如格斗游戏挑战/组队）
    * 适用场景：用户 A 邀请用户 B 进入同一个游戏房间（对战、组队、协作等）
    * 前置条件：双方均需先完成 dc.rtm.init() 和 rtc.init(authInfo)，
    *   createPersistentSession / acceptPersistentSession 的信令依赖 context 中已存在的全局 RTM 模块
    * 发起方 A：
    *   1) 调用 createPersistentSession(userBId, '格斗游戏挑战') 发出邀请信令，拿到 channelId
    *   2) 监听 onPersistentSessionAccept，B 接受后调用
    *      joinRoom(channelId, { audioPublish: false, videoPublish: false, screenPublish: false })
    *      进入游戏房间（纯实时消息模式，不发音视频与屏幕共享）
    * 接收方 B：
    *   1) 监听 onPersistentSessionRequest，拿到 callerId / channelId / sessionDescription
    *   2) 接受时调用 acceptPersistentSession(callerId, channelId)，再调用
    *      joinRoom(channelId, { audioPublish: false, videoPublish: false, screenPublish: false })
    *      进入房间（纯实时消息模式，不发音视频与屏幕共享）
    *   3) 拒绝时可直接忽略或通过 sendMessageToPeer 发送自定义拒绝消息
    * 进房后：
    *   - 广播战斗状态：sendMessageToSession(message)
    *   - 定向指令/私聊：sendMessageToPeer(userId, message)
    * 注意：createPersistentSession 与 callPeer 的区别
    *   - callPeer 语义是语音/视频通话邀请（mediaType: video/audio/mixed）
    *   - createPersistentSession 语义是通用会话邀请，sessionDescription 可自由定义游戏类型
   */
  /**
   * 初始化 RTC (同时按需初始化 RTM 共享复用 RTC 客户端的网络通道)
   * @param authInfo 包含身份认证和频道信息的对象参数
   */
  init(authInfo: IRTCAuthInfo): Promise<void>;

  /**
   * 按指定的 channelId 主动加入聊天室/音视频会议
   * 此方法会自动退出现有频道、申请该该频道的 Token，并进入新的通道
    * 可通过 options 声明本次入房预计启用的发布能力（用于鉴权/计价路由）
   * @param channelId 目标房间/频道 ID
    * @param options 可选发布能力声明
   */
    joinRoom(channelId: string, options?: IRTCJoinRoomOptions): Promise<void>;

  /**
   * 加入频道（由当前配置 authInfo.channelId 决定）
   */
  joinChannel(): Promise<void>;

  /**
   * 离开当前频道
   */
  leaveChannel(): Promise<void>;

  /**
   * 获取指定频道的在线用户列表
   * @param channelId 可选的频道 ID，如果不传则默认获取当前频道的用户
   * @returns 频道内用户的 ID 数组
   */
  getChannelUsers(channelId?: string): Promise<string[]>;

  /**
   * 销毁并释放所有 RTC（及关联的 RTM）资源、事件和本地媒体设备引用
   */
  destroy(): void;

  /**
   * 创建于其他用户的RTC通信频道 (例如语音/视频通话)
   * @param userIds 要邀请的目标用户 ID 数组
   * @param channelDescription 可选频道描述信息
   * @param rtcConfig 可选 RTC 通话配置 (如 video/audio 是否开启)
   * @returns 返回生成的 channelId
   */
  createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: IRTCStreamConfig): Promise<string>;

  /**
    * 解析并校验 RTC 频道邀请消息，返回可用于后续入会的频道信息
   * @param inviteMsg 邀请消息内容对象
   * 来源说明：通常来自 RTM 的消息回调（如 onMessageReceived 的 payload.message），
   * 其消息类型应为 RTC_INVITE，可直接传入字符串或已反序列化对象
   * @returns 包含加入的频道信息、描述和相关配置
   */
    parseRTCChannelInvite(inviteMsg: RTCChannelInviteMessage): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: IRTCStreamConfig }>;

  /**
   * 向目标用户发起一对一呼叫请求（通过 RTM 信令协商频道）
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
   * @param targetUserId 目标用户 ID
   * @param mediaType 呼叫媒体类型：视频/音频/混合
   * @returns 生成的 channelId
   */
  callPeer(targetUserId: string, mediaType?: 'video' | 'audio' | 'mixed'): Promise<string>;

  /**
   * 接受目标用户发来的呼叫请求
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
   * @param targetUserId 发起方用户 ID
   * @param channelId 协商后的频道 ID
   */
  acceptCall(targetUserId: string, channelId: string): Promise<void>;

  /**
   * 拒绝目标用户发来的呼叫请求
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
   * @param targetUserId 发起方用户 ID
   */
  rejectCall(targetUserId: string): Promise<void>;

  /**
   * 结束与目标用户的通话（可选带上 channelId）
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
   * @param targetUserId 目标用户 ID
   * @param channelId 可选频道 ID
   */
  endCall(targetUserId: string, channelId?: string): Promise<void>;

  /**
   * 创建通用会话邀请（游戏对战/组队/协作等）
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
   * 适用于需要双方协商进入同一房间的场景，如格斗游戏挑战、棋牌组队等。
   * 底层通过 RTM 单聊向对方发送 DC_RTC_PERSISTENT_SESSION_REQUEST 信令，
   * 并自动生成 channelId 供双方后续 joinRoom 使用。
   * 对方通过监听 onPersistentSessionRequest 事件接收邀请。
   * 区别于 callPeer（语音/视频通话），本方法不绑定媒体类型，sessionDescription 可自由填写游戏场景描述。
   * @param targetUserId 目标用户 ID
   * @param sessionDescription 可选会话描述，如 '格斗游戏挑战'、'象棋对局' 等
  * 推荐游戏实时互动场景：双方后续使用
  * joinRoom(channelId, { audioPublish: false, videoPublish: false, screenPublish: false })
  * 进入纯消息房间，避免按音视频/屏幕共享能力计价。
  * @returns 生成的 channelId，双方均需用此 ID 调用 joinRoom
   */
  createPersistentSession(targetUserId: string, sessionDescription?: string): Promise<string>;

  /**
   * 接受对方发来的通用会话邀请
   * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
  * 接受后应立即调用
  * joinRoom(channelId, { audioPublish: false, videoPublish: false, screenPublish: false })
  * 进入纯消息游戏房间，发起方监听 onPersistentSessionAccept 事件后也按同样参数进房。
   * @param targetUserId 发起方用户 ID
   * @param channelId 邀请中携带的频道 ID
   */
  acceptPersistentSession(targetUserId: string, channelId: string): Promise<void>;

  /**
   * 开启或关闭本地摄像头
   * @param mute 如果为 true，则停止并关闭本地视频轨道发送；如果是 false，则重新开启并发送
   */
  muteLocalCamera(mute: boolean): Promise<void>;

  /**
   * 开启或关闭本地麦克风
   * @param mute 如果为 true，则静音麦克风停止发送本地音频；如果是 false，则恢复
   */
  muteLocalMic(mute: boolean): Promise<void>;

  /**
   * 静音远端音频（本地扬声器）
   * @param mute 如果为 true，则屏蔽（静音）远端传来的声音；若false 则恢复声音
   */
  muteRemoteAudio(mute: boolean): Promise<void>;

  /**
   * 获取所有可用的摄像头设备列表
   * @returns 摄像头设备信息对象的数组 (支持多摄像头选择和切换)
   */
  getCameras(): Promise<IRTCCameraDevice[]>;

  /**
   * 动态切换指定的摄像头
   * @param deviceId 设备 ID (可通过 getCameras() 函数获得)
   */
  switchCamera(deviceId: string): Promise<void>;

  /**
   * 开启屏幕共享
   * @param config 可选的屏幕共享相关配置参数 (如清晰度、帧率设置等)
   */
  startScreenShare(config?: IRTCScreenShareConfig): Promise<void>;

  /**
   * 停止屏幕共享
   */
  stopScreenShare(): Promise<void>;

  /**
   * 为远端用户设置挂载的屏幕共享的视频 DOM 元素
   * @param userId 目标远端用户 ID
   * @param element 需要挂载屏幕共享画面的 DOM 元素，传入 null 则取消挂载
   */
  setDisplayRemoteScreenShare(userId: string, element: HTMLElement | null): Promise<void>;

  /**
   * 为远端用户设置挂载的视频 DOM 元素
   * @param userId 目标远端用户 ID
   * @param element 需要挂载视频的 DOM 元素，传入 null 则取消挂载
   * @param streamType 可选参数，拉取的视频流分级（如高/低清晰度等配置映射）
   */
  setDisplayRemoteVideo(userId: string, element: HTMLElement | null, streamType?: number): Promise<void>;

  /**
   * 为本地用户设置挂载的视频 DOM 元素
   * @param element 需要渲染本地画面的 DOM 元素，传入 null 则取消本地画面预览
   */
  setDisplayLocalVideo(element: HTMLElement | null): Promise<void>;

  /**
   * RTM 消息发送：给用户发单聊消息 (通常是在 RTC 过程中利用内置的 RTM 旁路通道收发信令)
    * 前置条件：需在 init(authInfo) 时传入 enableRTM: true，确保已创建 RTC 内置 RTM client。
    * 适用于游戏实时互动中的“房间内发给某个人”：如私聊、定向战术指令、点对点状态同步
    *
    * 实现机制说明（便于理解代码行为）：
    * 1) 监听与收消息依赖 RTM 主长连接（登录后保持在线）
    * 2) 主动发送默认走短连接链路，不复用监听长连接
    * 3) 每次发送会使用临时发送身份（当前 userId + "_s"）并动态申请 token
    * 4) 发送流程为 connect -> publish -> disconnect，因此会看到“每次发送都取一次 token”
   * @param userId 目标接收用户的 ID
   * @param message 要发送的消息内容
   * @param requireAck 是否需要目标返回收到确认，默认 true
   * @param sendOffline 目标不在线时，是否进行离线发送（当底层服务支持时），默认 false
   * @returns 成功发送的状态与类型
   */
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean, sendOffline?: boolean): Promise<'success' | 'offline' | 'failed'>;

  /**
   * RTM 消息发送：给当前频道内发群聊消息 (广播到房间所有人)
    * 前置条件：需在 init(authInfo) 时传入 enableRTM: true，确保已创建 RTC 内置 RTM client。
    * 适用于游戏实时互动中的“发到聊天室”：如公共聊天、系统播报、团队状态广播
   * @param message 要发出的信息或信令串
   */
  sendMessageToSession(message: string): Promise<void>;

  /**
   * 注册 RTC/RTM 事件监听
   * @param event 事件名称 (通常有 'user-published', 'user-left', 'MessageFromPeer' 等)
   * @param callback 触发该事件时的回调处理函数
   */
  on<E extends CallSignalEvent>(event: E, callback: (payload: CallSignalEventPayloadMap[E]) => void): void;
  on(event: string, callback: RTCGenericEventCallback): void;
  
  /**
   * 移除事件监听
   * @param event 事件名称
   * @param callback 之前注册的回调函数对象引用
   */
  off<E extends CallSignalEvent>(event: E, callback: (payload: CallSignalEventPayloadMap[E]) => void): void;
  off(event: string, callback: RTCGenericEventCallback): void;
}
