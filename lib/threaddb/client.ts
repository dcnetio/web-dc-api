import type { DCClient } from "../dcapi";
import { DBGrpcClient } from "./grpcClient";
import type { Multiaddr } from "@multiformats/multiaddr";
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { dcnet  as dcnet_proto} from "../proto/dcnet_proto";
import { Key as ThreadKey } from './key';
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 




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

  async createThread() {
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
       const keys = await this.getThreadKeys(sPubkey, { threadKey: sk, logKey: logKey });

      const tid = await this.requestThreadID();
      return tid;
    } catch (err) {
      console.error("createThread error:", err);
      throw err;
    }
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