import crypto from 'crypto';  

import { peerIdFromPublicKey,peerIdFromPrivateKey } from "@libp2p/peer-id";
import { keys } from "@libp2p/crypto";
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'; // 多地址库  
import { Head } from './core/head'; 
import { ThreadID } from '@textile/threads-id'; 
import { Ed25519PrivKey,Ed25519PubKey } from "../dc-key/ed25519";
import type { PeerId,PublicKey,PrivateKey } from "@libp2p/interface"; 
import { SymmetricKey, Key as ThreadKey } from './key';
import {validateIDData} from './lsstoreds/global';
import {  ThreadInfo, ThreadLogInfo,ThreadToken,Store} from './core/core';



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

    const threadInfo: ThreadInfo = { id:id, key: threadKey,logs: [],addrs: [] };  

    await this.store.addThread(threadInfo);  
    const logInfo = await this.createLog(id, options.logKey, identity);  

    return threadInfo; // 返回 thread 信息  
  }  

  /**  
   * 验证线程 ID 和 Token  
   */  
  async validate(id: ThreadID, token: ThreadToken, readOnly: boolean): Promise<PublicKey> {  
    if (!validateIDData(id.toBytes())) {  
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

  /**  
   * 生成随机线程密钥  
   */  
  generateRandomKey(): ThreadKey {  
    return new ThreadKey(SymmetricKey.new(),SymmetricKey.new());  
  }  
}