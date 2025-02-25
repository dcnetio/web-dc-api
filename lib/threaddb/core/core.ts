
 
import { Key,Datastore,Query,Batch } from 'interface-datastore';
import { Key as ThreadKey } from '../key';
import { ThreadID } from '@textile/threads-id';
import { Ed25519PrivKey,Ed25519PubKey } from "../../dc-key/ed25519";
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface"; 
import { Multiaddr } from '@multiformats/multiaddr'; 
import { Head } from './head'; 

// ======== 基础类型定义 ========  
export interface Context extends Record<string, any> {  
  signal?: AbortSignal;  
}  


export interface JsonSchema {  
  type: string;  
  properties?: Record<string, JsonSchema>;  
  required?: string[];  
}  


export interface CollectionConfig {  
  name: string;  
  schema: JsonSchema;  
  indexes?: Index[];  
  writeValidator?: string;  
  readFilter?: string;  
}  

export interface Index {  
  path: string;  
  unique: boolean;  
}  

export interface DBInfo {  
  name: string;  
  addrs: string[];  
  key: Uint8Array;  
}  



 
export class NewOptions {  
  name?: string;  
  collections?: CollectionConfig[];  
  eventCodec?: any;  
  debug?: boolean;  
  key?: ThreadKey;
  LogKey?: Ed25519PrivKey|Ed25519PubKey;
  block?: boolean;
  token?: Token; 

  constructor(init?: Partial<NewOptions>) {  
      Object.assign(this, init);  
  }  
} 

type Token = Uint8Array;  

class TokenUtil {  
    // 判断两个 Token 是否相等  
    static equal(t: Token, b: Token): boolean {  
        if (t.length !== b.length) {  
            return false;  
        }  
        for (let i = 0; i < t.length; i++) {  
            if (t[i] !== b[i]) {  
                return false;  
            }  
        }  
        return true;  
    }  
}

export interface ManagedOptions {  
  token?: Token;  
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


      // 定义对称密钥类型
export interface SymKey {
  key: CryptoKey;
  raw: Uint8Array;
}




export interface ThreadToken {  
  validate(privKey: string): Promise<PublicKey>;  
}  



// 定义 Thread Info 的接口  
export interface ThreadInfo {  
  id: ThreadID;  
  key: ThreadKey;  
  logs: ThreadLogInfo[];
	addrs: Multiaddr[];
}  

export interface ThreadLogInfo {  
// id is the log's identifier.
  id: PeerId;  
// privKey is the log's private key.
  privKey?: PrivateKey;  
// pubKey is the log's public key.
  pubKey?: PublicKey;  
// Addrs are the addresses associated with the given log.
  addrs: Multiaddr[];  
// Managed logs are any logs directly added/created by the host, and/or logs for which we have the private key
  managed: boolean;  
// Head is the log's current head.
  head: Head;
}  

// 定义 Store 接口  
export interface Store {  
  addThread(info: ThreadInfo): Promise<void>;  
  addLog(id: ThreadID, logInfo: ThreadLogInfo): Promise<void>;  
  putBytes(id: ThreadID, identity: string, bytes: Uint8Array): Promise<void>;  
}  