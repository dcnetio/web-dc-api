import { PeerId } from '@libp2p/interface';  
import { multiaddr, Multiaddr as TMultiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { peerIdFromPrivateKey, peerIdFromString } from "@libp2p/peer-id";
import { Key } from 'interface-datastore';
import { DB as ThreadDb } from './db/db';
import { Errors, Transaction } from './core/db';
import { Net } from './core/app';
import { ChainUtil } from "../../common/chain";
import { Ed25519PrivKey } from "../../common/dc-key/ed25519";
import type { Connection }  from '@libp2p/interface'
import { keys } from "@libp2p/crypto";
import { SymmetricKey, Key as ThreadKey } from './common/key';
import { extractPeerIdFromMultiaddr } from "../../common/dc-key/keyManager";
import {IDBInfo, ThreadMuliaddr} from './core/core'

import {StoreunitInfo} from '../../common/chain';
import { PrefixTransform,TransformedDatastore} from './common/transformed-datastore' 
import {NewOptions,ICollectionConfig,ManagedOptions,ThreadInfo,Context} from './core/core';
import {TxnDatastoreExtended,pullThreadBackgroundTimeout,PullTimeout} from './core/db';
import type { DCConnectInfo } from "../../common/types/types";
import {  uint32ToLittleEndianBytes,uint64ToLittleEndianBytes } from "../../util/utils";
import {DcUtil} from '../../common/dcutil';
import {Type} from '../../common/constants';
import { NewThreadOptions } from './core/options';
import {ThreadToken} from './core/identity';
import { DBGrpcClient } from "./net/grpcClient";
import type { Client } from "../../common/dcapi";
import { jsonStringify } from '../../util/utils';
import {Protocol} from './net/define';
import {parseJsonToQuery} from './db/json2Query';
import * as buffer from "buffer/";
import { dial_timeout } from '../../common/define';
import multibase, {decode as multibaseDecode} from 'multibase';
import {net as net_pb} from "./pb/net_pb";
import { LineReader } from './common/lineReader';
import { FileManager } from '../file/manager';
import {newIterator} from './db/collection';
import { Query } from './db/query';
import { DCContext } from '../../interfaces';
const { Buffer } = buffer; 

export const ThreadProtocol = "/dc/" + Protocol.name + "/" + Protocol.version


// 常量  
export const MaxLoadConcurrency = 100;  
export const dsManagerBaseKey = new Key('/manager');  




function newGrpcClient(client: Client,net:Net): DBGrpcClient {
    if (client.p2pNode == null || client.p2pNode.peerId == null) {
        throw new Error("p2pNode is null or node privateKey is null");
    }        
    const grpcClient = new DBGrpcClient(
        client.p2pNode,
        client.peerAddr,
        client.token,
        net,
        client.protocol
        );
    return  grpcClient
}



// 管理器类  
export class DBManager {  
    private store: TxnDatastoreExtended;   
    private network: Net;  
    private dc:    DcUtil;
    private connectedDc:DCConnectInfo;
    private opts: NewOptions;  
    private dbs: Map<string, ThreadDb>;  
    private lock: AsyncLock;  
    public  chainUtil: ChainUtil;
    private storagePrefix: string;
    private context: DCContext;

     constructor(  
        store: TxnDatastoreExtended,  //实际上是一个LevelDatastore实例,用levelDatastoreAdapter包装
        network: Net,  
        dc: DcUtil,
        connectedDc:DCConnectInfo,
        opts: NewOptions = {} ,
        chainUtil: ChainUtil,
        storagePrefix: string,
        context: DCContext
    ) {  

        this.store = store;  
        this.network = network; 
        this.dc = dc;
        this.storagePrefix = storagePrefix; 
        this.opts = opts;  
        this.dbs = new Map();  
        this.lock = new AsyncLock();  
        this.chainUtil = chainUtil;
        this.connectedDc = connectedDc;
        this.context = context
    }  
    async loadDbs():Promise<void>{ 
      // Query for existing databases
      console.log("manager: loading dbs");
      try {
        const q = { prefix: dsManagerBaseKey.toString(), keysOnly: true };
        const results = this.store.query(q);
        // Create a map to track loaded databases and prevent duplicates
        const loaded = new Map<string, boolean>();
        // Process each result
        for await (const result of results) {
            try {
              // Parse the key to extract thread ID
              const parts = result.key.toString().split('/');
              if (parts.length < 3) {
                continue;
              }
              const id = ThreadID.fromString(parts[2]);
              // Check if already loaded
              if (loaded.has(id.toString())) {
                continue;
              }
              // Mark as loaded
              loaded.set(id.toString(), true)
              // Wrap and create database
              const [store, opts, err] = await this.wrapDB(
                this.store,
                id,
                this.opts,
                "",
                []
              );
              
              if (err) {
                continue;
              }
              const db = await ThreadDb.newDB(store, this.network, id, opts);
              // Add to map of databases
              this.dbs.set(id.toString(), db);
            } catch (err) {
              console.error(`Error loading database: ${err instanceof Error ? err.message : String(err)}`);
            } 
        }
      }catch (err) {
        console.error(`Failed to load databases: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
      }
    }
  

     /**  
     * Gets the log key for a thread. If it doesn't exist, creates a new one.  
     * @param tid Thread ID  
     * @returns Promise resolving to the private key  
     * @throws Error if key operations fail  
     */  
    async getLogKey(tid: ThreadID): Promise<Ed25519PrivKey> {  
        const storageKey = `${this.storagePrefix}_${tid.toString()}_logkey`;  
        
        try {  
            // Try to get existing key from localStorage  
            const storedBytes = await this.store.get(new Key(storageKey));
            if (storedBytes) {  
                const key = Ed25519PrivKey.fromString(Buffer.from(storedBytes).toString('hex'));
                return key;
            } else {  
                // Create new key if none exists  
                const  key = await this.newLogKey();  
                this.store.put(new Key(storageKey), Buffer.from(key.raw));
                return key;  
            }  
        } catch (err : any) {  
            if (err.code === 'ERR_NOT_FOUND') {  
                // Create new key if none exists  
                const key = await this.newLogKey();  
                this.store.put(new Key(storageKey), Buffer.from(key.raw));
                return key;  
            }
            throw new Error(`Failed to get/create log key: ${err}`);  
        }  
    }


    
     /**  
     * Creates a new log key  
     * @private  
     */  
     private async newLogKey(): Promise<Ed25519PrivKey> {  
        try {  
            //生成临时ed25519公私钥对
            const keyPair = await keys.generateKeyPair("Ed25519");
            // 获取私钥
            const privateKey =  new Ed25519PrivKey(keyPair.raw)
            return  privateKey;  
        } catch (err) {  
            throw new Error(`Failed to generate log key: ${err}`);  
        }  
    }  

 // 新增静态方法  
  /**  
   * FromAddr returns ID from a multiaddress if present.  
   * @param addr Multiaddr instance  
   * @returns ID instance  
   */  
  static fromAddr(addr: TMultiaddr): ThreadID {  
    try {  
      // 获取协议值  
      const parts = addr.toString().split('/')  
      const index = parts.indexOf(Protocol.name)  
      if (index === -1 || index === parts.length - 1) {  
        throw new Error('thread protocol not found in multiaddr')  
      }  
      
      const idstr = parts[index + 1]  
      return ThreadID.fromString(idstr)  
    } catch (err:any) {  
     
      throw new Error(`Failed to extract ID from multiaddr: ${err.message}`)  
    }  
  }  

  /**  
   * ToAddr returns ID wrapped as a multiaddress.  
   * @returns Multiaddr instance  
   */  
  toAddr(): TMultiaddr {  
    try {  
      const addr = multiaddr(`/${Protocol.name}/${this.toString()}`)  
      return addr  
    } catch (err:any) {  
      // This should not happen with valid IDs  
      throw new Error(`Failed to create multiaddr: ${err.message}`)  
    }  
  }  

    async newDBFromAddr(  
        addr: ThreadMuliaddr,  
        key: ThreadKey,  
        opts: NewOptions = {}  
    ): Promise<ThreadDb> {  
        const id =  addr.id;  
        
        return await this.lock.acquire('dbs', async () => {  
         
            if (this.dbs.has(id.toString())) {  
          
                throw Errors.ErrDBExists;  
            }  

            if (opts.name && !isValidName(opts.name)) {  
                throw Errors.ErrInvalidName;  
            }  

            if (key.defined() && !key.canRead()) {  
                throw Errors.ErrThreadReadKeyRequired;  
            }  
       
            await this.network.addThread(addr, {
                token: opts.token ,
                logKey: opts.logKey,  
                threadKey:key,  
            });  
    
            const collections = opts.collections || [];
            const name = opts.name || '';

            const [store, dbOpts, err] = await this.wrapDB(this.store,id, this.opts,name, collections); 
            if (err) {  
                throw new Error(`wrapping db: ${err.message}`);  
            } 
            const db = await ThreadDb.newDB(store, this.network, id, dbOpts);  
     
            this.dbs.set(id.toString(), db);  
            
            if (opts.block) {  
                await this.network.pullThread(id,pullThreadBackgroundTimeout, { token: opts.token });  
            } else {  
                // Background pull  
                this.pullThreadBackground(id, opts.token);  
            }  
            return db;  
        });  
    }  

    private async pullThreadBackground(id: ThreadID, token?: ThreadToken) {  
        try {   
            await this.network.pullThread( id,pullThreadBackgroundTimeout, { token: token });  
        } catch (err) {  
            console.error(`Error pulling thread ${id}:`, err);  
        }  
    }  



/**
 * Preloads a database from DC network to local
 * Generally happens when a new device first logs in to sync previously created databases
 * 
 * @param threadid Thread ID string
 * @param fid Content ID string of the file to preload
 * @param dbname Database name
 * @param dbAddr Database address string
 * @param b32Rk Base32-encoded read key
 * @param b32Sk Base32-encoded secret key
 * @param block Whether to block until syncing is complete
 * @param jsonCollections JSON string of collection configurations
 * @returns Promise that resolves when preloading is complete
 */
async preloadDBFromDC(
    threadid: string,
    fid: string,
    dbname: string,
    dbAddr: string,
    b32Rk: string,
    b32Sk: string,
    block: boolean,
    jsonCollections: string
  ): Promise<void> {
    console.debug(`manager: preloading DB from DC ${threadid}`);
  
    // Check if DBManager exists
    if (!this) {
      throw Errors.ErrNoDbManager;
    }
  
    // Decode thread ID
    let tID: ThreadID;
    try {
      tID = await this.decodeThreadId(threadid);
    } catch (err) {
      throw err;
    }
  
    // Get log key
    let logKey: Ed25519PrivKey;
    try {
      logKey = await this.getLogKey(tID);
    } catch (err) {
      throw err;
    }
  
    // Create peer ID from log key
    let lid: PeerId;
    try {
      lid = peerIdFromPrivateKey(logKey);
    } catch (err) {
      throw err;
    }
  
    // Begin connection in background
    await this.dc._connectToObjNodes(tID.toString()).catch(err => 
      console.error(`Error connecting to object nodes: ${err.message}`)
    );
    const ctx = createContext(30000);
    try {
      await this.addLogToThreadStart(ctx, tID, lid);
    } catch (err:any) {
      console.warn(`Warning: could not add log to thread: ${err.message}`);
    }
  
    // Generate thread key
    let threadKey: ThreadKey;
    try {
      const sk = SymmetricKey.fromString(b32Sk);
      const rk = SymmetricKey.fromString(b32Rk);
      threadKey = new ThreadKey(sk, rk);
    } catch (err) {
      throw err;
    }
  
    let connectedPeerId: PeerId | undefined;
    let multiAddr: TMultiaddr | undefined;
    
    // Try to connect using provided dbAddr
    let connectedFlag = false;
    if (dbAddr.length > 10) {
      try {
        // Try to parse address info and connect
        const peerAddrInfo = multiaddr(dbAddr);
        
        try {
          const conn = await this.dc.dcNodeClient?.libp2p.dial(peerAddrInfo, {
            signal: AbortSignal.timeout(3000)
          });
          
          if (conn) {
            connectedFlag = true;
            multiAddr = multiaddr(dbAddr);
          }
        } catch (err) {
          // Connection failed
        }
      } catch (err) {
        // Invalid address
      }
    }
  
    // If direct connection failed, connect through object nodes
    if (!connectedFlag) {
      try {
        const [connectedAddr, peers] = await this.dc?._connectToObjNodes(tID.toString());
        if (!connectedAddr && peers) {
          // 有peers但是没有connectedAddr
          throw Errors.ErrNoThreadOnDc;
        }
        
        const conns = this.dc.dcNodeClient?.libp2p.getConnections(connectedPeerId);
        if (!conns || conns.length == 0) {
            throw Errors.ErrNoThreadOnDc;
        } 
      } catch (err) {
        throw err;
      }
    } else {
      // Start connection in background
      this.dc._connectToObjNodes(tID.toString()).catch(err => 
        console.error(`Error connecting to object nodes: ${err.message}`)
      );
    }
  
    // Parse collection info
    let collectionInfos: ICollectionConfig[] = [];
    try {
      collectionInfos = JSON.parse(jsonCollections);
    } catch (err) {
      throw err;
    }
  
    // Create collection configurations
    const collections = collectionInfos.map(info => ({
      name: info.name,
      schema: info.schema,
      indexes: info.indexes || []
    }));
  
    // Create options for new database
    const dbOpts: NewOptions = {
      name: dbname,
      collections: collections,
      key: threadKey,
      logKey: logKey,
      block: block
    };
  
    // Delete existing database if it exists
    try {
      await this.deleteDB(tID, true);
    } catch (err) {
      // Ignore specific errors
      if (err !== Errors.ErrDBNotFound && err !== Errors.ErrThreadNotFound) {
        throw err;
      }
    }
    if (this.dc.dcNodeClient == null) {
      throw Errors.ErrNoDcNodeClient;
    }
    // Create context with extended timeout for file download
    const tctx = createContext(PullTimeout * 30);
     const fileManager = new FileManager(
            this.dc,
            this.connectedDc,
            this.chainUtil,
            this.dc.dcNodeClient,
            this.context
          );
    const fileStream = await fileManager.createSeekableFileStream(fid, "");
  
    if (fileStream == null) {
      throw Errors.ErrFileNotFound;
    }
 
    // Preload database from reader
    const threadMultiaddr = new ThreadMuliaddr(multiAddr!, tID);
    await this.preloadDBFromReader(tctx, fileStream.createReadableStream(), threadMultiaddr, threadKey, dbOpts);
  }



/**
 * 从读取器预加载数据库
 * @param ctx 上下文
 * @param ioReader 数据流读取器
 * @param addr 线程地址
 * @param key 线程密钥
 * @param opts 管理选项
 */
async preloadDBFromReader(
    ctx: Context,
    ioReader: ReadableStream<Uint8Array>,
    addr: ThreadMuliaddr,
    key: ThreadKey,
    opts: NewOptions = {}  
  ): Promise<void> {
    console.debug("manager: preloading db from reader");
    let id: ThreadID;
    try {
      id = DBManager.fromAddr(addr.addr);
    } catch (err) {
      throw err;
    }
    // 检查数据库是否已存在
    await this.lock.acquire('dbs', async () => {
      if (this.dbs.has(id.toString())) {
        throw Errors.ErrDBExists;
      }
    });
    if (opts.name && !isValidName(opts.name)) {
      throw Errors.ErrInvalidName;
    }
    // 验证密钥
    if (key.defined() && !key.canRead()) {
      throw Errors.ErrThreadReadKeyRequired;
    }
    // 添加线程到网络
    console.debug(`manager: adding thread to net ${id}`);
    try {
      await this.network.addThread(addr, {
        threadKey: key,
        logKey: opts.logKey,
        token: opts.token
      });
    } catch (err) {
      throw err;
    }
    console.debug(`manager: added thread to net ${id}`);
    
    // 包装数据库
    let store: TxnDatastoreExtended;
    let dbOpts: NewOptions;
    try {
      const collections = opts.collections || [];
      const name = opts.name || '';
      [store, dbOpts] = await this.wrapDB(this.store, id, this.opts, name, collections);
    } catch (err) {
      throw err;
    }
    
    // 创建新数据库
    let db: ThreadDb;
    try {
      db = await ThreadDb.newDB(store, this.network, id, dbOpts);
    } catch (err) {
      throw err;
    }
    
    // 添加数据库到管理器
    await this.lock.acquire('dbs', async () => {
      this.dbs.set(id.toString(), db);
    });
    
    // 导入数据库状态
    const readKey = key.read();
    if (!readKey) {
      throw new Error(`read key not found for thread ${id}`);
    }
    
    // 创建行读取器
    const lineReader = new LineReader(ioReader);
    const textDecoder = new TextDecoder();
    
    // 读取第一行并更新线程信息的日志头
    let stateValue = "";
    try {
      const value = await lineReader.readLine();
      if (value) {
        stateValue = value;
      }
      
    } catch (err) {
      throw err;
    }
    if (stateValue == "") {
      throw new Error(`empty state value for thread ${id}`);
    }
    // 移除头部32位hash
    stateValue = stateValue.slice(32);
    
    // 更新线程信息的日志头
    const logs = stateValue.split(';');
    const pbLogs: net_pb.pb.Log[] = [];
    
    for (const log of logs) {
      try {
        // 解码 multibase 格式
        const  data  =  multibaseDecode(log);
        // 解析 protobuf
        const pbLog = net_pb.pb.Log.decode(data);
        pbLogs.push(pbLog);
      } catch (err) {
        // 忽略错误，继续处理
        continue;
      }
    }
    
    // 预加载日志
    try {
      await this.network.preLoadLogs(id, pbLogs);
    } catch (err) {
      await this.deleteDB(id, false);
      throw err;
    }
    
    // 导入数据库状态
    try {
      await this.importDBStateFromReader(id, lineReader, readKey);
    } catch (err) {
      await this.deleteDB(id, false);
      throw err;
    }
  }

/**
 * Browser-compatible version to export DB to file
 * @param ctx Context
 * @param id ThreadID
 * @param fileName Suggested file name for download
 * @param readKey Optional encryption key
 * @returns Promise resolving to ThreadInfo
 */
async exportDBToFile(
  ctx: Context,
  id: ThreadID,
  fileName: string,
  readKey?: SymmetricKey
): Promise<ThreadInfo> {
  console.debug(`manager: exporting db ${id.toString()} to file download`);
  
  // Get thread logs similar to original function
  let logState = "";
  let logs: net_pb.pb.ILog[];
  let threadInfo: ThreadInfo;
  
  [logs, threadInfo] = await this.network.getPbLogs(id);
  
  // Build log state string
  for (let i = 0; i < logs.length; i++) {
    const logBytes = net_pb.pb.Log.encode(logs[i]).finish();
    const mbaseLog = multibase.encode('base64', logBytes);
    
    if (i === 0) {
      logState = mbaseLog.toString();
    } else {
      logState = `${logState};${mbaseLog.toString()}`;
    }
  }
  
  // Create content in memory instead of writing to file
  let content = logState + "\n";
  
  // Get database
  const db = this.dbs.get(id.toString());
  if (!db) {
    throw Errors.ErrDBNotFound;
  }
  
  // Create transaction
  const txn = await db.datastore.newTransactionExtended(true);
  
  try {
    // Similar query logic, but accumulating in memory
    const q = new Query();
    const baseKey = new Key('/');
    const i = await newIterator(txn, baseKey, q);
    
    for await (const res of i.iter.next()) {
      if (res.error) {
        throw res.error;
      }
      
      let line: string;
      if (readKey) {
        const encBytes = await readKey.encrypt(res.entry.value);
        const mValue = multibase.encode('base64', encBytes);
        line = `${res.entry.key}|${mValue.toString()}`;
      } else {
        const mValue = multibase.encode('base64', res.entry.value);
        line = `${res.entry.key}|${mValue.toString()}`;
      }
      
      content += line + "\n";
    }
    
    i.close();
    txn.discard();
    
    
    // Create blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `db-export-${id.toString().substring(0, 8)}.txt`;
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return threadInfo;
  } catch (err) {
    txn.discard();
    throw err;
  }
}





/**
 * 从读取器导入数据库状态
 * @param id 线程ID
 * @param reader 可读流读取器
 * @param readKey 用于解密的对称密钥
 */
async importDBStateFromReader(
  id: ThreadID, 
  lineReader: LineReader, 
  readKey: SymmetricKey
): Promise<void> {
  console.debug("manager: importing db state from reader");
  
  // 检查数据库是否存在
  let db: ThreadDb | undefined;
  await this.lock.acquire('dbs', async () => {
    db = this.dbs.get(id.toString());
  });
  
  if (!db) {
    throw Errors.ErrDBNotFound;
  }
  
  // 获取索引函数
  const indexFunc = db.defaultIndexFunc();
  
  // 设置行读取
  const textDecoder = new TextDecoder();
  let done = false;
  let line:string|null = ""
  while (true) {
       line = await lineReader.readLine();
      if (!line) {
       break
      }  
    // 创建事务
    let txn:Transaction;
    try {
      txn = await db.datastore.newTransactionExtended(false);
    } catch (err) {
      throw new Error(`创建事务错误: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    try {
      // 解析键值对
      const kv = line.split('|');
      if (kv.length !== 2) {
        await txn.discard();
        throw new Error('无效的记录格式');
      }
      
      const key = kv[0];
      const mValue = kv[1];
      
      // 使用multibase解码值
      let encValue: Uint8Array;
      try {
        const decoded = multibaseDecode(mValue);
        encValue = decoded;
      } catch (err) {
        await txn.discard();
        throw new Error(`multibase解码失败: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // 如有需要解密记录
      let decValue = encValue;
      if (readKey) {
        try {
          decValue = await readKey.decrypt(encValue);
        } catch (err) {
          await txn.discard();
          throw new Error(`解密值失败: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      
      // 创建数据存储键
      const setKey = new Key(key);
      
      // 检查键是否已存在
      try {
        const exists = await txn.has(setKey);
        if (exists) {
           txn.discard();
          continue; // 跳过此记录
        }
      } catch (err) {
         txn.discard();
        throw new Error(`检查键存在性失败: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // 存储值
      try {
        await txn.put(setKey, decValue);
      } catch (err) {
         txn.discard();
        throw new Error(`存储值失败: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // 从键中提取集合名称（倒数第二个部分）
      const parts = key.split('/');
      if (parts.length < 2) {
         txn.discard();
        throw new Error('无效的键格式: 未找到集合名称');
      }
      
      const collection = parts[parts.length - 2];
      
      // 应用索引
      try {
        await indexFunc(collection, setKey, txn, decValue);
      } catch (err) {
         txn.discard();
        throw new Error(`应用索引失败: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // 提交事务
      try {
        await txn.commit();
      } catch (err) {
         txn.discard();
        throw new Error(`提交事务失败: ${err instanceof Error ? err.message : String(err)}`);
      }
    } catch (err) {
      // 确保在任何失败时丢弃事务
      try {
         txn.discard();
      } catch {
        // 忽略丢弃时的错误
      }
      throw err;
    }
    }
  }



/**  
 * wrapDB 复制管理器的基本配置，  
 * 使用 ID 前缀包装数据存储，  
 * 并将指定的集合配置与基本配置合并  
 */  
async  wrapDB(  
    store: TxnDatastoreExtended,  
    id: ThreadID,  
    base: NewOptions,  
    name: string,  
    collections: ICollectionConfig[]  
  ): Promise<[TxnDatastoreExtended, NewOptions, Error | null]> {  
    const isValid = await this.validateThreadId(id.toString());  
    if (!isValid) {  
      return [null as unknown as TxnDatastoreExtended, null as unknown as NewOptions, new Error('Invalid Thread ID')];  
    }  
     // 创建前缀转换器并包装数据存储  
  const prefix = dsManagerBaseKey.child(new Key(id.toString())).toString();  
  const transform = new PrefixTransform(prefix);  
  const wrappedStore = new TransformedDatastore(store, transform); 
  
    // 创建新的选项对象  
    const opts: NewOptions = {  
      name: name,  
      collections: [...(base.collections || []), ...collections],  
      eventCodec: base.eventCodec,  
      debug: base.debug  
    };  
  
    return [wrappedStore, opts, null];  
  }  

async listDBs(): Promise<Map<ThreadID, ThreadDb>> {  
    const dbs = new Map();  
    await this.lock.acquire('dbs', async () => {  
        for (const [idStr, db] of this.dbs) {  
            const id = ThreadID.fromString(idStr);  
            await this.network.getThread(id);  
            dbs.set(id, db);  
        }  
    });  
    return dbs;  
}  

    
async ifSyncDBToDCSuccess(tId: string): Promise<boolean> {  
    try {  
        const [storeUnit,err] = await this.chainUtil.objectState(tId);  
        if (!storeUnit || err) return false;  

        return new Promise((resolve) => {  
            const timeout = setTimeout(() => resolve(false), PullTimeout);  
            
            const checkPeers = async () => {  
                for (const pid of Object.keys(storeUnit.peers)) {  
                    try {  
                        const peerId =  peerIdFromString(pid);  
                        const threadId = ThreadID.fromString(tId);
                        const remoteInfo = await this.network.getThreadFromPeer(threadId, peerId,{});  
                        const localInfo = await this.network.getThread( threadId);  
                        if (this.compareThreadSync(localInfo, remoteInfo, storeUnit)) {  
                            clearTimeout(timeout);  
                            resolve(true);  
                            return;  
                        }  
                    } catch {  
                        continue;  
                    }  
                }  
                resolve(false);  
            };  

            checkPeers();  
        });  
    } catch {  
        return false;  
    }  
}  

private compareThreadSync(local: ThreadInfo, remote: ThreadInfo, storeUnit: StoreunitInfo): boolean {  
    for (const logInfo of local.logs) {  
        if (!storeUnit.logs.has(logInfo.id.toString())) {  
            continue;  
        }  
        if (!logInfo.head){
            continue;
        }
        const remoteLog = remote.logs.find(l => l.id === logInfo.id);  
        if (!remoteLog?.head) {
            return false;
        }
        if (!remoteLog || logInfo.head.counter > remoteLog.head.counter) {  
            return false;  
        }  
    }  
    return true;  
}  

async ifDbInitSuccess(tid: ThreadID): Promise<boolean> {  
    try {  
        const logKey = await this.getLogKey(tid);  
        const lid =  peerIdFromPrivateKey(logKey); 
        const [threadInfo,err] =  await this.chainUtil.objectState(tid.toString());  
        if (!threadInfo || err) {
            return false;  
        }
        const exist = threadInfo?threadInfo?.logs.has(lid.toString()):false; 
       return exist;
    } catch {  
        return false;  
    }  
}  

async syncDBFromDC(  
    ctx: Context,
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]    
): Promise<Error | null> {  
    try {  
        const tID = await this.decodeThreadId(threadid);  
        const logKey = await this.getLogKey(tID);  
        const lid =  peerIdFromPrivateKey(logKey);
        await this.dc._connectToObjNodes(threadid);  
       await this.addLogToThreadStart(ctx,tID, lid);
        const sk = SymmetricKey.fromString(b32Sk);
        const rk = SymmetricKey.fromString(b32Rk);
        const threadKey =  new ThreadKey(sk, rk);  
        let connectedFlag = false ;
        let connectedConn :Connection | undefined;
        let fullMultiAddr :TMultiaddr | undefined;
        let threadAddr :TMultiaddr;
        let connectedPeerId :PeerId;
        let dbMultiAddr :TMultiaddr;
        if (dbAddr.length > 0) {
            try {
                //
                connectedConn = await this.dc.dcNodeClient?.libp2p.dial(multiaddr(dbAddr), {
                              signal: AbortSignal.timeout(dial_timeout)
                            });
            } catch (error) {
              const errMsg  = (error as any).message;
                console.log("connect to %s catch return, error:%s",dbAddr, errMsg);
            }
        }   

        if (connectedConn) {//连接成功
            connectedPeerId = connectedConn?.remotePeer;
            dbMultiAddr = connectedConn.remoteAddr;
           
        }else{//从区块链中获取节点信息,再连接
            const [connectedAddr, peers] = await this.dc._connectToObjNodes(threadid);
            if (!connectedAddr) {
                throw new Error("connect to obj nodes failed");
            }
            dbMultiAddr = connectedAddr;
            

        }
    

      
        const collections = collectionInfos.map(info => ({  
          name: info.name,  
          schema: info.schema,  
          indexes: info.indexes || []  
      }));

        const dbOpts: NewOptions = {  
            name: dbname, 
            collections: collections, 
            key: threadKey,  
            logKey: logKey,  
            block: block,  
        };  
      


        // Delete existing database if present  
        try {  
            await this.deleteDB(tID, false);  
        } catch (error) {  
          const errMsg  = (error as any).message;
            if ( errMsg != Errors.ErrDBNotFound.message && errMsg != Errors.ErrThreadNotFound.message) {
                throw error;  
            }  
        }  
        const threadMultiaddr = new ThreadMuliaddr(dbMultiAddr, tID);
        await this.newDBFromAddr(threadMultiaddr,  threadKey, dbOpts);  
        return null;  
    } catch (error) {  
       const errMsg  = (error as any).message;
        if (errMsg == Errors.ErrorThreadIDValidation.message) {
            return errMsg;  
        }  
        return error as Error;  
    }  
}  

async getDBRecordsCount(threadid: string): Promise<number> {  
    let count = 0;
    try {  
        const tid = await this.decodeThreadId(threadid);  
        const threadInfo = await this.network.getThread( tid);  
        if (!threadInfo) {
            return count;  
        }  
        for (const logInfo of  threadInfo.logs ) {
            if (!logInfo.head) {
                continue;
            }
            if (count < logInfo.head.counter) {
                count = logInfo.head.counter;
            }
        } 
    } catch (error) {
        console.error(`Error getting records count for thread ${threadid}:`, error);     
    }  
    return count; 
} 


async  addLogToThread(ctx: Context, id: ThreadID, lid: PeerId): Promise<void> {  
    let blockHeight: number;  
    try {  
        blockHeight = (await this.chainUtil.getBlockHeight())||0;
    } catch (err) {  
        throw err;  
    }  

    // 生成用户签名   
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );

      const peerIdValue: Uint8Array = new TextEncoder().encode(
        this.connectedDc.nodeAddr?.getPeerId() || ""
      );

    const preSign = new Uint8Array([  
        ...new TextEncoder().encode(id.toString()),  
        ...new TextEncoder().encode(lid.toString()),  
        ...hValue,  
        ...peerIdValue,  
    ]);  

    let signature: Uint8Array;  
    try {  
        signature = await this.context.sign(preSign);  
    } catch (err) {  
        throw err;  
    }  
    if (!this.connectedDc?.client) {  
        throw Errors.ErrNoDcPeerConnected
    }  
 
    const opts: NewThreadOptions = {
        token: new ThreadToken(this.connectedDc.client.token),
        blockHeight: blockHeight,
        signature: signature,
    };  
    const dbClient = newGrpcClient(this.connectedDc.client,this.network);
    await dbClient.addLogToThread(id.toString(),lid.toString(),opts);
}  



 async  addLogToThreadStart(  
  ctx: Context,  
  id: ThreadID,  
  lid: PeerId  
) : Promise<void>  {
    
 if (!ctx){
    ctx = createContext(30000);
 }
 const abortController = new AbortController();  
 const signal = ctx?.signal || abortController.signal; 
 const [storeUnit,err] = await this.chainUtil.objectState(id.toString());  
  if (storeUnit && !err) {
    const userPubkey = this.context.getPublicKey(); 
    let findFlag = false;  
    for (const user of storeUnit.users) {  
        //移除0x前缀
        const noPrefixUser = user.replace("0x", "");
      if (noPrefixUser === userPubkey.toString()) {  
        findFlag = true;  
        break;  
      }  
    }  
    if (!findFlag) {  
      throw new Error('user not in the thread');
    }  
  }  

  // 处理超时  
  let timeoutId: ReturnType<typeof setTimeout> | null = null; 
  if (ctx.deadline) {  
      const timeout = ctx.deadline.getTime() - Date.now();  
      if (timeout > 0) {  
          timeoutId = setTimeout(() => {  
              abortController.abort();  
          }, timeout);  
      }  
  }  
  let count = 0;  
  const maxCount = 6;  
  let endFlag = false; 
  try{
        await this.addLogToThread(ctx, id, lid);  
    }catch (error) {//允许报错
    }
  const ticker = setInterval(async () => {  
      // 检查是否已被取消  
      if (signal.aborted) {  
          clearInterval(ticker);  
          if (timeoutId) clearTimeout(timeoutId);  
          return;  
      }  

      if (await this.ifDbInitSuccess(id)) {  
          clearInterval(ticker);  
          if (timeoutId) clearTimeout(timeoutId);  
          endFlag = true
          return;  
      }  
      if (count >= maxCount) {  //每6秒确认
        await this.addLogToThread(ctx, id, lid);  
        count = 0;  
    } else {  
        count++;  
    }   
  }, 1000); // 每秒执行一次  
  await new Promise<void>((resolve) => {
    // Add a resolving condition to the interval
    const checkFlag = setInterval(() => {
      if (endFlag) {
        clearInterval(checkFlag);
        resolve();
      }
    }, 1000);
    
    // Also make sure the abort signal resolves the promise
    signal.addEventListener('abort', () => {
      clearInterval(checkFlag);
      resolve();
    });
  }); 
  
}  


async newDB(  
    dbname: string,  
    b32Rk: string,  
    b32Sk: string,  
    collectionInfos: ICollectionConfig[]  
): Promise<[string, Error | null]> {  
    if (!this.connectedDc?.client) {  
        return ['', Errors.ErrNoDcPeerConnected];  
    }  
    try {  
        const dbClient =  newGrpcClient(this.connectedDc.client,this.network);
        const tidStr = await dbClient.requestThreadID(); 
        const threadID = await this.decodeThreadId(tidStr);
        const logKey = await this.getLogKey(threadID);  
        const lpk = logKey.publicKey;
        const lid =  peerIdFromPrivateKey(logKey)  
        const sk = SymmetricKey.fromString(b32Sk);
        const rk = SymmetricKey.fromString(b32Rk);
        const threadKey = new ThreadKey(sk, rk);  
        const blockHeight = (await this.chainUtil.getBlockHeight())||0;

        const hValue: Uint8Array = uint32ToLittleEndianBytes(
          blockHeight ? blockHeight : 0
        );
        if (!this.connectedDc?.nodeAddr) {
            return ['', Errors.ErrNodeAddrIsNull];
        }
        const rPeerId = await  extractPeerIdFromMultiaddr(this.connectedDc.nodeAddr);
        const peerIdValue: Uint8Array = new TextEncoder().encode(rPeerId.toString());
        const sizeValue: Uint8Array = uint64ToLittleEndianBytes(50<<20); //数据库固定大小50M
        const tidUnit8Array = new TextEncoder().encode(tidStr);

        const typeValue: Uint8Array = uint32ToLittleEndianBytes(Type.Threaddbtype);
        const preSign = new Uint8Array([
            ...tidUnit8Array,
            ...sizeValue,
            ...hValue,
            ...typeValue,
            ...peerIdValue
        ]);
        const signature =  await this.context.sign(preSign);
       
        // Create thread options  
        const opts: NewThreadOptions = {
            threadKey: threadKey,
            logKey: logKey,
            token: new ThreadToken(this.connectedDc.client.token),
            blockHeight: blockHeight,
            signature: signature,
        };  
        const threadInfo = await dbClient.createThread(threadID.toString(), opts);  
         const collections = collectionInfos.map(info => ({  
            name: info.name,  
            schema: info.schema,  
            indexes: info.indexes || []  
        })); 

       
     
        const dbOpts: NewOptions = {  
            name: dbname, 
            collections: collections, 
            key: threadKey,  
            logKey: logKey,  
            block: true,  
        }; 

        // Try creating database  
        const errors: string[] = [];  
        for (const multiAddr of threadInfo.addrs) {  
            try {  
                
                await this.newDBFromAddr(multiAddr, threadKey, dbOpts);  
                break;  
            } catch (error:any) {  
                errors.push(error.message);  
            }  
        }  

        if (errors.length === threadInfo.addrs.length) {  
            throw new Error(`create db failed:${errors.join(',')}`);  
        }   
        const ctx = createContext(30000);
        await this.addLogToThreadStart(ctx,threadID, lid);  
        return [threadID.toString(), null];  
    } catch (error) {  
        return ['', error as Error];  
    }  
    
}  

async refreshDBFromDC(threadId:string): Promise<Error | null> {  
    try {  
        const tId = await this.decodeThreadId(threadId);
        await this.network.pullThread( tId,600);  
        return null;  
    } catch (error) {  
        return error as Error;  
    }  
}  

async syncDBToDC(threadId:string): Promise<Error | null> {  
    if (!this.network) {  
        return Errors.ErrP2pNetworkNotInit;  
    }  
    try {  
        const tId = await this.decodeThreadId(threadId);
        await this.network.exchange( tId);  
        return null;  
    } catch (error) {  
        return error as Error;  
    }  
}  



private async decodeThreadId(threadid: string): Promise<ThreadID> {  
    if (!threadid) {  
        throw   new Error('Thread ID is empty'); 
    }  

    try {  
        // 基本格式验证  
        if (!/^[a-zA-Z0-9]+$/.test(threadid)) {  
            throw Errors.ErrorThreadIDValidation;
        }  

        // 尝试解码  
        const threadID = ThreadID.fromString(threadid);  

        // 验证长度  
        const bytes = threadID.toBytes();  
        if (bytes.length < 32) { 
            throw new Error('Thread ID too short');  
        }  

        return threadID;  
    } catch (error) {  
     const errMsg  = (error as any).message;
        if (errMsg === Errors.ErrorThreadIDValidation.message) {  
            throw error;  
        }  
        throw new  Error(`Failed to decode thread ID: $errMsg}`);  
    }  
}  

// 为了方便使用，可以添加一个验证方法  
async validateThreadId(threadid: string): Promise<boolean> {  
    try {  
        await this.decodeThreadId(threadid);  
        return true;  
    } catch {  
        return false;  
    }  
} 

async close(): Promise<void> {  
    await this.lock.acquire('dbs', async () => {  
        for (const db of this.dbs.values()) {  
            await db.close();  
        }  
        this.dbs.clear();  
    });  
}  

/**
 * Gets a database by ID
 * @param ctx The context for the operation
 * @param id The thread ID of the database
 * @param opts Optional managed options
 * @returns Promise resolving to the database instance
 * @throws Error if the database cannot be found
 */
async getDB(id: ThreadID, opts?: ManagedOptions): Promise<ThreadDb> {
    console.debug(`manager: getting db ${id}`);
    

    
    console.debug(`manager: getting thread ${id} from net`);
    try {
        // Get thread from the network
        await this.network.getThread(id, { token: opts?.token });
        console.debug(`manager: got thread ${id} from net`);
    } catch (err) {
        throw err;
    }
    
    const db = this.dbs.get(id.toString());
    if (!db) {
        throw Errors.ErrDBNotFound;
    }
    return db;
    
}


async getDBInfo(id: ThreadID, opts?: ManagedOptions): Promise<[IDBInfo|null, Error|null]> {
   let dbInfo: IDBInfo|null = null;
    try {
        const db = this.dbs.get(id.toString());
        if (!db) {
            throw Errors.ErrDBNotFound;
        }
        dbInfo = await db.getDBInfo(opts);
        if (!dbInfo || dbInfo === null) {
            throw new Error(`No info available for db ${id}`);
        }
    }catch (err) {
        console.error(`Error getting DB info for ${id}:`, err);
        return [null, err as Error];
    }  
    return [dbInfo,null];
}





// DeleteDB deletes a db by id.
async deleteDB( id: ThreadID, deleteThreadFlag: boolean, opts?: ManagedOptions): Promise<void> {
    console.debug(`manager: deleting db ${id}`);

    console.debug(`manager: getting thread ${id} from net`);
    try {
        await this.network.getThread(id, { token: opts?.token });
        console.debug(`manager: got thread ${id} from net`);
    } catch (err) {
        throw err;
    }
   
    const db = this.dbs.get(id.toString());
    if (!db) {
        throw Errors.ErrDBNotFound;
    }

    try {
        await db.close();
    } catch (err) {
        throw err;
    }

    if (deleteThreadFlag) {
        console.debug(`manager: deleting thread ${id} from net`);
        try {
            await this.network.deleteThread(id, { token: opts?.token, apiToken: db.connector?.token });
            console.debug(`manager: deleted thread ${id} from net`);
        } catch (err) {
            throw err;
        }
    }

    try {
        await this.deleteThreadNamespace(id);
    } catch (err) {
        throw err;
    }
    this.lock.acquire('dbs', async () => {
        this.dbs.delete(id.toString());
        console.debug(`manager: deleted db ${id}`);
    });
}

private async deleteThreadNamespace(id: ThreadID): Promise<void> {
    const pre = dsManagerBaseKey.child(new Key(id.toString())).toString();
    const q = { prefix: pre, keysOnly: true };
    const results =  this.store.query(q);
    for await (const result of results) {
        await this.store.delete(result.key);
    }
}


/**********************数据库数据操作相关**********************/
/**
     * Create creates new instances of objects in a collection
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param jsonInstance JSON string representing the instance
     * @returns Promise resolving to the created instance ID
     * @throws Error if creation fails
     */
async  create(threadId: string, collectionName: string, jsonInstance: string): Promise<string> {
    // // 检查实例大小
    // if (jsonInstance.length > 100 * 1024) { // 100 KB
    // throw new Error("instance too big");
    // }
    try {
    // 解码threaddbID
    const tID = ThreadID.fromString(threadId);
  
    // 获取threaddb数据库
    const threadDB = await this.getDB(tID);
    
    // 获取集合
    const collection = threadDB.getCollection(collectionName);
    if (!collection) {
        throw new Error("Collection does not exist");
    }
    
    // 创建实例
    const instanceID = await collection.create(Buffer.from(jsonInstance));
    // 返回实例ID
    return instanceID.toString();
    } catch (err) {
    console.error(`Failed to create instance: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
    }
}


/**
     * Delete deletes an instance by ID
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instanceID Instance ID to delete
     * @throws Error if deletion fails
     */
async delete(threadId: string, collectionName: string, instanceID: string): Promise<void> {
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
      
        
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        // 删除实例
        await collection.delete(instanceID);
    } catch (err) {
        console.error(`Failed to delete instance: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}

/**
 * Save updates an existing instance
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instance JSON string representing the instance
 * @throws Error if update fails
 */
async save(threadId: string, collectionName: string, instance: string): Promise<void> {
    // // 检查实例大小
    // if (instance.length > 100 * 1024) { // 100 KB
    //     throw new Error("instance too big");
    // }
    
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
     
        
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        // 保存实例
        await collection.save(Buffer.from(instance));
    } catch (err) {
        console.error(`Failed to save instance: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}

/**
 * DeleteMany deletes multiple instances by their IDs
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceIDs Comma-separated or JSON array of instance IDs
 * @throws Error if deletion fails
 */
async deleteMany(threadId: string, collectionName: string, instanceIDs: string): Promise<void> {
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
       
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        
        // 解析实例ID列表
        let IDs: string[] = [];
        instanceIDs = instanceIDs.trim();
        if (instanceIDs === "") {
            return;
        }
        
        if (instanceIDs[0] !== '[') {
            // 逗号分隔的ID列表
            IDs = instanceIDs.split(',');
        } else {
            // JSON数组
            try {
                IDs = JSON.parse(instanceIDs);
            } catch (err) {
                // 解析失败时，将整个字符串作为一个ID
                IDs = [instanceIDs];
            }
        }
        
        // 批量处理，每次最多100个（避免事务过大）
        const idsLen = IDs.length;
        for (let i = 0; i < idsLen; i += 100) {
            const batchIds = IDs.slice(i, Math.min(i + 100, idsLen));
            await collection.deleteMany(batchIds);
        }
    } catch (err) {
        console.error(`Failed to delete instances: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}

/**
 * Has checks if the specified instance exists
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceID Instance ID to check
 * @returns Promise resolving to a boolean indicating if instance exists
 */
async has(threadId: string, collectionName: string, instanceID: string): Promise<boolean> {
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
      
        
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            return false;
        }
        
        // 检查实例是否存在
        return await collection.has(instanceID);
    } catch (err) {
        console.error(`Failed to check instance existence: ${err instanceof Error ? err.message : String(err)}`);
        return false;
    }
}

/**
 * Find finds instances by query
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param queryString JSON string representing the query
 * @returns Promise resolving to a JSON string with found instances
 * @throws Error if query fails
 */
async find(threadId: string, collectionName: string, queryString?: string): Promise<string> {
    try {
      if (!queryString) {
          queryString = "{}";
        }

        // 解析查询字符串
        const query = parseJsonToQuery(queryString);
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
      
        
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        
        // 执行查询
        const results = await collection.find(query);
        
        // 合并结果并返回JSON字符串
        if (Array.isArray(results)) {
            return jsonStringify(results);
        } else {
            // 如果结果是字节数组，则需要连接它们
            const resultArray = results as Buffer[];
            const joinedResult = Buffer.concat([
                Buffer.from('['),
                Buffer.concat(
                    resultArray.map((buf, idx) => 
                        Buffer.concat([
                            buf,
                            idx < resultArray.length - 1 ? Buffer.from(',') : Buffer.from('')
                        ])
                    )
                ),
                Buffer.from(']')
            ]);
            return joinedResult.toString();
        }
    } catch (err) {
        console.error(`Failed to find instances: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}

/**
 * FindByID finds an instance by ID
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param instanceID Instance ID to find
 * @returns Promise resolving to a JSON string with found instance
 * @throws Error if query fails
 */
async findByID(threadId: string, collectionName: string, instanceID: string): Promise<string> {
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
      
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        
        // 根据ID查找实例
        const result = await collection.findByID(instanceID);
        
        // 返回实例
        return result instanceof Buffer ? result.toString() : jsonStringify(result);
    } catch (err) {
        console.error(`Failed to find instance by ID: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}

/**
 * ModifiedSince returns instance IDs modified since the given time
 * @param threadId Thread ID string
 * @param collectionName Collection name
 * @param time Unix timestamp in milliseconds
 * @returns Promise resolving to a JSON string with instance IDs
 * @throws Error if query fails
 */
async modifiedSince(threadId: string, collectionName: string, time: number): Promise<string> {
    try {
        // 解码线程ID
        const tID = ThreadID.fromString(threadId);
        
        
        
        // 获取线程数据库
        const threadDB = await this.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        
        // 获取指定时间后修改的实例ID列表
        const ids = await collection.modifiedSince(time);
        
        // 序列化并返回ID列表
        return JSON.stringify(ids);
    } catch (err) {
        console.error(`Failed to get modified instances: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
    }
}




}


class AsyncLock {  
    private locks: Map<string, Promise<void>>;  
    constructor() {  
        this.locks = new Map();  
    }  
    async acquire<T>(key: string, fn: () => Promise<T>): Promise<T> {  
        while (this.locks.has(key)) {  
            await this.locks.get(key);  
        }  
        let resolve: () => void;  
        const promise = new Promise<void>((r) => (resolve = r));  
        this.locks.set(key, promise);  

        try {  
            const result = await fn();  
            return result;  
        } catch (err: any) {
            // 重新抛出错误以保持类型一致性
            throw err;  
        } finally {  
            this.locks.delete(key);  
            resolve!();  
        }  
    }  
}

function isValidName(name: string): boolean {  
    return /^[a-zA-Z0-9_-]+$/.test(name);  
}  

export function createContext(timeout: number): Context {  
    const ctx : Context = {
        deadline: new Date(Date.now() + timeout)
    };
    if (timeout === 0) {
        ctx.deadline = undefined;
    }
    if (typeof AbortController !== 'undefined') {
        ctx.signal = new AbortController().signal;
    }
    return ctx;  
}  
 

