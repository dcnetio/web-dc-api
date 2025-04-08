
 
import { Key,Datastore,Query,Batch } from 'interface-datastore';
import { Key as ThreadKey } from '../key';
import { ThreadID } from '@textile/threads-id';
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface"; 
import { Multiaddr } from '@multiformats/multiaddr'; 
import { Head } from './head'; 
import { type JSONSchemaType } from "ajv"; 
import { dcnet } from "../../proto/dcnet_proto";
import { EventCodec } from "./db";
import type { CID } from 'multiformats/cid'  
import { Link } from 'multiformats/link'
import { DAGCBOR} from '@helia/dag-cbor'



// 上下文接口  
export interface Context {  
  signal?: AbortSignal  
  deadline?: Date  
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
export interface INet extends DAGCBOR{  
  createThread( id: ThreadID, ...opts: any[]): Promise<void>;  
  addThread( addr: Multiaddr, ...opts: any[]): Promise<void>;  
  getThread( id: ThreadID, ...opts: any[]): Promise<ThreadInfo>;  
  getThreadFromPeer( id: ThreadID, peer: PeerId, ...opts: any[]): Promise<ThreadInfo>;
  deleteThread( id: ThreadID, ...opts: any[]): Promise<void>;  
  pullThread( id: ThreadID,timeout: number, ...opts: any[]): Promise<void>;  
  getPbLogs( id: ThreadID): Promise<[dcnet.pb.LogInfo[], ThreadInfo]>;  
}  

// export interface JsonSchema {  
//   type: string;  
//   properties?: Record<string, JsonSchema>;  
//   required?: string[];  
// }  


export interface CollectionConfig {  
  name: string;  
  schema: JSONSchemaType<any>;  
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
  eventCodec?: EventCodec;  
  debug?: boolean;  
  key?: ThreadKey;
  logKey?: PrivateKey | PublicKey;
  block?: boolean;
  token?: Token; 

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
  logKey: PrivateKey | PublicKey;
  token?: Token;
  collections: CollectionConfig[];
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






// 定义 Thread Info 的接口  
export interface ThreadInfo {  
  id: ThreadID;  
  key?: ThreadKey;  
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
  head?: Head;
}  

// 定义 Store 接口  
export interface Store {  
  addThread(info: ThreadInfo): Promise<void>;  
  addLog(id: ThreadID, logInfo: ThreadLogInfo): Promise<void>;  
  putBytes(id: ThreadID, identity: string, bytes: Uint8Array): Promise<void>;  
}  



