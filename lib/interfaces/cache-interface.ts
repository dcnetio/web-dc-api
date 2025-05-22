/**
 * 临时缓存操作接口
 * 提供从分布式网络获取和设置缓存值的功能
 */
export interface ICacheOperations {
  /**
   * 从DC网络获取缓存值
   * @param key 缓存键
   * @returns 缓存值，如果键不存在则返回null
   * @throws 当操作失败时抛出错误
   */
  getCacheValue(key: string): Promise<string | null>;
  
  /**
   * 设置缓存值
   * @param value 缓存值
   * @param expire 可选，过期时间(秒)，默认为一天
   * @returns 设置操作的结果
   * @throws 当操作失败时抛出错误
   */
  setCacheKey(value: string, expire?: number): Promise<any>;
}