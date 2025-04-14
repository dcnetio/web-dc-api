import type { Client } from "../dcapi";
import type { Multiaddr } from "@multiformats/multiaddr";
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { dcnet  as dcnet_proto} from "../proto/dcnet_proto";
import { Key as ThreadKey } from './common/key';
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { NewThreadOptions } from './core/options';
import { ThreadID } from '@textile/threads-id'; 
import { PeerRecords} from "./net/define";
import { DBGrpcClient } from "./net/grpcClient";




export class DBClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }

  async requestThreadID(
    peerAddr?: Multiaddr
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
            this.client.protocol
          );
      const threadInfo = await grpcClient.createThread(tid, opts);
      return tid;
    } catch (err) {
      console.error("createThread error:", err);
      throw err;
    }
  }


/**
 * 从特定对等点获取记录
 * 注意: 这是一个假设的实现，需要根据你的实际gRPC客户端实现来调整
 */
  async getRecordsFromPeer(
    peerAddr: Multiaddr,
    tid: ThreadID,
    peerId: string,
    req: any,
    serviceKey: any
  ): Promise<Record<string, PeerRecords>> {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      const grpcClient = new DBGrpcClient(
        this.client.p2pNode,
        peerAddr,
        this.client.token,
        this.client.protocol
      );
      const recs = await grpcClient.getRecordsFromPeer(tid, peerId, req, serviceKey);
      return recs;
    } catch (err) {
      console.error("getRecordsFromPeer error:", err);
      throw err;
    }
  }

  
}