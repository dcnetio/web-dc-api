import type { Client } from "../dcapi";
import type { Multiaddr as TMultiaddr } from "@multiformats/multiaddr";
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { dcnet  as dcnet_proto} from "../proto/dcnet_proto";
import { Key as ThreadKey } from './common/key';
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { NewThreadOptions } from './core/options';
import { ThreadID } from '@textile/threads-id'; 
import { PeerRecords} from "./net/define";
import { DBGrpcClient } from "./net/grpcClient";
import { PeerId } from "@libp2p/interface";
import { IRecord } from "./core/record";
import { DcUtil,BrowserType } from "../dcutil";
import {net as net_pb} from "../threaddb/pb/net_pb";
import {ILogstore} from "./core/logstore";
import  {IThreadInfo, IThreadLogInfo, ThreadInfo} from "./core/core";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import {peerIdFromString} from "@libp2p/peer-id";
import {multiaddr} from "@multiformats/multiaddr";
import { CID } from 'multiformats/cid';
import { CIDUndef, HeadUndef } from "./core/head";
import {PermanentAddrTTL} from "./common/logstore";
import { Net } from "./core/app";
import {SymKey} from "./core/core";
import { ThreadToken } from "./core/identity";




export class DBClient {
  client: Client;
  dc: DcUtil;
  logstore: ILogstore;
  net:Net;

  constructor(dcClient: Client,dcUtil: DcUtil,net:Net,logstore: ILogstore) {
    this.net = net;
    this.logstore = logstore;
    this.dc = dcUtil;
    this.client = dcClient;
  }

  async requestThreadID(
    peerAddr?: TMultiaddr
  ): Promise<string> {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      if (!peerAddr) {
        peerAddr = this.client.peerAddr;
      }
      const grpcClient = new DBGrpcClient(
        this.client.p2pNode,
        peerAddr,
        this.client.token,
        this.net,
        this.client.protocol
      );
      const tid = await grpcClient.requestThreadID();
      return tid;
    } catch (err) {
      console.error("getHostID error:", err);
      throw err;
    }
  }

  async createThread(tid:string,opts: NewThreadOptions): Promise<string> {
    try {
        if (this.client.p2pNode == null || this.client.p2pNode.peerId == null) {
            throw new Error("p2pNode is null or node privateKey is null");
        }        
        const sPubkey = await extractPublicKeyFromPeerId(this.client.p2pNode.peerId);
        const grpcClient = new DBGrpcClient(
            this.client.p2pNode,
            this.client.peerAddr,
            this.client.token,
            this.net,
            this.client.protocol
          );
      const threadInfo = await grpcClient.createThread(tid, opts);
      return tid;
    } catch (err) {
      console.error("createThread error:", err);
      throw err;
    }
  }


  async pushRecordToPeer(
        tid: ThreadID, 
        lid: PeerId,
        rec: IRecord,
        counter: number
      ): Promise<void> {
        try {
          if (this.client.p2pNode == null) {
            throw new Error("p2pNode is null");
          }
          const grpcClient = new DBGrpcClient(
            this.client.p2pNode,
            this.client.peerAddr,
            this.client.token,
            this.net,
            this.client.protocol
          );
          grpcClient.pushRecordToPeer(
            tid,
            lid,
            rec,
            counter
          );
          //开启threaddb的block记录上报流
          this.dc.createTransferStream(
            this.client.p2pNode,
            this.client.blockstore,
            this.client.peerAddr,
            BrowserType.ThreadRec,
            rec.cid().toString(),
          );
        } catch (err) {
          throw new Error(`Error pushing record: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

/**
 * 与对等点交换边缘（状态信息）
 * @param threadIds threadID数组
 * @returns 无返回值
 */
async exchangeEdges(threadIds: ThreadID[]): Promise<void> {
  try {
    if (this.client.p2pNode == null) {
      throw new Error("p2pNode is null");
    }

    console.debug(`exchanging edges of ${threadIds.length} threads with peer...`);
    
    // 创建请求体
    const body: net_pb.pb.ExchangeEdgesRequest.IBody = {
      threads: []
    };
    body.threads = [];

    // 填充本地边缘信息
    for (const tid of threadIds) {
      try {
        // 获取本地边缘信息
        const { addrEdge, headsEdge } = await this.localEdges(tid);
        // 添加到请求中
        body.threads.push({
          threadID: tid.toBytes(),
          headsEdge: headsEdge,
          addressEdge: addrEdge
        });
      } catch (err) {
        if (err.message !== "No address edge" && 
            err.message !== "No heads edge") {
          console.error(`Getting local edges for ${tid} failed:`, err);
        } else {
          body.threads.push({
            threadID: tid.toBytes(),
            headsEdge: 0, // EmptyEdgeValue
            addressEdge: 0 // EmptyEdgeValue
          });
        }
      }
    }

    if (body.threads.length === 0) {
      return;
    }

    // 创建完整请求
    const req = new net_pb.pb.ExchangeEdgesRequest();
    req.body = body;
    // 创建gRPC客户端
    const grpcClient = new DBGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.net,
      this.client.protocol
    );

    // 发送请求并设置超时
    const timeout = 30000; // 30s timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);
    
    try {
      // 发送交换边缘请求
      const reply = await grpcClient.exchangeEdges(req);
      // 处理响应
      for (const edge of reply.edges || []) {
        if (!edge.threadID) continue;
        
        const tid = ThreadID.fromBytes(edge.threadID);
        
        // 获取本地可能已更新的边缘
        let addrEdgeLocal = 0, headsEdgeLocal = 0;
        try {
          const localEdges = await this.localEdges(tid);
          addrEdgeLocal = localEdges.addrEdge;
          headsEdgeLocal = localEdges.headsEdge;
        } catch (err) {
          // 允许本地边缘为空
          if (err.message !== "No address edge" && 
              err.message !== "No heads edge") {
            console.error(`Second retrieval of local edges for ${tid} failed:`, err);
            continue;
          }
        }
        // 检查地址边缘是否有更新
        const responseAddrEdge = edge.addressEdge || 0;
        if (responseAddrEdge !== 0 && responseAddrEdge !== addrEdgeLocal) {
          // 调度日志更新
          await this.scheduleUpdateLogs(tid);
          console.debug(`Log information update for thread ${tid} scheduled`);
        }
        // 检查头部边缘是否有更新
        const responseHeadEdge = edge.headsEdge || 0;
        if (responseHeadEdge !== 0 && responseHeadEdge !== headsEdgeLocal) {
          // 调度记录更新
          await this.scheduleUpdateRecords(tid);
          console.debug(`Record update for thread ${tid} scheduled`);
        }
      }
    } catch (err) {
      // 处理特殊错误码
      if (err.code === 'UNIMPLEMENTED') {
        console.debug(`Peer doesn't support edge exchange, falling back to direct record pulling`);
        for (const tid of threadIds) {
          await this.scheduleUpdateRecords(tid);
          console.debug(`Record update for thread ${tid} scheduled`);
        }
        return;
      } else if (err.code === 'UNAVAILABLE') {
        console.debug(`Peer unavailable, skip edge exchange`);
        return;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (err) {
    throw new Error(`Exchange edges failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
/**
 * 获取threaddb 的本地边缘值（地址和头部）
 * 边缘值用于确定是否需要从远程对等点获取更新
 * 
 * @param tid threaddb ID
 * @returns 地址边缘值和头部边缘值的对象
 * @throws 错误，包括特定的"No address edge"和"No heads edge"错误
 */
private async localEdges(tid: ThreadID): Promise<{ addrEdge: number, headsEdge: number }> {
  // 使用默认值初始化头部边缘值
  let headsEdge = 0; // EmptyEdgeValue 在 TS 中对应于 0
  let addrEdge = 0;

  try {
    // 尝试获取地址边缘值
    addrEdge = await this.logstore.addrBook.addrsEdge(tid);
  } catch (err) {
    // 处理threaddb 未找到错误
    if (err.message.includes("Thread not found")) {
      throw new Error("No address edge");
    } else {
      throw new Error(`Address edge: ${err.message}`);
    }
  }

  try {
    // 尝试获取头部边缘值
    headsEdge = await this.logstore.headBook.headsEdge(tid);
  } catch (err) {
    // 处理threaddb 未找到错误
    if (err.message.includes("Thread not found")) {
      throw new Error("No heads edge");
    } else {
      throw new Error(`Heads edge: ${err.message}`);
    }
  }

  // 返回边缘值对象
  return { addrEdge, headsEdge };
}
/**
 * 调度日志更新
 * @param tid threaddb ID
 */
private async scheduleUpdateLogs(tid: ThreadID): Promise<void> {
   // 创建gRPC客户端
  const lgs =  await this.getLogs(tid);
	return this.createExternalLogsIfNotExist(tid, lgs)
}

/**
 * 调度记录更新
 * @param tid threaddb ID
 */
private async scheduleUpdateRecords(tid: ThreadID): Promise<void> {
  // 实现记录更新调度逻辑
  // 在实际实现中，这可能会将任务推入队列
}


/**
 * 获取threaddb 中的日志
 * @param tid threaddb ID
 * @param pid 对等点ID
 * @returns 日志信息数组
 */
async getLogs(tid: ThreadID): Promise<IThreadLogInfo[]> {
  try {
    // 获取服务密钥
    const serviceKey = await this.logstore.keyBook.serviceKey(tid);
    
    if (!serviceKey) {
      throw new Error("A service-key is required to request logs");
    }
    
    const grpcClient = new DBGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.net,
      this.client.protocol
    );

    
    // 解码响应
    const reply = await grpcClient.getLogs(tid, serviceKey.raw);
    if (!reply.logs) {
      return [];
    }
    // 将日志从protobuf格式转换为应用格式
    const logs: IThreadLogInfo[] = await Promise.all(
      reply.logs.map(async (l) => await this.logFromProto(l))
    );
    return logs;
  } catch (err) {
    console.warn(`Get logs from ${this.client.peerAddr} failed: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
}


async getRecordsFromPeer(
  req: any,
  serviceKey: SymKey
): Promise<Record<string, PeerRecords>> {
    
  if (!serviceKey) {
    throw new Error("A service-key is required to request logs");
  }
  
  const grpcClient = new DBGrpcClient(
    this.client.p2pNode,
    this.client.peerAddr,
    this.client.token,
    this.net,
    this.client.protocol
  );

  const reply = await grpcClient.getRecordsFromPeer( req, serviceKey.raw);
  if (!reply.records) {
    return {};
  }
  return reply;
}



/**
 * 创建外部日志（如果不存在）
 * 创建的日志将使用未定义CID作为当前头部
 * 此方法是线程安全的
 * 
 * @param tid 线程ID
 * @param logs 日志信息数组
 */
async createExternalLogsIfNotExist(tid: ThreadID, logs: IThreadLogInfo[]): Promise<void> {

  try {
    
    
    // 处理每个日志
    for (const log of logs) {
      try {
        // 检查当前头部
        const heads = await this.logstore.headBook.heads(tid, log.id);
        
        if (heads.length === 0) {
          // 如果没有头部，设置为未定义并添加日志
          log.head =HeadUndef;
          await this.logstore.addLog(tid, log);
        } else {
          // 更新日志地址
          await this.logstore.addrBook.addAddrs(
            tid, 
            log.id, 
            log.addrs, 
            PermanentAddrTTL
          );
        }
      } catch (err) {
        throw err;
      }
    }
  } finally {
  }
}


async getThreadFromPeer(
  id: ThreadID, 
  peerId: PeerId,
  options: { token?: ThreadToken } = {}
): Promise<IThreadInfo> {
  const grpcClient = new DBGrpcClient(
    this.client.p2pNode,
    this.client.peerAddr,
    this.client.token,
    this.net,
    this.client.protocol
  )
  const threadInfo = await grpcClient.getThreadFromPeer(id);
  return threadInfo;
}




/**
 * 将protobuf格式的日志转换为应用格式
 * @param protoLog protobuf格式的日志
 * @returns 应用格式的日志信息
 */
private async logFromProto(protoLog: net_pb.pb.ILog): Promise<IThreadLogInfo> {
  if (!protoLog.ID || !protoLog.pubKey) {
    throw new Error('Missing required fields in Log: ID or pubKey');
  }
  
  // 解析日志ID
  const id =  peerIdFromString(uint8ArrayToString(protoLog.ID));
  
  // 解析公钥
  const pubKey =  Ed25519PubKey.publicKeyFromProto(protoLog.pubKey);
  

  // 解析地址
  const addrs = (protoLog.addrs || []).map(addr => multiaddr(addr));
  
  // 解析头部信息
  const head = protoLog.head
    ?  CID.decode(protoLog.head)
    : CID.parse('');
  
  // 解析计数器
  const counter = protoLog.counter
    ? Number(protoLog.counter)
    : 0;
  
  // 创建并返回日志信息
  return {
    id,
    pubKey,
    addrs,
    managed: true,
    head: {
      id: head,
      counter
    }
  };
}
  
}