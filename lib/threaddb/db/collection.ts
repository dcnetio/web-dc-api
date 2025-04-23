import { Key,QueryFilter } from 'interface-datastore';
import  {AnySchema} from 'ajv';
import Ajv from 'ajv';
import { nanoid } from 'nanoid';
import EventEmitter from 'eventemitter3';

import { Ed25519PrivKey  as PrivKey,Ed25519PubKey as PubKey} from "../../dc-key/ed25519";
import { Action, CoreActionType, Event,ITxn ,idFieldName} from '../core/db';
import { ThreadID } from '@textile/threads-id';
import { IPLDNode } from '../core/core';
import { ICollectionConfig } from '../core/core';
import {dsPrefix,IDB,ICollection,DBPrefix} from '../core/db';
import {ThreadToken} from '../core/identity';
import {dsDispatcherPrefix} from '../common/dispatcher';
import {Query,compare,traverseFieldPathMap} from './query';
import * as cbornode from '../cbor/node';
import * as dagCBOR from '@ipld/dag-cbor';
import { dagCbor } from '@helia/dag-cbor';

// iteratorKeyMinCacheSize is the size of iterator keys stored in memory before more are fetched.
const iteratorKeyMinCacheSize = 100
	

// Error classes for index operations
class IndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IndexError';
  }
}

// Error constants
const ErrUniqueExists = new IndexError("unique constraint violation");
const ErrNotIndexable = new IndexError("value not indexable");
const ErrCantCreateUniqueIndex = new IndexError("can't create unique index (duplicate instances exist)");
const ErrIndexNotFound = new IndexError("index not found");

// Index key prefix
const indexPrefix = new Key("_index");

// Valid index types
const indexTypes: string[] = ["string", "number", "integer", "boolean"];

/**
 * Index defines an index configuration
 */
export interface Index {
  /**
   * Path to the field to index in dot syntax, e.g., "name.last" or "age".
   */
  path: string;
  
  /**
   * Unique indicates that only one instance should exist per field value.
   */
  unique?: boolean;
}

/**
 * MarshaledResult 表示查询结果
 */
interface MarshaledResult {
    instanceID: InstanceID;
    key: string;
    value: Uint8Array;
    marshaledValue?: Record<string, any>;
}


/**
 * Error types
 */
export class InvalidSortingFieldError extends Error {
  constructor() {
    super("sorting field doesn't correspond to instance type");
    this.name = "InvalidSortingFieldError";
  }
}
  
  // 常量定义

const ErrInvalidSortingField = new InvalidSortingFieldError();
// Error definitions
class ThreadDBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreadDBError';
  }
}

// Define specific error types
const ErrInvalidCollectionSchemaPath = new ThreadDBError('collection schema does not contain path');
const ErrCollectionNotFound = new ThreadDBError('collection not found');
const ErrCollectionAlreadyRegistered = new ThreadDBError('collection already registered');
const ErrInstanceNotFound = new ThreadDBError('instance not found');
const ErrReadonlyTx = new ThreadDBError('read only transaction');
const ErrInvalidSchemaInstance = new ThreadDBError('instance doesn\'t correspond to schema');
const ErrInvalidCollectionSchema = new ThreadDBError('invalid collection schema');
const ErrInvalidName = new ThreadDBError('invalid collection name');

const errMissingInstanceID = new ThreadDBError('invalid instance: missing _id attribute');
const errAlreadyDiscardedCommitedTxn = new ThreadDBError('can\'t commit discarded/committed txn');
const errCantCreateExistingInstance = new ThreadDBError('can\'t create already existing instance');

// Constants
const baseKey = dsPrefix.child(new Key('collection'));
const vmTimeout = 200; // milliseconds
const writeValidatorFn = "_validate";
const readFilterFn = "_filter";

const createNetRecordTimeout = 30000; // 30 seconds

// RegExp for validating collection names
const nameRx = /^[a-zA-Z0-9_]+$/;

/**
 * Instance ID type
 */
export type InstanceID = string;

// Empty instance ID constant
const EmptyInstanceID = '';

// Generate a new instance ID
function NewInstanceID(): InstanceID {
  return nanoid();
}

/**
 * Collection configuration interface
 */


/**
 * Index definition for collections
 */
export interface Index {
  path: string;
  unique?: boolean;
}





/**
 * JavaScript runtime interface for validators
 */
interface JSRuntime {
  runScript(script: string): any;
  getGlobal(name: string): any;
  call(fn: string, ...args: any[]): any;
}

/**
 * Browser-compatible JS runtime
 */
class BrowserJSRuntime implements JSRuntime {
  private context: Record<string, any> = {};
  private functions: Record<string, Function> = {};
  private timeoutId: number | null = null;
  
  constructor(private timeout: number = vmTimeout) {}
  
  runScript(script: string): any {
    try {
      // Create a function that executes in our context
      const fn = new Function('context', `
        with(context) { 
          ${script}; 
          return context; 
        }
      `);
      
      // Set timeout for long-running scripts
      let completed = false;
      this.timeoutId = window.setTimeout(() => {
        if (!completed) {
          console.warn("JavaScript execution timed out");
        }
      }, this.timeout);
      
      // Execute the script
      this.context = fn(this.context) || this.context;
      
      // Clear timeout
      completed = true;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      return true;
    } catch (err) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      throw new Error(`Script execution error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
  getGlobal(name: string): any {
    return this.context[name];
  }
  
  call(fn: string, ...args: any[]): any {
    const func = this.context[fn];
    if (typeof func !== 'function') {
      throw new Error(`${fn} is not a function`);
    }
    
    try {
      // Set timeout for long-running functions
      let completed = false;
      this.timeoutId = window.setTimeout(() => {
        if (!completed) {
          console.warn("JavaScript function call timed out");
        }
      }, this.timeout);
      
      // Execute the function
      const result = func.apply(this.context, args);
      
      // Clear timeout
      completed = true;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      return result;
    } catch (err) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      throw new Error(`Function execution error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/**
 * Connector interface for DB
 */
interface Connector {
  validate(token: ThreadToken, readOnly: boolean): Promise<Error | null>;
  createNetRecord(node: IPLDNode, token: ThreadToken): Promise<any>;
}



/**
 * Collection class - a group of instances sharing a schema
 */
export class Collection implements ICollection {
  private schemaValidator: Ajv;
  private vm: JSRuntime;
  private writeValidator: ((writer: any, event: any, instance: any) => boolean) | null = null;
  public readFilter: ((reader: any, instance: any) => any) | null = null;
  public indexes: Map<string, Index> = new Map();
  
  constructor(
    public readonly name: string,
    public schema: AnySchema,
    public db: IDB,
    private rawWriteValidator?: string,
    private rawReadFilter?: string
  ) {
    // Initialize schema validator
    this.schemaValidator = new Ajv({ allErrors: true });
    this.vm = new BrowserJSRuntime(vmTimeout);
    
    // Compile and load validators if provided
    if (rawWriteValidator) {
      this.compileAndLoadValidator(rawWriteValidator, writeValidatorFn, ['writer', 'event', 'instance']);
    }
    
    if (rawReadFilter) {
      this.compileAndLoadValidator(rawReadFilter, readFilterFn, ['reader', 'instance']);
    }
  }
  
  private compileAndLoadValidator(source: string, name: string, args: string[]): void {
    try {
      const script = `function ${name}(${args.join(",")}) {${source}}`;
      this.vm.runScript(script);
      
      // Test the function exists
      const fn = this.vm.getGlobal(name);
      if (typeof fn !== 'function') {
        throw new Error(`${name} is not a function`);
      }
      
      // Set the appropriate validator
      if (name === writeValidatorFn) {
        this.writeValidator = (writer: any, event: any, instance: any) => 
          this.vm.call(writeValidatorFn, writer, event, instance);
      } else if (name === readFilterFn) {
        this.readFilter = (reader: any, instance: any) => 
          this.vm.call(readFilterFn, reader, instance);
      }
    } catch (err) {
      throw new Error(`Failed to compile ${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Get base key for this collection
   */
  baseKey(): Key {
    return baseKey.child(new Key(this.name));
  }

  /**
   * Get collection name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get collection schema
   */
  getSchema(): Uint8Array {
    return new TextEncoder().encode(JSON.stringify(this.schema));
  }

  /**
   * Get write validator
   */
  getWriteValidator(): Uint8Array {
    return new TextEncoder().encode(this.rawWriteValidator || '');
  }

  /**
   * Get read filter
   */
  getReadFilter(): Uint8Array {
    return new TextEncoder().encode(this.rawReadFilter || '');
  }

  /**
   * Create a read transaction
   */
  async readTxn(fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void> {
    return this.db.readTxn(this, fn, token);
  }

  /**
   * Create a write transaction
   */
  async writeTxn(fn: (txn: ITxn) => Promise<void> | void, token?: ThreadToken): Promise<void> {
    return this.db.writeTxn(this, fn, token);
  }

  /**
   * Find instance by ID
   */
  async findByID(id: InstanceID, token?: ThreadToken): Promise<Object> {
    let instance: Object | null = null;
    
    await this.readTxn(async (txn) => {
      instance = await txn.findByID(id);
    }, token);
    
    return instance!;
  }

  /**
   * Create a new instance
   */
  async create(v: Uint8Array, token?: ThreadToken): Promise<InstanceID> {
    let id: InstanceID = '';
    
    await this.writeTxn(async (txn) => {
      const ids = await txn.create(v);
      if (ids.length > 0) {
        id = ids[0];
      }
    }, token);
    
    return id;
  }

  /**
   * Create multiple instances
   */
  async createMany(vs: Uint8Array[], token?: ThreadToken): Promise<InstanceID[]> {
    let ids: InstanceID[] = [];
    
    await this.writeTxn(async (txn) => {
      ids = await txn.create(...vs);
    }, token);
    
    return ids;
  }

  /**
   * Delete an instance by ID
   */
  async delete(id: InstanceID, token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.delete(id);
    }, token);
  }

  /**
   * Delete multiple instances by ID
   */
  async deleteMany(ids: InstanceID[], token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.delete(...ids);
    }, token);
  }

  /**
   * Save changes to an instance
   */
  async save(v: Uint8Array, token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.save(v);
    }, token);
  }

  /**
   * Save changes to multiple instances
   */
  async saveMany(vs: Uint8Array[], token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.save(...vs);
    }, token);
  }

  /**
   * Verify changes to an instance
   */
  async verify(v: Uint8Array, token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.verify(v);
    }, token);
  }

  /**
   * Verify changes to multiple instances
   */
  async verifyMany(vs: Uint8Array[], token?: ThreadToken): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.verify(...vs);
    }, token);
  }

  /**
   * Check if an instance exists
   */
  async has(id: InstanceID, token?: ThreadToken): Promise<boolean> {
    let exists = false;
    
    await this.readTxn(async (txn) => {
      exists = await txn.has(id);
    }, token);
    
    return exists;
  }

  /**
   * Check if multiple instances exist
   */
  async hasMany(ids: InstanceID[], token?: ThreadToken): Promise<boolean> {
    let exists = false;
    
    await this.readTxn(async (txn) => {
      exists = await txn.has(...ids);
    }, token);
    
    return exists;
  }

  /**
   * Find instances matching a query
   */
  async find(q: Query, token?: ThreadToken): Promise<Object[]> {
    let instances: Object[] = [];
    
    await this.readTxn(async (txn) => {
      instances = await txn.find(q);
    }, token);
    
    return instances;
  }

  /**
   * Get instances modified since a specific time
   */
  async modifiedSince(time: number, token?: ThreadToken): Promise<InstanceID[]> {
    let ids: InstanceID[] = [];
    
    await this.readTxn(async (txn) => {
      ids = await txn.modifiedSince(time);
    }, token);
    
    return ids;
  }

  /**
   * Validate an instance against the collection schema
   */
  validInstance(v: Uint8Array): void {
    try {
      const instance = JSON.parse(new TextDecoder().decode(v));
      const validate = this.schemaValidator.compile(this.schema);
      const valid = validate(instance);
      
      if (!valid && validate.errors && validate.errors.length > 0) {
        let msg = '';
        for (let i = 0; i < validate.errors.length; i++) {
          const e = validate.errors[i];
          msg += `${e.schemaPath}: ${e.message}`;
          if (i !== validate.errors.length - 1) {
            msg += '; ';
          }
        }
        throw new Error(`${ErrInvalidSchemaInstance.message}: ${msg}`);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes(ErrInvalidSchemaInstance.message)) {
        throw err;
      }
      throw new Error(`Error validating instance: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Validate write operations against the write validator
   */
  async validWrite(identity: PubKey, e: Event): Promise<void> {
    if (!this.writeValidator) {
      return;
    }
    
    try {
      // Load identity
      const writer = identity ? identity.toString() : null;
      
      // Marshal event
      const data = await e.marshal();
      const eventData = JSON.parse(new TextDecoder().decode(data));
      
      // Get instance
      let instanceData = null;
      try {
        const key = this.baseKey().child(new Key(e.instanceID));
        const val = await this.db.datastore.get(key);
        if (val) {
          instanceData = JSON.parse(new TextDecoder().decode(val));
        }
      } catch (err: any) {
        // Only ignore "not found" errors
        if (err.code !== 'ERR_NOT_FOUND') {
          throw err;
        }
      }
      
      // Run validator
      const result = this.writeValidator(writer, eventData, instanceData);
      
      if (result !== true) {
        throw new Error('Write validation failed');
      }
    } catch (err) {
      throw new Error(`Write validation error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Filter read operations based on the read filter
   */
  async filterRead(identity: PubKey|undefined, instance: Uint8Array): Promise<Uint8Array | null> {
    if (!this.readFilter) {
      return instance;
    }
    
    try {
      // Load identity
      const reader = identity ? identity.toString() : null;
      
      // Parse instance
      const instanceData = JSON.parse(new TextDecoder().decode(instance));
      
      // Run filter
      const result = this.readFilter(reader, instanceData);
      
      if (result === null) {
        return null;
      }
      
      return new TextEncoder().encode(JSON.stringify(result));
    } catch (err) {
      throw new Error(`Read filter error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }


/**
 * 返回当前索引列表
 */
getIndexes(): Index[] {
  if (this.indexes.size === 0) {
    return [];
  }
  
  const indexes: Index[] = [];
  this.indexes.forEach((index, path) => {
    if (path !== idFieldName) {
      indexes.push(index);
    }
  });
  
  return indexes;
}

/**
 * 创建基于路径的新索引
 * 使用点语法访问嵌套字段，例如 "name.last"
 * 路径上的字段必须是支持的JSON Schema类型之一: string, number, integer, 或 boolean
 * 设置unique为true可以在该路径上创建唯一性约束
 * 添加索引将覆盖任何已存在的重叠索引值
 * 注意: 这目前不会构建索引。如果在添加新索引之前已添加了项目，它们不会被事后索引。
 */
async addIndex( index: Index, token?: ThreadToken): Promise<void> {
 

  // 不允许覆盖默认索引
  if (index.path === idFieldName) {
    if (this.indexes.has(idFieldName)) {
      return;
    }
  }

  // 验证路径和类型
  try {
    const jt = getSchemaTypeAtPath(this.schema, index.path);
    let valid = false;
    for (const t of indexTypes) {
      if (jt?.type === t) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      throw ErrNotIndexable;
    }
    
    // 如果没有变化则跳过
    const existingIndex = this.indexes.get(index.path);
    if (existingIndex && existingIndex.unique === index.unique) {
      return;
    }
    
    // 确保集合在该路径上不包含具有相同值的多个实例
    if (index.unique && index.path !== idFieldName) {
      const vals = new Map<any, boolean>();
      const all = await this.find(new Query(), token);
      
      for (const item of all) {
        const value = traverseFieldPathMap(item, index.path);
        
        if (value === undefined) {
          continue;
        }
        
        if (vals.has(value)) {
          throw ErrCantCreateUniqueIndex;
        } else {
          vals.set(value, true);
        }
      }
    }
    
    // 保存索引
    this.indexes.set(index.path, index);
    await this.saveIndexes();
  } catch (err) {
    throw err;
  }
}

/**
 * 删除指定路径的索引
 */
async dropIndex(path: string): Promise<void> {
  // 不允许删除默认索引
  if (path === idFieldName) {
    throw new Error(`${idFieldName} index cannot be dropped`);
  }
  
  this.indexes.delete(path);
  await this.saveIndexes();
}

/**
 * 持久化当前索引
 */
async saveIndexes(): Promise<void> {
  try {
    const indexesObj: Record<string, Index> = {};
    this.indexes.forEach((index, path) => {
      indexesObj[path] = index;
    });
    
    const indexBytes = new TextEncoder().encode(JSON.stringify(indexesObj));
    await this.db.datastore.put(DBPrefix.dsIndexes.child(new Key(this.name)), indexBytes);
  } catch (err) {
    throw new Error(`Failed to save indexes: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 向索引添加条目
 */
async indexAdd(txn: any, key: Key, data: Uint8Array): Promise<void> {
  for (const [path, index] of this.indexes.entries()) {
    try {
      await this.indexUpdate(path, index, txn, key, data, false);
    } catch (err) {
      throw err;
    }
  }
}

/**
 * 从索引中移除条目
 * 确保传入的是旧记录的数据，而非新记录
 */
async indexDelete(txn: any, key: Key, originalData: Uint8Array): Promise<void> {
  for (const [path, index] of this.indexes.entries()) {
    try {
      await this.indexUpdate(path, index, txn, key, originalData, true);
    } catch (err) {
      throw err;
    }
  }
}

/**
 * 在项目上添加或移除特定索引
 */
async indexUpdate(field: string, index: Index, txn: any, key: Key, input: Uint8Array, deleteOp: boolean): Promise<void> {
  try {
    const valueKey = await getIndexValue(field, input);
    
    const indexKey = indexPrefix.child(this.baseKey()).child(new Key(field)).child(new Key(valueKey.toString().substring(1)));
    let data: Uint8Array | null = null;
    
    try {
      data = await txn.get(indexKey);
    } catch (err: any) {
      if (err.code !== 'ERR_NOT_FOUND') {
        throw err;
      }
    }
    
    const indexValue = new KeyList();
    if (data) {
      const decoded = JSON.parse(new TextDecoder().decode(data));
      indexValue.fromArray(decoded);
    }
    
    if (deleteOp) {
      indexValue.remove(key);
    } else {
      if (index.unique) {
        indexValue.remove(key);
      }
      indexValue.add(key);
    }
    
    if (indexValue.size() === 0) {
      await txn.delete(indexKey);
    } else {
      const encodedValue = new TextEncoder().encode(JSON.stringify(indexValue.toArray()));
      await txn.put(indexKey, encodedValue);
    }
  } catch (err) {
    if (err === ErrNotIndexable) {
      return;
    }
    throw err;
  }
}
}

/**
 * 返回对输入的字段搜索结果
 */
function getIndexValue(field: string, input: Uint8Array): Key {
  const decoded = dagCBOR.decode<Uint8Array>(input);
  const jsonObj = JSON.parse(new TextDecoder().decode(decoded));
  const value = traverseFieldPathMap(jsonObj, field);
  
  if (value === undefined) {
    throw ErrNotIndexable;
  }
  
  return new Key(String(value));
}

/**
 * KeyList是索引指向的唯一、排序的键切片
 */
class KeyList {
  private keys: Uint8Array[] = [];
  
  /**
   * 添加键到列表（如果不存在）
   */
  add(key: Key): void {
    const bytes = key.uint8Array();
    
    let i = this.binarySearch(bytes);
    
    if (i < this.keys.length && this.bytesEqual(this.keys[i], bytes)) {
      return; // 已添加
    }
    
    this.keys.splice(i, 0, bytes);
  }
  
  /**
   * 从列表中移除键
   */
  remove(key: Key): void {
    const bytes = key.uint8Array();
    
    let i = this.binarySearch(bytes);
    
    if (i < this.keys.length && this.bytesEqual(this.keys[i], bytes)) {
      this.keys.splice(i, 1);
    }
  }
  
  /**
   * 检查键是否在列表中
   */
  in(key: Key): boolean {
    const bytes = key.uint8Array();
    const i = this.binarySearch(bytes);
    return i < this.keys.length && this.bytesEqual(this.keys[i], bytes);
  }
  
  /**
   * 获取列表大小
   */
  size(): number {
    return this.keys.length;
  }
  
  /**
   * 转换为数组
   */
  toArray(): Uint8Array[] {
    return [...this.keys];
  }
  
  /**
   * 从数组填充
   */
  fromArray(arr: Uint8Array[]): void {
    this.keys = [...arr];
  }
  
  /**
   * 二分查找键位置
   */
  private binarySearch(bytes: Uint8Array): number {
    let low = 0;
    let high = this.keys.length - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cmp = this.bytesCompare(this.keys[mid], bytes);
      
      if (cmp < 0) {
        low = mid + 1;
      } else if (cmp > 0) {
        high = mid - 1;
      } else {
        return mid; // 找到
      }
    }
    
    return low; // 未找到，返回插入位置
  }
  
  /**
   * 比较两个字节数组
   */
  private bytesCompare(a: Uint8Array, b: Uint8Array): number {
    const len = Math.min(a.length, b.length);
    
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) {
        return a[i] < b[i] ? -1 : 1;
      }
    }
    
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
  }
  
  /**
   * 检查两个字节数组是否相等
   */
  private bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    
    return true;
  }
}




/**
 * Transaction class for collections
 */
export class Txn implements ITxn{
  private actions: Action[] = [];
  private discarded = false;
  private committed = false;
  
  constructor(
    private collection: Collection,
    private token?: ThreadToken,
    private readonly readonly: boolean = false
  ) {}

  /**
   * Create new instances
   */
  async create(...newInstances: Uint8Array[]): Promise<InstanceID[]> {
    const results: InstanceID[] = new Array(newInstances.length);
    
    for (let i = 0; i < newInstances.length; i++) {
      if (this.readonly) {
        throw ErrReadonlyTx;
      }
      
      // Copy the data to avoid modifying the input
      const updated = newInstances[i].slice(0);
      
      // Try to get instance ID, set one if missing
      let id = await getInstanceID(updated);
      if (id === EmptyInstanceID) {
        const result = setNewInstanceID(updated);
        id = result.id;
        const updatedWithId = result.data;
        
        // Validate schema
        this.collection.validInstance(updatedWithId);
        
        results[i] = id;
        const key = this.collection.baseKey().child(new Key(id));
        
        try {
          const exists = await this.collection.db.datastore.has(key);
          if (exists) {
            throw errCantCreateExistingInstance;
          }
        } catch (err) {
          if (err !== errCantCreateExistingInstance) {
            throw new Error(`Error checking if instance exists: ${err instanceof Error ? err.message : String(err)}`);
          }
          throw err;
        }
        
        // Set modified timestamp
        const { data: updatedWithTimestamp } = setModifiedTag(updatedWithId);
        
        // Add action
        this.actions.push({
          type: CoreActionType.Create,
          instanceID: id,
          collectionName: this.collection.name,
          current: updatedWithTimestamp
        });
      }
    }
    
    return results;
  }

  /**
   * Verify instance changes without saving them
   */
  async verify(...updated: Uint8Array[]): Promise<void> {
    try {
      const identity = await this.token?.pubKey();
	  if (!identity) {
		throw new Error('Identity not found');
	  }
      const actions = await this.createSaveActions(identity, ...updated);
      
      const { events } = await this.createEvents(actions);
      if (events.length === 0) {
        return;
      }
      
      for (const e of events) {
        await this.collection.validWrite(identity, e);
      }
    } catch (err) {
      throw new Error(`Verification failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Save instance changes
   */
  async save(...updated: Uint8Array[]): Promise<void> {
    try {
      const identity = await this.token?.pubKey();
	  if (!identity) {
		throw new Error('Identity not found');
	  }
      const actions = await this.createSaveActions(identity, ...updated);
      
      this.actions.push(...actions);
    } catch (err) {
      throw new Error(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Helper to create save actions
   */
  private async createSaveActions(identity: PubKey, ...updated: Uint8Array[]): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (let i = 0; i < updated.length; i++) {
      if (this.readonly) {
        throw ErrReadonlyTx;
      }
      
      // Copy the data to avoid modifying the input
      const next = updated[i].slice(0);
      
      // Validate schema
      this.collection.validInstance(next);
      
      // Set modified timestamp
      const { data: nextWithTimestamp } = setModifiedTag(next);
      
      // Get instance ID
      const id = await getInstanceID(nextWithTimestamp);
      if (id === EmptyInstanceID) {
        throw errMissingInstanceID;
      }
      
      // Get previous version
      const key = this.collection.baseKey().child(new Key(id));
      let previous: Uint8Array;
      
      try {
        previous = await this.collection.db.datastore.get(key);
      } catch (err: any) {
        // If not found, use empty object
        if (err.code === 'ERR_NOT_FOUND') {
          previous = new TextEncoder().encode('{}');
        } else {
          throw err;
        }
      }
      
      // Apply read filter if needed
      if (previous.length > 0) {
        const filtered = await this.collection.filterRead(identity, previous);
        previous = filtered || previous;
      }
      
      // Add action
      actions.push({
        type: CoreActionType.Save,
        instanceID: id,
        collectionName: this.collection.name,
        previous,
        current: nextWithTimestamp
      });
    }
    
    return actions;
  }

  /**
   * Delete instances
   */
  async delete(...ids: InstanceID[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      if (this.readonly) {
        throw ErrReadonlyTx;
      }
      
      const key = this.collection.baseKey().child(new Key(ids[i]));
      const exists = await this.collection.db.datastore.has(key);
      
      if (!exists) {
        // Nothing to do
        continue;
      }
      
      // Add action
      this.actions.push({
        type: CoreActionType.Delete,
        instanceID: ids[i],
        collectionName: this.collection.name
      });
    }
  }

  /**
   * Check if instances exist
   */
  async has(...ids: InstanceID[]): Promise<boolean> {
    const validationResult = await this.collection.db.connector.validate(this.token);
    if (validationResult) {
      throw validationResult;
    }
    
  const pk = await this.token?.pubKey();
	
    
    for (let i = 0; i < ids.length; i++) {
      const key = this.collection.baseKey().child(new Key(ids[i]));
      const exists = await this.collection.db.datastore.has(key);
      
      if (exists) {
        // If no read filter, instance is accessible
        if (!this.collection.readFilter) {
          continue;
        }
        
        // Otherwise, check read filter
        const bytes = await this.collection.db.datastore.get(key);
        const filtered = await this.collection.filterRead(pk, bytes);
        
        // If filtered to null, user doesn't have access
        if (!filtered) {
          return false;
        }
      } else {
        // Instance doesn't exist
        return false;
      }
    }
    
    // All instances exist and are accessible
    return true;
  }

  /**
   * Find instance by ID
   */
  async findByID(id: InstanceID): Promise<Object> {
    const validationResult = await this.collection.db.connector.validate(this.token);
    if (validationResult) {
      throw validationResult;
    }
    
    const key = this.collection.baseKey().child(new Key(id));
    let bytes: Uint8Array;
    
    try {
      bytes = await this.collection.db.datastore.get(key);
    } catch (err: any) {
      if (err.code === 'ERR_NOT_FOUND') {
        throw ErrInstanceNotFound;
      }
      throw err;
    }
    
    const pk = await this.token?.pubKey();
	
    const filtered = await this.collection.filterRead(pk, bytes);
    
    if (!filtered) {
      throw ErrInstanceNotFound;
    }
    let parsedValue;
    try {
      parsedValue = JSON.parse(new TextDecoder().decode(filtered));
    } catch (err) {
      console.warn("Failed to parse JSON for sorting:", err);
      parsedValue = {};
    }
                  
    return parsedValue;
  }

  /**
   * Find instances matching a query
   */
    async find(q?: Query): Promise<Object[]> {
      try {
        // 验证令牌
        const validationError = await this.collection.db.connector.validate(this.token);
        if (validationError) {
          throw validationError;
        }
        if (!q) {
          q = new Query();
        }
        const validationResult = q.validate();
        if (validationResult) {
          throw new Error(`Invalid query: ${validationResult.message}`);
        }
        
        const txn = await this.collection.db.datastore.newTransactionExtended(true);
        
        try {
          // 创建迭代器
          const iter = await this.newIterator(txn, this.collection.baseKey(), q);
          
          try {
            // 获取公钥
            const pk = await this.token?.pubKey();
  
            
            // 存储结果
            const values: MarshaledResult[] = [];
            
            // 跟踪返回的实际值数量（考虑到读取过滤器和查询中的任何索引）
            let count = 0;
            
            // 迭代所有结果
            while (true) {
              const result = await iter.next();
              if (!result || !result.done === false) {
                break;
              }
              
              // 应用读取过滤器
              let filteredValue: Uint8Array | null = null;
              try {
                filteredValue = await this.collection.filterRead(pk, result.value);
              } catch (err) {
                throw new Error(`Filter read error: ${err instanceof Error ? err.message : String(err)}`);
              }
              
              if (filteredValue) {
                // 只计算未被读取过滤器过滤掉的有效值
                count++;
                
                if (count > q.skip) {
                  // 解析JSON以便之后排序
                  let parsedValue;
                  try {
                    parsedValue = JSON.parse(new TextDecoder().decode(filteredValue));
                  } catch (err) {
                    console.warn("Failed to parse JSON for sorting:", err);
                    parsedValue = {};
                  }
                  
                  values.push({
                    instanceID: result.instanceID,
                    key: result.key,
                    value: filteredValue,
                    marshaledValue: parsedValue
                  });
                }
              }
              
              // 如果达到限制，则停止
              if (q.limit > 0 && values.length === q.limit) {
                break;
              }
            }
            
            // 如果需要排序且不是按ID排序
            if (q.sort.fieldPath && q.sort.fieldPath !== idFieldName) {
              let wrongField = false;
              let cantCompare = false;
              
              // 对结果进行排序
              values.sort((a, b) => {
                // 获取排序字段的值
                const fieldA = traverseFieldPathMap(a.marshaledValue || {}, q!.sort.fieldPath);
                const fieldB = traverseFieldPathMap(b.marshaledValue || {}, q!.sort.fieldPath);
                
                // 处理缺少值的情况
                if (fieldA === undefined || fieldB === undefined) {
                  wrongField = true;
                  
                  // 使null值排在最前或最后
                  if (fieldA === undefined && fieldB === undefined) return 0;
                  return fieldA === undefined ? -1 : 1;
                }
                
                try {
                  // 比较两个字段值
                  let result = compare(fieldA, fieldB);
                  
                  // 如果是降序，则反转比较结果
                  if (q!.sort.desc) {
                    result *= -1;
                  }
                  
                  return result;
                } catch (err) {
                  cantCompare = true;
                  return 0;
                }
              });
              
              // 处理排序错误
              if (wrongField) {
                throw ErrInvalidSortingField;
              }
              
              if (cantCompare) {
                throw new Error("Can't compare while sorting");
              }
            }
            
            // 提取最终结果
            const results = values.map(v => v.marshaledValue);
            return results;
            
          } finally {
            // 清理迭代器资源
            if (iter && typeof iter.close === 'function') {
              await iter.close();
            }
          }
        } finally {
          // 确保丢弃事务
          await txn.discard();
        }
      } catch (err) {
        throw new Error(`Find operation failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    
    /**
     * 创建一个适合查询的迭代器
     */
    private async newIterator(txn: any, baseKey: Key, q: Query): Promise<any> {
      // 这里实现迭代器创建逻辑
      // 注意: 这是一个占位符，具体实现取决于你的数据存储实现
      
      // 示例实现:
      const queryOptions: any = {
        prefix: baseKey.toString()
      };
      
      // 如果有ID索引，使用索引查询
      if (q.index) {
        queryOptions.index = q.index;
      }
      
      // 如果需要查找特定ID
      if (q.seek) {
        queryOptions.start = baseKey.child(new Key(q.seek)).toString();
      }
      
      // 创建底层查询
      const results = await txn.query(queryOptions);
      
      // 返回一个支持 next() 和 close() 的迭代器
      return {
        async next() {
          const result = await results.next();
          if (result.done) {
            return { done: true };
          }
          
          // 检查是否匹配查询条件
          if (result.value && q && result.value.value) {
            try {
              const decodedValue = JSON.parse(new TextDecoder().decode(result.value.value));
              if (!q.match(decodedValue)) {
                // 不匹配，跳过这个结果
                return this.next();
              }
            } catch (err) {
              console.warn("Error parsing JSON in query:", err);
            }
          }
          
          return {
            done: false,
            key: result.value.key,
            instanceID: new Key(result.value.key).name(),
            value: result.value.value
          };
        },
        
        async close() {
          // 关闭底层资源
          if (results && typeof results.return === 'function') {
            await results.return();
          }
        }
      };
    }

  /**
 * Get instances modified since a specific time
 * 
 * The _mod field tracks modified instances, but not those that have been deleted, so we need
 * to query the dispatcher for all (unique) instances in this collection that have been modified
 * at all since `time`.
 */
async modifiedSince(time: number): Promise<InstanceID[]> {
  // Create a read-only transaction
  const txn = await this.collection.db.datastore.newTransactionExtended(true);
  try {
    const collectionFilter: QueryFilter = (item: any) => {
      const keyString = item.key.toString();
      const key = new Key(keyString);
      return key.type() === this.collection.name;
    };
    
    // Convert time to string for key operations
    const timestr = time.toString();
    // Create the query
    const res = txn.queryExtended({
      prefix: dsDispatcherPrefix.toString(),
      filters: [collectionFilter],
      seekPrefix: dsDispatcherPrefix.child(new Key(timestr)).toString()
    });
    
    // Create a set to store unique instance IDs
    const instanceIdSet = new Set<InstanceID>();
    
    // Process query results
    for await (const entry of res) {
      const id = new Key(entry.key).name();
      instanceIdSet.add(id as InstanceID);
    }
    
    // Convert set to array
    return Array.from(instanceIdSet);
  } finally {
    // Make sure to discard the transaction
     txn.discard();
  }
}
  /**
   * Commit the transaction
   */
  async commit(): Promise<void> {
    const { events, node } = await this.createEvents(this.actions);
    if (!node) {
      return;
    }
    
    try {
      await this.collection.db.connector.createNetRecord(node, this.token);
      await this.collection.db.dispatcher.dispatch(events);
      await this.collection.db.notifyTxnEvents(node, this.token);
      this.committed = true;
    } catch (err) {
      throw new Error(`Commit failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Discard the transaction
   */
  discard(): void {
    this.discarded = true;
  }

  /**
   * Refresh collection reference
   */
  refreshCollection(): void {
    const c = this.collection.db.collections.get(this.collection.name);
    if (!c) {
      throw ErrCollectionNotFound;
    }
    this.collection = c as Collection;
  }

  /**
   * Create events from actions
   */
  private async createEvents(actions: Action[]): Promise<{ events: Event[], node: IPLDNode | null }> {
    if (this.discarded || this.committed) {
      throw errAlreadyDiscardedCommitedTxn;
    }
    
    try {
      const [events, nodeData] = await this.collection.db.eventcodec.create(actions);
      
      if (events.length === 0 && !nodeData) {
        return { events: [], node: null };
      }
      
      if (events.length === 0 || !nodeData) {
        throw new Error("Created events and node must both be nil or not-nil");
      }
      
      const node = await  cbornode.wrapObject(nodeData);
      if (!node) {
        throw new Error('Failed to wrap node data');
      }
      
      return { events, node };
    } catch (err) {
      throw new Error(`Error creating events: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/**
 * Create a new collection
 */
export async function newCollection(db: IDB, config: ICollectionConfig): Promise<Collection> {
  // Validate name
  if (config.name && !nameRx.test(config.name)) {
    throw ErrInvalidName;
  }
  
  // Validate schema
  const idType = getSchemaTypeAtPath(config.schema, idFieldName);
  if (!idType || idType.type !== 'string') {
    throw ErrInvalidCollectionSchema;
  }
  
  // Create collection
  return new Collection(
    config.name,
    config.schema,
    db,
    config.writeValidator,
    config.readFilter
  );
}

// Helper functions

/**
 * Get schema type at a path
 */
function getSchemaTypeAtPath(schema: any, path: string): { type: string } | null {
  const parts = path.split('.');
  let current = schema;
  
  for (const part of parts) {
    const props = getSchemaTypeProperties(current, schema.definitions);
    current = props[part];
    
    if (!current) {
      throw ErrInvalidCollectionSchemaPath;
    }
  }
  
  return current;
}

/**
 * Get schema type properties
 */
function getSchemaTypeProperties(schema: any, definitions: any): Record<string, any> {
  if (!schema) {
    return {};
  }
  
  let properties = schema.properties || {};
  
  if (schema.$ref) {
    const parts = schema.$ref.split('/');
    if (parts.length > 0) {
      const defName = parts[parts.length - 1];
      const def = definitions?.[defName];
      
      if (def) {
        properties = def.properties || {};
      }
    }
  }
  
  return properties;
}

/**
 * Extract instance ID from data
 */
async function getInstanceID(data: Uint8Array): Promise<InstanceID> {
  try {
    const instance = JSON.parse(new TextDecoder().decode(data));
    
    if (!instance._id) {
      return EmptyInstanceID;
    }
    
    return instance._id;
  } catch (err) {
    throw new Error(`Error getting instance ID: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Set a new instance ID
 */
function setNewInstanceID(data: Uint8Array): { id: InstanceID, data: Uint8Array } {
  const id = NewInstanceID();
  
  try {
    const instance = JSON.parse(new TextDecoder().decode(data));
    instance._id = id;
    
    return {
      id,
      data: new TextEncoder().encode(JSON.stringify(instance))
    };
  } catch (err) {
    throw new Error(`Error setting instance ID: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Set modified timestamp
 */
function setModifiedTag(data: Uint8Array): { time: bigint, data: Uint8Array } {
  const time = BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1000000));
  
  try {
    const instance = JSON.parse(new TextDecoder().decode(data));
    instance._mod = time;
    
    return {
      time,
      data: new TextEncoder().encode(JSON.stringify(instance))
    };
  } catch (err) {
    throw new Error(`Error setting modified tag: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Parse JSON from bytes
 */
function parseJSON(data: Uint8Array): any {
  return JSON.parse(new TextDecoder().decode(data));
}

/**
 * 迭代器类用于查询结果的迭代
 */
class Iterator {
  nextKeys: () => Promise<Key[]>;
  txn: any;
  query: Query;
  keyCache: Key[] = [];
  iter: any;
  
  constructor(txn: any, query: Query) {
    this.txn = txn;
    this.query = query;
    this.nextKeys = async () => { return []; };
  }
  
  /**
   * 返回下一个符合迭代器条件的键值对
   * 如果有错误，ok 为 false，result.error 将返回错误
   */
  async nextSync(): Promise<{ result: any, marshaledValue?: any } | null> {
    if (this.query.index === "") {
      const value: any = {
        result: {
          entry: {},
          error: null
        }
      };
      let ok = false;
      
      for await (const res of this.iter.next()) {
        try {
          const val = JSON.parse(new TextDecoder().decode(res.value));
          ok = this.query.match(val);
          
          if (value.result.error) {
            break;
          }
          
          if (ok) {
            return {
              result: res,
              marshaledValue: val
            };
          }
        } catch (error) {
          value.result.error = error;
          break;
        }
      }
      
      return ok ? value : null;
    }
    
    if (this.keyCache.length === 0) {
      try {
        const newKeys = await this.nextKeys();
        
        if (newKeys.length === 0) {
          return {
            result: {
              entry: {},
              error: null
            }
          };
        }
        
        this.keyCache = [...this.keyCache, ...newKeys];
      } catch (error) {
        return {
          result: {
            entry: {},
            error: error
          }
        };
      }
    }
    
    const key = this.keyCache[0];
    this.keyCache = this.keyCache.slice(1);
    
    try {
      const value = await this.txn.get(key);
      
      return {
        result: {
          entry: {
            key: key.toString(),
            value: value
          },
          error: null
        }
      };
    } catch (error) {
      return {
        result: {
          entry: {},
          error: error
        }
      };
    }
  }
  
  /**
   * 关闭迭代器并释放资源
   */
  async close(): Promise<void> {
    if (this.iter && typeof this.iter.close === 'function') {
      await this.iter.close();
    }
  }
}

/**
 * 创建新的迭代器
 */
async function newIterator(txn: any, baseKey: Key, q: Query): Promise<Iterator> {
  const i = new Iterator(txn, q);
  
  let prefix: Key;
  if (!q.index) {
    prefix = baseKey;
  } else {
    prefix = indexPrefix.child(baseKey).child(new Key(q.index));
  }
  
  const dsq: any = {
    query: {
      prefix: prefix.toString(),
      // 由于 readFilters 的存在，我们事先不知道需要跳过/限制多少，
      // 所以这里不使用 Skip 和 Limit
      // limit: q.limit,
      // offset: q.skip,
    }
  };
  
  if (q.sort.fieldPath === idFieldName) {
    if (q.sort.desc) {
      dsq.orders = [{ orderByKeyDescending: true }];
    } else {
      dsq.orders = [{ orderByKey: true }];
    }
  }
  
  if (q.seek) {
    dsq.seekPrefix = prefix.child(new Key(q.seek)).toString();
  }
  
  try {
    const iter = await txn.queryExtended(dsq);
    i.iter = iter;
    
    // 未指定键字段或索引，通过基本的"迭代器"传递
    if (!q.index) {
      i.nextKeys = async () => {
        return [];
      };
      return i;
    }
    
    // 索引字段，从索引获取键
    let first = true;
    i.nextKeys = async () => {
      const nKeys: Key[] = [];
      
      while (nKeys.length < iteratorKeyMinCacheSize) {
        const result = await i.iter.nextSync();
        if (!result) {
          if (first) {
            throw ErrIndexNotFound;
          }
          return nKeys;
        }
        
        first = false;
        // result.key 包含索引值，先在这里提取
        const key = new Key(result.result.entry.key);
        const base = prefix.name();
        const name = key.name();
        
        let val: any = name;
        if (isValidJSON(name)) {
          const parsed = JSON.parse(name);
          val = parsed !== null ? parsed : name;
        } else {
          val = name;
        }
        
        try {
          // 使用 JSON 构建文档
          const doc = JSON.stringify({ [base]: val });
          const value = JSON.parse(doc);
          
          // 匹配查询
          const ok = q.match(value);
          
          if (ok) {
            // 解码索引值
            const indexValue = decodeKeyList(result.result.entry.value);
            
            for (const v of indexValue) {
              nKeys.push(new Key(new TextDecoder().decode(v)));
            }
          }
        } catch (err) {
          // 为了让业务逻辑正常进行，这里不报告错误，而是跳过
          continue;
        }
      }
      
      return nKeys;
    };
    
    return i;
  } catch (error) {
    throw error;
  }
}

/**
 * 辅助函数：检查字符串是否是有效的 JSON
 */
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 辅助函数：解码键列表
 */
function decodeKeyList(data?: Uint8Array): Uint8Array[] {
  if (!data) return [];
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    return [];
  }
}