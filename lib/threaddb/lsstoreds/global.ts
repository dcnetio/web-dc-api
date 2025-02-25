import { ThreadID } from '@textile/threads-id'; 
import type { PeerId } from "@libp2p/interface";
import { peerIdFromString } from "@libp2p/peer-id";
import { Datastore, Key, KeyQuery,Pair } from 'interface-datastore' 
// 全局配置  
export let AllowEmptyRestore = false  
export const EmptyEdgeValue = 0  

// 配置选项接口  
export interface DSOptions {  
  CacheSize: number  
  GCPurgeInterval: number  // 毫秒单位  
  GCInitialDelay: number    // 毫秒单位  
}  

// 默认配置生成器  
export function DefaultOpts(): DSOptions {  
  return {  
    CacheSize: 1024,  
    GCPurgeInterval: 2 * 60 * 60 * 1000,  // 2小时  
    GCInitialDelay: 60 * 1000             // 60秒  
  }  
}  

// 唯一线程ID提取  
export async function uniqueThreadIds(  
    ds: Datastore,  
    prefix: Key,  
    extractor: (result: Key) => string  
  ): Promise<ThreadID[]> {  
    const q: KeyQuery = { prefix: prefix.toString() }  
    const results = await ds.queryKeys(q)  
    
    const idSet = new Set<string>()  
    for await (const result of results) {  
      idSet.add(extractor(result))  
    }  
  
    return Array.from(idSet)  
      .map(id => parseThreadID(id))  
      .filter(Boolean) as ThreadID[]  
  }  
  
  // 唯一日志ID提取  
  export async function uniqueLogIds(  
    ds: Datastore,  
    prefix: Key,  
    extractor: (result: Key) => string  
  ): Promise<PeerId[]> {  
    const q: KeyQuery = { prefix: prefix.toString()}  
    const results =  ds.queryKeys(q)  
    
    const idSet = new Set<string>()  
    for await (const result of results) {  
      idSet.add(extractor(result))  
    }  
  
    const parsedIds = await Promise.all(  
      Array.from(idSet).map(async id => {  
        try {  
          return await parseLogID(id)  
        } catch {  
          return null  
        }  
      })  
    )  
    
    return parsedIds.filter(Boolean) as PeerId[]  
  }  
  

    
export function parseThreadID(id: string): ThreadID {  
    try {  
      return ThreadID.fromString(id) 
    } catch {  
      return undefined as any 
    }  
  }  
  
  export async function parseLogID(id: string): Promise<PeerId> {  
    try {  
      return  peerIdFromString(id)  
    } catch {  
      throw new Error('Invalid log ID format')  
    }  
  }  






export function dsThreadKey(t: ThreadID, baseKey: Key): Key {  
    return baseKey.child(new Key(t.toString()) ) 
  }  
  
  export function dsLogKey(t: ThreadID, p: PeerId, baseKey: Key): Key {  
    return baseKey  
      .child(new Key(t.toString())  )
      .child(new Key(p.toString()) ) 
  } 
  
