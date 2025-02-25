
import { Datastore, Key, Query } from 'interface-datastore'  
import {newAddrBook} from './addr_book'
import {newKeyBook} from './keybook'
import {newThreadMetadata} from './metadata'
import {newHeadBook} from './headbook'
import * as lstore from '../logstore'
import type { PeerId } from "@libp2p/interface";
import {  QueryExt, QueryResult, TxnDatastoreExtended,Transaction } from '../core/core'  
import { peerIdFromString } from "@libp2p/peer-id";
import { ThreadID } from '@textile/threads-id'; 
import {  Logstore} from '../core/logstore' // 假设核心接口定义  
import {AllowEmptyRestore,EmptyEdgeValue,DSOptions,DefaultOpts} from './global'


// 日志存储创建函数  
export async function newLogstore(  
  store: Datastore & { transaction?: any },  
  opts: DSOptions  
): Promise<Logstore> {  
  const addrBook = await newAddrBook( store, opts)  
  const keyBook = await newKeyBook(store)  
  const threadMetadata = newThreadMetadata(store)  
  const headBook = newHeadBook(store as TxnDatastoreExtended)  
  
  return lstore.newLogstore(keyBook, addrBook, headBook, threadMetadata)  
}  
 

