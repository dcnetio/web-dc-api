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
import {padPositiveInt30} from "../util/utils";
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
      const [kvdb,err] = await this.keyValueManager.createStore(
        appId,
        theme,
        space,
        type
      );
      return [kvdb,err];
    } catch (error) {
      logger.error(`创建存储主题 ${theme} 失败:`, error);
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
      const [kvdb,err] = await this.keyValueManager.getKeyValueDB(
        appId,
        theme,
        themeAuthor
      );
      return [kvdb,err];
    } catch (error) {
      logger.error(`获取存储主题 ${theme} 失败:`, error);
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
       const res = await kvdb.configAuth(authPubkey, permission, remark, vaccount);
      return res;
    } catch (error) {
      logger.error(`配置权限失败:`, error);
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
      const res = await kvdb.getAuthList(vaccount);
      return res;
    } catch (error) {
      logger.error(`获取权限列表失败:`, error);
      return [null, null, error instanceof Error ? error : new Error(String(error))];
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
              indexValue = padPositiveInt30(index.value);
            }else{
              indexValue = index.value;
            }
            strIndexs += `${index.key}:${indexValue}$$$`;
          }
          
         
        }
      } catch (error) {
        logger.error(`设置索引,解析失败:`, error);
      }
      //追加时间戳索引，保证每次写入的唯一性
      const timestamp = Date.now();
      const timestampStr = padPositiveInt30(timestamp);
      strIndexs += `dc_timestamp_index:${timestampStr}`;
      const res = await kvdb.set(key, value, strIndexs, vaccount);
      return res;
    } catch (error) {
      logger.error(`设置set-value失败:`, error);
      return [null,null, error instanceof Error ? error : new Error(String(error))];
    }
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
      const res = await kvdb.get(key, writerPubkey, vaccount);
      return res;
    } catch (error) {
      logger.error(`获取key-value失败:`, error);
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
    const limit = options.limit? options.limit: 10;
    const seekKey = options.seekKey? options.seekKey: "";
    const direction = options.direction? options.direction: Direction.Forward;
    const offset = options.offset? options.offset: 0;
    try {
      const res = await kvdb.getWithIndex(indexkey_dckv, key, limit, seekKey, direction, offset, vaccount);
      return res;
    } catch (error) {
      logger.error(`getValues失败:`, error);
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
      const res = await kvdb.getBatch(keys, writerPubkey, vaccount);
      return res;
    } catch (error) {
      logger.error(`getBatch失败:`, error);
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
    const limit = options.limit? options.limit: 10;
    const seekKey = options.seekKey? options.seekKey: "";
    const direction = options.direction? options.direction: Direction.Forward;
    const offset = options.offset? options.offset: 0;
    let indexValueStr = "";
    if( options.type === "number" ){ //
      indexValueStr = padPositiveInt30(indexValue);
    }
    try {
      const res = await kvdb.getWithIndex(indexKey, indexValueStr, limit,seekKey, direction,offset,  vaccount);
    return res;
    } catch (error) {
      logger.error(`getWithIndex失败:`, error);
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