// modules/keyvalue-module.ts
// 键值存储功能模块

import { DCContext, IKeyValueOperations } from "../interfaces";
import { DCModule, CoreModuleName } from "../common/module-system";
import { KeyValueManager } from "../implements/keyvalue/manager";
import { ThemeManager } from "../implements/theme/manager";
import { keyExpire } from "../common/define";
import { createLogger } from "../util/logger";

const logger = createLogger('CacheModule');

/**
 * 键值存储模块
 * 提供键值存储功能
 */
export class CacheeModule implements DCModule, IKeyValueOperations {
  readonly moduleName = CoreModuleName.CACHE;
  private context: DCContext;
  private keyValueManager: KeyValueManager;
  private themeManager: ThemeManager;
  private initialized: boolean = false;
  
  /**
   * 初始化键值存储模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      this.keyValueManager = new KeyValueManager(
        context.dcutil,
        context.connectedDc,
        context.AccountBackupDc,
        context.dcNodeClient,
        context.dcChain,
        context
      );
      
      this.themeManager = new ThemeManager(
        context.connectedDc,
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
   * 创建存储主题
   * @param themeAuthor 主题作者
   * @param theme 主题名称
   * @param space 空间大小
   * @param type 主题类型
   * @returns 创建结果
   */
  async vaCreateStoreTheme(
    themeAuthor: string,
    theme: string,
    space: number,
    type: number
  ): Promise<any> {
    this.assertInitialized();
    
    try {
      const res = await this.keyValueManager.vaCreateStoreTheme(
        this.context.appInfo.id,
        themeAuthor,
        theme,
        space,
        type
      );
      
      logger.info(`创建存储主题 ${theme} 成功`);
      return res;
    } catch (error) {
      logger.error(`创建存储主题 ${theme} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 从dc网络获取缓存值
   * @param key 缓存键
   * @returns 缓存值
   */
  async getCacheValue(key: string): Promise<string | null> {
    this.assertInitialized();
    
    try {
      const res = await this.themeManager.getCacheValue(key);
      if (res[0]) {
        logger.info(`获取缓存键 ${key} 成功`);
        return res[0];
      }
      
      logger.info(`缓存键 ${key} 不存在`);
      return null;
    } catch (error) {
      logger.error(`获取缓存键 ${key} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 设置缓存值
   * @param value 缓存值
   * @param expire 过期时间
   * @returns 设置结果
   */
  async setCacheKey(value: string, expire?: number): Promise<any> {
    this.assertInitialized();
    
    try {
      const expireNumber = expire ? expire : keyExpire; // 默认一天
      const res = await this.themeManager.setCacheKey(value, expireNumber);
      
      logger.info(`设置缓存值成功，过期时间: ${expireNumber}秒`);
      return res;
    } catch (error) {
      logger.error(`设置缓存值失败:`, error);
      throw error;
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