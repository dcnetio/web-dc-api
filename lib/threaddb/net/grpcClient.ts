import type { Libp2p } from "libp2p";
import { ThreadID } from "@textile/threads-id";
import { dcnet as dcnet_proto } from "../../proto/dcnet_proto";
import { net as net_pb} from "../pb/net_pb";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import {IThreadLogInfo, SymKey} from "../core/core";
import  {Multiaddr as TMultiaddr,multiaddr} from '@multiformats/multiaddr'
import  Multiaddr  from 'multiaddr'
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Key as ThreadKey } from '../common/key';
import { Ed25519PubKey,Ed25519PrivKey } from "../../dc-key/ed25519";
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { extractPublicKeyFromPeerId,extractPeerIdFromMultiaddr } from "../../dc-key/keyManager";
import { NewThreadOptions } from '../core/options';
import {ThreadInfo } from '../core/core';
import { CID } from 'multiformats/cid';
import { PeerRecords, Protocol} from "./define";
import {RecordFromProto} from "../cbor/record";
import { IRecord } from "../core/record";
import { PeerId } from "@libp2p/interface";
import {RecordToProto} from "../cbor/record";
import { Net } from "../core/app";
import { dcnet } from "../../proto/dcnet_proto";
import {ThreadMuliaddr} from "../core/core";
import * as varint from 'uint8-varint'
import { protocols } from "@multiformats/multiaddr";
import { SymmetricKey } from '../common/key';
import {   
  PeerIDConverter,   
  CidConverter,
  MultiaddrConverter,  
} from '../pb/proto-custom-types' 
import * as buffer from "buffer/";
import { log } from "console";
import { peerIdFromString } from "@libp2p/peer-id";
const { Buffer } = buffer;

interface Protocol {
  code: number
  size: number
  name: string
  resolvable?: boolean | undefined
  path?: boolean | undefined
}

export class DBGrpcClient {
    grpcClient: Libp2pGrpcClient;
    stream: any;
    token: string;
    net:Net;

    constructor(
        node: Libp2p,
        peerAddr: TMultiaddr,
        token: string,
        net:Net,
        protocol?: string
    ) {
        this.grpcClient = new Libp2pGrpcClient(node, peerAddr, token, protocol);
        this.token = token;
        this.net = net;
    }

    

    async requestThreadID(): Promise<string> {
        try {
            const message = new dcnet_proto.pb.ThreadIDRequest({});
            const messageBytes = dcnet_proto.pb.ThreadIDRequest.encode(message).finish();
            const responseData = await this.grpcClient.unaryCall(
                "/dcnet.pb.Service/RequestThreadID",
                messageBytes,
                30000
            );
            const decoded = dcnet_proto.pb.ThreadIDReply.decode(responseData);
            return uint8ArrayToString(decoded.threadID);
        } catch (err) {
            console.error("RequestThreadID error:", err);
            throw err;
        }
    }

    async createThread(tid: string,opts:NewThreadOptions): Promise<ThreadInfo> {
        try {
     
            if (this.grpcClient.node == null || this.grpcClient.node.peerId == null) {
                throw new Error("p2pNode is null or node privateKey is null");
            }
            if (opts.threadKey == null) {
                throw new Error("threadKey is null");
            }
            const serverPeerId =  await extractPeerIdFromMultiaddr(this.grpcClient.peerAddr);
            const sPubkey = await extractPublicKeyFromPeerId(serverPeerId);
            
            const message = new dcnet_proto.pb.CreateThreadRequest({});
            message.threadID = new TextEncoder().encode(tid);
            message.keys = await this.getThreadKeys(sPubkey, { threadKey: opts.threadKey, logKey: opts.logKey });
            message.blockheight = opts.blockHeight;
            message.signature = opts.signature;
            const messageBytes = dcnet_proto.pb.CreateThreadRequest.encode(message).finish();
            const responseData = await this.grpcClient.unaryCall(
                "/dcnet.pb.Service/CreateThread",
                messageBytes,
                30000
            );
            const reply = dcnet_proto.pb.ThreadInfoReply.decode(responseData);
            const threadInfo = await this.threadInfoFromProto(reply);
            return threadInfo;
        } catch (err) {
            console.error("CreateThread error:", err);
            throw err;
        }
    }

    async addLogToThread(tid: string, lid: string, opts: NewThreadOptions): Promise<void> {
        try {

            if (this.grpcClient.node == null || this.grpcClient.node.peerId == null) {
                throw new Error("p2pNode is null or node privateKey is null");
            }
            const serverPeerId = this.grpcClient.node.peerId;
            const sPubkey = await extractPublicKeyFromPeerId(serverPeerId);
            const message = new dcnet_proto.pb.AddLogToThreadRequest({});
            message.threadID = new TextEncoder().encode(tid);
            message.logID = new TextEncoder().encode(lid);
            message.peerid = new TextEncoder().encode(serverPeerId.toString());
            message.blockheight = opts.blockHeight;
            message.signature = opts.signature;
            const messageBytes = dcnet_proto.pb.AddLogToThreadRequest.encode(message).finish();
            await this.grpcClient.unaryCall(
                "/dcnet.pb.Service/AddLogToThread",
                messageBytes,
                30000
            );
        } catch (err) {
            console.error("AddLogToThread error:", err);  
            throw err;
        }
    }


    async  threadInfoFromProto(reply: dcnet_proto.pb.IThreadInfoReply): Promise<ThreadInfo> {  
        if (!reply.threadID) {  
          throw new Error('Missing required field: threadID');  
        }  
      
        const threadID = ThreadID.fromString(new TextDecoder().decode(reply.threadID));
        const logs: IThreadLogInfo[] = reply.logs  
          ? await Promise.all(  
              reply.logs.map(async lg => {  
                if (!lg.ID || !lg.pubKey) {  
                  throw new Error('Missing required fields in LogInfo: id or pubKey');  
                }  
                const id =  PeerIDConverter.fromBytes(lg.ID);
                const pubKey =  Ed25519PubKey.publicKeyFromProto(lg.pubKey);
                let privKey : Ed25519PrivKey | undefined = undefined;
                if (lg.privKey?.length == 64) {
                  privKey =  Ed25519PrivKey.privateKeyFromProto(lg.privKey);
                }
                const addrs = lg.addrs?.map(addr => MultiaddrConverter.fromBytes(addr)) || [];  
      
                const head = lg.head ? CidConverter.fromBytes(lg.head) :null;  
                
                let counter = -1
                if (lg.counter && lg.counter.length > 0) {  
                  const counterBuffer = Buffer.from(lg.counter);
                  counter = Number(counterBuffer.readBigUInt64BE(0));
                }
                return {  
                  id,  
                  pubKey,  
                  privKey,  
                  addrs,  
                  managed: true,
                  head: {  
                    id: head ||  CID.parse(''),  
                    counter,  
                  },  
                };  
              })  
            )  
          : [];  
      
          const addrs: ThreadMuliaddr[] = [];
          if (reply.addrs && reply.addrs.length > 0) {
            for (const addrBytes of reply.addrs) {
              try {
                //addrBytes 移除code为406,长度为-1的数据
                // 处理含有 /thread 协议的多地址
                // thread 协议码为 406
                let processedBytes = this.removeThreadProtocol(addrBytes);
                // 使用处理后的字节创建多地址
                let addr = multiaddr(processedBytes);
                const threadMultiaddr = new ThreadMuliaddr(addr, threadID);
                addrs.push(threadMultiaddr);
              } catch (addrErr) {
                console.warn(`Skipping invalid multiaddr: ${addrErr.message}`);
                // Continue with other addresses
              }
            }
          } 
        const threadInfo = new ThreadInfo(
          threadID,
          logs,
          addrs
        );
        return threadInfo;  
      }  

      removeThreadProtocol(bytes: Uint8Array): Uint8Array {
        
         let i = 0
         while (i < bytes.length) {
           const code = varint.decode(bytes, i)
           if (code == Protocol.code) {// 406,截取前面的数据
            return bytes.slice(0, i)
           }
           const n = varint.encodingLength(code)

           const p = protocols(code)
           const size = this.sizeForAddr(p, bytes.slice(i + n))
       
           if (size === 0) {
             i += n
             continue
           }
           const addr = bytes.slice(i + n, i + n + size)
           i += (size + n)
       
           if (i > bytes.length) { 
             throw new Error('invalid multiaddr')
           }
           if (p.path === true) {
             break
           }
         }
         return bytes
       }
      


       sizeForAddr (p: Protocol, addr: Uint8Array | number[]): number {
        if (p.size > 0) {
          return p.size / 8
        } else if (p.size === 0) {
          return 0
        } else {
          const size = varint.decode(addr instanceof Uint8Array ? addr : Uint8Array.from(addr))
          return size + varint.encodingLength(size)
        }
      }

  async getThreadKeys(sPubkey: Ed25519PubKey, args: { threadKey: ThreadKey, logKey?: PrivateKey | PublicKey }): Promise<dcnet_proto.pb.Keys> {
    try {
        const threadKeyEncrypt = await sPubkey.encrypt(args.threadKey.toBytes());
        let logKeyEncrpt: Uint8Array;
        if (args.logKey) {
          if (args.logKey instanceof Ed25519PrivKey) {
            logKeyEncrpt = await sPubkey.encrypt(Ed25519PubKey.publicKeyToProto(args.logKey.publicKey));
          }else if (args.logKey instanceof Ed25519PubKey) {
            logKeyEncrpt = await sPubkey.encrypt(Ed25519PubKey.publicKeyToProto(args.logKey));
          }else{
            logKeyEncrpt = await sPubkey.encrypt(args.logKey.raw);
          }
        }else{
            logKeyEncrpt = await sPubkey.encrypt(new Uint8Array(0));
        }
        const keys = new  dcnet_proto.pb.Keys({ threadKeyEncrpt: threadKeyEncrypt, logKeyEncrpt:logKeyEncrpt });
        return keys;
    } catch (err) {
        console.error("getThreadKeys error:", err);
        throw err;
    }
 } 

  

  
  
  /**
   * 从特定对等点获取记录
   * 注意: 这是一个假设的实现，需要根据你的实际gRPC客户端实现来调整
   */
   async getRecordsFromPeer(
    req: any,
    serviceKey: SymmetricKey
  ): Promise<Record<string, PeerRecords>> {
    try {
    
      // 编码请求消息
      const messageBytes = net_pb.pb.GetRecordsRequest.encode(req).finish();
      
      // 调用 gRPC 方法
      const responseData = await this.grpcClient.unaryCall(
        "/net.pb.Service/GetRecords",
        messageBytes,
        30000
      );
      
      // 解码响应
      const response = net_pb.pb.GetRecordsReply.decode(responseData);
      
      // 处理响应数据
      const result: Record<string, PeerRecords> = {};
      
      for (const logInfo of response.logs || []) {
        if (!logInfo.logID) continue;
        
        const logId =  PeerIDConverter.fromBytes(logInfo.logID).toString();
        //peerIdFromString(new TextDecoder().decode(logInfo.logID)).toString();
        const records:IRecord[] = [];
        
        for (const rec of logInfo.records || []) {
          records.push(await RecordFromProto(rec as net_pb.pb.Log.Record, serviceKey));
        }
        
        result[logId] = {
          records,
          counter: logInfo.log?.counter as number || 0
        };
      }
      
      return result;
    } catch (err) {
      console.error(`getRecordsFromPeer error:`, err);
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
        const body = new net_pb.pb.PushRecordRequest.Body();
        body.threadID = new TextEncoder().encode(tid.toString());
        body.logID = new TextEncoder().encode(lid.toString());
        body.record = await RecordToProto(this.net, rec);
        const message = new net_pb.pb.PushRecordRequest();
        message.body = body;
        message.counter = counter;
        // 编码请求
        const messageBytes = net_pb.pb.PushRecordRequest.encode(message).finish();
        // 调用gRPC方法
        await this.grpcClient.unaryCall(
          "/net.pb.Service/PushRecord",
          messageBytes,
          30000, // 30秒超时
        );

      } catch (err) {
        throw new Error(`Error pushing record: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    async exchangeEdges(
      req: net_pb.pb.ExchangeEdgesRequest,
    ): Promise<net_pb.pb.ExchangeEdgesReply> {
      try {
      const messageBytes = net_pb.pb.ExchangeEdgesRequest.encode(req).finish();
      // 调用 gRPC 方法
     const response = await this.grpcClient.unaryCall(
        "/net.pb.Service/ExchangeEdges",
        messageBytes,
        30000
      );
      // 解码响应
      const reply = net_pb.pb.ExchangeEdgesReply.decode(response);
      return reply;
      } catch (err) {
        console.error("exchangeEdges error:", err);
        throw err;
     }
    }

    /**
     * 获取threaddb 中的日志
     * @param tid threaddb ID
     * @returns 日志信息数组
     */
    async getLogs(tid: ThreadID, sk:Uint8Array): Promise<net_pb.pb.GetLogsReply> {
      try {
        const body = new net_pb.pb.GetLogsRequest.Body();
        body.threadID = tid.toBytes();
        body.serviceKey = sk; 
        
        const req = new net_pb.pb.GetLogsRequest();
        req.body = body;
        // 编码请求
        const messageBytes = net_pb.pb.GetLogsRequest.encode(req).finish();
        
        // 调用 gRPC 方法
        const response = await this.grpcClient.unaryCall(
          "/net.pb.Service/GetLogs",
          messageBytes,
          30000 // 设置超时时间为30秒
        );
        // 解码响应
        const reply = net_pb.pb.GetLogsReply.decode(response);
        return reply
      } catch (err) {
        console.error(`getLogs error for peer ${this.grpcClient.peerAddr.toString()}:`, err);
        throw err;
      }
    }

    async getThreadFromPeer(tid: ThreadID): Promise<ThreadInfo> {
      try {
        const req = new dcnet.pb.GetThreadRequest;
        req.threadID = tid.toBytes();
        
        // 编码请求
        const messageBytes = dcnet.pb.GetThreadRequest.encode(req).finish();
        
        // 调用 gRPC 方法
        const response = await this.grpcClient.unaryCall(
          "/dcnet.pb.Service/GetThread",
          messageBytes,
          30000 // 设置超时时间为30秒
        );
        // 解码响应
        const reply = dcnet.pb.ThreadInfoReply.decode(response);
        const threadInfo = await this.threadInfoFromProto(reply);
        return threadInfo
      } catch (err) {
        console.error(`getThreadFromPeer error for peer ${this.grpcClient.peerAddr.toString()}:`, err);
        throw err;
      }
    }

}
