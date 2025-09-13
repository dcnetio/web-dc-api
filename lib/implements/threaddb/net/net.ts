import crypto from "crypto";

import {
  peerIdFromPublicKey,
  peerIdFromPrivateKey,
  peerIdFromMultihash,
  peerIdFromString,
} from "@libp2p/peer-id";
import { keys } from "@libp2p/crypto";
import {
  Multiaddr as TMultiaddr,
  multiaddr,
  protocols,
} from "@multiformats/multiaddr"; // 多地址库
import { Head } from "../core/head";
import { ThreadID } from "@textile/threads-id";
import { Ed25519PrivKey, Ed25519PubKey } from "../../../common/dc-key/ed25519";
import type {
  PeerId,
  PublicKey,
  PrivateKey,
  Ed25519PublicKey,
} from "@libp2p/interface";
import { SymmetricKey, Key as ThreadKey } from "../common/key";
import { validateIDData } from "../lsstoreds/global";
import {
  ThreadInfo,
  IThreadLogInfo,
  SymKey,
  IThreadInfo,
  ThreadMuliaddr,
} from "../core/core";
import { ThreadToken } from "../core/identity";
import { ILogstore } from "../core/logstore";
import { Datastore } from "interface-datastore";
import { Blocks } from "helia";
import { DAGCBOR } from "@helia/dag-cbor"; // DAGService
import * as dagCBOR from "@ipld/dag-cbor";
import { IRecord, IThreadRecord } from "../core/record";
import { DCGrpcServer } from "./grpcserver";
import { Libp2p } from "@libp2p/interface";
import { dc_protocol } from "../../../common/define";
import { EventFromNode, Event } from "../cbor/event";
import { Node } from "../cbor/node";
import { IPLDNode } from "../core/core";
import {
  ThreadRecord,
  TimestampedRecord,
  PeerRecords,
  netPullingLimit,
} from "./define";
import { CID } from "multiformats/cid";
import { getHeadUndef } from "../core/head";
import {
  GetRecord,
  CreateRecord,
  logToProto,
  logFromProto,
  CreateRecordConfig,
} from "../cbor/record";
import { IThreadEvent } from "../core/event";
import { DBGrpcClient } from "./grpcClient";
import { DBClient } from "../dbclient";
import { Client } from "../../../common/dcapi";
import { App, Connector, Net, PubKey, Token } from "../core/app";
import { ChainUtil } from "../../../common/chain";
import { DcUtil } from "../../../common/dcutil";
import { CreateEvent } from "../cbor/event";
import { Errors } from "../core/db";
import { net as net_pb } from "../pb/net_pb";
import { PermanentAddrTTL } from "../common/logstore";
import { PeerStatus } from "../../../common/types/types";
import {
  PeerIDConverter,
  MultiaddrConverter,
  CidConverter,
  ThreadIDConverter,
  KeyConverter,
  ProtoKeyConverter,
  json,
} from "../pb/proto-custom-types";
import * as buffer from "buffer/";
import { AsyncMutex } from "../common/AsyncMutex";
import { DCContext } from "../../../interfaces";
const { Buffer } = buffer;

/**
 * Creates a new ThreadRecord
 */
function newRecord(r: IRecord, id: ThreadID, lid: PeerId): IThreadRecord {
  return new ThreadRecord(r, id, lid);
}

// 定义 Network 类
export class Network implements Net {
  bstore: Blocks;
  private logstore: ILogstore;
  private dcChain: ChainUtil;
  private dc: DcUtil;
  private dagService: DAGCBOR;
  private hostID: string;
  private context: DCContext;
  private server: DCGrpcServer;
  private libp2p: Libp2p;
  private connectors: Record<string, Connector>;
  private cachePeers: Record<string, TMultiaddr> = {};
  private threadMutexes: Record<string, AsyncMutex> = {};

  constructor(
    dcUtil: DcUtil,
    dcChain: ChainUtil,
    libp2p: Libp2p,
    grpcServer: DCGrpcServer,
    logstore: ILogstore,
    bstore: Blocks,
    dagService: DAGCBOR,
    context: DCContext
  ) {
    this.logstore = logstore;
    this.hostID = libp2p.peerId.toString();
    this.context = context;
    this.bstore = bstore;
    this.dagService = dagService;
    this.libp2p = libp2p;
    this.server = grpcServer;
    this.connectors = {};
    this.dcChain = dcChain;
    this.dc = dcUtil;
  }

  // 签名,后续应该改成发送到钱包iframe中签名,发送数据包含payload和用户公钥
  sign = async (payload: Uint8Array): Promise<Uint8Array> => {
    if (!this.context) {
      throw new Error("privKey is null");
    }
    const signature = this.context.sign(payload);
    return signature;
  };

  async getClient(peerId: PeerId): Promise<[Client | null, Error | null]> {
    try {
      let cachedFlag = true;
      const cacheAddr = this.cachePeers[peerId.toString()];
      let peerAddr: TMultiaddr | null = cacheAddr || null;
      let peerStatus: PeerStatus | null = PeerStatus.PeerStatusOnline;
      if (!cacheAddr) {
        cachedFlag = false;
        [peerAddr, peerStatus] = await this.dcChain.getDcNodeWebrtcDirectAddr(
          peerId.toString()
        );
      }

      if (!peerAddr) {
        throw new Error("peerAddr is null");
      }
      if (peerStatus !== PeerStatus.PeerStatusOnline) {
        throw new Error("peerStatus is not online");
      }
      if (!this.context.publicKey) {
        throw new Error("publicKey is null");
      }

      const addr = multiaddr(peerAddr);
      const client = new Client(this.libp2p, this.bstore, addr, dc_protocol);
      //获取token
      const token = await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        (payload: Uint8Array): Promise<Uint8Array> => {
          return this.sign(payload);
        }
      );
      if (!token) {
        if (cachedFlag) {
          let _: PeerStatus | null = null;
          [peerAddr, _] = await this.dcChain.getDcNodeWebrtcDirectAddr(
            peerId.toString()
          );
          delete this.cachePeers[peerId.toString()];
          if (!peerAddr) {
            throw new Error("peerAddr is null");
          }
          const addr = multiaddr(peerAddr);
          const client = new Client(
            this.libp2p,
            this.bstore,
            addr,
            dc_protocol
          );
          const token = await client.GetToken(
            this.context.appInfo.appId || "",
            this.context.publicKey.string(),
            (payload: Uint8Array) => {
              return this.sign(payload);
            }
          );
          if (token) {
            this.cachePeers[peerId.toString()] = peerAddr;
            return [client, null];
          }
        }
        throw new Error("get token is null");
      }
      this.cachePeers[peerId.toString()] = peerAddr;
      return [client, null];
    } catch (err) {
      return [null, err as Error];
    }
  }

  getMutexForThread(threadId: string): AsyncMutex {
    if (!this.threadMutexes[threadId]) {
      this.threadMutexes[threadId] = new AsyncMutex();
    }
    return this.threadMutexes[threadId];
  }

  async getPeers(id: ThreadID): Promise<PeerId[] | undefined> {
    const peers = await this.dcChain.getObjNodes(id.toString());
    if (!peers) {
      return undefined;
    }
    const peerIds: PeerId[] = [];
    for (const peer of peers) {
      const peerStr = Buffer.from(peer.slice(2), "hex").toString("utf8");
      const peerId = peerIdFromString(peerStr);
      if (!peerId) {
        continue;
      }
      peerIds.push(peerId);
    }
    return peerIds;
  }

  /**
   * 创建threaddb
   */
  async createThread(
    id: ThreadID,
    options: {
      token: ThreadToken;
      logKey?: Ed25519PrivKey | Ed25519PubKey;
      threadKey?: ThreadKey;
    }
  ): Promise<ThreadInfo> {
    if (!this.context.publicKey) {
      throw new Error("Identity creation failed.");
    }
    const identity = this.context.publicKey;

    await this.ensureUniqueLog(id, options.logKey, identity);
    const threadKey = options.threadKey || this.generateRandomKey();

    const threadInfo = new ThreadInfo(id, [], [], threadKey);

    await this.logstore.addThread(threadInfo);
    const logInfo = await this.createLog(id, options.logKey, identity);
    threadInfo.logs.push(logInfo);
    return threadInfo;
  }

  /**
   * 从多地址添加threaddb
   *
   * @param addr 包含threaddb ID的多地址
   * @param options threaddb 选项
   * @returns 带有地址的threaddb 信息
   */
  async addThread(
    addr: ThreadMuliaddr,
    options: {
      token?: ThreadToken | undefined;
      logKey?: Ed25519PrivKey | Ed25519PubKey | undefined;
      threadKey?: ThreadKey | undefined;
    } = {}
  ): Promise<ThreadInfo> {
    try {
      // 从多地址提取threaddb ID
      const idStr = addr.id.toString();
      if (!idStr) {
        throw new Error("Invalid thread address");
      }
      const id = ThreadID.fromString(idStr);
      // 验证身份
      let identity = await this.validate(id, options.token);
      if (identity) {
        console.debug(`Adding thread with identity: ${identity.toString()}`);
      } else {
        identity = this.context.publicKey;
      }

      // 确保日志唯一性
      await this.ensureUniqueLog(id, options.logKey, identity);

      // 分离threaddb 组件以获取对等点地址
      // const threadComp = `/thread/${id.toString()}`;
      // const peerAddr = multiaddr(addr.toString().split(threadComp)[0]);
      const peerAddr = addr.addr;
      // 获取对等点信息
      const peerId = peerAddr.getPeerId();
      if (!peerId) {
        throw new Error("Invalid peer address");
      }

      const pid = peerIdFromString(peerId);
      const addFromSelf = pid.toString() === this.hostID;

      // 如果我们从自己添加，检查threaddb 是否存在
      if (addFromSelf) {
        try {
          await this.logstore.getThread(id);
        } catch (err: any) {
          if (err.message === "Thread not found") {
            throw new Error(`Cannot retrieve thread from self: ${err.message}`);
          }
          throw err;
        }
      }

      // 添加threaddb 到存储
      const threadInfo = new ThreadInfo(id, [], [], options.threadKey);
      await this.logstore.addThread(threadInfo);

      // 如果可以读取或有日志密钥，则创建日志
      if (
        (options.threadKey && options.threadKey.canRead()) ||
        options.logKey
      ) {
        const logInfo = await this.createLog(id, options.logKey, identity);
        threadInfo.logs.push(logInfo);
      }
      // 如果不是从自己添加，则连接并获取日志
      if (!addFromSelf) {
        // 从对等点更新日志
        await this.updateLogsFromPeer(id, pid);
      }

      // 返回带有地址的threaddb 信息
      return this.getThreadWithAddrs(id);
    } catch (err) {
      throw new Error(
        `Failed to add thread: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 获取threaddb 信息
   * 返回包含地址的threaddb 信息对象
   *
   * @param id threaddb ID
   * @param options 选项，可以包含令牌等
   * @returns 包含地址的threaddb 信息
   * @throws 如果threaddb 验证失败或threaddb 不存在
   */
  async getThread(
    id: ThreadID,
    options: { token?: ThreadToken } = {}
  ): Promise<ThreadInfo> {
    try {
      // 验证threaddb ID和令牌
      await this.validate(id, options.token);

      // 获取带有地址的threaddb 信息
      return this.getThreadWithAddrs(id);
    } catch (err) {
      throw new Error(
        `Error getting thread ${id.toString()}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 从连接的远程对等点获取线程信息
   *
   * @param id 线程ID
   * @param options 线程选项
   * @returns 线程信息对象
   * @throws 如果连接刷新失败或获取线程信息失败
   */
  async getThreadFromPeer(
    id: ThreadID,
    peerId: PeerId,
    options: { token?: ThreadToken } = {}
  ): Promise<ThreadInfo> {
    try {
      const [client, _] = await this.getClient(peerId);
      if (!client) {
        throw new Error("Failed to get client");
      }
      const dbClient = new DBClient(client, this.dc, this, this.logstore);

      // 发送请求
      try {
        const threadInfo = dbClient.getThreadFromPeer(id, peerId, options);
        return threadInfo;
      } catch (err) {
        throw new Error(
          `Error getting thread from peer: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    } catch (err) {
      throw new Error(
        `Error getting thread from peer: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 删除线程
   *
   * @param id 线程ID
   * @param options 线程选项
   * @returns 无返回值
   * @throws 如果验证失败或线程正在被使用
   */
  async deleteThread(
    id: ThreadID,
    options: { token?: ThreadToken; apiToken?: Token } = {}
  ): Promise<void> {
    try {
      // 验证线程ID和令牌
      await this.validate(id, options.token);

      // 检查线程是否被应用使用
      const [_, ok] = this.getConnectorProtected(id, options.apiToken);
      if (!ok) {
        throw new Error("Cannot delete thread: thread in use");
      }
      console.debug(`Deleting thread ${id.toString()}...`);
      const mutex = this.getMutexForThread(id.toString());
      await mutex.acquire();
      try {
        // 执行删除操作
        await this.logstore.deleteThread(id);
        delete this.connectors[id.toString()];
      } finally {
        mutex.release();
      }
    } catch (err) {
      throw new Error(
        `Failed to delete thread: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 验证threaddb  ID 和 Token
   */
  async validate(
    id: ThreadID,
    token?: ThreadToken
  ): Promise<Ed25519PubKey | undefined> {
    if (!validateIDData(id.toBytes())) {
      throw new Error("Invalid thread ID.");
    }
    if (!token) {
      return;
    }
    return token.pubKey();
  }

  /**
   * 确保日志唯一性
   * 检查给定threaddb 是否已存在具有相同密钥或身份的日志
   */
  async ensureUniqueLog(
    id: ThreadID,
    key?: Ed25519PrivKey | Ed25519PubKey,
    identity?: PublicKey
  ): Promise<void> {
    try {
      const thrd = await this.logstore.getThread(id);

      // threaddb 存在，继续检查
      let lid: PeerId;

      if (key) {
        // 根据密钥类型处理
        if (key instanceof Ed25519PubKey) {
          lid = peerIdFromPublicKey(key);
        } else if (key instanceof Ed25519PrivKey) {
          lid = peerIdFromPrivateKey(key);
        } else {
          throw new Error("Invalid log key");
        }
      } else {
        // 没有提供密钥，检查是否有此身份的日志
        if (!identity) {
          throw new Error("Either key or identity must be provided");
        }

        try {
          const lidb = await this.logstore.metadata.getBytes(
            id,
            identity.toString()
          );
          if (!lidb || lidb.length === 0) {
            // 检查是否有旧式"own"（未索引）日志
            if (identity.equals(this.context.publicKey)) {
              const firstPrivKeyLog = thrd.getFirstPrivKeyLog();
              if (firstPrivKeyLog && firstPrivKeyLog.privKey) {
                throw new Error("Thread exists");
              }
            }
            return;
          }
          const lidbstr = new TextDecoder().decode(lidb);
          // 从字节转换为PeerId
          lid = peerIdFromString(lidbstr);
        } catch (error) {
          throw error;
        }
      }

      try {
        const lginfo = await this.logstore.getLog(id, lid);
        if (lginfo) {
          // 如果到达这里，说明日志存在
          throw new Error("Log exists");
        }
      } catch (error: any) {
        if (error.message === Errors.ErrLogNotFound.message) {
          return;
        }
        throw error;
      }
    } catch (error: any) {
      if (error.message === Errors.ErrThreadNotFound.message) {
        return;
      }
      throw error;
    }
  }

  /**
   * Get thread information with addresses
   */
  async getThreadWithAddrs(id: ThreadID): Promise<ThreadInfo> {
    try {
      const tinfo = await this.logstore.getThread(id);
      // Get host addresses
      const hostAddrs = this.libp2p.getMultiaddrs();
      const resultAddrs: ThreadMuliaddr[] = [];

      // Encapsulate each address with peer and thread components
      for (const addr of hostAddrs) {
        const withPeerId = addr.encapsulate(
          `/p2p/${this.libp2p.peerId.toString()}`
        );
        const threadMultiaddr = new ThreadMuliaddr(withPeerId, tinfo.id);
        resultAddrs.push(threadMultiaddr);
      }
      tinfo.addrs = resultAddrs;
      return tinfo;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Pull thread updates from peers
   */
  async pullThread(id: ThreadID, timeout: number, options: { token?: ThreadToken | undefined; multiPeersFlag?: boolean | undefined;}): Promise<void> {
    try {
      let recs: Record<string, PeerRecords> = {};
      const mutex = this.getMutexForThread(id.toString());
      await mutex.acquire();
      try {
        if (options.multiPeersFlag) {
          recs = await this.pullThreadDeal(id, options.multiPeersFlag );
        }else{
          recs = await this.pullThreadDeal(id, false );
        }
      } finally {
        mutex.release();
      }

      const [connector, appConnected] = this.getConnector(id);

      // Handle records
      const tRecords: TimestampedRecord[] = [];

      for (const [lidStr, rec] of Object.entries(recs)) {
        const lid = peerIdFromString(lidStr);
        const rs = rec as PeerRecords;
        if (appConnected) {
           // 使用并发控制，但不分批 - 避免慢任务拖累整批
          const maxConcurrency = 10;
          let activePromises: Promise<void>[] = [];
          let processedCount = 0;

          const processRecord = async (r: any, index: number): Promise<void> => {
            try {
              const block = await r.getBlock(this.bstore);
              const event =
                block instanceof Event
                  ? block
                  : await EventFromNode(block as Node);

              const header = await event.getHeader(this.bstore);
              const body = await event.getBody(this.bstore);
              

            // Store internal blocks locally
            await this.addMany([event, header, body]);
              
            } catch (err) {
              console.error(`预加载记录 ${index + 1} 失败:`, err);
              // 继续处理其他记录
            }
          };

          // 处理所有记录，但控制并发数
          for (let i = 0; i < rs.records.length; i++) {
            const r = rs.records[i]!;
            // 创建处理Promise
            const promise = processRecord(r, i).finally(() => {
              processedCount++;
              // 从活跃Promise列表中移除
              const index = activePromises.indexOf(promise);
              if (index > -1) {
                activePromises.splice(index, 1);
              }
            });
            
            activePromises.push(promise);
            
            // 当达到最大并发数时，等待最快完成的一个
            if (activePromises.length >= maxConcurrency) {
              await Promise.race(activePromises);
            }
          }
          // 等待所有剩余的Promise完成
          await Promise.all(activePromises);
          
          console.log(`所有 ${rs.records.length} 条记录预加载完成`);
          //开始正式处理,前面数据已经拉取到本地,这时处理速度很快
          let indexCounter = rs.counter - rs.records.length + 1;

          for (let i = 0; i < rs.records.length; i++) {
            const r = rs.records[i]!;

            // Get blocks for validation
            const block = await r.getBlock(this.bstore);
            const event =
              block instanceof Event
                ? block
                : await EventFromNode(block as Node);

            const header = await event.getHeader(this.bstore);
            const body = await event.getBody(this.bstore);

            // Store internal blocks locally
            await this.addMany([event, header, body]);

            const tRecord = newRecord(r, id, lid);
            const counter = indexCounter + i;
            const createtime = await connector!.getNetRecordCreateTime(tRecord);

            tRecords.push({
              record: r,
              counter: counter,
              createtime: createtime,
              logid: lid,
            });
          }
        } else {
          await this.putRecords(id, lid, rs.records, rs.counter);
        }
      }

      tRecords.sort((a, b) => {
        if (a.createtime < b.createtime) return -1;
        if (a.createtime > b.createtime) return 1;
        return 0;
      });
      let i = 0;

      // Process each record in order
      for (const r of tRecords) {
        await this.putRecords(id, r.logid, [r.record], r.counter);
      }

    } catch (err) {
      throw err;
    }
  }

  async addMany(nodes: IPLDNode[]): Promise<void> {
    for (const node of nodes) {
      await this.bstore.put(node.cid(), node.data());
    }
  }
  /**
   * Pull thread records from peers
   */
  async pullThreadDeal(tid: ThreadID,multiPeersFlag: boolean=false): Promise<Record<string, PeerRecords>> {
    try {
      let [offsets, peers] = await this.threadOffsets(tid);
      try {
        const extPeers = await this.getPeers(tid);
        if (extPeers && extPeers.length > 0) {
          peers = extPeers;
        }
      } catch (err) {
        console.error(
          `Error getting peers for thread ${tid}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        // Ignore getPeers errors
      }
      const pulledRecs: Record<string, PeerRecords> = {};

      // Continue pulling until no more records
      while (true) {
        const recs = await this.getRecords(
          peers,
          tid,
          offsets,
          netPullingLimit,
          multiPeersFlag
        );
        let continueFlag = false;
        for (const [lidStr, rs] of Object.entries(recs)) {
          if (rs.records.length > 0) {
            const existing = pulledRecs[lidStr] || { records: [], counter: 0 };
            const records = [...existing.records, ...rs.records];

            pulledRecs[lidStr] = {
              records: records,
              counter: rs.counter,
            };

            const lastRecord = rs.records[rs.records.length - 1]!;
            offsets[lidStr] = {
              id: lastRecord.cid(),
              counter: rs.counter,
            };

            if (rs.records.length >= netPullingLimit) {
              continueFlag = true;
            }
          }
        }

        if (!continueFlag) {
          break;
        }
      }
      return pulledRecs;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 创建日志，分配 privKey 和 pubKey
   */
  async createLog(
    id: ThreadID,
    key?: Ed25519PrivKey | Ed25519PubKey,
    identity?: PublicKey
  ): Promise<IThreadLogInfo> {
    let privKey: PrivateKey | undefined;
    let pubKey: PublicKey;
    let peerId: PeerId;
    if (!key) {
      const keyPair = await keys.generateKeyPair("Ed25519");
      privKey = new Ed25519PrivKey(keyPair.raw);
      pubKey = keyPair.publicKey;
      peerId = peerIdFromPrivateKey(privKey);
    } else {
      if (key instanceof Ed25519PrivKey) {
        privKey = key;
        pubKey = key.publicKey;
        peerId = peerIdFromPrivateKey(key);
      } else if (key instanceof Ed25519PubKey) {
        pubKey = key;
        peerId = peerIdFromPublicKey(key);
      } else {
        throw new Error("Invalid key type.");
      }
    }
    const addr = multiaddr(`/p2p/${this.hostID}`); // 基于 hostID 生成地址
    const head: Head = {
      counter: 0,
    };
    const logInfo: IThreadLogInfo = {
      privKey,
      pubKey,
      id: peerId,
      addrs: [addr],
      managed: true,
      head: head,
    } as IThreadLogInfo;

    // 将日志添加到threaddb存储
    await this.logstore.addLog(id, logInfo);
    const logIDBytes = new TextEncoder().encode(peerId.toString());
    await this.logstore.metadata.putBytes(
      id,
      identity?.toString() || "",
      logIDBytes
    );
    return logInfo;
  }

  /**
   * 生成随机threaddb 密钥
   */
  generateRandomKey(): ThreadKey {
    return new ThreadKey(SymmetricKey.new(), SymmetricKey.new());
  }

  /**
   * Add connector for thread
   */
  addConnector(id: ThreadID, conn: Connector): void {
    this.connectors[id.toString()] = conn;
  }

  /**
   * Get connector for thread
   */
  getConnector(id: ThreadID): [Connector | null, boolean] {
    const conn = this.connectors[id.toString()];
    return [conn || null, !!conn];
  }

  /**
   * Get thread offsets and peers
   */
  async threadOffsets(
    tid: ThreadID
  ): Promise<[Record<string, Head>, PeerId[]]> {
    const info = await this.logstore.getThread(tid);

    const offsets: Record<string, Head> = {};
    const addrs: TMultiaddr[] = [];

    // Process all logs in thread
    for (const lg of info.logs) {
      // Check if head is known
      let has = false;

      if (lg.head?.id) {
        has = await this.isKnown(lg.head.id);
      }

      if (has && lg.head) {
        offsets[lg.id.toString()] = lg.head;
        // Collect addresses
      } else {
        offsets[lg.id.toString()] = await getHeadUndef();
      }
      if (lg.addrs && lg.addrs.length > 0) {
        addrs.push(...lg.addrs);
      }
    }

    // Get unique peer IDs
    const peers = await this.uniquePeers(addrs);

    return [offsets, peers];
  }

  async updateLogsFromPeer(tid: ThreadID, peerId: PeerId): Promise<void> {
    try {
      const [client, _] = await this.getClient(peerId);
      if (!client) {
        return;
      }
      const dbClient = new DBClient(client, this.dc, this, this.logstore);
      await dbClient.scheduleUpdateLogs(tid);
    } catch (err) {
      throw new Error(
        `Getting records for thread ${tid} failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 从对等点获取新的日志和记录并添加到本地存储
   *
   * @param tid threaddb ID
   * @param pid 对等点ID
   * @returns 无返回值，但会抛出错误
   */
  async updateRecordsFromPeer(
    tid: ThreadID,
    peerId: PeerId | null,
    client?: DBClient
  ): Promise<void> {
    try {
      // 获取threaddb 偏移量
      const [offsets, peers] = await this.threadOffsets(tid);

      // 构建获取记录的请求
      const { req, serviceKey } = await this.buildGetRecordsRequest(
        tid,
        offsets,
        netPullingLimit
      );
      let recs: Record<string, PeerRecords> = {};
      if (client) {
        recs = await this.getRecordsWithDbClient(client, req, serviceKey);
      } else {
        if (!peerId) {
          throw new Error("A peer-id is required to request records");
        }
        // 从对等点获取记录
        recs = await this.getRecordsFromPeer(peerId, req, serviceKey);
      }
      // 处理接收到的记录
      for (const [lidStr, rs] of Object.entries(recs)) {
        try {
          // 将字符串ID转换为PeerId对象
          const lid = peerIdFromString(lidStr);

          // 将记录添加到本地存储
          await this.putRecords(tid, lid, rs.records, rs.counter);
        } catch (err) {
          throw new Error(
            `Putting records from log ${lidStr} (thread ${tid}) failed: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
      // 检查是否可能有更多记录需要获取
      for (const [lidStr, rs] of Object.entries(recs)) {
        try {
          const lid = peerIdFromString(lidStr);
          const head = await this.currentHead(tid, lid);

          // 如果我们收到了最大数量的记录，并且可能还有更多
          if (
            head.counter <= rs.counter &&
            rs.records.length === netPullingLimit
          ) {
            // 递归调用继续获取更多记录
            return this.updateRecordsFromPeer(tid, peerId, client);
          }
        } catch (err) {
          // 忽略获取头部的错误，继续检查其他日志
          console.warn(
            `Error checking head for log ${lidStr}: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
    } catch (err) {
      throw new Error(
        `Getting records for thread ${tid} failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 从特定对等点获取记录
   * 注意: 这是一个假设的实现，需要根据你的实际gRPC客户端实现来调整
   */
  async getRecordsFromPeer(
    peerId: PeerId,
    req: any,
    serviceKey: SymKey
  ): Promise<Record<string, PeerRecords>> {
    try {
      const [client, _] = await this.getClient(peerId);
      if (!client) {
        return {};
      }
      const dbClient = new DBClient(client, this.dc, this, this.logstore);
      const recs = await dbClient.getRecordsFromPeer(req, serviceKey);
      return recs;
    } catch (err) {
      console.error("getRecordsFromPeer error:", err);
      throw err;
    }
  }

  async getRecordsWithDbClient(
    dbClient: DBClient,
    req: any,
    serviceKey: SymKey
  ): Promise<Record<string, PeerRecords>> {
    try {
      const recs = await dbClient.getRecordsFromPeer(req, serviceKey);
      return recs;
    } catch (err) {
      console.error("getRecordsFromPeer error:", err);
      throw err;
    }
  }

  /**
   * Add records to a thread
   */
  async putRecords(
    tid: ThreadID,
    lid: PeerId,
    recs: IRecord[],
    counter: number
  ): Promise<void> {
    const [chain, head] = await this.loadRecords(tid, lid, recs, counter);

    if (chain.length === 0) {
      return;
    }
    const mutex = this.getMutexForThread(tid.toString());
    await mutex.acquire();
    try {
      // Check the head again, as another process could have changed the log
      const current = await this.currentHead(tid, lid);
      let headReached = true;
      let updatedHead = head;
      if (current?.id?.toString() != head?.id?.toString()) {
        // Fast-forward the chain up to the updated head
        headReached = false;
        updatedHead = current;

        for (let i = 0; i < chain.length; i++) {
          if (chain[i]!.value().cid().equals(current.id)) {
            chain.splice(0, i + 1);
            headReached = true;
            break;
          }
        }

        if (!headReached) {
          // Entire chain already processed
          return;
        }
      }

      const [connector, appConnected] = this.getConnector(tid);
      let identity: Ed25519PubKey;
      let readKey: SymmetricKey | null = null;
      let validate = false;
      let updatedCounter = updatedHead.counter;

      if (appConnected) {
        const symKey = await this.logstore.keyBook.readKey(tid);
        if (symKey) {
          readKey = SymmetricKey.fromSymKey(symKey);
        }
        if (readKey) {
          validate = true;
        }
      }
      for (const record of chain) {
        if (validate) {
          // Validate the record
          const block = await record.value().getBlock(this.bstore);

          let event: Event;
          if (block instanceof Event) {
            event = block;
          } else {
            event = (await EventFromNode(block as Node)) as Event;
          }

          const dbody = await event.getBody(
            this.bstore,
            readKey ? readKey : undefined
          );

          identity = await KeyConverter.publicFromBytes<Ed25519PubKey>(
            record.value().pubKey()
          );

          try {
            await connector!.validateNetRecordBody(dbody, identity);
          } catch (err) {
            // If validation fails, clean up blocks
            const header = await event.getHeader(this.bstore);
            const body = await event.getBody(this.bstore);
            this.bstore.deleteMany([event.cid(), header.cid(), body.cid()]);
            throw err;
          }
        }

        // Update head counter
        updatedCounter++;

        // Set new head for the log
        await this.logstore.headBook.setHead(tid, lid, {
          id: record.value().cid(),
          counter: updatedCounter,
        });

        // Set checkpoint for log
        await this.setThreadLogPoint(
          tid,
          lid,
          updatedCounter,
          record.value().cid()
        );

        // Handle record in app connector
        if (appConnected) {
          try {
            await connector!.handleNetRecord(record);
          } catch (err) {
            // Continue processing subsequent records
            continue;
          }
        }

        // Add record to blockstore
        await this.bstore.put(record.value().cid(), record.value().data());
      }
    } finally {
      mutex.release();
    }
  }

  /**
   * Load records from a thread
   */
  async loadRecords(
    tid: ThreadID,
    lid: PeerId,
    recs: IRecord[],
    counter: number
  ): Promise<[IThreadRecord[], Head]> {
    if (recs.length === 0) {
      throw new Error("Cannot load empty record chain");
    }

    const head = await this.currentHead(tid, lid);

    // Check if the last record was already loaded and processed
    const last = recs[recs.length - 1]!;

    // If we don't have the counter, check if record exists
    if (counter === undefined) {
      const exist = await this.isKnown(last.cid());
      if (exist || !(last.cid().toString() == "")) {
        return [[], head];
      }
    } else if (counter <= head.counter) {
      return [[], head];
    }
    let chain: IRecord[] = [];
    let complete = false;
    // Check which records we already have
    for (let i = recs.length - 1; i >= 0; i--) {
      const next = recs[i]!;
      if (next.cid().toString() == "" || next.cid().equals(head.id)) {
        complete = true;
        break;
      }
      chain.push(next);
    }

    // Bridge the gap between the last provided record and current head
    if (!complete && chain.length > 0) {

      let c = chain[chain.length - 1]!.prevID();
      while (c && !(last.cid().toString() == "")) {
        if (c.equals(head.id)) {
          break;
        }
        const r = await this.getRecord(tid, c);
        chain.push(r);
        c = r.prevID();
      }
    }

    if (chain.length === 0) {
      return [[], head];
    }

    // Prepare thread records in the right order
    const tRecords: ThreadRecord[] = [];

    for (let i = chain.length - 1; i >= 0; i--) {
      const r = chain[i]!;

      // Get and cache blocks
      const block = await r.getBlock(this.bstore);
      let event: IThreadEvent;
      if (block instanceof Event) {
        event = block;
      } else {
        event = await EventFromNode(block as Node);
      }

      const header = await event.getHeader(this.bstore);
      const body = await event.getBody(this.bstore);

      // Store internal blocks
      await this.addMany([event, header, body]);
      tRecords.push(newRecord(r, tid, lid) as ThreadRecord);
    }
    return [tRecords, head];
  }

  /**
   * Check if a record exists
   */
  async isKnown(rec: CID): Promise<boolean> {
    return await this.bstore.has(rec);
  }

  /**
   * 获取记录
   * 从给定的threaddb 和CID获取记录
   *
   * @param ctx 上下文
   * @param id threaddb ID
   * @param rid 记录CID
   * @returns 检索到的记录
   * @throws 如果无法获取服务密钥或记录
   */
  async getRecord(id: ThreadID, rid: CID): Promise<IRecord> {
    // 从存储中获取服务密钥
    const serviceKey = await this.logstore.keyBook.serviceKey(id);

    // 检查服务密钥是否存在
    if (!serviceKey) {
      throw new Error("A service-key is required to get records");
    }

    const sk = SymmetricKey.fromSymKey(serviceKey);
    // 使用CBOR获取记录
    return await GetRecord(this.dagService, rid, sk);
  }
  /**
   * Set a thread log checkpoint
   */
  async setThreadLogPoint(
    tid: ThreadID,
    lid: PeerId,
    counter: number,
    rcid: CID
  ): Promise<void> {
    // Only store checkpoints at multiples of 10000
    if (counter % 10000 !== 0) {
      return;
    }
    // Create key for checkpoint
    const key = `${lid.toString()}/${counter}`;

    // Store checkpoint
    await this.logstore.metadata.putBytes(tid, key, rcid.bytes);
  }

  /**
   * Get the current head of a log
   */
  async currentHead(tid: ThreadID, lid: PeerId): Promise<Head> {
    const heads = await this.logstore.headBook.heads(tid, lid);

    if (heads.length > 0) {
      return heads[0]!;
    } else {
      return await getHeadUndef();
    }
  }
  /**
   * Extract unique peer IDs from addresses
   */
  async uniquePeers(addrs: TMultiaddr[]): Promise<PeerId[]> {
    const peerMap = new Map<string, PeerId>();

    for (const addr of addrs) {
      try {
        const [pid, callable] = await this.callablePeer(addr);

        if (!callable) {
          continue;
        }

        peerMap.set(pid.toString(), pid);
      } catch (err) {
        // Skip addresses that can't be parsed
      }
    }

    return Array.from(peerMap.values());
  }

  /**
   * Extract peer ID from multiaddress and check if callable
   */
  async callablePeer(addr: TMultiaddr): Promise<[PeerId, boolean]> {
    const p = addr.getPeerId();
    if (!p) {
      throw new Error("Address does not contain peer ID");
    }

    const pid = peerIdFromString(p);

    // Don't call ourselves
    if (pid.toString() === this.hostID) {
      return [pid, false];
    }
    return [pid, true];
  }

  /**
   * 从指定对等点获取记录
   */
  async getRecords(
    peers: PeerId[], 
    tid: ThreadID, 
    offsets: Record<string, { id?: CID, counter: number }>,
    limit: number,
    multiPeersFlag: boolean = false
  ): Promise<Record<string, PeerRecords>> {
    try {
      // 构建请求
      const { req, serviceKey } = await this.buildGetRecordsRequest(tid, offsets, limit);
      
      // 创建记录收集器
      const recordCollector = new RecordCollector();
      //遍历节点,按顺序处理
      for (const peerId of peers) {
         try {
             // 设置超时
             const timeout = setTimeout(() => {
               throw new Error(`Timeout getting records from peer ${peerId}`);
             }, 60000);

            //连接到指定peerId,返回一个Client
            const [client,err] = await this.getClient(peerId);
            if (!client) {
              clearTimeout(timeout);
              throw new Error(`Error getting records from peer ${peerId},no client,errinfo: ${err}`);
            }
            const dbClient = new DBClient(client,this.dc,this,this.logstore);
            const records = await dbClient.getRecordsFromPeer( req, serviceKey);
            clearTimeout(timeout);
            console.log(`开始处理从 ${peerId.toString()} 获取的记录,记录数为:`,Object.keys(records).length);
            for (const [logId, rs] of Object.entries(records)) {
              await recordCollector.batchUpdate(logId, rs);
            }
            console.log(`处理从 ${peerId.toString()} 获取的记录完成,记录数为:`,Object.keys(records).length);
          
            if(!multiPeersFlag){
               break;
            }
          } catch (err) {
            continue;
          }
      }
      
      return recordCollector.list();
    } catch (err) {
      console.error("getRecords error:", err);
      throw err;
    }
  }

  /**
   * 构建获取记录的请求
   */
  async buildGetRecordsRequest(
    tid: ThreadID,
    offsets: Record<string, Head>,
    limit: number
  ): Promise<{ req: net_pb.pb.IGetRecordsRequest; serviceKey: SymKey }> {
    try {
      // 从存储中获取服务密钥
      const serviceKey = await this.logstore.keyBook.serviceKey(tid);

      if (!serviceKey) {
        throw new Error("A service-key is required to request records");
      }

      // 创建日志条目
      const logs = Object.entries(offsets).map(([logId, offset]) => {
        const pbLog: net_pb.pb.GetRecordsRequest.Body.ILogEntry = {
          logID: PeerIDConverter.toBytes(logId),
          limit: limit,
          counter: offset.counter,
          offset: offset.id
            ? CidConverter.toBytes(offset.id)
            : new Uint8Array(),
        };
        return pbLog;
      });

      // 构建请求体
      const body: net_pb.pb.GetRecordsRequest.IBody = {
        threadID: ThreadIDConverter.toBytes(tid.toString()),
        serviceKey: serviceKey.raw,
        logs: logs,
      };

      // 创建请求
      const req = new net_pb.pb.GetRecordsRequest();
      req.body = body;
      return { req, serviceKey };
    } catch (err) {
      console.error("buildGetRecordsRequest error:", err);
      throw err;
    }
  }

  /**
   * 连接应用到指定threaddb
   * @param app 应用程序对象
   * @param id threaddb ID
   * @returns 返回一个应用连接器
   * @throws 如果验证失败或获取threaddb 信息出错则抛出异常
   */
  async connectApp(app: App, id: ThreadID): Promise<Connector> {
    // 验证threaddb ID
    if (!id.isDefined()) {
      throw new Error("Invalid thread ID");
    }
    // 获取threaddb信息
    let info;
    try {
      info = await this.getThreadWithAddrs(id);
    } catch (err) {
      throw new Error(
        `Error getting thread ${id.toString()}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // 创建应用连接器
    let con;
    try {
      con = new Connector(this, app, info);
    } catch (err) {
      throw new Error(
        `Error making connector ${id.toString()}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // 添加连接器到网络
    this.addConnector(id, con);

    return con;
  }

  /**
   * 获取线程的所有日志
   * 返回线程的日志列表和线程信息
   *
   * @param tid 线程ID
   * @returns 日志数组和线程信息
   */
  async getPbLogs(tid: ThreadID): Promise<[net_pb.pb.ILog[], IThreadInfo]> {
    try {
      // 从存储中获取线程信息
      const info = await this.logstore.getThread(tid);

      // 创建日志数组
      const logs: net_pb.pb.ILog[] = [];

      // 将每个日志信息转换为protobuf格式
      for (const logInfo of info.logs) {
        logs.push(await logToProto(logInfo));
      }
      return [logs, info];
    } catch (err) {
      throw new Error(
        `Failed to get logs for thread ${tid}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 预加载日志到线程
   * 浏览器兼容版本
   *
   * @param tid 线程ID
   * @param logs 协议缓冲区日志数组
   */
  async preLoadLogs(tid: ThreadID, logs: net_pb.pb.Log[]): Promise<void> {
    try {
      // 创建一个与日志数组相同长度的ThreadLogInfo数组
      const lgs: IThreadLogInfo[] = [];

      // 遍历并转换每个日志
      for (let i = 0; i < logs.length; i++) {
        lgs.push(await logFromProto(logs[i]!));
      }
      // 调用创建外部日志的方法
      await this.createExternalLogsIfNotExistForPreload(tid, lgs);
    } catch (err) {
      throw new Error(
        `Failed to preload logs: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 创建外部日志（如果不存在）
   * 创建的日志将使用未定义CID作为当前头部
   * 此方法是线程安全的
   *
   * @param tid 线程ID
   * @param logs 日志信息数组
   */
  async createExternalLogsIfNotExist(
    tid: ThreadID,
    logs: IThreadLogInfo[]
  ): Promise<void> {
    const mutex = this.getMutexForThread(tid.toString());
    await mutex.acquire();
    try {
      for (const log of logs) {
        try {
          const heads = await this.logstore.headBook.heads(tid, log.id);

          if (heads.length === 0) {
            log.head = await getHeadUndef();
            await this.logstore.addLog(tid, log);
          } else {
            await this.logstore.addrBook.addAddrs(
              tid,
              log.id,
              log.addrs,
              PermanentAddrTTL
            );
          }
        } catch (err) {
          continue;
        }
      }
    } finally {
      mutex.release();
    }
  }

  /**
   * 预加载时创建外部日志（如果不存在）
   * 浏览器兼容版本
   *
   * @param tid 线程ID
   * @param logs 日志信息数组
   */
  async createExternalLogsIfNotExistForPreload(
    tid: ThreadID,
    logs: IThreadLogInfo[]
  ): Promise<void> {
    const mutex = this.getMutexForThread(tid.toString());
    await mutex.acquire();
    try {
      for (const log of logs) {
        try {
          const heads = await this.logstore.headBook.heads(tid, log.id);
          if (heads.length === 0) {
            await this.logstore.addLog(tid, log);
          } else {
            await this.logstore.addrBook.addAddrs(
              tid,
              log.id,
              log.addrs,
              PermanentAddrTTL
            );
          }
        } catch (err) {
          continue;
        }
      }
    } finally {
      mutex.release();
    }
  }

  /**
   * 创建新的记录
   *
   * @param id threadID
   * @param body 节点内容
   * @param options 选项
   * @returns 创建的threaddb记录
   */
  async createRecord(
    id: ThreadID,
    body: IPLDNode,
    options: { token?: ThreadToken; apiToken?: Token } = {}
  ): Promise<IThreadRecord> {
    try {
      if (this.context.publicKey === undefined) {
        throw new Error("No identity provided for creating record");
      }
      // 验证身份,用节点的pubkey
      const identity = this.context.publicKey;
      // 获取并验证连接器
      const [con, ok] = this.getConnectorProtected(id, options.apiToken);

      if (!ok) {
        throw new Error("Cannot create record: thread in use");
      } else if (con) {
        await con.validateNetRecordBody(body, identity as Ed25519PubKey);
      }

      // 获取或创建日志
      const lg = await this.getOrCreateLog(id, identity);

      // 创建新记录
      const r = await this.newRecord(id, lg, body, identity);

      // 创建threaddb 记录
      const tr = newRecord(r, id, lg.id);
      if (!lg.head) {
        lg.head = {
          counter: 0,
        };
      }

      // 更新头部信息
      const head: Head = {
        id: tr.value().cid(),
        counter: lg.head.counter + 1,
      };

      await this.logstore.headBook.setHead(id, lg.id, head);

      // 设置记录点（每10000个记录设置一个检查点）
      await this.setThreadLogPoint(
        id,
        lg.id,
        lg.head?.counter + 1,
        tr.value().cid()
      );

      console.debug(
        `Created record ${tr.value().cid()} (thread=${id}, log=${lg.id})`
      );

      // 推送记录到节点
      if (this.server) {
        this.pushRecord(id, lg.id, tr.value(), lg.head.counter + 1);
      }

      return tr;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取或创建当前身份的日志
   */
  async getOrCreateLog(
    id: ThreadID,
    identity: PublicKey
  ): Promise<IThreadLogInfo> {
    // 默认使用当前主机身份，如果未提供
    if (!identity) {
      throw new Error("No identity provided");
    }

    // 尝试获取此身份的现有日志ID
    const lidb = await this.logstore.metadata.getBytes(id, identity.toString());

    // 检查旧式"自有"日志
    if (!lidb && identity.equals(this.context.publicKey)) {
      const thrd = await this.logstore.getThread(id);
      const ownLog = thrd.getFirstPrivKeyLog();
      if (ownLog) {
        return ownLog;
      }
    } else if (lidb) {
      // 获取现有日志
      const lidbstr = new TextDecoder().decode(lidb);
      const lid = peerIdFromString(lidbstr);
      return this.logstore.getLog(id, lid);
    }

    // 创建新日志，如果不存在
    return this.createLog(id, undefined, identity);
  }

  /**
   * 创建新记录
   */
  async newRecord(
    id: ThreadID,
    lg: IThreadLogInfo,
    body: IPLDNode,
    identity: PublicKey
  ): Promise<IRecord> {
    // 获取threaddb 服务密钥
    const serviceKey = await this.logstore.keyBook.serviceKey(id);
    if (!serviceKey) {
      throw new Error("No service key for thread");
    }
    if (!this.context.publicKey) {
      throw new Error("No identity provided for creating record");
    }
    const heads = await this.logstore.headBook.heads(id, lg.id);
    // 创建事件
    const sk = SymmetricKey.fromSymKey(serviceKey);
    const readKey = await this.logstore.keyBook.readKey(id);
    const rk = readKey ? SymmetricKey.fromSymKey(readKey) : null;
    if (!rk) {
      throw new Error("No read key for thread");
    }
    const event = await CreateEvent(this.bstore, body as Node, rk);
    // 将事件保存到存储
    await this.bstore.put(event.cid(), event.data());
    let prev: CID | undefined = undefined;
    if (heads && heads.length > 0) {
      prev = heads[0]!.id;
    }
    const rec = await CreateRecord(this.bstore, {
      block: event,
      prev: prev,
      key: lg.privKey as Ed25519PrivKey,
      pubKey: this.context.publicKey,
      serviceKey: sk,
    } as CreateRecordConfig);

    return rec;
  }

  /**
   * 推送记录到日志地址和threaddb 主题
   * @param tid threaddb ID
   * @param lid 对等点ID
   * @param rec 记录对象
   * @param counter 计数器
   */
  async pushRecord(
    tid: ThreadID,
    lid: PeerId,
    rec: IRecord,
    counter: number
  ): Promise<void> {
    try {
      // 收集已知的写入器地址
      const addrs: TMultiaddr[] = [];
      const info = await this.logstore.getThread(tid);

      // 收集所有日志的地址
      for (const l of info.logs) {
        if (l.addrs && l.addrs.length > 0) {
          addrs.push(...l.addrs);
        }
      }
      const peers = await this.getPeers(tid);
      if (!peers) {
        throw new Error(`No peers for thread ${tid}`);
      }
      // 向每个对等点推送
      for (const p of peers) {
        // 跳过无效对等点
        if (!p || p.toString() === "") {
          continue;
        }
        try {
          const [client, _] = await this.getClient(p);
          if (!client) {
            continue;
          }
          const dbClient = new DBClient(client, this.dc, this, this.logstore);
          // 启动异步推送（不等待完成）
          dbClient.pushRecordToPeer(tid, lid, rec, counter);
        } catch (err) {
          continue; // 继续处理其他对等点
        }
      }
    } catch (err) {
      throw new Error(
        `Failed to push record: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * 与拥有该threaddb 的对等节点交换threaddb 记录
   * @param tid threaddb ID
   */
  async exchange(tid: ThreadID): Promise<void> {
    try {
      // 获取threaddb 信息
      const info = await this.logstore.getThread(tid);

      // 收集所有日志的地址
      const addrs: TMultiaddr[] = [];
      for (const lg of info.logs) {
        addrs.push(...lg.addrs);
      }

      // 获取唯一对等点
      let peers = await this.uniquePeers(addrs);

      // 尝试从外部对象获取对等点
      const extPeers = await this.getPeers(tid);
      if (extPeers && extPeers.length > 0) {
        peers = extPeers;
      }

      // 与每个对等点交换
      for (const pid of peers) {
        // 使用异步方式处理交换，不等待完成
        this.exchangeWithPeer(pid, tid).catch((err) => {
          console.error(
            `Error exchanging with peer ${pid}: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        });
      }
    } catch (err) {
      throw new Error(
        `Exchange failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  /**
   * 与单个对等点交换threaddb 边缘
   * @param pid 对等点ID
   * @param tid threaddb ID
   */
  private async exchangeWithPeer(pid: PeerId, tid: ThreadID): Promise<void> {
    try {
      // 获取客户端连接
      const [client, _] = await this.getClient(pid);
      if (!client) {
        return;
      }

      // 创建数据库客户端
      const dbClient = new DBClient(client, this.dc, this, this.logstore);

      // 交换边缘
      await dbClient.exchangeEdges([tid]);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 获取受保护的threaddb 连接器
   */
  getConnectorProtected(
    id: ThreadID,
    token?: Token
  ): [Connector | undefined, boolean] {
    const [conn, exists] = this.getConnector(id);

    if (!exists) {
      return [undefined, true]; // threaddb 未被连接器使用
    }

    if (!token || !conn?.token || !this.bytesEqual(token, conn.token)) {
      return [undefined, false]; // 无效令牌
    }

    return [conn, true];
  }

  /**
   * 检查两个字节数组是否相等
   */
  bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }
}

/**
 * 记录收集器，用于合并多个对等点的记录
 * 线程安全版本
 */
class RecordCollector {
  private records: Map<string, Map<string, any>> = new Map();
  private counters: Map<string, number> = new Map();
  private mutex: AsyncMutex = new AsyncMutex();

  async updateHeadCounter(logId: string, counter: number): Promise<void> {
    await this.mutex.acquire();
    try {
      const current = this.counters.get(logId) || 0;
      if (counter > current) {
        this.counters.set(logId, counter);
      }
    } finally {
       this.mutex.release();
    }
  }

  async store(logId: string, record: any): Promise<void> {
    await this.mutex.acquire();
    try {
      let logRecords = this.records.get(logId);
      if (!logRecords) {
        logRecords = new Map();
        this.records.set(logId, logRecords);
      }
      // 使用记录的CID作为键，避免重复
      const key = record.cid().toString();
      logRecords.set(key, record);
    } finally {
      this.mutex.release();
    }
  }

  async batchUpdate(logId: string, rs: PeerRecords): Promise<void> {
    await this.mutex.acquire();
    try {
      // 更新计数器
      const current = this.counters.get(logId) || 0;
      if (rs.counter > current) {
        this.counters.set(logId, rs.counter);
      }

      // 存储记录
      let logRecords = this.records.get(logId);
      if (!logRecords) {
        logRecords = new Map();
        this.records.set(logId, logRecords);
      }

       rs.records.forEach(record => {
        const key = record.cid().toString();
        logRecords!.set(key, record);
      });
    } finally {
      this.mutex.release();
    }
  }

  list(): Record<string, PeerRecords> {
    const result: Record<string, PeerRecords> = {};

    this.records.forEach((logRecords, logId) => {
      const records = Array.from(logRecords.values());
      result[logId] = {
        records,
        counter: this.counters.get(logId) || 0,
      };
    });

    return result;
  }
}
