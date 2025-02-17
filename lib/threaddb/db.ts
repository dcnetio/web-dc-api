// db.ts - Complete TypeScript Implementation (Simplified Core)  
import { EventEmitter } from 'events';  
import { } from './transformed-datastore' 
import { Key,Query } from 'interface-datastore';
import { Event,InstanceID,ReduceAction,Action,ActionType,TxnDatastoreExtended,Transaction,IndexFunc } from './core';
import { ulid } from 'ulid';  


  // ======== 实现类 ========  
export class CollectionEvent<T = any> implements Event<T> {  
    readonly timestamp: number;  
    
    constructor(  
      readonly instanceID: InstanceID,  
      readonly collection: string,  
      readonly payload: T  
    ) {  
      this.timestamp = Date.now();  
    }  
  
    async marshal(): Promise<Uint8Array> {  
      return new TextEncoder().encode(JSON.stringify({  
        t: this.timestamp,  
        i: this.instanceID,  
        c: this.collection,  
        p: this.payload  
      }));  
    }  
  }  
  
  // ======== 工具类 ========  
  class Instance {  
    static generateID(): InstanceID {  
      return ulid().toLowerCase();  
    }  
  } 
  
  // ======== 事件编解码器 ========  
  export abstract class EventCodec {  
    abstract reduce(  
      events: Event[],  
      store: TxnDatastoreExtended,  
      baseKey: Key,  
      indexFn: IndexFunc  
    ): Promise<ReduceAction[]>;  
  
    abstract create(actions: Action[]): Promise<[Event[], Uint8Array]>;  
  
    async eventsFromBytes(data: Uint8Array): Promise<Event[]> {  
      const decoded = JSON.parse(new TextDecoder().decode(data));  
      return decoded.map((d: any) => new CollectionEvent(  
        d.i,  
        d.c,  
        d.p  
      ));  
    }  
  }  
  


  
  // ======== 默认实现示例 ========  
  export class DefaultEventCodec extends EventCodec {  
    async reduce(  
      events: Event[],  
      store: TransformedDatastore,  
      baseKey: Key,  
      indexFn: IndexFunc  
    ): Promise<ReduceAction[]> {  
      const reduceActions: ReduceAction[] = [];  
      
      for (const event of events) {  
        const key = baseKey.child(new Key(`/${event.collection}/${event.instanceID}`));  
        
        // 使用事务处理数据变更  
        const txn = await store.beginTransaction(); 
        const oldData = await txn.get(key);  
        const newData = event.payload ? new TextEncoder().encode(JSON.stringify(event.payload)) : null;  
          // 应用索引更新  
        await indexFn(event.collection, key, oldData, newData, txn);  
          // 保存数据  
          if (newData) {  
            await txn.put(key, newData);  
          } else {  
            await txn.delete(key);  
          }  
        txn.commit();
        reduceActions.push({  
          type: this.getActionType(event),  
          collection: event.collection,  
          instanceID: event.instanceID  
        });  
      }  
      return reduceActions;  
    }  
  
    async create(actions: Action[]): Promise<[Event[], Uint8Array]> {  
      const events: Event[] = [];  
      
      for (const action of actions) {  
        const payload = this.buildEventPayload(action);  
        const event = new CollectionEvent(  
          action.instanceID,  
          action.collectionName,  
          payload  
        );  
        events.push(event);  
      }  
      
      // 序列化整个事件集合  
      const nodeData = new TextEncoder().encode(JSON.stringify(events));  
      return [events, nodeData];  
    }  
  
    private getActionType(event: Event): ActionType {  
      // 根据payload内容判断操作类型  
      if (!event.payload) return ActionType.Delete;  
      if ('previous' in event.payload) return ActionType.Save;  
      return ActionType.Create;  
    }  
  
    private buildEventPayload(action: Action): any {  
      switch (action.type) {  
        case ActionType.Create:  
          return {  
            created: action.current ? JSON.parse(new TextDecoder().decode(action.current)) : null  
          };  
        case ActionType.Save:  
          return {  
            previous: action.previous ? JSON.parse(new TextDecoder().decode(action.previous)) : null,  
            current: action.current ? JSON.parse(new TextDecoder().decode(action.current)) : null  
          };  
        case ActionType.Delete:  
          return {  
            deleted: action.previous ? JSON.parse(new TextDecoder().decode(action.previous)) : null  
          };  
      }  
    }  
}
// ======== Type Definitions ========  
interface JsonSchema {  
  type: string;  
  properties?: Record<string, JsonSchema>;  
  required?: string[];  
}  


interface CollectionConfig {  
  name: string;  
  schema: JsonSchema;  
  indexes?: Index[];  
  writeValidator?: string;  
  readFilter?: string;  
}  

interface Index {  
  path: string;  
  unique: boolean;  
}  

interface DBInfo {  
  name: string;  
  addrs: string[];  
  key: Uint8Array;  
}  

// ======== Error Classes ========  
class DBError extends Error {  
  constructor(message: string) {  
    super(message);  
    this.name = 'DBError';  
  }  
}  

class CollectionExistsError extends DBError {  
  constructor(name: string) {  
    super(`Collection ${name} already exists`);  
    this.name = 'CollectionExistsError';  
  }  
}  

// ======== Core Implementation ========  
export class Collection {  
  private indexes: Map<string, Index> = new Map();  

  constructor(  
    public readonly name: string,  
    private schema: JsonSchema,  
    private store: TransformedDatastore,  
    private vm: any // Simplified VM for validation  
  ) {}  

  async addIndex(index: Index): Promise<void> {  
    if (index.path === '_id') throw new DBError('Cannot index _id field');  
    this.indexes.set(index.path, index);  
    await this.rebuildIndex(index.path);  
  }  

  private async rebuildIndex(path: string): Promise<void> {  
    const entries = this.store.query({prefix:`/${this.name}/`});  
    for await (const entry of entries) {  
      const doc = this.parseDocument(entry.value);  
      await this.updateIndex(path, doc, entry.key.toString());  
    }  
  }  

  private parseDocument(data: Uint8Array): any {  
    return JSON.parse(new TextDecoder().decode(data));  
  }  

  private async updateIndex(path: string, doc: any, key: string): Promise<void> {  
    const value = this.getIndexValue(doc, path);  
    const indexKey = `/${this.name}/_index/${path}/${value}/${doc._id}`;  
    if (value) await this.store.put(new Key(indexKey), new Uint8Array());  
  }  

  private getIndexValue(doc: any, path: string): any {  
    return path.split('.').reduce((obj, part) => obj?.[part], doc);  
  }  
}  




export class DB {  
  private collections: Map<string, Collection> = new Map();  
  private emitter = new EventEmitter();   
  
  constructor(  
    private store: TransformedDatastore,  
    private net: NetAdapter,  
    public name = 'unnamed'  
  ) {
  }  

  static async create(options: {  
    store: TransformedDatastore;  
    net: NetAdapter;  
    collections?: CollectionConfig[];  
    name?: string;  
  }): Promise<DB> {  
    const db = new DB(options.store, options.net, options.name || 'unnamed');  
    await db.initCollections(options.collections || []);  
    return db;  
  }  

  private async initCollections(configs: CollectionConfig[]): Promise<void> {  
    for (const config of configs) {  
      await this.newCollection(config);  
    }  
  }  

  async newCollection(config: CollectionConfig): Promise<Collection> {  
    if (this.collections.has(config.name)) {  
      throw new CollectionExistsError(config.name);  
    }  

    const collection = new Collection(  
      config.name,  
      config.schema,  
      this.store,  
      new VM()  
    );  
    
    // Add default _id index  
    await collection.addIndex({ path: '_id', unique: true });  
    
    // Add custom indexes  
    for (const index of config.indexes || []) {  
      await collection.addIndex(index);  
    }  
    
    this.collections.set(config.name, collection);  
    return collection;  
  }  

  getCollection(name: string): Collection {  
    const collection = this.collections.get(name);  
    if (!collection) throw new DBError(`Collection ${name} not found`);  
    return collection;  
  }  

  async close(): Promise<void> {  
    // Implement cleanup logic  
  }  

  async reduce(events: Event[]): Promise<void> {  
    for (const event of events) {  
      await this.processCollectionEvent(event);  
    }  
  }  


  private async processCollectionEvent(event: Event): Promise<void> {  
    const collectionName = event.collection;  
    const collection = this.getCollection(collectionName);  
    
    switch(event.type) {  
      case 'create':  
        await this.handleCreateEvent(  
          collection,  
          event.documentId,  
          (event as CreateEvent).payload.fullDocument  
        );  
        break;  
      
      case 'update':  
        await this.handleUpdateEvent(  
          collection,  
          event.documentId,  
          (event as UpdateEvent).payload.patch,  
          (event as UpdateEvent).previousState  
        );  
        break;  
      
      case 'delete':  
        await this.handleDeleteEvent(  
          collection,  
          event.documentId,  
          (event as DeleteEvent).previousState  
        );  
        break;  

      default:  
        throw new Error(`Unsupported event type: ${(event as CoreEvent).type}`);  
    }  
  }  

  // ===== 创建事件处理器 =====  
  private async handleCreateEvent(  
    collection: Collection,  
    documentId: string,  
    payload: Record<string, unknown>  
  ): Promise<void> {  
    // 合法性检查  
    if (!documentId || !payload) {  
      throw new Error(`Invalid create payload for document ${documentId}`);  
    }  

    // 生成最终文档  
    const doc = {  
      _id: documentId,  
      ...payload,  
      _createdAt: Date.now(),  
      _version: 1  
    };  

    // 执行数据存取  
    await this.withTransaction(collection.name, async (txn) => {  
      // 验证Schema  
      if (!collection.validateSchema(doc)) {  
        throw new Error(`Schema validation failed for document ${documentId}`);  
      }  

      // 触发前置钩子  
      await collection.hooks.beforeCreate?.(doc, txn);  

      // 保存文档  
      const key = `/${collection.name}/${documentId}`;  
      await txn.put(key, this.encodeDocument(doc));  

      // 更新索引  
      await collection.updateIndexes(txn, doc, null);  

      // 触发后置钩子  
      await collection.hooks.afterCreate?.(doc, txn);  
    });  
  }  

  // ===== 更新事件处理器 =====  
  private async handleUpdateEvent(  
    collection: Collection,  
    documentId: string,  
    patch: Record<string, unknown>,  
    previousState?: Record<string, unknown>  
  ): Promise<void> {  
    await this.withTransaction(collection.name, async (txn) => {  
      // 获取现有文档  
      const existing = await this.getDocument(collection, documentId);  
      if (!existing) {  
        throw new Error(`Cannot update non-existing document ${documentId}`);  
      }  

      // 应用数据修改  
      const updatedDoc = {   
        ...existing,   
        ...patch,   
        _version: existing._version + 1,  
        _updatedAt: Date.now()   
      };  

      // 数据验证  
      if (!collection.validateSchema(updatedDoc)) {  
        throw new Error(`Update violates schema for document ${documentId}`);  
      }  

      // 触发前置钩子  
      await collection.hooks.beforeUpdate?.(updatedDoc, existing, txn);  

      // 保存更新  
      const key = `/${collection.name}/${documentId}`;  
      await txn.put(key, this.encodeDocument(updatedDoc));  

      // 更新索引  
      await collection.updateIndexes(txn, updatedDoc, existing);  

      // 触发后置钩子  
      await collection.hooks.afterUpdate?.(updatedDoc, existing, txn);  
    });  
  }  

  // ===== 删除事件处理器 =====   
  private async handleDeleteEvent(  
    collection: Collection,  
    documentId: string,  
    previousState?: Record<string, unknown>  
  ): Promise<void> {  
    await this.withTransaction(collection.name, async (txn) => {  
      const existing = await this.getDocument(collection, documentId);  
      if (!existing) return;  

      // 触发前置钩子  
      await collection.hooks.beforeDelete?.(existing, txn);  

      // 删除数据  
      const key = `/${collection.name}/${documentId}`;  
      await txn.delete(key);  

      // 清理索引  
      await collection.clearIndexes(txn, existing);  

      // 触发后置钩子  
      await collection.hooks.afterDelete?.(existing, txn);  
    });  
  }  

  

  // ===== 辅助方法 =====  
  private async getDocument(  
    collection: Collection,   
    documentId: string  
  ): Promise<Record<string, unknown> | null> {  
    const key = `/${collection.name}/${documentId}`;  
    const data = await this.datastore.get(key);  
    return data ? this.decodeDocument(data) : null;  
  }  

  private encodeDocument(doc: Record<string, unknown>): Uint8Array {  
    return new TextEncoder().encode(JSON.stringify(doc));  
  }  

  private decodeDocument(data: Uint8Array): Record<string, unknown> {  
    return JSON.parse(new TextDecoder().decode(data));  
  }  

  private async withTransaction(  
    collection: string,  
    operation: (txn: Transaction) => Promise<void>  
  ): Promise<void> {  
    const txn = this.datastore.newTransaction();  
    try {  
      await operation(txn);  
      await txn.commit();  
    } catch (error) {  
      await txn.rollback();  
      throw new Error(  
        `Transaction failed in ${collection}: ${error instanceof Error ? error.message : String(error)}`  
      );  
    }  
  }  
}  
 




// ======== Helper Interfaces ========  
interface NetAdapter {  
  getBlock(cid: string): Promise<Uint8Array>;  
  // Other network methods...  
}  

class VM {  
  // Simplified validation VM  
  validate(code: string, data: any): boolean {  
    // Implement validation logic  
    return true;  
  }  
}  

// ====== Usage Example ======  
/*  
const memStore = new MemoryStore();  
const netAdapter = new MockNetAdapter();  

const db = await DB.create({  
  store: memStore,  
  net: netAdapter,  
  collections: [{  
    name: 'users',  
    schema: {  
      type: 'object',  
      properties: {  
        _id: { type: 'string' },  
        name: { type: 'string' }  
      },  
      required: ['_id']  
    },  
    indexes: [  
      { path: 'name', unique: false }  
    ]  
  }]  
});  
*/  