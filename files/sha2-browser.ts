/* global crypto */
import CryptoJS from 'crypto-js'
import { from } from './hasher.js'
// 定义哈希函数的类型
type HashFunction = (data: Uint8Array) => Uint8Array;

function sha256hash(data: Uint8Array): Uint8Array {
  const wordArray = CryptoJS.lib.WordArray.create(data);
  const hash = CryptoJS.SHA256(wordArray);
  return new Uint8Array(hash.words.flatMap(word => [
    (word >> 24) & 0xFF,
    (word >> 16) & 0xFF,
    (word >> 8) & 0xFF,
    word & 0xFF
  ]));
}

function sha512hash(data: Uint8Array): Uint8Array {
  const wordArray = CryptoJS.lib.WordArray.create(data);
  const hash = CryptoJS.SHA512(wordArray);
  return new Uint8Array(hash.words.flatMap(word => [
    (word >> 24) & 0xFF,
    (word >> 16) & 0xFF,
    (word >> 8) & 0xFF,
    word & 0xFF
  ]));
}

export const sha256 = from({
  name: 'sha2-256',
  code: 0x12,
  encode: sha256hash
})

export const sha512 = from({
  name: 'sha2-512',
  code: 0x13,
  encode: sha512hash
})

