import type { Multiaddr } from "@multiformats/multiaddr";
import { Ed25519PrivKey } from "./dc-key/ed25519";
import { KeyManager } from "./dc-key/keyManager";
import type { Client } from "./dcapi";
import { DCGrpcClient } from "./grpc-dc";
import { keys } from "@libp2p/crypto";
import { Ed25519PubKey } from "./dc-key/ed25519";
import {
  extractPeerIdFromMultiaddr,
  generateSymKeyForPrikey,
  extractPublicKeyFromPeerId,
} from "./dc-key/keyManager";
import { sha256, getRandomBytes, concatenateUint8Arrays } from "./util/utils";
import { Encryption } from "./util/curve25519Encryption";
import { decryptContent } from "./util/dccrypt";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { PeerId } from "@libp2p/interface";
import { Libp2pGrpcClient } from "grpc-libp2p-client";

import { dcnet } from "./proto/dcnet_proto";

interface AccountLoginRequest {
  accounthashencrypt: Uint8Array;
  pubkeyencrypt: Uint8Array;
  loginkeyrandencrypt: Uint8Array;
}

export class CommonClient {
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
  ): Promise<Ed25519PrivKey> {
    //登录
    const prikey = await this._accountDoLogin(
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
    return privKey;
  }

  async _accountDoLogin(
    account: string,
    password: string,
    seccode: string,
    peerAddr: Multiaddr
  ) {
    if (this.client.p2pNode == null || this.client.p2pNode.peerId == null) {
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
    const localPubkeyBytes = this.client.p2pNode.peerId.publicKey;
    const req = await generateAccountLoginRequestWithPeerId(
      peerId,
      account,
      password,
      seccode,
      tempEdPubkey
    );
    const prikeyencrypt2 = await this._accountloginApi(
      req.accounthashencrypt,
      req.pubkeyencrypt,
      req.loginkeyrandencrypt,
      peerAddr
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
  }

  async _accountloginApi(
    accounthashencrypt: Uint8Array,
    pubkeyencrypt: Uint8Array,
    loginkeyrandencrypt: Uint8Array,
    peerAddr
  ): Promise<Uint8Array> {
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        peerAddr || this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const message = new dcnet.pb.AccountLoginRequest({});
      message.accounthashencrypt = accounthashencrypt;
      message.pubkeyencrypt = pubkeyencrypt;
      message.loginkeyrandencrypt = loginkeyrandencrypt;
      const messageBytes =
        dcnet.pb.AccountLoginRequest.encode(message).finish();
      const responseData = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AccountLogin",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AccountLoginReply.decode(responseData);
      const prikeyencrypt2 = decoded.prikeyencrypt2;
      return prikeyencrypt2;
    } catch (err) {
      console.error("AccountLogin error:", err);
      throw err;
    }
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
      const token = await grpcClient.GetToken(pubKey.string(), (payload) =>
        this.signCallback(payload)
      );
      this.client.token = token;
      return token;
    } catch (err) {
      console.error("GetToken error:", err);
      throw err;
    }
  }
}

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
