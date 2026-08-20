import type { Libp2p } from "libp2p";
import type { Multiaddr } from "@multiformats/multiaddr";
import { dcnet } from "../proto/dcnet_proto";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { DataSource } from "../proto/datasource";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  // 可以添加自定义字段
  [key: string]: any;
}

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
    signCallback: (payload: Uint8Array) => Promise<Uint8Array>,
    signal?: AbortSignal,
  ): Promise<string> {
    if (signal?.aborted) {
      const reason = signal.reason;
      throw reason instanceof Error ? reason : new Error("Operation aborted");
    }
    let token: string = "";
    let error: Error | null = null;
    const signatureDataSource = new DataSource();
    const message = new dcnet.pb.GetTokenRequest({});
    message.key = appId + "_" + pubkey;
    const messageBytes = dcnet.pb.GetTokenRequest.encode(message).finish();
    const onDataCallback = (payload: Uint8Array) => {
      const decodedPayload = dcnet.pb.GetTokenReply.decode(payload);
      if (decodedPayload.challenge) {
        const challenge = decodedPayload.challenge;
        signCallback(challenge).then((signature) => {
          // Stream may have already closed (e.g. timeout) while signature was computed;
          // discard the result to avoid throwing "DataSource is closed" into the catch.
          if (signatureDataSource.isClosed()) return;
          const message = new dcnet.pb.GetTokenRequest({});
          message.signature = signature;
          const messageBytes =
            dcnet.pb.GetTokenRequest.encode(message).finish();
          signatureDataSource.setData(messageBytes);
        }).catch((err: unknown) => {
          // Preserve the first error (e.g. a timeout set by onErrorCallback),
          // don't overwrite it with a secondary "DataSource is closed" error.
          if (error === null) {
            error = err instanceof Error ? err : new Error(String(err));
          }
          if (!signatureDataSource.isClosed()) {
            signatureDataSource.close();
          }
        });
      } else if (decodedPayload.token) {
        console.log("GetToken success");
        token = decodedPayload.token;
        signatureDataSource.close();
      }
    };
    const dataSourceCallback = (): AsyncIterable<Uint8Array> => {
      return signatureDataSource.getDataSource();
    };
    const onEndCallback = () => {
      signatureDataSource.close();
    };
    const onErrorCallback = (err: unknown) => {
      console.log("onErrorCallback", err);
      error = err instanceof Error ? err : new Error(String(err));
      signatureDataSource.close();
    };
    const closeOnAbort = () => {
      const reason = signal?.reason;
      error = reason instanceof Error ? reason : new Error("Operation aborted");
      signatureDataSource.close();
    };
    signal?.addEventListener("abort", closeOnAbort, { once: true });
    try {
      await this.grpcClient.Call(
        "/dcnet.pb.Service/GetToken",
        messageBytes,
        30000,
        "bidirectional",
        onDataCallback,
        dataSourceCallback,
        onEndCallback,
        onErrorCallback,
        { signal },
      );
    } finally {
      signal?.removeEventListener("abort", closeOnAbort);
    }
    if (error) {
      throw error;
    }
    if (!token) {
      throw new Error("GetToken failed: server did not return a token");
    }
    this.token = token;
    this.grpcClient.setToken(token);
    return token;
  }

  async ValidToken(maxAge: number = 5900): Promise<boolean> {
    // 参数验证
    if (maxAge <= 0) {
      throw new Error("maxAge must be positive");
    }

    try {
      const token = this.token;
      if (!token || typeof token !== "string") {
        return false;
      }

      // 简单格式检查
      if (token.split(".").length !== 3) {
        return false;
      }

      const decoded = jwtDecode<CustomJwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      const TOLERANCE = 60; // 60秒容差

      // 1. 必须有签发时间
      if (decoded.iat === undefined) {
        return false;
      }

      // 2. 签发时间不能在未来
      if (decoded.iat > now + TOLERANCE) {
        return false;
      }

      // 3. 检查是否超过最大有效期
      if (now - maxAge > decoded.iat + TOLERANCE) {
        return false;
      }

      // 4. 检查过期时间
      if (decoded.exp !== undefined) {
        // 过期时间不能早于签发时间
        if (decoded.exp < decoded.iat) {
          return false;
        }

        if (now >= decoded.exp + TOLERANCE) {
          return false;
        }
      }

      // 5. 检查生效时间
      if (decoded.nbf !== undefined) {
        // 生效时间不能晚于过期时间
        if (decoded.exp !== undefined && decoded.nbf >= decoded.exp) {
          return false;
        }

        if (now < decoded.nbf - TOLERANCE) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.warn("Token validation failed:", error);
      return false;
    }
  }
}
