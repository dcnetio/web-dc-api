// db.ts - Complete TypeScript Implementation (Simplified Core)  
import { EventEmitter } from 'events';  
import { } from '../common/transformed-datastore' 
import { Key, Query } from 'interface-datastore';
import { Key as ThreadKey } from '../common/key';
import { Connector } from '../core/app';
import {Context} from '../core/core';
import { EventCodec, Errors,pullThreadBackgroundTimeout ,PullTimeout} from '../core/db';
import { IThreadRecord } from '../core/record'
import { Ed25519PubKey } from '../../dc-key/ed25519';
import  {JSONSchemaType} from 'ajv';
import { IThreadEvent  } from '../core/event';
import {Collection,Txn} from './collection'
import { ThreadToken } from '../core/identity';
import { 
  NewOptions,
  Index,
  CollectionConfig} from '../core/core';
import { Event,
  InstanceID,
  ReduceAction,
  Action,ActionType,
  TxnDatastoreExtended,
  Transaction,
  IndexFunc,
  DBPrefix,
  IDB,
  ITxn } from '../core/db';

import { ulid } from 'ulid';  
import { JsonPatcher } from '../common/json-patcher';
import { multiaddr, Multiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { PeerId } from '@libp2p/interface';
import { Net } from '../core/app';
import { Dispatcher } from '../common/dispatcher';
import { LocalEventsBus, App } from '../core/app'
import * as dagPB from '@ipld/dag-pb'
import * as threadEvent from '../cbor/event'
import {IRecord} from '../core/record'
import {IPLDNode} from '../core/core'


const getBlockInitialTimeout      =  500 
const getBlockRetries = 3; 


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
      const newData = event.payload ? new TextEncoder().encode(JSON.stringify(event.payload)) : undefined;  
        // 应用索引更新  
      await indexFn(event.collection, key, txn, oldData, newData);  
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

export class DB implements App,IDB {  
  private name: string;  
  public connector: Connector; // 
  public datastore: TxnDatastoreExtended; 
  public dispatcher: Dispatcher;   
  public eventcodec: EventCodec; 
  public collections: Map<string, Collection> = new Map();
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


  async saveName(prevName: string): Promise<void> {  
    if (this.name === prevName) return;  
    if (!this.name.match(/a-zA-Z0-9+/)) { // 根据需求定义规则  
      throw new Error('Invalid name');  
    }  
    await this.datastore.put(new Key('dbName'), new TextEncoder().encode(this.name)); 
  }  

 
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
      this  
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
            this
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
   
  
  }  

  async reduce(events: Event[]): Promise<void> {  
    console.debug(`reducing events in ${this.name}`);
    const baseKey = new Key('/');
    
    try {
      // 调用事件编解码器的 reduce 方法获取处理结果
      const codecActions = await this.eventcodec.reduce(
        events, 
        this.datastore, 
        baseKey, 
        this.defaultIndexFunc()
      );
      
      // 创建 actions 数组并映射处理结果
      const actions: Action[] = codecActions.map(ca => {
        let actionType: ActionType;
        
        // 根据类型转换为对应的操作类型
        switch (ca.type) {
          case 'create':
            actionType = ActionType.Create;
            break;
          case 'save':
            actionType = ActionType.Save;
            break;
          case 'delete':
            actionType = ActionType.Delete;
            break;
          default:
            throw new Error(`eventcodec action not recognized: ${ca.type}`);
        }
        
        // 返回转换后的 Action 对象
        return {
          collectionName: ca.collection,
          type: actionType,
          instanceID: ca.instanceID
        };
      });
      
      // 通知状态变更
      this.notifyStateChanged(actions);
      
    } catch (err) {
      throw new Error(`Error reducing events: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
/**
 * 默认索引函数
 * 创建一个处理集合索引更新的函数
 */
defaultIndexFunc(): (collection: string, key: Key, txn: any, oldData?: Uint8Array, newData?: Uint8Array) => Promise<void> {
  return async (collection: string, key: Key, txn: any, oldData?: Uint8Array, newData?: Uint8Array): Promise<void> => {
    const c = this.collections.get(collection);
    if (!c) {
      throw new Error(`collection (${collection}) not found`);
    }
    if (oldData) {
      await c.indexDelete(txn, key, oldData);
    }
    if (!newData) {
      return;
    }
    await c.indexAdd(txn, key, newData);
  };
}
  
  // 添加通知状态变更的方法
  private notifyStateChanged(actions: Action[]): void {
    // 发送状态变更事件
    if (this.localEventsBus) {//浏览器侧暂不实现
      console.debug(`State changed with ${actions.length} actions`);
    }
  }
/**
 * 通知事务事件
 * 将事务相关的节点和令牌发送到本地事件总线
 */
async notifyTxnEvents(node: IPLDNode, token: ThreadToken): Promise<void> {
  try {
    await this.localEventsBus.send({
      node: node,
      token: token
    });
  } catch (err) {
    throw new Error(`Failed to notify transaction events: ${err instanceof Error ? err.message : String(err)}`);
  }
}

  async dispatch(events: Event[]): Promise<void> {
    // 实现事件分发逻辑
    for (const event of events) {
      await this.reduce([event]);
    }
  }
  
  async validateNetRecordBody(body: IPLDNode, identity: Ed25519PubKey): Promise<Error | undefined> {  
    try {  
      const events: Event[] = await this.eventcodec.eventsFromBytes(body.data());  
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

  async handleNetRecord(rec: IThreadRecord, key: ThreadKey): Promise<Error | undefined> {  
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
    rec: IThreadRecord,
    key: ThreadKey
  ): Promise<bigint> {
    let event :IThreadEvent;
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

    let body:IPLDNode;
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
      events = await this.eventcodec.eventsFromBytes(body.data());
    } catch (err) {
      throw new Error(`Error when unmarshaling event from bytes: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (events.length === 0) {
      throw new Error('No events found in record');
    }
    return events[0].timestamp;
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


async readTxn(
  collection: Collection, 
  fn: (txn: ITxn) => Promise<void> | void, 
  token?: ThreadToken
): Promise<void> {
  console.debug(`starting read txn in ${this.name}`);
  
  // 创建事务选项
  const args = { token: undefined } as any;
 
  
  // 创建只读事务
  const txn = new Txn( collection, token,  true);
  
  try {
    // 执行事务函数
    await fn(txn);
    console.debug(`ending read txn in ${this.name}`);
  } finally {
    // 确保事务被丢弃
    txn.discard();
  }
}

// 使用队列确保写入操作按顺序执行
private writeQueue = Promise.resolve();

async writeTxn(
  collection: Collection, 
  fn: (txn: ITxn) => Promise<void> | void, 
  token?: ThreadToken
): Promise<void> {
  // 将写入操作添加到队列
  this.writeQueue = this.writeQueue.then(async () => {
    console.debug(`starting write txn in ${this.name}`);
    // 创建可写事务
    const txn = new Txn(collection, token, false);
    try {
      // 执行事务函数
      await fn(txn);
      
      // 提交事务
      await txn.commit();
      console.debug(`ending write txn in ${this.name}`);
    } finally {
      // 确保事务被丢弃
      txn.discard();
    }
  });
  
  // 等待当前事务完成
  return this.writeQueue;
}



 
}