import { ThemePermission } from "../common/constants";
import { ThemeAuthInfo, ThemeComment } from "../common/types/types";
import { KeyValueStoreType, KeyValueDB } from "../implements/keyvalue/manager";

/**
 * 键值存储操作接口
 * 提供分布式键值存储的创建、权限管理和数据操作功能
 */
export interface IKeyValueOperations {
  /**
   * 创建key-value存储库
   * @param appId 应用ID
   * @param theme 库主题名称
   * @param space 分配的存储空间大小（字节）
   * @param type 存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权)
   * @returns 创建的keyvalue数据库
   * @throws 当用户空间不足或创建失败时抛出错误
   */
  createStore(appId: string,theme: string, space: number, type: KeyValueStoreType): Promise<KeyValueDB>;

  /**
   * 获取指定主题的keyvalue数据库
   * @param appId 应用ID
   * @param theme 主题名称
   * @param themeAuthor 数据库创建者的公钥
   * @returns keyvalue数据库实例
   */
  getStore(appId: string, theme: string, themeAuthor: string): Promise<KeyValueDB>;

  /**
   * 配置主题的授权信息
   * @param kvdb keyvalue数据库实例
   * @param authPubkey 被授权者的公钥
   * @param permission 权限级别
   * @param remark 备注信息
   * @param vaccount 可选的虚拟账户
   * @returns [授权状态码, 错误信息]
   */
  configAuth(
    kvdb: KeyValueDB,
    authPubkey: string,
    permission: ThemePermission,
    remark: string,
    vaccount?: string
  ): Promise<[number, Error | null]>;

  /**
   * 获取主题的授权列表
   * @param kvdb keyvalue数据库实例
   * @param vaccount 可选的虚拟账户
   * @returns [授权列表,含签名的原始授权列表, 错误信息]
   */
  getAuthList(
    kvdb: KeyValueDB,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]>;

  /**
   * 设置键值对，支持索引功能
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param value 值内容
   * @param indexs 索引列表，格式为"indexkey1:value$$$indexkey2:value",设置索引后,后续查询可以通过索引快速定位
   * @param vaccount 可选的虚拟账户
   * @returns [是否设置成功, 错误信息]
   */
  set(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean, Error | null]>;

  /**
   * 获取指定键的值
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param writerPubkey 写入者的公钥,可选,默认为主题作者
   * @param vaccount 可选的虚拟账户
   * @returns [值内容, 错误信息]
   */
  get(
    kvdb: KeyValueDB,
    key: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string, Error | null]>;


 /**
   * 获取指定键的值列表,包括所有用户写入的值,可以用在类似排名这些需要多人数据汇总的场景,key为场景名称,各个用户写入的值为各自在该场景下的内容
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param limit 返回结果数量限制
   * @param seekKey 查询起始键,用于分页查询
   * @param offset 结果偏移量
   * @param vaccount 可选的虚拟账户
   * @returns [值列表生成的json字符串, 错误信息]
   */
  getValues(
    kvdb: KeyValueDB,
    key: string,
    limit: number,
    seekKey:string, 
    offset: number,
    vaccount?: string
  ): Promise<[string, Error | null]>;


  /**
   * 批量获取多个键的值
   * @param kvdb: KeyValueDB,
   * @param keys 多个键名，逗号分隔
   * @param writerPubkey 写入者的公钥,可选,默认为主题作者
   * @param vaccount 可选的虚拟账户
   * @returns [JSON格式值内容, 错误信息]
   */
  getBatch(
    kvdb: KeyValueDB,
    keys: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string, Error | null]>;

  /**
   * 通过索引查询键值对
   * @param kvdb: KeyValueDB,
   * @param indexKey 索引键名
   * @param indexValue 索引值
   * @param seekKey 查询起始键
   * @param offset 结果偏移量
   * @param limit 返回结果数量限制
   * @param vaccount 可选的虚拟账户
   * @returns [JSON格式查询结果, 错误信息]
   */
  getWithIndex(
    kvdb: KeyValueDB,
    indexKey: string,
    indexValue: string,
    limit: number,
    seekKey: string,
    offset: number,
    vaccount?: string
  ): Promise<[string, Error | null]>;
}