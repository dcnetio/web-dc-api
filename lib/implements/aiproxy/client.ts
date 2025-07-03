import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Errors } from "../../common/error";
import { DCContext } from "../../../lib/interfaces/DCContext";
import {  AIStreamResponseFlag, OnStreamResponseType } from "../../common/types/types";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

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
    configTheme: string,
  ): Promise<[proxyConfigCid: string,aesKey: string, error: Error | null]> {
    const message = new dcnet.pb.GetAIProxyConfigRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(configTheme);
    
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
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string" &&
        (error as any).message.indexOf(Errors.INVALID_TOKEN.message) != -1
      ) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
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
    configTheme: string,
  ): Promise<[authInfo: string, error: Error | null]> {
    const message = new dcnet.pb.GetUserOwnAIProxyAuthRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(configTheme);
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
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string" &&
        (error as any).message.indexOf(Errors.INVALID_TOKEN.message) != -1
      ) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
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
          return ["", new Error(Errors.INVALID_TOKEN.message+" flag:"+decoded.flag)];
        }
        const authInfo = new TextDecoder().decode(decoded.authInfo);
        return [authInfo, null];
      }
      return ["", error instanceof Error ? error : new Error(String(error))];
    }
  }


  async DoAIProxyCall( 
  context: { signal?: AbortSignal },
  appId: string,
  themeAuthor: string,
  configTheme: string,
  serviceName: string,
  path: string,
  headers: string,
  reqBody: string,
  model: string,
  forceRefresh: number,
  blockHeight: number,
  signature: Uint8Array,
  onStreamResponse: OnStreamResponseType | null = null): Promise<number> {
  
  const message = new dcnet.pb.DoAIProxyCallRequest({});
  message.appId = new TextEncoder().encode(appId);
  message.themeAuthor = new TextEncoder().encode(themeAuthor);
  message.theme = new TextEncoder().encode(configTheme);
  message.configKey = new TextEncoder().encode(serviceName);
  message.path = new TextEncoder().encode(path);
  message.headers = new TextEncoder().encode(headers);
  message.reqBody = new TextEncoder().encode(reqBody);
  message.modelConfig = new TextEncoder().encode(model);
  message.forceRefresh = forceRefresh;
  message.blockheight = blockHeight;
  message.signature = signature;
  
  const messageBytes = dcnet.pb.DoAIProxyCallRequest.encode(message).finish();
  const grpcClient = new Libp2pGrpcClient(
    this.client.p2pNode,
    this.client.peerAddr,
    this.client.token,
    this.client.protocol
  );

  // 添加超时检测相关变量
  let lastDataTime = Date.now();
  let hasStartedReceiving = false;
  let timeoutTimer: NodeJS.Timeout | null = null;
  let isCompleted = false;
  let isAborted = false;

  // 清理定时器的函数
  const clearTimeoutTimer = () => {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  };

  // 设置超时检测定时器
  const setTimeoutTimer = () => {
    clearTimeoutTimer();
    timeoutTimer = setTimeout(() => {
      if (!isCompleted && !isAborted && hasStartedReceiving) {
        console.warn('DoAIProxyCall 数据流超时，超过30秒未收到数据');
        isAborted = true;
        
        // 通知调用者超时
        if (onStreamResponse) {
          onStreamResponse(AIStreamResponseFlag.STREAM_HANG, "", "数据流超时：超过30秒未收到响应数据");
        }
      }
    }, 30000); // 30秒超时
  };

  const onDataCallback = async (payload: Uint8Array) => {
    if (isAborted || isCompleted) return;
    
    // 更新最后接收数据的时间
    lastDataTime = Date.now();
    hasStartedReceiving = true;
    
    // 重置超时定时器
    setTimeoutTimer();
    
    try {
      const decodedPayload = dcnet.pb.DoAIProxyCallReply.decode(payload);
      if (onStreamResponse) {
        onStreamResponse(
          decodedPayload.flag,
          new TextDecoder().decode(decodedPayload.content),
          new TextDecoder().decode(decodedPayload.err)
        );
      }
    } catch (error) {
      console.error('DoAIProxyCall 解析数据失败:', error);
      if (onStreamResponse) {
        onStreamResponse(AIStreamResponseFlag.OTHER_ERROR, "", error instanceof Error ? error.message : String(error));
      }
    }
  };

  const onEndCallback = async () => {
    if (isAborted) return;
    
    isCompleted = true;
    clearTimeoutTimer();
    
    if (onStreamResponse) {
      onStreamResponse(3, "", "");
    }
  };

  const onErrorCallback = async (error: unknown) => {
    if (isAborted) return;
    
    isCompleted = true;
    clearTimeoutTimer();
    
    if (onStreamResponse) {
      onStreamResponse(AIStreamResponseFlag.OTHER_ERROR, "", error instanceof Error ? error.message : String(error));
    }
  };

  // 监听外部中止信号
  if (context.signal) {
    context.signal.addEventListener('abort', () => {
      isAborted = true;
      clearTimeoutTimer();
      console.log('DoAIProxyCall 被外部中止');
    });
  }

  try {
    // 开始调用前设置初始超时定时器（用于检测是否开始接收数据）
    setTimeoutTimer();
    
    await grpcClient.Call(
      "/dcnet.pb.Service/DoAIProxyCall",
      messageBytes,
      10000000,
      "server-streaming",
      onDataCallback,
      undefined, // dataSourceCallback not needed for server-streaming
      onEndCallback,
      onErrorCallback,
      context
    );
    
    return 0;
  } catch (error) {
    isCompleted = true;
    clearTimeoutTimer();
    console.error("DoAIProxyCall error:", error);
    // 如果是超时导致的错误，返回特定的错误码
    if (isAborted) {
      return 7; // 返回超时错误码
    }
    
    throw error;
  } finally {
    // 确保定时器被清理
    clearTimeoutTimer();
  }
}
}
