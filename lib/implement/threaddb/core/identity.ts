// thread.ts   
import { keys } from "@libp2p/crypto";
import  { Ed25519PubKey, Ed25519PrivKey }  from '../../../dc-key/ed25519';
import {ed25519PublicKeyToCryptoKey,ed25519PrivateKeyToCryptoKey} from '../../../dc-key/keyManager'
import { SignJWT, jwtVerify, type JWTPayload, importPKCS8, exportJWK } from 'jose' 
import { base32 } from 'multiformats/bases/base32' 
import { jwtDecode } from 'jwt-decode'
import { Ed25519PrivateKey } from "@libp2p/interface";

// ==================== 核心接口 ====================  
export interface Identity {  
  sign(data: Uint8Array): Promise<Uint8Array>  
  getPublic(): Ed25519PubKey  
  decrypt(data: Uint8Array): Promise<Uint8Array>  
  equals(other: Identity): boolean  
}  


// ==================== Ed25519 实现 ====================  
export class Ed25519Identity implements Identity {  
  private constructor(  
    public readonly privateKey: Ed25519PrivKey,  
    public readonly publicKey: Ed25519PubKey  
  ) {}  

  static async create(): Promise<Ed25519Identity> {  
    const privateKey = await keys.generateKeyPair('Ed25519')  
    const ed25519PrivateKey =new Ed25519PrivKey(privateKey.raw) 
    const publicKey = ed25519PrivateKey.publicKey
    return new Ed25519Identity(ed25519PrivateKey, publicKey)  
  }  

  async sign(data: Uint8Array): Promise<Uint8Array> {  
    return this.privateKey.sign(data) 
  }  

  getPublic(): Ed25519PubKey {  
    return this.publicKey
  }  

  async decrypt(data: Uint8Array): Promise<Uint8Array> {  
    return this.privateKey.decrypt(data)
  }  

  equals(other: Identity): boolean {  
    return other instanceof Ed25519Identity &&   
      this.publicKey.equals(other.publicKey) 
  }  
}  





/**  
 * 将 CryptoKey 转换为 PKCS#8 格式字符串  
 * 安全提示：仅在需要导出私钥时使用  
 */  
export async function exportPrivateKey(key: CryptoKey): Promise<string> {  
  const exported = await crypto.subtle.exportKey('pkcs8', key)  
  return base32.encode(new Uint8Array(exported))  
}  


// ==================== JWT 令牌处理 ====================  
export class ThreadToken {  
  constructor(readonly value: string) {}  

  static async issue(issuer: Ed25519Identity, pubKey: Ed25519PubKey): Promise<ThreadToken> {  
    const privateKey = await ed25519PrivateKeyToCryptoKey(issuer.privateKey.raw)
    return new ThreadToken(  
      await new SignJWT({  
        sub: pubKey.toString(),  
        iss: issuer.getPublic().toString()  
      } as JWTPayload)  
      .setProtectedHeader({ alg: 'EdDSA' })  
      .setIssuedAt()  
      .sign(privateKey)  
    )  
  }  

  // PubKey returns the public key encoded in the token.

async pubKey(): Promise<Ed25519PubKey|undefined > {
  if (this.value) {
    try {
      // Parse token without verification
      const decoded = jwtDecode<{ sub: string }>(this.value);
      
      if (!decoded.sub) {
        throw new Error('Token subject is missing');
      }
      // Create public key from subject
      try {
        // Assuming subject contains the base32-encoded public key
        return Ed25519PubKey.unmarshalString(decoded.sub);
      } catch (err) {
        throw new Error(`Failed to unmarshal public key: ${err instanceof Error ? err.message : String(err)}`);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Invalid token')) {
        throw new Error('Invalid token format');
      } else {
        throw new Error('Token not found or invalid');
      }
    }
  }
}


  async validate(issuerPrivateKey: Ed25519PrivateKey): Promise<Ed25519PubKey |undefined> {  
    try {  
      const privateKey = await ed25519PrivateKeyToCryptoKey(issuerPrivateKey.raw, 'raw') 
      const { payload } = await jwtVerify(this.value, privateKey)  
      return this.parsePubKey(payload.sub!)  
    } catch {  
      return   
    }  
  }  

  private parsePubKey(str: string): Ed25519PubKey {  
    return new Ed25519PubKey(base32.decode(str))  
  }  

  get defined(): boolean {  
    return this.value.length > 0  
  }  
} 


// ==================== 浏览器上下文管理 ====================  
interface ThreadContext {  
  headers: Headers  
}  

const contextStack: ThreadContext[] = [{  
  headers: new Headers()  
}]  

export function withContext<T>(ctx: ThreadContext, fn: () => T): T {  
  contextStack.push(ctx)  
  try {  
    return fn()  
  } finally {  
    contextStack.pop()  
  }  
}  

export function currentContext(): ThreadContext {  
  return contextStack[contextStack.length - 1]  
}  

// ==================== 凭证处理 ====================  
export function createAuthHeader(token?: ThreadToken): Headers {  
  const headers = new Headers()  
  if (token?.defined) {  
    headers.set('Authorization', `Bearer ${token.value}`)  
  }  
  return headers  
}  

// ==================== 错误类型 ====================  
export class AuthError extends Error {  
  constructor(  
    readonly code: 'MISSING_TOKEN' | 'INVALID_TOKEN',  
    message?: string  
  ) {  
    super(message)  
  }  
}  