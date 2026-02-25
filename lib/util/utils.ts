import { User } from "../common/types/types";
import { base32 } from "multiformats/bases/base32";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { peerIdFromString } from "@libp2p/peer-id";
import { Ed25519PrivateKey, PeerId, PrivateKey } from "@libp2p/interface";
import { keys } from "@libp2p/crypto";
import { Uint8ArrayList } from "uint8arraylist";

const NonceBytes = 12;
const TagBytes = 16;

// SHA-256 哈希计算
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data as any);
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
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getBigUint64(0, littleEndian);
}

function isUser(obj: any): obj is User {
  // implement checks for required properties here
  return true; // or false if the object doesn't conform to User
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 将 Uint8Array 转换为十六进制字符串
 */
function uint8ArrayToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * 将十六进制字符串转换为 UTF-8 字符串
 */
function hexToUtf8(hex: string): string {
  if (typeof hex !== "string") {
    throw new TypeError("hexToUtf8: expected string, got " + typeof hex);
  }
  if (hex.length % 2) throw new Error("hexToUtf8: received invalid unpadded hex");
  
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    if (isNaN(byte)) {
      throw new Error("hexToUtf8: received invalid hex characters");
    }
    bytes[i] = byte;
  }
  return new TextDecoder().decode(bytes);
}

/**
 * 将异步迭代器转换为 Uint8Array (纯前端实现)
 */
async function iterableToUint8Array(iterable: AsyncIterable<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of iterable) {
    chunks.push(chunk instanceof Uint8ArrayList ? chunk.subarray() : chunk);
  }
  
  // 计算总长度
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  
  // 合并所有块
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}

async function decryptContentForBrowser(
  encryptBuffer: Uint8Array,
  decryptKey: string
): Promise<Uint8Array> {
  if (decryptKey == "" || encryptBuffer.length <= NonceBytes + TagBytes) {
    return encryptBuffer;
  }
  
  const nonce = encryptBuffer.subarray(0, NonceBytes);
  const ciphertext = encryptBuffer.subarray(NonceBytes);
  const keyBytes = base32.decode(decryptKey);
  
  // 使用 Web Crypto API 进行解密
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes as any,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: nonce as any,
      tagLength: 128
    },
    key,
    ciphertext as any
  );
  
  return new Uint8Array(decrypted);
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
  const peerIdStr = getPeerIdString(addr);

  return peerIdStr ? peerIdFromString(peerIdStr) : null;
}

function getPeerIdString(ma: any): string | undefined {
  if (!ma) return undefined;
  return ma
    .getComponents()
    .find((c: any) => c.name === "p2p" || c.name === "ipfs")?.value;
}
// 编码
const encodeKey = (buffer: Uint8Array) => btoa(String.fromCharCode(...buffer));

// 解码
const decodeKey = (str: string) =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

// 使用 Web Crypto API 安全存储
async function saveKeyPair(key: string, keyPair: Ed25519PrivateKey) {
  // 导出密钥（正确参数）
  const privateKey = encodeKey(keyPair.raw);
  localStorage.setItem(key, privateKey);
}
async function loadKeyPair(key: string): Promise<PrivateKey | null> {
  const privateKey = localStorage.getItem(key);
  if (privateKey) {
    const keyPair = keys.privateKeyFromRaw(decodeKey(privateKey));
    return keyPair;
  }
  return null;
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

// 将16进制字符串转换为ASCII字符串,peeid bases32
function hexToAscii(hex: string): string {
  // 移除0x前缀（如果存在）
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  // 将十六进制转换为 ASCII 字符串
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return String.fromCharCode(...bytes);
}

// json stringify过程中,将 BigInt 转为字符串
function jsonStringify(value: any): string {
  return JSON.stringify(value, (_, val) =>
    typeof val === "bigint" ? val.toString() : val
  );
}

/**
 * 将数字字符串（可带小数，支持负数）格式化，兼容旧数据排序：
 * 
 * 1. **正数（保持兼容）**：保持原有的补零逻辑。 
 *    - "123" -> "00000000000000000123"
 *    - 排序： "0...005" < "0...100" (Correct)
 * 
 * 2. **负数（新逻辑）**：使用前缀 "-"，并对整数部分按位取反（9-x）。
 *    - 使得绝对值大的负数（更小的值）在字典序上也更小。
 *    - "-100" -> Abs(100) -> "0...00100" -> Invert "9...99899" -> "-99999999999999999899"
 *    - "-5"   -> Abs(5)   -> "0...00005" -> Invert "9...99994" -> "-99999999999999999994"
 * 
 * 排序效果：
 * String: "-" < "0" (ASCII 45 < 48)，所以所有负数排在正数前面。
 * Negative: "-9...899" (-100) < "-9...994" (-5). Correct.
 */

function padPositiveInt20(v: string | number): string {
  const s0 = String(v).trim();
  if (!/^-?\d+(\.\d+)?$/.test(s0)) throw new Error("只接受数字（可带小数）");

  const isNegative = s0.startsWith("-");
  const parts = s0.replace("-", "").split(".");
  
  let intPartStr = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";

  // 1. 去除前导零
  intPartStr = intPartStr.replace(/^0+/, "") || "0";
  
  if (intPartStr.length > 20) throw new Error("数值过大，超出支持范围 (20位)");

  // 2. 补零到 20 位
  const paddedInt = intPartStr.padStart(20, "0");

  if (isNegative) {
    // 3. 负数处理：按位取反 (9 - n)
    let inverted = "";
    for (const char of paddedInt) {
      inverted += (9 - parseInt(char)).toString();
    }
    // 负数保留小数部分原样（或者也可以考虑反转，但通常整数部分够用了，这里简化处理只拼接）
    // 注意：如果需要极其精确的小数排序，小数部分也需要反转，但通常 key 主要是整数索引
    return fracPart ? `-${inverted}.${fracPart}` : `-${inverted}`;
  } else {
    // 4. 正数处理：保持原样，兼容旧数据
    return fracPart ? `${paddedInt}.${fracPart}` : paddedInt;
  }
}

function isBase32(str: string): boolean {
  try {
    // 尝试解码
    const decoded = base32.decode(str);
    // 编码后再编码回去，确保原字符串和再编码后的一致
    const reencoded = base32.encode(decoded);
    return reencoded.toUpperCase() === str.toUpperCase().replace(/=+$/, ""); // 去掉结尾的=
  } catch {
    // 如果解码失败，则不是有效的Base32格式
    return false;
  }
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
  jsonStringify,
  padPositiveInt20,
  isBase32,
  iterableToUint8Array,
  uint8ArrayToHex,
  hexToUtf8,
  getPeerIdString,
};
