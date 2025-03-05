
import { Key, Query, QueryFilter,Batch, Pair,Datastore } from 'interface-datastore';  
import { BaseDatastore } from 'datastore-core';  
import {  
  Transaction,
  QueryExt,
  QueryResult ,
  TxnDatastoreExtended
} from './core/db';

import { 
  AbortOptions, 
} from './core/core';


// ======== 类型扩展声明 ========  
declare module 'interface-datastore' {  
  interface Pair {  
    size?: number; // 添加扩展属性声明  
  } 
  interface QueryFilter {  
    /** 类型标识字段 */  
    $type?: 'key' | 'prefix';  
  }  

  // 明确导出子类型  
  interface KeyFilter extends QueryFilter {  
    $type: 'key';  
    key: string;  
  }  

  interface PrefixFilter extends QueryFilter {  
    $type: 'prefix';  
    prefix: string;  
  }  

  interface Datastore {  
    newTransactionExtended?: ( readOnly: boolean) => Promise<Transaction>;  
  }  
}
// ======== 类型守卫优化 ========  

function isKeyFilter(filter: QueryFilter): filter is KeyFilter {  
  return (filter as KeyFilter).$type === 'key' &&   
         typeof (filter as KeyFilter).key === 'string';  
}  

function isPrefixFilter(filter: QueryFilter): filter is PrefixFilter {  
  return (filter as PrefixFilter).$type === 'prefix' &&   
         typeof (filter as PrefixFilter).prefix === 'string';  
}  




export interface KeyTransform {  
  convert(key: Key): Key;  
  invert(key: Key): Key | null;  
}  


  // 数据存储扩展接口  
  
  
  // 组合接口  


class TransformedDatastore extends BaseDatastore {  
  constructor(  
    private readonly child: TxnDatastoreExtended,  
    private readonly transform: KeyTransform  
  ) {  
    super();  
  }  

  // === 基础操作 ===  
  async put(key: Key, value: Uint8Array, options?: AbortOptions): Promise<Key> {  
    return this.child.put(this.transform.convert(key), value, options);  
  }  

  async get(key: Key, options?: AbortOptions): Promise<Uint8Array> {  
    return this.child.get(this.transform.convert(key));  
  }  

  async has(key: Key, options?: AbortOptions): Promise<boolean> {  
      return this.child.has(this.transform.convert(key), options)  
    }  
  
    // 使用 Await<void> 作为返回类型  
  async delete(key: Key, options?: AbortOptions): Promise<void> {  
      return this.child.delete(this.transform.convert(key), options)  
  }

  // === 事务管理 ===  
  async beginTransaction(): Promise<Transaction> {  
    const childTxn = await this.getTransaction();  
    return new TransformedTransaction(childTxn, this.transform);  
  }  

  async  newTransactionExtended( readOnly: boolean): Promise<Transaction> {  
    const childTxn =  await this.getTransaction(); 
    return new TransformedTransaction(childTxn, this.transform);  
  }

  private async getTransaction(): Promise<Transaction> {  
    if (typeof (this.child as any).newTransactionExtended === 'function') {  
      return (this.child as any).newTransactionExtended(false);  
    }  
    throw new Error('Transactions not supported by underlying datastore');  
  }  

  // === 查询处理 ===  
  // async *query(query: Query): AsyncIterable<QueryResult> {  
  //   yield* this.queryExtended({ ...query });  
  // }  

  async *query( q: Query): AsyncIterable<Pair> {  
      const results = this.queryExtended(q as QueryExt)  
      for await (const result of results) {  
        yield {key: new Key(result.key), value: result.value}
      }  
    }  
  

  async *queryExtended(q: QueryExt): AsyncIterable<QueryResult> {  
    const transformedQuery = this.transformQuery(q);  
    
    for await (const result of this.child.query(transformedQuery)) {  
      const originalKey = this.transform.invert(new Key(result.key.toString()));  
      if (!originalKey) continue;  

      yield {  
        ...result,  
        key: originalKey.toString()  
      };  
    }  
  }  

  private transformQuery(query: QueryExt): QueryExt {  
    return FilterProcessor.process(query, this.transform);  
  }  
}  

// ======== 事务实现 ========  
class TransformedTransaction implements Transaction {  
  constructor(  
    private readonly txn: Transaction,  
    private readonly transform: KeyTransform  
  ) {}  

  // === 核心操作 ===  
  async put( key: Key, value: Uint8Array): Promise<Key> {  
    return this.txn.put(this.transform.convert(key), value);  
  }  

  async delete( key: Key): Promise<void> {  
    return this.txn.delete(this.transform.convert(key));  
  }  

  async get( key: Key): Promise<Uint8Array | null> {  
    return this.txn.get(this.transform.convert(key));  
  }  

  async has( key: Key): Promise<boolean> {  
    return this.txn.has(this.transform.convert(key));  
  }  

  async commit(): Promise<void> {  
    return this.txn.commit();  
  }  

  discard(): void {  
    this.txn.discard();  
  }  

  // === 查询操作 ===  
  async *query( q: Query): AsyncIterable<QueryResult> {  
    yield* this.queryExtended(q as QueryExt);  
  }  

  async *queryExtended( q: QueryExt): AsyncIterable<QueryResult> {  
    const processedQuery = FilterProcessor.process(q, this.transform);  
    
    for await (const result of this.txn.queryExtended(processedQuery)) {  
      const originalKey = this.transform.invert(new Key(result.key));  
      if (!originalKey) continue;  

      yield {  
        ...result,  
        key: originalKey.toString()  
      };  
    }  
  }  
}  

// ======== 过滤器处理器 ========  
class FilterProcessor {  
  static process(input: QueryExt, transform: KeyTransform): QueryExt {  
    const query = structuredClone(input);  
    
    // 前缀转换  
    if (query.prefix) {  
      query.prefix = transform.convert(new Key(query.prefix)).toString();  
    }  

    // 过滤器转换  
    if (query.filters) {  
      query.filters = query.filters.map(filter =>   
        this.transformFilter(filter, transform)  
      );  
    }  

    return query;  
  }  
  
  // 改进后的转换方法  
  private static transformFilter(filter: QueryFilter, transform: KeyTransform): QueryFilter {  
    if (isKeyFilter(filter)) {  
      const transformedKey = transform.convert(new Key(filter.key)).toString();  
      
      // 创建一个函数对象  
      const keyFilter = function(item: Pair): boolean {  
        return item.key.toString() === transformedKey;  
      };  
      
      // 添加属性到函数对象  
      Object.assign(keyFilter, {  
        key: transformedKey,  
        $type: 'key' as const  
      });  
      return keyFilter ;  
    }  
  
    if (isPrefixFilter(filter)) {  
      const transformedPrefix = transform.convert(new Key(filter.prefix)).toString();  
      
      // 创建一个函数对象  
      const prefixFilter = function(item: Pair): boolean {  
        return item.key.toString().startsWith(transformedPrefix);  
      };  
      
      // 添加属性到函数对象  
      Object.assign(prefixFilter, {  
        prefix: transformedPrefix,  
        $type: 'prefix' as const  
      });  
      return prefixFilter;  
    }  

    throw new Error('Unsupported filter type');  
  }

  private static createKeyFilter(originalKey: string): (entry: Pair) => boolean {  
    return (entry) => entry.key.toString() === originalKey;  
  }  

  private static createPrefixFilter(originalPrefix: string): (entry: Pair) => boolean {  
    return (entry) => entry.key.toString().startsWith(originalPrefix);  
  }  
}  



// ======== 辅助类型定义 ========  
interface KeyFilter extends QueryFilter {  
  key: string;  
}  

interface PrefixFilter extends QueryFilter {  
  prefix: string;  
}

// 前缀转换实现  
class PrefixTransform implements KeyTransform {  
  private prefix: Key  

  constructor(prefix: string) {  
    this.prefix = new Key(prefix)  
  }  

  convert(key: Key): Key {  
    return new Key(this.prefix.toString() + key.toString())  
  }  

  invert(key: Key): Key {  
    const keyStr = key.toString()  
    const prefixStr = this.prefix.toString()  
    if (!keyStr.startsWith(prefixStr)) {  
      throw new Error('Invalid prefix')  
    }  
    return new Key(keyStr.slice(prefixStr.length))  
  }  
}  

// 导出  
export {  
  TransformedDatastore,  
  PrefixTransform,  
}

