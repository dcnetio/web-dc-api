import { Datastore, Key,Query } from 'interface-datastore'  
import { SymKey } from '../core/core' 
import { peerIdFromPrivateKey, peerIdFromPublicKey } from '@libp2p/peer-id'  
import { keys } from '@libp2p/crypto'  
import { base32 } from 'multiformats/bases/base32'  
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'  
import { DumpKeyBook,KeyBook} from '../core/logstore'
import { ThreadID } from '@textile/threads-id';
import type { PeerId,PrivateKey,PublicKey } from "@libp2p/interface";
import {uniqueLogIds,uniqueThreadIds,AllowEmptyRestore,dsLogKey,dsThreadKey } from './global'
import { SymmetricKey } from '../common/key';
import { symKeyFromBytes } from '../../../dc-key/keyManager';
import { publicKeyFromRaw ,privateKeyFromRaw} from '@libp2p/crypto/keys'




// 键路径构建工具  
const KB_BASE = new Key('/thread/keys')  
const PUB_SUFFIX = new Key('/pub')  
const PRIV_SUFFIX = new Key('/priv')  
const READ_SUFFIX = new Key('/read')  
const SERVICE_SUFFIX = new Key('/service')  

class DsKeyBook implements KeyBook {  
  private ds: Datastore  

  constructor(store: Datastore) {  
    this.ds = store  
  }  
 
 

  async pubKey(t: ThreadID, p: PeerId): Promise<PublicKey|undefined> {  
    const key = dsLogKey(t, p, KB_BASE).child(PUB_SUFFIX)  
    
    try {  
      const value = await this.ds.get(key)  
      return keys.publicKeyFromRaw(value)  
    } catch (err) {  
      if ((err as { code?: string }).code === 'ERR_NOT_FOUND') return   
      throw new Error(`Error getting public key: ${(err as Error).message}`)  
    }  
  }  

  async addPubKey(t: ThreadID, p: PeerId, pk: PublicKey): Promise<void> {  
    if (!pk) throw new Error('Public key is null')  
    
    const peerId = peerIdFromPublicKey(pk)  
    if (!peerId.equals(p)) {  
      throw new Error("Log ID doesn't match provided public key")  
    }  

    const value = pk.raw
    const key = dsLogKey(t, p, KB_BASE).child(PUB_SUFFIX)  
    await this.ds.put(key, value)  
  }  

  async privKey(t: ThreadID, p: PeerId): Promise<PrivateKey | null> {  
    const key = dsLogKey(t, p, KB_BASE).child(PRIV_SUFFIX)  
    
    try {  
      const value = await this.ds.get(key)  
      return keys.privateKeyFromRaw(value)  
    } catch (err) {  
      if ((err as { code?: string }).code === 'ERR_NOT_FOUND') return null  
      throw new Error(`Error getting private key: ${(err as Error).message}`)  
    }  
  }  

  async addPrivKey(t: ThreadID, p: PeerId, sk: PrivateKey): Promise<void> {  
    if (!sk) throw new Error('Private key is null')  
    
    const peerId = await peerIdFromPrivateKey(sk)  
    if (!peerId.equals(p)) {  
      throw new Error("Peer ID doesn't match private key")  
    }  

    const value = sk.raw 
    const key = dsLogKey(t, p, KB_BASE).child(PRIV_SUFFIX)  
    await this.ds.put(key, value)  
  }  


  async readKey(t: ThreadID): Promise<SymKey|undefined> {  
    const key = dsThreadKey(t, KB_BASE).child(READ_SUFFIX)  
    try {  
      const value = await this.ds.get(key)  
      let symkey = await symKeyFromBytes(value)
      return symkey 
    } catch (err) {  
      if ((err as { code?: string }).code === 'ERR_NOT_FOUND') return 
      throw new Error(`Error getting read key: ${(err as Error).message}`)  
    }  
  }  

  async addReadKey(t: ThreadID, rk: SymKey): Promise<void> {  
    if (!rk) throw new Error('Read key is null')  
    const value = rk.raw
    const key = dsThreadKey(t, KB_BASE).child(READ_SUFFIX)  
    await this.ds.put(key, value)  
  }  

  async serviceKey(t: ThreadID): Promise<SymKey | undefined> {  
    const key = dsThreadKey(t, KB_BASE).child(SERVICE_SUFFIX)  
    
    try {  
      const value = await this.ds.get(key)  
      const symkey = await symKeyFromBytes(value)
      return symkey 
    } catch (err) {  
      if ((err as { code?: string }).code === 'ERR_NOT_FOUND') return   
      throw new Error(`Error getting service key: ${(err as Error).message}`)  
    }  
  }  

  async addServiceKey(t: ThreadID, fk: SymKey): Promise<void> {  
    if (!fk) throw new Error('Service key is null')  
    const key = dsThreadKey(t, KB_BASE).child(SERVICE_SUFFIX)  
    await this.ds.put(key, fk.raw)  
  }  

  async clearKeys(t: ThreadID): Promise<void> {  
    return this.clearKeysInternal(dsThreadKey(t, KB_BASE))  
  }  

  async clearLogKeys(t: ThreadID, p: PeerId): Promise<void> {  
    const baseKey = dsLogKey(t, p, KB_BASE)  
    await this.ds.delete(baseKey.child(PRIV_SUFFIX))  
    await this.ds.delete(baseKey.child(PUB_SUFFIX))  
  }  

  private async clearKeysInternal(prefix: Key): Promise<void> {  
    const q: Query = {  
      prefix: prefix.toString(),  
    }  

    for await (const result of this.ds.query(q)) {  
      await this.ds.delete(result.key)
    }  
  }  

  async logsWithKeys(t: ThreadID): Promise<PeerId[]> {  
    const threadKey = KB_BASE.child(  
        new Key(t.toString())  
    )  
    
    return uniqueLogIds(this.ds,threadKey, result =>   
      result.parent().name()  
    )  
  }  

  async threadsFromKeys(): Promise<ThreadID[]> {  
    return uniqueThreadIds(this.ds,KB_BASE, result =>  
        result.parent().parent().name()  
    )  
  }  


  async dumpKeys(): Promise<DumpKeyBook> {  
    const dump: DumpKeyBook = {  
      data: {  
        public: {},  
        private: {},  
        read: {},  
        service: {}  
      }  
    }  

    const q: Query = { prefix: KB_BASE.toString() }  
    const results = this.ds.query(q)  

    for await (const entry of results) {  
      const key = new Key(entry.key.toString())  
      const namespaces = key.list()  

      if (namespaces.length < 4) {  
        throw new Error(`Invalid keybook key: ${entry.key}`)  
      }  

      const suffix = `/${namespaces[namespaces.length - 1]}`  
      switch (suffix) {  
        case PUB_SUFFIX.toString():  
          this.processPublicKeyEntry(namespaces, entry.value, dump)  
          break  
        case PRIV_SUFFIX.toString():  
          this.processPrivateKeyEntry(namespaces, entry.value, dump)  
          break  
        case READ_SUFFIX.toString():  
          this.processReadKeyEntry(namespaces, entry.value, dump)  
          break  
        case SERVICE_SUFFIX.toString():  
          this.processServiceKeyEntry(namespaces, entry.value, dump)  
          break  
        default:  
          throw new Error(`Invalid key suffix: ${suffix}`)  
      }  
    }  

    return dump  
  }  

  private processPublicKeyEntry(namespaces: string[], value: Uint8Array, dump: DumpKeyBook) {  
    const [tid, lid] = namespaces.slice(2, 4)    
    const pk = publicKeyFromRaw(value)  
    if (!dump.data.public[tid]) {  
      dump.data.public[tid] = {}  
    }  
    dump.data.public[tid][lid] = pk  
  }  


  private processPrivateKeyEntry(namespaces: string[], value: Uint8Array, dump: DumpKeyBook) {  
    const [tid, lid] = namespaces.slice(2, 4)    
    const privk = privateKeyFromRaw(value)  
    if (!dump.data.private[tid]) {  
      dump.data.private[tid] = {}  
    }  
    dump.data.private[tid][lid] = privk  
  } 

  private processReadKeyEntry(namespaces: string[], value: Uint8Array, dump: DumpKeyBook) {  
    const [tid] = namespaces.slice(2, 3)    
    dump.data.read[tid] = Buffer.from(value)  
  } 

  private processServiceKeyEntry(namespaces: string[], value: Uint8Array, dump: DumpKeyBook) {  
    const [tid] = namespaces.slice(2, 3)    
    dump.data.service[tid] = Buffer.from(value)  
  } 

async restoreKeys(dump: DumpKeyBook): Promise<void> {
    if (
        !AllowEmptyRestore &&
        Object.keys(dump.data.public).length === 0 &&
        Object.keys(dump.data.private).length === 0 &&
        Object.keys(dump.data.read).length === 0 &&
        Object.keys(dump.data.service).length === 0
    ) {
        throw new Error('Empty dump data');
    }

    // clear all local keys
    await this.clearKeysInternal(KB_BASE);

    for (const tid in dump.data.public) {
        for (const lid in dump.data.public[tid]) {
            const pubKey = dump.data.public[tid][lid];
            await this.addPubKey(ThreadID.fromString(tid), await peerIdFromPublicKey(pubKey), pubKey);
        }
    }

    for (const tid in dump.data.private) {
        for (const lid in dump.data.private[tid]) {
            const privKey = dump.data.private[tid][lid];
            await this.addPrivKey(ThreadID.fromString(tid), await peerIdFromPrivateKey(privKey), privKey);
        }
    }

    for (const tid in dump.data.read) {
        const rk = dump.data.read[tid];
        const key = await symKeyFromBytes(rk);
        await this.addReadKey(ThreadID.fromString(tid), key);
    }

    for (const tid in dump.data.service) {
        const sk = dump.data.service[tid];
        const key = await symKeyFromBytes(sk);
        await this.addServiceKey(ThreadID.fromString(tid), key);
    }
}
}

export async function newKeyBook(store: Datastore): Promise<DsKeyBook> {  
  return new DsKeyBook(store)  
}