import type { DCClient } from "../dcapi";
import { DBGrpcClient } from "./grpcClient";
import type { Multiaddr } from "@multiformats/multiaddr";
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { dcnet  as dcnet_proto} from "../proto/dcnet_proto";
import { Key as ThreadKey } from './key';
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { NewThreadOptions } from './core/options';




export class DBClient {
  client: DCClient;

  constructor(dcClient: DCClient) {
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
      const tid = await grpcClient.RequestThreadID();
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
      const threadInfo = await grpcClient.CreateThread(tid, opts);
      return tid;
    } catch (err) {
      console.error("createThread error:", err);
      throw err;
    }
  }

  
}