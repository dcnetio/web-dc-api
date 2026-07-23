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
  private tokenCacheKey: string | null = null;
  private tokenGeneration = 0;

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
    if (this.token) {
      return this.token;
    }
    if (this.tokenRequest) {
      return this.tokenRequest;
    }

    const targetPeer = peerAddr || this.peerAddr;
    const cacheKey = `${this.protocol}:${targetPeer.toString()}:${appId}:${pubkey}`;
    const tokenGeneration = this.tokenGeneration;
    this.tokenCacheKey = cacheKey;
    const cached = Client.sharedTokens.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      this.token = cached.token;
      return cached.token;
    }
    if (cached) {
      Client.sharedTokens.delete(cacheKey);
    }

    const inFlightRequest = Client.sharedTokenRequests.get(cacheKey);
    if (inFlightRequest) {
      this.tokenRequest = inFlightRequest;
      try {
        const token = await inFlightRequest;
        if (tokenGeneration === this.tokenGeneration) {
          this.token = token;
        }
        return token;
      } finally {
        if (this.tokenRequest === inFlightRequest) {
          this.tokenRequest = null;
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
      if (!pubkey || pubkey.length == 0) {
        throw new Error("pubkey is empty");
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
    Client.sharedTokenRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      if (Client.sharedTokenRequests.get(cacheKey) === request) {
        Client.sharedTokenRequests.delete(cacheKey);
      }
      if (this.tokenRequest === request) {
        this.tokenRequest = null;
      }
    }
  }

  // 清除token
  async ClearToken(): Promise<void> {
      this.token = "";
      this.tokenGeneration++;
      this.tokenRequest = null;
      if (this.tokenCacheKey) {
        Client.sharedTokens.delete(this.tokenCacheKey);
        Client.sharedTokenRequests.delete(this.tokenCacheKey);
      }
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
