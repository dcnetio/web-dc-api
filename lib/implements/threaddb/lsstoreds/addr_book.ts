import { Datastore, Key, Pair } from 'interface-datastore'
import * as bytes from 'uint8arrays'
import {  peerIdFromString } from '@libp2p/peer-id'  
import type { PeerId,PrivateKey,PublicKey } from "@libp2p/interface";
import { Multiaddr, multiaddr, isMultiaddr } from '@multiformats/multiaddr'  
import {  AddrBook,DumpAddrBook} from '../core/logstore' // 核心接口定义  
import  * as pb from '../pb/lstore'
import {uniqueLogIds,uniqueThreadIds,DSOptions,AllowEmptyRestore,dsThreadKey} from './global'
import {LRUCache} from 'lru-cache'  
import { ThreadID } from '@textile/threads-id';
import {DefaultOpts} from './global'


// 缓存键类型  
type CacheKey = {  
  threadID: ThreadID  
  peerID: string  
}  

// TTL写入模式  
enum TTLWriteMode {  
  Override,  
  Extend  
}  

// 地址记录增强类型  
interface  AddrsRecord {  
  lock: AsyncMutex  
  data: pb.AddrBookRecord   
  dirty: boolean  
}  


// NewAddrBook initializes a new datastore-backed address book. It serves as a drop-in replacement for pstoremem
// (memory-backed peerstore), and works with any datastore implementing the ds.Batching interface.
//
// Threads and logs addresses are serialized into protobuf, storing one datastore entry per (thread, log), along with metadata
// to control address expiration. To alleviate disk access and serde overhead, we internally use a read/write-through
// ARC cache, the size of which is adjustable via Options.CacheSize.
export async function newAddrBook(ds: Datastore, opts?: DSOptions): Promise<DsAddrBook> {
    if (!opts) {
        opts = DefaultOpts();
    }
    const ab = new DsAddrBook(ds, opts);
    if (opts.CacheSize > 0) {
        ab.cache = new LRUCache({ max: opts.CacheSize });
    } else {
        ab.cache = new LRUCache({ max: 0 });
    }
    return ab;
}


export class DsAddrBook implements AddrBook {  
  private static readonly logBookBase = new Key('/thread/addrs')  
  private static readonly logBookEdge = new Key('/thread/addrs:edge')  
 
 
  private opts: DSOptions  
  private ds: Datastore  
   cache: LRUCache<CacheKey, AddrsRecord>  

  constructor( ds: Datastore, opts: DSOptions) {  
    this.opts = opts  
    this.ds = ds  
    this.cache = new LRUCache({ max: opts.CacheSize || 0 })   
  }  


    async addAddr(t: ThreadID, p: PeerId, addrs: Multiaddr, ttl: number): Promise<void> {  

        if (ttl <= 0) return  
        const cleaned = this.cleanAddrs([addrs])
        await this.setAddrs(t, p, cleaned, ttl)
    }

  async addAddrs(t: ThreadID, p: PeerId, addrs: Multiaddr[], ttl: number): Promise<void> {  
    if (ttl <= 0) return  
    const cleaned = this.cleanAddrs(addrs)  
    await this.setAddrs(t, p, cleaned, ttl)  
  }   

   cleanAddrs(addrs: (string | Multiaddr | null | undefined)[]): Multiaddr[] {  
    return addrs.reduce<Multiaddr[]>((acc, item) => {  
      try {  
        if (!item) return acc 
        const addr = typeof item === 'string'   
          ?  multiaddr(item)   
          : (item instanceof multiaddr ? item : null)  
        return addr ? [...acc, addr] : acc  
      } catch {  
        return acc 
      }  
    }, [])  
  }


    async setAddr(t: ThreadID, p: PeerId, addr: Multiaddr, ttl: number): Promise<void> {  
        if (ttl <= 0) return  
        const cleaned = this.cleanAddrs([addr])  
        await this.setAddrs(t, p, cleaned, ttl)  
    }

   async setAddrs(t: ThreadID, logId: PeerId, addrs: Multiaddr[], ttl: number): Promise<void> {  
    let release = () => {}
    try {  
      const record = await this.loadRecord(t, logId.toString(), true,false)  
      release = await record.lock.acquire()  
      const newExp = Date.now() + ttl  
      const existed = new Array(addrs.length).fill(false)  

      // 更新现有地址  
      outer: for (const [i, addr] of addrs.entries()) {  
        for (const entry of record.data.addrs) {  
          if (addr.bytes == entry.addr) {  
            existed[i] = true  
            entry.ttl = ttl  
            entry.expiry = newExp  
            continue outer  
          }  
        }  
      }  

      // 添加新地址  
      const added = addrs  
        .filter((_, i) => !existed[i])  
        .map(addr => new  pb.AddrBookRecord.AddrEntry({
            addr: addr.bytes,  
            expiry: newExp,  
            ttl  
        }))

      record.data.addrs.push(...added)  
      record.dirty = true  
      await this.cleanRecord(record)  
      await this.flushRecord(record)  
    } finally {  
      release()  
    }  
  }  

  async updateAddrs(t: ThreadID, logId: PeerId, oldTTL: number, newTTL: number): Promise<void> {
    let release = () => {}
    try {  
        const record = await this.loadRecord(t, logId.toString(), true,false)  
        release = await record.lock.acquire()  
        const newExp = Date.now() + newTTL
        for (const entry of record.data.addrs) {  
            if (entry.ttl === oldTTL) {  
            entry.ttl = newTTL  
            entry.expiry = newExp  
            record.dirty = true  
            }  
        }
        await this.cleanRecord(record)
        await this.flushRecord(record)
    } finally {
        release()
    }
	
}


async addrs(t: ThreadID, logId: PeerId): Promise<Multiaddr[]> {
    let release = () => {}
    try {  
        const record = await this.loadRecord(t, logId.toString(), true,true)  
        release = await record.lock.acquire()  
        const addrs = multiaddr[record.data.addrs.length]
        for (const entry of record.data.addrs) {  
            addrs.push(multiaddr(entry.addr))
        }
        return addrs
    } finally {
        release()
    }
}


async clearAddrs(t: ThreadID, logId: PeerId): Promise<void> {
    this.cache.del({ threadID: t, peerID: logId.toString() });

    const key = this.genDSKey(t, logId.toString());
    try {
        await this.ds.delete(key);
        await this.invalidateEdge(t);
    } catch (err) {
        throw new Error(`Failed to clear addresses for log ${logId.toString()}: ${err.message}`);
    }
}



async logsWithAddrs(t: ThreadID): Promise<PeerId[]> {
    try {
        const ids = await uniqueLogIds(this.ds, DsAddrBook.logBookBase.child(new Key(t.toString())), (result) => {
            return result.name();
        });
        return ids;
    } catch (err) {
        throw new Error(`Error while retrieving logs with addresses: ${err.message}`);
    }
}

async threadsFromAddrs(): Promise<ThreadID[]> {
    try {
        const ids = await uniqueThreadIds(this.ds, DsAddrBook.logBookBase, (result) => {
            return result.parent().name();
        });
        return ids;
    } catch (err) {
        throw new Error(`Error while retrieving thread from addresses: ${err.message}`);
    }
}

async addrsEdge(t: ThreadID): Promise<number> {
    const key = this.genDSKey(t, DsAddrBook.logBookEdge.toString());
    try {
        const value = await this.ds.get(key);
        return Number(new DataView(value.buffer).getBigUint64(0));
    } catch (err) {
        if (err.code !== 'ERR_NOT_FOUND') {
            throw err;
        }
    }

    const result =  this.ds.query({ prefix: this.genDSKey(t, DsAddrBook.logBookBase.toString()).toString()});
    const now = Date.now();
    const as: { logId: PeerId, addr: Uint8Array }[] = [];

    for await (const entry of result) {
        const { tid,pid, record } = this.decodeAddrEntry(entry, true);
        if (!record) {
            continue;
        }
        for (const addr of record.addrs) {
            if (addr.expiry > now) {
                as.push({ logId:pid, addr: addr.addr });
            }
        }
    }

    if (as.length === 0) {
        throw new Error('Thread not found');
    }

    const edge = this.computeAddrsEdge(as);
    const buff = new ArrayBuffer(8);
    new BigUint64Array(buff)[0] = BigInt(edge);
    await this.ds.put(key, new Uint8Array(buff));
    return edge;
}



  private async loadRecord(t: ThreadID, p: string, cache: boolean,update:boolean): Promise<AddrsRecord> {  
    const cacheKey = { threadID: t, peerID: p }  
    if (this.cache.has(cacheKey)) {  
        const addrsRecord = this.cache.get(cacheKey)!
        await this.cleanRecord(addrsRecord)
        if (update) {
            await this.flushRecord(addrsRecord)
        }
        return addrsRecord
    }
    const key = this.genDSKey(t, p)  
    try {  
        const data = await this.ds.get(key)  
        const record =  pb.AddrBookRecord.deserialize(data)
        const addrsRecord = { lock: new AsyncMutex(), data: record, dirty: false }
        await this.cleanRecord(addrsRecord)
        if (update) {
            await this.flushRecord(addrsRecord)
        }
        if (cache) {
            this.cache.set(cacheKey, addrsRecord)
            return addrsRecord
        }   
        return addrsRecord 
    } catch (err) {  
      if (err.code === 'ERR_NOT_FOUND') {  
        const peerIdBytes = new TextEncoder().encode(p)
        return {  
          lock: new AsyncMutex(),  
          data: pb.AddrBookRecord.fromObject({threadID:t.toBytes(),  peerID:peerIdBytes,addrs:[] } ),  
          dirty: false  
        }  
      }  
      throw err  
    }  
  }  

  private async cleanRecord(record: AddrsRecord): Promise<boolean> {  
    const now = Date.now()  
    const valid = record.data.addrs.filter(a => a.expiry > now)  
    const changed = valid.length !== record.data.addrs.length  
    record.data.addrs = valid.sort((a, b) => a.expiry - b.expiry)  
    return changed  
  }  

  private async flushRecord(record: AddrsRecord): Promise<void> {  
    const threadId = ThreadID.fromBytes(record.data.threadID)
    const logId = new TextDecoder().decode(record.data.peerID)
    if (record.data.addrs.length === 0) {  
        await this.ds.delete(this.genDSKey(threadId, logId))
    } else {  
      const data = record.data.serialize()
      await this.ds.put(this.genDSKey(threadId, logId), data)  
    }  
    record.dirty = false  
  }  

  private genDSKey(t: ThreadID, p: string): Key {  
    const tKey = new Key(t.toString()) 
    const pKey = new Key(p) 
    return DsAddrBook.logBookBase.child(tKey).child(pKey)  
  }  


  private async invalidateEdge(tid: ThreadID): Promise<void> {
	var key = dsThreadKey(tid, DsAddrBook.logBookEdge)
	return this.ds.delete(key)
  }



private async traverse(withAddrs: boolean): Promise<{ [key: string]: { [key: string]: pb.AddrBookRecord } }> {
    const data: { [key: string]: { [key: string]: pb.AddrBookRecord } } = {};
    let result = this.ds.query({ prefix: DsAddrBook.logBookBase.toString()});
    for await (const entry of result) {
        const { tid, pid, record } = this.decodeAddrEntry(entry, withAddrs);

        if (!data[tid.toString()]) {
            data[tid.toString()] = {};
        }
        data[tid.toString()][pid.toString()] = record!;
    }
    return data;
}


    private decodeAddrEntry(entry: Pair, withAddrs: boolean): { tid: ThreadID, pid: PeerId, record?: pb.AddrBookRecord } {
        const kns = entry.key.toString().split('/');
        if (kns.length < 3) {
            throw new Error(`bad addressbook key detected: ${entry.key}`);
        }

        // get thread and log IDs from the key components
        const ts = kns[kns.length - 2];
        const ls = kns[kns.length - 1];

        const tid = ThreadID.fromString(ts);
        const pid = peerIdFromString(ls);

        let record: pb.AddrBookRecord | undefined;
        if (withAddrs) {
            record = pb.AddrBookRecord.deserialize(entry.value);
        }

        return { tid, pid, record };
    }

      

    private computeAddrsEdge(as: { logId: PeerId, addr: Uint8Array }[]): number {
        // sort peer addresses for deterministic edge computation
        as.sort((a, b) => {
            if (a.logId.toString() === b.logId.toString()) {
                return bytes.compare(a.addr, b.addr);
            }
            return a.logId.toString() < b.logId.toString() ? -1 : 1;
        });

        const hasher = new TextEncoder();
        let hash = 0n;
        for (const item of as) {
            const logIdBytes = hasher.encode(item.logId.toString());
            const addrBytes = item.addr;
            for (const byte of logIdBytes) {
                hash = (hash * 31n + BigInt(byte)) % 2n**64n;
            }
            for (const byte of addrBytes) {
                hash = (hash * 31n + BigInt(byte)) % 2n**64n;
            }
        }
        return Number(hash);
    }

    // dumpAddrs(): Promise<DumpAddrBook>;  
    async dumpAddrs(): Promise<DumpAddrBook> {
        const dump: { [key: string]: { [key: string]: { addr: Multiaddr, expires: Date }[] } } = {};
        const data = await this.traverse(true);

        for (const [tid, logs] of Object.entries(data)) {
            const lm: { [key: string]: { addr: Multiaddr, expires: Date }[] } = {};
            for (const [lid, rec] of Object.entries(logs)) {
                if (rec.addrs.length > 0) {
                    const addrs = rec.addrs.map(r => ({
                        addr: multiaddr(r.addr),
                        expires: new Date(r.expiry)
                    }));
                    lm[lid] = addrs.map(a => ({ addr: a.addr, expires: a.expires }));
                }
            }
            dump[tid] = lm;
        }
        return { data: dump };
    }

    async restoreAddrs(dump:DumpAddrBook): Promise<void> {
        if (!AllowEmptyRestore && Object.keys(dump.data).length === 0) {
            throw new Error('Empty dump');
        }

        const stored = await this.traverse(false);

        for (const [tid, logs] of Object.entries(stored)) {
            for (const lid of Object.keys(logs)) {
                await this.clearAddrs(ThreadID.fromString(tid), peerIdFromString(lid));
            }
        }
        const current = new Date();
        for (const [tid, logs] of Object.entries(dump.data)) {
            for (const [lid, addrs] of Object.entries(logs)) {
                for (const addr of addrs) {
                    const ttl = addr.expires.getTime() - current.getTime();
                    if (ttl > 0) {
                        await this.setAddrs(ThreadID.fromString(tid), peerIdFromString(lid), [multiaddr(addr.addr)], ttl);
                    }
                }
            }
        }
    }
}

// 辅助类实现  
class AsyncMutex {  
  private queue: (() => void)[] = []  
  private locked = false  

  async acquire(): Promise<() => void> {  
    while (this.locked) {  
      await new Promise<void>(resolve => this.queue.push(resolve))  
    }  
    this.locked = true  
    return () => {  
      this.locked = false  
      const next = this.queue.shift()  
      next?.()  
    }  
  }  
}  
