// modules/database-module.ts
// 数据库功能模块

import { DCContext, IDatabaseOperations } from "../interfaces";
import { DCModule, CoreModuleName } from "../module-system";
import { createLogger } from "../util/logger";
import { createTxnDatastore } from "../threaddb/common/idbstore-adapter";
import { newKeyBook } from "../threaddb/lsstoreds/keybook";
import { newAddrBook } from "../threaddb/lsstoreds/addr_book";
import { newHeadBook } from "../threaddb/lsstoreds/headbook";
import { newThreadMetadata } from "../threaddb/lsstoreds/metadata";
import { newLogstore } from "../threaddb/common/logstore";
import { dagCbor } from "@helia/dag-cbor";
import { Network } from "../threaddb/net/net";
import { DBManager } from "../threaddb/dbmanager";
import { ICollectionConfig } from "../threaddb/core/core";

const logger = createLogger('DatabaseModule');
const storagePrefix = "dc-";

/**
 * 数据库模块
 * 提供数据库操作功能
 */
export class DatabaseModule implements DCModule, IDatabaseOperations {
  readonly moduleName = CoreModuleName.DATABASE;
  private context: DCContext;
  private initialized: boolean = false;
  
  /**
   * 初始化数据库模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      // 数据库模块可以按需初始化，所以这里不立即创建DBManager
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("数据库模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭数据库模块
   */
  async shutdown(): Promise<void> {
    // 在这里可以添加关闭数据库连接等清理工作
    this.initialized = false;
  }
  
  /**
   * 初始化数据库管理器
   */
  async initDBManager(): Promise<void> {
    this.assertInitialized();
    
    if (this.context.dbManager) {
      return; // 已经初始化过
    }
    
    try {
      const tdatastore = await createTxnDatastore(this.context.appInfo.name);
      const keyBook = await newKeyBook(tdatastore);
      const addrBook = await newAddrBook(tdatastore);
      const headBook = newHeadBook(tdatastore);
      const threadMetadata = newThreadMetadata(tdatastore);
      const logstore = newLogstore(keyBook, addrBook, headBook, threadMetadata);
      const dagService = dagCbor(this.context.dcNodeClient);
      
      if (!this.context.publicKey) {
        throw new Error("公钥未初始化");
      }
      
      const net = new Network(
        this.context.dcutil,
        this.context.dcChain,
        this.context.dcNodeClient.libp2p,
        this.context.grpcServer,
        logstore,
        this.context.dcNodeClient.blockstore,
        dagService,
        this.context.privKey
      );
      
      const dbmanager = new DBManager(
        tdatastore,
        net,
        this.context.dcutil,
        this.context.connectedDc,
        {},
        this.context.dcChain,
        storagePrefix,
        this.context
      );
      
      this.context.dbManager = dbmanager;
      logger.info("数据库管理器初始化成功");
    } catch (error) {
      logger.error("初始化数据库管理器失败:", error);
      throw error;
    }
  }
  
  /**
   * 创建新数据库
   * @param name 数据库名称
   * @param b32Rk 读取密钥
   * @param b32Sk 写入密钥
   * @param jsonCollections 集合配置
   * @returns 线程ID
   */
  async newDB(
    name: string,
    b32Rk: string,
    b32Sk: string,
    jsonCollections: ICollectionConfig[]
  ): Promise<string> {
    this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
    
    try {
      // 创建数据库
      const [threadId, err] = await this.context.dbManager.newDB(name, b32Rk, b32Sk, jsonCollections);
      if (err) {
        logger.error("创建数据库失败:", err);
        throw err;
      }
      
      logger.info(`创建数据库 ${name} 成功，线程ID: ${threadId}`);
      return threadId;
    } catch (error) {
      logger.error(`创建数据库 ${name} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 从DC同步数据库
   * @param threadid 线程ID
   * @param dbname 数据库名称
   * @param dbAddr 数据库地址
   * @param b32Rk 读取密钥
   * @param b32Sk 写入密钥
   * @param block 是否阻塞
   * @param collectionInfos 集合配置
   */
  async syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]  
  ): Promise<void> {
    this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
    
    try {
      await this.context.dbManager.syncDBFromDC(
        null,
        threadid,
        dbname,
        dbAddr,
        b32Rk,
        b32Sk,
        block,
        collectionInfos
      );
      
      logger.info(`从DC同步数据库 ${dbname} 成功`);
    } catch (error) {
      logger.error(`从DC同步数据库 ${dbname} 失败:`, error);
      throw error;
    }
  }
  
  // /**
  //  * 创建数据库查询
  //  * @param collectionName 集合名称
  //  * @param threadId 线程ID
  //  * @returns 查询对象
  //  */
  // async createQuery(collectionName: string, threadId: string): Promise<any> {
  //   this.assertInitialized();
  //   await this.initDBManager();
    
  //   if (!this.context.dbManager) {
  //     throw new Error("数据库管理器未初始化");
  //   }
    
  //   try {
  //     return this.context.dbManager.newQuery(collectionName, threadId);
  //   } catch (error) {
  //     logger.error(`创建查询失败:`, error);
  //     throw error;
  //   }
  // }
  
  // /**
  //  * 创建数据库事务
  //  * @param threadId 线程ID
  //  * @returns 事务对象
  //  */
  // async createTransaction(threadId: string): Promise<any> {
  //   this.assertInitialized();
  //   await this.initDBManager();
    
  //   if (!this.context.dbManager) {
  //     throw new Error("数据库管理器未初始化");
  //   }
    
  //   try {
  //     return this.context.dbManager.newTransaction(threadId);
  //   } catch (error) {
  //     logger.error(`创建事务失败:`, error);
  //     throw error;
  //   }
  // }
  
  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("数据库模块未初始化");
    }
  }
}