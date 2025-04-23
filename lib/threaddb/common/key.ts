import * as crypto from 'crypto';
import { base32 } from 'multiformats/bases/base32';
import { SymKey } from '../core/core';
import { symKeyFromBytes } from '../../dc-key/keyManager';
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import * as JsCrypto from "jscrypto/es6";
const { Word32Array, AES, pad, mode, Base64 } = JsCrypto;

// Constants
const NonceBytes = 12;
const TagBytes = 16;
const KeyBytes = 32;

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
    const rawBytes = crypto.randomBytes(KeyBytes);
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

  /**
   * Encrypt performs AES-256 GCM encryption on plaintext
   */
  encrypt(plaintext: Uint8Array): Uint8Array {
    // Generate a random nonce
    const nonce = crypto.randomBytes(NonceBytes);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      'aes-256-gcm', 
      this._raw.slice(0, KeyBytes), 
      nonce
    );
    
    // Encrypt the data
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(plaintext)),
      cipher.final()
    ]);
    
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    
    // Combine nonce + encrypted data + auth tag
    const result = new Uint8Array(nonce.length + encrypted.length + authTag.length);
    result.set(nonce);
    result.set(encrypted, nonce.length);
    result.set(authTag, nonce.length + encrypted.length);
    
    return result;
  }

  /**
   * Decrypt uses key to perform AES-256 GCM decryption on ciphertext
   */
  async decrypt(encryptBuffer: Uint8Array): Promise<Uint8Array> {
  //   if (ciphertext.length < NonceBytes) {
  //     throw new CipherTextError();
  //   }
    
  //   // Extract the nonce, ciphertext and auth tag
  //   const nonce = ciphertext.slice(0, NonceBytes);
  //    ciphertext = ciphertext.slice(NonceBytes); 
  
    
  //   try {
  //     // Create decipher
  //     const key = await window.crypto.subtle.importKey(  
  //       "raw",  
  //       this._raw,  
  //       {  
  //         name: "AES-GCM",  
  //         length: 256  
  //       },  
  //       false,  
  //       ["decrypt"]  
  //     );  
  //      // 4. 尝试不同的解密配置  
  //     const configs = [  
  //       { tagLength: 128, name: "标准模式" },  
  //       { tagLength: 96, name: "96位标签模式" },  
  //       { tagLength: 64, name: "64位标签模式" }  
  //     ];  

  //     for (const config of configs) {  
  //       try {   
  //         const decrypted = await window.crypto.subtle.decrypt(  
  //           {  
  //             name: "AES-GCM",  
  //             iv: nonce,  
  //             tagLength: config.tagLength  
  //           },  
  //           key,  
  //           ciphertext  
  //         );  
  //         // 解密成功  
  //         const result = new Uint8Array(decrypted);  
  //         return result;  
  //       } catch (e: any) {  
  //           console.log(`${config.name} 失败:`, e.message);  
  //           continue;  
  //       } 
  //     }  
  //     throw new Error('decrypt failed');  
  //   } catch (err) {
  //     throw new Error(`Decryption failed: ${err instanceof Error ? err.message : String(err)}`);
  //   }
  // }
   if (encryptBuffer.length <= 28) {
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
    const key = new Word32Array(this._raw);
    const decrypted = AES.decrypt(cipherText.toString(Base64), key, {
      iv: iv,
      padding: pad.NoPadding,
      mode: mode.GCM,
      kdfSalt: kdfSalt,
    });
    return decrypted.toUint8Array();
}
}





export type LogKey = PrivateKey | PublicKey 

export class Key {  
  private sk?: SymmetricKey 
  private rk?: SymmetricKey

  constructor(sk: SymmetricKey , rk?: SymmetricKey ) {  
    this.sk = sk  
    this.rk = rk  
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