import { Direction } from "../common/define";
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
   * @returns 创建的keyvalue数据库实例和可能的错误信息
   */
  createStore(appId: string,theme: string, space: number, type: KeyValueStoreType): Promise<[KeyValueDB|null, Error | null]>;

  /**
   * 获取指定主题的keyvalue数据库
   * @param appId 应用ID
   * @param theme 主题名称
   * @param themeAuthor 数据库创建者的公钥
   * @returns keyvalue数据库实例
   */
  getStore(appId: string, theme: string, themeAuthor: string): Promise<[KeyValueDB|null, Error | null]> ;

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
  ): Promise<[number | null, Error | null]>;

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
     * 获取当前用户自身的kevdb授权信息,用户自己调用
     * @param kvdb keyvalue数据库实例
     * @param vaccount 可选的虚拟账户
     * @returns [授权配置, 错误信息]
     */
    GetUserOwnAuth(
      kvdb: KeyValueDB,
      vaccount?: string
    ): Promise<[ThemeAuthInfo | null, Error | null]>;
  
    /**
       * 获取指定用户授权信息
       * @param kvdb keyvalue数据库实例
       * @param userPubkey 用户公钥
       * @param vaccount 可选的虚拟账户
       * @returns [授权信息, 错误信息]
       */
      GetUserAuth(
         kvdb: KeyValueDB,
         userPubkey: string,
         vaccount?: string
      ): Promise<[ThemeAuthInfo | null, Error | null]>;
  
  /**
   * 设置键值对，支持索引功能
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param value 值内容
   * @param indexs 索引列表，格式为json字符串:[{key:"indexkey1",type:"string",value:"value"},{key:"indexkey2",type:"number", value:12}],设置索引后,后续查询可以通过索引快速定位
   * @param vaccount 可选的虚拟账户
   * @returns [是否设置成功, 时间戳, 错误信息]
   */
  set(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]>;


/**
   * 获取当前用户设置的指定键的元数据
   * @param kvdb 
   * @param key 
   * @param vaccount 
   * @returns  [值, 错误信息],值的格式:  value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
   getValueSetByCurrentUser(kvdb: KeyValueDB, key: string,vaccount?: string): Promise<[string | null, Error | null]> ;
 

  /**
   * 获取指定键的值
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param writerPubkey 写入者的公钥,如果不指定，则获取所有用户写入的该key的最新值
   * @param vaccount 可选的虚拟账户
   * @returns [值内容, 错误信息] 值的格式:  value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  get(
    kvdb: KeyValueDB,
    key: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]>;


 /**
   * 获取指定键的值列表,按key的字典序排序
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param limit 返回结果数量限制
   * @param seekKey 查询起始键,用于分页查询
   * @param direction 查询方向
   * @param offset 结果偏移量
   * @param vaccount 可选的虚拟账户
   * @returns [值列表数组生成的json字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  getValues(
    kvdb: KeyValueDB,
    key: string,
    options: { limit?: number; seekKey?: string; direction?: Direction; offset?: number } ,
    vaccount?: string
  ): Promise<[string | null, Error | null]>;


  /**
   * 批量获取多个键的值
   * @param kvdb: KeyValueDB,
   * @param keys 多个键名，逗号分隔
   * @param writerPubkey 写入者的公钥,可选,默认为主题作者
   * @param vaccount 可选的虚拟账户
   * @returns [值列表数组生成的json字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  getBatch(
    kvdb: KeyValueDB,
    keys: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]>;

  /**
   * 通过索引查询键值对
   * @param kvdb: KeyValueDB,
   * @param indexKey 索引键名
   * @param indexValue 索引值
   * @param type 索引值类型
   * @param seekKey 查询起始键
   * @param offset 结果偏移量
   * @param direction 查询方向 (Forward/Backward)
   * @param limit 返回结果数量限制
   * @param vaccount 可选的虚拟账户
   * @returns [值列表数组生成的json字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  getWithIndex(
    kvdb: KeyValueDB,
    indexKey: string,
    indexValue: string,
    options: { type?:string; limit?: number; seekKey?: string; direction?: Direction; offset?: number } ,
    vaccount?: string
  ): Promise<[string | null, Error | null]>;
}