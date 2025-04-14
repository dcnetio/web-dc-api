import { PeerId } from '@libp2p/interface';  
import { multiaddr, Multiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { peerIdFromPrivateKey, peerIdFromString } from "@libp2p/peer-id";
import { Buffer } from 'buffer';  
import { Key } from 'interface-datastore';
import { EventEmitter } from 'events';  
import { DB as ThreadDb } from './db/db';
import { Errors } from './core/db';
import { Net } from './core/app';
import { ChainUtil } from "../chain";
import { LevelDatastore } from 'datastore-level' 
import { Ed25519PrivKey } from "../dc-key/ed25519";
import type { Connection, PrivateKey }  from '@libp2p/interface'
import { keys } from "@libp2p/crypto";
import { SymmetricKey, Key as ThreadKey } from './common/key';

import {StoreunitInfo} from '../chain';
import { PrefixTransform,TransformedDatastore} from './common/transformed-datastore' 
import {NewOptions,Token,CollectionConfig,ManagedOptions,ThreadInfo,Context} from './core/core';
import {TxnDatastoreExtended,pullThreadBackgroundTimeout,PullTimeout} from './core/db';
import type { DCConnectInfo } from "../types/types";
import { fastExtractPeerId, uint32ToLittleEndianBytes } from "../util/utils";
import {DcUtil} from '../dcutil';
import {Type} from '../constants';
import { SignHandler } from '../types/types';
import { NewThreadOptions } from './core/options';
import {ThreadToken} from './core/identity';
import { DBGrpcClient } from "./net/grpcClient";
import type { Client } from "../dcapi";


import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";

import { createTxnDatastore } from './common/level-adapter';
import { time } from 'console';
// 协议常量定义  
export const Protocol = {  
    Code: 406, // 根据实际协议代码调整  
    Name: 'thread', // 协议名称  
    Version: "0.0.1",
  } 

export const ThreadProtocol = "/dc/" + Protocol.Name + "/" + Protocol.Version


// 常量  
export const MaxLoadConcurrency = 100;  
export const dsManagerBaseKey = new Key('/manager');  




function newGrpcClient(client: Client): DBGrpcClient {
    if (client.p2pNode == null || client.p2pNode.peerId == null) {
        throw new Error("p2pNode is null or node privateKey is null");
    }        
    const grpcClient = new DBGrpcClient(
        client.p2pNode,
        client.peerAddr,
        client.token,
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
    private signHandler: SignHandler;

    constructor(  
        store: TxnDatastoreExtended,  //实际上是一个LevelDatastore实例,用levelDatastoreAdapter包装
        network: Net,  
        dc: DcUtil,
        connectedDc:DCConnectInfo,
        opts: NewOptions = {} ,
        chainUtil: ChainUtil,
        storagePrefix: string
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
    }  

     /**  
     * Gets the log key for a thread. If it doesn't exist, creates a new one.  
     * @param tid Thread ID  
     * @returns Promise resolving to the private key  
     * @throws Error if key operations fail  
     */  
    async getLogKey(tid: ThreadID): Promise<PrivateKey> {  
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
        } catch (err) {  
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
            const bytes = keyPair.raw;
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
  static fromAddr(addr: Multiaddr): ThreadID {  
    try {  
      // 获取协议值  
      const parts = addr.toString().split('/')  
      const index = parts.indexOf(Protocol.Name)  
      if (index === -1 || index === parts.length - 1) {  
        throw new Error('thread protocol not found in multiaddr')  
      }  
      
      const idstr = parts[index + 1]  
      return ThreadID.fromString(idstr)  
    } catch (err) {  
      throw new Error(`Failed to extract ID from multiaddr: ${err.message}`)  
    }  
  }  

  /**  
   * ToAddr returns ID wrapped as a multiaddress.  
   * @returns Multiaddr instance  
   */  
  toAddr(): Multiaddr {  
    try {  
      const addr = multiaddr(`/${Protocol.Name}/${this.toString()}`)  
      return addr  
    } catch (err) {  
      // This should not happen with valid IDs  
      throw new Error(`Failed to create multiaddr: ${err.message}`)  
    }  
  }  

    async newDBFromAddr(  
        addr: Multiaddr,  
        key: ThreadKey,  
        opts: NewOptions = {}  
    ): Promise<ThreadDb> {  
        const id =  DBManager.fromAddr(addr);  
        
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

            await this.network.addThread( addr, {  
                key,  
                logKey: opts.logKey,  
                token: opts.token,  
            });  
            const collections = opts.collections || [];
            const name = opts.name || '';
            const [store, dbOpts] = await this.wrapDB(this.store,id, opts,name, collections);  
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

    private async pullThreadBackground(id: ThreadID, token?: Token) {  
        try {   
            await this.network.pullThread( id,pullThreadBackgroundTimeout, { token: token });  
        } catch (err) {  
            console.error(`Error pulling thread ${id}:`, err);  
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
    collections: CollectionConfig[]  
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
        const storeUnit = await this.chainUtil.objectState(tId);  
        if (!storeUnit) return false;  

        return new Promise((resolve) => {  
            const timeout = setTimeout(() => resolve(false), PullTimeout);  
            
            const checkPeers = async () => {  
                for (const pid of Object.keys(storeUnit.peers)) {  
                    try {  
                        const peerId =  peerIdFromString(pid);  
                        const threadId = ThreadID.fromString(tId);
                        const remoteInfo = await this.network.getThreadFromPeer(threadId, peerId);  
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
        if (!storeUnit.logs[logInfo.id.toString()]) {  
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
        const threadInfo =  await this.chainUtil.objectState(tid.toString());  
        return !!(threadInfo?.logs && threadInfo.logs[lid.toString()]);  
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
    jsonCollections: string  
): Promise<Error | null> {  
    try {  
        const tID = await this.decodeThreadId(threadid);  
        const logKey = await this.getLogKey(tID);  
        const lid =  peerIdFromPrivateKey(logKey);

        this.dc._connectToObjNodes(threadid);  
        this.addLogToThreadStart(ctx,tID, lid);
        const sk = SymmetricKey.fromString(b32Sk);
        const rk = SymmetricKey.fromString(b32Rk);
        const threadKey =  new ThreadKey(sk, rk);  
        let connectedFlag = false ;
        let connectedConn :Connection | undefined;
        let fullMultiAddr :Multiaddr | undefined;
        let threadAddr :Multiaddr;
        let connectedPeerId :PeerId;
        let dbMultiAddr :Multiaddr;
        if (dbAddr.length > 0) {
            try {
                
                connectedConn = await this.dc.dcNodeClient?.libp2p.dial(multiaddr(dbAddr));
            } catch (error) {
                console.log("connect to %s catch return, error:%s",dbAddr, error.message);
            }
        }   

        if (connectedConn) {//连接成功
            connectedPeerId = connectedConn?.remotePeer;
            dbMultiAddr = connectedConn.remoteAddr;
            threadAddr = multiaddr(`/p2p/${connectedPeerId.toString()}/thread/${threadid}`);
           
        }else{//从区块链中获取节点信息,再连接
            const connectedAddr = await this.dc._connectToObjNodes(threadid);
            if (!connectedAddr) {
                throw new Error("connect to obj nodes failed");
            }
            dbMultiAddr = connectedAddr;
            const connectedPeerId = fastExtractPeerId(connectedAddr);
            threadAddr = multiaddr(`/p2p/${connectedPeerId?.toString()}/thread/${threadid}`);

        }
        dbMultiAddr = dbMultiAddr.decapsulate(threadAddr);
        dbMultiAddr = dbMultiAddr.encapsulate(threadAddr);

        const collectionInfos: CollectionConfig[] = JSON.parse(jsonCollections);  
        const collections = await Promise.all(  
            collectionInfos.map(async info => ({  
                name: info.name,  
                schema: info.schema,  
                indexes: info.indexes || []  
            }))  
        );  

        const dbOpts: ManagedOptions = {  
            name: dbname,  
            key: threadKey,  
            logKey: logKey,  
            block: block,  
            collections: collections
        };  

        // Delete existing database if present  
        try {  
            await this.deleteDB(tID, false);  
        } catch (error) {  
            if (error.message != Errors.ErrDBNotFound.message && error.message != Errors.ErrThreadNotFound.message) {
                throw error;  
            }  
        }  

        await this.newDBFromAddr(dbMultiAddr,  threadKey, dbOpts);  
        return null;  
    } catch (error) {  
        if (error.message == Errors.ErrorThreadIDValidation.message) {
            return error;  
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
        signature = await this.signHandler.sign(preSign);  
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
    const dbClient = newGrpcClient(this.connectedDc.client);
    dbClient.addLogToThread(id.toString(),lid.toString(),opts);
}  


 async  addLogToThreadStart(  
  ctx: Context,  
  id: ThreadID,  
  lid: PeerId  
) : Promise<void>  {
    

 const abortController = new AbortController();  
 const signal = ctx.signal || abortController.signal; 
  const storeUnit = await this.chainUtil.objectState(id.toString());  
  if (storeUnit) {  
    const userPubkey = this.signHandler.publickey; 
    let findFlag = false;  
    for (const user of storeUnit.users) {  
      if (user === userPubkey.toString()) {  
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
          return;  
      }  
      if (count >= maxCount) {  
        this.addLogToThread(ctx, id, lid);  
        count = 0;  
    } else {  
        count++;  
    }   
  }, 1000); // 每秒执行一次  
  // 监听取消信号  
  signal.addEventListener('abort', () => {  
      clearInterval(ticker);   
      if (timeoutId) clearTimeout(timeoutId);  
  });  
}  


async newDB(  
    dbname: string,  
    b32Rk: string,  
    b32Sk: string,  
    jsonCollections: string  
): Promise<[string, Error | null]> {  
    if (!this.connectedDc?.client) {  
        return ['', Errors.ErrNoDcPeerConnected];  
    }  
    try {  
        const dbClient =  newGrpcClient(this.connectedDc.client);
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
        const peerIdValue: Uint8Array = new TextEncoder().encode(
          this.connectedDc.nodeAddr?.getPeerId() || ""
        );
        const sizeValue: Uint8Array = uint32ToLittleEndianBytes(50<<20); //数据库固定大小50M
        const tidUnit8Array = new TextEncoder().encode(tidStr);

        const typeValue: Uint8Array = uint32ToLittleEndianBytes(Type.Threaddbtype);
        const preSign = new Uint8Array([
            ...tidUnit8Array,
            ...sizeValue,
            ...hValue,
            ...typeValue,
            ...peerIdValue
        ]);
        const signature =  this.signHandler.sign(preSign);
       
        // Create thread options  
        const opts: NewThreadOptions = {
            threadKey: threadKey,
            logKey: logKey,
            token: new ThreadToken(this.connectedDc.client.token),
            blockHeight: blockHeight,
            signature: signature,
        };  

        const threadInfo = await dbClient.createThread(threadID.toString(), opts);  

        // Parse collections  
        let collectionInfos: CollectionConfig[] = [];  
        if (jsonCollections.length > 2) {  
            collectionInfos = JSON.parse(jsonCollections);  
        }  

        const collections = await Promise.all(  
            collectionInfos.map(async info => ({  
                name: info.name,  
                schema: info.schema,  
                indexes: info.indexes || []  
            }))  
        );  

       
        const dbOpts: ManagedOptions = {  
            name: dbname,  
            key: threadKey,  
            logKey: logKey,  
            block: true,  
            collections: collections
        };  

        // Try creating database  
        const errors: string[] = [];  
        for (const multiAddr of threadInfo.addrs) {  
            try {  
                await this.newDBFromAddr( multiAddr, threadKey, dbOpts);  
                break;  
            } catch (error) {  
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

async refreshDBFromDC(tId: ThreadID): Promise<Error | null> {  
    try {  
        await this.network.pullThread( tId,600);  
        return null;  
    } catch (error) {  
        return error as Error;  
    }  
}  

async syncDBToDC(tId: ThreadID): Promise<Error | null> {  
    if (!this.network) {  
        return Errors.ErrP2pNetworkNotInit;  
    }  
    try {  
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
        if (error.message === Errors.ErrorThreadIDValidation.message) {  
            throw error;  
        }  
        throw new  Error(`Failed to decode thread ID: ${error.message}`);  
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
    this.lock.acquire('dbs', async () => {
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
                await this.network.deleteThread(id, { token: opts?.token, apiToken: db.connector.token });
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
}

// 辅助类和函数  
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
        } finally {  
            this.locks.delete(key);  
            resolve!();  
        }  
    }  
}  

function isValidName(name: string): boolean {  
    return /^[a-zA-Z0-9_-]+$/.test(name);  
}  

function createContext(timeout: number): Context {  
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
 

