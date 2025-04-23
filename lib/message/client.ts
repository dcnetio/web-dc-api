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
import { Errors } from "../error";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export class MessageClient {
  client: Client;
  receiverClient: Client | undefined;
  signHandler: SignHandler;

  constructor(
    dcClient: Client,
    signHandler: SignHandler,
    receiverClient?: Client
  ) {
    this.client = dcClient;
    this.signHandler = signHandler;
    this.receiverClient = receiverClient;
  }

  sendMsgToUserBox = async (userMsg: dcnet.pb.UserMsg) => {
    const peerId = this.client.peerAddr.getPeerId();
    if (!peerId) {
      throw new Error("peerId is undefined");
    }
    if (!this.receiverClient) {
      throw new Error("receiverClient is undefined");
    }

    // 用户节点auth签名
    const authSignature = await this.getToUserBoxAuth(userMsg.signature);

    // let peerPubkey = await extractPublicKeyFromPeerId(peerIdFromString(peerId))
    // const verify  = peerPubkey.verify(signature, authSignature)

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
    try {
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/SendMsgToUserBox",
        messageBytes,
        30000
      );
      console.log("SendMsgToUserBox responseData", responseData);
      const decoded = dcnet.pb.SendMsgToUserBoxReply.decode(responseData);
      console.log("SendMsgToUserBox decoded", decoded);
      return decoded.flag;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.receiverClient.GetToken(
          this.signHandler.publickey().string(),
          (payload: Uint8Array): Uint8Array => {
            return this.signHandler.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const responseData = await grpcClient.unaryCall(
          "/dcnet.pb.Service/SendMsgToUserBox",
          messageBytes,
          30000
        );
        console.log("SendMsgToUserBox responseData", responseData);
        const decoded = dcnet.pb.SendMsgToUserBoxReply.decode(responseData);
        console.log("SendMsgToUserBox decoded", decoded);
        return decoded.flag;
      }
      console.error("SendMsgToUserBox error:", error);
      throw error;
    }
  };

  private getToUserBoxAuth = async (signature: Uint8Array) => {
    const message = new dcnet.pb.GetToUserBoxAuthRequest({});
    message.msgSignature = signature;
    const messageBytes =
      dcnet.pb.GetToUserBoxAuthRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetToUserBoxAuth",
        messageBytes,
        30000
      );
      console.log("GetToUserBoxAuth responseData", responseData);
      const decoded = dcnet.pb.GetToUserBoxAuthReply.decode(responseData);
      console.log("GetToUserBoxAuth decoded", decoded);
      return decoded.signature;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.signHandler.publickey().string(),
          (payload: Uint8Array): Uint8Array => {
            return this.signHandler.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
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
      console.error("GetToUserBoxAuth error:", error);
      throw error;
    }
  };

  async getMaxKeyFromUserBox(appId: string): Promise<string> {
    const message = new dcnet.pb.GetMaxKeyFromUserBoxRequest();
    message.appId = new TextEncoder().encode(appId);
    const messageBytes =
      dcnet.pb.GetMaxKeyFromUserBoxRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetMaxKeyFromUserBox",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetMaxKeyFromUserBoxReply.decode(responseData);
      return decoded.maxkey ? uint8ArrayToString(decoded.maxkey) : '';
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.signHandler.publickey().string(),
          (payload: Uint8Array): Uint8Array => {
            return this.signHandler.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const responseData = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetMaxKeyFromUserBox",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.GetMaxKeyFromUserBoxReply.decode(responseData);
        return decoded.maxkey ? uint8ArrayToString(decoded.maxkey) : '';
      }
      if(error.message.indexOf('datastore: key not found') != -1){
        return '';
      }
      console.error("GetMaxKeyFromUserBox error:", error);
      throw error;
    }
  }

  async getMsgFromUserBox(
    appId: string,
    seekKey: string,
    limit: number
  ): Promise<{ [k: string]: any; }> {
    const message = new dcnet.pb.GetMsgFromUserBoxRequest();
    message.appId = new TextEncoder().encode(appId);
    message.blockheight = 0;
    message.seekKey = new TextEncoder().encode(seekKey);
    message.limit = limit;
    const messageBytes =
      dcnet.pb.GetMsgFromUserBoxRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetMsgFromUserBox",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetMsgFromUserBoxReply.decode(responseData);
      return decoded.toJSON();
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.signHandler.publickey().string(),
          (payload: Uint8Array): Uint8Array => {
            return this.signHandler.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const responseData = await grpcClient.unaryCall(
          "/dcnet.pb.Service/getMsgFromUserBox",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.GetMsgFromUserBoxReply.decode(responseData);
        return decoded.toJSON();
      }
      console.error("getMsgFromUserBox error:", error);
      throw error;
    }
  }
}
