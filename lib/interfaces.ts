// interfaces.ts
// 定义系统中使用的各种接口

import { Ed25519PrivKey, Ed25519PubKey } from "./dc-key/ed25519";
import type { DCConnectInfo, APPInfo } from "./types/types";
import type { HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";
import { ChainUtil } from "./chain";
import { DcUtil } from "./dcutil";
import { ICollectionConfig } from "./implement/threaddb/core/core";
import { SeekableFileStream } from "./implement/file/seekableFileStream";
import { DBManager } from "./implement/threaddb/dbmanager";
import { DCGrpcServer } from "./implement/threaddb/net/grpcserver";

/**
 * 核心系统上下文接口
 * 定义所有模块可以访问的核心系统组件
 */
export interface DCContext {
  // 核心基础设施
  dcNodeClient: HeliaLibp2p<Libp2p<any>>;
  dcChain: ChainUtil;
  dcutil: DcUtil;
  
  // 连接信息
  connectedDc: DCConnectInfo;
  AccountBackupDc: DCConnectInfo;
  
  // 应用信息
  appInfo: APPInfo;
  
  // 数据库管理器
  dbManager?: DBManager;
  
  // 身份相关
  publicKey?: Ed25519PubKey;
  privKey?: Ed25519PrivKey;

  grpcServer: DCGrpcServer;
  
  // 核心功能
  sign(payload: Uint8Array): Promise<Uint8Array> ;
  getPubkeyRaw(): Uint8Array;
  getPublicKey(): Ed25519PubKey;
  decrypt(data: Uint8Array): Promise<Uint8Array>;
}

/**
 * client接口
 */
export interface IClientOperations {
  getHostID(): Promise<[{ peerID: string; reqAddr: string } | null, Error | null]>;
}

/**
 * 文件操作接口
 */
export interface IFileOperations {
  getSeekableFileStream(ipfsPath: string, decryptKey: string): Promise<SeekableFileStream>;
  clearFileCache(pathname?: string): void;
  getFile(cid: string, decryptKey: string): Promise<Uint8Array | undefined>;
  createFileStream(cid: string, decryptKey: string): Promise<ReadableStream<Uint8Array> | null>;
  addFile(file: File, enkey: string, onUpdateTransmitSize: (status: number, size: number) => void): Promise<any>;
}

/**
 * 认证操作接口
 */
export interface IAuthOperations {
  getSavedToken(peerId: string): Promise<void>;
  accountLogin(nftAccount: string, password: string, safecode: string): Promise<boolean>;
  startDcPeerTokenKeepValidTask(): void;
  stopTokenKeepValidTask(): void;
  getTokenWithDCConnectInfo(connectInfo: DCConnectInfo): Promise<void>;
  getUserInfoWithNft(nftAccount: string): Promise<any>;
  ifEnoughUserSpace(needSize?: number): Promise<any>;
  refreshUserInfo(): Promise<any>;
}

/**
 * 评论操作接口
 */
export interface ICommentOperations {
  addUserOffChainSpace(): Promise<any>;
  addThemeObj(theme: string, openFlag: number, commentSpace?: number): Promise<any>;
  addThemeSpace(theme: string, addSpace: number): Promise<any>;
  publishCommentToTheme(
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
    openFlag?: number
  ): Promise<any>;
  deleteSelfComment(theme: string, themeAuthor: string, commentKey: string): Promise<any>;
  getThemeObj(
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<any>;
  getThemeComments(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<any>;
  getUserComments(
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<any>;
}

/**
 * 数据库操作接口
 */
export interface IDatabaseOperations {
  initDBManager(): Promise<void>;
  newDB(
    name: string,
    b32Rk: string,
    b32Sk: string,
    jsonCollections: ICollectionConfig[]
  ): Promise<string>;
  syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]  
  ): Promise<void>;
  // createQuery(collectionName: string, threadId: string): Promise<any>;
  // createTransaction(threadId: string): Promise<any>;
}

/**
 * 消息操作接口
 */
export interface IMessageOperations {
  sendMsgToUserBox(receiver: string, msg: string): Promise<any>;
  getMsgFromUserBox(limit?: number): Promise<any>;
}

/**
 * 键值存储操作接口
 */
export interface IKeyValueOperations {
  vaCreateStoreTheme(themeAuthor: string, theme: string, space: number, type: number): Promise<any>;
  getCacheValue(key: string): Promise<string | null>;
  setCacheKey(value: string, expire?: number): Promise<any>;
}