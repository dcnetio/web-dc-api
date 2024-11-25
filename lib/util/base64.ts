export class CustomBase64 {  
    private static readonly alphabet = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";  
    private encodeLookup: number[];  
    private decodeLookup: number[];  

    constructor() {  
        // 初始化编码查找表  
        this.encodeLookup = new Array(64);  
        for (let i = 0; i < CustomBase64.alphabet.length; i++) {  
            this.encodeLookup[i] = CustomBase64.alphabet.charCodeAt(i);  
        }  

        // 初始化解码查找表  
        this.decodeLookup = new Array(256).fill(-1);  
        for (let i = 0; i < CustomBase64.alphabet.length; i++) {  
            this.decodeLookup[CustomBase64.alphabet.charCodeAt(i)] = i;  
        }  
    }  

    encode(src: Uint8Array): string {  
        if (src.length === 0) {  
            return "";  
        }  

        let result = "";  

        for (let i = 0; i < src.length; i += 3) {  
            const chunk = (src[i] << 16) |   
                         ((i + 1 < src.length ? src[i + 1] : 0) << 8) |  
                         (i + 2 < src.length ? src[i + 2] : 0);  

            result += String.fromCharCode(  
                this.encodeLookup[(chunk >> 18) & 0x3F],  
                this.encodeLookup[(chunk >> 12) & 0x3F]  
            );  
            
            if (i + 1 < src.length) {  
                result += String.fromCharCode(  
                    this.encodeLookup[(chunk >> 6) & 0x3F]  
                );  
            }  
            if (i + 2 < src.length) {  
                result += String.fromCharCode(  
                    this.encodeLookup[chunk & 0x3F]  
                );  
            }  
        }  

        return result;  
    }  

    decode(src: Uint8Array): Uint8Array {  
        if (src.length === 0) {  
            return new Uint8Array(0);  
        }  

        // 添加填充  
        const padding = 4 - (src.length % 4);  
        const paddedSrc = new Uint8Array(src.length + (padding === 4 ? 0 : padding));  
        paddedSrc.set(src);  
        for (let i = src.length; i < paddedSrc.length; i++) {  
            paddedSrc[i] = 61; // '=' character  
        }  

        const dst = new Uint8Array(Math.floor(paddedSrc.length * 3 / 4));  
        let dstIndex = 0;  

        for (let i = 0; i < paddedSrc.length; i += 4) {  
            const v1 = this.decodeLookup[paddedSrc[i]];  
            const v2 = this.decodeLookup[paddedSrc[i + 1]];  
            const v3 = this.decodeLookup[paddedSrc[i + 2]];  
            const v4 = this.decodeLookup[paddedSrc[i + 3]];  

            if (v1 === -1 || v2 === -1) {  
                throw new Error('Invalid base64 character');  
            }  

            const chunk = (v1 << 18) | (v2 << 12) |   
                         ((v3 === -1 ? 0 : v3) << 6) |  
                         (v4 === -1 ? 0 : v4);  

            dst[dstIndex++] = (chunk >> 16) & 0xFF;  
            if (v3 !== -1) {  
                dst[dstIndex++] = (chunk >> 8) & 0xFF;  
            }  
            if (v4 !== -1) {  
                dst[dstIndex++] = chunk & 0xFF;  
            }  
        }  

        return dst.slice(0, dstIndex);  
    }  
}  

// 创建单例实例  
const encoder = new CustomBase64();  

// 返回string的编码函数  
export function base64Encode(src: Uint8Array): string {  
    return encoder.encode(src);  
}  

export function base64Decode(src: Uint8Array): Uint8Array {  
    return encoder.decode(src);  
}