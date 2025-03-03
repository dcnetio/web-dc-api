import type { Libp2p } from "libp2p";
import { ThreadID } from "@textile/threads-id";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { dcnet as dcnet_proto } from "../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Key as ThreadKey } from './key';
import { DataSource } from "../proto/datasource";
import { Ed25519PubKey,Ed25519PrivKey } from "../dc-key/ed25519";
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { NewThreadOptions } from './core/options';
import {ThreadInfo,ThreadLogInfo } from './core/core';
import { peerIdFromString } from "@libp2p/peer-id";
import { CID } from 'multiformats/cid';

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

    async RequestThreadID(): Promise<string> {
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

    async CreateThread(tid: string,opts:NewThreadOptions): Promise<ThreadInfo> {
        try {
     
            if (this.grpcClient.node == null || this.grpcClient.node.peerId == null) {
                throw new Error("p2pNode is null or node privateKey is null");
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
        return {  
          id: threadID,  
          logs,  
          addrs,  
        };  
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

}
