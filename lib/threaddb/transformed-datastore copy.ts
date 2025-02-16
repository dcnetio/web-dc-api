import { Key, Datastore, Query,Pair, QueryFilter, QueryOrder, Batch } from 'interface-datastore'  
import { BaseDatastore } from 'datastore-core'  
type Await<T> = Promise<T> | T 

// 基础接口定义  
interface AbortOptions {  
  signal?: AbortSignal  
}  

interface Context {  
  signal?: AbortSignal  
  [key: string]: any  
}  

interface QueryResult {  
  key: string  
  value: Uint8Array  
  size?: number  
}  

interface QueryExt extends Query {  
  seekPrefix?: string  
}  

// 事务接口  
interface TxnExt {  
  put(ctx: Context, key: Key, value: Uint8Array): Promise<Key>  
  delete(ctx: Context, key: Key): Promise<Key>  
  get(ctx: Context, key: Key): Promise<Uint8Array>  
  has(ctx: Context, key: Key): Promise<boolean>  
  commit(ctx: Context): Promise<void>  
  discard(ctx: Context): void  
  query(ctx: Context, q: Query): AsyncIterable<QueryResult>  
  queryExtended(ctx: Context, q: QueryExt): AsyncIterable<QueryResult>  
}  

// 数据存储扩展接口  
interface DatastoreExtensions {  
  newTransactionExtended(ctx: Context, readOnly: boolean): Promise<TxnExt>  
  queryExtended(ctx: Context, q: QueryExt): AsyncIterable<QueryResult>  
}  

// Key 转换接口  
interface KeyTransform {  
    convert(key: Key): Key  
    invert(key: Key): Key  
  } 

// 组合接口  
interface TxnDatastoreExtended extends Datastore, DatastoreExtensions {  
    batch(): Batch;  
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

// 定义我们自己的过滤器类型  
interface KeyFilter {  
    key?: string;  
    prefix?: string;  
    [key: string]: any;  
  }  
  
  function isKeyCompareFilter(filter: QueryFilter): filter is QueryFilter {  
    const keyFilter = filter as unknown as KeyFilter;  
    return 'key' in keyFilter;  
  }  
  
  function isKeyPrefixFilter(filter: QueryFilter): filter is QueryFilter {  
    const keyFilter = filter as unknown as KeyFilter;  
    return 'prefix' in keyFilter;  
  }  
  

// 数据存储实现  
class TransformedDatastore extends BaseDatastore implements TxnDatastoreExtended {  
    private child: TxnDatastoreExtended;  
    private transform: KeyTransform;  
  
    constructor(child: TxnDatastoreExtended, transform: KeyTransform) {  
      super();  
      this.child = child;  
      this.transform = transform;  
    }  
  
    getTransform(): KeyTransform {
        return this.transform
    }
   
    // 使用 Await<void> 作为返回类型  
    put(key: Key, value: Uint8Array, options?: AbortOptions): Await<Key> {  
      return this.child.put(this.transform.convert(key), value, options)  
    }  
  
    get(key: Key, options?: AbortOptions): Await<Uint8Array> {  
      return this.child.get(this.transform.convert(key), options)  
    }  
  
    has(key: Key, options?: AbortOptions): Await<boolean> {  
      return this.child.has(this.transform.convert(key), options)  
    }  
  
    // 使用 Await<void> 作为返回类型  
    delete(key: Key, options?: AbortOptions): Await<void> {  
      return this.child.delete(this.transform.convert(key), options)  
    }  
  
    batch(): Batch {  
      const childBatch = this.child.batch()  
      const transform = this.transform  
  
      return {  
        put(key: Key, value: Uint8Array): void {  
          childBatch.put(transform.convert(key), value)  
        },  
        delete(key: Key): void {  
          childBatch.delete(transform.convert(key))  
        },  
        commit(options?: AbortOptions): Await<void> {  
          return childBatch.commit(options)  
        }  
      }  
    } 

  async newTransaction(ctx: Context, readOnly: boolean): Promise<TxnExt> {  
    return this.newTransactionExtended(ctx, readOnly)  
  }  

  async newTransactionExtended(ctx: Context, readOnly: boolean): Promise<Transaction> {  
    if (typeof this.child.newTransactionExtended !== 'function') {  
      throw new Error('Child datastore does not support extended transactions')  
    }  
    const childTxn = await this.child.newTransactionExtended(ctx, readOnly)  
    return new TransformedTxn(childTxn, this)  
  }  

  async *queryExtended(ctx: Context, q: QueryExt): AsyncIterable<QueryResult> {  
    if (typeof this.child.queryExtended !== 'function') {  
      throw new Error('Child datastore does not support extended queries')  
    }  
    
    const transformedQuery = this.transformQuery(q)  
    const results = this.child.queryExtended(ctx, transformedQuery)  
    
    for await (const result of results) {  
      yield {  
        ...result,  
        key: this.transform.invert(new Key(result.key)).toString()  
      }  
    }  
  }  

 
  private transformFilter(filter: QueryFilter): QueryFilter {  
    const keyFilter = filter as unknown as KeyFilter;  
    
    if (isKeyCompareFilter(filter)) {  
      const transformedKey = this.transform.convert(new Key(keyFilter.key!)).toString();  
      return ((item: Pair) => item.key.toString() === transformedKey) as QueryFilter;  
    }  
    
    if (isKeyPrefixFilter(filter)) {  
      const transformedPrefix = this.transform.convert(new Key(keyFilter.prefix!)).toString();  
      return ((item: Pair) => item.key.toString().startsWith(transformedPrefix)) as QueryFilter;  
    }  
    
    return filter;  
  }  


  private transformQuery(q: QueryExt): QueryExt {  
    const transformed: QueryExt = { ...q };  

    if (transformed.prefix) {  
      transformed.prefix = this.transform.convert(new Key(transformed.prefix)).toString();  
    }  

    if (transformed.seekPrefix) {  
      transformed.seekPrefix = this.transform.convert(new Key(transformed.seekPrefix)).toString();  
    }  

    if (transformed.filters) {  
      transformed.filters = transformed.filters.map(filter => this.transformFilter(filter));  
    }  

    return transformed;  
  } 
}  

// 事务实现  
class TransformedTxn implements TxnExt {  
  private txn: TxnExt  
  private ds: TransformedDatastore  

  constructor(txn: TxnExt, ds: TransformedDatastore) {  
    this.txn = txn  
    this.ds = ds  
  }  

  async put(ctx: Context, key: Key, value: Uint8Array): Promise<Key> {  
    await this.txn.put(ctx, this.ds.getTransform().convert(key), value)  
    return key  
  }  

  async delete(ctx: Context, key: Key): Promise<Key> {  
    await this.txn.delete(ctx, this.ds.getTransform().convert(key))  
    return key  
  }  

  async get(ctx: Context, key: Key): Promise<Uint8Array> {  
    return this.txn.get(ctx, this.ds.getTransform().convert(key))  
  }  

  async has(ctx: Context, key: Key): Promise<boolean> {  
    return this.txn.has(ctx, this.ds.getTransform().convert(key))  
  }  

  async *query(ctx: Context, q: Query): AsyncIterable<QueryResult> {  
    const results = this.queryExtended(ctx, q as QueryExt)  
    for await (const result of results) {  
      yield result  
    }  
  }  

  async *queryExtended(ctx: Context, q: QueryExt): AsyncIterable<QueryResult> {  
    const { naive, child } = this.prepareQuery(q)  
    const results = await this.txn.queryExtended(ctx, child)  
    
    for await (const result of results) {  
      yield {  
        ...result,  
        key: this.ds.getTransform().invert(new Key(result.key)).toString()  
      }  
    }  
  }  

  private prepareQuery(q: QueryExt): { naive: QueryExt; child: QueryExt } {  
    const child = { ...q }  
    const naive: QueryExt = {}  

    if (child.prefix) {  
      child.prefix = this.ds.getTransform().convert(new Key(child.prefix)).toString()  
    }  

    return { naive, child }  
  }  

  async commit(ctx: Context): Promise<void> {  
    return this.txn.commit(ctx)  
  }  

  discard(ctx: Context): void {  
    this.txn.discard(ctx)  
  }  
}  

// Type guards  
interface KeyCompareFilter extends QueryFilter {  
  key: string  
}  

interface KeyPrefixFilter extends QueryFilter {  
  prefix: string  
}  


// 导出  
export {  
  TransformedDatastore,  
  PrefixTransform,  
  KeyTransform,  
  TxnDatastoreExtended,  
  TxnExt,  
  QueryExt,  
  QueryResult,  
  Context,  
  AbortOptions  
}