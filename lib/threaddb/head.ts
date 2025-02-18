// 使用IPFS CID类型（假设已安装相关类型定义）  
import { CID } from 'multiformats/cid'  
import { sha256 } from 'multiformats/hashes/sha2'

// Head结构体转换  
export interface Head {  
  /** 使用multiformats的CID类型表示IPFS内容标识符 */  
  id: CID  
  /** 使用number表示计数器（注意JS的Number精度限制） */  
  counter: number  
}  

// 常量转换  
export const CounterUndef: number = 0  

// HeadUndef转换方案  
const emptyMultihash = await sha256.digest(new Uint8Array())
export const HeadUndef: Head = {  
  // 使用multiformats的CID undefined表示  
  id: CID.create(1, 0x55, emptyMultihash),  // 1表示CID版本，0x55表示raw
  counter: CounterUndef  
}  

