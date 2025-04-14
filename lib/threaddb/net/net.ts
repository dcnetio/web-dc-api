import crypto from 'crypto';  

import { peerIdFromPublicKey,peerIdFromPrivateKey, peerIdFromMultihash, peerIdFromString } from "@libp2p/peer-id";
import { keys } from "@libp2p/crypto";
import { Multiaddr, multiaddr,protocols } from '@multiformats/multiaddr'; // 多地址库  
import { Head } from '../core/head'; 
import { ThreadID } from '@textile/threads-id'; 
import { Ed25519PrivKey,Ed25519PubKey } from "../../dc-key/ed25519";
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface"; 
import { SymmetricKey, Key as ThreadKey } from '../common/key';
import {validateIDData} from '../lsstoreds/global';
import {  ThreadInfo, IThreadLogInfo} from '../core/core';
import {ThreadToken} from '../core/identity';
import {ILogstore} from '../core/logstore';
import {Datastore} from 'interface-datastore';
import {Blocks} from 'helia'
import { DAGCBOR } from '@helia/dag-cbor'; // DAGService
import { IRecord,IThreadRecord } from '../core/record'; 
import {DCGrpcServer} from './grpcserver';
import { Libp2p } from "@libp2p/interface";
import {dc_protocol} from '../../define';
import {Connector}  from "../core/app";
import {EventFromNode,Event} from '../cbor/event';
import {Node} from '../cbor/node';  
import {IPLDNode} from '../core/core';
import {ThreadRecord,TimestampedRecord,PeerRecords,netPullingLimit} from './define';
import {CID} from 'multiformats/cid';
import {HeadUndef,CIDUndef} from '../core/head';
import {GetRecord} from '../cbor/record';
import {IThreadEvent} from '../core/event';
import {DBGrpcClient} from './grpcClient';
import { DBClient } from '../client';
import { Client } from "../../dcapi";
import {ChainUtil} from '../../chain';
import {   
  PeerIDConverter,  
  MultiaddrConverter,  
  CidConverter,  
  ThreadIDConverter,  
  KeyConverter,  
  ProtoKeyConverter,
  json,  
  ProtoPeerID
} from '../pb/proto-custom-types' 





/**
 * Creates a new ThreadRecord
 */
function newRecord(r: IRecord, id: ThreadID, lid: PeerId): IThreadRecord {
  return new ThreadRecord(r, id, lid);
}


// 定义 Network 类  
class Network {  
  private logstore: ILogstore;  
  private bstore: Blocks;
  private ds: Datastore;
  private dcChain: ChainUtil;
  private dagService: DAGCBOR; 
  private hostID: string;  
  private privateKey: Ed25519PrivKey;  
  private server:DCGrpcServer;
  private libp2p: Libp2p;
  private connectors: Record<string, Connector>;
  private cachePeers: Record<string, Multiaddr> = {};

  constructor(dcChain: ChainUtil,libp2p:Libp2p,logstore: ILogstore,ds: Datastore,bstore: Blocks,dagService: DAGCBOR,  privateKey: Ed25519PrivKey) {  
    this.logstore = logstore;  
    this.hostID = libp2p.peerId.toString();  
    this.privateKey = privateKey;  
    this.ds = ds;
    this.bstore = bstore;
    this.dagService = dagService;
    this.libp2p = libp2p;
    this.server = new DCGrpcServer(libp2p,dc_protocol);
    this.server.start();
    this.connectors = {};
    this.dcChain = dcChain;
  }  

   // 签名,后续应该改成发送到钱包iframe中签名,发送数据包含payload和用户公钥
   sign =  (payload: Uint8Array): Uint8Array => {
    if (!this.privateKey) {
      throw new Error("privKey is null");
    }
    const signature = this.privateKey.sign(payload);
    return signature;
  }

  async getClient(peerId: PeerId):Promise<Client>{
    let cachedFlag = true;
    const cacheAddr = this.cachePeers[peerId.toString()]; 
    let peerAddr: Multiaddr | undefined = cacheAddr;
    if (!cacheAddr) {
      cachedFlag = false;
      peerAddr = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId.toString());
    }
   
    if (!peerAddr) {
      throw new Error("peerAddr is null");
    } 
    const addr = multiaddr(peerAddr);
    const client = new Client(this.libp2p,addr, dc_protocol);
    //获取token
    const token = await client.GetToken(this.privateKey.publicKey.toString(),(payload: Uint8Array) => {
      return this.sign(payload);
    });
    if (!token) {
      if (cachedFlag) {
        peerAddr = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId.toString());
        delete this.cachePeers[peerId.toString()];
        if (!peerAddr) {
          throw new Error("peerAddr is null");
        } 
        const addr = multiaddr(peerAddr);
        const client = new Client(this.libp2p,addr, dc_protocol);
        const token = await client.GetToken(this.privateKey.publicKey.toString(),(payload: Uint8Array) => {
          return this.sign(payload);
        });
        if (token) {
          this.cachePeers[peerId.toString()] = peerAddr;
          return client;
        }
      }
      throw new Error("get token is null");
      
    }
    this.cachePeers[peerId.toString()] = peerAddr;
    return client;
  }

  async getPeers(id: ThreadID):Promise<PeerId[]| undefined>{
   //从区块链中获取数据库存储的所有节点
   return
  }

  /**  
   * 创建threaddb  
   */  
  async createThread(id: ThreadID, options: { token: ThreadToken; logKey?: Ed25519PrivKey|Ed25519PubKey, threadKey?: ThreadKey }): Promise<ThreadInfo> {  
    const identity = await this.validate(id, options.token, false);  
    if (identity) {  
      console.debug("Creating thread with identity:", identity.toString());  
    } else {  
      throw new Error("Identity creation failed.");  
    }  

    await this.ensureUniqueLog(id, options.logKey, identity);  
    const threadKey = options.threadKey || this.generateRandomKey();  

    const threadInfo  = new ThreadInfo(id, [], [], threadKey );  

    await this.logstore.addThread(threadInfo);  
    const logInfo = await this.createLog(id, options.logKey, identity);  
    threadInfo.logs.push(logInfo);
    return threadInfo; 
  }  

  /**  
   * 验证线程 ID 和 Token  
   */  
  async validate(id: ThreadID, token: ThreadToken, readOnly: boolean): Promise<PublicKey|null> {  
    if (!validateIDData(id.toBytes())) {  
      throw new Error("Invalid thread ID.");  
    }    
    return await token.validate(this.privateKey);  
  }  

 
/**
 * 确保日志唯一性
 * 检查给定线程是否已存在具有相同密钥或身份的日志
 */
async ensureUniqueLog(id: ThreadID, key?: Ed25519PrivKey | Ed25519PubKey, identity?: PublicKey): Promise<void> {
  try {
    const thrd = await this.logstore.getThread(id);
    
    // 线程存在，继续检查
    let lid: PeerId;
    
    if (key) {
      // 根据密钥类型处理
      if (key instanceof Ed25519PubKey) {
        lid =  peerIdFromPublicKey(key);
      } else if (key instanceof Ed25519PrivKey) {
        lid =  peerIdFromPrivateKey(key);
      } else {
        throw new Error("Invalid log key");
      }
    } else {
      // 没有提供密钥，检查是否有此身份的日志
      if (!identity) {
        throw new Error("Either key or identity must be provided");
      }
      
      try {
        const lidb = await this.logstore.metadata.getBytes(id, identity.toString());
        if (!lidb || lidb.length === 0) {
          // 检查是否有旧式"own"（未索引）日志
          if (identity.equals(this.privateKey.publicKey)) {
            const firstPrivKeyLog = thrd.getFirstPrivKeyLog();
            if (firstPrivKeyLog && firstPrivKeyLog.privKey) {
              throw new Error("Thread exists");
            }
          }
          return;
        }
        const lidbstr = new TextDecoder().decode(lidb);
        // 从字节转换为PeerId
        lid =  peerIdFromString(lidbstr);
      } catch (error) {
        throw error;
      }
    }
    
    // 检查此ID的日志是否已存在
    try {
      await this.logstore.getLog(id, lid);
      // 如果到达这里，说明日志存在
      throw new Error("Log exists");
    } catch (error: any) {
      // 如果错误是"日志未找到"，那很好
      if (error.message === "Log not found") {
        return;
      }
      // 其他错误需要抛出
      throw error;
    }
  } catch (error: any) {
    // 如果线程未找到，那没问题（我们正在创建一个新线程）
    if (error.message === "Thread not found") {
      return;
    }
    // 否则抛出错误
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
        const resultAddrs: Multiaddr[] = [];
        
        // Encapsulate each address with peer and thread components
        for (const addr of hostAddrs) {
          const withPeerId = addr.encapsulate(`/p2p/${this.libp2p.peerId.toString()}`);
          const withThread = withPeerId.encapsulate(`/thread/${tinfo.id.toString()}`);
          resultAddrs.push(withThread); 
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
  async pullThread(ctx: any, id: ThreadID): Promise<void> {
    try {
      const recs = await this.pullThreadDeal(id);
      
      const [connector, appConnected] =  this.getConnector(id);
      
      // Handle records
      const tRecords: TimestampedRecord[] = [];
      
      for (const [lidStr, rec ] of Object.entries(recs)) {
        const lid = peerIdFromString(lidStr);
        const rs = rec as PeerRecords;
        if (appConnected) {
          let indexCounter = rs.counter - rs.records.length + 1;
          
          for (let i = 0; i < rs.records.length; i++) {
            const r = rs.records[i];
            
            // Get blocks for validation
            const block = await r.getBlock( this.dagService);
            const event = block instanceof Event ? block : await EventFromNode(block as Node);
            
            const header = await event.getHeader(this.dagService);
            const body = await event.getBody(this.dagService);
            
            // Store internal blocks locally
            await this.addMany([event, header, body]);
            
            const tRecord = newRecord(r, id, lid);
            const counter = indexCounter + i;
            const createtime = await connector!.getNetRecordCreateTime( tRecord);
            
            tRecords.push({
              record: r,
              counter: counter,
              createtime: createtime,
              logid: lid
            });
          }
        } else {
          await this.putRecords(ctx, id, lid, rs.records, rs.counter);
        }
      }

      tRecords.sort((a, b) =>  {
        if (a.createtime < b.createtime) return -1;
        if (a.createtime > b.createtime) return 1;
        return 0;
      }); 
      
      // Process each record in order
      for (const r of tRecords) {
        await this.putRecords(ctx, id, r.logid, [r.record], r.counter);
      }
    } catch (err) {
      throw err;
    } 
  }


  async addMany( nodes: IPLDNode[]): Promise<void> {
    for (const node of nodes) {
      await this.dagService.add( node);
    } 
  }
  /**
   * Pull thread records from peers
   */
  async pullThreadDeal(tid: ThreadID): Promise<Record<string, PeerRecords>> {
    try {
      let [offsets, peers] = await this.threadOffsets(tid);
      try {
        const extPeers = await this.getPeers( tid);
        if (extPeers && extPeers.length > 0) {
          peers = extPeers;
        }
      } catch (err) {
        // Ignore getPeers errors
      }
      const pulledRecs: Record<string, PeerRecords> = {};
      
      // Continue pulling until no more records
      while (true) {
        const recs = await this.getRecords(peers, tid, offsets, netPullingLimit);
        let continueFlag = false;
        
        for (const [lidStr, rs] of Object.entries(recs)) {
          if (rs.records.length > 0) {
            const existing = pulledRecs[lidStr] || { records: [], counter: 0 };
            const records = [...existing.records, ...rs.records];
            
            pulledRecs[lidStr] = {
              records: records,
              counter: rs.counter
            };
            
            const lastRecord = rs.records[rs.records.length - 1];
            offsets[lidStr] = {
              id: lastRecord.cid(),
              counter: rs.counter
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
    key?: Ed25519PrivKey|Ed25519PubKey,  
    identity?: PublicKey  
  ): Promise<IThreadLogInfo> {  
    let privKey: PrivateKey | undefined;  
    let pubKey: PublicKey;  
    let peerId: PeerId;  
    if (!key) {  
      const keyPair = await keys.generateKeyPair('Ed25519');
      privKey =  new Ed25519PrivKey(keyPair.raw) 
      pubKey = keyPair.publicKey;  
      peerId =  peerIdFromPrivateKey(privKey);  
    } else {  
      if (key instanceof Ed25519PrivKey) {  
        privKey = key;
        pubKey = key.publicKey;  
        peerId = peerIdFromPrivateKey(key);  
      }else if(key instanceof Ed25519PubKey){
        pubKey = key;
        peerId = peerIdFromPublicKey(key);
      }else{
        throw new Error("Invalid key type.");  
      }   
    }  
    const addr = multiaddr(`/p2p/${this.hostID}`); // 基于 hostID 生成地址  
    const head : Head = {
        id: peerId.toCID(),
        counter: 0,
    }
    const logInfo: IThreadLogInfo = {  
      privKey,  
      pubKey,  
      id: peerId,  
      addrs: [addr],  
      managed: true, 
      head: head
    };  

    // 将日志添加到threaddb存储  
    await this.logstore.addLog(id, logInfo);  
    const logIDBytes = new TextEncoder().encode(peerId.toString());  
    await this.logstore.metadata.putBytes(id, identity?.toString() || "", logIDBytes);  
    return logInfo;  
  }  

  /**  
   * 生成随机线程密钥  
   */  
  generateRandomKey(): ThreadKey {  
    return new ThreadKey(SymmetricKey.new(),SymmetricKey.new());  
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
  async threadOffsets(tid: ThreadID): Promise<[Record<string, Head>, PeerId[]]> {
    const info = await this.logstore.getThread(tid);
    
    const offsets: Record<string, Head> = {};
    const addrs: Multiaddr[] = [];
    
    // Process all logs in thread
    for (const lg of info.logs) {
      // Check if head is known
      let has = false;
      
      if (lg.head?.id) {
        has = await this.isKnown( lg.head.id);
      }
      
      if (has && lg.head) {
        offsets[lg.id.toString()] = lg.head;
          // Collect addresses
      
      }else{
        offsets[lg.id.toString()] = HeadUndef;
      }
      addrs.push(...lg.addrs);
      
    
    }
    
    // Get unique peer IDs
    const peers = await this.uniquePeers(addrs);
    
    return [offsets, peers];
  }


  /**
   * Add records to a thread
   */
  async putRecords(ctx: any, tid: ThreadID, lid: PeerId, recs: IRecord[], counter: number): Promise<void> {
    const [chain, head] = await this.loadRecords(ctx, tid, lid, recs, counter);
    
    if (chain.length === 0) {
      return;
    }
    
    try {
      // Check the head again, as another process could have changed the log
      const current = await this.currentHead(tid, lid);
      
      let headReached = true;
      let updatedHead = head;
      
      if (!current.id.equals(head.id)) {
        // Fast-forward the chain up to the updated head
        headReached = false;
        updatedHead = current;
        
        for (let i = 0; i < chain.length; i++) {
          if (chain[i].value().cid().equals(current.id)) {
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
      let identity:Ed25519PubKey;
      let readKey: SymmetricKey | null = null;
      let validate = false;
      let updatedCounter = updatedHead.counter;
      
      if (appConnected) {
       const  symKey  = await this.logstore.keyBook.readKey(tid)
       if (symKey){
         readKey = SymmetricKey.fromSymKey( symKey);
       }
       if (readKey) {
          validate = true;
        }
      }

      for (const record of chain) {
        if (validate) {
          // Validate the record
          const block = await record.value().getBlock(this.dagService);
          
          let event;
          if (block instanceof Event) {
            event = block;
          } else {
            event = await EventFromNode(block as Node);
          }
          const dbody = await event.getBody(ctx, this, readKey!);
          
          identity =  await KeyConverter.publicFromBytes<Ed25519PubKey>(record.value().pubKey());
          
          try {
            await connector!.validateNetRecordBody(dbody, identity);
          } catch (err) {
            // If validation fails, clean up blocks
            const header = await event.getHeader(ctx, this, null);
            const body = await event.getBody(ctx, this, null);
            this.bstore.deleteMany([event.cid(), header.cid(), body.cid()]);
            throw err;
          }
        }

        // Update head counter
        updatedCounter++;
        
        // Set new head for the log
        await this.logstore.headBook.setHead(
          tid,
          lid,
          {
            id: record.value().cid(),
            counter: updatedCounter
          }
        );
        
        // Set checkpoint for log
        await this.setThreadLogPoint(tid, lid, updatedCounter, record.value().cid());
        
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
        await this.dagService.add(record.value());
        
      }
    } finally {
      
    }
  }

  /**
   * Load records from a thread
   */
  async loadRecords(
    ctx: any,
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
    const last = recs[recs.length - 1];
    
    // If we don't have the counter, check if record exists
    if (counter === undefined) {
      const exist = await this.isKnown(last.cid());
      if (exist || !last.cid().equals(CIDUndef)) {
        return [[], head];
      }
    } else if (counter <= head.counter) {
      return [[], head];
    }

    const chain: IRecord[] = [];
    let complete = false;
    
    // Check which records we already have
    for (let i = recs.length - 1; i >= 0; i--) {
      const next = recs[i];
      if (!next.cid().equals(CIDUndef) || next.cid().equals(head.id)) {
        complete = true;
        break;
      }
      chain.push(next);
    }

    // Bridge the gap between the last provided record and current head
    if (!complete) {
      let c = chain[chain.length - 1].prevID();
      
      while (c?.equals(CIDUndef)) {
        if (c.equals(head.id)) {
          break;
        }

        const r = await this.getRecord( tid, c);
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
      const r = chain[i];
      
      // Get and cache blocks
      const block = await r.getBlock(this.dagService);
      
     let event: IThreadEvent;
      if (block instanceof Event) {
        event = block;
      } else {
        event = await EventFromNode(block as Node);
      }

      const header = await event.getHeader(this.dagService);
      const body = await event.getBody(this.dagService);
      
      // Store internal blocks
      await this.addMany([event, header, body]);
      tRecords.push(newRecord(r, tid, lid)as ThreadRecord);
    }

    return [tRecords, head];
  }



  /**
   * Check if a record exists
   */
  async isKnown( rec: CID): Promise<boolean> {
    return await this.bstore.has( rec);
  }


/**
 * 获取记录
 * 从给定的线程和CID获取记录
 * 
 * @param ctx 上下文
 * @param id 线程ID
 * @param rid 记录CID
 * @returns 检索到的记录
 * @throws 如果无法获取服务密钥或记录
 */
async getRecord( id: ThreadID, rid: CID): Promise<IRecord> {
  // 从存储中获取服务密钥
  const serviceKey = await this.logstore.keyBook.serviceKey(id);
  
  // 检查服务密钥是否存在
  if (!serviceKey) {
    throw new Error("A service-key is required to get records");
  }
  
  const sk = SymmetricKey.fromSymKey(serviceKey)
  // 使用CBOR获取记录
  return await GetRecord(this.dagService, rid, sk);
}
    /**
   * Set a thread log checkpoint
   */
    async setThreadLogPoint(tid: ThreadID, lid: PeerId, counter: number, rcid: CID): Promise<void> {
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
      return heads[0];
    } else {
      return HeadUndef;
    }
  }
    /**
     * Extract unique peer IDs from addresses
     */
    async uniquePeers(addrs: Multiaddr[]): Promise<PeerId[]> {
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
      async callablePeer(addr: Multiaddr): Promise<[PeerId, boolean]> {
        const p = addr.getPeerId();
        if (!p) {
          throw new Error("Address does not contain peer ID");
        }
        
        const pid =  peerIdFromString(p);
        
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
    offsets: Record<string, { id: CID, counter: number }>,
    limit: number
  ): Promise<Record<string, PeerRecords>> {
    try {
      // 构建请求
      const { req, serviceKey } = await this.buildGetRecordsRequest(tid, offsets, limit);
      
      // 创建记录收集器
      const recordCollector = new RecordCollector();
      
      // 确定需要获取的对等点数量
      const needFetched = Math.min(2, peers.length);
      let fetchedPeers = 0;
      
      // 创建一个 Promise 在足够的对等点响应时解析
      const fetchPromise = new Promise<void>((resolve) => {
        // 当所有查询完成时，解析 Promise
        const checkComplete = () => {
          if (fetchedPeers >= needFetched) {
            resolve();
          }
        };
        
        // 从每个对等点查询记录
        const fetchPromises = peers.map(async (peerId) => {
          try {
            //连接到指定peerId,返回一个Client
            const client = await this.getClient(peerId);
            if (!client) {
              return;
            }
            const dbClient = new DBClient(client);
        
            // 这里使用一个队列来控制并发，类似于 Go 代码中的 queueGetRecords
            const records = await dbClient.getRecordsFromPeer(client.peerAddr, tid, peerId.toString(), req, serviceKey);
            
            // 更新收集器
            Object.entries(records).forEach(([logId, rs]) => {
              recordCollector.updateHeadCounter(logId, rs.counter);
              rs.records.forEach(record => {
                recordCollector.store(logId, record);
              });
            });
            
            fetchedPeers++;
            
            // 如果获取了记录并且达到了所需的对等点数量，则解析 Promise
            if (Object.keys(records).length > 0 && fetchedPeers >= needFetched) {
              resolve();
            }
            
            // 暂停一秒钟避免过多并发请求
            await new Promise(r => setTimeout(r, 1000));
          } catch (err) {
            console.error(`Error getting records from peer ${peerId}:`, err);
          }
        });
        
        // 当所有查询完成或失败时，检查是否需要解析 Promise
        Promise.all(fetchPromises.map(p => p.catch(e => e)))
          .then(() => checkComplete());
      });
      
      // 设置超时
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error("Fetch records timeout")), 30000);
      });
      
      // 等待获取足够的记录或超时
      await Promise.race([fetchPromise, timeoutPromise]);
      
      // 返回收集到的记录
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
    offsets: Record<string, { id: CID, counter: number }>,
    limit: number
  ): Promise<{ req: any, serviceKey: any }> {
    try {
      // 从存储中获取服务密钥
      const serviceKey = await this.logstore.keyBook.serviceKey(tid);
      
      if (!serviceKey) {
        throw new Error("A service-key is required to request records");
      }
      
      // 创建日志条目
      const logs = Object.entries(offsets).map(([logId, offset]) => {
        return {
          logID: { ID: new TextEncoder().encode(logId) },
          offset: { cid: offset.id.bytes },
          limit: limit,
          counter: offset.counter
        };
      });
      
      // 构建请求体
      const body = {
        threadID: { ID: tid.toBytes() },
        serviceKey: { key: serviceKey.raw },
        logs: logs
      };
      
      // 创建请求
      const req = {
        body: body
      };
      
      return { req, serviceKey };
    } catch (err) {
      console.error("buildGetRecordsRequest error:", err);
      throw err;
    }
  }

}



 /**
 * 记录收集器，用于合并多个对等点的记录
 */
 class RecordCollector {
    private records: Map<string, Map<string, any>> = new Map();
    private counters: Map<string, number> = new Map();
  
    updateHeadCounter(logId: string, counter: number): void {
      const current = this.counters.get(logId) || 0;
      if (counter > current) {
        this.counters.set(logId, counter);
      }
    }
  
    store(logId: string, record: any): void {
      let logRecords = this.records.get(logId);
      if (!logRecords) {
        logRecords = new Map();
        this.records.set(logId, logRecords);
      }
      // 使用记录的CID作为键，避免重复
      const key = record.cid().toString();
      logRecords.set(key, record);
    }
  
    list(): Record<string, PeerRecords> {
      const result: Record<string, PeerRecords> = {};
      
      this.records.forEach((logRecords, logId) => {
        const records = Array.from(logRecords.values());
        result[logId] = {
          records,
          counter: this.counters.get(logId) || 0
        };
      });
      
      return result;
    }
  }




