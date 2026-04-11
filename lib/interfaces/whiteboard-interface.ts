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
   * 初始化 SDK 和认证信息
   */
  init(authInfo: any): Promise<void>;

  /**
   * 加入频道，独立使用白板时使用
   */
  joinChannel(joinInfo: any): Promise<void>;

  /**
   * 加入房间，用于支持指定房间号允许多人加入白板
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
   */
  getWhiteboard(whiteboardId: string): IRtcWhiteboard | Promise<IRtcWhiteboard>;

  /**
   * 获取一个标注实例 
   */
  getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): any | Promise<any>;

  /**
   * 事件监听的绑定
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
   */
  callPeer?(targetUserId: string): Promise<string>;

  /**
   * 接受白板请求
   */
  acceptCall?(targetUserId: string, sessionId: string): Promise<void>;

  /**
   * 拒绝白板请求
   */
  rejectCall?(targetUserId: string): Promise<void>;

  /**
   * 结束白板请求
   */
  endCall?(targetUserId: string, sessionId?: string): Promise<void>;

  /**
   * 创建多人白板邀请
   */
  createWhiteboardSession?(userIds: string[], sessionDescription?: string, config?: any): Promise<string>;

  /**
   * 接受多人白板邀请
   */
  acceptWhiteboardInvite?(inviteMsg: any): Promise<{ sessionId: string; sessionDescription?: string; config?: any }>;
}
