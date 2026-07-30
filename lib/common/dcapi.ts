import type { Libp2p } from "libp2p";
import type { Multiaddr } from "@multiformats/multiaddr";

import { DCGrpcClient } from "./grpc-dc";

import { keys } from "@libp2p/crypto";
import { sha256, getRandomBytes, concatenateUint8Arrays } from "../util/utils";
import { Blocks } from "helia";




export class Client {
  private static readonly TOKEN_CACHE_TTL_MS = 50 * 60 * 1000;
  private static sharedTokens = new Map<
    string,
    { token: string; expiresAt: number }
  >();
  private static sharedTokenRequests = new Map<string, Promise<string>>();
  readonly protocol: string;
  p2pNode: Libp2p;
  blockstore: Blocks;
  peerAddr: Multiaddr;
  token: string;
  private tokenRequest: Promise<string> | null = null;
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
    peerAddr?: Multiaddr
  ): Promise<string> {
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
      return this.tokenRequest;
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
    if (inFlightRequest) {
      this.tokenRequest = inFlightRequest;
      this.tokenRequestIdentity = tokenIdentity;
      try {
        const token = await inFlightRequest;
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

    let request: Promise<string> | null = null;
    request = (async () => {
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
      const token = await grpcClient.GetToken(appId, pubkey, signCallback);
      if (tokenGeneration === this.tokenGeneration) {
        this.token = token;
        this.tokenIdentity = tokenIdentity;
      }
      if (
        token &&
        request &&
        Client.sharedTokenRequests.get(cacheKey) === request
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
    this.tokenRequest = request;
    this.tokenRequestIdentity = tokenIdentity;
    Client.sharedTokenRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      if (Client.sharedTokenRequests.get(cacheKey) === request) {
        Client.sharedTokenRequests.delete(cacheKey);
      }
      if (this.tokenRequest === request) {
        this.tokenRequest = null;
        this.tokenRequestIdentity = null;
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
