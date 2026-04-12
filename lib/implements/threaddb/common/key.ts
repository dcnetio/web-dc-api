 
import { randomBytes } from '@stablelib/random';

import { base32 } from 'multiformats/bases/base32';
import { SymKey } from '../core/core';
import { symKeyFromBytes } from '../../../common/dc-key/keyManager';
import type { PublicKey,PrivateKey } from "@libp2p/interface";

// Constants
const NonceBytes = 12;
const TagBytes = 16;
const KeyBytes = 32;

interface EncryptedData {  
  iv: Uint8Array;       // 初始化向量  
  ciphertext: ArrayBuffer; // 密文  
  tag: ArrayBuffer;     // 认证标签  
}  
// Error classes
class CipherTextError extends Error {
  constructor() {
    super('malformed cipher text');
    this.name = 'CipherTextError';
  }
}

class InvalidKeyError extends Error {
  constructor() {
    super('invalid key');
    this.name = 'InvalidKeyError';
  }
}

/**
 * Key is a wrapper for a symmetric key
 */
export class SymmetricKey {
  static readonly keyBytes: number = 32;
  private _raw: Uint8Array;

  constructor(rawBytes: Uint8Array) {
    this._raw = rawBytes;
  }

  /**
   * Generate a new random key
   */
  static newRandom(): SymmetricKey {
    const rawBytes = randomBytes(KeyBytes);
    return new SymmetricKey(rawBytes);
  }

  /**
   * Creates a key without error handling (will throw if fails)
   */
  static new(): SymmetricKey {
    return SymmetricKey.newRandom();
  }

  /**
   * Create a key from raw bytes
   */
  static fromBytes(k: Uint8Array): SymmetricKey {
    if (k.length !== KeyBytes) {
      throw new InvalidKeyError();
    }
    return new SymmetricKey(k);
  }

  /**
   * Create a key from a base32-encoded string
   */
  static fromString(k: string): SymmetricKey {
    try {
      const bytes = base32.decode(k);
      return SymmetricKey.fromBytes(bytes);
    } catch (err) {
      throw new Error(`Failed to decode key: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

    async toSymKey(): Promise<SymKey> {
      const symKey =   symKeyFromBytes(this._raw);
      return symKey
    }
  
    static fromSymKey(symKey: SymKey): SymmetricKey {
      return new SymmetricKey(symKey.raw)
    }

  /**
   * Get raw key bytes
   */
  get raw(): Uint8Array {
    return this._raw;
  }

  /**
   * Return raw key bytes
   */
  bytes(): Uint8Array {
    return this._raw;
  }

  /**
   * Convert key to binary format
   */
  marshalBinary(): Uint8Array {
    return this._raw;
  }

  /**
   * Return base32-encoded string representation
   */
  toString(): string {
    try {
      return base32.encode(this.raw);
    } catch (err) {
      throw new Error(`Failed to encode key: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // /**
  //  * Encrypt performs AES-256 GCM encryption on plaintext
  //  */
  // encrypt(plaintext: Uint8Array): Uint8Array {
  //   // Generate a random nonce
  //   const nonce = randomBytes(secretbox.nonceLength)  ;
    
  //   const box = secretbox(plaintext, nonce, this._raw)  
  //   const encrypted = new Uint8Array(nonce.length + box.length)  
  //   encrypted.set(nonce)  
  //   encrypted.set(box, nonce.length)  
  //   return encrypted  
  // }
 
  
async  encrypt(  
  plaintext: Uint8Array,   
  exNonce?: Uint8Array
): Promise<Uint8Array> {  
  let nonce = randomBytes(NonceBytes);
  if(exNonce && exNonce.length === NonceBytes) {
    nonce = exNonce;
  }
  
  // 使用 Web Crypto API 进行 AES-GCM 加密
  const symKey = await this.toSymKey();
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce as any,
      tagLength: 128
    },
    symKey.key,
    plaintext as any
  );
  
  // 合并 nonce 和密文
  const result = new Uint8Array(nonce.length + encrypted.byteLength);
  result.set(nonce, 0);
  result.set(new Uint8Array(encrypted), nonce.length);
  return result;
} 





  /**
   * Decrypt uses key to perform AES-256 GCM decryption on ciphertext
   */
  async decrypt(encryptBuffer: Uint8Array): Promise<Uint8Array> {
    if (encryptBuffer.length < NonceBytes + TagBytes) {
      return encryptBuffer;
    }
    
    const nonce = encryptBuffer.subarray(0, NonceBytes);
    const ciphertext = encryptBuffer.subarray(NonceBytes);
    
    const symKey = await this.toSymKey();
    
    // 使用 Web Crypto API 解密
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonce as any,
        tagLength: 128
      },
      symKey.key,
      ciphertext as any
    );
    
    return new Uint8Array(decrypted);
  }
}





export type LogKey = PrivateKey | PublicKey 

export class Key {  
  private sk?: SymmetricKey 
  private rk?: SymmetricKey

  constructor(sk: SymmetricKey , rk?: SymmetricKey ) {  
    this.sk = sk  
    if(rk) {  
      this.rk = rk  
    }
  }  

  static new(sk: SymmetricKey, rk?: SymmetricKey ): Key {  
    if (!sk) {  
      throw new Error('service-key must not be null')  
    }  
    return new Key(sk, rk)  
  }  

  static newRandom(): Key {  
    return new Key(SymmetricKey.new(), SymmetricKey.new())  
  }  

  static newRandomService(): Key {  
    return new Key(SymmetricKey.new())  
  }  

  static fromBytes(b: Uint8Array): Key {  
    if (b.length !== SymmetricKey.keyBytes && b.length !== SymmetricKey.keyBytes * 2) {  
      throw new Error('invalid key')  
    }  

    const sk = SymmetricKey.fromBytes(b.slice(0, SymmetricKey.keyBytes))   
    if (b.length === SymmetricKey.keyBytes * 2) {  
      const rk = SymmetricKey.fromBytes(b.slice(SymmetricKey.keyBytes))  
      return new Key(sk,rk)
    }  
    return new Key(sk)  
  }  

  static fromString(s: string): Key {  
    const decoded = base32.decode(s)  
    return Key.fromBytes(decoded)  
  }  

  service(): SymmetricKey|undefined {  
    return this.sk  
  }  

  read(): SymmetricKey|undefined  {  
    return this.rk  
  }  

  defined(): boolean {  
    return this.sk !== null  
  }  

  canRead(): boolean {  
    return this.rk !== null  
  }  

  toBytes(): Uint8Array {  
    if (this.rk  && this.sk) {  
      return new Uint8Array([...this.sk.bytes(), ...this.rk.bytes()])  
    } else if (this.sk ) {  
      return this.sk.bytes()  
    } else {  
      return new Uint8Array(0)  
    }  
  }  

  toString(): string {  
    return base32.encode(this.toBytes())  
  }  


}