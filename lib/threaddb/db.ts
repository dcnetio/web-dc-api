import { ThreadID } from '@textile/threads-id';
import type { PeerId } from '@libp2p/interface'  
import { peerIdFromPrivateKey, peerIdFromPublicKey} from "@libp2p/peer-id";
import type { PrivateKey } from '@libp2p/interface-keys' 
import { Ed25519PrivKey } from "../dc-key/ed25519";
import { keys } from "@libp2p/crypto";


import { createFromPubKey, createFromPrivKey } from '@libp2p/peer-id-factory'  
import { CID } from 'multiformats/cid'  

import exp from 'constants';

import { join } from 'path';  
import { promises as fs } from 'fs';  
import { stat } from 'fs/promises';  
import { ed25519 } from '@noble/curves/ed25519';

// 类型定义  

export enum KeyType {  
    Ed25519 = 'Ed25519',  
    Secp256k1 = 'Secp256k1',  
    RSA = 'RSA'  
}  




// 错误定义  
const Errors = {  
    ErrNoDbManager: new Error('No database manager available'),  
    ErrNoDcPeerConnected: new Error('No DC peer connected'),  
    ErrP2pNetworkNotInit: new Error('P2P network not initialized'),  
    ErrNoThreadOnDc: new Error('Thread not found on DC'),  
    ErrDBNotFound: new Error('Database not found'),  
    ErrThreadNotFound: new Error('Thread not found')  
} as const;  

// 常量定义  
const PullTimeout = 30000; // 30 seconds  
const Threaddbtype = 2;  

// 类型定义  
namespace Types {  
    export interface CollectionInfo {  
        name: string;  
        schema: string;  
        indexs?: Array<{  
            path: string;  
            unique: boolean;  
        }>;  
        writeValidator?: string;  
        readFilter?: string;  
    }  

    export interface ThreadInfo {  
        addrs: string[];  
        logs: LogInfo[];  
    }  

    export interface LogInfo {  
        id: string;  
        head: {  
            counter: number;  
        };  
    }  

    export interface StoreUnit {  
        peers: { [key: string]: any };  
        logs: { [key: string]: any };  
    }  

    export interface ThreadOption {  
        withThreadKey?: any;  
        withLogKey?: any;  
        withNewThreadBlockHeight?: number;  
        withNewThreadSignature?: Uint8Array;  
    }  

    export interface DBOptions {  
        name: string;  
        key: any;  
        logKey: any;  
        backfillBlock: boolean;  
        collections: any[];  
    }  
 

}


// 工具函数  
class Utils {  
    static async generateThreadKey(b32Sk: string, b32Rk: string): Promise<any> {  
        // Implementation of thread key generation  
        // This would depend on your cryptographic requirements  
        return Buffer.from(`${b32Sk}:${b32Rk}`);  
    }  

    static async generateServiceKey(b32Sk: string): Promise<any> {  
        // Implementation of service key generation  
        return Buffer.from(b32Sk);  
    }  

    static createTimeoutContext(ms: number): [any, () => void] {  
        const ctx = {};  
        const cancel = () => {};  
        return [ctx, cancel];  
    }  

    static async SchemaFromSchemaString(schema: string): Promise<any> {  
        // Convert schema string to schema object  
        return JSON.parse(schema);  
    }  
}  

// 主类实现  
class ThreadDb {  
    private connectedDc: any;  
    private context: any;  
    private net: any;  
    private privateKey: any;  
   

    constructor(config: {  
        context?: any;  
        net?: any;  
        privateKey?: any;  
        storagePrefix?: string;
    }) {   
        this.context = config.context;  
        this.net = config.net;  
        this.privateKey = config.privateKey;  
        this.storagePrefix = config.storagePrefix || '';
    }  

   
    


     /**  
     * Convert Uint8Array to base64 string for storage  
     */  
     private uint8ArrayToBase64(bytes: Uint8Array): string {  
        return btoa(String.fromCharCode.apply(null, [...bytes]));  
    }  

    /**  
     * Convert base64 string back to Uint8Array  
     */  
    private base64ToUint8Array(base64: string): Uint8Array {  
        const binary = atob(base64);  
        const bytes = new Uint8Array(binary.length);  
        for (let i = 0; i < binary.length; i++) {  
            bytes[i] = binary.charCodeAt(i);  
        }  
        return bytes;  
    }  

    /**  
     * Clear all stored keys  
    */  
    clearAllKeys(): void {  
        const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))  
            .filter((key): key is string =>   
                key !== null && key.startsWith(this.storagePrefix));  
        // 删除匹配的键  
        keys.forEach(key => localStorage.removeItem(key));  
    }  


  

//todo
// startDBSpaceMonitor 开启threaddb是否需要再分配空间监控,
// 自动为访问过的数据库分配空间
// 用户访问某一个数据库，就将该数据库纳入空间监控队列
// 首次访问，判断一次是否需要申请空间
// 后续每1000次数据生成，判断一次是否需要申请空间
//func (dc *Dc) startDBSpaceMonitor() {


}


export { ThreadDb, Errors, Types, Utils };