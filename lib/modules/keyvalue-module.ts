// modules/keyvalue-module.ts
// 键值存储功能模块

import {  IKeyValueOperations } from "../interfaces/keyvalue-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { KeyValueManager, KeyValueStoreType, KeyValueDB } from "../implements/keyvalue/manager";
import { ThemeManager } from "../implements/cache/manager";
import { createLogger } from "../util/logger";
import { ThemeAuthInfo, ThemeComment } from "../common/types/types";
const logger = createLogger('KeyValueModule');

/**
 * 键值存储模块
 * 提供键值存储功能
 */
export class KeyValueModule implements DCModule, IKeyValueOperations {
  readonly moduleName = CoreModuleName.KEYVALUE;
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
   * @param appId 应用ID
   * @param themeAuthor 主题作者
   * @param theme 主题名称
   * @param space 空间大小
   * @param type 主题类型
   * @returns 创建结果
   */
  async createStore(
    appId: string,
    theme: string,
    space: number,
    type: KeyValueStoreType
  ): Promise<KeyValueDB> {
    this.assertInitialized();
    
    try {
      const kvdb = await this.keyValueManager.createStore(
        appId,
        theme,
        space,
        type
      );
      if(kvdb[1]) {
        throw kvdb[1];
      }
      return kvdb[0];
    } catch (error) {
      logger.error(`创建存储主题 ${theme} 失败:`, error);
      throw error;
    }
  }

  
  async getStore(
    appId: string,
    theme: string,
    themeAuthor: string
  ): Promise<KeyValueDB> {
    this.assertInitialized();
    try {
      const kvdb = await this.keyValueManager.getKeyValueDB(
        appId,
        theme,
        themeAuthor
      );
      if(kvdb[1]) {
        throw kvdb[1];
      }
      return kvdb[0];
    } catch (error) {
      logger.error(`获取存储主题 ${theme} 失败:`, error);
      throw error;
    }
  }
  

  
   async configAuth(
    kvdb: KeyValueDB,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number, Error | null]> {
    this.assertInitialized();
    
    try {
       const res = await kvdb.configAuth(authPubkey, permission, remark, vaccount);
      return res;
    } catch (error) {
      logger.error(`配置权限失败:`, error);
      throw error;
    }
  }
   async getAuthList(
    kvdb: KeyValueDB,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await kvdb.getAuthList(vaccount);
      return res;
    } catch (error) {
      logger.error(`获取权限列表失败:`, error);
      throw error;
    }
  }
  
  
  async set(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string, //索引列表,格式为key1:value1$$$key2:value2
    vaccount?: string
  ): Promise<[boolean, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await kvdb.set(key, value, indexs, vaccount);
      return res;
    } catch (error) {
      logger.error(`设置key-value失败:`, error);
      throw error;
    }
  }

  
  async get(
    kvdb: KeyValueDB,
    key: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await kvdb.get(key, writerPubkey, vaccount);
      return res;
    } catch (error) {
      logger.error(`获取key-value失败:`, error);
      throw error;
    }
  }

  
  async getBatch(
    kvdb: KeyValueDB,
    keys: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await kvdb.getBatch(writerPubkey, keys, vaccount);
      return res;
    } catch (error) {
      logger.error(`获取key-value失败:`, error);
      throw error;
    }
  }

   async getWithIndex(
    kvdb: KeyValueDB,
    indexKey:string,
    indexValue:string,
    limit: number,
    seekKey:string, 
    offset: number,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await kvdb.getWithIndex(indexKey, indexValue, limit,seekKey, offset,  vaccount);
      return res;
    } catch (error) {
      logger.error(`获取key-value失败:`, error);
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