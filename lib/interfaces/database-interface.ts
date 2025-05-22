import { ICollectionConfig } from "../implements/threaddb/core/core";

/**
 * 数据库操作接口,这个数据库主要由threadid确保唯一,servicekey,readkey多重加密来确保数据安全,其中readkey永远不离开用户,servicekey会在DC云端的TEE环境中参与数据备份
 * 提供基于ThreadDB的分布式数据库管理功能
 */
export interface IDatabaseOperations {
  /**
   * 初始化数据库管理器
   * 创建数据库操作所需的组件和服务
   * @throws 初始化失败时抛出错误
   */
  initDBManager(): Promise<void>;
  
  /**
   * 创建新数据库
   * @param name 数据库名称
   * @param b32Rk base32编码的读取密钥
   * @param b32Sk base32编码的服务密钥
   * @param jsonCollections 集合配置数组，定义数据库中的集合结构
   * @returns 创建的线程ID
   * @throws 创建失败时抛出错误
   */
  newDB(
    name: string,
    b32Rk: string,
    b32Sk: string,
    jsonCollections: ICollectionConfig[]
  ): Promise<string>;
  
  /**
   * 从分布式网络同步数据库
   * @param threadid 线程ID
   * @param dbname 数据库名称  
   * @param dbAddr 数据库地址
   * @param b32Rk base32编码的读取密钥
   * @param b32Sk base32编码的服务密钥  
   * @param block 是否阻塞等待同步完成
   * @param collectionInfos 集合配置数组，定义数据库中的集合结构
   * @throws 同步失败时抛出错误
   */
  syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]  
  ): Promise<void>;
  
  /**
   * 创建数据库查询
   * @param collectionName 集合名称
   * @param threadId 线程ID
   * @returns 查询对象
   * @throws 创建查询失败时抛出错误
   */
  // createQuery(collectionName: string, threadId: string): Promise<any>;
  
  /**
   * 创建数据库事务
   * @param threadId 线程ID
   * @returns 事务对象
   * @throws 创建事务失败时抛出错误
   */
  // createTransaction(threadId: string): Promise<any>;
}