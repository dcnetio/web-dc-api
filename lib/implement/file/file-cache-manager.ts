// file-cache-manager.ts
// 文件缓存管理工具

import { createLogger } from "../../util/logger";
import { SeekableFileStream } from "./seekableFileStream";

const logger = createLogger('FileCacheManager');

/**
 * 文件缓存管理器
 * 负责管理可寻址文件流的缓存，提高性能并减少网络负担
 */
export class FileCacheManager {
  // 文件缓存相关属性
  private seekableFileStreamCache: Map<string, {
    stream: SeekableFileStream,
    lastAccessTime: number
  }> = new Map();
  
  private readonly CACHE_TIMEOUT: number;
  private cacheCleanupInterval: NodeJS.Timeout | null = null;
  
  /**
   * 创建文件缓存管理器
   * @param timeout 缓存超时时间(毫秒)，默认100秒
   */
  constructor(timeout: number = 100000) {
    this.CACHE_TIMEOUT = timeout;
    this.startCacheCleanupTask();
  }
  
  /**
   * 获取缓存的文件流，如果不存在则返回null
   * @param ipfsPath IPFS路径
   * @param decryptKey 解密密钥
   * @returns 缓存的文件流或null
   */
  getCachedFileStream(ipfsPath: string, decryptKey: string): SeekableFileStream | null {
    const cacheKey = `${ipfsPath}_${decryptKey}`;
    const cachedItem = this.seekableFileStreamCache.get(cacheKey);
    
    if (cachedItem) {
      logger.info(`使用缓存的SeekableFileStream: ${cacheKey}`);
      // 更新最后访问时间
      cachedItem.lastAccessTime = Date.now();
      return cachedItem.stream;
    }
    
    return null;
  }
  
  /**
   * 将文件流添加到缓存
   * @param ipfsPath IPFS路径
   * @param decryptKey 解密密钥
   * @param fileStream 文件流对象
   */
  cacheFileStream(ipfsPath: string, decryptKey: string, fileStream: SeekableFileStream): void {
    const cacheKey = `${ipfsPath}_${decryptKey}`;
    logger.info(`创建新的SeekableFileStream缓存: ${cacheKey}`);
    
    // 将新创建的流保存到缓存，并记录访问时间
    this.seekableFileStreamCache.set(cacheKey, {
      stream: fileStream,
      lastAccessTime: Date.now()
    });
  }
  
  /**
   * 清理文件缓存
   * @param pathname 可选，指定要清理的路径
   */
  clearFileCache(pathname?: string): void {
    if (pathname) {
      // 清理特定路径的缓存
      const pathParts = pathname.split('/');
      let ipfsPath = pathParts[3]; 
      const keyParts = ipfsPath.split('_');
      if (keyParts.length > 1) {
        ipfsPath = keyParts[0];
        const decryptKey = keyParts[1];
        const cacheKey = `${ipfsPath}_${decryptKey}`;
        this.seekableFileStreamCache.delete(cacheKey);
        logger.info(`清理特定缓存: ${cacheKey}`);
      }
    } else {
      // 清理所有缓存
      this.seekableFileStreamCache.clear();
      logger.info('清理所有文件缓存');
    }
  }
  
  /**
   * 启动定时缓存清理任务
   * 超过设定时间未访问的流将被释放
   */
  startCacheCleanupTask(): void {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
    }
    
    this.cacheCleanupInterval = setInterval(() => {
      const now = Date.now();
      let removedCount = 0;
      
      // 检查所有缓存项是否超时
      for (const [key, value] of this.seekableFileStreamCache.entries()) {
        if (now - value.lastAccessTime > this.CACHE_TIMEOUT) {
          // 超过设定时间没有访问，释放资源
          logger.info(`缓存超时，释放资源: ${key}`);
          this.seekableFileStreamCache.delete(key);
          removedCount++;
        }
      }
      
      if (removedCount > 0 || this.seekableFileStreamCache.size > 0) {
        logger.info(`文件缓存清理: 移除 ${removedCount} 项，剩余 ${this.seekableFileStreamCache.size} 项`);
      }
    }, 5000); // 每5秒检查一次超时缓存
  }
  
  /**
   * 停止缓存清理任务
   */
  stopCacheCleanupTask(): void {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
      this.cacheCleanupInterval = null;
    }
  }
  
  /**
   * 获取缓存状态信息
   * @returns 缓存状态信息对象
   */
  getCacheStats(): { total: number, keys: string[] } {
    return {
      total: this.seekableFileStreamCache.size,
      keys: Array.from(this.seekableFileStreamCache.keys())
    };
  }
}