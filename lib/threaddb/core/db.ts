import { ulid } from 'ulid';
import { Key, Query,Batch, Datastore } from 'interface-datastore';  

import { IPLDNode } from '../core/core';
import {ThreadToken} from './identity';
import { Ed25519PubKey as PubKey} from "../../dc-key/ed25519";
import { Connector,LocalEventsBus } from '../core/app';
import { Dispatcher } from '../common/dispatcher';


export const Errors = {  
    ErrDBNotFound: new Error('db not found'),  
    ErrDBExists: new Error('db already exists'),  
    ErrInvalidName: new Error('invalid name'),  
    ErrThreadReadKeyRequired: new Error('thread read key required'), 
    ErrorThreadIDValidation: new Error('thread id validation error'),
    ErrThreadNotFound: new Error('thread not found'), 
    ErrLogNotFound: new Error('log not found'),
    ErrLogExists: new Error('log already exists'),
    ErrP2pNetworkNotInit: new Error('p2p network not initialized'),
    ErrNoDbManager: new Error('no db manager'),
    ErrNoDcPeerConnected: new Error('no dc peer connected'),
    ErrInvalidCollectionSchema: new Error("the collection schema _id property must be a string"),
    ErrCannotIndexIDField: new Error(`cannot create custom index `),
    ErrCollectionNotFound: new Error('collection not found'),
    ErrNodeAddrIsNull: new Error('node address is null'),
};  

export const pullThreadBackgroundTimeout = 3600000; // 1 hour in milliseconds
export const PullTimeout = 20000; // 20 seconds in milliseconds

export const dsPrefix = new Key("/db");  
export const DBPrefix = {
    dsPrefix: dsPrefix,
    dsName: dsPrefix.child(new Key("name")), 
    dsSchemas: dsPrefix.child(new Key("schema")), 
    dsIndexes: dsPrefix.child(new Key("index")),
    dsValidators: dsPrefix.child(new Key("validator")),
    dsFilters: dsPrefix.child(new Key("filter")),
}
export const idFieldName = "_id";
export const modFieldName = "_mod";

 



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


export enum CoreActionType {  
    Create = 0,  
    Save = 1,  
    Delete = 2  
}  



/**
 * Transaction class for collections
 */
export interface ITxn{
  /**
   * Create new instances
   */
  create(...newInstances: Uint8Array[]): Promise<InstanceID[]>;
  /**
   * Verify instance changes without saving them
   */
  verify(...updated: Uint8Array[]): Promise<void>;
  /**
   * Save instance changes
   */
  save(...updated: Uint8Array[]): Promise<void>;
  /**
   * Delete instances
   */
  delete(...ids: InstanceID[]): Promise<void>;
  /**
   * Check if instances exist
   */
  has(...ids: InstanceID[]): Promise<boolean>;
  /**
   * Find instance by ID
   */
  findByID(id: InstanceID): Promise<Object> ;
  /**
   * Find instances matching a query
   */
  find(q?: Query): Promise<Object[]>;
  /**
 * Get instances modified since a specific time
 * 
 * The _mod field tracks modified instances, but not those that have been deleted, so we need
 * to query the dispatcher for all (unique) instances in this collection that have been modified
 * at all since `time`.
 */
  modifiedSince(time: number): Promise<InstanceID[]>;
  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Discard the transaction
   */
  discard(): void;
  /**
   * Refresh collection reference
   */
  refreshCollection(): void 
}
  export interface ICollection  {
    baseKey(): Key ;
    getName(): string ;
    getSchema(): Uint8Array;
    getWriteValidator(): Uint8Array;
    getReadFilter(): Uint8Array;
    readTxn(fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void> ;
    writeTxn(fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void>
    findByID(id: InstanceID, token?: ThreadToken): Promise<Object> ;
    create(v: Uint8Array, token?: ThreadToken): Promise<InstanceID> ;
    createMany(vs: Uint8Array[], token?: ThreadToken): Promise<InstanceID[]> ;
    delete(id: InstanceID, token?: ThreadToken): Promise<void> ;
    deleteMany(ids: InstanceID[], token?: ThreadToken): Promise<void> ;
    save(v: Uint8Array, token?: ThreadToken): Promise<void> ;
    saveMany(vs: Uint8Array[], token?: ThreadToken): Promise<void> ;
    verify(v: Uint8Array, token?: ThreadToken): Promise<void>;
    verifyMany(vs: Uint8Array[], token?: ThreadToken): Promise<void> ;
    has(id: InstanceID, token?: ThreadToken): Promise<boolean>;
    hasMany(ids: InstanceID[], token?: ThreadToken): Promise<boolean> ;
    find(q: Query, token?: ThreadToken): Promise<Object[]>
    modifiedSince(time: number, token?: ThreadToken): Promise<InstanceID[]>;
    validInstance(v: Uint8Array): void;
    validWrite(identity: PubKey, e: Event): Promise<void>;
    filterRead(identity: PubKey, instance: Uint8Array): Promise<Uint8Array | null>;
  }
export interface IDB {
  datastore: TxnDatastoreExtended; 
  connector: Connector; // 
   dispatcher: Dispatcher;   
   eventcodec: EventCodec; 
  localEventsBus: LocalEventsBus;
  collections: Map<string, ICollection> ;
  readTxn(collection: ICollection, fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void>;
  writeTxn(collection: ICollection, fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void>;
  notifyTxnEvents(node: IPLDNode, token?: ThreadToken): Promise<void>;
}


export interface Event<T = any> {  
  /** 事件时间戳 (Unix纳秒时间戳) */  
  readonly timestamp: BigInt;  
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
    get( key: Key): Promise<Uint8Array|undefined>;  
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
    txn: Transaction  ,
    oldData?: Uint8Array,  
    newData?: Uint8Array,  
   
  ) => Promise<void>;  

export interface Action {  
    type: CoreActionType;  
    instanceID: InstanceID;  
    collectionName: string;  
    previous?: Uint8Array;  
    current?: Uint8Array;  
  }  
  
  export interface ReduceAction {  
    type: CoreActionType;  
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
  
    create(actions: Action[]): Promise<[Event[],  IPLDNode ]>;  
  
    eventsFromBytes(data: Uint8Array): Promise<Event[]> ;  
    
  }  
  