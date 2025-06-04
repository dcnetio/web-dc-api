import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { uint32ToLittleEndianBytes } from "../../util/utils";
import { Errors } from "../../common/error";
import { Ed25519PrivKey, Ed25519PubKey } from "../../common/dc-key/ed25519";
import { KeyManager } from "../../common/dc-key/keyManager";

export class AccountClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }
  async bindAccessPeerToUser(
    context: DCContext,
    blockHeight: number,
    peerId: string
  ): Promise<boolean> {
    if (this.client.p2pNode == null) {
      throw new Error("p2pNode is null");
    }
    const peerIdValue = new TextEncoder().encode(peerId);
    const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
    // 绑定节点
    const headerValue = new TextEncoder().encode("add_request_peer_id_to_user");

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
    const messageBytes =
      dcnet.pb.BindAccessPeerToUserRequest.encode(message).finish();
    const responseData = await grpcClient.unaryCall(
      "/dcnet.pb.Service/BindAccessPeerToUser",
      messageBytes,
      30000
    );
    const decoded = dcnet.pb.BindAccessPeerToUserReply.decode(responseData);
    return true;
  }

  async accountBind(buildedReq: any, mnemonic: string, context: DCContext): Promise<boolean> {
    if (this.client.p2pNode == null) {
      throw new Error("p2pNode is null");
    }
    const message = new dcnet.pb.AccountDealRequest({});
    message.accounthashencrypt = buildedReq.accounthashencrypt;
    message.accountencrypt = buildedReq.accountencrypt;
    message.prikeyencrypt2 = buildedReq.prikeyencrypt2;
    message.blockheight = buildedReq.blockheight;
    message.loginkeyrandencrypt = buildedReq.loginkeyrandencrypt;
    message.peerid = buildedReq.peerid;
    message.signature = buildedReq.signature;
    const messageBytes = dcnet.pb.AccountDealRequest.encode(message).finish();
    if(!this.client.token){
      // try to get token
      let selfPubkey: Ed25519PubKey, 
      selfPrivkey: Ed25519PrivKey;
      if (!context.publicKey || !context.privKey) {
        // 生成
        const keymanager = new KeyManager();
        selfPrivkey = await keymanager.getEd25519KeyFromMnemonic(
          mnemonic,
          ''
        );
        selfPubkey = selfPrivkey.publicKey;
      } else {
        selfPubkey = context.publicKey;
        selfPrivkey = context.privKey;
      }
      const token = await this.client.GetToken(
        context.appInfo.appId || "",
        selfPubkey.string(),
        async (payload: Uint8Array): Promise<Uint8Array> => {
          return selfPrivkey.sign(payload);
        }
      );
      if (!token) {
        throw new Error(Errors.INVALID_TOKEN.message);
      }
    }

    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );

    const responseData = await grpcClient.unaryCall(
      "/dcnet.pb.Service/AccountBind",
      messageBytes,
      30000
    );
    const decoded = dcnet.pb.AccountDealReply.decode(responseData);
    return true;
  }

  async addSubPubkey(req: any): Promise<boolean> {
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
    return true;
  }
/**
 * 设置用户默认数据库
 * @param context DCContext 上下文对象
 * @param threadId 数据库ID
 * @param rk 读取密钥,主要用来加解密真正的数据
 * @param sk 服务密钥,主要用来处理传输过程加解密
 * @param remark 备注信息
 * @returns Promise resolving when operation completes
 */
async setUserDefaultDB(dbinfocrypto: Uint8Array,blockHeight: number,peerId: string,signature: Uint8Array,vaccount?: string): Promise<void> {
  if (this.client.p2pNode == null) {
    throw new Error("p2pNode is null");
  }
  try {
    // Create gRPC client
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
   
    // Create request message
    const message = new dcnet.pb.SetUserDefaultDBRequest();
    message.dbinfocrypt = dbinfocrypto;
    message.blockheight = blockHeight;
    message.peerid = new TextEncoder().encode(peerId);
    message.signature = signature;
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    
    const messageBytes = dcnet.pb.SetUserDefaultDBRequest.encode(message).finish();
    
    try {
      // Make RPC call
       await grpcClient.unaryCall(
        "/dcnet.pb.Service/SetUserDefaultDB",
        messageBytes,
        30000
      );
      return;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("设置用户默认数据库失败:", error);
    throw error;
  }
}

}
