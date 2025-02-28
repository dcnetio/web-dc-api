import { PeerId } from '@libp2p/interface';  
import { multiaddr, Multiaddr } from '@multiformats/multiaddr';  
import { ThreadID } from '@textile/threads-id';
import { peerIdFromPrivateKey, peerIdFromString } from "@libp2p/peer-id";
import { Buffer } from 'buffer';  
import { Key } from 'interface-datastore';
import { EventEmitter } from 'events';  
import { DB as ThreadDb,Net ,Collection} from './db';
import { ChainUtil } from "../chain";
import { LevelDatastore } from 'datastore-level' 
import { Ed25519PrivKey } from "../dc-key/ed25519";
import type { Connection, PrivateKey }  from '@libp2p/interface'
import { keys } from "@libp2p/crypto";
import { SymmetricKey, Key as ThreadKey } from './key';

import {StoreunitInfo} from '../chain';
import { PrefixTransform,TransformedDatastore} from './transformed-datastore' 
import {TxnDatastoreExtended,NewOptions,Token,CollectionConfig,ManagedOptions,ThreadInfo} from './core/core';
import type { DCConnectInfo } from "../types/types";
import { fastExtractPeerId, uint32ToLittleEndianBytes } from "../util/utils";
import {DcUtil} from '../dcutil';
import {DBClient} from './client';

import { createTxnDatastore } from './level-adapter';
// 协议常量定义  
export const Protocol = {  
    Code: 406, // 根据实际协议代码调整  
    Name: 'thread', // 协议名称  
    Version: "0.0.1",
  } 

export const ThreadProtocol = "/dc/" + Protocol.Name + "/" + Protocol.Version
const pullThreadBackgroundTimeout = 3600000; // 1 hour in milliseconds
const PullTimeout = 20000; // 20 seconds in milliseconds

// 错误定义  
export class DBError extends Error {  
    constructor(message: string) {  
        super(message);  
        this.name = 'DBError';  
    }  
}  

export const Errors = {  
    ErrDBNotFound: new DBError('db not found'),  
    ErrDBExists: new DBError('db already exists'),  
    ErrInvalidName: new DBError('invalid name'),  
    ErrThreadReadKeyRequired: new DBError('thread read key required'), 
    ThreadIDValidationError: new DBError('thread id validation error'),
    ErrThreadNotFound: new DBError('thread not found'), 
    ErrP2pNetworkNotInit: new DBError('p2p network not initialized'),
    ErrNoDbManager: new DBError('no db manager'),
    ErrNoDcPeerConnected: new DBError('no dc peer connected'),
};  

// 常量  
export const MaxLoadConcurrency = 100;  
export const dsManagerBaseKey = new Key('/manager');  




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
    // 验证线程 ID  
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
        this.addLogToThreadStart(tID, lid);
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
        } catch (error:Error) {  
            if (error.message != Errors.ErrDBNotFound.message && error.message != Errors.ErrThreadNotFound.message) {
                throw error;  
            }  
        }  

        await this.newDBFromAddr(dbMultiAddr,  threadKey, dbOpts);  
        return null;  
    } catch (error) {  
        if (error == Errors.ThreadIDValidationError) {  
            return error;  
        }  
        return error as Error;  
    }  
}  

async getDBRecordsCount(threadid: string): Promise<[number, Error | null]> {  

    try {  
        const tid = await this.decodeThreadId(threadid);  
        const count = await this.getDBRecordsCount( tid);  
        return count;  
    } catch (error) {  
        if (error.message == Errors.ThreadIDValidationError.message) {  
            return [0, error];  
        }  
        return [0, error as Error];  
    }  
} 


private async addLogToThreadStart( tid: ThreadID, lid: PeerId): Promise<void> {  
    //todo Implementation of adding log to thread start  
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
        const dbClient = new DBClient(this.connectedDc.client);
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
    
        // 将 hValue 和 peerIdValue 连接起来
        const preSign = new Uint8Array(peerIdValue.length + hValue.length);
        preSign.set(peerIdValue, 0);
        preSign.set(hValue, peerIdValue.length);
        const signature = this.privKey.sign(preSign);
        const pubKey = this.privKey.publicKey;
        // Prepare signature data  
        const preSign = Buffer.concat([  
            Buffer.from(threadID.toString()),  
            Buffer.alloc(8).fill(50 << 20), // 50M fixed size  
            Buffer.alloc(4).fill(blockHeight),  
            Buffer.alloc(4).fill(Threaddbtype),  
            Buffer.from(this.connectedDc.peerid.toString())  
        ]);  

        const signature = await this.privateKey.sign(preSign);  

        // Create thread options  
        const opts: Types.ThreadOption[] = [  
            { withThreadKey: serviceKey },  
            { withLogKey: lpk },  
            { withNewThreadBlockHeight: blockHeight },  
            { withNewThreadSignature: signature }  
        ];  

        const threadInfo = await this.connectedDc.client.createThread(threadID, ...opts);  

        // Parse collections  
        let collectionInfos: Types.CollectionInfo[] = [];  
        if (jsonCollections.length > 2) {  
            collectionInfos = JSON.parse(jsonCollections);  
        }  

        const collections = await Promise.all(  
            collectionInfos.map(async info => ({  
                name: info.name,  
                schema: await Utils.SchemaFromSchemaString(info.schema),  
                indexes: info.indexs || [],  
                writeValidator: info.writeValidator || '',  
                readFilter: info.readFilter || ''  
            }))  
        );  

        // Create database options  
        const dbOpts: Types.DBOptions = {  
            name: dbname,  
            key: threadKey,  
            logKey: logKey,  
            backfillBlock: true,  
            collections  
        };  

        // Try creating database  
        const errors: string[] = [];  
        for (const multiAddr of threadInfo.addrs) {  
            try {  
                await this.dbManager.newDBFromAddr(this.context, multiAddr, threadKey, dbOpts);  
                break;  
            } catch (error) {  
                errors.push(error.message);  
            }  
        }  

        if (errors.length === threadInfo.addrs.length) {  
            throw new Error(`create db failed:${errors.join(',')}`);  
        }  

        const [ctx, cancel] = Utils.createTimeoutContext(30000);  
        try {  
            await this.addLogToThreadStart(ctx, threadID, lid);  
        } finally {  
            cancel();  
        }  

        return [threadID.toString(), null];  
    } catch (error) {  
        return ['', error as Error];  
    }  
}  

async refreshDBFromDC(tId: string): Promise<Error | null> {  
    try {  
        await this.net.pullThread(this.context, tId);  
        return null;  
    } catch (error) {  
        return error as Error;  
    }  
}  

async syncDBToDC(tId: string): Promise<Error | null> {  
    if (!this.net) {  
        return Errors.ErrP2pNetworkNotInit;  
    }  
    try {  
        await this.net.exchange(this.context, tId);  
        return null;  
    } catch (error) {  
        return error as Error;  
    }  
}  



private async decodeThreadId(threadid: string): Promise<Types.ThreadID> {  
    if (!threadid) {  
        throw new Errors.ThreadIDValidationError('Thread ID cannot be empty');  
    }  

    try {  
        // 基本格式验证  
        if (!/^[a-zA-Z0-9]+$/.test(threadid)) {  
            throw new Errors.ThreadIDValidationError('Invalid thread ID format');  
        }  

        // 尝试解码  
        const threadID = Types.ThreadID.fromString(threadid);  

        // 验证长度  
        const bytes = threadID.toBytes();  
        if (bytes.length < 32) { // 假设最小长度为32字节  
            throw new Errors.ThreadIDValidationError('Thread ID too short');  
        }  

        return threadID;  
    } catch (error) {  
        if (error instanceof Errors.ThreadIDValidationError) {  
            throw error;  
        }  
        throw new Errors.ThreadIDValidationError(`Failed to decode thread ID: ${error.message}`);  
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

function createTimeoutContext(timeout: number): Context {  
    const ctx = new EventEmitter();  
    setTimeout(() => ctx.emit('timeout'), timeout);  
    return ctx;  
}  
 

