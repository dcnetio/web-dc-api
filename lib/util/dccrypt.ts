
import { base32 } from "multiformats/bases/base32";



async function decryptContent(  
  encryptBuffer: Uint8Array,  
  decryptKey: string | Uint8Array  
): Promise<Uint8Array> {  
  try {  
    if (decryptKey === "" || encryptBuffer.length <= 28) {  
      return encryptBuffer;  
    }  

    // 1. 准备数据  
    const nonce = encryptBuffer.slice(0, 12);  
    // 尝试不同的密文分割方式  
    const ciphertext = encryptBuffer.slice(12);  

    // 2. 准备密钥  
    const inputKey = typeof decryptKey === "string"   
      ? base32.decode(decryptKey)   
      : decryptKey;  

  

    // 3. 导入密钥  
    const key = await window.crypto.subtle.importKey(  
      "raw",  
      inputKey,  
      {  
        name: "AES-GCM",  
        length: 256  
      },  
      false,  
      ["decrypt"]  
    );  

    // 4. 尝试不同的解密配置  
    const configs = [  
      { tagLength: 128, name: "标准模式" },  
      { tagLength: 96, name: "96位标签模式" },  
      { tagLength: 64, name: "64位标签模式" }  
    ];  

    for (const config of configs) {  
      try {   
        const decrypted = await window.crypto.subtle.decrypt(  
          {  
            name: "AES-GCM",  
            iv: nonce,  
            tagLength: config.tagLength  
          },  
          key,  
          ciphertext  
        );  
        // 解密成功  
        const result = new Uint8Array(decrypted);  
        return result;  
      } catch (e: any) {  
        console.log(`${config.name} 失败:`, e.message);  
        continue;  
      }  
    }  
    throw new Error('decrypt failed');  
  } catch (error) {  
    throw error;  
  }  
}  

  

  export { decryptContent };