import { ed25519 } from "@noble/curves/ed25519";
import * as protobuf from "protobufjs";
import { identity } from "multiformats/hashes/identity";
import { CID } from "multiformats/cid";
import { base58btc } from "multiformats/bases/base58";
import { base32 } from "multiformats/bases/base32";
import type { MultihashDigest } from "multiformats/hashes/interface";
import type { Ed25519PrivateKey, Ed25519PublicKey } from "@libp2p/interface";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { Encryption } from "../../util/curve25519Encryption";

enum keyType {
  RSA = 0,
  Ed25519 = 1,
  Secp256k1 = 2,
  ECDSA = 3,
}

// 类型定义
interface KeyMessage {
  type: number;
  data: Uint8Array;
}

//比较两个 Uint8Array
const arrayEquals = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
};

const PublicKeyProto = new protobuf.Type("PublicKey")
  .add(new protobuf.Field("type", 1, "uint32"))
  .add(new protobuf.Field("data", 2, "bytes"));

// ED25519公钥实现  // 更完整的实现
export class Ed25519PubKey implements Ed25519PublicKey {
  raw: Uint8Array;
  type: "Ed25519";

  constructor(publicKey: Uint8Array) {
    if (!(publicKey instanceof Uint8Array)) {
      throw new Error("Public key must be Uint8Array");
    }
    if (publicKey.length !== 32) {
      throw new Error("ed25519: bad public key length");
    }
    this.raw = new Uint8Array(publicKey);
    this.type = "Ed25519";
  }
  private static readonly proto = (() => {
    return PublicKeyProto;
  })();

  bytes() {
    return this.raw;
  }

  /**
   * Returns a multihash, the digest of which is the protobuf-encoded public key
   * encoded as an identity hash
   */
  toMultihash(): MultihashDigest<0> {
    // 使用 protobuf 编码公钥
    const protoBytes = Ed25519PubKey.publicKeyToProto(this);
    const size = protoBytes.length;

    // 创建 bytes: 格式为 [code(varint), size(varint), ...digest]
    const bytes = new Uint8Array(2 + size);
    bytes[0] = 0x00; // identity hash code
    bytes[1] = size; // size in varint
    bytes.set(protoBytes, 2);

    return {
      code: 0x00, // identity hash code
      size,
      digest: protoBytes,
      bytes,
    };
  }

  toCID() {
    const hash = this.toMultihash();
    return CID.create(1, 0x72, hash);
  }

  equals(other: Ed25519PublicKey): boolean {
    return arrayEquals(this.raw, other.raw);
  }

  verify(data: Uint8Array, sig: Uint8Array) {
    return ed25519.verify(sig, data, this.raw);
  }
  async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const encrypted = await Encryption.encrypt(this.raw, data);
    return encrypted;
  }

  static formEd25519PublicKey(publicKey: Ed25519PublicKey): Ed25519PubKey {
    return new Ed25519PubKey(publicKey.raw);
  }

  static fromMultihash(multihash: MultihashDigest<0x0>) {
    if (multihash.code !== identity.code) {
      throw new Error("Invalid multihash code");
    }
    return new Ed25519PubKey(multihash.digest);
  }
  // 从 CID 恢复公钥
  static fromCID(cid: CID<unknown, 0x72, 0x0, 1>) {
    if (cid.code !== 0x72) {
      // libp2p-key codec
      throw new Error("Invalid CID codec");
    }
    return Ed25519PubKey.fromMultihash(cid.multihash);
  }

  // PublicKeyToProto converts a public key object into an unserialized
  // protobuf PublicKey message.
  static publicKeyToProto(k: Ed25519PubKey): Uint8Array {
    const message: KeyMessage = {
      type: keyType.Ed25519,
      data: k.bytes(),
    };
    const buffer = Ed25519PubKey.proto.encode(message).finish();
    return buffer;
  }

  // PublicKeyFromProto converts a protobuf PublicKey message into a public key object.
  static publicKeyFromProto(buf: Uint8Array): Ed25519PubKey {
    const decoded = Ed25519PubKey.proto.decode(buf) as unknown as KeyMessage;
    if (decoded.type !== keyType.Ed25519) {
      throw new Error("Invalid key type");
    }
    return new Ed25519PubKey(decoded.data);
  }
  //与dc中的go代码兼容
  string(): string {
    const protoBytes = Ed25519PubKey.publicKeyToProto(this);
    // 使用 base32 编码
    return base32.encode(protoBytes);
  }

  // 从字符串创建公钥
  static unmarshalString(str: string): Ed25519PubKey {
    const protoBytes = base32.decode(str);
    return Ed25519PubKey.publicKeyFromProto(protoBytes);
  }
  /**
   * Returns this key as a multihash with base58btc encoding
   */
  toString(): string {
    //生成16进制
    return bytesToHex(this.bytes());
  }

  static fromString(str: string): Ed25519PubKey {
    return new Ed25519PubKey(hexToBytes(str));
  }

  // 转换为 base58 字符串
  toBase58() {
    const hash = this.toMultihash();
    return base58btc.encode(hash.bytes);
  }

  // 从 base58 字符串恢复
  static fromBase58(str: string) {
    const bytes = base58btc.decode(str);
    const mh: MultihashDigest<0> = {
      code: 0,
      size: bytes.length - 2,
      digest: bytes.slice(2),
      bytes,
    };
    return Ed25519PubKey.fromMultihash(mh);
  }

  static edPubkeyFromStr(pubkey: string) {
    if (pubkey.indexOf("0x") === 0) {
      // hex
      return Ed25519PubKey.fromString(pubkey.substring(2));
    } else {
      // base32
      return Ed25519PubKey.unmarshalString(pubkey);
    }
  }
}

// ED25519私钥实现
export class Ed25519PrivKey implements Ed25519PrivateKey {
  readonly type: "Ed25519";
  readonly raw: Uint8Array;
  readonly publicKey: Ed25519PubKey;

  constructor(privateKey: Uint8Array) {
    if (privateKey.length !== 64) {
      throw new Error("ed25519: bad private key length");
    }
    // 用复制的方式保存私钥
    this.raw = new Uint8Array(privateKey);
    this.type = "Ed25519";
    // 公钥是私钥的后32字节
    this.publicKey = new Ed25519PubKey(privateKey.slice(32));
  }

  private static readonly proto = (() => {
    return PublicKeyProto;
  })();

  static fromSeed(seed: Uint8Array): Ed25519PrivKey {
    if (seed.length !== 32) {
      throw new Error("ed25519: bad seed length");
    }

    // 生成公钥
    const publicKey = ed25519.getPublicKey(seed);

    // 构造64字节私钥
    const privateKey = new Uint8Array(64);
    privateKey.set(seed);
    privateKey.set(publicKey, 32);

    return new Ed25519PrivKey(privateKey);
  }

  bytes(): Uint8Array {
    return this.raw;
  }

  sign(msg: Uint8Array): Uint8Array {
    // 使用私钥的前32字节（种子）进行签名
    return ed25519.sign(msg, this.raw.slice(0, 32));
  }

  async decrypt(data: Uint8Array): Promise<Uint8Array> {
    const decrypted = await Encryption.decrypt(this.raw, data);
    return decrypted;
  }

  equals(other: Ed25519PrivKey): boolean {
    return arrayEquals(this.bytes(), other.bytes());
  }

  // privateKeyToProto converts a public key object into an unserialized
  // protobuf PrivateKey message.
  static privateKeyToProto(k: Ed25519PrivKey): Uint8Array {
    const message: KeyMessage = {
      type: keyType.Ed25519,
      data: k.bytes(),
    };
    const buffer = Ed25519PrivKey.proto.encode(message).finish();
    return buffer;
  }

  // privateKeyFromProto converts a protobuf PrivateKey message into a public key object.
  static privateKeyFromProto(buf: Uint8Array): Ed25519PrivKey {
    const decoded = Ed25519PrivKey.proto.decode(buf) as unknown as KeyMessage;
    if (decoded.type !== keyType.Ed25519) {
      throw new Error("Invalid key type");
    }
    return new Ed25519PrivKey(decoded.data);
  }

  //与dc中的go代码兼容
  string(): string {
    const protoBytes = Ed25519PrivKey.privateKeyToProto(this);
    // 使用 base32 编码
    return base32.encode(protoBytes);
  }

  // 从字符串创建私钥
  static unmarshalString(str: string): Ed25519PrivKey {
    const protoBytes = base32.decode(str);
    return Ed25519PrivKey.privateKeyFromProto(protoBytes);
  }

  toString(): string {
    return bytesToHex(this.bytes());
  }

  static fromString(str: string): Ed25519PrivKey {
    return new Ed25519PrivKey(hexToBytes(str));
  }
}

// 调试工具函数
class KeyUtils {
  static generatePrivKey(): Ed25519PrivKey {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    return Ed25519PrivKey.fromSeed(seed);
  }
}

// 使用示例
async function example() {
  try {
    // 生成新的私钥
    const privKey = KeyUtils.generatePrivKey();

    // 获取公钥
    const pubKey = privKey.publicKey;

    // 签名示例
    const message = new TextEncoder().encode("Hello, World!");
    const signature = await privKey.sign(message);

    // 验证签名
    const isValid = pubKey.verify(message, signature);

    // 从字符串创建私钥
    const privKeyStr = privKey.toString();
    const recoveredPrivKey = Ed25519PrivKey.fromString(privKeyStr);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 运行示例
//example().catch(console.error)
