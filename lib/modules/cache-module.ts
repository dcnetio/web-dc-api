// modules/keyvalue-module.ts
// 键值存储功能模块

import {  ICacheOperations } from "../interfaces/cache-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { CacheManager } from "../implements/cache/manager";
import { keyExpire } from "../common/define";
import { createLogger } from "../util/logger";

const logger = createLogger('CacheModule');

/**
 * 键值存储模块
 * 提供键值存储功能
 */
export class CacheModule implements DCModule, ICacheOperations {
  readonly moduleName = CoreModuleName.CACHE;
  private cacheManager!: CacheManager;
  private initialized: boolean = false;
  
  /**
   * 初始化键值存储模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.cacheManager = new CacheManager(
        context.dcutil,
        context.dcChain,
        context
      );
      
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("键值存储模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭键值存储模块
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
  }
  /**
   * 从dc网络获取缓存值
   * @param key 缓存键
   * @returns 缓存值
   */
  async getCacheValue(key: string): Promise<[string | null, Error | null]>{
    try {
       this.assertInitialized();
      const res = await this.cacheManager.getCacheValue(key);
      if (res[0]) {
        logger.info(`获取缓存键 ${key} 成功`);
        return [res[0], null];
      }
      
      logger.info(`缓存键 ${key} 不存在`);
      return [null, null];
    } catch (error) {
      logger.error(`获取缓存键 ${key} 失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  
  /**
   * 设置缓存值
   * @param value 缓存值
   * @param expire 过期时间
   * @returns 设置结果
   */
  async setCacheKey(value: string, expire?: number): Promise<[string | null, Error | null]> {
    try {
       this.assertInitialized();
      const expireNumber = expire ? expire : keyExpire; // 默认一天
      const res = await this.cacheManager.setCacheKey(value, expireNumber);
      
      logger.info(`设置缓存值成功，过期时间: ${expireNumber}秒`);
      return res;
    } catch (error) {
      logger.error(`设置缓存值失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  
  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("键值存储模块未初始化");
    }
  }
}