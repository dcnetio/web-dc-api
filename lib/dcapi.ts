import type { Libp2p } from "libp2p";
import type { Multiaddr } from "@multiformats/multiaddr";

import { DCGrpcClient } from "./grpc-dc";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Ed25519PubKey } from "./dc-key/ed25519";
import { extractPeerIdFromMultiaddr,generateSymKeyForPrikey,extractPublicKeyFromPeerId } from "./dc-key/keyManager";
import type { PeerId } from "@libp2p/interface";


import { Encryption } from "./util/curve25519Encryption";
import { decryptContent } from "./util/dccrypt";
import { keys } from "@libp2p/crypto";
import { sha256, getRandomBytes, concatenateUint8Arrays } from "./util/utils";
import { Blocks } from "helia";




export class Client {
  readonly protocol: string;
  p2pNode: Libp2p;
  blockstore: Blocks;
  peerAddr: Multiaddr;
  token: string;

  constructor(node: Libp2p,blockstore: Blocks, peerAddr: Multiaddr, protocol: string) {
    this.protocol = protocol;
    this.p2pNode = node;
    this.peerAddr = peerAddr;
    this.token = "";
    this.blockstore = blockstore
  }

  async GetToken(
    pubkey: string,
    signCallback: (payload: Uint8Array) => Uint8Array,
    peerAddr?: Multiaddr
  ): Promise<string> {
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
      const token = await grpcClient.GetToken(pubkey, signCallback);
      this.token = token;
      return token;
    } catch (err) {
      console.error("GetToken error:", err);
      throw err;
    }
  }

  // 清除token
  async ClearToken(): Promise<void> {
      this.token = "";
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
        await grpcClient.ValidToken();
      } catch (err) {
        console.error("GetToken error:", err);
        throw err;
      }
    }

  // 获取Token
  async refreshToken(
    pubkey: string,
    signCallback: (payload: Uint8Array) => Uint8Array,
    peerAddr?: Multiaddr
  ): Promise<string> {
    this.ClearToken();
    return await this.GetToken(pubkey, signCallback, peerAddr);
  }
}
