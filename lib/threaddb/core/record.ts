
import type { CID } from 'multiformats/cid'  
import {ThreadID} from '@textile/threads-id'
import type { PeerId } from "@libp2p/interface";
import type { PublicKey as CryptoPubKey } from '@libp2p/interface-keys'  
import { DAGCBOR} from '@helia/dag-cbor'
import { IPLDNode } from './core'






// IPLD 节点接口  

  
export type Signature = Uint8Array  


// Record 基础接口  
export interface IRecord extends IPLDNode {  
  /** 获取内部区块的 CID */  
  blockID: () => CID  
  
  /** 异步加载内部区块 */  
  getBlock: ( dag: DAGCBOR) => Promise<IPLDNode>  
  
  /** 前一个记录的 CID */  
  prevID: () => CID | undefined 
  
  /** 记录的数字签名 */  
  sig: () => Signature  
  
  /** 作者的原始公钥字节 */  
  pubKey: () => Uint8Array  
  
  /** 验证签名有效性 */  
  verify: (key: CryptoPubKey) => Promise<Error | undefined>  
}  

// 线程记录包装器  
export interface IThreadRecord {  
  /** 获取底层记录对象 */  
  value: () => IRecord  
  
  /** 所属线程的标识符 */  
  threadID: () => ThreadID  
  
  /** 日志来源的对等节点ID */  
  logID: () => PeerId 
}  
 

