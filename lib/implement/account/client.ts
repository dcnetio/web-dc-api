import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "lib/interfaces";
import { uint32ToLittleEndianBytes } from "lib/util/utils";

export class AccountClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }
  async bindAccessPeerToUser(context: DCContext, blockHeight: number,peerId:string) {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
       const peerIdValue = new TextEncoder().encode(peerId);
       const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
       // 绑定节点
      const headerValue = new TextEncoder().encode(
        "add_request_peer_id_to_user"
      );
  
      const messageParts = new Uint8Array([
        ...headerValue,
        ...bhValue,
        ...peerIdValue,
      ]);
       const signature = await context.sign(messageParts);
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );

      const message = new dcnet.pb.BindAccessPeerToUserRequest({});
      message.blockheight = blockHeight;
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
