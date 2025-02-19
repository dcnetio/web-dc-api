import crypto from 'crypto';  
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface"; 
import { Ed25519PrivKey,Ed25519PubKey } from "../dc-key/ed25519"; 
import { peerIdFromPublicKey,peerIdFromPrivateKey } from "@libp2p/peer-id";
import { keys } from "@libp2p/crypto";
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'; // 多地址库  
import { Head } from './head'; // Ensure Head is a class and not just a type
import { log } from 'console';
// 定义 Thread ID、Token 和 PubKey 的接口  
interface ThreadID {  
  validate(): boolean;  
}  

interface ThreadKey {  
  defined(): boolean;  
}  

interface ThreadToken {  
  validate(privKey: string): Promise<PublicKey>;  
}  



// 定义 Thread Info 的接口  
export interface ThreadInfo {  
  id: ThreadID;  
  key: ThreadKey;  
}  

export interface ThreadLogInfo {  
// id is the log's identifier.
  id: PeerId;  
// privKey is the log's private key.
  privKey?: PrivateKey;  
// pubKey is the log's public key.
  pubKey?: PublicKey;  
// Addrs are the addresses associated with the given log.
  addrs: Multiaddr[];  
// Managed logs are any logs directly added/created by the host, and/or logs for which we have the private key
  managed: boolean;  
// Head is the log's current head.
  head: Head;
}  

// 定义 Store 接口  
interface Store {  
  addThread(info: ThreadInfo): Promise<void>;  
  addLog(id: ThreadID, logInfo: ThreadLogInfo): Promise<void>;  
  putBytes(id: ThreadID, identity: string, bytes: Uint8Array): Promise<void>;  
}  

// 定义 Network 类  
class Network {  
  private store: Store;  
  private hostID: string;  
  private privateKey: string;  

  constructor(store: Store, hostID: string, privateKey: string) {  
    this.store = store;  
    this.hostID = hostID;  
    this.privateKey = privateKey;  
  }  

  /**  
   * 创建线程  
   */  
  async createThread(id: ThreadID, options: { token: ThreadToken; logKey?: Ed25519PrivKey|Ed25519PubKey, threadKey?: ThreadKey }): Promise<ThreadInfo> {  
    const identity = await this.validate(id, options.token, false);  
    if (identity) {  
      console.debug("Creating thread with identity:", identity.toString());  
    } else {  
      throw new Error("Identity creation failed.");  
    }  

    await this.ensureUniqueLog(id, options.logKey, identity);  
    const threadKey = options.threadKey || this.generateRandomKey();  

    const threadInfo: ThreadInfo = { id, key: threadKey };  

    await this.store.addThread(threadInfo);  
    const logInfo = await this.createLog(id, options.logKey, identity);  

    return threadInfo; // 返回 thread 信息  
  }  

  /**  
   * 验证线程 ID 和 Token  
   */  
  async validate(id: ThreadID, token: ThreadToken, readOnly: boolean): Promise<PublicKey> {  
    if (!id.validate()) {  
      throw new Error("Invalid thread ID.");  
    }  

    return await token.validate(this.privateKey);  
  }  

  /**  
   * 确保日志唯一性  
   */  
  async ensureUniqueLog(id: ThreadID, logKey: Ed25519PrivKey|Ed25519PubKey|undefined, identity: PublicKey): Promise<void> {  
    // 自定义逻辑，检查日志唯一性  
  }  

  /**  
   * 随机生成线程密钥  
   */  
  generateRandomKey(): ThreadKey {  
    return {  
      defined: () => true,  
    };  
  }  

  /**  
   * 创建日志，分配 privKey 和 pubKey  
   */  
  async createLog(  
    id: ThreadID,  
    key?: Ed25519PrivKey|Ed25519PubKey,  
    identity?: PublicKey  
  ): Promise<ThreadLogInfo> {  
    let privKey: PrivateKey | undefined;  
    let pubKey: PublicKey;  
    let peerId: PeerId;  
    if (!key) {  
      const keyPair = await keys.generateKeyPair('Ed25519');
      privKey =  new Ed25519PrivKey(keyPair.raw) 
      pubKey = keyPair.publicKey;  
      peerId =  peerIdFromPrivateKey(privKey);  
    } else {  
      if (key instanceof Ed25519PrivKey) {  
        privKey = key;
        pubKey = key.publicKey;  
        peerId = peerIdFromPrivateKey(key);  
      }else if(key instanceof Ed25519PubKey){
        pubKey = key;
        peerId = peerIdFromPublicKey(key);
      }else{
        throw new Error("Invalid key type.");  
      }   
    }  
    const addr = multiaddr(`/p2p/${this.hostID}`); // 基于 hostID 生成地址  
    const head : Head = {
        id: peerId.toCID(),
        counter: 0,
    }
    const logInfo: ThreadLogInfo = {  
      privKey,  
      pubKey,  
      id: peerId,  
      addrs: [addr],  
      managed: true, 
      head: head
    };  

    // 将日志添加到线程存储  
    await this.store.addLog(id, logInfo);  
    const logIDBytes = new Uint8Array(new TextEncoder().encode(peerId.toString()));  
    await this.store.putBytes(id, identity?.toString() || "", logIDBytes);  
    return logInfo;  
  }  
}