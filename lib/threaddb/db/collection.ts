import { Key } from 'interface-datastore';
import  {JSONSchemaType} from 'ajv';
import Ajv from 'ajv';
import { nanoid } from 'nanoid';
import EventEmitter from 'eventemitter3';

import { TxnDatastoreExtended, Transaction } from '../core/db';
import { Ed25519PrivKey  as PrivKey,Ed25519PubKey as PubKey} from "../../dc-key/ed25519";
import { Action, ActionType, Event } from '../core/db';
import { ThreadID } from '@textile/threads-id';
import { EventCodec } from '../core/db';
import { DAGNode } from 'ipld-dag-pb';
import { CollectionConfig } from '../core/core';
import {dsPrefix} from '../core/db';
import {ThreadToken} from '../core/identity';


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
const idFieldName = "_id";
const modFieldName = "_mod";
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
 * Transaction options
 */
export interface TxnOption {
  token?: ThreadToken;
}

/**
 * Interface for query filters
 */
export interface QueryFilter {
  filter(entry: { key: string, value: Uint8Array }): boolean;
}

/**
 * Filter implementation
 */
class TimeFilter implements QueryFilter {
  constructor(
    private collection: string,
    private time: number
  ) {}

  filter(entry: { key: string, value: Uint8Array }): boolean {
    // Get key and extract information
    const key = new Key(entry.key);
    const baseNamespace = key.parent().baseNamespace();
    const number = parseInt(baseNamespace, 10) || 0;
    const kind = key.type();
    
    return kind === this.collection && number > this.time;
  }
}

/**
 * Query interface for finding instances
 */
export class Query {
  constructor(
    public readonly gte?: string,
    public readonly lt?: string,
    public readonly prefix?: string,
    public readonly filters?: QueryFilter[],
    public readonly orders?: string[],
    public readonly limit?: number,
    public readonly offset?: number
  ) {}
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
  createNetRecord(node: DAGNode, token: ThreadToken): Promise<any>;
}

/**
 * DB interface required by Collection
 */
interface DB {
  datastore: TxnDatastoreExtended;
  collections: Map<string, Collection>;
  connector: Connector;
  eventcodec: EventCodec;
  dispatcher: {
    dispatch(events: Event[]): Promise<void>;
  };
  readTxn(collection: Collection, fn: (txn: Txn) => Promise<void> | void, ...opts: TxnOption[]): Promise<void>;
  writeTxn(collection: Collection, fn: (txn: Txn) => Promise<void> | void, ...opts: TxnOption[]): Promise<void>;
  notifyTxnEvents(node: DAGNode, token: ThreadToken): Promise<void>;
}

/**
 * Collection class - a group of instances sharing a schema
 */
export class Collection  {
  private schemaValidator: Ajv;
  private vm: JSRuntime;
  private writeValidator: ((writer: any, event: any, instance: any) => boolean) | null = null;
  public readFilter: ((reader: any, instance: any) => any) | null = null;
  public indexes: Map<string, Index> = new Map();
  
  constructor(
    public readonly name: string,
    public schema: JSONSchemaType<any>,
    public db: DB,
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
  async readTxn(fn: (txn: Txn) => Promise<void> | void, ...opts: TxnOption[]): Promise<void> {
    return this.db.readTxn(this, fn, ...opts);
  }

  /**
   * Create a write transaction
   */
  async writeTxn(fn: (txn: Txn) => Promise<void> | void, ...opts: TxnOption[]): Promise<void> {
    return this.db.writeTxn(this, fn, ...opts);
  }

  /**
   * Find instance by ID
   */
  async findByID(id: InstanceID, ...opts: TxnOption[]): Promise<Uint8Array> {
    let instance: Uint8Array | null = null;
    
    await this.readTxn(async (txn) => {
      instance = await txn.findByID(id);
    }, ...opts);
    
    return instance!;
  }

  /**
   * Create a new instance
   */
  async create(v: Uint8Array, ...opts: TxnOption[]): Promise<InstanceID> {
    let id: InstanceID = '';
    
    await this.writeTxn(async (txn) => {
      const ids = await txn.create(v);
      if (ids.length > 0) {
        id = ids[0];
      }
    }, ...opts);
    
    return id;
  }

  /**
   * Create multiple instances
   */
  async createMany(vs: Uint8Array[], ...opts: TxnOption[]): Promise<InstanceID[]> {
    let ids: InstanceID[] = [];
    
    await this.writeTxn(async (txn) => {
      ids = await txn.create(...vs);
    }, ...opts);
    
    return ids;
  }

  /**
   * Delete an instance by ID
   */
  async delete(id: InstanceID, ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.delete(id);
    }, ...opts);
  }

  /**
   * Delete multiple instances by ID
   */
  async deleteMany(ids: InstanceID[], ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.delete(...ids);
    }, ...opts);
  }

  /**
   * Save changes to an instance
   */
  async save(v: Uint8Array, ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.save(v);
    }, ...opts);
  }

  /**
   * Save changes to multiple instances
   */
  async saveMany(vs: Uint8Array[], ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.save(...vs);
    }, ...opts);
  }

  /**
   * Verify changes to an instance
   */
  async verify(v: Uint8Array, ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.verify(v);
    }, ...opts);
  }

  /**
   * Verify changes to multiple instances
   */
  async verifyMany(vs: Uint8Array[], ...opts: TxnOption[]): Promise<void> {
    await this.writeTxn(async (txn) => {
      await txn.verify(...vs);
    }, ...opts);
  }

  /**
   * Check if an instance exists
   */
  async has(id: InstanceID, ...opts: TxnOption[]): Promise<boolean> {
    let exists = false;
    
    await this.readTxn(async (txn) => {
      exists = await txn.has(id);
    }, ...opts);
    
    return exists;
  }

  /**
   * Check if multiple instances exist
   */
  async hasMany(ids: InstanceID[], ...opts: TxnOption[]): Promise<boolean> {
    let exists = false;
    
    await this.readTxn(async (txn) => {
      exists = await txn.has(...ids);
    }, ...opts);
    
    return exists;
  }

  /**
   * Find instances matching a query
   */
  async find(q: Query, ...opts: TxnOption[]): Promise<Uint8Array[]> {
    let instances: Uint8Array[] = [];
    
    await this.readTxn(async (txn) => {
      instances = await txn.find(q);
    }, ...opts);
    
    return instances;
  }

  /**
   * Get instances modified since a specific time
   */
  async modifiedSince(time: number, ...opts: TxnOption[]): Promise<InstanceID[]> {
    let ids: InstanceID[] = [];
    
    await this.readTxn(async (txn) => {
      ids = await txn.modifiedSince(time);
    }, ...opts);
    
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
  async filterRead(identity: PubKey, instance: Uint8Array): Promise<Uint8Array | null> {
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
}

/**
 * Transaction class for collections
 */
export class Txn {
  private actions: Action[] = [];
  private discarded = false;
  private committed = false;
  
  constructor(
    private collection: Collection,
    private token: ThreadToken,
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
          type: ActionType.Create,
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
      const identity = await this.token.pubKey();
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
      const identity = await this.token.pubKey();
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
        type: ActionType.Save,
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
        type: ActionType.Delete,
        instanceID: ids[i],
        collectionName: this.collection.name
      });
    }
  }

  /**
   * Check if instances exist
   */
  async has(...ids: InstanceID[]): Promise<boolean> {
    const validationResult = await this.collection.db.connector.validate(this.token, true);
    if (validationResult) {
      throw validationResult;
    }
    
    const pk = await this.token.pubKey();
	if (!pk) {
	  throw new Error('Identity not found');
	}
    
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
  async findByID(id: InstanceID): Promise<Uint8Array> {
    const validationResult = await this.collection.db.connector.validate(this.token, true);
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
    
    const pk = await this.token.pubKey();
	if (!pk) {
		throw new Error('Identity not found');
	}	
    const filtered = await this.collection.filterRead(pk, bytes);
    
    if (!filtered) {
      throw ErrInstanceNotFound;
    }
    
    return filtered;
  }

  /**
   * Find instances matching a query
   */
  async find(q: Query): Promise<Uint8Array[]> {
    // Implement query handling logic here
    // This is a placeholder - actual implementation would depend on your datastore
    return [];
  }

  /**
   * Get instances modified since a specific time
   */
  async modifiedSince(time: number): Promise<InstanceID[]> {
    // Implementation depends on datastore capabilities
    // This is a placeholder
    return [];
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
    this.collection = c;
  }

  /**
   * Create events from actions
   */
  private async createEvents(actions: Action[]): Promise<{ events: Event[], node: DAGNode | null }> {
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
      
      // Create DAGNode (simplified - in a real implementation, you'd create a proper DAGNode)
      const node = { Data: nodeData } as DAGNode;
      
      return { events, node };
    } catch (err) {
      throw new Error(`Error creating events: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/**
 * Create a new collection
 */
export async function newCollection(db: DB, config: CollectionConfig): Promise<Collection> {
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
function setModifiedTag(data: Uint8Array): { time: number, data: Uint8Array } {
  const time = Date.now() * 1000000; // Convert to microseconds
  
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