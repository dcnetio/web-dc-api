

// 处理大端字节序的 uint32  
function getNextWord(b: Uint8Array, pos: { value: number }): number {  
    let w = 0;  
    let j = pos.value;  
    
    for (let i = 0; i < 4; i++) {  
        w = (w << 8) | b[j]!;  
        j++;  
        if (j >= b.length) {  
            j = 0;  
        }  
    }  
    pos.value = j;  
    return w >>> 0; // 确保是无符号32位整数  
}  

class Cipher {  
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
}  

function encryptBlock(l: number, r: number, c: Cipher): [number, number] {  
    let xl = l >>> 0;  
    let xr = r >>> 0;  
    
    xl ^= c.p[0]!;  
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[1]!;  
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[2]!;  
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[3]!;  
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[4]!;  
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[5]!;   
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[6]!; 
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[7]!;
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[8]!;
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[9]!;
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[10]!;
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[11]!;
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[12]!;
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[13]!;
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[14]!;
    xr ^= (((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^
            c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]!) ^ c.p[15]!;
    xl ^= (((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^
            c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]!) ^ c.p[16]!;
    xr ^= c.p[17]!;  
    
    return [xr >>> 0, xl >>> 0];  
}  

function expandKey(key: Uint8Array, c: Cipher): void {  
    let j = 0;  
    const pos = { value: 0 };  
    
    // 初始化 P 数组  
    for (let i = 0; i < 18; i++) {  
        let d = 0;  
        for (let k = 0; k < 4; k++) {  
            d = (d << 8) | key[j]!;  
            j++;  
            if (j >= key.length) {  
                j = 0;  
            }  
        }  
        c.p[i]! ^= d >>> 0;  
    }  
    
    // 加密并更新 P 和 S 盒  
    let l = 0, r = 0;  
    for (let i = 0; i < 18; i += 2) {  
        [l, r] = encryptBlock(l, r, c);  
        c.p[i] = l;  
        c.p[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        [l, r] = encryptBlock(l, r, c);  
        c.s0[i] = l;  
        c.s0[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        [l, r] = encryptBlock(l, r, c);  
        c.s1[i] = l;  
        c.s1[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        [l, r] = encryptBlock(l, r, c);  
        c.s2[i] = l;  
        c.s2[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        [l, r] = encryptBlock(l, r, c);  
        c.s3[i] = l;  
        c.s3[i + 1] = r;  
    }  
}  

function expandKeyWithSalt(key: Uint8Array, salt: Uint8Array, c: Cipher): void {  
    const keyPos = { value: 0 };  
    const saltPos = { value: 0 };  
    
    // 初始化 P 数组  
    for (let i = 0; i < 18; i++) {  
        c.p[i]! ^= getNextWord(key, keyPos);  
    }  
    
    let l = 0, r = 0;  
    
    // 加密并更新 P 数组  
    for (let i = 0; i < 18; i += 2) {  
        l ^= getNextWord(salt, saltPos);  
        r ^= getNextWord(salt, saltPos);  
        [l, r] = encryptBlock(l, r, c);  
        c.p[i] = l;  
        c.p[i + 1] = r;  
    }  
    
    // 加密并更新 S 盒  
    for (let i = 0; i < 256; i += 2) {  
        l ^= getNextWord(salt, saltPos);  
        r ^= getNextWord(salt, saltPos);  
        [l, r] = encryptBlock(l, r, c);  
        c.s0[i] = l;  
        c.s0[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        l ^= getNextWord(salt, saltPos);  
        r ^= getNextWord(salt, saltPos);  
        [l, r] = encryptBlock(l, r, c);  
        c.s1[i] = l;  
        c.s1[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        l ^= getNextWord(salt, saltPos);  
        r ^= getNextWord(salt, saltPos);  
        [l, r] = encryptBlock(l, r, c);  
        c.s2[i] = l;  
        c.s2[i + 1] = r;  
    }  
    
    for (let i = 0; i < 256; i += 2) {  
        l ^= getNextWord(salt, saltPos);  
        r ^= getNextWord(salt, saltPos);  
        [l, r] = encryptBlock(l, r, c);  
        c.s3[i] = l;  
        c.s3[i + 1] = r;  
    }  
}  

/**  
 * Decrypts a block of data using the Blowfish algorithm  
 * @param l Left 32-bit block  
 * @param r Right 32-bit block  
 * @param c Cipher containing P-array and S-boxes  
 * @returns Tuple of [left, right] 32-bit blocks  
 */  
 function decryptBlock(l: number, r: number, c: Cipher): [number, number] {  
    let xl = l >>> 0;  // Ensure 32-bit unsigned  
    let xr = r >>> 0;  // Ensure 32-bit unsigned  

    // Initial P-box application  
    xl ^= c.p[17]!;  

    // 16 rounds of Feistel network operations in reverse  
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[16]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[15]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[14]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[13]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[12]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[11]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[10]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[9]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[8]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[7]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[6]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[5]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[4]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[3]!;  
    
    xr ^= ((c.s0[(xl >>> 24) & 0xff]! + c.s1[(xl >>> 16) & 0xff]!) ^   
           c.s2[(xl >>> 8) & 0xff]!) + c.s3[xl & 0xff]! ^ c.p[2]!;  
    
    xl ^= ((c.s0[(xr >>> 24) & 0xff]! + c.s1[(xr >>> 16) & 0xff]!) ^   
           c.s2[(xr >>> 8) & 0xff]!) + c.s3[xr & 0xff]! ^ c.p[1]!;  

    // Final P-box application  
    xr ^= c.p[0]!;  

    // Return the decrypted block  
    return [xr >>> 0, xl >>> 0];  // Ensure 32-bit unsigned return values  
}

// 导出需要的函数和类  
export {  
    getNextWord,
    Cipher,  
    expandKey,  
    expandKeyWithSalt,  
    encryptBlock ,
    decryptBlock
};