import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
import { DCGrpcClient } from "../grpc-dc";




export class ThemeClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }
  
    async getCacheValue(peerAddr: Multiaddr, key: string): Promise<string> {
      try {
        if (this.client.p2pNode == null) {
          throw new Error("p2pNode is null");
        }
        if (!peerAddr) {
          peerAddr = this.client.peerAddr;
        }
        const grpcClient = new DCGrpcClient(
          this.client.p2pNode,
          peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.GetCacheValue(key);
        return reply;
      } catch (err) {
        console.error("GetCacheValue error:", err);
        throw err;
      }
    }


  async setCacheKey(
    value: string,
    blockheight: number,
    expire: number,
    signature: Uint8Array,
    peerAddr?: Multiaddr
  ): Promise<string> {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      if (!peerAddr) {
        peerAddr = this.client.peerAddr;
      }
      const grpcClient = new DCGrpcClient(
        this.client.p2pNode,
        peerAddr,
        this.client.token,
        this.client.protocol
      );
      const res = await grpcClient.SetCacheKey(
        value,
        blockheight,
        expire,
        signature
      );
      return res;
    } catch (err) {
      console.error("SetCacheKey error:", err);
      throw err;
    }
  }


}