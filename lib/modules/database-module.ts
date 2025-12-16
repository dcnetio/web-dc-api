// modules/database-module.ts
// 数据库功能模块

import { IDatabaseOperations } from "../interfaces/database-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { createLogger } from "../util/logger";
import { createTxnDatastore } from "../implements/threaddb/common/idbstore-adapter";
import { newKeyBook } from "../implements/threaddb/lsstoreds/keybook";
import { newAddrBook } from "../implements/threaddb/lsstoreds/addr_book";
import { newHeadBook } from "../implements/threaddb/lsstoreds/headbook";
import { newThreadMetadata } from "../implements/threaddb/lsstoreds/metadata";
import { newLogstore } from "../implements/threaddb/common/logstore";
import { dagCbor } from "@helia/dag-cbor";
import { DB as ThreadDb } from '../implements/threaddb/db/db';
import { Network } from "../implements/threaddb/net/net";
import { createContext, DBManager } from "../implements/threaddb/dbmanager";
import { ICollectionConfig, IDBInfo, ManagedOptions } from "../implements/threaddb/core/core";
import ThreadID from "@textile/threads-id";

const logger = createLogger('DatabaseModule');
const storagePrefix = "dc-";

/**
 * 数据库模块
 * 提供数据库操作功能
 */
export class DatabaseModule implements DCModule, IDatabaseOperations {
  readonly moduleName = CoreModuleName.DATABASE;
  private context!: DCContext;
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

  
//重置数据库
  async resetDBManager() {
     this.context.dbManager = undefined;
  }

  
  /**
   * 初始化数据库管理器
   */
  async initDBManager(): Promise<Error | null> {
   
    try {
       this.assertInitialized();
    
    if (this.context.dbManager) {
      return null; // 已经初始化过
    }
    let location =  this.context.appInfo?.appId || "default_app";
    const tdatastore = await createTxnDatastore(location);
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
        this.context
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
      await dbmanager.loadDbs();// 加载现有数据库
      this.context.dbManager = dbmanager;
      logger.info("数据库管理器初始化成功");
      return null;
    } catch (error) {
      logger.error("初始化数据库管理器失败:", error);
      return error as Error;
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
  ): Promise<[string| null, Error | null]> {
   
    
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      // 创建数据库
      const [threadId, err] = await this.context.dbManager. newDB(name, b32Rk, b32Sk, jsonCollections);
      if (err) {
        logger.error("创建数据库失败:", err);
        throw err;
      }
      
      logger.info(`创建数据库 ${name} 成功，线程ID: ${threadId}`);
      return [threadId, null] ; // 返回threadId;
    } catch (error) {
      logger.error(`创建数据库 ${name} 失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  async loadVerno(threadId : string): Promise<number> {
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
     const tID = ThreadID.fromString(threadId);
    const db = await this.context.dbManager.getDB(tID);
    
    if (!db) {
      logger.error(`数据库信息为空`);
      return 0; // 返回默认版本号
    }
    const verno = await db.loadVerno();
    return verno;
    } catch (error) {
      logger.error(`加载数据库版本号失败:`, error);
      return 0;
    }
  }

    async saveVerno(threadId: string, verno: number): Promise<number> {
      try {
         this.assertInitialized();
         await this.initDBManager();
      
      if (!this.context.dbManager) {
        throw new Error("数据库管理器未初始化");
      }
      const tID = ThreadID.fromString(threadId);
      const db = await this.context.dbManager.getDB(tID);
      
      if (!db) {
        logger.error(`数据库信息为空`);
        return -1; // 
      }
      await db.saveVerno(verno);
        return 0;
      } catch (error) {
        logger.error(`加载数据库版本号失败:`, error);
        return -1;
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
  ): Promise<Error|null> {
   
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
    
      const ctx = createContext(60000);
      await this.context.dbManager.syncDBFromDC(
        ctx,
        threadid,
        dbname,
        dbAddr,
        b32Rk,
        b32Sk,
        block,
        collectionInfos
      );
      
      logger.info(`从DC同步数据库 ${dbname} 成功`);
      return null;
    } catch (error) {
      logger.error(`从DC同步数据库 ${dbname} 失败:`, error);
      return error instanceof Error ? error : new Error(String(error));
    }
  }



  /**
   * 刷新数据库
   * @param threadid 数据库ID
   * @returns 错误信息或null
   */
  async refreshDBFromDC(threadid: string, verno?: number): Promise<Error | null> {

    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
        await this.context.dbManager.refreshDBFromDC(threadid);  
        return null;  
      } catch (error) {  
        logger.error(`刷新数据库 ${threadid} 失败:`, error);  
        return error as Error;  
      }
  }  
  

  /**
   * 同步数据库到DC
   * @param tId 线程ID
   * @returns 错误信息或null
   */
  async syncDBToDC(tId: string): Promise<Error | null> {  
    
    
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      await this.context.dbManager.syncDBToDC(tId);
      logger.info(`同步数据库 ${tId} 到DC成功`);
      return null;
    } catch (error) {
      logger.error(`同步数据库 ${tId} 到DC失败:`, error);
      return error as Error;
    }
  }  




  /**
   * 升级集合结构
   * @param threadId 线程ID
   * @param collections 集合配置列表
   * @returns 错误信息或null
   */
  async upgradeCollections(threadId: string, collections: ICollectionConfig[]): Promise<Error | null> {
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      await this.context.dbManager.upgradeCollections(threadId, collections);
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * 关闭数据库管理器
   */
async close(): Promise<Error | null> {  
    
    
    try {
      this.assertInitialized();
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      await this.context.dbManager.close();
      logger.info("数据库管理器关闭成功");
      return null;
    } catch (error) {
      logger.error("关闭数据库管理器失败:", error);
      return error instanceof Error ? error : new Error(String(error));
    }
}  





/**
 * 获取数据库信息
 * @param id threaddbID
 * @returns 数据库信息字符串,或错误
 */ 
async getDBInfo(id: string): Promise<[IDBInfo|null, Error|null]> {
  try{
    if (!id || id.length == 0) {
        return [null, new Error("数据库ID不能为空")];
    }

    this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      return [null, new Error("数据库管理器未初始化")];
    } 
    const tid = ThreadID.fromString(id);
    const [dbInfo, err] = await this.context.dbManager.getDBInfo(tid);
    return  [dbInfo, err];
  } catch (error) {
    logger.error(`获取数据库信息失败:`, error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
     * Create creates new instances of objects in a collection
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param jsonInstance JSON string representing the instance
     * @returns Promise resolving to the created instance ID
     * @throws Error if creation fails
     */
async  create(threadId: string, collectionName: string, jsonInstance: string): Promise<[string|null, Error|null]> {
   
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
    
      const instanceId = await this.context.dbManager.create(threadId, collectionName, jsonInstance);
      logger.info(`创建实例成功，ID: ${instanceId}`);
      return [instanceId, null];
    } catch (error) {
      logger.error(`创建实例失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }


  /**
     * Delete deletes an instance by ID
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instanceID Instance ID to delete
     * @throws Error if deletion fails
     */
async delete(threadId: string, collectionName: string, instanceID: string): Promise<Error | null> {
   
    
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      await this.context.dbManager.delete(threadId, collectionName, instanceID);
      logger.info(`删除实例成功，ID: ${instanceID}`);
      return null;
    } catch (error) {
      logger.error(`删除实例失败:`, error);
      return error instanceof Error ? error : new Error(String(error));
    }
  }



/**
 * Save updates an existing instance
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instance JSON string representing the instance
 * @throws Error if update fails
 */
async save(threadId: string, collectionName: string, instance: string): Promise<Error | null> {
    
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
    
      await this.context.dbManager.save(threadId, collectionName, instance);
      logger.info(`更新实例成功`);
      return null;
    } catch (error) {
      logger.error(`更新实例失败:`, error);
      return error instanceof Error ? error : new Error(String(error));
    }
  }


  /**
 * DeleteMany deletes multiple instances by their IDs
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceIDs Comma-separated or JSON array of instance IDs
 * @throws Error if deletion fails
 */
async deleteMany(threadId: string, collectionName: string, instanceIDs: string): Promise<Error | null> {  
   
    
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      await this.context.dbManager.deleteMany(threadId, collectionName, instanceIDs);
      logger.info(`删除多个实例成功`);
      return null;
    } catch (error) {
      logger.error(`删除多个实例失败:`, error);
      return error instanceof Error ? error : new Error(String(error));
    }
  }


  /**
 * Has checks if the specified instance exists
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceID Instance ID to check
 * @returns Promise resolving to a boolean indicating if instance exists
 */
async has(threadId: string, collectionName: string, instanceID: string): Promise<boolean> {  
    
    
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      return await this.context.dbManager.has(threadId, collectionName, instanceID);
    } catch (error) {
      logger.error(`检查实例是否存在失败:`, error);
      return false;
    }
  }


  /**
 * Find finds instances by query
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param queryString JSON string representing the query
 * @returns Promise resolving to a JSON string with found instances
 * @throws Error if query fails
 */
async find(threadId: string, collectionName: string, queryString?: string): Promise<[string|null, Error|null]> {  
   
    
    try {
       this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
      const results =  await this.context.dbManager.find(threadId, collectionName, queryString);
      return [results, null];
    } catch (error) {
      logger.error(`查询实例失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }


  /**
 * FindByID finds an instance by ID
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceID Instance ID to find
 * @returns Promise resolving to a JSON string with found instance
 * @throws Error if query fails
 */
async findByID(threadId: string, collectionName: string, instanceID: string): Promise<[string|null, Error|null]> {
    
    
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
     const result =  await this.context.dbManager.findByID(threadId, collectionName, instanceID);
      return [result, null];
    } catch (error) {
      logger.error(`通过ID查询实例失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
}


/**
 * ModifiedSince returns instance IDs modified since the given time
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param time Unix timestamp in milliseconds
 * @returns Promise resolving to a JSON string with instance IDs
 * @throws Error if query fails
 */
async modifiedSince(threadId: string, collectionName: string, time: number): Promise<[string|null, Error|null]> {
    
    
    try {
      this.assertInitialized();
    await this.initDBManager();
    
    if (!this.context.dbManager) {
      throw new Error("数据库管理器未初始化");
    }
     const results =  await this.context.dbManager.modifiedSince(threadId, collectionName, time);
      return [results, null];
    } catch (error) {
      logger.error(`查询修改时间大于指定时间的实例ID失败:`, error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }


  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("数据库模块未初始化");
    }
  }
}