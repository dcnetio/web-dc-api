import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../proto/dcnet_proto";

export class AccountClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }
  async bindAccessPeerToUser( blockheight: number, signature: Uint8Array) {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );

      const message = new dcnet.pb.BindAccessPeerToUserRequest({});
      message.blockheight = blockheight;
      message.signature = signature;
      const messageBytes = dcnet.pb.BindAccessPeerToUserRequest.encode(message).finish();
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/BindAccessPeerToUser",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.BindAccessPeerToUserReply.decode(responseData);
      return decoded.toJSON();
  }
}
