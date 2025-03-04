import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
import { DCGrpcClient } from "../grpc-dc";

export class DCClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }

  async getHostID(
    peerAddr?: Multiaddr
  ): Promise<{ peerID: string; reqAddr: string }> {
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
      const reply = await grpcClient.getHostID();
      return reply;
    } catch (err) {
      console.error("getHostID error:", err);
      throw err;
    }
  }
}
