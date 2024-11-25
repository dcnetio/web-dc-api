import { generateMnemonic, mnemonicToSeed, validateMnemonic } from '@scure/bip39'  
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
    private static readonly SCHNORRKEL_SALT_PREFIX = 'substrate' 
    // 模拟 Schnorrkel.SeedFromMnemonic  
    static seedFromMnemonic(  
        mnemonic: string,  
        password: string = ''  
    ): Uint8Array {  
        if (!this.validateMnemonic(mnemonic)) {  
            throw new Error('Invalid mnemonic')  
        }  

        // 构造盐值  
        const saltPrefix = this.SCHNORRKEL_SEED_PREFIX  
        const salt = new TextEncoder().encode(`${saltPrefix}${password}`)  

        // 使用 PBKDF2 派生密钥  
        const seed = pbkdf2(  
            sha512, // hash function  
            new TextEncoder().encode(mnemonic), // 助记词输入  
            salt, // 盐值  
            { c: 2048, // 迭代次数
              dkLen: 64, // 生成密钥长度
              asyncTick: 10 // 异步调用的间隔
            }
        )  
        return seed  
    }  

    //直接生成与 Go ed25519.NewKeyFromSeed 兼容的密钥  
    static getEd25519KeyFromMnemonic(  
        mnemonic: string,  
        password: string = ''  
    ):Ed25519PrivKey{  
        // 使用兼容 Schnorrkel 的方式生成种子  
        const seed = this.seedFromMnemonic(mnemonic, password)  
        const ed25519Key = this.newKeyFromSeed(seed.slice(0, 32))
        const privateKey =  new Ed25519PrivKey(ed25519Key.privateKey)
         // 安全清除内存中的敏感数据  
        this.clearSensitiveData(seed)  
        this.clearSensitiveData(ed25519Key.privateKey)  
        return privateKey
    } 

    // 实现与 Go 完全一致的 newKeyFromSeed  
    static newKeyFromSeed(seed: Uint8Array): {  
        privateKey: Uint8Array,  
        publicKey: Uint8Array  
    } {  
        if (seed.length !== this.SEED_SIZE) {  
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
        const privateKey = new Uint8Array(this.PRIVATE_KEY_SIZE)  
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
   