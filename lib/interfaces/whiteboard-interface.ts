export type ShapeType = string | number; // simplified based on standard SDK tool types
export enum WBToolType {
  Click = 'click',
  Select = 'select',
  Pen = 'pen',
  Line = 'line',
  Rect = 'rect',
  Square = 'square',
  Ellipse = 'ellipse',
  Circle = 'circle',
  Text = 'text',
  Triangle = 'triangle',
  Rhombic = 'rhombic',
  Arrow = 'arrow',
  Delete = 'delete',
  Image = 'image',
  Stamp = 'stamp',
  Video = 'video',
  Audio = 'audio',
  Eraser = 'eraser',
  Brush = 'eraser',
  EraserIndicator = 'eraserIndicator',
  LaserPointer = 'laserPointer',
  Cursor = 'cursor',
  Drag = 'drag'
}
export type ImageScalingMode = 'auto' | 'fillWidth' | 'fillHeight';
export interface IWhiteboardTokenRefreshErrorEvent {
  channelId: string;
  phase: 'initial' | 'periodic';
  error: Error;
  message: string;
  failureCount: number;
  retryInMs: number;
  nextRetryAt: number;
  timestamp: number;
}
export enum WBRoleType {
  Admin = 'Admin',
  Attendee = 'Attendee',
  Viewer = 'Viewer'
}
export type WBClearType = 'all' | 'draws' | 'backgroundImage';

export interface IRtcWhiteboard {
  isConnected: boolean;
  users: { userId: string }[];
  tabletScale: number;
  tabletMatchMode: 'fitWidth' | 'fitHeight';
  tabletTranslate: [number, number];
  tabletWriteMode: 'static' | 'sticky';
  sizeConfig: { width: number; height: number; limited: boolean };
  bgScaleMode: ImageScalingMode;
  backgroundColor: string;
  fontSize: number;
  bold: boolean;
  dashed: boolean;
  italic: boolean;
  lineWidth: number;
  fillType: 'none' | 'color';
  fillStyle: string;
  strokeStyle: string;
  role: WBRoleType;
  isAdmin: boolean;
  scale: number;
  pages: number;
  activeDocId: string;
  activeDoc: any; // Doc

  open(wrapperEle: HTMLElement): Promise<void>;
  leave(): void;
  stop(): void;
  close(): void;
  reset(): void;
  undo(): void;
  redo(): void;
  setToolType(insertType: ShapeType | number): void;
  joinSession(): void;
  addBackgroundImages(urls: string[], docName?: string, docId?: string): void;
  addImageShape(url: string): Promise<void>;
  addStamp(stampId: string, url: string, resizable: boolean): void;
  addPdfDoc(url: string, name: string, docId?: string, fileKey?: string): string;
  addPage(autoSwitch?: boolean): any;
  alignVision(): void;
  center(doc?: any): void;
  clearDocContents(docId: string, clearType: WBClearType): void;
  clearContents(curPage: boolean, clearType: WBClearType): void;
  clearUserContents(userId: string, curPage: boolean, clearType: WBClearType): void;
  createDoc(totalPages: number, docName: string, width?: number, height?: number, docId?: string): void;
  deleteDoc(docId: string, switchDocId?: string): void;
  disableCursorSync(): void;
  disableWheelScale(): void;
  disableScaleAndMove(): void;
  enableCursorSync(): void;
  enableScaleAndMove(): void;
  enableWheelScale(): void;
  enumerateDocs(): { docId: string; name: string; creator: string; currentPage: number; fileKey: string; }[];
  getCurrentPageNumber(): number;
  getTotalNumberOfPages(): number;
  getCursorSyncType(): 'all' | 'write';
  getTranslate(): { x: number; y: number; };
  getToolType(): ShapeType | number;
  getStatistics(): { userId: string; shapes: any[] }[];
  insertPage(pageIndex: number, autoSwitch?: boolean, docId?: string, autoSwitchToDoc?: boolean): any;
  prevPage(): void;
  nextPage(): void;
  removePage(index?: number, docId?: string): void;
  initVision(width: number, height: number, limited?: boolean): void;
  setBackgroundImage(url: string): any;
  setRoleType(roleType: WBRoleType): void;
  setBackgroundImageScalingMode(scaleMode: ImageScalingMode): void;
  setStamp(stampId: string): void;
  setShapesVisible(enabled: boolean, hideBackgroundImg?: boolean): void;
  setTranslate(x: number, y: number, smooth?: boolean, duration?: number): void;
  setSelectedShapeStyle(style: { lineWidth?: number; strokeStyle?: string; fillStyle?: string; fillType?: string; }): void;
  setSelectedShapeFontStyle(style: { italic?: boolean; bold?: boolean; fontSize?: number; }): void;
  setCursorSyncType(type: 'write' | 'all'): void;
  startFollowVision(): void;
  stopFollowVision(): void;
  startVisionShare(): void;
  stopVisionShare(): void;
  switchToDoc(docId: string): void;
  snapshot(autoDownload?: boolean, mode?: 'all' | 'view', format?: 'png' | 'jpeg', quality?: number): Promise<string>;
  transcodeFile(params: { targetType: 'png' | 'jpg' | 'pdf'; onUploadProgress?: (state: { total: number; loaded: number; }) => void; onTranscodeProgress?: (status: 'init' | 'processing' | 'success' | 'failed') => void; }): Promise<{ pageCount: number; url: string[]; fileName: string; docId: string; }>;
  uploadImage(setAsBackground?: boolean, onProgress?: (state: { total: number; loaded: number; }) => void): Promise<void>;
  uploadPDF(onProgress?: (state: { total: number; loaded: number; }) => void): Promise<{ url: string; fileName: string; docId: string; }>;
  
  on(event: 'user-join', fn: (userId: string) => void): void;
  on(event: 'user-leave', fn: (userId: string) => void): void;
  on(event: 'doc-load-failed', fn: (docId: string, docName: string) => void): void;
  on(event: 'doc-ready', fn: (docId: string) => void): void;
  on(event: 'doc-created', fn: (docId: string) => void): void;
  on(event: 'doc-switched', fn: (docId: string) => void): void;
  on(event: 'doc-deleted', fn: (docId: string) => void): void;
  on(event: 'user-vision-share-start', fn: (userId: string) => void): void;
  on(event: 'user-vision-share-stop', fn: (userId: string) => void): void;
  on(event: 'vision-lock-stop', fn: () => void): void;
  on(event: 'background-image-updated', fn: (docId: string, pageIndex: number, imgUrl: string) => void): void;
  on(event: 'page-index-changed', fn: (activeDocId: string, pageIndex: number, totalPages: number) => void): void;
  on(event: 'viewport-updated', fn: (scale: number, viewport: { minx: number; miny: number; maxx: number; maxy: number; }) => void): void;
  on(event: 'viewport-updated-by-self', fn: () => void): void;
  on(event: 'history-changed', fn: (canUndo: boolean, canRedo: boolean) => void): void;
  on(event: string, fn: Function): void;

  once(event: string, fn: Function): void;
  off(event: string, fn: Function): void;
  removeAllListeners(event?: string): void;
}

export interface IWhiteboardOperations {
  /**
   * 白板开发者快速流程（建议先看）
   *
   * 一、初始化阶段
   * 1) 调用 init(authInfo) 初始化白板 SDK 基础配置。
   * 2) 若后续要使用 callPeer / createWhiteboardSession 等信令方法，
   *    需先确保全局 RTM 已完成初始化（dc.rtm.init()）。
   *
   * 二、加入房间（核心）
   * 1) 通过 joinRoom(roomIdOrJoinInfo) 加入目标白板房间。
   * 2) 该接口支持传 roomId 字符串或完整 joinInfo；若未传 token，
   *    SDK 会按已配置的 aiproxy 参数尝试自动获取 token。
   *
   * 三、获取白板实例并渲染
   * 1) 调用 getWhiteboard(whiteboardId) 获取 IRtcWhiteboard 实例。
   * 2) 调用 whiteboard.open(wrapperEle) 绑定到页面容器。
   * 3) 设置绘制工具 setToolType、样式 setSelectedShapeStyle、翻页 nextPage/prevPage。
   *
   * 四、实时协作常用能力
   * 1) 文档与页面：createDoc / addPdfDoc / addBackgroundImages / addPage / removePage。
   * 2) 视角同步：startVisionShare / stopVisionShare / startFollowVision / stopFollowVision。
   * 3) 事件监听：on('user-join'|'page-index-changed'|'history-changed'|...)。
   *
   * 五、邀请与会话信令（可选）
   * 1) 单人邀请：callPeer -> 对方 acceptCall/rejectCall -> 双方 joinRoom。
   * 2) 多人邀请：createWhiteboardSession -> 对方 acceptWhiteboardInvite -> joinRoom。
   * 3) 上述信令接口均依赖 context 中的全局 RTM 模块。
   *
   * 六、退出与清理
   * 1) leaveChannel() 退出当前白板频道/房间。
   * 2) clear() 清理本地白板/标注缓存。
   */
  /**
   * 初始化 SDK 和认证信息
   * @param authInfo 初始化参数（如 appId/userId/themeAuthor/configTheme/serviceName 等）
   */
  init(authInfo: any): Promise<void>;

  /**
   * 加入频道，独立使用白板时使用
    * 通常等价于 joinRoom(joinInfo)
    * @param joinInfo 入会参数（至少需包含 roomId 或 channelId）
   */
  joinChannel(joinInfo: any): Promise<void>;

  /**
   * 加入房间，用于支持指定房间号允许多人加入白板
    * 支持传入 roomId 字符串，或完整 joinInfo。
    * 当 joinInfo 不含 token 且已配置 aiproxy 时，SDK 可自动尝试获取 token。
    * @param roomIdOrJoinInfo 房间ID或入会参数
   */
  joinRoom?(roomIdOrJoinInfo: string | any): Promise<void>;

  /**
   * 离开频道，独立使用白板时使用
   */
  leaveChannel(): void | Promise<void>;

  /**
   * 清理本地白板/标注缓存实例，可以在离开频道时调用。
   */
  clear(): void | Promise<void>;

  /**
   * 获取一个白板实例
    * 获取后通常调用 open(wrapperEle) 绑定容器，再进行绘制与协作。
    * @param whiteboardId 白板实例 ID
   */
  getWhiteboard(whiteboardId: string): IRtcWhiteboard | Promise<IRtcWhiteboard>;

  /**
   * 获取一个标注实例 
    * @param annotationId 标注实例 ID
    * @param sourceType 标注来源类型
   */
  getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): any | Promise<any>;

  /**
   * 事件监听的绑定
    *
    * 可用于监听 SDK/模块层扩展事件：
    * 1) onTokenRefreshError: token 自动刷新失败
    *    回调参数类型 IWhiteboardTokenRefreshErrorEvent，便于 UI 展示告警和重试提示
   */
  on(event: string, callback: (...args: any[]) => void): void | Promise<void>;

  /**
   * 取消事件监听
   */
  off(event: string, callback: (...args: any[]) => void): void | Promise<void>;

  /**
   * 只监听一次
   */
  once(event: string, callback: (...args: any[]) => void): void | Promise<void>;

  /**
   * 移除全部或指定事件上的监听回调
   */
  removeAllListeners(event?: string): void | Promise<void>;

  /**
   * 发起白板请求
    * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
    * @param targetUserId 目标用户 ID
    * @returns sessionId
   */
  callPeer?(targetUserId: string): Promise<string>;

  /**
   * 接受白板请求
    * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
    * @param targetUserId 发起方用户 ID
    * @param sessionId 会话 ID
   */
  acceptCall?(targetUserId: string, sessionId: string): Promise<void>;

  /**
   * 拒绝白板请求
    * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
    * @param targetUserId 发起方用户 ID
   */
  rejectCall?(targetUserId: string): Promise<void>;

  /**
   * 结束白板请求
    * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
    * @param targetUserId 目标用户 ID
    * @param sessionId 可选会话 ID
   */
  endCall?(targetUserId: string, sessionId?: string): Promise<void>;

  /**
   * 创建多人白板邀请
    * @requires context 中必须已存在已初始化的全局 RTM 模块（dc.rtm.init() 已调用）
    * @param userIds 邀请目标用户 ID 列表
    * @param sessionDescription 会话描述
    * @param config 白板会话附加配置
    * @returns sessionId
   */
  createWhiteboardSession?(userIds: string[], sessionDescription?: string, config?: any): Promise<string>;

  /**
   * 接受多人白板邀请
   * 入参通常来自 RTM 消息回调中的邀请 payload。
   * @param inviteMsg 邀请消息对象或字符串
   * @returns 解包后的会话信息（sessionId/sessionDescription/config）
   */
  acceptWhiteboardInvite?(inviteMsg: any): Promise<{ sessionId: string; sessionDescription?: string; config?: any }>;
}
