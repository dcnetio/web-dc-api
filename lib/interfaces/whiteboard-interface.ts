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
   * 离开频道，独立使用白板时使用
   */
  leaveChannel(): void;

  /**
   * 清理本地白板/标注缓存实例，可以在离开频道时调用。
   */
  clear(): void;

  /**
   * 获取一个白板实例
   */
  getWhiteboard(whiteboardId: string): any;

  /**
   * 获取一个标注实例 
   */
  getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): any;

  /**
   * 事件监听的绑定
   */
  on(event: string, callback: (...args: any[]) => void): void;

  /**
   * 取消事件监听
   */
  off(event: string, callback: (...args: any[]) => void): void;

  /**
   * 只监听一次
   */
  once(event: string, callback: (...args: any[]) => void): void;

  /**
   * 移除全部或指定事件上的监听回调
   */
  removeAllListeners(event?: string): void;
}
