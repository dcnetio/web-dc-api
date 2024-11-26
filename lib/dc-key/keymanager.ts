import { generateMnemonic, mnemonicToSeed, validateMnemonic,mnemonicToEntropy as bip39MnemonicToEntropy } from '@scure/bip39'  
import { wordlist } from '@scure/bip39/wordlists/english'  

import { ed25519 } from '@noble/curves/ed25519' 
import { pbkdf2 } from '@noble/hashes/pbkdf2'  
import { sha512 } from '@noble/hashes/sha512' 
import { HDKey } from '@scure/bip32'  
import  {  Ed25519PrivKey }  from './ed25519'




export const DERIVATION_PATHS = {  
    ETHEREUM: "m/44'/60'/0'/0/0",  
    BITCOIN: "m/44'/0'/0'/0/0",  
    FILECOIN: "m/44'/461'/0'/0/0",  
    POLKADOT: "m/44'/354'/0'/0'/0'",  
    SOLANA: "m/44'/501'/0'/0'",  
    COSMOS: "m/44'/118'/0'/0/0"  
} as const  

type ChainType = keyof typeof DERIVATION_PATHS 



export class KeyManager {  
    static readonly SEED_SIZE = 32
    static readonly PRIVATE_KEY_SIZE = 64  
    static readonly PUBLIC_KEY_SIZE = 32 
    // Schnorrkel 常量  
    private static readonly SCHNORRKEL_SEED_PREFIX = 'mnemonic'  


 // MnemonicToEntropy 将助记词转换为熵  
// 如果助记词无效，则抛出错误  
 mnemonicToEntropy(mnemonic: string): Uint8Array {  
    // 验证助记词的有效性，传入英文单词表  
    if (!validateMnemonic(mnemonic, wordlist)) {  
      throw new Error('无效的助记词');  
    }  
  
    // 使用 @scure/bip39 将助记词转换为熵的 Uint8Array，传入英文单词表  
    const entropy = bip39MnemonicToEntropy(mnemonic, wordlist);  
  
    return entropy;  
  }  
// SeedFromMnemonic 从 BIP39 助记词和密码生成 64 字节的种子  
async  seedFromMnemonic(mnemonic: string, password: string): Promise<Uint8Array> {  
    // 将助记词转换为熵  
    const entropy = this.mnemonicToEntropy(mnemonic);  
  
    // 验证熵的长度：必须在 16 到 32 字节之间，并且是 4 的倍数  
    if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {  
      throw new Error("无效的熵长度");  
    }  
  
    // 准备盐值："mnemonic" + password  
    const saltStr = KeyManager.SCHNORRKEL_SEED_PREFIX + password;  
    const encoder = new TextEncoder();  
    const salt = encoder.encode(saltStr);  
  
    // 使用 Web Crypto API 导入熵作为 PBKDF2 的密钥  
    const key = await crypto.subtle.importKey(  
      'raw',  
      entropy,  
      { name: 'PBKDF2' },  
      false,  
      ['deriveBits']  
    );  
  
    // 使用 PBKDF2 生成 64 字节（512 位）的种子，迭代次数为 2048，使用 SHA-512 哈希算法  
    const derivedBits = await crypto.subtle.deriveBits(  
      {  
        name: 'PBKDF2',  
        salt: salt,  
        iterations: 2048,  
        hash: 'SHA-512',  
      },  
      key,  
      64 * 8 // 64 字节 = 512 位  
    );  
  
    // 将导出的位转换为 Uint8Array  
    const derivedBytes = new Uint8Array(derivedBits);  
  
    return derivedBytes;  
  }  


   
    //直接生成与 Go ed25519.NewKeyFromSeed 兼容的密钥  
    async getEd25519KeyFromMnemonic(  
        mnemonic: string,  
        password: string = ''  
    ): Promise<Ed25519PrivKey> {  
        // 使用兼容 Schnorrkel 的方式生成种子  
        const seed = await this.seedFromMnemonic(mnemonic, password)  
        const ed25519Key = this.newKeyFromSeed(seed.slice(0, 32))
        const privateKey =  new Ed25519PrivKey(ed25519Key.privateKey)
         // 安全清除内存中的敏感数据  
         KeyManager.clearSensitiveData(seed)  
         KeyManager.clearSensitiveData(ed25519Key.privateKey)  
        return privateKey
    } 

     

    // 实现与 Go 完全一致的 newKeyFromSeed  
     newKeyFromSeed(seed: Uint8Array): {  
        privateKey: Uint8Array,  
        publicKey: Uint8Array  
    } {  
        if (seed.length !== KeyManager.SEED_SIZE) {  
            throw new Error(`ed25519: bad seed length: ${seed.length}`)  
        }  

        // 1. 计算种子的 SHA-512 哈希  
        const h = sha512(seed)  

        // 2. 对前32字节进行clamping（与Go实现一致）  
        const h0 = h.slice(0, 32)  
        h0[0] &= 248  
        h0[31] &= 127  
        h0[31] |= 64  

        // 3. 生成公钥  
        const publicKey = ed25519.getPublicKey(seed)  

        // 4. 构造64字节私钥（种子 + 公钥）  
        const privateKey = new Uint8Array(KeyManager.PRIVATE_KEY_SIZE)  
        privateKey.set(seed) // 前32字节是种子  
        privateKey.set(publicKey, 32) // 后32字节是公钥  

        return {  
            privateKey,  
            publicKey  
        }  
    }  

    // 生成新的助记词  
    static generateMnemonic(strength: 128 | 256 = 256): string {  
        // strength: 128 生成12个词, 256生成24个词  
        return generateMnemonic(wordlist, strength)  
    }  

    // 验证助记词  
    static validateMnemonic(mnemonic: string): boolean {  
        return validateMnemonic(mnemonic, wordlist)  
    }  


    // 原始的 HD 钱包方式  
    static async getMasterKeyFromMnemonic(  
        mnemonic: string,  
        password: string = ''  
    ): Promise<HDKey> {  
        if (!this.validateMnemonic(mnemonic)) {  
            throw new Error('Invalid mnemonic')  
        }  
        const seed = await mnemonicToSeed(mnemonic, password)  
        return HDKey.fromMasterSeed(seed)  
    }  

   

    // 派生特定路径的密钥  
    static async deriveKey(  
        mnemonic: string,  
        path: string = "m/44'/60'/0'/0/0", // 以太坊路径  
        password: string = ''  
    ): Promise<{  
        privateKey: Uint8Array,  
        publicKey: Uint8Array  
    }> {  
        const masterKey = await this.getMasterKeyFromMnemonic(mnemonic, password)  
        const derivedKey = masterKey.derive(path)  

        if (!derivedKey.privateKey || !derivedKey.publicKey) {  
            throw new Error('Failed to derive key')  
        }  

        return {  
            privateKey: derivedKey.privateKey,  
            publicKey: derivedKey.publicKey  
        }  
    }  

    static async deriveKeyForChain(  
        mnemonic: string,  
        chain: ChainType,  
        password: string = ''  
    ) {  
        return await this.deriveKey(  
            mnemonic,  
            DERIVATION_PATHS[chain],  
            password  
        )  
    } 
    // 安全清除数据  
    private static clearSensitiveData(data: Uint8Array): void {  
        data.fill(0)  
    }  
}
   