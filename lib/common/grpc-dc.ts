import type { Libp2p } from "libp2p";
import type { Multiaddr } from "@multiformats/multiaddr";
import { dcnet } from "../proto/dcnet_proto";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { DataSource } from "../proto/datasource";
import { Ed25519PubKey } from "./dc-key/ed25519";

export class DCGrpcClient {
  grpcClient: Libp2pGrpcClient;
  token: string;

  constructor(
    node: Libp2p,
    peerAddr: Multiaddr,
    token: string,
    protocol?: string
  ) {
    this.grpcClient = new Libp2pGrpcClient(node, peerAddr, token, protocol);
    this.token = token;
  }

  async GetToken(
    appId: string,
    pubkey: string,
    signCallback: (payload: Uint8Array) => Promise<Uint8Array> ,
  ): Promise<string> {
    let token: string = "";
    try {
      let error: Error | null = null;
      const signatureDataSource = new DataSource();
      const message = new dcnet.pb.GetTokenRequest({});
      message.key = appId + "_" + pubkey;
      const messageBytes = dcnet.pb.GetTokenRequest.encode(message).finish();
      const onDataCallback = async (payload: Uint8Array) => {
        const decodedPayload = dcnet.pb.GetTokenReply.decode(payload);
        if (decodedPayload.challenge) {
          const challenge = decodedPayload.challenge;
          const signature = await signCallback(challenge);
          const message = new dcnet.pb.GetTokenRequest({});
          message.signature = challenge;
          // 签名验证
          const publicKey = Ed25519PubKey.edPubkeyFromStr(pubkey);
          const flag = publicKey.verify(challenge, signature);
          console.log("verify:", flag);
          const messageBytes =
            dcnet.pb.GetTokenRequest.encode(message).finish();
          signatureDataSource.setData(messageBytes);
        } else if (decodedPayload.token) {
          //获取到token
          console.log("GetToken success:", decodedPayload.token);
          token = decodedPayload.token;
          signatureDataSource.close(); //关闭数据源
        }
        console.log("onDataCallback:", payload);
      };
      // 使用方法
      const dataSourceCallback = (): AsyncIterable<Uint8Array> => {
        console.log("dataSourceCallback");
        return signatureDataSource.getDataSource();
      };
      const onEndCallback = async () => {
        console.log("onEndCallback");
        signatureDataSource.close();
      }
      const onErrorCallback = async (err: unknown) => {
        console.log("onErrorCallback", err);
        error = err instanceof Error ? err : new Error(String(err));
        signatureDataSource.close();
      }
      await this.grpcClient.Call(
        "/dcnet.pb.Service/GetToken",
        messageBytes,
        30000,
        "bidirectional",
        onDataCallback,
        dataSourceCallback,
        onEndCallback,
        onErrorCallback
      );
      if(error){
        throw error;
      }
      this.token = token;
      this.grpcClient.setToken(token);
      return token;
    } catch (err) {
      console.error("GetToken error:", err);
      throw err;
    }
  }

  async ValidToken(): Promise<boolean> {
    try {
      const message = new dcnet.pb.ValidTokenRequest({});
      const messageBytes =
        dcnet.pb.ValidTokenRequest.encode(message).finish();
      const responseData = await this.grpcClient.unaryCall(
        "/dcnet.pb.Service/ValidToken",
        messageBytes,
        30000
      );
      dcnet.pb.ValidTokenReply.decode(responseData);
      return true;
    } catch (err) {
      console.error("ValidToken error:", err);
      throw err;
    }
  }


}
