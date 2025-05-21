import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export class DCClient {
  client: Client;

  constructor(dcClient: Client, peerAddr?: Multiaddr) {
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
      const message = new dcnet.pb.GetHostIDRequest({});
      const messageBytes = dcnet.pb.GetHostIDRequest.encode(message).finish();
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        peerAddr || this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetHostID",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetHostIDReply.decode(responseData);
      const encodedPeerid = base58btc.encode(decoded.peerID);
      const encodedReqAddr = uint8ArrayToString(decoded.reqAddr);
      const reply = {
        peerID: encodedPeerid,
        reqAddr: encodedReqAddr,
      };
      return reply;
    } catch (err) {
      console.error("getHostID error:", err);
      throw err;
    }
  }
}
