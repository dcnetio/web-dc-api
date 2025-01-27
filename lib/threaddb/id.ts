  
import { PeerId } from '@libp2p/interface-peer-id';  
import type { Multiaddr } from '@multiformats/multiaddr';   
import { multiaddr } from '@multiformats/multiaddr';
import { PrivateKey, PublicKey } from '@libp2p/interface-keys';  
import { encode, decode } from 'multibase';
import { base32 } from 'multiformats/bases/base32'; 
import { Buffer } from 'buffer'; 

// 错误定义  
export const Errors = {  
    ErrVarintBuffSmall: new Error('reading varint: buffer too small'),  
    ErrVarintTooBig: new Error('reading varint: varint bigger than 64bits and not supported'),  
    ErrIDTooShort: new Error('id too short')  
};  

// 版本常量  
export const V1 = 0x01;  

// Variant 枚举  
export enum Variant {  
    Raw = 0x55,  
    AccessControlled = 0x70  
}  

export class ThreadID {  
    private readonly _bytes: Buffer;  
    static readonly Undef = new ThreadID(Buffer.from(''));  

    private constructor(bytes: Buffer) {  
        this._bytes = bytes;  
    }  

   
    // 创建新的 V1 Thread ID  
    static newIDV1(variant: Variant, size: number): ThreadID {  
        const num = crypto.getRandomValues(new Uint8Array(size));  
        
        // 创建缓冲区  
        const buf = Buffer.alloc(2 * 8 + size);  
        let n = encodeVarint(buf, V1, 0);  
        n += encodeVarint(buf, variant, n);  
        
        // 使用 set 方法复制数据  
        buf.set(num, n);  

        return new ThreadID(buf.slice(0, n + size));  
    } 


   

    // 从二进制数据创建 ThreadID  
    static async cast(data: Uint8Array): Promise<ThreadID> {  
        if (await validateIDData(data)) {  
            return new ThreadID(Buffer.from(data));  
        }  
        throw new Error('Invalid thread ID data');  
    }  

    // 从多地址创建 ThreadID  
    static async fromAddr(addr: Multiaddr): Promise<ThreadID> {  
        const components = addr.toString().split('/');  
        const idStr = components.find(c => c.startsWith('thread'));  
        if (!idStr) {  
            throw new Error('Thread ID not found in multiaddr');  
        }  
        return ThreadID.decode(idStr.slice(7)); // Remove 'thread/'  
    }  

    // 转换为多地址   
    toAddr(): Multiaddr {  
        return multiaddr(`/thread/${this.toString()}`);  
    }   

    // 验证ID  
    async validate(): Promise<void> {  
        await validateIDData(this._bytes);  
    }  

    // 获取版本  
    version(): number {  
        const [version] = decodeVarint(this._bytes);  
        return version;  
    }  

    // 获取变体  
    variant(): Variant {  
        const [, n] = decodeVarint(this._bytes);  
        const [variant] = decodeVarint(this._bytes.subarray(n));  
        return variant as Variant;  
    }  

    // 转换为字符串  
    toString(): string {  
        this.validate();  
        switch (this.version()) {  
            case V1:  
                return base32.encode(this._bytes);  
            default:  
                throw new Error('Unknown thread ID version');  
        }  
    }  

    // 修改 stringOfBase 方法  
    async stringOfBase(encoding: any): Promise<string> {  
        await this.validate();  
        switch (this.version()) {  
            case V1:  
                return encoding.encode(this._bytes);  
            default:  
                throw new Error('Unknown thread ID version');  
        }  
    }  

    // 修改 decode 方法  
    static async decode(str: string): Promise<ThreadID> {  
        if (str.length < 2) {  
            throw Errors.ErrIDTooShort;  
        }  

        const decoded = base32.decode(str);  
        return ThreadID.cast(decoded);  
    }  

    // 获取字节表示  
    bytes(): Buffer {  
        return Buffer.from(this._bytes);  
    }  

    // 比较两个ID是否相等  
    equals(other: ThreadID): boolean {  
        return this._bytes.equals(other._bytes);  
    }  

    // 获取用于日志的表示  
    loggable(): Record<string, any> {  
        return {  
            id: this.toString()  
        };  
    }  
}  

// 线程信息接口  
export interface ThreadInfo {  
    id: ThreadID;  
    key: any; // Key type needs to be defined  
    logs: LogInfo[];  
    addrs: Multiaddr[];  
}  

// 日志信息接口  
export interface LogInfo {  
    id: PeerId;  
    pubKey: PublicKey;  
    privKey?: PrivateKey;  
    addrs: Multiaddr[];  
    head: any; // Head type needs to be defined  
    managed: boolean;  
}  

// 辅助函数  

// 编码变长整数  
function encodeVarint(buf: Buffer, value: number, offset: number): number {  
    let n = 0;  
    while (value >= 0x80) {  
        buf[offset + n] = (value & 0xFF) | 0x80;  
        value >>>= 7;  
        n++;  
    }  
    buf[offset + n] = value;  
    return n + 1;  
}  

// 解码变长整数  
function decodeVarint(buf: Buffer): [number, number] {  
    let value = 0;  
    let n = 0;  
    let shift = 0;  

    while (true) {  
        if (n >= buf.length) {  
            throw Errors.ErrVarintBuffSmall;  
        }  

        const b = buf[n];  
        n++;  

        value |= (b & 0x7F) << shift;  
        shift += 7;  

        if (b < 0x80) {  
            break;  
        }  

        if (shift > 63) {  
            throw Errors.ErrVarintTooBig;  
        }  
    }  

    return [value, n];  
}  

// 验证ID数据  
async function validateIDData(data: Uint8Array): Promise<boolean> {  
    try {  
        const [version, n] = decodeVarint(Buffer.from(data));  
        if (version !== V1) {  
            throw new Error(`Expected 1 as the id version number, got: ${version}`);  
        }  

        const [variant, cn] = decodeVarint(Buffer.from(data.slice(n)));  
        if (variant !== Variant.Raw && variant !== Variant.AccessControlled) {  
            throw new Error(`Expected Raw or AccessControlled as the id variant, got: ${variant}`);  
        }  

        const id = data.slice(n + cn);  
        if (id.length === 0) {  
            throw new Error('Expected random id bytes but there are none');  
        }  

        return true;  
    } catch (error) {  
        throw error;  
    }  
}  

// 使用示例  
async function example() {  
    // 创建新的Thread ID  
    const threadId = ThreadID.newIDV1(Variant.Raw, 32);  

    // 转换为字符串  
    const str = threadId.toString();  
    console.log('Thread ID:', str);  

    // 解码字符串  
    const decoded = await ThreadID.decode(str);  
    console.log('Decoded equals original:', decoded.equals(threadId));  

    // 获取版本和变体  
    console.log('Version:', threadId.version());  
    console.log('Variant:', threadId.variant());  

    // 验证  
    await threadId.validate();  
}