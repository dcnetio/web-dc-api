// db.ts - Complete TypeScript Implementation (Simplified Core)
import { EventEmitter } from "events";
import {} from "../common/transformed-datastore";
import { Key, Query } from "interface-datastore";
import { Key as ThreadKey } from "../common/key";
import { Connector } from "../core/app";
import {
  Context,
  IDBInfo,
  ManagedOptions,
  ThreadInfo,
  ThreadMuliaddr,
} from "../core/core";
import {
  EventCodec,
  Errors,
  pullThreadBackgroundTimeout,
  PullTimeout,
} from "../core/db";
import { IThreadRecord } from "../core/record";
import { Ed25519PubKey } from "../../../common/dc-key/ed25519";
import { JSONSchemaType } from "ajv";
import { IThreadEvent } from "../core/event";
import { Collection, Txn } from "./collection";
import { ThreadToken } from "../core/identity";
import { NewOptions, Index, ICollectionConfig } from "../core/core";
import {
  Event,
  InstanceID,
  ReduceAction,
  Action,
  CoreActionType,
  TxnDatastoreExtended,
  Transaction,
  IndexFunc,
  DBPrefix,
  IDB,
  ITxn,
} from "../core/db";

import { ulid } from "ulid";
import { JsonPatcher } from "../common/json-patcher";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { ThreadID } from "@textile/threads-id";
import { PeerId } from "@libp2p/interface";
import { Net } from "../core/app";
import { Dispatcher } from "../common/dispatcher";
import { LocalEventsBus, App } from "../core/app";
import * as dagPB from "@ipld/dag-pb";
import * as threadEvent from "../cbor/event";
import { IRecord } from "../core/record";
import { IPLDNode } from "../core/core";
import { jsonStringify } from "../../../util/utils";

const baseKey = DBPrefix.dsPrefix.child(new Key("collection"));
const getBlockInitialTimeout = 500;
const getBlockRetries = 3;

export class CollectionEvent<T = any> implements Event<T> {
  readonly timestamp: BigInt;

  constructor(
    readonly instanceID: InstanceID,
    readonly collection: string,
    readonly payload: T
  ) {
    this.timestamp = BigInt(
      Date.now() * 1000000 + Math.floor(Math.random() * 1000000)
    );
  }

  async marshal(): Promise<Uint8Array> {
    return new TextEncoder().encode(
      jsonStringify({
        t: this.timestamp,
        i: this.instanceID,
        c: this.collection,
        p: this.payload,
      })
    );
  }
}

class CollectionExistsError extends Error {
  name: string;
  constructor(name: string) {
    super(`Collection ${name} already exists`);
    this.name = "CollectionExistsError";
  }
}

export class DB implements App, IDB {
  private name: string;
  public connector: Connector | null = null; //
  public datastore: TxnDatastoreExtended;
  public dispatcher: Dispatcher | null = null;
  public eventcodec: EventCodec;
  public collections: Map<string, Collection> = new Map();
  public localEventsBus: LocalEventsBus | null = null;
  private webLock: string;

  constructor(
    datastore: TxnDatastoreExtended,
    net: Net,
    id: string,
    opts: NewOptions
  ) {
    this.datastore = datastore;
    this.name = opts.name || "unnamed";
    this.eventcodec = opts.eventCodec || new JsonPatcher();
    this.webLock = "webLock_db_" + id;
  }

  // 新建 DB 实例
  static async newDB(
    store: TxnDatastoreExtended,
    n: Net,
    id: ThreadID,
    opts?: NewOptions
  ): Promise<DB> {
    const args = opts || new NewOptions();
    if (!args.eventCodec) {
      args.eventCodec = new JsonPatcher(); //DefaultEventCodec()
    }

    const dbInstance = new DB(store, n, id.toString(), args);
    dbInstance.name = "";
    dbInstance.dispatcher = new Dispatcher(store);
    dbInstance.localEventsBus = new LocalEventsBus();

    try {
      await dbInstance.loadName();
    } catch (error) {
      throw new Error("Failed to load DB name");
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
      throw new Error(
        `Failed to connect app: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // 处理集合配置
    if (args.collections && args.collections.length > 0) {
      for (const collectionConfig of args.collections) {
        try {
          await dbInstance.newCollection(collectionConfig);
        } catch (err) {
          throw new Error(
            `Failed to create collection: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
    }
    return dbInstance;
  }

  /**
   * GetDBInfo returns the addresses and key that can be used to join the DB thread.
   * @param options Optional settings for the operation
   * @returns Promise resolving to thread info
   */
  async getDBInfo(options?: ManagedOptions): Promise<IDBInfo> {
    console.debug(`getting db info in ${this.name}`);

    try {
      const threadInfo = await this.connector?.net.getThread(
        this.connector?.threadId,
        { token: options?.token }
      );
      const dbInfo: IDBInfo = {
        id: this.connector ? this.connector.threadId.toString() : "",
        name: this.name,
        addrs: threadInfo
          ? threadInfo.addrs.map((addr: ThreadMuliaddr) => addr.toString())
          : [],
        key: threadInfo ? threadInfo.key?.toString() : "",
      };
      return dbInfo;
    } catch (err) {
      throw new Error(
        `Failed to get DB info: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  async saveName(prevName: string): Promise<void> {
    if (this.name === prevName) return;
    if (!this.name.match(/^[a-zA-Z0-9_-]+$/)) {
      // 根据需求定义规则
      throw new Error("Invalid name");
    }
    await this.datastore.put(
      DBPrefix.dsName,
      new TextEncoder().encode(this.name)
    );
  }

  async loadName(): Promise<void> {
    try {
      const nameBuffer = await this.datastore.get(DBPrefix.dsName);
      if (nameBuffer) {
        this.name = new TextDecoder().decode(nameBuffer);
      }
    } catch (error) {}
  }

  private async initCollections(configs: ICollectionConfig[]): Promise<void> {
    for (const config of configs) {
      await this.newCollection(config);
    }
  }

  async upgradeCollections(configs: ICollectionConfig[]): Promise<void> {
    for (const config of configs) {
      await this.newCollection(config,true);
    }
  }

  async newCollection(config: ICollectionConfig,forceUpdate:boolean=false): Promise<Collection> {
    if (this.collections.has(config.name) && !forceUpdate) {
      throw new CollectionExistsError(config.name);
    }
    const collection = new Collection(config.name, config.schema, this);

    // Add default _id index
    await collection.addIndex({ path: "_id", unique: true });

    // Add custom indexes
    for (const index of config.indexes || []) {
      await collection.addIndex(index);
    }
    //保存集合配置到数据存储
    this.saveCollection(collection);
    return collection;
  }

  async saveCollection(c: Collection): Promise<void> {
    console.debug(`saving collection ${c.name} in ${this.name}`);

    try {
      // Save schema
      await this.datastore.put(
        DBPrefix.dsSchemas.child(new Key(c.name)),
        c.getSchema()
      );

      // Save write validator if exists
      if (c.rawWriteValidator) {
        await this.datastore.put(
          DBPrefix.dsValidators.child(new Key(c.name)),
          new TextEncoder().encode(c.rawWriteValidator)
        );
      }

      // Save read filter if exists
      if (c.rawReadFilter) {
        await this.datastore.put(
          DBPrefix.dsFilters.child(new Key(c.name)),
          new TextEncoder().encode(c.rawReadFilter)
        );
      }
      // Add collection to local map
      this.collections.set(c.name, c);
    } catch (err) {
      throw new Error(
        `Failed to save collection ${c.name}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  async reCreateCollections(): Promise<void> {
    try {
      const results = this.datastore.query({
        prefix: DBPrefix.dsSchemas.toString(),
      }) as AsyncIterable<{ key: Key; value: Uint8Array }>;

      try {
        for await (const res of results) {
          const name = res.key.name();
          const schema = JSON.parse(new TextDecoder().decode(res.value));

          let wv: string | undefined;
          try {
            const wvBuffer = await this.datastore.get(
              DBPrefix.dsValidators.child(new Key(name))
            );
            wv = new TextDecoder().decode(wvBuffer);
          } catch (err: any) {
            if (err.code !== "ERR_NOT_FOUND") throw err;
          }

          let rf: string | undefined;
          try {
            const rfBuffer = await this.datastore.get(
              DBPrefix.dsFilters.child(new Key(name))
            );
            rf = new TextDecoder().decode(rfBuffer);
          } catch (err: any) {
            if (err.code !== "ERR_NOT_FOUND") throw err;
          }

          const c = new Collection(name, schema, this);

          // 修复索引对象
          try {
            const indexBuffer = await this.datastore.get(
              DBPrefix.dsIndexes.child(new Key(name))
            );
            const indexData = JSON.parse(new TextDecoder().decode(indexBuffer));

            // 修复索引映射 - 使用 Map 而不是对象
            for (const [path, index] of Object.entries(indexData)) {
              if (path) {
                c.indexes.set(path, index as Index);
              }
            }
          } catch (err: any) {
            if (err.code !== "ERR_NOT_FOUND") throw err;
          }

          // 添加到集合映射
          this.collections.set(c.name, c);
        }
      } catch (err) {
        throw new Error(
          `Error re-creating collections: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    } catch (err) {
      throw new Error(
        `Error re-creating collections: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  getCollection(name: string): Collection {
    const collection = this.collections.get(name);
    if (!collection) throw new Error(`Collection ${name} not found`);
    return collection;
  }

  async close(): Promise<void> {}

  async reduce(events: Event[]): Promise<void> {
    try {
      // 调用事件编解码器的 reduce 方法获取处理结果
      const codecActions = await this.eventcodec.reduce(
        events,
        this.datastore,
        baseKey,
        this.defaultIndexFunc()
      );
      

      // 创建 actions 数组并映射处理结果
      const actions: Action[] = codecActions.map((ca) => {
        if (ca.type != CoreActionType.Create) {
         console.log('ca.type', ca.type);
        }
        // 返回转换后的 Action 对象
        return {
          collectionName: ca.collection,
          type: ca.type,
          instanceID: ca.instanceID,
        };
      });

      // 通知状态变更
      this.notifyStateChanged(actions);
    } catch (err) {
      throw new Error(
        `Error reducing events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 默认索引函数
   * 创建一个处理集合索引更新的函数
   */
  defaultIndexFunc(): (
    collection: string,
    key: Key,
    txn: any,
    oldData?: Uint8Array,
    newData?: Uint8Array
  ) => Promise<void> {
    return async (
      collection: string,
      key: Key,
      txn: any,
      oldData?: Uint8Array,
      newData?: Uint8Array
    ): Promise<void> => {
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
    if (this.localEventsBus) {
      //浏览器侧暂不实现
    }
  }
  /**
   * 通知事务事件
   * 将事务相关的节点和令牌发送到本地事件总线
   */
  async notifyTxnEvents(node: IPLDNode, token: ThreadToken): Promise<void> {
    try {
      await this.localEventsBus?.send({
        node: node,
        token: token,
      });
    } catch (err) {
      throw new Error(
        `Failed to notify transaction events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  async dispatch(events: Event[]): Promise<void> {
    // 实现事件分发逻辑
    for (const event of events) {
      await this.reduce([event]);
    }
  }

  async validateNetRecordBody(
    body: IPLDNode,
    identity: Ed25519PubKey
  ): Promise<Error | undefined> {
    try {
      const events: Event[] = await this.eventcodec.eventsFromBytes(
        body.data()
      );
      if (events.length === 0) {
        return;
      }

      for (const e of events) {
        const collection = this.collections.get(e.collection);
        if (!collection) {
          return Errors.ErrCollectionNotFound;
        }
      }
      return;
    } catch (error) {
      return error as Error;
    }
  }

  async handleNetRecord(
    rec: IThreadRecord,
    key: ThreadKey
  ): Promise<Error | undefined> {
    let event: any;
    try {
      if (!this.connector) {
        return new Error("no connector");
      }
      // 从记录中解码事件
      event = await threadEvent.EventFromRecord(
        this.connector?.net.bstore,
        rec.value()
      );
    } catch (err) {
      // 如果解码失败，尝试从块中获取事件
      try {
        const block = await this.getBlockWithRetry(rec.value());
        event = await threadEvent.EventFromNode(block);
      } catch (blockErr) {
        return blockErr as Error;
      }
    }
    try {
      // 获取事件的主体
      const body = await event.getBody(this.connector?.net, key.read());

      // 从字节数据中解码事件
      const events = await this.eventcodec.eventsFromBytes(body.rawData());

      // 分发事件
      await this.dispatch(events);
    } catch (err) {
      return new Error(
        `error when processing event: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
    return;
  }

  async getNetRecordCreateTime(
    rec: IThreadRecord,
    key: ThreadKey
  ): Promise<BigInt> {
    let event: IThreadEvent;
    if (!this.connector) {
      throw new Error("no connector");
    }
    try {
      // 从记录中解码事件
      event = await threadEvent.EventFromRecord(
        this.connector?.net.bstore,
        rec.value()
      );
    } catch (err) {
      // 如果解码失败，尝试从块中获取事件
      try {
        const block = await this.getBlockWithRetry(rec.value());
        event = await threadEvent.EventFromNode(block);
      } catch (decodeErr) {
        throw new Error(
          `Error when decoding block to event: ${
            decodeErr instanceof Error ? decodeErr.message : String(decodeErr)
          }`
        );
      }
    }

    let body: IPLDNode;
    try {
      // 获取事件的主体
      body = await event.getBody(this.connector?.net.bstore, key.read());
    } catch (err) {
      throw new Error(
        `Error when getting body of event on thread ${
          this.connector?.threadId
        }/${rec.logID()}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    let events: Event<any>[];
    try {
      // 从字节数据中解码事件
      events = await this.eventcodec.eventsFromBytes(body.data());
    } catch (err) {
      throw new Error(
        `Error when unmarshaling event from bytes: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    if (events.length === 0) {
      throw new Error("No events found in record");
    }
    return events[0]!.timestamp;
  }

  private async getBlockWithRetry(rec: IRecord): Promise<any> {
    let backoff = getBlockInitialTimeout;
    let lastError: Error | null = null;
    if (!this.connector) {
      throw new Error("no connector");
    }
    // 重试循环
    for (let i = 1; i <= getBlockRetries; i++) {
      try {
        // 尝试获取块
        const block = await rec.getBlock(this.connector?.net.bstore);
        return block; // 成功则立即返回
      } catch (err) {
        lastError = err as Error;
        console.warn(`错误: 在第 ${i} 次重试中获取块 ${rec.cid()} 失败`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        backoff *= 2;
      }
    }
  }

  async readTxn(
    collection: Collection,
    fn: (txn: ITxn) => Promise<void>,
    token?: ThreadToken
  ): Promise<void> {
    // 创建事务选项
    const args = { token: undefined } as any;

    // 创建只读事务
    const txn = new Txn(collection, token, true);

    try {
      // 执行事务函数
      await fn(txn);
    } finally {
      // 确保事务被丢弃
      txn.discard();
    }
  }

  // 使用队列确保写入操作按顺序执行
  private writeQueue = Promise.resolve();

async writeTxn(
  collection: Collection,
  fn: (txn: ITxn) => Promise<void>,
  token?: ThreadToken
): Promise<void> {
  // Save the current promise chain
  const previousOperation = this.writeQueue;
  
  // Create a new promise for this operation
  const currentOperation = new Promise<void>((resolve, reject) => {
    // Wait for previous operations to complete (or fail)
    previousOperation
      .catch(() => {
        // Ignore previous errors - just ensure we wait for previous operations
      })
      .finally(async () => {
        // After previous operations are done (success or failure), run this operation
        const txn = new Txn(collection, token, false);
        try {
          // Execute transaction function
          await fn(txn);
          
          // Commit transaction
          await txn.commit();
          resolve();
        } catch (err) {
          // Properly propagate the error
          reject(err);
        } finally {
          // Always discard the transaction
          txn.discard();
        }
      });
  });

  // Update the queue with our operation
  this.writeQueue = currentOperation.catch(() => {
    // Swallow errors in the queue chain but log them
    // This ensures future operations will still execute
    return Promise.resolve();
  });

  // Return the current operation, allowing errors to propagate to the caller
  return currentOperation;
}
}
