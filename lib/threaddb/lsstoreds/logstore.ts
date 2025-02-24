
import { Datastore, Key, Query } from 'interface-datastore'  
import type { PeerId } from "@libp2p/interface";
import {  QueryExt, QueryResult, TxnDatastoreExtended,Transaction } from '../core/core'  
import { peerIdFromString } from "@libp2p/peer-id";
import { ThreadID } from '@textile/threads-id'; 
import {  Logstore} from '../core/logstore' // 假设核心接口定义  

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

// 日志存储创建函数  
export async function NewLogstore(  
  ctx: Context,   
  store: Datastore & { transaction?: any },  
  opts: DSOptions  
): Promise<Logstore> {  
  const addrBook = await NewAddrBook(ctx, store, opts)  
  const keyBook = await NewKeyBook(store)  
  const threadMetadata = NewThreadMetadata(store)  
  const headBook = NewHeadBook(store as TxnDatastore)  
  
  return lstore.NewLogstore(keyBook, addrBook, headBook, threadMetadata)  
}  

// 唯一线程ID提取  
export async function uniqueThreadIds(  
  ds: Datastore,  
  prefix: Key,  
  extractor: (result: Result) => string  
): Promise<ThreadID[]> {  
  const q: Query = { prefix: prefix.toString(), keysOnly: true }  
  const results = await ds.query(q)  
  
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
  extractor: (result: Result) => string  
): Promise<PeerId[]> {  
  const q: Query = { prefix: prefix.toString(), keysOnly: true }  
  const results = await ds.query(q)  
  
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
  
  return parsedIds.filter(Boolean) as peer.ID[]  
}  

// 路径生成工具  
export function dsThreadKey(t: ThreadID, baseKey: Key): Key {  
  return baseKey.child(base32.encode(t.bytes, { useRFC4648: true }))  
}  

export function dsLogKey(t: ThreadID, p: peer.ID, baseKey: Key): Key {  
  return baseKey  
    .child(base32.encode(t.bytes, { useRFC4648: true }))  
    .child(base32.encode(p.toBytes(), { useRFC4648: true }))  
}  

// ID解析工具  
export function parseThreadID(id: string): ThreadID {  
  try {  
    return peerIdFromString(id) 
  } catch {  
    return thread.undefined()  
  }  
}  

export async function parseLogID(id: string): Promise<PeerId> {  
  try {  
    return  peerIdFromString(id)  
  } catch {  
    throw new Error('Invalid log ID format')  
  }  
}  

// 类型扩展  
interface TxnDatastore extends Datastore {  
  transaction: (fn: (txn: any) => Promise<void>) => Promise<void>  
}  

type Context = {  
  signal?: AbortSignal  
}