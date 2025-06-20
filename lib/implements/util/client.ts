import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { uint32ToLittleEndianBytes } from "../../util/utils";
import { Errors } from "../../common/error";
import { Ed25519PrivKey, Ed25519PubKey } from "../../common/dc-key/ed25519";
import { KeyManager } from "../../common/dc-key/keyManager";

export class UtilClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }

/**
 * 设置应用信息
 * @param context DCContext 上下文对象
 * @param threadId 数据库ID
 * @param rk 读取密钥,主要用来加解密真正的数据
 * @param sk 服务密钥,主要用来处理传输过程加解密
 * @param remark 备注信息
 * @returns Promise resolving when operation completes
 */
async setAppInfo(appId: Uint8Array,owner: Uint8Array,rewarder: Uint8Array,domain: Uint8Array,blockHeight: number,peerId: string,fid:string,signature: Uint8Array): Promise<void> { 
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
    const message = new dcnet.pb.SetAppInfoRequest();
    message.appId = appId;
    message.ownerAccount = owner;
    message.rewardAccount = rewarder;
    message.domain = domain;
    message.blockheight = blockHeight;
    message.peerid = new TextEncoder().encode(peerId);
    message.fid = new TextEncoder().encode(fid);
    message.signature = signature;
    
    
    const messageBytes = dcnet.pb.SetAppInfoRequest.encode(message).finish();
    
    try {
      // Make RPC call
       await grpcClient.unaryCall(
        "/dcnet.pb.Service/SetAppInfo",
        messageBytes,
        30000
      );
      return;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("设置APP信息失败:", error);
    throw error;
  }
}
}


