import { ThreadID } from '@textile/threads-id';
import type { PeerId,PublicKey } from "@libp2p/interface";
import { Ed25519PrivKey } from "../dc-key/ed25519"; 
import {SymKey} from "./core";
import type { Multiaddr } from "@multiformats/multiaddr";
// 类型别名定义    
type Head = string;  

// 异常定义  
export class ThreadExistsError extends Error {  
  constructor() { super('thread already exists'); }  
}  
export class ThreadNotFoundError extends Error {  
  constructor() { super('thread not found'); }  
}  
export class LogNotFoundError extends Error {  
  constructor() { super('log not found'); }  
}  
export class LogExistsError extends Error {  
  constructor() { super('log already exists'); }  
}  
export class EmptyDumpError extends Error {  
  constructor() { super('empty dump'); }  
}  
export class EdgeUnavailableError extends Error {  
  constructor() { super('edge unavailable'); }  
}  

// 接口定义  
export interface ThreadMetadata {  
  getInt64(t: ThreadID, key: string): Promise<number | null>;  
  putInt64(t: ThreadID, key: string, val: number): Promise<void>;  
  getString(t: ThreadID, key: string): Promise<string | null>;  
  putString(t: ThreadID, key: string, val: string): Promise<void>;  
  getBool(t: ThreadID, key: string): Promise<boolean | null>;  
  putBool(t: ThreadID, key: string, val: boolean): Promise<void>;  
  getBytes(t: ThreadID, key: string): Promise<Buffer | null>;  
  putBytes(t: ThreadID, key: string, val: Buffer): Promise<void>;  
  clearMetadata(t: ThreadID): Promise<void>;  
  dumpMeta(): Promise<DumpMetadata>;  
  restoreMeta(book: DumpMetadata): Promise<void>;  
}  

export interface KeyBook {  
  pubKey(threadId: ThreadID, peerId: PeerId): Promise<PublicKey>;  
  addPubKey(threadId: ThreadID, peerId: PeerId, key: PublicKey): Promise<void>;  
  privKey(threadId: ThreadID, peerId: PeerId): Promise<Ed25519PrivKey>;  
  addPrivKey(threadId: ThreadID, peerId: PeerId, key: Ed25519PrivKey): Promise<void>;  
  readKey(threadId: ThreadID): Promise<SymKey>;  
  addReadKey(threadId: ThreadID, key: SymKey): Promise<void>;  
  serviceKey(threadId: ThreadID): Promise<SymKey>;  
  addServiceKey(threadId: ThreadID, key: SymKey): Promise<void>;  
  clearKeys(threadId: ThreadID): Promise<void>;  
  clearLogKeys(threadId: ThreadID, peerId: PeerId): Promise<void>;  
  logsWithKeys(threadId: ThreadID): Promise<PeerId[]>;  
  threadsFromKeys(): Promise<ThreadID[]>;  
  dumpKeys(): Promise<DumpKeyBook>;  
  restoreKeys(book: DumpKeyBook): Promise<void>;  
}  

export interface AddrBook {  
  addAddr(threadId: ThreadID, peerId: PeerId, addr: Multiaddr, ttl: number): Promise<void>;  
  addAddrs(threadId: ThreadID, peerId: PeerId, addrs: Multiaddr[], ttl: number): Promise<void>;  
  setAddr(threadId: ThreadID, peerId: PeerId, addr: Multiaddr, ttl: number): Promise<void>;  
  setAddrs(threadId: ThreadID, peerId: PeerId, addrs: Multiaddr[], ttl: number): Promise<void>;  
  updateAddrs(threadId: ThreadID, peerId: PeerId, oldTTL: number, newTTL: number): Promise<void>;  
  addrs(threadId: ThreadID, peerId: PeerId): Promise<Multiaddr[]>;  
  addrStream( threadId: ThreadID, peerId: PeerId): AsyncIterable<Multiaddr>;  
  clearAddrs(threadId: ThreadID, peerId: PeerId): Promise<void>;  
  logsWithAddrs(threadId: ThreadID): Promise<PeerId[]>;  
  threadsFromAddrs(): Promise<ThreadID[]>;  
  addrsEdge(threadId: ThreadID): Promise<number>;  
  dumpAddrs(): Promise<DumpAddrBook>;  
  restoreAddrs(book: DumpAddrBook): Promise<void>;  
}  

export interface HeadBook {  
  addHead(threadId: ThreadID, peerId: PeerId, head: Head): Promise<void>;  
  addHeads(threadId: ThreadID, peerId: PeerId, heads: Head[]): Promise<void>;  
  setHead(threadId: ThreadID, peerId: PeerId, head: Head): Promise<void>;  
  setHeads(threadId: ThreadID, peerId: PeerId, heads: Head[]): Promise<void>;  
  heads(threadId: ThreadID, peerId: PeerId): Promise<Head[]>;  
  clearHeads(threadId: ThreadID, peerId: PeerId): Promise<void>;  
  headsEdge(threadId: ThreadID): Promise<number>;  
  dumpHeads(): Promise<DumpHeadBook>;  
  restoreHeads(book: DumpHeadBook): Promise<void>;  
}  

export interface Logstore extends ThreadMetadata, KeyBook, AddrBook, HeadBook {  
  close(): Promise<void>;  
  threads(): Promise<ThreadID[]>;  
  addThread(info: ThreadInfo): Promise<void>;  
  getThread(threadId: ThreadID): Promise<ThreadInfo>;  
  deleteThread(threadId: ThreadID): Promise<void>;  
  addLog(threadId: ThreadID, logInfo: LogInfo): Promise<void>;  
  getLog(threadId: ThreadID, peerId: PeerId): Promise<LogInfo>;  
  getManagedLogs(threadId: ThreadID): Promise<LogInfo[]>;  
  deleteLog(threadId: ThreadID, peerId: PeerId): Promise<void>;  
}  

// Dump 结构定义  
interface ExpiredAddress {  
  addr: Multiaddr;  
  expires: Date;  
}  

interface DumpHeadBook {  
  data: Record<string, Record<string, Head[]>>;  
}  

interface DumpAddrBook {  
  data: Record<string, Record<string, ExpiredAddress[]>>;  
}  

interface DumpKeyBook {  
  data: {  
    public: Record<string, Record<string, PublicKey>>;  
    private: Record<string, Record<string, Ed25519PrivKey>>;  
    read: Record<string, Buffer>;  
    service: Record<string, Buffer>;  
  };  
}  

interface MetadataKey {  
  t: ThreadID;  
  k: string;  
}  

interface DumpMetadata {  
  data: {  
    int64: Record<string, number>;   
    bool: Record<string, boolean>;  
    string: Record<string, string>;  
    bytes: Record<string, Buffer>;  
  };  
}  

// 辅助类型定义  
interface ThreadInfo {  
  // 根据实际情况完善  
}  

interface LogInfo {  
  // 根据实际情况完善  
}  
