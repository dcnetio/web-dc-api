import { User } from "../types/types";
import { base32 } from "multiformats/bases/base32";
import * as JsCrypto from "jscrypto/es6";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { peerIdFromString } from "@libp2p/peer-id";
import { PeerId } from "@libp2p/interface";
import { openDB } from 'idb';
import { keys } from "@libp2p/crypto";
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
  const bigIntValue = typeof value === 'number' ? BigInt(value) : value;  
  
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

    // 使用 Web Crypto API 安全存储
    async function saveKeyPair(keyPair) {
      // 导出密钥（正确参数）  
      const privateKey = btoa(String.fromCharCode(...keyPair.raw)) 
      // const publicKey = Buffer.from(keyPair.publicKey.raw).toString('base64')
      const encode = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));  
      // const keyStorage = {  
      //   publicKey: encode(publicKey),  
      //   privateKey: encode(privateKey),  
      //   createdAt: new Date().toISOString()  
      // };  
      // // 打开数据库  
      // const db = await openDB('cryptoVault', 2, {  
      //   upgrade(db) {  
      //     db.createObjectStore('ed25519');  
      //   }  
      // });  

      // await db.put("keys", {
      //   id: "ed25519_key",
      //   ...keyStorage  
      // });
      localStorage.setItem('ed25519_key', privateKey)
    }
    async function loadKeyPair() {  
      // const db = await openDB('cryptoVault');  
      // const stored = await db.get('ed25519', 'ed25519_key');  
    
      // 解码 Base64  
      const decode = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));  
      
      // if(!stored.publicKey || !stored.privateKey) return null
    
      // // 导入私钥  
      // const privateKey = decode(stored.privateKey)
      const privateKey = localStorage.getItem('ed25519_key')
      if(privateKey){
        const keyPair = keys.privateKeyFromRaw(decode(privateKey))
        return keyPair
      }
      return null
    }  

export {
  sha256,
  getRandomBytes,
  concatenateUint8Arrays,
  uint32ToLittleEndianBytes,
  uint64ToLittleEndianBytes,
  uint64ToBigEndianBytes, 
  isUser,
  sleep,
  decryptContentForBrowser,
  compareByteArrays,
  mergeUInt8Arrays,
  fastExtractPeerId,
  saveKeyPair,
  loadKeyPair
};
