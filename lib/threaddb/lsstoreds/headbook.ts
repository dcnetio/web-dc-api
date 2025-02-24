import { CID } from 'multiformats/cid'  
import { Key } from 'interface-datastore'  
import { Head, HeadBookRecord, serializeHeadBookRecord,deserializeHeadBookRecord } from '../head'  
import { 
    TxnDatastoreExtended,
    Transaction,
} from '../core/core';
import { ThreadID } from '@textile/threads-id';
import type { PeerId } from "@libp2p/interface";
import {dsLogKey,dsThreadKey} from '../core/logstore';

 


const hbBase = new Key('/thread/heads')  
const hbEdge = new Key('/thread/heads:edge')  

export class DsHeadBook {  
  private ds: TxnDatastoreExtended  

  constructor(datastore: TxnDatastoreExtended) {  
    this.ds = datastore  
  }  

  async addHeads(tid: ThreadID, pid: PeerId, heads: Head[]): Promise<void> {  
    return this.withTransaction(async txn => {  
      const key = dsLogKey(tid, pid, hbBase)  
      let existing = await this.getHeadsRecord(txn, key)  
        if (!existing) {  
            existing = { heads: [] }  
        }
      const newHeads = this.mergeHeads(existing, heads)  
      const record = { heads: newHeads };
      await this.saveRecord(txn, key, record)  
      await this.invalidateEdge(txn, tid)  
    })  
  }  

  private async withTransaction<T>(fn: (txn: Transaction) => Promise<T>): Promise<T> {  
    const txn = await this.ds.newTransactionExtended(false)
    try {  
      const result = await fn(txn)  
      await txn.commit()  
      return result  
    } catch (err) {  
       txn.discard()  
      throw err  
    }  
  }  

  private async getHeadsRecord(txn: Transaction, key: Key): Promise<HeadBookRecord | null> {  
    try {  
      const data = await txn.get(key)  
      if (!data) return null;
      return deserializeHeadBookRecord(new TextDecoder().decode(data)) 
    } catch (err) {  
      if (err.code === 'ERR_NOT_FOUND') return null  
      throw err  
    }  
  }  

  private mergeHeads(existing: HeadBookRecord, newHeads: Head[]): Head[] {  
    const seen = new Set(existing.heads.map(h => h.id.toString()))  
    return [  
      ...existing.heads,  
      ...newHeads.filter(h => !seen.has(h.id.toString()))  
    ]  
  }  

  private async saveRecord(txn: Transaction, key: Key, record: HeadBookRecord): Promise<void> {  
    const serializedRecord = serializeHeadBookRecord(record)
    const recordBytes = new TextEncoder().encode(serializedRecord)
    await txn.put(key, recordBytes)
  }  

  async headsEdge(tid: ThreadID, retries = 3): Promise<number> {  
    const key = dsThreadKey(tid, hbEdge)  
    
    for (let attempt = 1; attempt <= retries; attempt++) {  
      try {  
        return await this.calculateEdge(tid, key)  
      } catch (err) {  
        if (err.code !== 'TX_CONFLICT') throw err  
        await this.randomDelay(attempt)  
      }  
    }  
    throw new Error('Edge computation failed')  
  }  

  private async calculateEdge(tid: ThreadID, key: Key): Promise<number> {
    return this.withTransaction(async txn => {
      try {
        let data = await txn.get(key)
        if (!data) {
            //将data设置为一个空的Buffer
            data = Buffer.alloc(8)
        }
        return Buffer.from(data).readUInt32BE(0)
      } catch (err) {
        if (err.code !== 'ERR_NOT_FOUND') throw err
      }

      const heads = await this.collectHeads(txn, tid)
      if (heads.length === 0) throw new Error('Thread not found')

      const edge = this.computeEdgeValue(heads)
      const buffer = Buffer.alloc(8)
      buffer.writeBigUInt64BE(BigInt(edge))
      
      await txn.put(key, buffer)
      return edge
    })
  }
  private async collectHeads(txn: Transaction, tid: ThreadID): Promise<Head[]> {  
    const query = { prefix: dsThreadKey(tid, hbBase).toString() }  
    const results = txn.query(query)  
    
    const heads: Head[] = []  
    for await (const entry of results) {  
      const record = deserializeHeadBookRecord(new TextDecoder().decode(entry.value))
      heads.push(...record.heads.map(h => ({  
        id: CID.decode(new TextEncoder().encode(h.id.toString())),  
        counter: h.counter  
      })))  
    }  
    return heads.filter(h => h.counter !== 0)  
  }   

  private computeEdgeValue(heads: Head[]): number {  
    // 实现实际的边缘计算逻辑  
    return heads.reduce((acc, h) => acc + h.counter, 0)  
  }  

  private async invalidateEdge(txn: Transaction, tid: ThreadID): Promise<void> {  
    const key = dsThreadKey(tid, hbEdge)  
    await txn.delete(key)  
  }  

  private randomDelay(attempt: number): Promise<void> {  
    const delay = 50 * attempt + Math.random() * 30  
    return new Promise(resolve =>   
      setTimeout(resolve, delay)  
    )  
  }  
}