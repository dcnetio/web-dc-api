import { User } from "../types/types";
import { base32 } from "multiformats/bases/base32";
import * as JsCrypto from "jscrypto/es6";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { peerIdFromString } from "@libp2p/peer-id";
import { PeerId } from "@libp2p/interface";
import { keys } from "@libp2p/crypto";
import * as buffer from "buffer/";
const { Buffer } = buffer;
const { Word32Array, AES, pad, mode, Base64 } = JsCrypto;
const NonceBytes = 12;
const TagBytes = 16;

// SHA-256 哈希计算
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// 生成随机字节
function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// 连接 Uint8Array
function concatenateUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
/**
 * 将 64 位无符号整数转换为大端序字节数组（用于文件头）
 * @param value 要转换的整数值
 * @returns 8 字节的 Uint8Array
 */
function uint64ToBigEndianBytes(value: number | bigint): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  // 确保值是 BigInt 类型
  const bigIntValue = typeof value === "number" ? BigInt(value) : value;

  // 使用 DataView 设置大端序值
  view.setBigUint64(0, bigIntValue, false); // false 表示大端序

  return new Uint8Array(buffer);
}

// Helper 函数：将 Uint64 转换为小端 Uint8Array
function uint64ToLittleEndianBytes(value: number): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, value & 0xffffffff, true);
  view.setUint32(4, Math.floor(value / 2 ** 32), true);
  return new Uint8Array(buffer);
}
// Helper 函数：将 Uint32 转换为小端 Uint8Array
function uint32ToLittleEndianBytes(value: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, value, true); // true 表示小端
  return new Uint8Array(buffer);
}

// 将 Uint64 转换为大端 Uint8Array
function uint64ToUint8Array(
  value: bigint,
  littleEndian: boolean = false
): Uint8Array {
  const buffer = new ArrayBuffer(8); // 64 位需要 8 字节
  const view = new DataView(buffer);
  view.setBigUint64(0, value, littleEndian); // false 表示大端
  return new Uint8Array(buffer);
}

//将 Uint8Array 转换为 uint64
function uint8ArrayToUint64(
  bytes: Uint8Array,
  littleEndian: boolean = false
): bigint {
  if (bytes.length !== 8) {
    throw new Error("Uint8Array must be exactly 8 bytes long");
  }
  const buffer = bytes.buffer;
  const view = new DataView(buffer);
  return view.getBigUint64(0, littleEndian);
}

function isUser(obj: any): obj is User {
  // implement checks for required properties here
  return true; // or false if the object doesn't conform to User
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function decryptContentForBrowser(
  encryptBuffer: Uint8Array,
  decryptKey: string
) {
  if (decryptKey == "" || encryptBuffer.length <= 28) {
    return encryptBuffer;
  }
  const nonce = encryptBuffer.subarray(0, NonceBytes);
  const iv = new Word32Array(nonce);
  const tag = encryptBuffer.subarray(
    encryptBuffer.length - TagBytes,
    encryptBuffer.length
  );
  const kdfSalt = new Word32Array(tag);
  const encryptContent = encryptBuffer.subarray(
    NonceBytes,
    encryptBuffer.length - TagBytes
  );
  const cipherText = new Word32Array(encryptContent);
  const key = new Word32Array(base32.decode(decryptKey));
  const decrypted = AES.decrypt(cipherText.toString(Base64), key, {
    iv: iv,
    padding: pad.NoPadding,
    mode: mode.GCM,
    kdfSalt: kdfSalt,
  });
  return decrypted.toUint8Array();
}

// 比较两个字节数组是否相等
function compareByteArrays(array1: Uint8Array, array2: Uint8Array) {
  if (array1.byteLength != array2.byteLength) {
    return false;
  }
  const view1 = new DataView(array1.buffer, array1.byteOffset);
  const view2 = new DataView(array2.buffer, array2.byteOffset);
  for (let i = 0; i < array1.length; i++) {
    if (view1.getUint8(i) !== view2.getUint8(i)) {
      return false;
    }
  }
  return true;
}

function mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  // sum of individual array lengths
  const mergedArray = new Uint8Array(a1.length + a2.length);
  mergedArray.set(a1);
  mergedArray.set(a2, a1.length);
  return mergedArray;
}
function fastExtractPeerId(ma: Multiaddr | string): PeerId | null {
  const addr = typeof ma === "string" ? multiaddr(ma) : ma;
  const peerIdStr = addr.getPeerId(); // 直接使用内置方法

  return peerIdStr ? peerIdFromString(peerIdStr) : null;
}
// 编码
const encodeKey = (buffer: Uint8Array) =>
  btoa(String.fromCharCode(...buffer));

// 解码 
const decodeKey = (str: string) =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

// 使用 Web Crypto API 安全存储
async function saveKeyPair(key, keyPair) {
  // 导出密钥（正确参数）
  const privateKey = encodeKey(keyPair.raw);
  localStorage.setItem(key, privateKey);
}
async function loadKeyPair(key) {
  const privateKey = localStorage.getItem(key);
  if (privateKey) {
    const keyPair = keys.privateKeyFromRaw(decodeKey(privateKey));
    return keyPair;
  }
  return null;
}

async function savePublicKey(publicKey: string) {
  localStorage.setItem(
    "ed25519_publicKey",
    publicKey
  );
}
async function loadPublicKey(): Promise<string | null> {
  const publicKey = localStorage.getItem("ed25519_publicKey");
  if (publicKey) {
    return publicKey;
  }
  return null;
}
async function saveTokenWithPeerId(publicKeyString: string, peerId: string, token: string) {
  localStorage.setItem("token_" + publicKeyString + "_" + peerId, token);
}
async function loadTokenWithPeerId(publicKeyString: string, peerId: string): Promise<string | null> {
  return localStorage.getItem("token_" + publicKeyString + "_" + peerId);
}

// 同域名跨浏览器锁获取并执行操作,mode  "exclusive" | "shared";
async function withWebLock(
  lockName: string,
  mode: LockMode,
  callback: () => Promise<void>
): Promise<void> {
  await navigator.locks.request(lockName, { mode: mode }, async (lock) => {
    console.log(`Lock "${lockName}" acquired`);
    await callback();
    console.log(`Lock "${lockName}" released`);
  });
}
// 函数：解析32位无符号整数
function parseUint32(str: string) {
  try {
    // 尝试解析为数值
    const num = parseInt(str, 10);

    // 验证解析结果
    if (isNaN(num)) {
      throw new Error("invalid syntax");
    }

    if (num < 0) {
      throw new Error("invalid syntax for uint");
    }

    if (num > 0xffffffff) {
      // 检查是否超出32位无符号范围
      throw new Error("value out of range");
    }

    // 转换为32位无符号整数
    return num >>> 0;
  } catch (error) {
    throw error;
  }
}

function hexToAscii(hex: string): string {
  // 移除0x前缀（如果存在）
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  // 使用Buffer将16进制转换为字符串
  return Buffer.from(cleanHex, "hex").toString("ascii");
}

export {
  sha256,
  getRandomBytes,
  concatenateUint8Arrays,
  uint32ToLittleEndianBytes,
  uint64ToUint8Array,
  uint8ArrayToUint64,
  uint64ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  isUser,
  sleep,
  decryptContentForBrowser,
  compareByteArrays,
  mergeUInt8Arrays,
  fastExtractPeerId,
  withWebLock,
  saveKeyPair,
  loadKeyPair,
  parseUint32,
  hexToAscii,
  savePublicKey,
  loadPublicKey,
  saveTokenWithPeerId,
  loadTokenWithPeerId,
};
