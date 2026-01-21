// modules/keyvalue-module.ts
// 键值存储功能模块

import {  IKeyValueOperations } from "../interfaces/keyvalue-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { KeyValueManager, KeyValueStoreType, KeyValueDB } from "../implements/keyvalue/manager";
import { createLogger } from "../util/logger";
import { ThemeAuthInfo, ThemeComment } from "../common/types/types";
import { Direction } from "../common/define";
import { ThemePermission } from "../common/constants";
import {padPositiveInt20} from "../util/utils";
const logger = createLogger('KeyValueModule');
const indexkey_dckv = "indexkey_dckv"; //索引键名，keyvalue设置过程中key本身的索引键
/**
 * 键值存储模块
 * 提供键值存储功能
 */
export class KeyValueModule implements DCModule, IKeyValueOperations {
  readonly moduleName = CoreModuleName.KEYVALUE;
  private keyValueManager!: KeyValueManager;
  private initialized: boolean = false;
  private context: DCContext = {} as DCContext;
  
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
  ): Promise<[KeyValueDB|null, Error | null]> {
   const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    
    try {
      return await this.keyValueManager.createStore(
        appId,
        theme,
        space,
        type
      );
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  
  async getStore(
    appId: string,
    theme: string,
    themeAuthor: string
  ): Promise<[KeyValueDB|null, Error | null]> {
    const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    try {
      return await this.keyValueManager.getKeyValueDB(
        appId,
        theme,
        themeAuthor
      );
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  

  
   async configAuth(
    kvdb: KeyValueDB,
    authPubkey: string,
    permission: ThemePermission,
    remark: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    
    try {
       return await kvdb.configAuth(authPubkey, permission, remark, vaccount);
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
   async getAuthList(
    kvdb: KeyValueDB,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> {
    const err = this.assertInitialized();
    if (err) {
      return [null, null,err];
    }
    
    try {
      return await kvdb.getAuthList(vaccount);
    } catch (error) {
      return [null, null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  



   /**
     * 获取当前用户自身的kevdb授权信息,用户自己调用
     * @param kvdb keyvalue数据库实例
     * @param vaccount 可选的虚拟账户
     * @returns [授权配置, 错误信息]
     */
     async GetUserOwnAuth(
        kvdb: KeyValueDB,
        vaccount?: string
      ): Promise<[authInfo: ThemeAuthInfo | null, error: Error | null]> {
        try {
          this.assertInitialized();
          return this.keyValueManager.GetUserOwnAuth(
            kvdb.getAppId(),
            kvdb.getAuthor(),
            kvdb.getName(),
            vaccount
          );
        } catch (error) {
          return Promise.resolve([null, error as Error]);
        }
      }
  
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
      ): Promise<[ThemeAuthInfo | null, Error | null]>{
         try {
            this.assertInitialized();
            return this.keyValueManager.GetUserAuth(
              kvdb.getAppId(),
              kvdb.getAuthor(),
              kvdb.getName(),
              userPubkey,
              vaccount
            );
          } catch (error) {
            return Promise.resolve([null, error as Error]);
          }
      }
  
     

  
  async set(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string, //索引列表,格式为json字符串:[{key:"indexkey1",type:"string",value:"value"},{key:"indexkey2",type:"number", value:12}],这里统一转换格式为key1:value1$$$key2:value2
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]> {
     const err = this.assertInitialized();
    if (err) {
      return [null, null, err];
    }
    
    try {
      //进行格式转换
      let strIndexs = "";
      try {
        if (indexs && indexs != "") {
          const indexArray = JSON.parse(indexs);
          for (const index of indexArray) {
            let indexValue = "";
            if( index.type === "number" ){ //
              indexValue = padPositiveInt20(index.value);
            }else{
              indexValue = index.value;
            }
            strIndexs += `${index.key}:${indexValue}$$$`;
          }
          
         
        }
      } catch (error) {
        logger.error(`设置索引,解析失败:`, error);
      }
      return await kvdb.set(key, value, strIndexs, vaccount);
    } catch (error) {
      return [null,null, error instanceof Error ? error : new Error(String(error))];
    }
  }



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
  async setWithCount(
    kvdb: KeyValueDB,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]>{
      const err = this.assertInitialized();
    if (err) {
      return [null, null, err];
    }
    //检查value格式
    try {
      JSON.parse(value);
    } catch (error) {
      return [null,null, error instanceof Error ? error : new Error(String(error))];
    }
    return await this.set(kvdb, key, value, indexs, vaccount);
  }


  /**  获取DB全局的统计数据,即所有key设置操作累计的的统计数据汇总
   * @param kvdb: KeyValueDB,
   * @param countType 统计类型,0:总计数,1:按天统计,2:按月统计,3:按年统计
   * @param typeStr 类型字符串,countType:0 时为空, countType:1时格式为"yyyy-MM-dd",countType:2时格式为"yyyy-MM",countType:3时格式为"yyyy"
   * @param vaccount 可选的虚拟账户
   * @returns [统计值json字符串格式{field1:10,field2:5}, 错误信息]
   */ 
  async getDBCount(
    kvdb: KeyValueDB,
    countType: number, //统计类型,0:总计数,1:按天统计,2:按月统计,3:按年统计
    typeStr: string, //类型字符串,countType:0 时为空, countType:1时格式为"yyyy-MM-dd",countType:2时格式为"yyyy-MM",countType:3时格式为"yyyy"
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
      const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    let key = "";
    if (countType === 0) {
      key = "global_all";
    } else if (countType === 1) {
      key = `global_${typeStr}`;
    } 
    return await this.get(kvdb, key, kvdb.getAuthor(), vaccount);
  }



 /**
   * 获取当前用户设置的指定键的元数据
   * @param kvdb 
   * @param key 
   * @param vaccount 
   * @returns  [值, 错误信息],值的格式:  value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  async getValueSetByCurrentUser(kvdb: KeyValueDB, key: string,vaccount?: string): Promise<[string | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, new Error("当前用户公钥未设置")];
    }
    return this.get(kvdb,key, this.context.publicKey.string(), vaccount);
  }


  /**
   * 获取指定键的元数据
   * @param kvdb 
   * @param key 
   * @param writerPubkey 
   * @param vaccount 
   * @returns  [值, 错误信息],值的格式:  value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  async get(
    kvdb: KeyValueDB,
    key: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
     const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    
    try {
      return  await kvdb.get(key, writerPubkey, vaccount);
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }


   /**
   * 获取指定键的值列表
   * @param kvdb: KeyValueDB,
   * @param key 键名
   * @param limit 返回结果数量限制
   * @param seekKey 查询起始键,用于分页查询
   * @param offset 结果偏移量
   * @param vaccount 可选的虚拟账户
   * @returns [值列表数组生成的json字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  async getValues(
    kvdb: KeyValueDB,
    key: string,
    options: { limit?: number; seekKey?: string; direction?: Direction; offset?: number } ,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
     const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    const limit = options.limit || 10;
    const seekKey = options.seekKey || "";
    const direction = options.direction || Direction.Forward;
    const offset = options.offset || 0;
    try {
      return await kvdb.getWithIndex(indexkey_dckv, key, limit, seekKey, direction, offset, vaccount);
  
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  
  /**
   * 批量获取指定键的值
   * @param kvdb KeyValueDB实例
   * @param keys 逗号分隔的键列表
   * @param writerPubkey 可选，指定写入者公钥
   * @param vaccount 可选的虚拟账户
   * @returns [值的数组的JSON字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */
  async getBatch(
    kvdb: KeyValueDB,
    keys: string,
    writerPubkey: string = "",
    vaccount: string = ""
  ): Promise<[string | null, Error | null]> { 
    const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }

    try {
      return await kvdb.getBatch(keys, writerPubkey, vaccount);

    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  /**
   * 获取指定索引的值
   * @param kvdb KeyValueDB实例
   * @param indexKey 索引键名
   * @param indexValue 索引值
   * @param type 索引值类型
   * @param seekKey 查询起始键,用于分页查询
   * @param direction 查询方向
   * @param offset 结果偏移量
   * @param vaccount 可选的虚拟账户
   * @returns [值的数组形式的JSON字符串, 错误信息] 数组的每个元素的格式:  key:value$$$dckv_extra$$${'dc_timestamp':'%d','dc_opuser':'%s'}
   */ 
   async getWithIndex(
    kvdb: KeyValueDB,
    indexKey:string,
    indexValue:string,
    options: {type?:string; limit?: number; seekKey?: string; direction?: Direction; offset?: number } ,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    const limit = options.limit || 10;
    const seekKey = options.seekKey || "";
    const direction = options.direction || Direction.Forward;
    const offset = options.offset || 0;
    let indexValueStr = indexValue;
    if( options.type === "number" ){ //
      indexValueStr = padPositiveInt20(indexValue);
    }
    try {
      return await kvdb.getWithIndex(indexKey, indexValueStr, limit,seekKey, direction,offset,  vaccount);
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

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
  async getWithTimeOrder(
    kvdb: KeyValueDB,
    timestamp: number,//毫秒时间戳
    options: { limit?: number; seekKey?: string; direction?: Direction; offset?: number },
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    const err = this.assertInitialized();
    if (err) {
      return [null, err];
    }
    let timestampStr = "";
    if( timestamp > 0 ){
      //把毫秒时间转为微妙时间戳字符串,与DC节点存储的时间戳格式一致
      timestampStr = padPositiveInt20(timestamp * 1000);
      //前面补0,保证长度为20位
      timestampStr = timestampStr.padStart(20, "0");
    }
    const limit = options.limit || 10;
    const seekKey = options.seekKey || "";
    const direction = options.direction || Direction.Forward;
    const offset = options.offset || 0;
    try {
      return await kvdb.getWithIndex("indexkey_timestamp", timestampStr, limit, seekKey, direction, offset, vaccount);
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }
  

  /**
   * 断言模块已初始化
   */
  private assertInitialized(): Error | void {
    if (!this.initialized) {
      return Error("键值存储模块未初始化");
    }
  }
}