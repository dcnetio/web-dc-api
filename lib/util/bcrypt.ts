/**  
 * bcrypt password hashing implementation for browsers  
 * Compatible with Go's bcrypt implementation  
 */  

// 导入Blowfish实现    
import { expandKey} from '../blowfish/block';
import {Cipher,newSaltedCipher,BlockSize} from '../blowfish/cipher';

// 常量定义  
export const MinCost = 4;  
export const MaxCost = 31;  
export const DefaultCost = 10;  

const majorVersion = '2';  
const minorVersion = 'a';  
const maxCryptedHashSize = 23;  

// Magic cipher data - 与Go实现保持一致  
const magicCipherData = new Uint8Array([  
    0x4f, 0x72, 0x70, 0x68,  
    0x65, 0x61, 0x6e, 0x42,  
    0x65, 0x68, 0x6f, 0x6c,  
    0x64, 0x65, 0x72, 0x53,  
    0x63, 0x72, 0x79, 0x44,  
    0x6f, 0x75, 0x62, 0x74,  
]);  

// bcrypt使用的特殊base64字母表  
const bcryptAlphabet = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  

// 类型定义  
interface Hashed {  
    hash: Uint8Array;  
    salt: Uint8Array;  
    cost: number;  
    major: string;  
    minor: string;  
}  

// 错误类  
export class InvalidCostError extends Error {  
    constructor(cost: number) {  
        super(`crypto/bcrypt: cost ${cost} is outside allowed range (${MinCost},${MaxCost})`);  
        this.name = 'InvalidCostError';  
    }  
}  

/**  
 * 自定义base64编码函数，匹配bcrypt的编码方式  
 */  
function base64Encode(data: Uint8Array): Uint8Array {  
    let output = '';  
    let i = 0;  
    
    while (i < data.length) {  
        let a = i < data.length ? data[i++] : 0;  
        let b = i < data.length ? data[i++] : 0;  
        let c = i < data.length ? data[i++] : 0;  
        
        const triple = (a << 16) + (b << 8) + c;  
        
        output += bcryptAlphabet[(triple >> 18) & 0x3F];  
        output += bcryptAlphabet[(triple >> 12) & 0x3F];  
        output += bcryptAlphabet[(triple >> 6) & 0x3F];  
        output += bcryptAlphabet[triple & 0x3F];  
    }  
    
    // 处理填充  
    const mod = data.length % 3;  
    if (mod === 1) {  
        output = output.slice(0, -2);  
    } else if (mod === 2) {  
        output = output.slice(0, -1);  
    }  
    
    return new TextEncoder().encode(output);  
}  

/**  
 * 自定义base64解码函数，匹配bcrypt的解码方式  
 */  
function base64Decode(data: Uint8Array): Uint8Array {  
    const input = new TextDecoder().decode(data);  
    const output = new Uint8Array(Math.floor(input.length * 3 / 4));  
    let outputIndex = 0;  
    
    const getBcryptValue = (char: string) => {  
        const index = bcryptAlphabet.indexOf(char);  
        if (index === -1) {  
            throw new Error('Invalid character in input');  
        }  
        return index;  
    };  
    
    for (let i = 0; i < input.length; i += 4) {  
        const a = getBcryptValue(input[i]);  
        const b = getBcryptValue(input[i + 1]);  
        const c = i + 2 < input.length ? getBcryptValue(input[i + 2]) : 0;  
        const d = i + 3 < input.length ? getBcryptValue(input[i + 3]) : 0;  
        
        const triple = (a << 18) | (b << 12) | (c << 6) | d;  
        
        output[outputIndex++] = (triple >> 16) & 0xFF;  
        if (i + 2 < input.length) output[outputIndex++] = (triple >> 8) & 0xFF;  
        if (i + 3 < input.length) output[outputIndex++] = triple & 0xFF;  
    }  
    
    return output.slice(0, outputIndex);  
}  

/**  
 * 检查cost值是否在允许范围内  
 */  
function checkCost(cost: number): void {  
    if (cost < MinCost || cost > MaxCost) {  
        throw new InvalidCostError(cost);  
    }  
}  

/**  
 * Blowfish加密设置  
 */  
async function expensiveBlowfishSetup(  
    key: Uint8Array,  
    cost: number,  
    salt: Uint8Array  
): Promise<Cipher> {  
    const csalt = base64Decode(salt);  
    const ckey = new Uint8Array([...key, 0]);  
    
    const cipher =  newSaltedCipher(ckey, csalt);  
    const rounds = 1 << cost;  
    for (let i = 0; i < rounds; i++) {  
        expandKey(ckey,cipher);  
        expandKey(csalt,cipher);  
    }  
    
    return cipher;  
}  

/**  
 * bcrypt核心加密函数  
 */  
async function bcrypt(  
    password: Uint8Array,  
    cost: number,  
    salt: Uint8Array  
): Promise<Uint8Array> {  
    const cipherData = new Uint8Array(magicCipherData);  
    
    const cipher = await expensiveBlowfishSetup(password, cost, salt);  
    
    for (let i = 0; i < 24; i += 8) {  
        for (let j = 0; j < 64; j++) {  
            const block = cipherData.slice(i, i + 8);  
            const destBlock  = new Uint8Array(BlockSize);
            cipher.encrypt(destBlock,block);  
            cipherData.set(destBlock, i);  
        }  
    }  
    return base64Encode(cipherData.slice(0, maxCryptedHashSize));  
}  

// 修改 generateFromPasswordWithSalt 函数返回完整的哈希信息  
export async function generateFromPasswordWithSalt(  
    password: Uint8Array,  
    cost: number,  
    unencodedSalt: Uint8Array  
): Promise<Hashed> {  
    if (unencodedSalt.length !== 16) {  
        throw new Error('Salt must be exactly 16 bytes');  
    }  
    
    if (cost < MinCost) {  
        cost = DefaultCost;  
    }  
    
    checkCost(cost);  
    
    const salt = base64Encode(unencodedSalt);  
    const hash = await bcrypt(password, cost, salt);  
    
    return {  
        hash,  
        salt: unencodedSalt,  
        cost,  
        major: majorVersion,  
        minor: minorVersion  
    };  
}  

// 辅助函数：将字符串转换为Uint8Array  
export function stringToBytes(str: string): Uint8Array {  
    return new TextEncoder().encode(str);  
}  

// 辅助函数：将Uint8Array转换为字符串  
export function bytesToString(bytes: Uint8Array): string {  
    return new TextDecoder().decode(bytes);  
}  

// 生成随机salt的辅助函数  
export function generateSalt(): Uint8Array {  
    return crypto.getRandomValues(new Uint8Array(16));  
}