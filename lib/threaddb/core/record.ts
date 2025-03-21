
import type { CID } from 'multiformats/cid'  
import {ThreadID} from '@textile/threads-id'
import type { PeerId } from "@libp2p/interface";
import type { PublicKey as CryptoPubKey } from '@libp2p/interface-keys'  
import * as dagPB from '@ipld/dag-pb'



// 根据需要定义缺失的 DAGService 接口  
interface DAGService {  
  get(cid: CID): Promise<Uint8Array>  
  put(block: Uint8Array, codec: number): Promise<CID>  
}  

// IPLD 节点接口  
export interface IPLDNode {  
  cid: CID  
  links: () => Promise<CID[]>  
  size: number  
  data: Uint8Array  
} 

  
export type Signature = Uint8Array  


// Record 基础接口  
export interface Record extends IPLDNode {  
  /** 获取内部区块的 CID */  
  blockID: () => CID  
  
  /** 异步加载内部区块 */  
  getBlock: ( dag: DAGService) => Promise<IPLDNode>  
  
  /** 前一个记录的 CID */  
  prevID: () => CID  
  
  /** 记录的数字签名 */  
  sig: () => Signature  
  
  /** 作者的原始公钥字节 */  
  pubKey: () => Uint8Array  
  
  /** 验证签名有效性 */  
  verify: (key: CryptoPubKey) => Promise<Error | null>  
}  

// 线程记录包装器  
export interface ThreadRecord {  
  /** 获取底层记录对象 */  
  value: () => Record  
  
  /** 所属线程的标识符 */  
  threadID: () => ThreadID  
  
  /** 日志来源的对等节点ID */  
  logID: () => PeerId 
}  
 

