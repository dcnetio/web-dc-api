

import { Key,Datastore,Query,Batch } from 'interface-datastore';


// ======== 基础类型定义 ========  
export interface Context extends Record<string, any> {  
  signal?: AbortSignal;  
}  

export interface QueryResult {  
  key: string;  
  value: Uint8Array;  
  size?: number;  
}  

export interface QueryExt extends Query {  
  seekPrefix?: string;  
}  

// ======== 事务接口 ========  
export  interface Transaction {  
  put( key: Key, value: Uint8Array): Promise<Key>;  
  delete( key: Key): Promise<void>;  
  get( key: Key): Promise<Uint8Array | null>;  
  has( key: Key): Promise<boolean>;  
  commit(): Promise<void>;  
  discard(): void;  
  query( q: Query): AsyncIterable<QueryResult>;  
  queryExtended( q: QueryExt): AsyncIterable<QueryResult>;  
}  

// ======== 键转换接口 ========  
export interface KeyTransform {  
  convert(key: Key): Key;  
  invert(key: Key): Key | null;  
}  


export interface AbortOptions {  
    signal?: AbortSignal  
  }  
  // 数据存储扩展接口  
  interface DatastoreExtensions {  
    newTransactionExtended( readOnly: boolean): Promise<Transaction>  
    queryExtended( q: QueryExt): AsyncIterable<QueryResult>  
  }  
  
  
  // 组合接口  
  export  interface TxnDatastoreExtended extends Datastore, DatastoreExtensions {  
      batch(): Batch;  
      newTransactionExtended( readOnly: boolean): Promise<Transaction>
  } 
  

// ======== 核心类型定义 ========  
export type InstanceID = string;  
export const EmptyInstanceID: InstanceID = '';  


export enum ActionType {  
    Create = 'create',  
    Save = 'save',  
    Delete = 'delete'  
  }  

export interface Event<T = any> {  
  /** 事件时间戳 (Unix毫秒时间戳) */  
  readonly timestamp: number;  
  /** 关联的实例ID */  
  readonly instanceID: InstanceID;  
  /** 所属集合名称 */  
  readonly collection: string;  
  /** 事件负载数据 */  
  readonly payload: T;  

  /** 序列化为Uint8Array */  
  marshal(): Promise<Uint8Array>;  
}  

export interface Action {  
    type: ActionType;  
    instanceID: InstanceID;  
    collectionName: string;  
    previous: Uint8Array | null;  
    current: Uint8Array | null;  
  }  
  
  export interface ReduceAction {  
    type: ActionType;  
    collection: string;  
    instanceID: InstanceID;  
  }  


  export interface EventCodec {  
    // 创建事件和CBOR编码  
    create(actions: Action[]): Promise<[Event[], Uint8Array]>;  
  
    // 应用事件到数据存储  
    reduce(  
      events: Event[],  
      store: TxnDatastoreExtended,  
      baseKey: Key,  
      indexFunc: IndexFunc  
    ): Promise<ReduceAction[]>;  
  
    // 从字节流解码事件  
    eventsFromBytes(data: Uint8Array): Promise<Event[]>;  
  }


    // ======== 索引处理函数类型 ========  
    export type IndexFunc = (  
        collection: string,  
        key: Key,  
        oldData: Uint8Array | null,  
        newData: Uint8Array | null,  
        txn: Transaction  
      ) => Promise<void>;  
