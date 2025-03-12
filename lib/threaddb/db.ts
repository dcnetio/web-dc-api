// db.ts - Complete TypeScript Implementation (Simplified Core)  
import { EventEmitter } from 'events';  
import { } from './transformed-datastore' 
import { Key, Query } from 'interface-datastore';
import {Key as ThreadKey} from './key';
import { Connector } from './core/app';
import { EventCodec ,Errors} from './core/db';
import {ThreadRecord} from './core/record'
import {Ed25519PubKey} from '../dc-key/ed25519';
import { 
  JsonSchema,
  NewOptions,
  Index,
  CollectionConfig,
  ThreadInfo } from './core/core';
import { Event,
  InstanceID,
  ReduceAction,
  Action,ActionType,
  TxnDatastoreExtended,
  Transaction,
  IndexFunc,
  DBPrefix } from './core/db';

import { ulid } from 'ulid';  
import {JsonPatcher}  from './json-patcher';
import { multiaddr, Multiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { PeerId } from '@libp2p/interface';
import {Net} from './core/app';
import { Dispatcher } from './dispatcher';
import {LocalEventsBus,App} from './core/app'
import * as dagPB from '@ipld/dag-pb'
import { DAGNode } from 'ipld-dag-pb';



 

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
  

  


  
  export class DefaultEventCodec implements EventCodec {  
    async reduce(  
      events: Event[],  
      store: TxnDatastoreExtended,  
      baseKey: Key,  
      indexFn: IndexFunc  
    ): Promise<ReduceAction[]> {  
      const reduceActions: ReduceAction[] = [];  
      
      for (const event of events) {  
        const key = baseKey.child(new Key(`/${event.collection}/${event.instanceID}`));  
        
        // 使用事务处理数据变更  
        const txn = await store.newTransactionExtended(false);
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

   
    async eventsFromBytes(data: Uint8Array): Promise<Event[]> {  
      const decoded = JSON.parse(new TextDecoder().decode(data));  
      return decoded.map((d: any) => new CollectionEvent(  
        d.i,  
        d.c,  
        d.p  
      ));  
    }  
  }


class CollectionExistsError extends Error {
  name: string;
  constructor(name: string) {  
    super(`Collection ${name} already exists`);
    this.name = 'CollectionExistsError';  
  }  
}  

export class Collection {  
  public indexes: Map<string, Index> = new Map();  

  constructor(  
    public readonly name: string,  
    public schema: JsonSchema,  
    public store: TxnDatastoreExtended,  
  ) {}  

  async addIndex(index: Index): Promise<void> {  
    if (index.path === '_id') throw new Error('Cannot index _id field');  
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




export class DB  implements App {  
  private datastore: TxnDatastoreExtended;  
  private name: string;  
  private collections: Map<string, Collection>;  
  public connector: Connector; //  
  public eventcodec: EventCodec; // 抽象的事件编解码机制  
  public dispatcher:Dispatcher;
  public localEventsBus: LocalEventsBus;
  private webLock: string;

  constructor(datastore: TxnDatastoreExtended, net: Net, id: string, opts: NewOptions) {  
      this.datastore = datastore;  
      this.collections = new Map();  
      this.name = opts.name || 'unnamed';  
      this.eventcodec = opts.eventCodec || new JsonPatcher(); 
      this.webLock = "webLock_db_" + id;

  }  

  // 新建 DB 实例  
  static async newDB(store: TxnDatastoreExtended, n: Net, id: ThreadID, opts?: NewOptions): Promise<DB > {  

      const args = opts || new NewOptions();  
      if (!args.eventCodec) {
        args.eventCodec = new JsonPatcher(); //DefaultEventCodec()
      }
      const dbInstance = new DB(store, n, id.toString(), args)
      dbInstance.dispatcher = new Dispatcher(store);
      dbInstance.localEventsBus = new LocalEventsBus();
      try {
        await dbInstance.loadName();
      }catch (error) {
       throw new Error('Failed to load DB name');
      }
      const prevName = dbInstance.name
      if (args.name)  {
        dbInstance.name = args.name
      } else if (prevName == "") {
        dbInstance.name = "unnamed"
      }
      await dbInstance.saveName(prevName);  
      await dbInstance.reCreateCollections();  
      dbInstance.dispatcher.register(dbInstance);
      connector, err := n.connectApp(dbInstance, id)
      if err != nil {
        return nil, err
      }
      d.connector = connector


      const info = await n.infoThread(id);
      if (args.block) {  
          await n.pullThread(info.id, { token: args.token });  
      } else {  
          setTimeout(async () => {  
              await n.PullThread(info.id, { token: args.token });  
          }, 30000); // 示例：设置超时  
      }  

      return dbInstance;  
  }  

  // 保存 DB 名称  
  async saveName(prevName: string): Promise<void> {  
      if (this.name === prevName) return;  
      if (!this.name.match(/a-zA-Z0-9+/)) { // 根据需求定义规则  
          throw new Error('Invalid name');  
      }  
      await this.datastore.put(new Key('dbName'),  new TextEncoder().encode(this.name)); 
  }  

  // 加载 DB 名称  
  async loadName(): Promise<void> {  
      try {  
          const nameBuffer = await this.datastore.get(DBPrefix.dsName);  
          if (nameBuffer) {  
              this.name = nameBuffer.toString();  
          }  
      } catch (error) {  
          console.error(`Error loading name: ${error.message}`);  
      }  
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




  async reCreateCollections(): Promise<void> {  
    try {  
        const results = this.datastore.query({
          prefix: DBPrefix.dsSchemas.toString(),
        });  

        try {  
            for await (const res of results) {  
                const name = res.key.name();  
                const schema = JSON.parse(res.value.toString()) as JsonSchema;  

                let wv: string | undefined;  
                try {  
                    const wvBuffer = await this.datastore.get(DBPrefix.dsValidators.child(new Key(name)));  
                    wv = wvBuffer.toString();  
                } catch (err) {  
                    if (err.code !== 'ERR_NOT_FOUND') throw err;  
                }  

                let rf: string | undefined;  
                try {  
                    const rfBuffer = await this.datastore.get(DBPrefix.dsFilters.child(new Key(name)));  
                    rf = rfBuffer.toString();  
                } catch (err) {  
                    if (err.code !== 'ERR_NOT_FOUND') throw err;  
                }  

                
                const c = new Collection(
                    name,  
                    schema,  
                    this.datastore,
                );  

                let indexes: Record<string, Index> = {};  
                try {  
                    const indexBuffer = await this.datastore.get(DBPrefix.dsIndexes.child(new Key(name)));  
                    indexes = JSON.parse(indexBuffer.toString());  
                } catch (err) {  
                    if (err.code !== 'ERR_NOT_FOUND') throw err;  
                }  

                for (const index of Object.values(indexes)) {  
                    if (index.path) {  
                        c.indexes[index.path] = index;  
                    }  
                }  

                this.collections[c.name] = c;  
            }  
        } catch (err) {
            throw new Error(`Error re-creating collections: ${err.message}`);
        }
    } catch (err) {
        throw new Error(`Error re-creating collections: ${err.message}`)
    }
} 


  
  getCollection(name: string): Collection {  
    const collection = this.collections.get(name);  
    if (!collection) throw new Error(`Collection ${name} not found`);  
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
    const payload = event.payload as any;
    const action = payload.action;
    
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
    const txn = await this.datastore.newTransactionExtended(false);
    try {  
      await operation(txn);  
      await txn.commit();  
    } catch (error) {  
      await txn.discard();
      throw new Error(  
        `Transaction failed in ${collection}: ${error instanceof Error ? error.message : String(error)}`  
      );  
    }  
  }

  
  
  async validateNetRecordBody( body: DAGNode, identity: Ed25519PubKey): Promise<Error | null> {  
    try {  
        const events: Event[] = await this.eventcodec.eventsFromBytes(body.Data);  
        if (events.length === 0) {  
            return null; // 如果没有事件，返回null（这可能需要根据你的错误处理逻辑调整）  
        }  

        for (const e of events) {  
            const collection = this.collections[e.collection];  
            if (!collection) {  
                return Errors.ErrCollectionNotFound; // 如果没有找到集合，返回对应错误  
            }  
        }  
        return null; // 所有检查通过，返回null  

    } catch (error) {  
        return error as Error; // 捕获异常并返回  
    }  
  }

  async  handleNetRecord(rec: ThreadRecord, key: ThreadKey): Promise<Error | null>  {  
    let event: any;  
    try {  
        // 从记录中解码事件  
        event = await threadcbor.eventFromRecord( connector.net, rec.value());  
    } catch (err) {  
        // 如果解码失败，尝试从块中获取事件  
        const block = await getBlockWithRetry(ctx, rec.value());  
        event = await threadcbor.eventFromNode(block);  
    }  

    try {  
        // 获取事件的主体  
        const body = await event.getBody(ctx, connector.net, key.read());  

        // 从字节数据中解码事件  
        const events = await eventcodec.eventsFromBytes(body.rawData());  

        // 记录调试信息  
        console.debug(`dispatching new record: ${rec.threadID()}/${rec.logID()}`);  

        // 分发事件  
        await dispatch(events);  
    } catch (err) {  
        throw new Error(`error when processing event: ${err.message}`);  
    }  
    return null;
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