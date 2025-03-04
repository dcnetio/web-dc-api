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




export class Client {
  readonly protocol: string;
  p2pNode: Libp2p;
  peerAddr: Multiaddr;
  token: string;

  constructor(node: Libp2p, peerAddr: Multiaddr, protocol: string) {
    this.protocol = protocol;
    this.p2pNode = node;
    this.peerAddr = peerAddr;
    this.token = "";
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

  async AccountLogin(
    account: string,
    password: string,
    seccode: string,
    peerAddr: Multiaddr
  ): Promise<string> {
    try {
      if (this.p2pNode == null || this.p2pNode.peerId == null) {
        throw new Error("p2pNode is null or node privateKey is null");
      }
      //生成临时ed25519公私钥对
      const keyPair = await keys.generateKeyPair("Ed25519");
      // 获取私钥
      const privateKeyRaw = keyPair.raw;
      // 获取公钥
      const publicKey = keyPair.publicKey;
      const tempEdPubkey = Ed25519PubKey.formEd25519PublicKey(publicKey);
      //multiaddr 中提取peerid
      const peerId = await extractPeerIdFromMultiaddr(peerAddr);
      console.log("peerId:", peerId.toString());
      // 获取当前节点的peerID,并且获取节点的公钥
      const localPubkeyBytes = this.p2pNode.peerId.publicKey;
      const req = await generateAccountLoginRequestWithPeerId(
        peerId,
        account,
        password,
        seccode,
        tempEdPubkey
      );
      const grpcClient = new DCGrpcClient(
        this.p2pNode,
        this.peerAddr,
        this.token,
        this.protocol
      );
      const prikeyencrypt2 = await grpcClient.AccountLogin(
        req.accounthashencrypt,
        req.pubkeyencrypt,
        req.loginkeyrandencrypt
      );
      //从返回的数据中解析出私钥
      //Decrypt with private key
      const prikeyEncrypt = await Encryption.decrypt(
        privateKeyRaw,
        prikeyencrypt2
      );
      const aeskey = await generateSymKeyForPrikey(account, password);
      //Aes gcm解密
      const prikey = await decryptContent(prikeyEncrypt, aeskey.raw);
      return uint8ArrayToString(prikey);
    } catch (err) {
      console.error("AccountLogin error:", err);
      throw err;
    }
  }


  async AddUserOffChainSpace(
    pubkey: string,
    blockheight: number,
    signature: Uint8Array,
    peerAddr?: Multiaddr
  ): Promise<void> {
    try {
      console.log("AddUserOffChainSpace pubkey", pubkey);
      console.log("AddUserOffChainSpace blockheight", blockheight);
      console.log("AddUserOffChainSpace signature", signature);
      console.log("AddUserOffChainSpace peerAddr", peerAddr);
      if (this.p2pNode == null || this.p2pNode.peerId == null) {
        throw new Error("p2pNode is null or node privateKey is null");
      }
      if (!peerAddr) {
        peerAddr = this.peerAddr;
      }
      const peerId = await extractPeerIdFromMultiaddr(peerAddr);
      console.log("AddUserOffChainSpace peerId", peerId);
      const grpcClient = new DCGrpcClient(
        this.p2pNode,
        peerAddr,
        this.token,
        this.protocol
      );
      const res = await grpcClient.AddUserOffChainSpace(
        pubkey,
        blockheight,
        peerId.toString(),
        signature
      );
    } catch (err) {
      console.error("SetCacheKey error:", err);
      throw err;
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

interface AccountLoginRequest {
  accounthashencrypt: Uint8Array;
  pubkeyencrypt: Uint8Array;
  loginkeyrandencrypt: Uint8Array;
}

// // SHA-256 哈希计算
// async function sha256(data: Uint8Array): Promise<Uint8Array> {
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//     return new Uint8Array(hashBuffer);
// }

// // 生成随机字节
// function getRandomBytes(length: number): Uint8Array {
//     return crypto.getRandomValues(new Uint8Array(length));
// }

// // 连接 Uint8Array
// function concatenateUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
//     const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
//     const result = new Uint8Array(totalLength);
//     let offset = 0;
//     for (const arr of arrays) {
//         result.set(arr, offset);
//         offset += arr.length;
//     }
//     return result;
// }

/**
 * 生成账户登录请求
 * @param peerId - 节点ID
 * @param account - 账户名
 * @param password - 密码
 * @param seccode - 安全码
 * @param pk - 返回数据加密用的公钥
 * @returns 登录请求对象
 */
async function generateAccountLoginRequestWithPeerId(
  peerId: PeerId,
  account: string,
  password: string,
  seccode: string,
  pk: Ed25519PubKey
): Promise<AccountLoginRequest> {
  try {
    // 获取节点公钥
    const peerPubkey = await extractPublicKeyFromPeerId(peerId);
    const serverPubkey = peerPubkey; // 假设已经做了适当的转换

    // 计算账户哈希
    const accountBytes = new TextEncoder().encode(account);
    const accountHash = await sha256(accountBytes);

    // 使用节点公钥加密账户哈希
    const accountHashCrypt = await Encryption.encrypt(
      serverPubkey.raw,
      accountHash
    );
    // 获取并加密公钥
    const pkBytes = pk.raw;
    const pubkeyEncrypt = await Encryption.encrypt(serverPubkey.raw, pkBytes);

    // 生成随机密钥
    const randKey = getRandomBytes(32);

    // 计算密码哈希
    const passwordBytes = new TextEncoder().encode(password);
    const passwordSlice = passwordBytes.slice(0, 2);
    const passwordHash = await sha256(passwordSlice);
    const passwordHashLast2 = passwordHash.slice(-2);

    // 计算登录密钥
    const seccodeBytes = new TextEncoder().encode(seccode);
    const loginKeySeed = concatenateUint8Arrays(
      accountHash,
      passwordHashLast2,
      seccodeBytes
    );
    const loginkey = await sha256(loginKeySeed);

    // 加密登录密钥和随机密钥
    const loginkeyRand = concatenateUint8Arrays(loginkey, randKey);
    const loginkeyRandEncrypt = await Encryption.encrypt(
      serverPubkey.raw,
      loginkeyRand
    );

    // 返回登录请求对象
    return {
      accounthashencrypt: accountHashCrypt,
      pubkeyencrypt: pubkeyEncrypt,
      loginkeyrandencrypt: loginkeyRandEncrypt,
    };
  } catch (error: any) {
    throw new Error(`Failed to generate login request: ${error.message}`);
  }
}