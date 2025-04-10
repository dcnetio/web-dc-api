import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../proto/dcnet_proto";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { SignHandler } from "../types/types";
import { uint32ToLittleEndianBytes } from "../util/utils";
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";
import { peerIdFromString } from "@libp2p/peer-id";

export class MessageClient {
  client: Client;
  receiverClient: Client;

  constructor(dcClient: Client, receiverClient: Client) {
    this.client = dcClient;
    this.receiverClient = receiverClient;
  }

  private getToUserBoxAuth = async (
    signature: Uint8Array
  ) => {
    const message = new dcnet.pb.GetToUserBoxAuthRequest({});
    message.msgSignature = signature;
    const messageBytes = dcnet.pb.GetToUserBoxAuthRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    const responseData = await grpcClient.unaryCall(
      "/dcnet.pb.Service/GetToUserBoxAuth",
      messageBytes,
      30000
    );
    console.log("GetToUserBoxAuth responseData", responseData);
    const decoded = dcnet.pb.GetToUserBoxAuthReply.decode(responseData);
    console.log("GetToUserBoxAuth decoded", decoded);
    return decoded.signature;
  }

  sendMsgToUserBox = async (
    appName: string,
    blockHeight: number,
    sendPublicKeyValue: Uint8Array,
    receiverPubkeyValue: Uint8Array,
    encryptMsgValue: Uint8Array,
    messageIdValue: Uint8Array,
    signature: Uint8Array
  ) => {
    const peerId = this.receiverClient.peerAddr.getPeerId();
    if(!peerId){
      throw new Error("peerId is undefined");
    }

    // 用户节点auth签名
    const authSignature = await this.getToUserBoxAuth(signature)
    

    // let peerPubkey = await extractPublicKeyFromPeerId(peerIdFromString(peerId))
    // const verify  = peerPubkey.verify(signature, authSignature)

    const userMsg = new dcnet.pb.UserMsg({});
    userMsg.appId = new TextEncoder().encode(appName);
    userMsg.blockheight = blockHeight;
    userMsg.encryptMsg = encryptMsgValue;
    userMsg.messageId = messageIdValue;
    userMsg.receiverPubkey = receiverPubkeyValue;
    userMsg.senderPubkey = sendPublicKeyValue;
    userMsg.signature = signature;

    const message = new dcnet.pb.SendMsgToUserBoxRequest({});
    message.msg = userMsg;
    message.AuthSignature = authSignature;
    message.PeerId = new TextEncoder().encode(peerId.toString());
    const messageBytes =
      dcnet.pb.SendMsgToUserBoxRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.receiverClient.p2pNode,
      this.receiverClient.peerAddr,
      this.receiverClient.token,
      this.receiverClient.protocol
    );
    const responseData = await grpcClient.unaryCall(
      "/dcnet.pb.Service/SendMsgToUserBox",
      messageBytes,
      30000
    );
    console.log("SendMsgToUserBox responseData", responseData);
    const decoded = dcnet.pb.SendMsgToUserBoxReply.decode(responseData);
    console.log("SendMsgToUserBox decoded", decoded);
    return decoded.flag;
  };
}
