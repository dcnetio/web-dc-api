import { Direction } from "../common/define";
import { ThemePermission } from "../common/constants";
import { ThemeAuthInfo, ThemeComment } from "../common/types/types";
import { KeyValueStoreType, KeyValueDB } from "../implements/keyvalue/manager";

/**
 * 键值存储操作接口
 * 提供分布式键值存储的创建、权限管理和数据操作功能
 *
 * 主题分两类：普通主题(按用户分区，每个用户各存一份)与共享型主题(同一个 key 全局只保留唯一最新值)。
 * 共享型主题通过 createSharedStore 创建，详见该方法说明。
 */
export interface IKeyValueOperations {
  /**
   * 创建key-value存储库
   * @param appId 应用ID
   * @param theme 库主题名称(普通主题按用户分区存储，每个用户各存一份)。
   *              若需要"同一个 key 全局只保留唯一最新值"的共享语义，请改用 createSharedStore。
   * @param space 分配的存储空间大小（字节）
   * @param type 存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权)
   * @returns 创建的keyvalue数据库实例和可能的错误信息
   */
  createStore(appId: string,theme: string, space: number, type: KeyValueStoreType): Promise<[KeyValueDB|null, Error | null]>;

  /**
   * 创建共享型 key-value 存储库：同一个 key 全局只保留唯一最新值，按时间戳后写覆盖。
   * 内部自动把主题名规范化为 `keyvalue_shared_` 前缀，调用方无需关心命名约定。
   *
   * 适用场景：全局配置、计数器、状态标志等"所有人共用一份、只关心最新值"的数据。
   * 与普通主题相比的行为差异：
   * - set/setWithCount：不同用户写入同一 key 会相互覆盖，最终保留时间戳最大的一条
   *   (同一微秒并发按内容确定性收敛，多节点结果一致)；vaccount 不再区分存储分区。
   * - get(不传 writerPubkey)/getValues/getWithIndex/getWithTimeOrder：直接返回该 key 的唯一最新值，
   *   时间排序索引天然去重，无需应用层再按用户去重。
   * - 写入值里的 dc_opuser 会统一记为主题作者；若需记录"实际操作者"，请把用户标识写进 value 内容中。
   *
   * @param appId 应用ID
   * @param theme 库主题名称(无需手动添加 shared_ 前缀，内部自动处理)
   * @param space 分配的存储空间大小（字节）
   * @param type 存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权，需以 _pub 结尾)
   * @returns 创建的keyvalue数据库实例和可能的错误信息
   */
  createSharedStore(appId: string, theme: string, space: number, type: KeyValueStoreType): Promise<[KeyValueDB|null, Error | null]>;

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
    seekKey?: string,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]>;

  /**
   * 获取授权列表（含用户总数和分页游标）
   * @param kvdb keyvalue数据库实例
   * @param limit 每页数量，默认100
   * @param seekKey 分页游标，默认从头
   * @param vaccount 可选的虚拟账户
   * @returns [授权列表, 用户总数, nextSeekKey, 错误信息]
   */
  getDbAuthList(
    kvdb: KeyValueDB,
    limit?: number,
    seekKey?: string,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[] | null, number, string, Error | null]>;

  /**
   * 获取授权列表中的用户总数
   * @param kvdb keyvalue数据库实例
   * @param vaccount 可选的虚拟账户
   * @returns [用户总数, 错误信息]
   */
  getAuthListUserCount(
    kvdb: KeyValueDB,
    vaccount?: string
  ): Promise<[number | null, Error | null]>;

  /**
   * 获取keyvalue数据库的记录总条数
   * @param kvdb keyvalue数据库实例
   * @param vaccount 可选的虚拟账户
   * @returns [记录总条数, 错误信息]
   */
  getRecordCount(
    kvdb: KeyValueDB,
    vaccount?: string
  ): Promise<[number | null, Error | null]>;


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
   * @param value 值内容。传空串表示删除该 key(及其关联索引)
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
   * 设置需要统计功能的键值对,调用本方法如果valueFlag为false时,会为key对应value中的指定字段进行加减操作,这时直接可以通过get方法传入key获取到最新的值内容
   * 也自动为DB全局的统计字段进行加减操作，如果valueFlag为true,则只为DB全局的统计字段进行加减操作,支持索引功能
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param value  值内容,格式如下:{add:{"field1":10,"field2":5},sub:{"field1":10,"field2":-5},allflag:true,countdate:"2020-01-01",yearFlag:true,monthFlag:true,valueFlag:true,value:"value"}  
   *              表示对field1进行加10,减10,对field2进行加5,减-5,allflag表示是不是累计到主题总计数上,如果为true,则同时更新主题的总计数,否则只更新当前key的统计值,countdate不为空表示统计
   *              到所有key累计的总的countdate日期上,yearFlag为true,表示统计值添加到所有key累计的总的按年统计,monthFlag为true,表示统计值添加到所有key累计的总的按月统计,valueFlag为true,表示同时设置该key的值为value字段指定的内容
   * @param indexs 索引列表，格式为json字符串:[{key:"indexkey1",type:"string",value:"value"},{key:"indexkey2",type:"number", value:12}],设置索引后,后续查询可以通过索引快速定位
   * @param vaccount 可选的虚拟账户
   * @returns [是否设置成功, 时间戳, 错误信息]
   */
  setWithCount(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]>;



   /**
   * 与setWithCount功能完全一样,主要为了兼容性
   */
  saveWithCount(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]>;


  /**  获取DB全局的统计数据,即所有key设置操作累计的的统计数据汇总
   * @param kvdb: KeyValueDB,
   * @param countType 统计类型,0:总计数,1:按天统计,2:按月统计,3:按年统计
   * @param typeStr 类型字符串,countType:0 时为空, countType:1时格式为"yyyy-MM-dd",countType:2时格式为"yyyy-MM",countType:3时格式为"yyyy"
   * @param vaccount 可选的虚拟账户
   * @returns [统计值json字符串格式{field1:10,field2:5}, 错误信息]
   */ 
  getDBCount(
    kvdb: KeyValueDB,
    countType: number, //统计类型,0:总计数,1:按天统计,2:按月统计,3:按年统计
    typeStr: string, //类型字符串,countType:0 时为空, countType:1时格式为"yyyy-MM-dd",countType:2时格式为"yyyy-MM",countType:3时格式为"yyyy"
    vaccount?: string
  ): Promise<[string | null, Error | null]> ;


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

    /**
   * 按设置时间顺序获取主题的的键值对列表
   * @param kvdb KeyValueDB实例
   * @param limit 返回结果数量限制
   * @param seekKey 查询起始键,用于分页查询
   * @param direction 查询方向 
   * @param offset 结果偏移量
   * @param vaccount 可选的虚拟账户
   * @returns [值列表数组生成的json字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
   getWithTimeOrder(
    kvdb: KeyValueDB,
    timestamp: number,//毫秒时间戳
    options: { limit?: number; seekKey?: string; direction?: Direction; offset?: number },
    vaccount?: string
  ): Promise<[string | null, Error | null]> ;
}





