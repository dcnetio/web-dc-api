// json-patcher.ts - 完整实现  
import { name,code, encode, decode } from '@ipld/dag-cbor';  
import { sha256 } from 'multiformats/hashes/sha2';  
import * as Block from 'multiformats/block';  
import { Key } from 'interface-datastore';
import {   
  EventCodec,  
  Action,  
  Event,  
  ReduceAction,  
  IndexFunc,  
  InstanceID,  
  TxnDatastoreExtended,  
  Transaction,  
  ActionType
} from './core';  

// ==================== 核心数据结构 ====================  
interface Operation {  
  type: ActionType; 
  instanceID: InstanceID;  
  jsonPatch: Uint8Array | null;  
}  

interface PatchEvent {  
  timestamp: number;  
  id: InstanceID;  
  collection: string;  
  operation: Operation;  
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
          type: event.operation.type,  
          collection: event.collection,  
          instanceID: event.id  
        });  
      }  
      await txn.commit();  
      return actions;  
    } catch (err) {  
      await txn.discard();  
      throw this.wrapError(err as Error);  
    }  
  }  

  async eventsFromBytes(data: Uint8Array): Promise<Event[]> {  
    const block = await Block.decode({  
      bytes: data,  
      ...JsonPatcher.ENCODER_SETTINGS  
    });  
    return this.wrapEvents((block.value as RecordEvents).patches);  
  }  

  // ==================== 私有方法 ====================  
  private convertActions(actions: Action[]): PatchEvent[] {  
    return actions.map(action => ({  
      timestamp: Date.now() * 1e6,  
      id: action.instanceID,  
      collection: action.collectionName || 'default',  
      operation: {  
        type: this.normalizeActionType(action.type),  
        instanceID: action.instanceID,  
        jsonPatch: action.current || null  
      }  
    }));  
  }  

  private wrapEvents(patches: PatchEvent[]): Event[] {  
    return patches.map(p => ({  
      collection: p.collection,  
      instanceID: p.id,  
      timestamp: p.timestamp,  
      payload: p.operation.jsonPatch,  
      marshal: async () => this.marshalPatchEvent(p)  
    }));  
  }  

  private async marshalPatchEvent(event: PatchEvent): Promise<Uint8Array> {  
    return encode({  
      t: event.timestamp,  
      i: event.id,  
      c: event.collection,  
      op: {  
        typ: event.operation.type,  
        id: event.operation.instanceID,  
        patch: event.operation.jsonPatch   
          ? decode(event.operation.jsonPatch)  
          : null  
      }  
    });  
  }  

  private sortEvents(events: Event[]): Event[] {  
    return [...events].sort((a, b) => a.timestamp - b.timestamp);  
  }  

  private async parseEvent(event: Event): Promise<PatchEvent> {  
    const data = decode(await event.marshal()) as any;  
    return {  
      timestamp: data.t,  
      id: data.i,  
      collection: data.c,  
      operation: {  
        type: data.op.typ,  
        instanceID: data.op.id,  
        jsonPatch: data.op.patch ? encode(data.op.patch) : null  
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
    
    const oldData = await txn.get(recordKey).catch(() => null);  
    const newData = event.operation.type === 'delete'   
      ? null   
      : event.operation.jsonPatch;  

    await indexFunc(  
      event.collection,  
      recordKey,  
      oldData,  
      newData,  
      txn  
    );  

    if (event.operation.type === 'delete') {  
      await txn.delete(recordKey);  
    } else if (newData) {  
      await txn.put(recordKey, newData);  
    }  
  }  

  private normalizeActionType(actionType: string): ActionType {  
    const normalized = String(actionType).toLowerCase().trim();  
    switch (normalized) {  
      case 'create':  
        return ActionType.Create;  
      case 'save':  
        return  ActionType.Save;  
      case 'delete':  
        return ActionType.Delete;  
      default:  
        throw new Error(`Unsupported action type: ${actionType}`);  
    }  
  } 
  private wrapError(err: Error): Error {  
    return new Error(`JSONPATCHER_ERROR: ${err.message}`, { cause: err });  
  }  
}