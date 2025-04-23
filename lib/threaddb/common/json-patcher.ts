// json-patcher.ts - 完整实现  
import { name,code, encode, decode } from '@ipld/dag-cbor';  
import { sha256 } from 'multiformats/hashes/sha2';  
import * as Block from 'multiformats/block';  
import { Key } from 'interface-datastore';
import * as dagCBOR from '@ipld/dag-cbor';
  
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

// ==================== 核心数据结构 ====================  
interface Operation {  
  type: CoreActionType; 
  instanceID: InstanceID;  
  jsonPatch?: Uint8Array ; 
  jSONPatch?: Uint8Array ; 
}  

interface PatchEvent {  
  timestamp: bigint;  
  id: InstanceID;  
  iD?: InstanceID;
  collection: string; 
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

  async create(actions: Action[]): Promise<[Event[], Uint8Array]> {  
    const events = this.convertActions(actions);  
    const block = await Block.encode({  
      value: { patches: events },  
      ...JsonPatcher.ENCODER_SETTINGS  
    });  
    return [this.wrapEvents(events), block.bytes];  
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
          collection: event.collection,  
          instanceID: event.id  
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
    const block = await Block.decode<RecordEvents,number,number>({  
      bytes: data,  
      ...JsonPatcher.ENCODER_SETTINGS  
    });  
    if (!block.value) {  
      throw new Error('Invalid block value');  
    }
    
    return this.wrapEvents((block.value as RecordEvents).patches);  
  }  

  // ==================== 私有方法 ====================  
  private convertActions(actions: Action[]): PatchEvent[] {  
    return actions.map(action => ({  
      timestamp: BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1000000)),
      id: action.instanceID,  
      collection: action.collectionName || 'default',  
      patch: {  
        type: action.type,  
        instanceID: action.instanceID,  
        jsonPatch: action.current  
      }  
    }));  
  }  

  private wrapEvents(patches: PatchEvent[]): Event[] {  
    return patches.map(p => ({  
      collection: p.collection || p.collectionName,  
      instanceID: p.id || p.patch.instanceID,  
      timestamp: p.timestamp,  
      payload: p.patch.jsonPatch || p.patch.jSONPatch,  
      marshal: async () => this.marshalPatchEvent(p)  
    }));  
  }  

  private async marshalPatchEvent(event: PatchEvent): Promise<Uint8Array> {  
   
    return encode({  
      t: event.timestamp,  
      i: event.id || event.iD,  
      c: event.collection || event.collectionName,  
      op: {  
        type: event.patch.type,  
        id: event.patch.instanceID,  
        patch: event.patch.jsonPatch || event.patch.jSONPatch  
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
      id: data.i,  
      collection: data.c,  
      patch: {  
        type: data.op.type,  
        instanceID: data.op.id,  
        jsonPatch: data.op.patch ? encode(data.op.patch) : undefined  
      }  
    };  
  }  

  private async processEvent(  
    event: PatchEvent,  
    baseKey: Key,  
    txn: Transaction,  
    indexFunc: IndexFunc  
  ): Promise<void> {  
    const recordKey = baseKey.child(new Key(event.collection)).child(new Key(event.id));  

    const oldData = await txn.get(recordKey).catch(() => undefined);  
    const newData = event.patch.type === CoreActionType.Delete  
      ? undefined   
      : event.patch.jsonPatch;  

    await indexFunc(  
      event.collection,  
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