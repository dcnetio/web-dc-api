import type { Multiaddr } from "@multiformats/multiaddr";
import { Ed25519PrivKey } from "../dc-key/ed25519";
import { KeyManager } from "../dc-key/keyManager";
import type { Client } from "../dcapi";
import { DCGrpcClient } from "../grpc-dc";

export class AccountClient {
  client: Client;
  privKey: Ed25519PrivKey | undefined;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }

  // 登陆
  async accountLogin(
    nftAccount: string,
    password: string,
    safecode: string,
    appName: string
  ): Promise<boolean> {
    //登录
    const prikey = await this.client.AccountLogin(
      nftAccount,
      password,
      safecode,
      this.client.peerAddr
    );
    console.log("AccountLogin success:", prikey);
    let mnemonic = "";
    if (prikey.startsWith("mnemonic:")) {
      mnemonic = prikey.slice(9);
    } else if (prikey.startsWith("privatekey:")) {
      // todo 私钥情况下登陆
      const basePriKey = prikey.slice(11);
      let priKey: Uint8Array;
    }
    const keymanager = new KeyManager();
    //const privKey1 = await keymanager.getEd25519KeyFromMnemonic(mnemonic);
    const privKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      appName
    );
    this.privKey = privKey;
    return true;
  }

  signCallback(payload: Uint8Array): Uint8Array {
    // Implement your signCallback logic here
    console.log("signCallback start ");
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    const signature = this.privKey?.sign(payload);
    return signature;
  }

  getPubkeyRaw() {
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    const pubKey = this.privKey.publicKey;
    return pubKey.raw;
  }
  sign(Uint8Array): Uint8Array {
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    return this.privKey.sign(Uint8Array);
  }

  getPubkeyString() {
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    const pubKey = this.privKey.publicKey;
    return pubKey.toString();
  }

  async getToken(peerAddr?: Multiaddr): Promise<string> {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      if (!this.privKey) {
        throw new Error("Private key is not initialized");
      }
      if (!peerAddr) {
        peerAddr = this.client.peerAddr;
      }
      const grpcClient = new DCGrpcClient(
        this.client.p2pNode,
        peerAddr,
        this.client.token,
        this.client.protocol
      );
      const pubKey = this.privKey.publicKey;
      const token = await grpcClient.GetToken(
        pubKey.string(),
        (payload) => this.signCallback(payload)
      );
      this.client.token = token;
      return token;
    } catch (err) {
      console.error("GetToken error:", err);
      throw err;
    }
  }
}
