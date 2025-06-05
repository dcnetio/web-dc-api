
 
import { Key,Datastore,Query,Batch } from 'interface-datastore';
import { Key as ThreadKey } from '../common/key';
import { ThreadID } from '@textile/threads-id';
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface";  
import { Multiaddr as TMultiaddr } from '@multiformats/multiaddr';
import { Head } from './head'; 
import { type AnySchema, type JSONSchemaType } from "ajv"; 
import { dcnet } from "../../../proto/dcnet_proto";
import { EventCodec } from "./db";
import type { CID } from 'multiformats/cid'  
import { Link } from 'multiformats/link'
import { DAGCBOR} from '@helia/dag-cbor'
import { ThreadToken } from './identity';
import { Ed25519PrivKey, Ed25519PubKey } from '../../../common/dc-key/ed25519';
import {net as net_pb} from "../pb/net_pb";
import { Protocol } from '../net/define';



// 上下文接口  
export interface Context {  
  signal?: AbortSignal | undefined  
  deadline?: Date | undefined  
}  

export interface IPLDNode {  
  cid(): CID
  links(): Link[]
  size(): number
  data(): Uint8Array
} 


export interface IBlock {
    data(): Uint8Array;
    cid(): CID;
}


// 接口定义  
export interface INet {  
  createThread( id: ThreadID, options: { token: ThreadToken; logKey?: Ed25519PrivKey|Ed25519PubKey, threadKey?: ThreadKey }): Promise<ThreadInfo>;  
  addThread(addr: ThreadMuliaddr,options: { token?: ThreadToken | undefined; logKey?: Ed25519PrivKey | Ed25519PubKey | undefined; threadKey?: ThreadKey | undefined } ): Promise<ThreadInfo>;
  getThread( id: ThreadID, ...opts: any[]): Promise<ThreadInfo>;  
  getThreadFromPeer( id: ThreadID, peer: PeerId, options: { token?: ThreadToken }): Promise<ThreadInfo>;
  deleteThread( id: ThreadID, ...opts: any[]): Promise<void>;  
  pullThread( id: ThreadID,timeout: number, ...opts: any[]): Promise<void>;  
  getPbLogs( id: ThreadID): Promise<[net_pb.pb.ILog[], IThreadInfo]>;  
}  



export interface ICollectionConfig {  
  name: string;  
  schema: AnySchema;  
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
  name?: string | undefined;  
  collections?: ICollectionConfig[] | undefined;  
  eventCodec?: EventCodec | undefined;  
  debug?: boolean | undefined;  
  key?: ThreadKey | undefined;
  logKey?: Ed25519PrivKey | Ed25519PubKey | undefined;
  block?: boolean | undefined;
  token?: ThreadToken | undefined; 

  constructor(init?: Partial<NewOptions>) {  
      Object.assign(this, init);  
  }  
} 

export type Token = Uint8Array;  

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
  name: string;
  key: ThreadKey;
  logKey: Ed25519PrivKey | Ed25519PubKey;
  token?: ThreadToken;
  collections: ICollectionConfig[];
  block: boolean;
} 


// ======== 事务接口 ========  
 

// ======== 键转换接口 ========  


export interface AbortOptions {  
    signal?: AbortSignal  
  }  







      // 定义对称密钥类型
export interface SymKey {
  key: CryptoKey;
  raw: Uint8Array;
}


export  class ThreadMuliaddr{
  addr: TMultiaddr
  id: ThreadID
  constructor(addr: TMultiaddr, id: ThreadID) {
    this.id = id
    this.addr = addr
  }
  getMultiaddrString(): string {
   const addr = this.addr.toString()
   const id = this.id.toString()
   const addrStr = addr + '/' + Protocol.name + '/' + id
    return addrStr
  }
}

// 定义 Thread Info 的接口  
export interface IThreadInfo {  
  id: ThreadID;  
  key: ThreadKey | undefined;  
  logs: IThreadLogInfo[];
  addrs: ThreadMuliaddr[];
  getFirstPrivKeyLog() :IThreadLogInfo | undefined
}  

export interface IDBInfo {
  id: string;
  name: string;
  addrs: string[];
  key: string | undefined;
}

export class ThreadInfo  implements IThreadInfo {  
   public id: ThreadID;
    public logs: IThreadLogInfo[]; 
    public addrs: ThreadMuliaddr[];
    public key: ThreadKey | undefined;
  constructor(  
    id: ThreadID, 
   logs: IThreadLogInfo[],  
   addrs: ThreadMuliaddr[] ,
   key?: ThreadKey,  
  ) {
    this.id = id;
    this.logs = logs;
    this.addrs = addrs;
    if (key) {
      this.key = key;
    }else {
      this.key = undefined;
    }
    
  }


public getFirstPrivKeyLog() :IThreadLogInfo | undefined {
  for (const lg of this.logs) {
    if (lg.privKey) {
      return lg
    }
  }
  return 
}
  
} 

export interface IThreadLogInfo {  
// id is the log's identifier.
  id: PeerId;  
// privKey is the log's private key.
  privKey?: PrivateKey;  
// pubKey is the log's public key.
  pubKey?: PublicKey;  
// Addrs are the addresses associated with the given log.
  addrs: TMultiaddr[];  
// Managed logs are any logs directly added/created by the host, and/or logs for which we have the private key
  managed: boolean;  
// Head is the log's current head.
  head?: Head;
}  

// 定义 Store 接口  
export interface Store {  
  addThread(info: IThreadInfo): Promise<void>;  
  addLog(id: ThreadID, logInfo: IThreadLogInfo): Promise<void>;  
  putBytes(id: ThreadID, identity: string, bytes: Uint8Array): Promise<void>;  
}  



