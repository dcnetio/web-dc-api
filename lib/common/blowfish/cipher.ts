  
import {p, s0, s1, s2, s3} from './const';
import {encryptBlock, decryptBlock, expandKey,expandKeyWithSalt} from './block';

// 常量定义  
export const BlockSize = 8;  


// 错误类  
export class KeySizeError extends Error {  
    constructor(size: number) {  
        super(`crypto/blowfish: invalid key size ${size}`);  
        this.name = 'KeySizeError';  
    }  
}  

export class Cipher {  
     p: Uint32Array;  
     s0: Uint32Array;  
     s1: Uint32Array;  
     s2: Uint32Array;  
     s3: Uint32Array;  

    constructor() {  
        this.p = new Uint32Array(18);  
        this.s0 = new Uint32Array(256);  
        this.s1 = new Uint32Array(256);  
        this.s2 = new Uint32Array(256);  
        this.s3 = new Uint32Array(256);  
    }  

    // 返回块大小  
    public blockSize(): number {  
        return BlockSize;  
    }  

    // 加密方法  
    public encrypt(dst: Uint8Array, src: Uint8Array): void {  
        if (src.length !== BlockSize || dst.length !== BlockSize) {  
            throw new Error('Invalid buffer size');  
        }  

        let l = (src[0]! << 24) | (src[1]! << 16) | (src[2]! << 8) | src[3]!;  
        let r = (src[4]! << 24) | (src[5]! << 16) | (src[6]! << 8) | src[7]!;  

        [l, r] = encryptBlock(l >>> 0, r >>> 0, this);  

        dst[0] = (l >>> 24) & 0xff;  
        dst[1] = (l >>> 16) & 0xff;  
        dst[2] = (l >>> 8) & 0xff;  
        dst[3] = l & 0xff;  
        dst[4] = (r >>> 24) & 0xff;  
        dst[5] = (r >>> 16) & 0xff;  
        dst[6] = (r >>> 8) & 0xff;  
        dst[7] = r & 0xff;  
    }  

    // 解密方法  
    public decrypt(dst: Uint8Array, src: Uint8Array): void {  
        if (src.length !== BlockSize || dst.length !== BlockSize) {  
            throw new Error('Invalid buffer size');  
        }  

        let l = (src[0]! << 24) | (src[1]! << 16) | (src[2]! << 8) | src[3]!;  
        let r = (src[4]! << 24) | (src[5]! << 16) | (src[6]! << 8) | src[7]!;  

        [l, r] = decryptBlock(l >>> 0, r >>> 0, this);  

        dst[0] = (l >>> 24) & 0xff;  
        dst[1] = (l >>> 16) & 0xff;  
        dst[2] = (l >>> 8) & 0xff;  
        dst[3] = l & 0xff;  
        dst[4] = (r >>> 24) & 0xff;  
        dst[5] = (r >>> 16) & 0xff;  
        dst[6] = (r >>> 8) & 0xff;  
        dst[7] = r & 0xff;  
    }  
}  

// 初始化 Cipher 实例  
function initCipher(c: Cipher): void {  
    // 使用 TypedArray.set() 进行数组拷贝  
    c.p.set(p);  
    c.s0.set(s0);  
    c.s1.set(s1);  
    c.s2.set(s2);  
    c.s3.set(s3);  
}  

// 创建新的 Cipher 实例  
export function newCipher(key: Uint8Array): Cipher {  
    if (key.length < 1 || key.length > 56) {  
        throw new KeySizeError(key.length);  
    }  

    const result = new Cipher();  
    initCipher(result);  
    expandKey(key, result);  
    return result;  
}  

// 创建带盐值的 Cipher 实例  
export function newSaltedCipher(key: Uint8Array, salt: Uint8Array): Cipher {  
    if (salt.length === 0) {  
        return newCipher(key);  
    }  

    if (key.length < 1) {  
        throw new KeySizeError(key.length);  
    }  

    const result = new Cipher();  
    initCipher(result);  
    expandKeyWithSalt(key, salt, result);  
    return result;  
}  

// 使用示例：  
function example(): void {  
    // 创建密钥  
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);  
    
    try {  
        // 创建 cipher 实例  
        const cipher = newCipher(key);  
        
        // 准备要加密的数据  
        const src = new Uint8Array(BlockSize);  
        const dst = new Uint8Array(BlockSize);  
        
        // 加密  
        cipher.encrypt(dst, src);  
        
        // 解密  
        const decrypted = new Uint8Array(BlockSize);  
        cipher.decrypt(decrypted, dst);  
    } catch (error) {  
        if (error instanceof KeySizeError) {  
            console.error('Invalid key size:', error.message);  
        } else {  
            console.error('Encryption error:', error);  
        }  
    }  
}