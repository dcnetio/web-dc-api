import { Key, Query, Batch, Pair, KeyQuery } from 'interface-datastore'  
import { IDBDatastore } from "datastore-idb";
import {  QueryExt, QueryResult, Transaction,TxnDatastoreExtended } from '../core/db'  
import { AbortOptions } from '@libp2p/interface';
type AwaitIterable<T> = AsyncIterable<T> | Iterable<T>;  


class IDBDatastoreAdapter implements TxnDatastoreExtended {  
    private store: IDBDatastore;  
    private txn: any; 
  
    constructor(store: IDBDatastore) {  
      this.store = store;  
      this.txn = null; 
    }  
  
    // 修改 queryKeys 的实现  
    async *queryKeys(  
      query: KeyQuery,  
      options?: AbortOptions  
    ): AsyncIterable<Key> {  
      const { filters = [], prefix } = query;  
      const q = { prefix } as Query;
      for await (const { key } of this.store.query(q)) {  
        let match = true;  
        
        // 应用所有过滤器  
        for (const filter of filters) {  
          if (!filter(key)) {  
            match = false;  
            break;  
          }  
        }  
  
        if (match) {  
          yield key;  
        }  
      }  
    }  
  
    async *query(
      query: Query,
      options?: AbortOptions
    ): AsyncIterable<Pair> {
      try {
        
        // 获取迭代器
        const storeQuery = this.store.query(query);
        
        // 检查异步迭代器协议
        if (!storeQuery || typeof storeQuery[Symbol.asyncIterator] !== 'function') {
          return;
        }
        
        let count = 0;
        // 手动迭代，而不是使用 yield*
        for await (const entry of storeQuery) {
          count++;
          
          // 验证返回值格式
          if (!entry || !entry.key) {
            continue;
          }
          
          yield entry;
        }
        

      } catch (err) {
        throw err; // 重新抛出以便上层处理
      }
    }
  
    // 扩展查询方法  
    
  // 修改 queryExtended 的实现  
  async *queryExtended(  
    q: QueryExt  
  ): AsyncIterable<QueryResult> {  
    const { prefix, filters = [] } = q;  

    const queryOptions: Query = {};
    if (prefix !== undefined) {
      queryOptions.prefix = prefix;
    }
    for await (const entry of this.store.query(queryOptions)) {  
      let match = true;  
      
      // 应用所有过滤器  
      for (const filter of filters) {  
        if (!filter(entry)) {  
          match = false;  
          break;  
        }  
      }  

      if (match) {  
        yield {  
          key: entry.key.toString(),  
          value: entry.value,  
          size: entry.value.length  
        };  
      }  
    }  
  }  
  
    // 其他批量操作方法  
    async *putMany(  
      source: AwaitIterable<Pair>,  
      options?: AbortOptions  
    ): AsyncIterable<Key> {  
      const batch = this.batch();  
      
      for await (const entry of source) {  
        const key = entry.key;  
        batch.put(key, entry.value);  
        yield key;  
      }  
      
      await batch.commit();  
    }  
  
    async *getMany(  
      source: AwaitIterable<Key>,  
      options?: AbortOptions  
    ): AsyncIterable<Pair> {  
      for await (const key of source) {  
        try {  
          const value = await this.get(key);  
          yield {  
            key: key,  
            value  
          };  
        } catch (err) {  
          console.error(`Error getting key ${key}:`, err);  
        }  
      }  
    }  
  
    async *deleteMany(  
      source: AwaitIterable<Key>,  
      options?: AbortOptions  
    ): AsyncIterable<Key> {  
      const batch = this.batch();  
      
      for await (const key of source) {  
        batch.delete(key);  
        yield key;  
      }  
      
      await batch.commit();  
    }  
  
    // 基本操作方法  
    async put(key: Key, value: Uint8Array): Promise<Key> {  
      return this.store.put(key, value);  
    }  
  
    async get(key: Key): Promise<Uint8Array> {  
      return this.store.get(key);  
    }  
  
    async has(key: Key): Promise<boolean> {  
      return this.store.has(key);  
    }  
  
    async delete(key: Key): Promise<void> {  
      return this.store.delete(key);  
    }  
  
    batch(): Batch {  
      return this.store.batch();  
    }  
  

  // 实现 TxnDatastoreExtended 接口的方法  
  async newTransactionExtended(  
    
    readOnly: boolean  
  ): Promise<Transaction> {  
    // 保存当前实例的引用
    const store = this.store;
    // 由于 LevelDatastore 不支持原生事务，我们创建一个简单的包装器  
    const txn: Transaction = {  
      put: async ( key: Key, value: Uint8Array): Promise<Key> => {  
        if (readOnly) throw new Error('Transaction is read-only');  
        await this.store.put(key, value);  
        return key;  
      },  

      get: async ( key: Key): Promise<Uint8Array> => {  
        return this.store.get(key);  
      },  

      has: async ( key: Key): Promise<boolean> => {  
        return this.store.has(key);  
      },  

      delete: async ( key: Key): Promise<void> => {  
        if (readOnly) throw new Error('Transaction is read-only');  
        await this.store.delete(key);  
        return  ;
      },  

      query: async function*( q: Query): AsyncIterable<QueryResult> {  
        for await (const entry of store.query(q)) {  
          yield {  
            key: entry.key.toString(),  
            value: entry.value,  
            size: entry.value.length  
          };  
        }  
      }.bind(this),  

      queryExtended: async function*( q: QueryExt): AsyncIterable<QueryResult> {  
        const { prefix, filters = [] } = q;  
        const queryOptions: Query = {};
        if (prefix !== undefined) {
          queryOptions.prefix = prefix;
        }
        for await (const entry of store.query(queryOptions)) {  
          let match = true;  
          for (const filter of filters) {  
            if (!filter(entry)) {  
              match = false;  
              break;  
            }  
          }  
          if (match) {  
            yield {  
              key: entry.key.toString(),  
              value: entry.value,  
              size: entry.value.length  
            };  
          }  
        }  
      }.bind(this),  

      commit: async (): Promise<void> => {  
        // 由于没有实际的事务支持，这里是一个空操作  
        return Promise.resolve();  
      } , 
      discard: async (): Promise<void> => {  
        // 由于没有实际的事务支持，这里是一个空操作  
        return Promise.resolve();  
      } 
    };  

    return txn; 
  }  
}  

// 工厂函数  
export async function createTxnDatastore(location: string): Promise<TxnDatastoreExtended> {  
  const levelStore = new IDBDatastore(location);  
  await levelStore.open();
  const adapter = new IDBDatastoreAdapter(levelStore);  
  return adapter;

}  
