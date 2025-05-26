import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { uint32ToLittleEndianBytes } from "../../util/utils";

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



  async accountBind(context: DCContext, buildedReq:any) {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const message = new dcnet.pb.AccountDealRequest({});
      message.accounthashencrypt = buildedReq.accounthashencrypt;
      message.accountencrypt = buildedReq.accountencrypt;
      message.prikeyencrypt2 = buildedReq.prikeyencrypt2;
      message.blockheight = buildedReq.blockheight;
      message.loginkeyrandencrypt = buildedReq.loginkeyrandencrypt;
      message.peerid = buildedReq.peerid;
      message.signature = buildedReq.signature;
      const messageBytes = dcnet.pb.AccountDealRequest.encode(message).finish();
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AccountBind",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AccountDealReply.decode(responseData);
      return decoded.toJSON();
  }




  async addSubPubkey(req :any) {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );

      const message = new dcnet.pb.AddSubPubkeyRequest({});
      message.subpubkey = req.subpubkey;
      message.blockheight = req.blockheight;
      message.peerid = req.peerid;
      message.signature = req.signature;
      const messageBytes = dcnet.pb.AddSubPubkeyRequest.encode(message).finish();
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AddSubPubkey",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AddSubPubkeyReply.decode(responseData);
      return decoded.toJSON();
  }

  

}
