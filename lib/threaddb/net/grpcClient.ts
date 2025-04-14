import type { Libp2p } from "libp2p";
import { ThreadID } from "@textile/threads-id";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { dcnet as dcnet_proto } from "../../proto/dcnet_proto";
import {net as net_pb} from "../pb/net_pb";
import { base58btc } from "multiformats/bases/base58";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Key as ThreadKey } from '../common/key';
import { DataSource } from "../../proto/datasource";
import { Ed25519PubKey,Ed25519PrivKey } from "../../dc-key/ed25519";
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { extractPublicKeyFromPeerId } from "../../dc-key/keyManager";
import { NewThreadOptions } from '../core/options';
import {ThreadInfo,IThreadInfo } from '../core/core';
import { peerIdFromString } from "@libp2p/peer-id";
import { CID } from 'multiformats/cid';
import { PeerRecords} from "./define";
import {RecordFromProto} from "../cbor/record";
import { IRecord } from "../core/record";

export class DBGrpcClient {
    grpcClient: Libp2pGrpcClient;
    stream: any;
    token: string;

    constructor(
        node: Libp2p,
        peerAddr: Multiaddr,
        token: string,
        protocol?: string
    ) {
        this.grpcClient = new Libp2pGrpcClient(node, peerAddr, token, protocol);
        this.token = token;
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
            const serverPeerId = this.grpcClient.node.peerId;
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
      
        const threadID = ThreadID.fromBytes(reply.threadID);  
      
        const logs = reply.logs  
          ? await Promise.all(  
              reply.logs.map(async lg => {  
                if (!lg.ID || !lg.pubKey) {  
                  throw new Error('Missing required fields in LogInfo: id or pubKey');  
                }  
                const [id, pubKey, privKey] = await Promise.all([  
                    peerIdFromString(lg.ID ? uint8ArrayToString(lg.ID) : "") ,
                    Ed25519PubKey.publicKeyFromProto(lg.pubKey || new Uint8Array()),
                  lg.privKey ? Ed25519PrivKey.privateKeyFromProto(lg.privKey) : Promise.resolve(undefined),  
                ]);  
      
                const addrs = lg.addrs?.map(addr => multiaddr(addr)) || [];  
      
                const head = lg.head ? CID.decode(lg.head) :null;  
      
                const counter = lg.counter  
                  ? Number(Buffer.from(lg.counter).readBigInt64BE())  
                  : -1;  
      
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
      
        const addrs = reply.addrs?.map(addr => multiaddr(addr)) || [];  
        const threadInfo = new ThreadInfo(
          threadID,
          logs,
          addrs
        );
        return threadInfo;  
      }  


  async getThreadKeys(sPubkey: Ed25519PubKey, args: { threadKey: ThreadKey, logKey?: PrivateKey | PublicKey }): Promise<dcnet_proto.pb.Keys> {
    try {
        const threadKeyEncrypt = await sPubkey.encrypt(args.threadKey.toBytes());
        let logKeyEncrpt: Uint8Array;
        if (args.logKey) {
            logKeyEncrpt = await sPubkey.encrypt(args.logKey.raw);
        }else{
            logKeyEncrpt = new Uint8Array(0);
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
    tid: ThreadID,
    peerId: string,
    req: any,
    serviceKey: any
  ): Promise<Record<string, PeerRecords>> {
    try {
      // 编码请求消息
      const messageBytes = net_pb.pb.GetRecordsRequest.encode(req).finish();
      
      // 调用 gRPC 方法
      const responseData = await this.grpcClient.unaryCall(
        "/dcnet.pb.Service/GetRecords",
        messageBytes,
        30000
      );
      
      // 解码响应
      const response = net_pb.pb.GetRecordsReply.decode(responseData);
      
      // 处理响应数据
      const result: Record<string, PeerRecords> = {};
      
      for (const logInfo of response.logs || []) {
        if (!logInfo.logID) continue;
        
        const logId = uint8ArrayToString(logInfo.logID);
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
      console.error(`getRecordsFromPeer error for peer ${peerId}:`, err);
      throw err;
    }
  }

}
