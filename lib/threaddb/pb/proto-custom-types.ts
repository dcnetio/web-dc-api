// proto-custom-types.ts  
import { Multiaddr,multiaddr } from '@multiformats/multiaddr'  
import { CID } from 'multiformats/cid'  
import  { keys } from '@libp2p/crypto'
import type { PrivateKey, PublicKey, KeyType, RSAPrivateKey, Secp256k1PrivateKey, Ed25519PrivateKey, Secp256k1PublicKey, Ed25519PublicKey } from '@libp2p/interface'


// Base Types ================================================================  
type BrandedString<T extends string> = string & { readonly __brand: T }  

export type ProtoPeerID = BrandedString<'ProtoPeerID'>  
export type ProtoThreadID = BrandedString<'ProtoThreadID'>  

// Peer ID ===================================================================  
export class PeerIDConverter {  
  static fromBytes(bytes: Uint8Array): ProtoPeerID {  
    const id = new TextDecoder().decode(bytes)  
    if (!/^Qm[a-zA-Z0-9]{44}$/.test(id)) throw new Error('Invalid Peer ID')  
    return id as ProtoPeerID  
  }  

  static toBytes(id: ProtoPeerID): Uint8Array {  
    return new TextEncoder().encode(id)  
  }  

  static createTest(): ProtoPeerID {  
    return `Qm${Math.random().toString(36).substring(2, 46)}` as ProtoPeerID  
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

  static createTest(): CID {  
    return CID.parse('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi')  
  }  
}  

// Thread ID =================================================================  
export class ThreadIDConverter {  
  static fromBytes(bytes: Uint8Array): ProtoThreadID {  
    const hex = Array.from(bytes)  
      .map(b => b.toString(16).padStart(2, '0'))  
      .join('')  
    return `0x${hex}` as ProtoThreadID  
  }  

  static toBytes(id: ProtoThreadID): Uint8Array {  
    return Uint8Array.from(  
      id.substring(2).match(/../g)!.map(b => parseInt(b, 16))  
    )  
  }  
}  

// Cryptographic Keys ========================================================  
export class KeyConverter {  
  // Symmetric Key  
  static symmetricFromBytes(bytes: Uint8Array): Uint8Array {  
    if (bytes.length !== 32) throw new Error('Invalid key length')  
    return bytes  
  }  

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