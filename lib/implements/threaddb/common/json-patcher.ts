// json-patcher.ts - 完整实现  
import { name,code, encode, decode } from '@ipld/dag-cbor';  
import { sha256 } from 'multiformats/hashes/sha2';  
import * as Block from 'multiformats/block';  
import { Key } from 'interface-datastore';
import * as dagCBOR from '@ipld/dag-cbor';
import * as cbornode from '../cbor/node';
import {       
  IndexFunc,    
  Transaction,  
  TxnDatastoreExtended
} from '../core/db'; 
import {   
  EventCodec,  
  Action,  
  Event,  
  ReduceAction,  
  InstanceID,     
  CoreActionType
} from '../core/db';  
import { IPLDNode } from '../core/core';

// ==================== 核心数据结构 ====================  
interface Operation {  //当前命名方式,大小写与golang一致
  type: CoreActionType; 
  instanceID: InstanceID;  
  jSONPatch: Uint8Array ; 
}  

interface PatchEvent {  //当前命名方式大小写与golang一致
  timestamp: BigInt;  
  iD: InstanceID;  
  collectionName?: string; 
  patch: Operation;  
}  

interface RecordEvents {  
  patches: PatchEvent[];  
}  

// ==================== JSON PATCHER 实现 ====================  
// 定义codec对象，确保包含name字段  
const DAG_CBOR_CODEC = {  
    name, 
    code,  
    encode,  
    decode  
  };
export class JsonPatcher implements EventCodec {  
  private static readonly ENCODER_SETTINGS = {  
    codec: DAG_CBOR_CODEC,  
    hasher: sha256,  
    cidVersion: 1 as const  
  };  

  async create(actions: Action[]): Promise<[Event[], IPLDNode ]> {  
    const events = this.convertActions(actions);  
    const recordEvents = { patches: events };
    const obj = await cbornode.wrapObject(recordEvents);
    // const block = await Block.encode({  
    //   value: objValue,  
    //   ...JsonPatcher.ENCODER_SETTINGS  
    // });  
    return [this.wrapEvents(events), obj];  
  }  

  async reduce(  
    events: Event[],  
    store: TxnDatastoreExtended,  
    baseKey: Key,  
    indexFunc: IndexFunc  
  ): Promise<ReduceAction[]> {  
    const txn = await store.newTransactionExtended(false);  
    try {  
      const actions: ReduceAction[] = [];  
      for (const rawEvent of this.sortEvents(events)) {  
        const event = await this.parseEvent(rawEvent);  
        await this.processEvent(event, baseKey, txn, indexFunc);  
        actions.push({  
          type: event.patch.type,  
          collection: event.collectionName,  
          instanceID: event.iD  
        });  
      }  
      await txn.commit();  
      return actions;  
    } catch (err) {  
       txn.discard();  
      throw this.wrapError(err as Error);  
    }  
  }  

  async eventsFromBytes(data: Uint8Array): Promise<Event[]> {  
    let block = await dagCBOR.decode(data);
    if (block &&  typeof block === 'object'  &&'patches' in block && Array.isArray(block.patches)) {
      return this.wrapEvents(block.patches);  
    }
    throw new Error('Invalid block format: expected RecordEvents with patches array'); 
  }  

  // ==================== 私有方法 ====================  
  private convertActions(actions: Action[]): PatchEvent[] {  
   const timestamp = BigInt(Date.now() * 1000000 + Math.floor(Math.random() * 1000000));
    return actions.map(action => ({  
      timestamp: timestamp,
      iD: action.instanceID,  
      collectionName: action.collectionName || 'default',  
      patch: action.current ?{  
        type: action.type,  
        instanceID: action.instanceID,  
        jSONPatch: action.current  
      }  : {  
        type: action.type,  
        instanceID: action.instanceID,
        jSONPatch: new Uint8Array()
      }
    }));  
  }  

  private wrapEvents(patches: PatchEvent[]): Event[] {  
    if (!patches || patches.length === 0) {
      return [];  
    }
    return patches.map(p => ({  
      collection:  p.collectionName || 'default',  
      instanceID: p.iD || p.patch.instanceID,  
      timestamp: p.timestamp,  
      payload:  p.patch.jSONPatch ? p.patch.jSONPatch : new Uint8Array(),  
      marshal: async () => this.marshalPatchEvent(p)  
    }));  
  }  

  private async marshalPatchEvent(event: PatchEvent): Promise<Uint8Array> {  
   
    return encode({  
      t: event.timestamp,  
      i: event.iD || event.iD,  
      c: event.collectionName,  
      op: {  
        type: event.patch.type,  
        id: event.patch.instanceID,  
        patch:  event.patch.jSONPatch ? event.patch.jSONPatch : new Uint8Array() 
      }
    });  
  }  

  private sortEvents(events: Event[]): Event[] {  
    return [...events].sort((a, b) => {
      if (a.timestamp < b.timestamp) return -1;
      if (a.timestamp > b.timestamp) return 1;
      return 0;
    });  
  } 

  private async parseEvent(event: Event): Promise<PatchEvent> {  
    const data = decode(await event.marshal()) as any;  
    return {  
      timestamp: data.t,  
      iD: data.i,  
      collectionName: data.c,  
      patch: {  
        type: data.op.type,  
        instanceID: data.op.id,  
        jSONPatch: data.op.patch ? encode(data.op.patch) : undefined  
      }  
    };  
  }  

  private async processEvent(  
    event: PatchEvent,  
    baseKey: Key,  
    txn: Transaction,  
    indexFunc: IndexFunc  
  ): Promise<void> {  
    const recordKey = baseKey.child(new Key(event.collectionName)).child(new Key(event.iD));  

    const oldData = await txn.get(recordKey).catch(() => undefined);  
    const newData = event.patch.type === CoreActionType.Delete  
      ? undefined   
      : event.patch.jSONPatch;  

    await indexFunc(  
      event.collectionName,  
      recordKey,  
      txn ,  
      oldData,  
      newData
    );  

    if (event.patch.type === CoreActionType.Delete) {  
      await txn.delete(recordKey);  
    } else if (newData) {  
      const decoded = dagCBOR.decode<Uint8Array>(newData);
      if (!decoded) {  
        throw new Error('Failed to decode JSON patch');  
      }
      await txn.put(recordKey, decoded);  
    }  
  }  

  private wrapError(err: Error): Error {  
    return new Error(`JSONPATCHER_ERROR: ${err.message}`);  
  }  
}