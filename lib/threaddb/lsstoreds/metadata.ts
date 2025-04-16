import { Key, Datastore, Query } from 'interface-datastore'  
import { IThreadMetadata, DumpMetadata, MetadataKey } from '../core/logstore'
import { ThreadID } from '@textile/threads-id';
import * as buffer from "buffer/";
const { Buffer } = buffer;

const AllowEmptyRestore = false  

// 元数据键前缀  
const tmetaBase = new Key('/thread/meta')  


export function newThreadMetadata(ds: Datastore): DsThreadMetadata {
    return new DsThreadMetadata(ds);
}

export class DsThreadMetadata implements IThreadMetadata {  
  constructor(private readonly ds: Datastore) {}  

  async getInt64(t: ThreadID, key: string): Promise<number | null> {  
    return this.getValue<number>(t, key)  
  }  

  async putInt64(t: ThreadID, key: string, val: number): Promise<void> {  
    return this.setValue(t, key, val)  
  }  

  async getString(t: ThreadID, key: string): Promise<string | null> {  
    return this.getValue<string>(t, key)  
  }  

  async putString(t: ThreadID, key: string, val: string): Promise<void> {  
    return this.setValue(t, key, val)  
  }  

  async getBool(t: ThreadID, key: string): Promise<boolean | null> {  
    return this.getValue<boolean>(t, key)  
  }  

  async putBool(t: ThreadID, key: string, val: boolean): Promise<void> {  
    return this.setValue(t, key, val)  
  }  

  async getBytes(t: ThreadID, key: string): Promise<Uint8Array | null> {  
    const value = await this.getValue<Uint8Array>(t, key)
    return value ? Buffer.from(value) : null
  }  


  async putBytes(t: ThreadID, key: string, val: Uint8Array): Promise<void> {  
    return this.setValue(t, key, val)  
  }  

  private keyMeta(t: ThreadID, k: string): Key {  
    const tKey = t.toString()
    return tmetaBase.child(new Key(tKey)).child(new Key(k))  
  }  

  private async getValue<T>(t: ThreadID, key: string): Promise<T | null> {  
    const k = this.keyMeta(t, key)  
    try {  
      const value = await this.ds.get(k)  
      return this.decodeValue<T>(value)  
    } catch (err) {  
      if (err.code === 'ERR_NOT_FOUND') return null  
      throw new Error(`Error getting metadata: ${err.message}`)  
    }  
  }  

  private async setValue(t: ThreadID, key: string, val: any): Promise<void> {  
    const k = this.keyMeta(t, key)  
    const value = this.encodeValue(val)  
    try {  
      await this.ds.put(k, value)  
    } catch (err) {  
      throw new Error(`Error setting metadata: ${err.message}`)  
    }  
  }  

  async clearMetadata(t: ThreadID): Promise<void> {  
    const prefix = tmetaBase.child(new Key(t.toString())).toString()  
    return this.clearKeys(prefix)  
  }  

  async dumpMeta(): Promise<DumpMetadata> {  
    const dump: DumpMetadata = {  
      data: {  
        bool: {},  
        int64: {},  
        string: {},  
        bytes: {}  
      }  
    }  

    const results = this.ds.query({ prefix: tmetaBase.toString() })  
    try {  
      for await (const entry of results) {  
        const kns = new Key(entry.key.toString()).list()  
        if (kns.length < 4) {  
          throw new Error(`Bad metabook key: ${entry.key}`)  
        }  
        const [,, ts, key] = kns  
        const tid = this.parseThreadID(ts)  
        const mk: MetadataKey = { t: tid, k: key }  

        const value = await this.decodeAnyValue(entry.value)  
        this.storeDecodedValue(dump, mk, value)  
      }  
    } catch (err) {  
      throw new Error(`Error dumping metadata: ${err.message}`)
    } 
    return dump  
  }  

  async restoreMeta(dump: DumpMetadata): Promise<void> {  
    const dataLen = Object.keys(dump.data.bool).length + Object.keys(dump.data.int64).length +   
                   Object.keys(dump.data.string).length + Object.keys(dump.data.bytes).length  
    if (!AllowEmptyRestore && dataLen === 0) {  
      throw new Error('Empty metadata dump')  
    }  

    await this.clearKeys(tmetaBase.toString())  

    const entries = [  
      ...Object.entries(dump.data.bool),  
      ...Object.entries(dump.data.int64),  
      ...Object.entries(dump.data.string),  
      ...Object.entries(dump.data.bytes),  
    ]  

    for (const [mkStr, value] of entries) {  
      const mk: MetadataKey = JSON.parse(mkStr);
      await this.setValue(mk.t, mk.k, value)  
    }  
  }  

  private async clearKeys(prefix: string): Promise<void> {  
    const results = this.ds.queryKeys({ prefix })  
    try {  
      for await (const key of results) {  
        await this.ds.delete(key)
      }  
    } catch (err) {
        throw new Error(`Error clearing keys: ${err.message}`)
    }  
  }  

  private decodeValue<T>(buf: Uint8Array): T {  
    try {  
      const decoder = new TextDecoder()  
      return JSON.parse(decoder.decode(buf)) as T  
    } catch (err) {  
      throw new Error(`Value decoding failed: ${err.message}`)  
    }  
  }  

  private encodeValue(val: any): Uint8Array {  
    try {  
      const encoder = new TextEncoder()  
      return encoder.encode(JSON.stringify(val))  
    } catch (err) {  
      throw new Error(`Value encoding failed: ${err.message}`)  
    }  
  }  

  private parseThreadID(ts: string): ThreadID {  
    try {  
      return ThreadID.fromString(ts)  
    } catch (err) {  
      throw new Error(`Invalid thread ID: ${ts}`)  
    }  
  }  

  private storeDecodedValue(  
    dump: DumpMetadata,  
    mk: MetadataKey,  
    value: any  
  ) {  
    switch (typeof value) {  
      case 'boolean':  
        dump.data.bool[mk.t.toString()] = dump.data.bool[mk.t.toString()] || false;
        dump.data.bool[mk.t.toString()][mk.k] = value;
        break  
      case 'number':  
        dump.data.int64[mk.t.toString()] = dump.data.int64[mk.t.toString()] || 0;
        dump.data.int64[mk.t.toString()][mk.k] = value;
        break  
      case 'string':  
        dump.data.string[mk.t.toString()] = dump.data.string[mk.t.toString()] || '';
        dump.data.string[mk.t.toString()][mk.k] = value;
        break  
      default:  
        if (value instanceof Uint8Array) {  
          dump.data.bytes[mk.t.toString()] = dump.data.bytes[mk.t.toString()] || {};
          dump.data.bytes[mk.t.toString()][mk.k] = value;
        } else {  
          throw new Error(`Unsupported value type for key: ${mk.k}`)  
        }  
    }  
  }  

  private async decodeAnyValue(buf: Uint8Array): Promise<any> {  
    try {  
      return this.decodeValue<any>(buf)  
    } catch {  
      // 原始字节回退  
      return buf  
    }  
  }  
}