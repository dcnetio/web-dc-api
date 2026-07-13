import { PeerId } from "@libp2p/interface";
import { multiaddr, Multiaddr as TMultiaddr } from "@multiformats/multiaddr";
import { ThreadID } from "@textile/threads-id";
import { peerIdFromPrivateKey, peerIdFromString } from "@libp2p/peer-id";
import { Key } from "interface-datastore";
import { DB as ThreadDb } from "./db/db";
import { Errors, Transaction } from "./core/db";
import { Net } from "./core/app";
import { ChainUtil } from "../../common/chain";
import { Ed25519PrivKey } from "../../common/dc-key/ed25519";
import type { Connection } from "@libp2p/interface";
import { keys } from "@libp2p/crypto";
import { SymmetricKey, Key as ThreadKey } from "./common/key";
import { extractPeerIdFromMultiaddr } from "../../common/dc-key/keyManager";
import { IDBInfo, ThreadMuliaddr } from "./core/core";

import { StoreunitInfo } from "../../common/chain";
import {
  createTransformedDatastore,
  PrefixTransform,
} from "./common/transformed-datastore";
import {
  NewOptions,
  ICollectionConfig,
  ManagedOptions,
  ThreadInfo,
  Context,
} from "./core/core";
import {
  TxnDatastoreExtended,
  pullThreadBackgroundTimeout,
  PullTimeout,
} from "./core/db";
import type { DCConnectInfo } from "../../common/types/types";
import {
  uint32ToLittleEndianBytes,
  uint64ToLittleEndianBytes,
} from "../../util/utils";
import { DcUtil } from "../../common/dcutil";
import { Type } from "../../common/constants";
import { NewThreadOptions } from "./core/options";
import { ThreadToken } from "./core/identity";
import { DBGrpcClient } from "./net/grpcClient";
import type { Client } from "../../common/dcapi";
import { jsonStringify, uint8ArrayToHex } from "../../util/utils";
import { Protocol } from "./net/define";
import { parseJsonToQuery } from "./db/json2Query";
import { dial_timeout } from "../../common/define";
import multibase, { decode as multibaseDecode } from "multibase";
import { net as net_pb } from "./pb/net_pb";
import { LineReader } from "./common/lineReader";
import { FileManager } from "../file/manager";
import { newIterator } from "./db/collection";
import { Query } from "./db/query";
import { DCContext } from "../../interfaces";

export const ThreadProtocol = "/dc/" + Protocol.name + "/" + Protocol.version;

// 常量
export const MaxLoadConcurrency = 100;
export const dsManagerBaseKey = new Key("/manager");

function newGrpcClient(client: Client, net: Net): DBGrpcClient {
  if (client.p2pNode == null || client.p2pNode.peerId == null) {
    throw new Error("p2pNode is null or node privateKey is null");
  }
  const grpcClient = new DBGrpcClient(client, net);
  return grpcClient;
}

// 管理器类

// Helper: format and parse protobuf Text Format used by Go SDK for Log compatibility
function escapeBytes(buf: Uint8Array): string {
    let result = '';
    for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if (b === 10) result += '\\n';
        else if (b === 13) result += '\\r';
        else if (b === 9) result += '\\t';
        else if (b === 34) result += '\\"';
        else if (b === 92) result += '\\\\';
        else if (b >= 32 && b <= 126) {
            result += String.fromCharCode(b);
        } else {
            result += '\\' + b.toString(8).padStart(3, '0');
        }
    }
    return result;
}

function textFormatLog(log: any): string {
    const parts: string[] = [];
    if (log.ID && log.ID.length > 0) parts.push(`ID:"${escapeBytes(log.ID)}"`);
    if (log.pubKey && log.pubKey.length > 0) parts.push(`pubKey:"${escapeBytes(log.pubKey)}"`);
    if (log.addrs && log.addrs.length > 0) {
        for (const addr of log.addrs) {
            if (addr && addr.length > 0) parts.push(`addrs:"${escapeBytes(addr)}"`);
        }
    }
    if (log.head && log.head.length > 0) parts.push(`head:"${escapeBytes(log.head)}"`);
    let counterVal: number | string = log.counter;
    if (log.counter && typeof log.counter === 'object' && typeof log.counter.toNumber === 'function') {
        counterVal = log.counter.toNumber();
    }
    if (counterVal && counterVal !== 0 && counterVal !== "0") {
        parts.push(`counter:${counterVal}`);
    }
    const res = parts.join(' ') + (parts.length > 0 ? ' ' : '');
    return res;
}

function unescapeBytes(str: string): Uint8Array {
    const bytes: number[] = [];
    let i = 0;
    while (i < str.length) {
        if (str[i] === '\\') {
            const next = str[i+1];
            if (next === 'n') { bytes.push(10); i += 2; }
            else if (next === 'r') { bytes.push(13); i += 2; }
            else if (next === 't') { bytes.push(9); i += 2; }
            else if (next === '"') { bytes.push(34); i += 2; }
            else if (next === '\\') { bytes.push(92); i += 2; }
            else {
                const octalStr = str.substring(i + 1, i + 4);
                if (/^[0-7]{1,3}$/.test(octalStr)) {
                    bytes.push(parseInt(octalStr, 8));
                    i += 1 + octalStr.length;
                } else {
                    bytes.push(92);
                    i++;
                }
            }
        } else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    return new Uint8Array(bytes);
}

function parseTextFormatLog(text: string): any {
    const obj: any = {};
    let i = 0;
    while (i < text.length) {
        while (i < text.length && /\s/.test(text[i])) i++;
        if (i >= text.length) break;
        let colon = text.indexOf(':', i);
        if (colon === -1) break;
        const key = text.substring(i, colon);
        i = colon + 1;
        if (text[i] === '"') {
            i++;
            let start = i;
            let valStr = "";
            while (i < text.length) {
                if (text[i] === '\\') {
                    if (i + 1 < text.length) {
                       valStr += text[i] + text[i+1];
                       i += 2;
                       if (/[0-7]/.test(text[i-1])) {
                           if (i < text.length && /[0-7]/.test(text[i])) { valStr += text[i]; i++; }
                           if (i < text.length && /[0-7]/.test(text[i])) { valStr += text[i]; i++; }
                       }
                    } else i++;
                } else if (text[i] === '"') {
                    break;
                } else {
                    valStr += text[i];
                    i++;
                }
            }
            const buf = unescapeBytes(valStr);
            if (key === 'addrs') {
                if (!obj[key]) obj[key] = [];
                obj[key].push(buf);
            } else {
                obj[key] = buf;
            }
            i++; 
        } else {
            let space = text.indexOf(' ', i);
            if (space === -1) space = text.length;
            const val = text.substring(i, space);
            obj[key] = parseInt(val, 10);
            i = space;
        }
    }
    return obj;
}

export class DBManager {
  private store: TxnDatastoreExtended;
  private network: Net;
  private dc: DcUtil;
  private connectedDc: DCConnectInfo;
  private opts: NewOptions;
  private dbs: Map<string, ThreadDb>;
  private lock: AsyncLock;
  public chainUtil: ChainUtil;
  private storagePrefix: string;
  private context: DCContext;

  constructor(
    store: TxnDatastoreExtended, //实际上是一个LevelDatastore实例,用levelDatastoreAdapter包装
    network: Net,
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    opts: NewOptions = {},
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
    this.context = context;
  }
  async loadDbs(): Promise<void> {
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
          const parts = result.key.toString().split("/");
          if (parts.length < 3) {
            continue;
          }
          const id = ThreadID.fromString(parts[2] || "");
          // Check if already loaded
          if (loaded.has(id.toString())) {
            continue;
          }
          // Mark as loaded
          loaded.set(id.toString(), true);
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
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          console.warn(
            `Error loading database: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to load databases: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
        const key = Ed25519PrivKey.fromString(
          uint8ArrayToHex(storedBytes)
        );
        return key;
      } else {
        // Create new key if none exists
        const key = await this.newLogKey();
        this.store.put(new Key(storageKey), key.raw);
        return key;
      }
    } catch (err: any) {
      if (err.code === "ERR_NOT_FOUND") {
        // Create new key if none exists
        const key = await this.newLogKey();
        this.store.put(new Key(storageKey), key.raw);
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
      const privateKey = new Ed25519PrivKey(keyPair.raw);
      return privateKey;
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
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
      const parts = addr.toString().split("/");
      const index = parts.indexOf(Protocol.name);
      // 如果没有协议前缀，当做裸的 ThreadID 字符串解析
      if (index === -1) {
        return ThreadID.fromString(addr.toString());
      }
      if (index === parts.length - 1) {
        throw new Error("thread protocol not found in multiaddr");
      }

      const idstr = parts[index + 1] || "";
      return ThreadID.fromString(idstr);
    } catch (err: any) {
      throw new Error(`Failed to extract ID from multiaddr: ${err.message}`);
    }
  }

  /**
   * ToAddr returns ID wrapped as a multiaddress.
   * @returns Multiaddr instance
   */
  toAddr(): TMultiaddr {
    try {
      const addr = multiaddr(`/${Protocol.name}/${this.toString()}`);
      return addr;
    } catch (err: any) {
      // This should not happen with valid IDs
      throw new Error(`Failed to create multiaddr: ${err.message}`);
    }
  }

  async newDBFromAddr(
    addr: ThreadMuliaddr,
    key: ThreadKey,
    opts: NewOptions = {}
  ): Promise<ThreadDb> {
    const id = addr.id;

    //   return await this.lock.acquire('dbs', async () => {

    if (this.dbs.has(id.toString())) {
      throw Errors.ErrDBExists;
    }

    if (opts.name && !isValidName(opts.name)) {
      throw Errors.ErrInvalidName;
    }

    if (key.defined() && !key.canRead()) {
      throw Errors.ErrThreadReadKeyRequired;
    }

    if (opts.fid && opts.fid.trim().length > 0) {
      if (this.dc.dcNodeClient == null) {
        throw Errors.ErrNoDcNodeClient;
      }
      const tctx = createContext(PullTimeout * 60);
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.chainUtil,
        this.dc.dcNodeClient,
        this.context
      );
      const fileStream = await fileManager.createSeekableFileStream(opts.fid, "");

      if (fileStream == null) {
        throw Errors.ErrFileNotFound;
      }

      await this.preloadDBFromReader(
        tctx,
        fileStream.createReadableStream(),
        addr,
        key,
        opts
      );

      const db = this.dbs.get(id.toString());
      if (!db) {
        throw new Error("DB preload failed to register");
      }

      if (opts.block) {
        await this.network.pullThread(id, pullThreadBackgroundTimeout, {
          token: opts.token,
        });
      } else {
        // Background pull
        this.pullThreadBackground(id, opts.token);
      }

      return db;
    }

    await this.network.addThread(addr, {
      token: opts.token,
      logKey: opts.logKey,
      threadKey: key,
    });

    const collections = opts.collections || [];
    const name = opts.name || "";

    const [store, dbOpts, err] = await this.wrapDB(
      this.store,
      id,
      this.opts,
      name,
      collections
    );
    if (err) {
      throw new Error(`wrapping db: ${err.message}`);
    }
    const db = await ThreadDb.newDB(store, this.network, id, dbOpts);

    this.dbs.set(id.toString(), db);

    if (opts.block) {
      await this.network.pullThread(id, pullThreadBackgroundTimeout, {
        token: opts.token,
      });
    } else {
      // Background pull
      this.pullThreadBackground(id, opts.token);
    }
    return db;
    // });
  }

  private async pullThreadBackground(id: ThreadID, token?: ThreadToken) {
    try {
      await this.network.pullThread(id, pullThreadBackgroundTimeout, {
        token: token,
      });
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(`Error pulling thread ${id}:`, err);
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // Get log key
    let logKey: Ed25519PrivKey;
    try {
      logKey = await this.getLogKey(tID);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // Create peer ID from log key
    let lid: PeerId;
    try {
      lid = peerIdFromPrivateKey(logKey);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
    // Begin connection in background concurrently
    const objNodeConnPromise = this.dc
      ._connectToObjNodes(tID.toString())
      .catch((err) => {
        console.warn(`Error connecting to object nodes: ${err.message}`);
        return [null, null] as [TMultiaddr | null, string[] | null];
      });

    // Generate thread key
    let threadKey: ThreadKey;
    try {
      const sk = SymmetricKey.fromString(b32Sk);
      const rk = SymmetricKey.fromString(b32Rk);
      threadKey = new ThreadKey(sk, rk);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    let multiAddr: TMultiaddr | undefined;

    // Try to connect using provided dbAddr
    let connectedConn: Connection | undefined;
    if (dbAddr && dbAddr.length > 10) {
      try {
        // Try to parse address info and connect
        const peerAddrInfo = multiaddr(dbAddr);
        connectedConn = await this.dc.dcNodeClient?.libp2p.dial(peerAddrInfo, {
          signal: AbortSignal.timeout(3000),
        });

        if (connectedConn) {
          multiAddr = connectedConn.remoteAddr as TMultiaddr;
        }
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        // Connection failed or invalid address
      }
    }

    // If direct connection failed, fallback to the background object nodes connection
    if (!connectedConn) {
      try {
        const [connectedAddr, _] = await objNodeConnPromise;
        if (!connectedAddr) {
          throw Errors.ErrNoThreadOnDc;
        }
        multiAddr = connectedAddr as TMultiaddr;
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        throw err;
      }
    }

    // Parse collection info
    let collectionInfos: ICollectionConfig[] = [];
    try {
      collectionInfos = JSON.parse(jsonCollections);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // Create collection configurations
    const collections = collectionInfos.map((info) => ({
      name: info.name,
      schema: info.schema,
      indexes: info.indexes || [],
    }));

    // Create options for new database
    const dbOpts: NewOptions = {
      name: dbname,
      collections: collections,
      key: threadKey,
      logKey: logKey,
      block: block,
    };

    // Delete existing database if it exists
    try {
      await this.deleteDB(tID, true);
    } catch (err: any) {
      // Ignore specific errors
      if (
        err !== Errors.ErrDBNotFound &&
        err !== Errors.ErrThreadNotFound &&
        err?.message !== Errors.ErrDBNotFound.message &&
        err?.message !== Errors.ErrThreadNotFound.message
      ) {
        throw err;
      }
    }
    if (this.dc.dcNodeClient == null) {
      throw Errors.ErrNoDcNodeClient;
    }
    // Create context with extended timeout for file download
    const tctx = createContext(PullTimeout * 60);
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
    await this.preloadDBFromReader(
      tctx,
      fileStream.createReadableStream(),
      threadMultiaddr,
      threadKey,
      dbOpts
    );
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
      id = addr.id ? addr.id : DBManager.fromAddr(addr.addr);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
    // 检查数据库是否已存在
    // await this.lock.acquire('dbs', async () => {
    if (this.dbs.has(id.toString())) {
      throw Errors.ErrDBExists;
    }
    //});
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
        token: opts.token,
      });
    } catch (err: any) {
      if (err.message && (err.message.includes("Log exists") || err.message.includes("thread already exists"))) {
        console.warn("manager: thread log already exists, safely clearing local states first...");
        try {
          await this.network.deleteThread(id);
        } catch (delNetErr) {
          console.warn(`Failed to delete thread from network: ${delNetErr}`);
        }
        try {
          await this.deleteThreadNamespace(id);
        } catch (delNamespaceErr) {
          console.warn(`Failed to clear thread namespace: ${delNamespaceErr}`);
        }
        
        // 清理完成后重试添加
        console.debug(`manager: re-adding thread to net ${id}`);
        await this.network.addThread(addr, {
          threadKey: key,
          logKey: opts.logKey,
          token: opts.token,
        });
      } else {
        throw err;
      }
    }
    console.debug(`manager: added thread to net ${id}`);

    // 包装数据库
    let store: TxnDatastoreExtended;
    let dbOpts: NewOptions;
    try {
      const collections = opts.collections || [];
      const name = opts.name || "";
      let wrapErr: Error | null;
      [store, dbOpts, wrapErr] = await this.wrapDB(
        this.store,
        id,
        this.opts,
        name,
        collections
      );
      if (wrapErr) {
        throw wrapErr;
      }
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // 创建新数据库
    let db: ThreadDb;
    try {
      db = await ThreadDb.newDB(store, this.network, id, dbOpts);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // 添加数据库到管理器
    // await this.lock.acquire('dbs', async () => {
    this.dbs.set(id.toString(), db);
    // });

    try {
      // 导入数据库状态
      const readKey = key.read();
      if (!readKey) {
        throw new Error(`read key not found for thread ${id}`);
      }

      // 创建行读取器
      const lineReader = new LineReader(ioReader);

      // 读取第一行并更新线程信息的日志头
      const value = await lineReader.readLine();
      let stateValue = value || "";
      if (stateValue == "") {
        throw new Error(`empty state value for thread ${id}`);
      }
      
// 移除头部32位hash已经被遗弃，流读取器已自动跳过 32 字节的文件头

      // 更新线程信息的日志头
      const logs = stateValue.split(";");
      const pbLogs: net_pb.pb.Log[] = [];

      for (const log of logs) {
        try {
          // 解码 multibase 格式
          const data = multibaseDecode(log);
          // 解析 protobuf
          const decodedText = new TextDecoder().decode(data);
          // Go SDK 使用的是 proto.UnmarshalText，产出 TextFormat 字符串，因此需要手动解析兼容该格式
          let pbLog: any;
          try {
            // 首先尝试用标准 Binary 解析（兼容纯TS导出的旧有DB格式情况）
            pbLog = net_pb.pb.Log.decode(data);
            // 如果成功解出 ID 字段且为正常类型，则沿用
            if (!pbLog.ID || pbLog.ID.length === 0) {
               throw new Error("fallback to text parse");
            }
          } catch (e) {
            // 如果报错或是空，回退到 Go 专用的 TextFormat 兼容文本解析 
            const parsedObj = parseTextFormatLog(decodedText);
            pbLog = net_pb.pb.Log.create(parsedObj);
          }
          pbLogs.push(pbLog);
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          // 忽略错误，继续处理
          continue;
        }
      }

      // 预加载日志
      await this.network.preLoadLogs(id, pbLogs);

      // 导入数据库状态
      await this.importDBStateFromReader(id, lineReader, readKey);

    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      // 回滚数据库状态: 若执行过程中发生数据导入失败，应当彻底清理残留的Thread记录（置为 true）
      try {
        await this.deleteDB(id, true);
      } catch (rollbackErr) {
        console.warn(`Failed to rollback db ${id}: ${rollbackErr}`);
      }
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
    id: string | ThreadID,
    fileName: string,
    readKey?: SymmetricKey,
    saveToFile: boolean = true
  ): Promise<[ThreadInfo, Uint8Array]> {
    let tId: ThreadID;
    if (typeof id === "string") {
      tId = ThreadID.fromString(id);
    } else {
      tId = id;
    }
    console.debug(`manager: exporting db ${tId.toString()} to file download`);

    // Get thread logs similar to original function
    let logState = "";
    let logs: net_pb.pb.ILog[];
    let threadInfo: ThreadInfo;

    [logs, threadInfo] = await this.network.getPbLogs(tId);

    // Build log state string
    for (let i = 0; logs && i < logs.length; i++) {
      if (!logs[i]) {
        continue; // Skip undefined logs
      }
      const log = logs[i] as net_pb.pb.ILog;
      const logText = textFormatLog(log);
      const logBytes = new TextEncoder().encode(logText);
      const mbaseLog = multibase.encode("base64", logBytes);

      if (i === 0) {
        logState = new TextDecoder().decode(mbaseLog);
      } else {
        logState = `${logState};${new TextDecoder().decode(mbaseLog)}`;
      }
    }

    // Create content in memory instead of writing to file
    let content = logState + "\n";

    // Get database
    const db = this.dbs.get(tId.toString());
    if (!db) {
      throw Errors.ErrDBNotFound;
    }

    // Create transaction
    const txn = await db.datastore.newTransactionExtended(true);

    try {
        // Accumulating db records in memory.
        // 注意：这里必须与 Go 端保持一致，只导出业务文档数据集合（前缀为 /db/collection），
        // 绝不能写 "/" 把底层索引 /_index/ 等缓存账本一起导出去。导入时会自动触发新建索引。
        const iter = await txn.queryExtended({ prefix: "/db/collection" });

        for await (const res of iter) {
          let line: string;
          if (readKey) {
            const encBytes = await readKey.encrypt(res.value);
            const mValue = multibase.encode("base64", encBytes);
            line = `${res.key}|${new TextDecoder().decode(mValue)}`;
          } else {
            const mValue = multibase.encode("base64", res.value);
            line = `${res.key}|${new TextDecoder().decode(mValue)}`;
            }

        content += line + "\n";
      }

      
      await txn.discard();

      if (saveToFile) {
        // Create blob and trigger download
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || `db-export-${tId.toString().substring(0, 8)}.txt`;

        // Append to body, click and remove
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }

      const fileBytes = new TextEncoder().encode(content);
      return [threadInfo, fileBytes];
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      await txn.discard();
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
    // await this.lock.acquire('dbs', async () => {
    db = this.dbs.get(id.toString());
    // });

    if (!db) {
      throw Errors.ErrDBNotFound;
    }

    // 获取索引函数
    const indexFunc = db.defaultIndexFunc();

    // 设置行读取
    let done = false;
    let line: string | null = "";
    while (true) {
      line = await lineReader.readLine();
      if (!line) break;
      line = line.trim();
      if (!line) continue;
      // 创建事务
      let txn: Transaction;
      try {
        txn = await db.datastore.newTransactionExtended(false);
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        throw new Error(
          `创建事务错误: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      try {
        // 解析键值对
        const kv = line.split("|");
        if (kv.length !== 2) {
          await txn.discard();
          throw new Error("无效的记录格式");
        }

        const key = kv[0];
        const mValue = kv[1] || "";

        // 使用multibase解码值
        let encValue: Uint8Array;
        try {
          const decoded = multibaseDecode(mValue);
          encValue = decoded;
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          await txn.discard();
          throw new Error(
            `multibase解码失败: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }

        // 如有需要解密记录
        let decValue = encValue;
        if (readKey) {
          try {
            decValue = await readKey.decrypt(encValue);
          } catch (err: any) {
      console.error(`🚨 Fatal error during database preload at decrypting value for key ${key}: ${err instanceof Error ? err.message : err}. key hex length: ${encValue.length}`);
            console.error(`🚨 Decrypt failed for key ${key}. encValue length: ${encValue.length}. raw mValue: ${mValue}. Skipping this record.`);
            await txn.discard();
            continue;
          }
        }

        if (key === "loginfo" || key === "/loginfo") {
          try {
            const strLogInfo = new TextDecoder().decode(decValue);
            console.log("💡 [importDBStateFromReader] 成功解析到 loginfo 标记:", strLogInfo);
            const parsedLogs = JSON.parse(strLogInfo);
            for (const logItem of parsedLogs) {
               if (logItem.lid && logItem.head && logItem.head.id) {
                 const cidStr = logItem.head.id;
                 console.log(`💡 [importDBStateFromReader] 注册免拉标记: lid=${logItem.lid} head=${cidStr} counter=${logItem.head.counter}`);
                 
                 // 1. 写入预加载的免拉标记
                 await (this.network as any).logstore.metadata.putBool(
                   id,
                   `/preloaded_head/${cidStr}`,
                   true
                 );
               }
            }
            await txn.discard();
            continue; // 跳过后续 DB 写入，直接读取下一行
          } catch (e: any) {
            console.warn("⚠️ [importDBStateFromReader] 解析 loginfo JSON 失败: " + e.message);
            await txn.discard();
            continue;
          }
        }
        
        // 创建数据存储键
        const setKey = new Key(key || "");

        // 检查键是否已存在
        try {
          const exists = await txn.has(setKey);
          if (exists) {
            await txn.discard();
            continue; // 跳过此记录
          }
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          await txn.discard();
          throw new Error(
            `检查键存在性失败: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }

        // 存储值
        try {
          await txn.put(setKey, decValue);
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          await txn.discard();
          throw new Error(
            `存储值失败: ${err instanceof Error ? err.message : String(err)}`
          );
        }

        // 解析键值对所属的集合名称（仅处理业务文档记录：/db/collection/<集合名>/<文档ID>）
        const parts = key?.split("/");
        
        let collection: string | null = null;
        // 过滤掉索引记录（_index开头）、系统变量（长度小于5）以及非业务集合的记录
        if (parts && parts.length === 5 && parts[1] === "db" && parts[2] === "collection") {
          collection = parts[3] || "";
        }

        // 仅在找到了疑似集合名称时尝试应用索引
        if (collection) {
          try {
            await indexFunc(collection, setKey, txn, undefined, decValue);
          } catch (err: any) {
            // 如果是因为集合不存在（例如由于该键实际属于DB元数据或非文档记录），则安全跳过它，防止奔溃
            if (err && err.message && (err.message.includes("not found") || err.message.toLowerCase().includes("collection"))) {
              // 属于正常的内部索引记录或系统级变量，静默忽略以避免控制台日志刷屏
            } else {
              await txn.discard();
              throw new Error(
                `应用索引失败: ${err instanceof Error ? err.message : String(err)}`
              );
            }
          }
        }

        // 提交事务
        try {
          await txn.commit();
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
          await txn.discard();
          throw new Error(
            `提交事务失败: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        // 确保在任何失败时丢弃事务
        try {
          await txn.discard();
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
  async wrapDB(
    store: TxnDatastoreExtended,
    id: ThreadID,
    base: NewOptions,
    name: string,
    collections: ICollectionConfig[]
  ): Promise<[TxnDatastoreExtended, NewOptions, Error | null]> {
    const isValid = await this.validateThreadId(id.toString());
    if (!isValid) {
      return [
        null as unknown as TxnDatastoreExtended,
        null as unknown as NewOptions,
        new Error("Invalid Thread ID"),
      ];
    }
    // 创建前缀转换器并包装数据存储
    const prefix = dsManagerBaseKey.child(new Key(id.toString())).toString();
    const transform = new PrefixTransform(prefix);
    //const wrappedStore = new TransformedDatastore(store, transform);
    const wrappedStore = createTransformedDatastore(store, transform);
    // 创建新的选项对象
    const opts: NewOptions = {
      name: name,
      collections: [...(base.collections || []), ...collections],
      eventCodec: base.eventCodec,
      debug: base.debug,
    };

    return [wrappedStore, opts, null];
  }

  async listDBs(): Promise<Map<ThreadID, ThreadDb>> {
    const dbs = new Map();
    //   await this.lock.acquire('dbs', async () => {
    for (const [idStr, db] of this.dbs) {
      const id = ThreadID.fromString(idStr);
      await this.network.getThread(id);
      dbs.set(id, db);
    }
    //  });
    return dbs;
  }

  async ifSyncDBToDCSuccess(tId: string): Promise<boolean> {
    try {
      const [storeUnit, err] = await this.chainUtil.objectState(tId);
      if (!storeUnit || err) return false;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), PullTimeout);

        const checkPeers = async () => {
          for (const pid of Object.keys(storeUnit.peers)) {
            try {
              const peerId = peerIdFromString(pid);
              const threadId = ThreadID.fromString(tId);
              const remoteInfo = await this.network.getThreadFromPeer(
                threadId,
                peerId,
                {}
              );
              const localInfo = await this.network.getThread(threadId);
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

  private compareThreadSync(
    local: ThreadInfo,
    remote: ThreadInfo,
    storeUnit: StoreunitInfo
  ): boolean {
    for (const logInfo of local.logs) {
      if (!storeUnit.logs.has(logInfo.id.toString())) {
        continue;
      }
      if (!logInfo.head) {
        continue;
      }
      const remoteLog = remote.logs.find((l) => l.id === logInfo.id);
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
      const lid = peerIdFromPrivateKey(logKey);
      const [threadInfo, err] = await this.chainUtil.objectState(
        tid.toString()
      );
      if (!threadInfo || err) {
        return false;
      }
      const exist = threadInfo ? threadInfo?.logs.has(lid.toString()) : false;
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
    collectionInfos: ICollectionConfig[],
    fid?: string
  ): Promise<Error | null> {
    try {
      const tID = await this.decodeThreadId(threadid);
      const logKey = await this.getLogKey(tID);
      const lid = peerIdFromPrivateKey(logKey);
      await this.dc._connectToObjNodes(threadid);
      // await this.addLogToThreadStart(ctx,tID, lid); //移动到首次上报数据这边,避免空log上链
      const sk = SymmetricKey.fromString(b32Sk);
      const rk = SymmetricKey.fromString(b32Rk);
      const threadKey = new ThreadKey(sk, rk);
      let connectedFlag = false;
      let connectedConn: Connection | undefined;
      let fullMultiAddr: TMultiaddr | undefined;
      let threadAddr: TMultiaddr;
      let connectedPeerId: PeerId;
      let dbMultiAddr: TMultiaddr;
      if (dbAddr.length > 0) {
        try {
          //
          connectedConn = await this.dc.dcNodeClient?.libp2p.dial(
            multiaddr(dbAddr),
            {
              signal: AbortSignal.timeout(dial_timeout),
            }
          );
        } catch (error) {
          const errMsg = (error as any).message;
          console.log("connect to %s catch return, error:%s", dbAddr, errMsg);
        }
      }

      if (connectedConn) {
        //连接成功
        connectedPeerId = connectedConn?.remotePeer;
        dbMultiAddr = connectedConn.remoteAddr as any;
      } else {
        //从区块链中获取节点信息,再连接
        const [connectedAddr, peers] = await this.dc._connectToObjNodes(
          threadid
        );
        if (!connectedAddr) {
          throw new Error("connect to obj nodes failed");
        }
        dbMultiAddr = connectedAddr as any;
      }

      const collections = collectionInfos.map((info) => ({
        name: info.name,
        schema: info.schema,
        indexes: info.indexes || [],
      }));

      const dbOpts: NewOptions = {
        name: dbname,
        collections: collections,
        key: threadKey,
        logKey: logKey,
        block: block,
        fid: fid,
      };

      // Delete existing database if present
      try {
        await this.deleteDB(tID, false);
      } catch (error) {
        const errMsg = (error as any).message;
        if (
          errMsg != Errors.ErrDBNotFound.message &&
          errMsg != Errors.ErrThreadNotFound.message
        ) {
          throw error;
        }
      }
      const threadMultiaddr = new ThreadMuliaddr(dbMultiAddr, tID);
      await this.newDBFromAddr(threadMultiaddr, threadKey, dbOpts);
      return null;
    } catch (error) {
      const errMsg = (error as any).message;
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
      const threadInfo = await this.network.getThread(tid);
      if (!threadInfo) {
        return count;
      }
      for (const logInfo of threadInfo.logs) {
        if (!logInfo.head) {
          continue;
        }
        count += logInfo.head.counter;
        
      }
    } catch (error) {
      console.warn(
        `Error getting records count for thread ${threadid}:`,
        error
      );
    }
    return count;
  }

  async addLogToThread(ctx: Context, id: ThreadID, lid: PeerId): Promise<void> {
    let blockHeight: number;
    try {
      blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    // 生成用户签名
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight || 0
    );

    const peerId = this.connectedDc.nodeAddr
      ? await extractPeerIdFromMultiaddr(this.connectedDc.nodeAddr)
      : undefined;
    const peerIdValue: Uint8Array = new TextEncoder().encode(
      peerId?.toString() || ""
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
    if (!this.connectedDc?.client) {
      throw Errors.ErrNoDcPeerConnected;
    }

    const opts: NewThreadOptions = {
      token: new ThreadToken(this.connectedDc.client.token),
      blockHeight: blockHeight,
      signature: signature,
    };
    const dbClient = newGrpcClient(this.connectedDc.client, this.network);
    await dbClient.addLogToThread(id.toString(), lid.toString(), opts);
  }

  async addLogToThreadStart(
    ctx: Context | null,
    id: ThreadID,
    lid: PeerId
  ): Promise<void> {
    if (!ctx) {
      ctx = createContext(60000);
    }

    const [storeUnit, err] = await this.chainUtil.objectState(id.toString());
    if (storeUnit && !err) {
      const userPubkey = this.context.getPublicKey();
      let findFlag = false;
      for (const user of storeUnit.users) {
        //移除0x前缀
        const noPrefixUser = user.replace("0x", "").toLowerCase();
        if (noPrefixUser === userPubkey.toString().toLowerCase()) {
          findFlag = true;
          break;
        }
      }
      if (!findFlag) {
        throw new Error("user not in the thread");
      }
      //判断是否已经上报过了
      const exist = storeUnit ? storeUnit.logs.has(lid.toString()) : false;
      if (exist) {
        return;
      }
    }

    try {
      await this.addLogToThread(ctx, id, lid);
    } catch (error) {
      //允许报错
    }

    let count = 0;
    const maxCount = 10;

    while (true) {
      if (ctx.signal?.aborted) return;
      if (ctx.deadline && Date.now() > ctx.deadline.getTime()) return;

      // Check success
      try {
        const [info, err] = await this.chainUtil.objectState(id.toString());
        if (info && !err && info.logs.has(lid.toString())) {
          return;
        }
      } catch (e) {}

      await new Promise((resolve) => setTimeout(resolve, 1000));

      count++;
      if (count >= maxCount) {
        count = 0;
        try {
          await this.addLogToThread(ctx, id, lid);
        } catch (error) {}
      }
    }
  }

  async newDB(
    dbname: string,
    b32Rk: string,
    b32Sk: string,
    collectionInfos: ICollectionConfig[],
    fid?: string
  ): Promise<[string, Error | null]> {
    if (!this.connectedDc?.client) {
      return ["", Errors.ErrNoDcPeerConnected];
    }
    try {
      const dbClient = newGrpcClient(this.connectedDc.client, this.network);
      const tidStr = await dbClient.requestThreadID();
      const threadID = await this.decodeThreadId(tidStr);
      const logKey = await this.getLogKey(threadID);
      const lpk = logKey.publicKey;
      const lid = peerIdFromPrivateKey(logKey);
      const sk = SymmetricKey.fromString(b32Sk);
      const rk = SymmetricKey.fromString(b32Rk);
      const threadKey = new ThreadKey(sk, rk);
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;

      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      if (!this.connectedDc?.nodeAddr) {
        return ["", Errors.ErrNodeAddrIsNull];
      }
      const rPeerId = await extractPeerIdFromMultiaddr(
        this.connectedDc.nodeAddr
      );
      const peerIdValue: Uint8Array = new TextEncoder().encode(
        rPeerId.toString()
      );
      const sizeValue: Uint8Array = uint64ToLittleEndianBytes(50 << 20); //数据库固定大小50M
      const tidUnit8Array = new TextEncoder().encode(tidStr);

      const typeValue: Uint8Array = uint32ToLittleEndianBytes(
        Type.Threaddbtype
      );
      const preSign = new Uint8Array([
        ...tidUnit8Array,
        ...sizeValue,
        ...hValue,
        ...typeValue,
        ...peerIdValue,
      ]);
      const signature = await this.context.sign(preSign);

      // Create thread options
      const opts: NewThreadOptions = {
        threadKey: threadKey,
        logKey: logKey,
        token: new ThreadToken(this.connectedDc.client.token),
        blockHeight: blockHeight,
        signature: signature,
      };
      const threadInfo = await dbClient.createThread(threadID.toString(), opts);
      const collections = collectionInfos.map((info) => ({
        name: info.name,
        schema: info.schema,
        indexes: info.indexes || [],
      }));

      const dbOpts: NewOptions = {
        name: dbname,
        collections: collections,
        key: threadKey,
        logKey: logKey,
        block: true,
        fid: fid,
      };

      // Try creating database
      const errors: string[] = [];
      for (const multiAddr of threadInfo.addrs) {
        try {
          await this.newDBFromAddr(multiAddr, threadKey, dbOpts);
          break;
        } catch (error: any) {
          errors.push(error.message);
        }
      }

      if (errors.length === threadInfo.addrs.length) {
        throw new Error(`create db failed:${errors.join(",")}`);
      }
      //移除log与thread的添加,只有在推送记录时才添加
     // const ctx = createContext(30000);
     //    this.addLogToThreadStart(ctx, threadID, lid);
      return [threadID.toString(), null];
    } catch (error) {
      return ["", error as Error];
    }
  }

  async refreshDBFromDC(threadId: string): Promise<Error | null> {
    try {
      const tId = await this.decodeThreadId(threadId);
      await this.network.pullThread(tId, 600, { multiPeersFlag: true });
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  async syncDBToDC(threadId: string): Promise<Error | null> {
    if (!this.network) {
      return Errors.ErrP2pNetworkNotInit;
    }
    try {
      const tId = await this.decodeThreadId(threadId);
      await this.network.exchange(tId);
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  async upgradeCollections(
    threadId: string,
    configs: ICollectionConfig[]
  ): Promise<Error | null> {
    try {
      const tId = await this.decodeThreadId(threadId);
      const db = this.dbs.get(tId.toString());
      if (!db) {
        return Errors.ErrDBNotFound;
      }
      await db.upgradeCollections(configs);
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  private async decodeThreadId(threadid: string): Promise<ThreadID> {
    if (!threadid) {
      throw new Error("Thread ID is empty");
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
        throw new Error("Thread ID too short");
      }

      return threadID;
    } catch (error) {
      const errMsg = (error as any).message;
      if (errMsg === Errors.ErrorThreadIDValidation.message) {
        throw error;
      }
      throw new Error(`Failed to decode thread ID: $errMsg}`);
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
    //   await this.lock.acquire('dbs', async () => {
    for (const db of this.dbs.values()) {
      await db.close();
    }
    this.dbs.clear();
    //  });
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    const db = this.dbs.get(id.toString());
    if (!db) {
      throw Errors.ErrDBNotFound;
    }
    return db;
  }

  async getDBInfo(
    id: ThreadID,
    opts?: ManagedOptions
  ): Promise<[IDBInfo | null, Error | null]> {
    let dbInfo: IDBInfo | null = null;
    try {
      const db = this.dbs.get(id.toString());
      if (!db) {
        throw Errors.ErrDBNotFound;
      }
      dbInfo = await db.getDBInfo(opts);
      if (!dbInfo || dbInfo === null) {
        throw new Error(`No info available for db ${id}`);
      }
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      return [null, err as Error];
    }
    return [dbInfo, null];
  }

  // DeleteDB deletes a db by id.
  async deleteDB(
    id: ThreadID,
    deleteThreadFlag: boolean,
    opts?: ManagedOptions
  ): Promise<void> {
    console.debug(`manager: deleting db ${id}`);

    console.debug(`manager: getting thread ${id} from net`);
    try {
      await this.network.getThread(id, { token: opts?.token });
      console.debug(`manager: got thread ${id} from net`);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    const db = this.dbs.get(id.toString());
    if (!db) {
      throw Errors.ErrDBNotFound;
    }

    try {
      await db.close();
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    if (deleteThreadFlag) {
      console.debug(`manager: deleting thread ${id} from net`);
      try {
        await this.network.deleteThread(id, {
          token: opts?.token,
          apiToken: db.connector?.token,
        });
        console.debug(`manager: deleted thread ${id} from net`);
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        throw err;
      }
    }

    try {
      await this.deleteThreadNamespace(id);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
    //   this.lock.acquire('dbs', async () => {
    this.dbs.delete(id.toString());
    console.debug(`manager: deleted db ${id}`);
    //  });
  }

  /**
   * 为指定的threaddb添加可使用空间
   * Add usable space to a specified threaddb
   * @param threadid Thread ID string
   * @param space Space to add (uint32)
   * @returns Promise that resolves when space is added
   */
  async addDBSpace(threadid: string, space: number): Promise<void> {
    try {
      // Decode thread ID
      const tID = await this.decodeThreadId(threadid);

      // Get server peer ID bytes
      const peerId = this.connectedDc.nodeAddr
        ? await extractPeerIdFromMultiaddr(this.connectedDc.nodeAddr)
        : undefined;
      const serverPidBytes = new TextEncoder().encode(peerId?.toString() || "");

      // Get blockchain height
      let blockHeight: number;
      try {
        blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        throw err;
      }

      // Convert blockHeight to little endian bytes
      const bhValue = uint32ToLittleEndianBytes(blockHeight);

      // Convert space to little endian bytes
      const spaceValue = uint32ToLittleEndianBytes(space);

      // Build signature data: sign(threadID+blockheight+space+peerid)
      const preSign = new Uint8Array([
        ...new TextEncoder().encode(threadid),
        ...bhValue,
        ...spaceValue,
        ...serverPidBytes,
      ]);

      // Sign the data
      let signature: Uint8Array;
      try {
        signature = await this.context.sign(preSign);
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        throw err;
      }

      // Check if client is connected
      if (!this.connectedDc?.client) {
        throw Errors.ErrNoDcPeerConnected;
      }

      // Create options
      const opts: NewThreadOptions = {
        token: new ThreadToken(this.connectedDc.client.token),
        blockHeight: blockHeight,
        signature: signature,
      };

      // Create gRPC client and call addThreadSpace
      const dbClient = newGrpcClient(this.connectedDc.client, this.network);

      await dbClient.addThreadSpace(tID, space, opts);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn("addDBSpace error:", err);
      throw err;
    }
  }

  /**
   * 获取当前threaddb已经使用的存储大小
   * Get the current storage size info of threaddb
   * @param threadid Thread ID string
   * @returns Promise resolving to object with allocatedSize and usedSize
   */
  async getThreadDBSizeInfo(
    threadid: string
  ): Promise<{ allocatedSize: number; usedSize: number }> {
    try {
      // Decode thread ID
      const tID = await this.decodeThreadId(threadid);

      // 从链上获取用户给该threaddb分配的空间
      // 查询区块链获取文件存储的节点位置
      const [storeUnit, err] = await this.chainUtil.objectState(tID.toString());
      if (err || !storeUnit) {
        throw new Error(
          `Failed to get object state: ${err?.message || "storeUnit is null"}`
        );
      }

      const allocatedSize = storeUnit.size || 0;

      // 连接到对象节点
      const [connectedAddr] = await this.dc._connectToObjNodes(tID.toString());
      if (!connectedAddr) {
        throw new Error("Failed to connect to object nodes");
      }

      // Check if client is connected
      if (!this.connectedDc?.client) {
        throw Errors.ErrNoDcPeerConnected;
      }

      // Create gRPC client and get used space
      const dbClient = newGrpcClient(this.connectedDc.client, this.network);
      const usedSize = await dbClient.getThreadUsedSpace(tID);

      return {
        allocatedSize,
        usedSize,
      };
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn("getThreadDBSizeInfo error:", err);
      throw err;
    }
  }

  //// 自动扩展数据库空间
  async autoExpandDBSpace(
    threadId: string,
    expandSpace: number = 50 * 1024 * 1024
  ): Promise<boolean> {
    // 获取当前数据库大小信息
    let sizeInfo;
    try {
      sizeInfo = await this.getThreadDBSizeInfo(threadId);
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn("Failed to get DB size info:", err);
      return false;
    }

    const { allocatedSize, usedSize } = sizeInfo;
    //剩余15M空间时触发扩展
    const threshold = 15 * 1024 * 1024; // 15 MB
    if (allocatedSize - usedSize > threshold) {
      return false; // 不需要扩展
    }

    try {
      await this.addDBSpace(threadId, expandSpace);
      console.info(
        `Auto expanded DB space by ${expandSpace} bytes for thread ${threadId}`
      );
      return true;
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn("Failed to auto expand DB space:", err);
      return false;
    }
  }

  private async deleteThreadNamespace(id: ThreadID): Promise<void> {
    const pre = dsManagerBaseKey.child(new Key(id.toString())).toString();
    const q = { prefix: pre, keysOnly: true };
    const results = this.store.query(q);
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
  async create(
    threadId: string,
    collectionName: string,
    jsonInstance: string
  ): Promise<string> {
    // // 检查实例大小
    // if (jsonInstance.length > 100 * 1024) { // 100 KB
    // throw new Error("instance too big");
    // }

    // 判断instance里面是否有_mod字段,存在则删除
    try {
      const instanceObj = JSON.parse(jsonInstance);
      if (
        instanceObj &&
        typeof instanceObj === "object" &&
        "_mod" in instanceObj
      ) {
        delete instanceObj._mod;
        jsonInstance = JSON.stringify(instanceObj);
      }
    } catch (err: any) {
      // JSON 解析失败：实例不是合法 JSON，拒绝写入
      console.warn("Failed to parse instance JSON:", err);
      throw new Error("Invalid instance JSON format");
    }
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
      const instanceID = await collection.create(new TextEncoder().encode(jsonInstance));
      // 返回实例ID
      return instanceID ? instanceID.toString() : "";
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to create instance: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
  async delete(
    threadId: string,
    collectionName: string,
    instanceID: string
  ): Promise<void> {
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to delete instance: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
  async save(
    threadId: string,
    collectionName: string,
    instance: string
  ): Promise<void> {
    // // 检查实例大小
    // if (instance.length > 100 * 1024) { // 100 KB
    //     throw new Error("instance too big");
    // }

    try {
      // 解码线程ID
      const tID = ThreadID.fromString(threadId);

      // 判断instance里面是否有_mod字段,存在则删除
      try {
        const instanceObj = JSON.parse(instance);
        if (
          instanceObj &&
          typeof instanceObj === "object" &&
          "_mod" in instanceObj
        ) {
          delete instanceObj._mod;
          instance = JSON.stringify(instanceObj);
        }
      } catch (err: any) {
        // JSON 解析失败：实例不是合法 JSON，拒绝写入
        console.warn("Failed to parse instance JSON:", err);
        throw new Error("Invalid instance JSON format");
      }

      // 获取线程数据库
      const threadDB = await this.getDB(tID);

      // 获取集合
      const collection = threadDB.getCollection(collectionName);
      if (!collection) {
        throw new Error("Collection does not exist");
      }
      // 保存实例
      await collection.save(new TextEncoder().encode(instance));
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to save instance: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
  async deleteMany(
    threadId: string,
    collectionName: string,
    instanceIDs: string
  ): Promise<void> {
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

      if (instanceIDs[0] !== "[") {
        // 逗号分隔的ID列表
        IDs = instanceIDs.split(",");
      } else {
        // JSON数组
        try {
          IDs = JSON.parse(instanceIDs);
        } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to delete instances: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
  async has(
    threadId: string,
    collectionName: string,
    instanceID: string
  ): Promise<boolean> {
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to check instance existence: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      return false;
    }
  }

    /**
     * 重建集合中的一个或所有索引。
     * 只影响本地LevelStore。
     * 适用于已存在数据但后来添加了索引的场景。
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param indexName Optional index path name. Rebuilds all indexes if undefined
     */
    async rebuildIndex(
      threadId: string,
      collectionName: string,
      indexName?: string
    ): Promise<void> {
      try {
        const tID = await this.decodeThreadId(threadId);

        const threadDB = this.dbs.get(tID.toString());
        if (!threadDB) {
          throw new Error(`ThreadDB not found for id: ${threadId}`);
        }

        const collection = threadDB.collections.get(collectionName);
        if (!collection) {
          throw new Error(`Collection not found: ${collectionName}`);
        }
        
        await collection.rebuildIndex(indexName);
      } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
        console.warn(
          `Failed to rebuild index for collection ${collectionName}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        throw err;
      }
    }


  /**
   * 查询本地库指定集合是否有 _mod 字段的索引
   * 注: 仅查询本地已加载或存在的DB状态，不进行网络同步
   * @param threadId Thread ID string
   * @param collectionName Collection name
   */
  async hasModIndex(
    threadId: string,
    collectionName: string
  ): Promise<boolean> {
    try {
      const tID = await this.decodeThreadId(threadId);

      const threadDB = this.dbs.get(tID.toString());
      if (!threadDB) {
        return false;
      }

      // 使用 collections.get 避免因 collection 不存在抛出异常污染日志
      const collection = threadDB.collections.get(collectionName);
      if (!collection) {
        return false;
      }
      
      return collection.indexes.has("_mod");
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to check _mod index existence: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
  async find(
    threadId: string,
    collectionName: string,
    queryString?: string
  ): Promise<string> {
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
        const resultArray = results as Uint8Array[];
        
        // Helper function to concatenate Uint8Arrays
        const concatUint8Arrays = (arrays: Uint8Array[]): Uint8Array => {
          const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
          const result = new Uint8Array(totalLength);
          let offset = 0;
          for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
          }
          return result;
        };
        
        const openBracket = new TextEncoder().encode("[");
        const closeBracket = new TextEncoder().encode("]");
        const comma = new TextEncoder().encode(",");
        const empty = new Uint8Array(0);
        
        const joinedResult = concatUint8Arrays([
          openBracket,
          concatUint8Arrays(
            resultArray.map((buf, idx) =>
              concatUint8Arrays([
                buf,
                idx < resultArray.length - 1 ? comma : empty,
              ])
            )
          ),
          closeBracket,
        ]);
        return new TextDecoder().decode(joinedResult);
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      // 集合/记录首次访问尚不存在(collection/instance/index not found)属正常控制流,
      // 不打印误导性的 "Fatal error during database preload" 噪音,仍原样抛出保持契约。
      const benignNotFound =
        /collection|instance|index/i.test(msg) &&
        /not found|does not exist/i.test(msg);
      if (!benignNotFound) {
        console.error(`🚨 Fatal error during database preload: ${msg}`);
        console.warn(`Failed to find instances: ${msg}`);
      }
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
  async findByID(
    threadId: string,
    collectionName: string,
    instanceID: string
  ): Promise<string> {
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
      return result instanceof Uint8Array
        ? new TextDecoder().decode(result)
        : jsonStringify(result);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      // "instance not found" / "ERR_NOT_FOUND" 是正常的“记录不存在”场景（如新用户首次查询），
      // 并非致命错误：上层 DatabaseModule.findByID 会以 [null, err] 元组形式优雅返回，
      // 调用方据此返回默认值即可。这里不再打印误导性的“Fatal error”日志，仅原样抛出由上层处理。
      if (!/instance not found|ERR_NOT_FOUND/i.test(msg)) {
        console.error(`🚨 Fatal error during database preload: ${msg}`);
        console.warn(`Failed to find instance by ID: ${msg}`);
      }
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
  async modifiedSince(
    threadId: string,
    collectionName: string,
    time: number
  ): Promise<string> {
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
    } catch (err: any) {
      console.error(`🚨 Fatal error during database preload: ${err instanceof Error ? err.message : err}`);
      console.warn(
        `Failed to get modified instances: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
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
    let resolveFn!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolveFn = resolve;
    });
    this.locks.set(key, promise);

    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      // 重新抛出错误以保持类型一致性
      throw err;
    } finally {
      this.locks.delete(key);
      if (resolveFn) resolveFn();
    }
  }
}

function isValidName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

export function createContext(timeout: number): Context {
  const ctx: Context = {
    deadline: new Date(Date.now() + timeout),
  };
  if (timeout === 0) {
    ctx.deadline = undefined;
  }
  if (typeof AbortController !== "undefined") {
    ctx.signal = new AbortController().signal;
  }
  return ctx;
}
