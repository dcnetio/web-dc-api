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
    signCallback: (payload: Uint8Array) => Promise<Uint8Array>
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

          message.signature = signature;
          const messageBytes =
            dcnet.pb.GetTokenRequest.encode(message).finish();
          signatureDataSource.setData(messageBytes);
        } else if (decodedPayload.token) {
          //获取到token
          console.log("GetToken success");
          token = decodedPayload.token;
          signatureDataSource.close(); //关闭数据源
        }
      };
      // 使用方法
      const dataSourceCallback = (): AsyncIterable<Uint8Array> => {
        return signatureDataSource.getDataSource();
      };
      const onEndCallback = async () => {
        signatureDataSource.close();
      };
      const onErrorCallback = async (err: unknown) => {
        console.log("onErrorCallback", err);
        error = err instanceof Error ? err : new Error(String(err));
        signatureDataSource.close();
      };
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
      if (error) {
        throw error;
      }
      this.token = token;
      this.grpcClient.setToken(token);
      return token;
    } catch (err) {
      throw err;
    }
  }

  async ValidToken(expires: number=5900): Promise<boolean> {
    try {
      const t = this.token;
      if (!t) {
        return false;
      }
      const parts = t.split(".");
      if (parts.length < 2) {
        return false;
      }
      const payload = parts[1];
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const pad = b64.length % 4;
      const padded = pad ? b64 + "====".slice(0, 4 - pad) : b64;
      const json = Buffer.from(padded, "base64").toString("utf8");
      const obj = JSON.parse(json);
      const iat = Number(obj.iat ?? obj.IssuedAt ?? obj.issuedAt);
      if (!Number.isFinite(iat)) {
        return false;
      }
      if (Math.floor(Date.now() / 1000) - expires > iat) {
        throw new Error("token is expire");
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
