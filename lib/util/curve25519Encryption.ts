
import { randomBytes } from '@stablelib/random';  
import { box } from 'tweetnacl';  
import { BigInteger } from 'jsbn';
// import { webcrypto } from 'crypto'; 

export class Encryption {  
    private static readonly NONCE_LENGTH = 24;  
    private static readonly PUBLIC_KEY_LENGTH = 32;  
    private static readonly MAC_LENGTH = 16;  

     // Curve25519的素数  
     private static readonly CURVE25519_P = new BigInteger("57896044618658097711785492504343953926634992332820282019728792003956564819949");  

     private static toHex(bytes: Uint8Array): string {  
         return Array.from(bytes)  
             .map(b => b.toString(16).padStart(2, '0'))  
             .join('');  
     }  
 
     // 将字节数组转换为BigInteger  
     private static bytesToBigInt(bytes: Uint8Array): BigInteger {  
         let hex = Array.from(bytes)  
             .map(b => b.toString(16).padStart(2, '0'))  
             .join('');  
         return new BigInteger(hex, 16);  
     }  
 
     // 将BigInteger转换为固定长度的字节数组  
     private static bigIntToBytes(bn: BigInteger, length: number): Uint8Array {  
         const hex = bn.toString(16).padStart(length * 2, '0');  
         const bytes = new Uint8Array(length);  
         for (let i = 0; i < length; i++) {  
             bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);  
         }  
         return bytes;  
     }  


// 扩展欧几里得算法计算模逆  
private static extendedEuclidean(a: BigInteger, b: BigInteger): [BigInteger, BigInteger, BigInteger] {  
    if (b.equals(BigInteger.ZERO)) {  
        return [a, new BigInteger("1"), new BigInteger("0")];  
    }  

    const [gcd, x1, y1] = this.extendedEuclidean(b, a.mod(b));  
    const x = y1;  
    const y = x1.subtract(a.divide(b).multiply(y1));  
    return [gcd, x, y];  
}  

// 安全的模逆计算  
private static safeModInverse(a: BigInteger, m: BigInteger): BigInteger {  
    // 确保a为正数  
    let positiveA = a.mod(m);  
    if (positiveA.compareTo(BigInteger.ZERO) < 0) {  
        positiveA = positiveA.add(m);  
    }  

    // 计算GCD和模逆  
    const [gcd, x] = this.extendedEuclidean(positiveA, m);  

    // 检查是否存在模逆  
    if (!gcd.equals(new BigInteger("1"))) {  
        throw new Error('Modular inverse does not exist');  
    }  

    // 确保结果为正数  
    let result = x.mod(m);  
    if (result.compareTo(BigInteger.ZERO) < 0) {  
        result = result.add(m);  
    }  
    return result;  
}  

// 修改转换函数中的模逆计算  
private static ed25519PublicKeyToCurve25519(publicKey: Uint8Array): Uint8Array {  
   
    // 1. 转换为big endian  
    const bigEndianY = new Uint8Array(32);  
    for (let i = 0; i < 32; i++) {  
        bigEndianY[31 - i] = publicKey[i];  
    }  
    
    // 2. 清除最高位  
    bigEndianY[0] &= 0b0111_1111;  

    // 3. 转换为BigInteger并计算 u = (1 + y) / (1 - y)  
    const y = this.bytesToBigInt(bigEndianY);  
    const one = new BigInteger("1");  
    
    // 计算分子 (1 + y)  
    const numerator = one.add(y);  
    
    // 计算分母 (1 - y)  
    const denominator = one.subtract(y);  
    
    try {  
        // 使用新的安全模逆计算  
        const denominatorInv = this.safeModInverse(denominator, this.CURVE25519_P);  
        
        // 计算 u  
        let u = numerator.multiply(denominatorInv).mod(this.CURVE25519_P);  

        // 4. 转换回little endian  
        const result = this.bigIntToBytes(u, 32);  
        const littleEndianResult = new Uint8Array(32);  
        for (let i = 0; i < 32; i++) {  
            littleEndianResult[i] = result[31 - i];  
        }  

        return littleEndianResult;  
        
    } catch (error) {  
        console.error('Error during conversion:', error);  
        throw error;  
    }  
} 


    static async encrypt(recipientPublicKey: Uint8Array, message: Uint8Array): Promise<Uint8Array> {  
        try {  
            if (recipientPublicKey.length !== this.PUBLIC_KEY_LENGTH) {  
                throw new Error(`Invalid public key length: ${recipientPublicKey.length}`);  
            }  

            const curve25519PublicKey = Encryption.ed25519PublicKeyToCurve25519(recipientPublicKey) //ed25519.getPublicKey(recipientPublicKey);  
            const ephemeralKeyPair = box.keyPair();  
            const nonce = randomBytes(this.NONCE_LENGTH);  

            const encrypted = box(  
                message,  
                nonce,  
                curve25519PublicKey,  
                ephemeralKeyPair.secretKey  
            );  

            if (!encrypted) {  
                throw new Error('Encryption failed');  
            }  

            const result = new Uint8Array(  
                this.NONCE_LENGTH +  
                this.PUBLIC_KEY_LENGTH +  
                encrypted.length  
            );  

            let offset = 0;  
            result.set(nonce, offset);  
            offset += this.NONCE_LENGTH;  
            result.set(ephemeralKeyPair.publicKey, offset);  
            offset += this.PUBLIC_KEY_LENGTH;  
            result.set(encrypted, offset);  

            return result;  

        } catch (error: any) {  
            throw new Error(`Encryption failed: ${error.message}`);  
        }  
    }  

    static async encryptWithDebug(recipientPublicKey: Uint8Array, message: Uint8Array): Promise<Uint8Array> {  
        try {  
            console.log('\n=== Encryption Debug Information ===');  
            console.log('Input Data:');  
            console.log('- Message:', new TextDecoder().decode(message));  
            console.log('- Message (hex):', this.toHex(message));  
            console.log('- Recipient Public Key:', this.toHex(recipientPublicKey));  
            
            if (recipientPublicKey.length !== this.PUBLIC_KEY_LENGTH) {  
                throw new Error(`Invalid public key length: ${recipientPublicKey.length}`);  
            }  

            const curve25519PublicKey = Encryption.ed25519PublicKeyToCurve25519(recipientPublicKey); 
            console.log('\nKey Conversion:');  
            console.log('- Ed25519 Public Key:', this.toHex(recipientPublicKey));  
            console.log('- Curve25519 Public Key:', this.toHex(curve25519PublicKey));  

            const ephemeralKeyPair = box.keyPair();  
            console.log('\nEphemeral Key Pair:');  
            console.log('- Public Key:', this.toHex(ephemeralKeyPair.publicKey));  
            console.log('- Secret Key:', this.toHex(ephemeralKeyPair.secretKey));  

            const nonce = randomBytes(this.NONCE_LENGTH);  
            console.log('\nNonce:');  
            console.log('- Value:', this.toHex(nonce));  
            console.log('- Length:', nonce.length);  

            const encrypted = box(  
                message,  
                nonce,  
                curve25519PublicKey,  
                ephemeralKeyPair.secretKey  
            );  

            if (!encrypted) {  
                throw new Error('Encryption failed');  
            }  

            console.log('\nEncrypted Data:');  
            console.log('- Length:', encrypted.length);  
            console.log('- Value:', this.toHex(encrypted));  

            const result = new Uint8Array(  
                this.NONCE_LENGTH +  
                this.PUBLIC_KEY_LENGTH +  
                encrypted.length  
            );  

            let offset = 0;  
            result.set(nonce, offset);  
            offset += this.NONCE_LENGTH;  
            result.set(ephemeralKeyPair.publicKey, offset);  
            offset += this.PUBLIC_KEY_LENGTH;  
            result.set(encrypted, offset);  

            console.log('\nFinal Result:');  
            console.log('- Total Length:', result.length);  
            console.log('- Structure:');  
            console.log(`  * Nonce (${this.NONCE_LENGTH} bytes):`,   
                this.toHex(result.slice(0, this.NONCE_LENGTH)));  
            console.log(`  * Ephemeral Public Key (${this.PUBLIC_KEY_LENGTH} bytes):`,   
                this.toHex(result.slice(this.NONCE_LENGTH, this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH)));  
            console.log(`  * Encrypted Data (${encrypted.length} bytes):`,   
                this.toHex(result.slice(this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH)));  
            console.log('- Complete Data:', this.toHex(result));  

            return result;  

        } catch (error: any) {  
            console.error('Encryption Debug Error:', error);  
            throw error;  
        }  
    }  

   //使用 Web Crypto API 实现 SHA-512  
   private static async sha512Hash(data: Uint8Array): Promise<Uint8Array> {  
    try {  
        // 优先使用 Web Crypto API  
        if (typeof window !== 'undefined' && window.crypto) {  
            const buffer = await window.crypto.subtle.digest('SHA-512', data);  
            return new Uint8Array(buffer);  
        }   
        // // Node.js 环境  
        // else if (typeof webcrypto !== 'undefined') {  
        //     const buffer = await webcrypto.subtle.digest('SHA-512', data);  
        //     return new Uint8Array(buffer);  
        // }  
        throw new Error('No crypto implementation available');  
    } catch (error) {  
        console.error('SHA-512 hash failed:', error);  
        throw error;  
    }  
}  

 
private static async ed25519PrivateKeyToCurve25519(privateKey: Uint8Array): Promise<Uint8Array> {  
    
    // 使用新的 SHA-512 实现  
    const h = await this.sha512Hash(privateKey.slice(0, 32));  
 

    // 清除特定位  
    const result = new Uint8Array(h);  
    result[0] &= 248;  // Clear bits 0,1,2  
    result[31] &= 127; // Clear bit 7  
    result[31] |= 64;  // Set bit 6  
    
    // 只使用前32字节  
    const curve25519PrivateKey = result.slice(0, 32);  
    
    return curve25519PrivateKey;  
}  

 
static async decrypt(  
    recipientPrivateKey: Uint8Array,   
    encryptedData: Uint8Array,   
    debug: boolean = false  
): Promise<Uint8Array> {  
    try {  
        if (debug) {  
            console.log('\n=== Starting Decryption Process ===');  
            console.log('Input Private Key:', this.toHex(recipientPrivateKey));  
            console.log('Encrypted Data Length:', encryptedData.length);  
            console.log('Encrypted Data:', this.toHex(encryptedData));  
        }  

        // 验证输入数据长度  
        const minLength = this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH + this.MAC_LENGTH;  
        if (encryptedData.length < minLength) {  
            throw new Error(  
                `Invalid encrypted data length: ${encryptedData.length} < ${minLength}`  
            );  
        }  

        // 解析加密数据的各个部分  
        const nonce = encryptedData.slice(0, this.NONCE_LENGTH);  
        const ephemeralPublicKey = encryptedData.slice(  
            this.NONCE_LENGTH,  
            this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH  
        );  
        const ciphertext = encryptedData.slice(  
            this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH  
        );  

        if (debug) {  
            console.log('\n--- Parsed Components ---');  
            console.log('Nonce:', this.toHex(nonce));  
            console.log('Ephemeral Public Key:', this.toHex(ephemeralPublicKey));  
            console.log('Ciphertext:', this.toHex(ciphertext));  
        }  

        // 转换私钥（现在是异步的）  
        const curve25519PrivateKey = await this.ed25519PrivateKeyToCurve25519(recipientPrivateKey);  
        
        if (debug) {  
            console.log('\n--- Key Conversion ---');  
            console.log('Original Ed25519 Private Key:', this.toHex(recipientPrivateKey));  
            console.log('Converted Curve25519 Private Key:', this.toHex(curve25519PrivateKey));  
        }  

        // 计算共享密钥  
        const sharedKey = box.before(ephemeralPublicKey, curve25519PrivateKey);  
        if (!sharedKey) {  
            throw new Error('Failed to compute shared key');  
        }  

        if (debug) {  
            console.log('\n--- Shared Key Computation ---');  
            console.log('Computed Shared Key:', this.toHex(sharedKey));  
        }  

        // 解密数据  
        const decrypted = box.open.after(ciphertext, nonce, sharedKey);  
        if (!decrypted) {  
            throw new Error('Decryption failed - invalid MAC');  
        }  

        if (debug) {  
            console.log('\n--- Decryption Result ---');  
            console.log('Decrypted Data Length:', decrypted.length);  
            console.log('Decrypted Data:', this.toHex(decrypted));  
            try {  
                console.log('Decrypted Text:', new TextDecoder().decode(decrypted));  
            } catch (e) {  
                console.log('(Binary data - could not decode as text)');  
            }  
        }  

        return decrypted;  

    } catch (error: any) {  
        console.error('Decryption error:', error);  
        throw new Error(`Decryption failed: ${error.message}`);  
    }  
} 

    // 新增：解密调试辅助方法  
    static async debugDecryptionProcess(  
        recipientPrivateKey: Uint8Array,  
        encryptedData: Uint8Array  
    ): Promise<void> {  
        console.log('\n======= Decryption Debug Process =======');  
        
        // 1. 输入验证  
        console.log('\n=== Input Validation ===');  
        console.log('Private Key Length:', recipientPrivateKey.length);  
        console.log('Encrypted Data Length:', encryptedData.length);  
        
        // 2. 数据结构分析  
        const structure = {  
            nonce: encryptedData.slice(0, this.NONCE_LENGTH),  
            ephemeralPublicKey: encryptedData.slice(  
                this.NONCE_LENGTH,  
                this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH  
            ),  
            ciphertext: encryptedData.slice(  
                this.NONCE_LENGTH + this.PUBLIC_KEY_LENGTH  
            )  
        };  

        console.log('\n=== Data Structure Analysis ===');  
        Object.entries(structure).forEach(([key, value]) => {  
            console.log(`${key}:`);  
            console.log(`  Length: ${value.length}`);  
            console.log(`  Hex: ${this.toHex(value)}`);  
        });  

        // 3. 私钥转换过程  
        console.log('\n=== Private Key Conversion ===');  
        try {  
            const curve25519PrivateKey = await this.ed25519PrivateKeyToCurve25519(recipientPrivateKey);  
            console.log('Conversion successful');  
            console.log('Converted Key:', this.toHex(curve25519PrivateKey));  
        } catch (error) {  
            console.error('Private key conversion failed:', error);  
            return;  
        }  

        // 4. 尝试解密  
        console.log('\n=== Attempting Decryption ===');  
        try {  
            const decrypted = await this.decrypt(recipientPrivateKey, encryptedData, false);  
            console.log('Decryption successful');  
            console.log('Decrypted length:', decrypted.length);  
            console.log('Decrypted hex:', this.toHex(decrypted));  
            try {  
                const text = new TextDecoder().decode(decrypted);  
                console.log('Decrypted as text:', text);  
            } catch (e) {  
                console.log('(Data is not valid UTF-8 text)');  
            }  
        } catch (error) {  
            console.error('Decryption failed:', error);  
        }  
    }
}