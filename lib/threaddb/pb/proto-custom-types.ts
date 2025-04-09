// proto-custom-types.ts  
import { Multiaddr,multiaddr } from '@multiformats/multiaddr'  
import { CID } from 'multiformats/cid'  
import  { keys } from '@libp2p/crypto'
import type { PrivateKey, PublicKey, KeyType, RSAPrivateKey, Secp256k1PrivateKey, Ed25519PrivateKey, Secp256k1PublicKey, Ed25519PublicKey } from '@libp2p/interface'
import {  Key} from '../common/key'
import { ThreadID } from '@textile/threads-id';
import { peerIdFromMultihash, peerIdFromString } from '@libp2p/peer-id'


// Base Types ================================================================  
type BrandedString<T extends string> = string & { readonly __brand: T }  

export type ProtoPeerID = BrandedString<'ProtoPeerID'>  
export type ProtoThreadID = BrandedString<'ProtoThreadID'>  
export type ProtoKey = BrandedString<'ProtoKey'>

// Peer ID ===================================================================  
export class PeerIDConverter {  
  static fromBytes(ibytes: Uint8Array): ProtoPeerID {  
     const digest = ibytes;  
     const size = digest.length;  
     const bytes = new Uint8Array(2 + size);  
     bytes[0] = 0x00; // identity hash code  
     bytes[1] = size;  // size in varint  
     bytes.set(digest, 2);   
    const peerID = peerIdFromMultihash({  
        code: 0,  
        size,  
        digest,  
        bytes  
    }); 
    if (peerID == null) {
      throw new Error('Invalid Peer ID')
    }
    const peerIDString = peerID.toString()
    return peerIDString as ProtoPeerID
  }  

  static toBytes(id: ProtoPeerID): Uint8Array {  
    const peerID = peerIdFromString(id)
    if (peerID == null) {
      throw new Error('Invalid Peer ID')
    }
    const peerIDBytes = peerID.toMultihash().bytes
    return peerIDBytes 
  }  

}  

// Multiaddr =================================================================  
export class MultiaddrConverter {  
  static fromBytes(bytes: Uint8Array): Multiaddr {  
    try {  
      return multiaddr(bytes)  
    } catch {  
      throw new Error('Invalid multiaddr bytes')  
    }  
  }  

  static toBytes(addr: Multiaddr): Uint8Array {  
    return addr.bytes  
  }  

  static createTest(): Multiaddr {  
    return multiaddr('/ip4/127.0.0.1/tcp/1234')  
  }  
}  

// CID =======================================================================  
export class CidConverter {  
  static fromBytes(bytes: Uint8Array): CID {  
    try {  
      return CID.decode(bytes)  
    } catch {  
      return CID.parse('bafkqaaa') // Undefined CID  
    }  
  }  

  static toBytes(c: CID): Uint8Array {  
    return c.bytes  
  }  
}  

// Thread ID =================================================================  
export class ThreadIDConverter {  
  static fromBytes(bytes: Uint8Array): ProtoThreadID {  
    const id = ThreadID.fromBytes(bytes).toString()
   
    return id as ProtoThreadID  
  }  

  static toBytes(id: ProtoThreadID): Uint8Array {  
    const threadID = ThreadID.fromString(id)
    return threadID.toBytes()
  }  
}  

// Cryptographic Keys ========================================================  
export class KeyConverter {  
 

  // Public Key  
  static async publicFromBytes(bytes: Uint8Array): Promise<PublicKey> {  
    try {  
      return  keys.publicKeyFromProtobuf(bytes) 
    } catch {  
      throw new Error('Invalid public key')  
    }  
  }  

  // Private Key  
  static async privateFromBytes(bytes: Uint8Array): Promise<PrivateKey> {  
    try {  
      return  keys.privateKeyFromProtobuf(bytes)
    } catch {  
      throw new Error('Invalid private key')  
    }  
  }  
  static async toBytes(key: PrivateKey): Promise<Uint8Array> {
    try {  
      return  keys.privateKeyToProtobuf(key)
    } catch {  
      throw new Error('Invalid private key')  
    }  
  }

  static async publicToBytes(key: PublicKey): Promise<Uint8Array> {
    try {  
      return  keys.publicKeyToProtobuf(key)
    } catch {  
      throw new Error('Invalid public key')  
    }  
  }
}  


// ProtoKey is a custom type used to serialize and deserialize raw keys into the symmetric.Key type, and back.

export class ProtoKeyConverter {
  static fromBytes(bytes: Uint8Array): ProtoKey {  
   const key = Key.fromBytes(bytes)
    return key.toString() as ProtoKey 
  }  

  static toBytes(pkey: ProtoKey): Uint8Array {  
    const key = Key.fromString(pkey)
    return key.toBytes()
  } 
}


// JSON Utilities ============================================================  
export const json = {  
  parseBytes: (json: string): Uint8Array => {  
    const arr = JSON.parse(json)  
    if (!Array.isArray(arr)) throw new Error('Invalid JSON array')  
    return new Uint8Array(arr)  
  },  
  stringifyBytes: (bytes: Uint8Array): string =>   
    JSON.stringify(Array.from(bytes))  
}  

// Example Usage =============================================================  
/*  
// 在另一个文件中导入使用：  
import {   
  PeerIDConverter,  
  MultiaddrConverter,  
  CidConverter,  
  ThreadIDConverter,  
  KeyConverter,  
  json  
} from './proto-custom-types'  

// 转换PeerID  
const peerBytes = new TextEncoder().encode('QmPNgojgxaxfLh2dfJXPs6f8qHgLueL5t7Yzoe6qkHkJXZ')  
const peerId = PeerIDConverter.fromBytes(peerBytes)  
const restoredBytes = PeerIDConverter.toBytes(peerId)  
*/  