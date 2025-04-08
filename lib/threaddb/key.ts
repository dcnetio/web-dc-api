 

import { base32 } from 'multiformats/bases/base32'  
import { secretbox, randomBytes } from 'tweetnacl'  
import { symKeyFromBytes } from '../dc-key/keyManager';
import { SymKey } from "../threaddb/core/core";
import type { PublicKey,PrivateKey } from "@libp2p/interface"; 


export class SymmetricKey {  
  static readonly keyBytes: number = secretbox.keyLength  
  private key: Uint8Array  

  private constructor(key: Uint8Array) {  
    this.key = key  
  }  


  static new(): SymmetricKey {  
    const key = randomBytes(SymmetricKey.keyBytes)  
    return new SymmetricKey(key)  
  }  

  static fromBytes(bytes: Uint8Array): SymmetricKey {  
    if (bytes.length !== SymmetricKey.keyBytes) {  
      throw new Error('invalid key length')  
    }  
    return new SymmetricKey(bytes)  
  }  

  toBytes(): Uint8Array {  
    return this.key  
  }  

  encrypt(data: Uint8Array): Uint8Array {  
    const nonce = randomBytes(secretbox.nonceLength)  
    const box = secretbox(data, nonce, this.key)  
    const encrypted = new Uint8Array(nonce.length + box.length)  
    encrypted.set(nonce)  
    encrypted.set(box, nonce.length)  
    return encrypted  
  }  

  decrypt(encrypted: Uint8Array): Uint8Array {  
    const nonce = encrypted.slice(0, secretbox.nonceLength)  
    const box = encrypted.slice(secretbox.nonceLength)  
    const decrypted = secretbox.open(box, nonce, this.key)  
    if (!decrypted) {  
      throw new Error('decryption failed')  
    }  
    return decrypted  
  }  

  async toSymKey(): Promise<SymKey> {
    const symKey =  await symKeyFromBytes(this.key);
    return symKey
  }

  static fromSymKey(symKey: SymKey): SymmetricKey {
    return new SymmetricKey(symKey.raw)
  }
  static fromString(s: string): SymmetricKey {
    const decoded = base32.decode(s)  
    return SymmetricKey.fromBytes(decoded)  
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
      return new Uint8Array([...this.sk.toBytes(), ...this.rk.toBytes()])  
    } else if (this.sk ) {  
      return this.sk.toBytes()  
    } else {  
      return new Uint8Array(0)  
    }  
  }  

  toString(): string {  
    return base32.encode(this.toBytes())  
  }  


}
