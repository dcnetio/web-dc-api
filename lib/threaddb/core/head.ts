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

export const CIDUndef:CID = CID.create(1, 0x55, emptyMultihash)



/**  
 * 序列化函数，将 Head 对象转换为 JSON 字符串  
 * @param head - Head 对象  
 * @returns 序列化后的 JSON 字符串  
 */  
export function serializeHead(head: Head): string {  
    return JSON.stringify({  
      id: head.id.toString(),  // 转换 CID 为字符串  
      counter: head.counter,  
    });  
  }  
  
  /**  
   * 反序列化函数，将 JSON 字符串转换为 Head 对象  
   * @param json - JSON 字符串  
   * @returns 反序列化后的 Head 对象  
   */  
  export function deserializeHead(json: string): Head {  
    const data = JSON.parse(json);  
    
    return {  
      id: CID.parse(data.id), // 从字符串恢复 CID 对象  
      counter: data.counter,  
    };  
  }  
  
  // HeadBookRecord represents the list of heads currently in a log
export interface HeadBookRecord  {
	// List of current heads of a log.
	heads: Head[];
}

// 序列化函数  
export function serializeHeadBookRecord(record: HeadBookRecord): string {  
    return JSON.stringify({  
      heads: record.heads.map(head => ({  
        id: head.id.toString(), // 转换 CID 为字符串  
        counter: head.counter  
      }))  
    });  
  }  
  
  // 反序列化函数  
  export function deserializeHeadBookRecord(json: string): HeadBookRecord {  
    const raw = JSON.parse(json);  
    
    return {  
      heads: raw.heads.map((head: any) => ({  
        id: CID.parse(head.id), // 解析 CID 字符串  
        counter: Number(head.counter)  
      }))  
    };  
  }