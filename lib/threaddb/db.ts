// db.ts - Complete TypeScript Implementation (Simplified Core)  
import { EventEmitter } from 'events';  
import { } from './transformed-datastore' 
import { Key, Query } from 'interface-datastore';
import { Key as ThreadKey } from './key';
import { Connector } from './core/app';
import {Context} from './core/core';
import { EventCodec, Errors,pullThreadBackgroundTimeout ,PullTimeout} from './core/db';
import { ThreadRecord } from './core/record'
import { Ed25519PubKey } from '../dc-key/ed25519';
import  {JSONSchemaType} from 'ajv';
import { ThreadEvent  } from './core/event';
import { 
  NewOptions,
  Index,
  CollectionConfig} from './core/core';
import { Event,
  InstanceID,
  ReduceAction,
  Action,ActionType,
  TxnDatastoreExtended,
  Transaction,
  IndexFunc,
  DBPrefix } from './core/db';

import { ulid } from 'ulid';  
import { JsonPatcher } from './json-patcher';
import { multiaddr, Multiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { PeerId } from '@libp2p/interface';
import { Net } from './core/app';
import { Dispatcher } from './dispatcher';
import { LocalEventsBus, App } from './core/app'
import * as dagPB from '@ipld/dag-pb'
import { DAGNode } from 'ipld-dag-pb';
import * as threadEvent from './cbor/event'
import {IRecord} from './core/record'


const getBlockInitialTimeout      =  500 
const getBlockRetries = 3; 
interface CreateEvent extends Event {
  documentId: string;
  payload: {
    fullDocument: Record<string, unknown>;
  }
}

interface UpdateEvent extends Event {
  documentId: string;
  payload: {
    patch: Record<string, unknown>;
  }
  previousState?: Record<string, unknown>;
}

interface DeleteEvent extends Event {
  documentId: string;
  previousState?: Record<string, unknown>;
}

interface CoreEvent extends Event {
  type: string;
}

export class CollectionEvent<T = any> implements Event<T> {  
  readonly timestamp: bigint;  
  
  constructor(  
    readonly instanceID: InstanceID,  
    readonly collection: string,  
    readonly payload: T  
  ) {  
    this.timestamp =  BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1000000));
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
      await txn.commit();
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
  public hooks: {
    beforeCreate?: (doc: Record<string, unknown>, txn: Transaction) => Promise<void>;
    afterCreate?: (doc: Record<string, unknown>, txn: Transaction) => Promise<void>;
    beforeUpdate?: (doc: Record<string, unknown>, old: Record<string, unknown>, txn: Transaction) => Promise<void>;
    afterUpdate?: (doc: Record<string, unknown>, old: Record<string, unknown>, txn: Transaction) => Promise<void>;
    beforeDelete?: (doc: Record<string, unknown>, txn: Transaction) => Promise<void>;
    afterDelete?: (doc: Record<string, unknown>, txn: Transaction) => Promise<void>;
  } = {};

  constructor(  
    public readonly name: string,  
    public schema: JSONSchemaType<any>,  
    public store: TxnDatastoreExtended,  
  ) {}  

  validateSchema(doc: Record<string, unknown>): boolean {
    // 简化的架构验证实现
    return true;
  }

  async addIndex(index: Index): Promise<void> {  
    if (index.path === '_id') throw new Error('Cannot index _id field');  
    this.indexes.set(index.path, index);  
    await this.rebuildIndex(index.path);  
  }  

  async updateIndexes(txn: Transaction, doc: Record<string, unknown>, old: Record<string, unknown> | null): Promise<void> {
    // 更新所有索引
    for (const [path, index] of this.indexes.entries()) {
      const value = this.getIndexValue(doc, path);
      const key = `/${this.name}/_index/${path}/${value}/${doc._id}`;
      await txn.put(new Key(key), new Uint8Array());
      
      // 如果有旧文档且值已更改，删除旧索引
      if (old) {
        const oldValue = this.getIndexValue(old, path);
        if (oldValue !== value) {
          const oldKey = `/${this.name}/_index/${path}/${oldValue}/${doc._id}`;
          await txn.delete(new Key(oldKey));
        }
      }
    }
  }

  async clearIndexes(txn: Transaction, doc: Record<string, unknown>): Promise<void> {
    // 删除文档的所有索引
    for (const [path, index] of this.indexes.entries()) {
      const value = this.getIndexValue(doc, path);
      const key = `/${this.name}/_index/${path}/${value}/${doc._id}`;
      await txn.delete(new Key(key));
    }
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

export class DB implements App {  
  private datastore: TxnDatastoreExtended;  
  private name: string;  
  private collections: Map<string, Collection> = new Map();
  public connector: Connector; //  
  public eventcodec: EventCodec; // 抽象的事件编解码机制  
  public dispatcher: Dispatcher;
  public localEventsBus: LocalEventsBus;
  private webLock: string;

  constructor(datastore: TxnDatastoreExtended, net: Net, id: string, opts: NewOptions) {  
    this.datastore = datastore;  
    this.name = opts.name || 'unnamed';  
    this.eventcodec = opts.eventCodec || new JsonPatcher(); 
    this.webLock = "webLock_db_" + id;
  }  

  // 新建 DB 实例  
  static async newDB(store: TxnDatastoreExtended, n: Net, id: ThreadID, opts?: NewOptions): Promise<DB> {  
    const args = opts || new NewOptions();  
    if (!args.eventCodec) {
      args.eventCodec = new JsonPatcher(); //DefaultEventCodec()
    }
    
    const dbInstance = new DB(store, n, id.toString(), args);
    dbInstance.dispatcher = new Dispatcher(store);
    dbInstance.localEventsBus = new LocalEventsBus();
    
    try {
      await dbInstance.loadName();
    } catch (error) {
      throw new Error('Failed to load DB name');
    }
    
    const prevName = dbInstance.name;
    if (args.name) {
      dbInstance.name = args.name;
    } else if (prevName === "") {
      dbInstance.name = "unnamed";
    }
    
    await dbInstance.saveName(prevName);  
    await dbInstance.reCreateCollections();  
    dbInstance.dispatcher.register(dbInstance);
    
    // 修复 Go 代码
    try {
      const connector = await n.connectApp(dbInstance, id);
      dbInstance.connector = connector;
    } catch (err) {
      throw new Error(`Failed to connect app: ${err instanceof Error ? err.message : String(err)}`);
    }

    const info = await n.getThread(id);
    if (args.block) {  
      await n.pullThread(info.id, pullThreadBackgroundTimeout,{ token: args.token });  
    } else {  
      setTimeout(async () => {  
        await n.pullThread(info.id,pullThreadBackgroundTimeout, { token: args.token });  
      }, 30000);
    }  

    return dbInstance;
  }  

  // 保存 DB 名称  
  async saveName(prevName: string): Promise<void> {  
    if (this.name === prevName) return;  
    if (!this.name.match(/a-zA-Z0-9+/)) { // 根据需求定义规则  
      throw new Error('Invalid name');  
    }  
    await this.datastore.put(new Key('dbName'), new TextEncoder().encode(this.name)); 
  }  

  // 加载 DB 名称  
  async loadName(): Promise<void> {  
    try {  
      const nameBuffer = await this.datastore.get(DBPrefix.dsName);  
      if (nameBuffer) {  
        this.name = new TextDecoder().decode(nameBuffer);  
      }  
    } catch (error) {  
      console.error(`Error loading name: ${error instanceof Error ? error.message : String(error)}`);  
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
      this.datastore  
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
          const schema = JSON.parse(new TextDecoder().decode(res.value));  

          let wv: string | undefined;  
          try {  
            const wvBuffer = await this.datastore.get(DBPrefix.dsValidators.child(new Key(name)));  
            wv = new TextDecoder().decode(wvBuffer);  
          } catch (err: any) {  
            if (err.code !== 'ERR_NOT_FOUND') throw err;  
          }  

          let rf: string | undefined;  
          try {  
            const rfBuffer = await this.datastore.get(DBPrefix.dsFilters.child(new Key(name)));  
            rf = new TextDecoder().decode(rfBuffer);  
          } catch (err: any) {  
            if (err.code !== 'ERR_NOT_FOUND') throw err;  
          }  

          const c = new Collection(
            name,  
            schema,  
            this.datastore
          );  

          // 修复索引对象
          try {  
            const indexBuffer = await this.datastore.get(DBPrefix.dsIndexes.child(new Key(name)));  
            const indexData = JSON.parse(new TextDecoder().decode(indexBuffer));
            
            // 修复索引映射 - 使用 Map 而不是对象
            for (const [path, index] of Object.entries(indexData)) {  
              if (path) {  
                c.indexes.set(path, index as Index);  
              }  
            }
          } catch (err: any) {  
            if (err.code !== 'ERR_NOT_FOUND') throw err;  
          }  

          // 添加到集合映射
          this.collections.set(c.name, c);  
        }  
      } catch (err) {
        throw new Error(`Error re-creating collections: ${err instanceof Error ? err.message : String(err)}`);
      }
    } catch (err) {
      throw new Error(`Error re-creating collections: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  getCollection(name: string): Collection {  
    const collection = this.collections.get(name);  
    if (!collection) throw new Error(`Collection ${name} not found`);  
    return collection;  
  }  

  async close(): Promise<void> {  
    // 实现清理逻辑
    if (this.connector) {
      // 关闭连接
    }
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
    
    // 根据payload内容判断操作类型
    if ((event as CoreEvent).type) {
      switch((event as CoreEvent).type) {  
        case 'create':  
          await this.handleCreateEvent(  
            collection,  
            (event as CreateEvent).documentId,  
            (event as CreateEvent).payload.fullDocument  
          );  
          break;  
        
        case 'update':  
          await this.handleUpdateEvent(  
            collection,  
            (event as UpdateEvent).documentId,  
            (event as UpdateEvent).payload.patch,  
            (event as UpdateEvent).previousState  
          );  
          break;
        
        case 'delete':  
          await this.handleDeleteEvent(  
            collection,  
            (event as DeleteEvent).documentId,  
            (event as DeleteEvent).previousState  
          );  
          break;  

        default:  
          throw new Error(`Unsupported event type: ${(event as CoreEvent).type}`);  
      }
    } else {
      // 基于 payload 的传统判断逻辑
      if (payload.created) {
        await this.handleCreateEvent(
          collection,
          payload.created._id,
          payload.created
        );
      } else if (payload.current) {
        await this.handleUpdateEvent(
          collection,
          payload.current._id,
          payload.current,
          payload.previous
        );
      } else if (payload.deleted) {
        await this.handleDeleteEvent(
          collection,
          payload.deleted._id,
          payload.deleted
        );
      } else {
        throw new Error(`Unknown event payload structure`);
      }
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
      await txn.put(new Key(key), this.encodeDocument(doc));  

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
        _version: (existing._version as number) + 1,  
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
      await txn.put(new Key(key), this.encodeDocument(updatedDoc));  

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
      await txn.delete(new Key(key));  

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
    try {
      const data = await this.datastore.get(new Key(key));  
      return data ? this.decodeDocument(data) : null;
    } catch (err: any) {
      if (err.code === 'ERR_NOT_FOUND') return null;
      throw err;
    }
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

  async dispatch(events: Event[]): Promise<void> {
    // 实现事件分发逻辑
    for (const event of events) {
      await this.reduce([event]);
    }
  }
  
  async validateNetRecordBody(body: DAGNode, identity: Ed25519PubKey): Promise<Error | undefined> {  
    try {  
      const events: Event[] = await this.eventcodec.eventsFromBytes(body.Data);  
      if (events.length === 0) {  
        return ;
      }  

      for (const e of events) {  
        const collection = this.collections.get(e.collection);  
        if (!collection) {  
          return Errors.ErrCollectionNotFound;
        }  
      }
      return ;

    } catch (error) {  
      return error as Error;
    }  
  }

  async handleNetRecord(rec: ThreadRecord, key: ThreadKey): Promise<Error | undefined> {  
    let event: any;
    try {  
      // 从记录中解码事件  
      event = await threadEvent.EventFromRecord(this.connector.net, rec.value());  
    } catch (err) {  
      // 如果解码失败，尝试从块中获取事件  
      try {
        const block = await this.getBlockWithRetry( rec.value());  
        event = await threadEvent.EventFromNode(block);  
      } catch (blockErr) {
        return blockErr as Error;
      }
    }  

    try {  
      // 获取事件的主体  
      const body = await event.getBody( this.connector.net, key.read());  

      // 从字节数据中解码事件  
      const events = await this.eventcodec.eventsFromBytes(body.rawData());  

      // 记录调试信息  
      console.debug(`dispatching new record: ${rec.threadID()}/${rec.logID()}`);  

      // 分发事件  
      await this.dispatch(events);  
    } catch (err) {  
      return new Error(`error when processing event: ${err instanceof Error ? err.message : String(err)}`);  
    }  
    return ;
  }

  async getNetRecordCreateTime(
    rec: ThreadRecord,
    key: ThreadKey
  ): Promise<bigint> {
    let event :ThreadEvent;
    try {
      // 从记录中解码事件
      event = await threadEvent.EventFromRecord(this.connector.net, rec.value());
    } catch (err) {
      // 如果解码失败，尝试从块中获取事件
      try {
        const block = await this.getBlockWithRetry(rec.value());
        event = await threadEvent.EventFromNode(block);
      } catch (decodeErr) {
        throw new Error(`Error when decoding block to event: ${decodeErr instanceof Error ? decodeErr.message : String(decodeErr)}`);
      }
    }

    let body;
    try {
      // 获取事件的主体
      body = await event.getBody( this.connector.net, key.read());
    } catch (err) {
      throw new Error(
        `Error when getting body of event on thread ${this.connector.threadId}/${rec.logID()}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    let events:Event<any>[];
    try {
      // 从字节数据中解码事件
      events = await this.eventcodec.eventsFromBytes(body.rawData());
    } catch (err) {
      throw new Error(`Error when unmarshaling event from bytes: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (events.length === 0) {
      throw new Error('No events found in record');
    }

    const coreEvent = events[0];
    if (typeof coreEvent.timestamp === 'bigint') {
      return coreEvent.timestamp;
    }
    return 0n;
 
  }

  private async getBlockWithRetry(rec: IRecord): Promise<any> {
    let backoff = getBlockInitialTimeout;
    let lastError: Error | null = null;
    
    // 重试循环
    for (let i = 1; i <= getBlockRetries; i++) {
      try {
        // 尝试获取块
        const block = await rec.getBlock(this.connector.net);
        return block; // 成功则立即返回
      } catch (err) {
        lastError = err as Error;
        console.warn(`错误: 在第 ${i} 次重试中获取块 ${rec.cid()} 失败`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        backoff *= 2;
      }
    }
}  
 
}