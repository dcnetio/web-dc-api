// net.ts  
import type { CID } from 'multiformats/cid'  
import {IPLDNode} from './record'
import { SymmetricKey } from '../key'


// 事件头接口  
export interface EventHeader extends IPLDNode {  
  /**   
   * 获取事件体的解密密钥   
   * @throws 当密钥不可用时抛出 CryptoError  
   */  
  key(): Promise<SymmetricKey>  
}  

// 线程事件接口  
export interface ThreadEvent extends IPLDNode {  
  /** 获取事件头的 CID */  
  headerCID: CID  

  /**  
   * 异步加载事件头  
   * @param decryptKey 可选的解密密钥（用于加密头）  
   */  
  getHeader(  
    ctx: Context,   
    decryptKey?: SymmetricKey  
  ): Promise<EventHeader>  

  /** 获取事件体的 CID */  
  bodyCID: CID  

  /**  
   * 异步加载事件体  
   * @param decryptKey 必须提供头密钥才能解密  
   */  
  getBody(  
    ctx: Context,  
    decryptKey: SymmetricKey  
  ): Promise<IPLDNode>  
}  

// 上下文接口  
export interface Context {  
  signal?: AbortSignal  
  deadline?: Date  
}  

// 加密错误类型  
export class CryptoError extends Error {  
  constructor(  
    public readonly code: 'MISSING_KEY' | 'DECRYPT_FAILED',  
    message?: string  
  ) {  
    super(message)  
  }  
}  