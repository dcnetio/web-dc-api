import type { Libp2p } from "libp2p";
import type { Multiaddr } from "@multiformats/multiaddr";

import { DCGrpcClient } from "./grpc-dc";
import { createAbortController } from "./abort";

import { keys } from "@libp2p/crypto";
import { sha256, getRandomBytes, concatenateUint8Arrays } from "../util/utils";
import { Blocks } from "helia";

function getAbortError(signal?: AbortSignal): Error {
  const reason = signal?.reason;
  return reason instanceof Error ? reason : new Error("Operation aborted");
}

function awaitWithAbort<T>(operation: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return operation;
  if (signal.aborted) return Promise.reject(getAbortError(signal));

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(getAbortError(signal));
    signal.addEventListener("abort", onAbort, { once: true });
    operation.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

interface SharedTokenRequest {
  promise: Promise<string>;
  controller: AbortController;
  subscribers: number;
  settled: boolean;
}



export class Client {
  private static readonly TOKEN_CACHE_TTL_MS = 50 * 60 * 1000;
  private static sharedTokens = new Map<
    string,
    { token: string; expiresAt: number }
  >();
  private static sharedTokenRequests = new Map<string, SharedTokenRequest>();
  readonly protocol: string;
  p2pNode: Libp2p;
  blockstore: Blocks;
  peerAddr: Multiaddr;
  token: string;
  private tokenRequest: SharedTokenRequest | null = null;
  private tokenRequestIdentity: string | null = null;
  private tokenCacheKey: string | null = null;
  private tokenGeneration = 0;
  private tokenIdentity: string | null = null;

  constructor(node: Libp2p,blockstore: Blocks, peerAddr: Multiaddr, protocol: string) {
    this.protocol = protocol;
    this.p2pNode = node;
    this.peerAddr = peerAddr;
    this.token = "";
    this.blockstore = blockstore
  }

  async GetToken(
    appId: string,
    pubkey: string,
    signCallback: (payload: Uint8Array) =>  Promise<Uint8Array> ,
    peerAddr?: Multiaddr,
    signal?: AbortSignal,
  ): Promise<string> {
    if (signal?.aborted) {
      throw getAbortError(signal);
    }
    if (!pubkey || pubkey.length == 0) {
      throw new Error("pubkey is empty");
    }
    const targetPeer = peerAddr || this.peerAddr;
    const tokenIdentity = this.getTokenIdentity(targetPeer, appId, pubkey);
    if (
      (this.token && this.tokenIdentity !== tokenIdentity) ||
      (this.tokenRequest && this.tokenRequestIdentity !== tokenIdentity)
    ) {
      await this.ClearToken();
    }
    if (this.token && this.tokenIdentity === tokenIdentity) {
      return this.token;
    }
    if (this.tokenRequest) {
      // 上一次调用可能已经是唯一订阅者并取消，控制器已在异步清理中。不要让
      // 新调用加入一个必然返回空 token 的已取消请求，直接重新发起即可。
      if (!this.tokenRequest.controller.signal.aborted) {
        return this.waitForSharedTokenRequest(this.tokenRequest, signal);
      }
      this.tokenRequest = null;
      this.tokenRequestIdentity = null;
    }

    const cacheKey = tokenIdentity;
    const tokenGeneration = this.tokenGeneration;
    this.tokenCacheKey = cacheKey;
    const cached = Client.sharedTokens.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      this.token = cached.token;
      this.tokenIdentity = tokenIdentity;
      return cached.token;
    }
    if (cached) {
      Client.sharedTokens.delete(cacheKey);
    }

    const inFlightRequest = Client.sharedTokenRequests.get(cacheKey);
    if (inFlightRequest && !inFlightRequest.controller.signal.aborted) {
      this.tokenRequest = inFlightRequest;
      this.tokenRequestIdentity = tokenIdentity;
      try {
        const token = await this.waitForSharedTokenRequest(
          inFlightRequest,
          signal,
        );
        if (tokenGeneration === this.tokenGeneration) {
          this.token = token;
          this.tokenIdentity = tokenIdentity;
        }
        return token;
      } finally {
        if (this.tokenRequest === inFlightRequest) {
          this.tokenRequest = null;
          this.tokenRequestIdentity = null;
        }
      }
    }
    if (inFlightRequest?.controller.signal.aborted) {
      Client.sharedTokenRequests.delete(cacheKey);
    }

    const requestController = createAbortController();
    const sharedRequest: SharedTokenRequest = {
      promise: Promise.resolve(""),
      controller: requestController,
      subscribers: 0,
      settled: false,
    };
    const request = (async () => {
      if (this.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      if (!peerAddr) {
        peerAddr = this.peerAddr;
      }
      const grpcClient = new DCGrpcClient(
        this.p2pNode,
        peerAddr,
        this.token,
        this.protocol
      );
      const token = await grpcClient.GetToken(
        appId,
        pubkey,
        signCallback,
        requestController.signal,
      );
      if (tokenGeneration === this.tokenGeneration) {
        this.token = token;
        this.tokenIdentity = tokenIdentity;
      }
      if (
        token &&
        Client.sharedTokenRequests.get(cacheKey) === sharedRequest
      ) {
        Client.sharedTokens.set(cacheKey, {
          token,
          expiresAt: Date.now() + Client.TOKEN_CACHE_TTL_MS,
        });
      }
      return token;
    })().catch(() => {
      return "";
    });
    sharedRequest.promise = request;
    this.tokenRequest = sharedRequest;
    this.tokenRequestIdentity = tokenIdentity;
    Client.sharedTokenRequests.set(cacheKey, sharedRequest);
    void request.finally(() => {
      sharedRequest.settled = true;
      if (Client.sharedTokenRequests.get(cacheKey) === sharedRequest) {
        Client.sharedTokenRequests.delete(cacheKey);
      }
    });

    try {
      return await this.waitForSharedTokenRequest(sharedRequest, signal);
    } finally {
      if (this.tokenRequest === sharedRequest) {
        this.tokenRequest = null;
        this.tokenRequestIdentity = null;
      }
    }
  }

  /**
   * 共享 token 请求必须与某个调用方的 AbortSignal 解耦。否则第一个市场扫描
   * 超时会直接取消整个共享请求，误伤随后加入的前台调用；反过来，若所有订阅者
   * 都已离开，则应立即终止底层双向流，不能把它留到 30 秒 RPC 超时。
   */
  private async waitForSharedTokenRequest(
    request: SharedTokenRequest,
    signal?: AbortSignal,
  ): Promise<string> {
    request.subscribers += 1;
    try {
      return await awaitWithAbort(request.promise, signal);
    } finally {
      request.subscribers = Math.max(0, request.subscribers - 1);
      if (!request.settled && request.subscribers === 0) {
        request.controller.abort(new Error("Token request has no subscribers"));
      }
    }
  }

  private getTokenIdentity(
    peerAddr: Multiaddr,
    appId: string,
    pubkey: string,
  ): string {
    return `${this.protocol}:${peerAddr.toString()}:${appId}:${pubkey}`;
  }

  setToken(
    token: string,
    appId: string,
    pubkey: string,
    peerAddr?: Multiaddr,
  ): void {
    this.tokenGeneration++;
    this.tokenRequest = null;
    this.tokenRequestIdentity = null;
    this.token = token;
    this.tokenIdentity = token
      ? this.getTokenIdentity(peerAddr || this.peerAddr, appId, pubkey)
      : null;
    this.tokenCacheKey = this.tokenIdentity;
  }

  // 清除token
  async ClearToken(): Promise<void> {
      this.token = "";
      this.tokenIdentity = null;
      this.tokenGeneration++;
      this.tokenRequest = null;
      this.tokenRequestIdentity = null;
      if (this.tokenCacheKey) {
        Client.sharedTokens.delete(this.tokenCacheKey);
        Client.sharedTokenRequests.delete(this.tokenCacheKey);
      }
      this.tokenCacheKey = null;
  }


  // 验证token
  async ValidToken(
    peerAddr?: Multiaddr
    ):  Promise<void> {
      try {
        if (this.p2pNode == null) {
          throw new Error("p2pNode is null");
        }
        if (!peerAddr) {
          peerAddr = this.peerAddr;
        }
        const grpcClient = new DCGrpcClient(
          this.p2pNode,
          peerAddr,
          this.token,
          this.protocol
        );
        const validFlag = await grpcClient.ValidToken(5900);
        if (!validFlag) {
          throw new Error("token is timeout");
        }
      } catch (err) {
        throw err;
      }
    }

  // 获取Token
  async refreshToken(
    appId: string,
    pubkey: string,
    signCallback: (payload: Uint8Array) =>  Promise<Uint8Array>,
    peerAddr?: Multiaddr
  ): Promise<string> {
    this.ClearToken();
    return await this.GetToken(appId, pubkey, signCallback, peerAddr);
  }
}
