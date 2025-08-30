import type { Multiaddr } from "@multiformats/multiaddr";
import { Client } from "../../common/dcapi";
import { dcnet } from "../../proto/dcnet_proto";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { DcUtil } from "lib/common/dcutil";
import { DCContext } from "lib/interfaces";




export class CacheClient {
  client: Client;
  context: DCContext;
  dc: DcUtil;


  constructor(context: DCContext,dc: DcUtil,dcClient: Client) {
    this.client = dcClient;
    this.context = context;
    this.dc = dc;
  }

  async getCacheValue(peerAddr: Multiaddr, key: string): Promise<string> {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      if (!peerAddr) {
        peerAddr = this.client.peerAddr;
      }else if (!peerAddr.equals(this.client.peerAddr)) {
        await this.dc.connectToPeer(peerAddr.toString());
        this.client =  new Client(this.client.p2pNode,this.client.blockstore, peerAddr, this.client.protocol);
        await this.client.GetToken(this.context.appInfo.appId, this.context.publicKey!.string(), this.context.sign, peerAddr);
      }
      const message = new dcnet.pb.GetCacheValueRequest({});
      message.key = new TextEncoder().encode(key);
      const messageBytes =
        dcnet.pb.GetCacheValueRequest.encode(message).finish();
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        peerAddr || this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetCacheValue",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetCacheValueReply.decode(responseData);
      const encodedValue = uint8ArrayToString(decoded.value);
      return encodedValue;
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
      const message = new dcnet.pb.SetCacheKeyRequest({});
      message.value = new TextEncoder().encode(value);
      message.blockheight = blockheight;
      message.expire = expire;
      message.signature = signature;
      const messageBytes = dcnet.pb.SetCacheKeyRequest.encode(message).finish();
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        peerAddr || this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/SetCacheKey",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.SetCacheKeyReply.decode(reply);
      if (decoded.cacheKey) {
        const result = uint8ArrayToString(decoded.cacheKey);
        return result;
      }
      throw new Error("SetCacheKey failed,flag: " + decoded.flag);
    } catch (err) {
      console.error("SetCacheKey error:", err);
      throw err;
    }
  }


}