import { ulid } from 'ulid';
import { Key, Query,Batch, Datastore } from 'interface-datastore';  


export const Errors = {  
    ErrDBNotFound: new Error('db not found'),  
    ErrDBExists: new Error('db already exists'),  
    ErrInvalidName: new Error('invalid name'),  
    ErrThreadReadKeyRequired: new Error('thread read key required'), 
    ErrorThreadIDValidation: new Error('thread id validation error'),
    ErrThreadNotFound: new Error('thread not found'), 
    ErrP2pNetworkNotInit: new Error('p2p network not initialized'),
    ErrNoDbManager: new Error('no db manager'),
    ErrNoDcPeerConnected: new Error('no dc peer connected'),
    ErrInvalidCollectionSchema: new Error("the collection schema _id property must be a string"),
    ErrCannotIndexIDField: new Error(`cannot create custom index `),
    ErrCollectionNotFound: new Error('collection not found'),
};  



export const dsPrefix = new Key("/db");  
export const DBPrefix = {
    dsPrefix: dsPrefix,
    dsName: dsPrefix.child(new Key("name")), 
    dsSchemas: dsPrefix.child(new Key("schema")), 
    dsIndexes: dsPrefix.child(new Key("index")),
    dsValidators: dsPrefix.child(new Key("validator")),
    dsFilters: dsPrefix.child(new Key("filter")),
}

 



export type InstanceID = string;  
export const EmptyInstanceID: InstanceID = '';  

// NewInstanceID generates a new identity for an instance.  
export function NewInstanceID(): InstanceID {  
    const id = ulid();  
    return id.toLowerCase();  
}  

// InstanceID string representation  
export function instanceIDToString(id: InstanceID): string {  
    return id;  
}  


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


export interface QueryResult {  
    key: string;  
    value: Uint8Array;  
    size?: number;  
  }  
  
  export interface QueryExt extends Query {  
    seekPrefix?: string;  
  }  

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


  interface DatastoreExtensions {  
    newTransactionExtended( readOnly: boolean): Promise<Transaction>  
    queryExtended( q: QueryExt): AsyncIterable<QueryResult>  
  }  

  export  interface TxnDatastoreExtended extends Datastore, DatastoreExtensions {  
      batch(): Batch;  
      newTransactionExtended( readOnly: boolean): Promise<Transaction>
  } 
  
export type IndexFunc = (  
    collection: string,  
    key: Key,  
    oldData: Uint8Array | null,  
    newData: Uint8Array | null,  
    txn: Transaction  
  ) => Promise<void>;  

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
     reduce(  
      events: Event[],  
      store: TxnDatastoreExtended,  
      baseKey: Key,  
      indexFn: IndexFunc  
    ): Promise<ReduceAction[]>;  
  
    create(actions: Action[]): Promise<[Event[], Uint8Array]>;  
  
    eventsFromBytes(data: Uint8Array): Promise<Event[]> ;  
    
  }  
  