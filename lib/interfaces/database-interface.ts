import ThreadID from "@textile/threads-id";
import { ICollectionConfig, IDBInfo } from "../implements/threaddb/core/core";

/**
 * 数据库操作接口,这个数据库主要由threadid确保唯一,servicekey,readkey多重加密来确保数据安全,其中readkey永远不离开用户,servicekey会在DC云端的TEE环境中参与数据备份
 * 提供基于ThreadDB的分布式数据库管理功能
 */
export interface IDatabaseOperations {

  
  /**
   * 初始化数据库管理器
   * 创建数据库操作所需的组件和服务
   * @returns 错误信息
   */
  initDBManager(): Promise<Error| null>;

  resetDBManager(): void;
  
  /**
   * 创建新数据库
   * @param name 数据库名称
   * @param b32Rk base32编码的读取密钥
   * @param b32Sk base32编码的服务密钥
   * @param jsonCollections 集合配置数组，定义数据库中的集合结构
   * @returns 创建的线程ID和错误信息
   */
  newDB(
    name: string,
    b32Rk: string,
    b32Sk: string,
    jsonCollections: ICollectionConfig[]
  ): Promise<[string| null, Error | null]>;
  
  /**
   * 从分布式网络同步数据库
   * @param threadid 线程ID
   * @param dbname 数据库名称  
   * @param dbAddr 数据库地址
   * @param b32Rk base32编码的读取密钥
   * @param b32Sk base32编码的服务密钥  
   * @param block 是否阻塞等待同步完成
   * @param collectionInfos 集合配置数组，定义数据库中的集合结构
   * @returns 错误信息或null表示成功
   */
  syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]  
  ): Promise<Error| null>;
  
  /**
   * 刷新数据库，从分布式网络获取最新数据
   * @param threadid 数据库线程ID
   * @returns 错误信息或null表示成功
   */
  refreshDBFromDC(threadid: string): Promise<Error | null>;
  
  /**
   * 同步数据库到分布式网络
   * @param tId 线程ID
   * @returns 错误信息或null表示成功
   */
  syncDBToDC(tId: string): Promise<Error | null>;
  


  // 自动扩展数据库空间
  autoExpandDBSpace(threadId: string, expandSpace: number): Promise<boolean> ; 
  
/**
 * 获取数据库信息
 * @param id threaddbID
 * @returns 数据库信息字符串,或错误
 */ 
 getDBInfo(id: string): Promise<[IDBInfo|null, Error|null]>  ;


  /**
   * 升级集合结构
   * @param threadId 线程ID
   * @param collections 集合配置列表
   * @returns 错误信息或null
   */
  upgradeCollections(threadId: string, collections: ICollectionConfig[]): Promise<Error | null> ;

  /**
   * 关闭数据库管理器
   * @throws 关闭失败时抛出错误
   */
  close(): Promise<Error | null>;
  
  /**
   * 在集合中创建新对象实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param jsonInstance JSON字符串表示的实例对象
   * @returns 创建的实例ID,或错误
   */
  create(threadId: string, collectionName: string, jsonInstance: string): Promise<[string| null, Error | null]>;
  
  /**
   * 通过ID删除实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param instanceID 要删除的实例ID
   * @throws 删除失败时抛出错误
   */
  delete(threadId: string, collectionName: string, instanceID: string): Promise<Error | null>;
  
  /**
   * 更新已存在的实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param instance JSON字符串表示的实例对象
   * @throws 更新失败时抛出错误
   */
  save(threadId: string, collectionName: string, instance: string): Promise<Error | null>;
  
  /**
   * 批量删除多个实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param instanceIDs 逗号分隔或JSON数组表示的实例ID列表
   * @throws 删除失败时抛出错误
   */
  deleteMany(threadId: string, collectionName: string, instanceIDs: string): Promise<Error | null>;
  
  /**
   * 检查指定实例是否存在
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param instanceID 要检查的实例ID
   * @returns 布尔值表示实例是否存在
   */
  has(threadId: string, collectionName: string, instanceID: string): Promise<boolean>;
  
  /**
   * 根据查询条件查找实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param queryString JSON字符串表示的查询条件,
   * 格式举例:(condition表示and条件组合, ors表示或条件组合, sort表示排序, seek表示分页)
   * 格式1: `{"condition":"age=80 and name='John'"}`,"sort":{"fieldPath":"age","desc":true}}`
   * 格式2: `{"ors":[{"condition":"age = 21 and name = 'foo'"}]}`
   * 格式3: `{"condition":"age > 21 ","ors":[{"condition":"age = 21 and name = 'foo'"}],"sort":{"fieldPath":"age","desc":true},skip:10,"seek":"01fyc691gh671nf0s8qpt0ych8"}`
   * @returns JSON字符串表示的查询结果
   * @throws 查询失败时抛出错误
   */
  find(threadId: string, collectionName: string, queryString?: string): Promise<[string | null, Error | null]>;
  
  /**
   * 通过ID查找实例
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param instanceID 实例ID
   * @returns JSON字符串表示的实例
   * @throws 查询失败时抛出错误
   */
  findByID(threadId: string, collectionName: string, instanceID: string): Promise<[string | null, Error | null]>;
  
  /**
   * 获取在指定时间后被修改的实例ID列表
   * @param threadId 线程ID
   * @param collectionName 集合名称
   * @param time 时间戳（毫秒）
   * @returns JSON字符串表示的实例ID列表
   * @throws 查询失败时抛出错误
   */
  modifiedSince(threadId: string, collectionName: string, time: number): Promise<[string | null, Error | null]>;
}