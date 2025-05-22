import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Errors } from "../../common/error";
import { DCContext } from "../../interfaces";

export class AIProxyClient {
  client: Client;
  context: DCContext;

  constructor(dcClient: Client, context: DCContext) {
    this.client = dcClient;
    this.context = context;
  }

  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configThem: string,
  ): Promise<[proxyConfigCid: string,aesKey: string, error: Error | null]> {
    const message = new dcnet.pb.GetAIProxyConfigRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(configThem);
    
    const messageBytes = dcnet.pb.GetAIProxyConfigRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetAIProxyConfig",
        messageBytes,
        30000
      );
      console.log("GetAIProxyConfig reply", reply);
      const decoded = dcnet.pb.GetAIProxyConfigReply.decode(reply);
    if (decoded.flag != 0) {
        throw new Error(Errors.INVALID_TOKEN.message+" flag:"+decoded.flag);
    }
    const proxyConfigCid = new TextDecoder().decode(decoded.proxyConfigCid);
    const aesKey = new TextDecoder().decode(decoded.aeskey);
    return [proxyConfigCid,aesKey, null];
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetAIProxyConfig",
          messageBytes,
          30000
        );
        console.log("GetAIProxyConfig reply", reply);
        const decoded = dcnet.pb.GetAIProxyConfigReply.decode(reply);
        console.log("GetAIProxyConfig decoded", decoded);
        if (decoded.flag != 0) {
          throw new Error(Errors.INVALID_TOKEN.message+" flag:"+decoded.flag);
        }
        const proxyConfigCid = new TextDecoder().decode(decoded.proxyConfigCid);
        const aesKey = new TextDecoder().decode(decoded.aeskey);
        return [proxyConfigCid,aesKey, null];
      }
      console.error("GetAIProxyConfig error:", error);
      throw error;
    }
  }



  async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configThem: string,
  ): Promise<[authInfo: string, error: Error | null]> {
    const message = new dcnet.pb.GetUserOwnAIProxyAuthRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(configThem);
    const messageBytes = dcnet.pb.GetUserOwnAIProxyAuthRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetUserOwnAIProxyAuth",
        messageBytes,
        30000
      );
      console.log("GetUserOwnAIProxyAuth reply", reply);
      const decoded = dcnet.pb.GetUserOwnAIProxyAuthReply.decode(reply);
    if (decoded.flag != 0) {
        throw new Error(Errors.INVALID_TOKEN.message+" flag:"+decoded.flag);
    }
    const authInfo = new TextDecoder().decode(decoded.authInfo);
    return [authInfo, null];
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetUserOwnAIProxyAuth",
          messageBytes,
          30000
        );
        console.log("GetUserOwnAIProxyAuth reply", reply);
        const decoded = dcnet.pb.GetUserOwnAIProxyAuthReply.decode(reply);
        console.log("GetUserOwnAIProxyAuth decoded", decoded);
        if (decoded.flag != 0) {
          throw new Error(Errors.INVALID_TOKEN.message+" flag:"+decoded.flag);
        }
        const authInfo = new TextDecoder().decode(decoded.authInfo);
        return [authInfo, null];
      }
      console.error("GetUserOwnAIProxyAuth error:", error);
      throw error;
    }
  }


}
