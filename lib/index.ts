// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { KeyManager } from "./dc-key/keyManager";

import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { base32 } from "multiformats/bases/base32";
import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";

import { multiaddr, type Multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";

import { Query } from "./threaddb/db/query";
import {
  compareByteArrays,
  decryptContentForBrowser,
  loadPublicKey,
  loadTokenWithPeerId,
  mergeUInt8Arrays,
  savePublicKey,
  sha256,
  sleep,
  uint32ToLittleEndianBytes,
} from "./util/utils";
import { Ed25519PrivKey, Ed25519PubKey } from "./dc-key/ed25519";
import { decryptContent } from "./util/dccrypt";
import { ChainUtil } from "./chain";
import type { SignHandler, DCConnectInfo, APPInfo } from "./types/types";
import { Client } from "./dcapi";
import { DcUtil } from "./dcutil";
import { Errors } from "./error";
import { PublicKey } from "@libp2p/interface";
import { DCManager } from "./dc/manager";
import { ThemeManager } from "./theme/manager";
import { AccountManager } from "./account/manager";
import { CommonClient } from "./commonclient";
import { FileManager, MediaController } from "./file/manager";
import type { HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";
import { CommentManager } from "./comment/manager";
import { dcnet } from "./proto/dcnet_proto";
import { BrowserLineReader, readLine } from "./util/BrowserLineReader";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { dc_protocol, dial_timeout } from "./define";
import { MessageManager } from "./message/manager";
import { DBManager } from "./threaddb/dbmanager";
import { createTxnDatastore } from "./threaddb/common/idbstore-adapter";
import { cidNeedConnect } from "./constants";
import { DCGrpcServer } from "./threaddb/net/grpcserver";

import { ThreadID } from "@textile/threads-id";
import { Network } from "./threaddb/net/net";
import { newLogstore } from "./threaddb/common/logstore";
import { newKeyBook } from "./threaddb/lsstoreds/keybook";
import { newAddrBook } from "./threaddb/lsstoreds/addr_book";
import { newHeadBook } from "./threaddb/lsstoreds/headbook";
import { newThreadMetadata } from "./threaddb/lsstoreds/metadata";
import { dagCbor } from "@helia/dag-cbor";
import { ICollectionConfig } from "./threaddb/core/core";
import * as buffer from "buffer/";
import { SeekableFileStream } from "./file/seekableFileStream";
const { Buffer } = buffer;
const storagePrefix = "dc-";
const NonceBytes = 12;
const TagBytes = 16;

/**
 * 注册 Service Worker 并设置消息监听器
 * @param dc DC实例，用于处理IPFS请求
 * @returns Promise<ServiceWorkerRegistration | null>
 */
async function  registerServiceWorker(dc?: DC): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register(
      new URL('/sw.js', import.meta.url).href
    ).then(registration => {
      console.log('ServiceWorker 注册成功:', registration.scope);
      
      // 设置消息监听器处理IPFS资源请求
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'ipfs-fetch') {
           await handleIpfsRequest(event.data, event.ports[0], dc);
        }
      });
      
      return registration;
    }).catch(error => {
      console.error('ServiceWorker 注册失败:', error);
      return null;
    });
  }
  return Promise.reject('Service Worker not supported');
}


/**
 * 处理来自Service Worker的IPFS资源请求
 * @param data 请求数据，包含路径和范围信息
 * @param port 通信端口
 * @param dc DC实例
 */
async function handleIpfsRequest(data: any, port: MessagePort, dc?: DC) {
  const { id, pathname, range } = data;
  let fileSize = 0;
  
  try {
    // 从路径提取IPFS路径和解密密钥
    const pathParts = pathname.split('/');
    let ipfsPath = pathParts[3]; // <ipfs-hash>[_<key>]
    
    // 提取加密密钥（如果有）
    let decryptKey = '';
    const keyParts = ipfsPath.split('_');
    if (keyParts.length > 1) {
      ipfsPath = keyParts[0];
      decryptKey = keyParts[1];
    }
    
    let fileData: Uint8Array | null = null;
    const DEFAULT_CHUNK_SIZE = 3 * 1024 * 1024; // 默认返回3MB数据块
    let start = 0;
    let end = 0;
    if (dc) {
      if (range) {
        // 处理范围请求（视频跳转等）
        try {
          const fileStream = await dc.getSeekableFileStream(ipfsPath, decryptKey);
          fileSize = fileStream.getSize();
          if (fileStream) {
            const match = range.match(/bytes=(\d+)-(\d+)?/);
            if (match) {
               start = parseInt(match[1]);
               end = match[2] ? parseInt(match[2]) : start + DEFAULT_CHUNK_SIZE-1;
              if (end >= fileSize) {
                // 如果请求的结束范围超过文件大小，则调整为文件大小
                end = fileSize - 1;
              }
              console.log(`处理范围请求: ${start}-${end}, 总大小: ${fileStream.getSize()}`);
              fileStream.seek(start);
              fileData = await fileStream.read(end - start + 1);


              console.log("***************解密数据块大小11111:", fileData.length);
              
              // 如果读取到文件末尾，清理缓存
              if (end >= fileStream.getSize() - 1) {
                console.log(`文件读取完成，清理缓存: ${pathname}`);
                dc.clearFileCache(pathname);
              }
            }
          }
        } catch (err) {
          console.error('文件流操作失败:', err);
          // 发生错误时清理缓存
          dc.clearFileCache(pathname);
          port.postMessage({
            success: false,
            error: err instanceof Error ? err.message : 'File stream operation failed'
          });
          return;
        }
      } else {
        // 普通文件请求
        fileData = await dc.getFileFromDc(ipfsPath, decryptKey);
        fileSize = fileData ? fileData.length : 0;
        // 非范围请求的文件读取完成后，清理缓存
        dc.clearFileCache(pathname);
      }
      if (!fileData) {
        port.postMessage({
          success: false,
          error: 'no data',
        });
        return 
      }
      console.log("***************解密数据块大小1112222:", fileData.length);
      if (fileData && fileData.buffer) {
        // 创建不包含 buffer 的基本响应对象
        const responseObj = {
          success: true,
          status: range ? 206 : 200,
          headers: {
            'Content-Range': range ? `bytes ${start}-${end}/${fileSize}` : undefined,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Content-Length': fileData.length,
          },
        };
        
        // 传递时才添加 data 字段
        // 注意：在这个方法里 fileData.buffer 被转移后，fileData 将不再可用
        port.postMessage({
          ...responseObj,
          data: fileData.buffer
        }, [fileData.buffer]);
      
        // 手动清除引用
        fileData = null;
      } else {
        port.postMessage({
          success: false,
          error: 'Missing data buffer'
        });
      }
      
    } else {
      // DC实例不可用
      port.postMessage({
        success: false,
        error: 'DC instance not available'
      });
    }
  } catch (error) {
    console.error('处理IPFS请求失败:', error);
    // 全局错误捕获时也清理缓存
    if (dc && pathname) {
      dc.clearFileCache(pathname);
    }
    port.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


export class DC implements SignHandler {
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: HeliaLibp2p<Libp2p<any>>; // 什么类型？dc node 对象，主要用于建立连接
  dcutil: DcUtil;
  privKey: Ed25519PrivKey | undefined; // 私钥
  publicKey: Ed25519PubKey | undefined;


  public TokenTask: boolean = false;
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public Identity: string = "";
  public Blockheight: number = 0;
  public grpcServer: DCGrpcServer;
  public appInfo: APPInfo;
  public dbManager: DBManager;
    // 文件管理器缓存
  private fileManager: FileManager | undefined;
   // 文件缓存相关属性
   private seekableFileStreamCache: Map<string, {
    stream: SeekableFileStream,
    lastAccessTime: number
  }> = new Map();
 private readonly CACHE_TIMEOUT = 100000; // 100秒超时
  private cacheCleanupInterval: NodeJS.Timeout | null = null;
  
  
  
  constructor(options: {
    wssUrl: string;
    backWssUrl: string;
    appInfo: APPInfo;
  }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.dcutil = new DcUtil(this.dcChain);
    this.appInfo = options.appInfo;
  }

  // 初始化
  init = async () => {
    let createChain = false;
    try {
      createChain = await this.dcChain.create(this.blockChainAddr);
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.error("dcchainapi init failed");
          return;
        }
      }
    } catch (error) {
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.error("dcchainapi init failed");
          return;
        }
      }
    } finally {
       // 注册 Service Worker，并传入当前 DC 实例
       try {
        // 启动缓存清理定时任务
        this.startCacheCleanupTask();
        await registerServiceWorker(this);
        console.log('Service Worker 已注册');
      } catch (err) {
        console.warn('Service Worker 注册失败:', err);
      }
      // 如果链节点已经连接
      if (createChain) {
        this.dcNodeClient = await this.dcutil?._createHeliaNode();
        this.grpcServer = new DCGrpcServer(
          this.dcNodeClient.libp2p,
          dc_protocol
        );
        this.grpcServer.start();

        // todo 临时测试
         const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
         let nodeAddr = await this.dcutil?._getNodeAddr(peerId);
        // nodeAddr = multiaddr('/ip4/192.168.31.42/udp/4001/webrtc-direct/certhash/uEiBq5Ki7QE5Nl2IPWTOG52RNutWFaB3rfdIEgKAlVcFtHA/p2p/12D3KooWKfJGey3xUcTQ8bCokBxxudoDm3RAeCfdbuq2e34c7TWB')
        // 获取默认dc节点地址
       // let nodeAddr = await this.dcutil?.getDefaultDcNodeAddr();
        if (nodeAddr) {
          console.log("--------nodeAddr---------", nodeAddr.toString());
          const connection = await this.dcNodeClient?.libp2p.dial(nodeAddr, {
            signal: AbortSignal.timeout(dial_timeout),
          });
          this.connectedDc.nodeAddr = nodeAddr; // 当前地址
          this.connectedDc.client = await this.newDcClient(nodeAddr);
          console.log("--------connection---------", connection);
          console.log(
            "libp2p 已连接节点列表:",
            Object.keys(this.dcNodeClient.libp2p.getPeers())
          );
          console.log(
            "libp2p 已连接连接列表:",
            Object.keys(this.dcNodeClient.libp2p.getConnections())
          );
          // 获取存储的pubkey
          const publicKeyString = await loadPublicKey();
          if(publicKeyString) {
            // 获取公钥
            const publicKey = Ed25519PubKey.pubkeyToEdStr(publicKeyString);
            this.publicKey = publicKey;
            // 获取token
            const token = await loadTokenWithPeerId(publicKeyString, nodeAddr.getPeerId());
            if (token) {
              // 连接token还在
              this.connectedDc.client.token = token;
            }
            // token不在，说明换了节点，则重新获取
            await this.getTokenWithDCConnectInfo(this.connectedDc);
          }
          await sleep(5000);
        }
        // console.log("--------dial success begin---------");
        // this.dcNodeClient.libp2p.getMultiaddrs().forEach((addr) => {
        //   console.log("--------addr---------", addr.toString());
        // });
        // console.log("--------dial success end---------");

        // 定时维系token
        this.startDcPeerTokenKeepValidTask();
      }
    }
    
  
  };

  // 签名,后续应该改成发送到钱包iframe中签名,发送数据包含payload和用户公钥
  sign = (payload: Uint8Array): Uint8Array => {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    const signature = this.privKey.sign(payload);
    return signature;
  };

  getPublicKey(): Ed25519PubKey {
    if (!this.publicKey) {
      throw new Error("publicKey is null");
    }
    return this.publicKey;
  }

  getPubkeyRaw() {
    if (!this.publicKey) {
      throw new Error("public key is not initialized");
    }
    const pubKey = this.publicKey;
    return pubKey.raw;
  }

   /**
   * 获取或创建文件管理器
   */
   private getFileManager(): FileManager {
    if (!this.fileManager) {
      this.fileManager = new FileManager(
        this.dcutil,
        this.connectedDc,
        this.dcChain,
        this.dcNodeClient,
        this
      );
    }
    return this.fileManager;
  }
  
  /**
   * 根据路径获取或创建可寻址文件流，带缓存功能
   * @param ipfsPath IPFS路径
   * @param decryptKey 解密密钥
   * @returns SeekableFileStream 可寻址文件流
   */
  async getSeekableFileStream(ipfsPath: string, decryptKey: string): Promise<SeekableFileStream> {
    const cacheKey = `${ipfsPath}_${decryptKey}`;
    
    // 检查缓存中是否存在
    const cachedItem = this.seekableFileStreamCache.get(cacheKey);
    
    if (cachedItem) {
      console.log(`使用缓存的 SeekableFileStream: ${cacheKey}`);
      // 更新最后访问时间
      cachedItem.lastAccessTime = Date.now();
      return cachedItem.stream;
    } else {
      console.log(`创建新的 SeekableFileStream: ${cacheKey}`);
      const fileManager = this.getFileManager();
      const fileStream = await fileManager.createSeekableFileStream(ipfsPath, decryptKey);
      
      if (fileStream) {
        // 将新创建的流保存到缓存，并记录访问时间
        this.seekableFileStreamCache.set(cacheKey, {
          stream: fileStream,
          lastAccessTime: Date.now()
        });
      }
      
      return fileStream;
    }
  }
  
  /**
   * 清理文件缓存
   * @param pathname 可选，指定要清理的路径
   */
  public clearFileCache(pathname?: string): void {
    if (pathname) {
      // 清理特定路径的缓存
      const pathParts = pathname.split('/');
      let ipfsPath = pathParts[3]; 
      const keyParts = ipfsPath.split('_');
      if (keyParts.length > 1) {
        ipfsPath = keyParts[0];
        const decryptKey = keyParts[1];
        const cacheKey = `${ipfsPath}_${decryptKey}`;
        this.seekableFileStreamCache.delete(cacheKey);
        console.log(`清理特定缓存: ${cacheKey}`);
      }
    } else {
      // 清理所有缓存
      this.seekableFileStreamCache.clear();
      console.log('清理所有文件缓存');
    }
  }
  
  /**
   * 启动定时缓存清理任务
   * 超过10秒未访问的流将被释放
   */
  private startCacheCleanupTask(): void {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
    }
    
    this.cacheCleanupInterval = setInterval(() => {
      const now = Date.now();
      let removedCount = 0;
      
      // 检查所有缓存项是否超时
      for (const [key, value] of this.seekableFileStreamCache.entries()) {
        if (now - value.lastAccessTime > this.CACHE_TIMEOUT) {
          // 超过10秒没有访问，释放资源
          console.log(`缓存超时，释放资源: ${key}`);
          this.seekableFileStreamCache.delete(key);
          removedCount++;
        }
      }
      
      if (removedCount > 0 || this.seekableFileStreamCache.size > 0) {
        console.log(`文件缓存清理: 移除 ${removedCount} 项，剩余 ${this.seekableFileStreamCache.size} 项`);
      }
    }, 5000); // 每5秒检查一次超时缓存
  }
  
  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    try {
      const fileManager = new FileManager(
        this.dcutil,
        this.connectedDc,
        this.dcChain,
        this.dcNodeClient,
        this
      );
      const fileContent = await fileManager.getFileFromDc(cid, decryptKey);
      return fileContent;
    } catch (error) {
      console.error("getFileFromDc error", error);
      return ;
    }
  };

  createFileStream = async (
    cid: string,
    decryptKey: string
  ): Promise< ReadableStream<Uint8Array>| null> => {
    const fileManager = new FileManager(
      this.dcutil,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const fileStream = await fileManager.createSeekableFileStream(
      cid,
      decryptKey
    );
    return fileStream.createReadableStream();
  }






  /// <reference path = "dcnet_pb.d.ts" />

  // 获取hostid
  getHostID = async (): Promise<
    [{ peerID: string; reqAddr: string } | null, Error | null]
  > => {
    const dcManager = new DCManager(this.connectedDc);
    const res = await dcManager.getHostID();
    return res;
  };
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (key: string): Promise<string | null> => {
    const themeManager = new ThemeManager(this.connectedDc, this.dcutil);
    const res = await themeManager.getCacheValue(key);
    if (res[0]) {
      return res[0];
    }
    return null;
  };
  // 设置缓存值
  setCacheKey = async (value: string) => {
    const themeManager = new ThemeManager(
      this.connectedDc,
      this.dcutil,
      this.dcChain,
      this
    );
    const res = await themeManager.setCacheKey(value);
    return res;
  };
  // 登陆
  accountLogin = async (
    nftAccount: string,
    password: string,
    safecode: string
  ) => {
    //登录accountLogin
    if (!this.connectedDc?.client) {
      throw new Error("dcClient is null");
    }
    const commonClient = new CommonClient(this.connectedDc.client);
    const privKey = await commonClient.accountLogin(
      nftAccount,
      password,
      safecode,
      this.appInfo?.id || ""
    );
    if (privKey) {
      this.privKey = privKey;
      // 保存公钥
      const pubkey = this.privKey.publicKey;
      this.publicKey = pubkey;
      await savePublicKey(pubkey.string());
      // 获取token
      const token = await this.connectedDc?.client.GetToken(
        pubkey.string(),
        (payload: Uint8Array): Uint8Array => {
          return this.sign(payload);
        }
      );

      if (!token) {
        throw new Error("GetToken error");
      }
      // 存在token， 获取用户备用节点
      this.getAccountBackupDc();
    }
    return true;
  };
  private async getAccountBackupDc() {
    // 存在token， 获取用户备用节点
    const accountManager = new AccountManager(
      this.connectedDc,
      this.dcutil,
      this.dcChain,
      this
    );
    const reply = await accountManager.getAccountNodeAddr();
    if (reply && reply[0]) {
      const nodeAddr = reply[0];
      this.AccountBackupDc.nodeAddr = nodeAddr; // 当前地址
      this.AccountBackupDc.client = await this.newDcClient(nodeAddr);
    }
  }

  // 退出登陆
  // accountLogout = async () => {
  //   if (!this.connectedDc.client) {
  //     console.log("dcClient is null");
  //     return;
  //   }
  //   if (!this.connectedDc.nodeAddr) {
  //     console.log("nodeAddr is null");
  //     return;
  //   }
  //   const logoutReply = await this.connectedDc.client.AccountLogout(
  //     this.connectedDc.nodeAddr
  //   );
  //   console.log("AccountLogout reply:", logoutReply);
  //   return logoutReply;
  // };

  // 获取用户信息
  getUserInfoWithNft = async (nftAccount: string) => {
    const accountManager = new AccountManager(
      this.connectedDc,
      this.dcutil,
      this.dcChain
    );
    const userInfo = await accountManager.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return userInfo;
  };

  ifEnoughUserSpace = async (needSize?: number) => {
    const pubkeyRaw = this.getPubkeyRaw();
    return this.dcChain.ifEnoughUserSpace(pubkeyRaw, needSize);
  };

  refreshUserInfo = async () => {
    const pubkeyRaw = this.getPubkeyRaw();
    return this.dcChain.refreshUserInfo(pubkeyRaw);
  };

  getBlockHeight = async () => {
    return this.dcChain.getBlockHeight();
  };

  // todo
  // 获取用户数据列表

  // 添加用户评论空间
  addUserOffChainSpace = async () => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.addUserOffChainSpace();
    console.log("AddUserOffChainSpace res:", res);
    return res;
  };

  // Comment_AddThemeObj 为指定对象开通评论功能，
  //    Theme 要开通评论对象的cid
  //    openFlag 开放标志 0-开放 1-私密
  //    commentSpace 评论空间大小
  //    返回res-0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
  addThemeObj = async (
    theme: string,
    openFlag: number,
    commentSpace?: number
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.addThemeObj(
      this.appInfo?.id || "",
      theme,
      openFlag,
      commentSpace || 20 * 1024 * 1024 // 20M
    );
    console.log("addThemeObj res:", res);
    return res;
  };

  // Comment_AddThemeSpace 为开通评论的对象增加评论空间，
  //    Theme 要开通评论对象的cid
  //    commentSpace 评论空间大小
  //    返回 res-0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
  addThemeSpace = async (theme: string, addSpace: number) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.addThemeSpace(
      this.appInfo?.id || "",
      theme,
      addSpace
    );
    console.log("addThemeSpace res:", res);
    return res;
  };

  // Comment_PublishCommentToTheme 发布对指定对象的评论
  //    Theme 被评论对象ID
  //    ThemeAuthor 被发布评论的对象的用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
  //    commentType:评论类型 0:普通评论 1:点赞 2:推荐 3:踩
  //    comment 评论内容
  //    referCommentkey 被引用的评论
  //    openFlag 开放标志 0-开放 1-私密 // todo ?这里没有
  //	  返回评论key,格式为:commentBlockHeight/commentCid
  publishCommentToTheme = async (
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.publishCommentToTheme(
      this.appInfo?.id || "",
      theme,
      themeAuthor,
      commentType,
      comment,
      refercommentkey || ""
    );
    console.log("publishCommentToTheme res:", res);
    return res;
  };

  // todo
  // Comment_DeleteSelfComment 删除已发布的评论
  //    Theme 被评论对象ID
  //    objAuthor 被发布评论的对象的用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
  //    commentKey 要删除的评论key,格式为:commentBlockHeight/commentCid
  //    返回是否删除成功
  deleteSelfComment = async (
    theme: string,
    themeAuthor: string,
    commentKey: string
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.deleteSelfComment(
      this.appInfo?.id || "",
      theme,
      themeAuthor,
      commentKey
    );
    console.log("deleteSelfComment res:", res);
    return res;
  };

  private handleThemeObj = async (fileContentString: string) => {
    const reader = new BrowserLineReader(fileContentString);

    let allContent: Array<{
      theme: string;
      appId: string;
      blockheight: number;
      commentSpace: number;
      allowSpace: number;
      userPubkey: string;
      openFlag: number;
      signature: string;
      CCount: number;
      UpCount: number;
      DownCount: number;
      TCount: number;
      vaccount: string;
    }> = [];
    // readLine 循环
    while (true) {
      const { line, error } = readLine(reader);
      if (error && error.message !== "EOF") {
        console.error("读取错误:", error);
        break;
      } else if (line) {
        // 将Uint8Array转回字符串
        const decoder = new TextDecoder();
        const lineString = decoder.decode(line);
        console.log("读取的行:", lineString);
        if (!lineString) {
          console.error("结束");
          break;
        }
        const fileContentUint8Array = base32.decode(lineString);
        const content = dcnet.pb.AddThemeObjRequest.decode(
          fileContentUint8Array
        );
        console.log("content:", content);
        allContent.push({
          theme: uint8ArrayToString(content.theme),
          appId: uint8ArrayToString(content.appId),
          blockheight: content.blockheight,
          commentSpace: content.commentSpace,
          allowSpace: content.allowSpace,
          userPubkey: uint8ArrayToString(content.userPubkey),
          openFlag: content.openFlag,
          signature: bytesToHex(content.signature),
          CCount: content.CCount,
          UpCount: content.UpCount,
          DownCount: content.DownCount,
          TCount: content.TCount,
          vaccount: uint8ArrayToString(content.vaccount),
        });
      }
    }
    return allContent;
  };

  // todo
  // Comment_GetCommentableObj 获取指定用户已开通评论的对象列表
  //    objAuthor 被发布评论的对象的用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
  //    startBlockheight 开始区块高度
  //    direction 方向 0:向前 1:向后
  //    offset 偏移量
  //    seekKey 起始key
  //    limit 限制条数
  //	  返回已开通评论的对象列表,格式：[{"Theme":"YmF...bXk=","appId":"dGVzdGFwcA==","blockheight":2904,"commentSpace":1000,"userPubkey":"YmJh...vZGU=","signature":"oCY1...Y8sO/lkDac/nLu...Rm/xm...CQ=="}]
  getThemeObj = async (
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getThemeObj(
      this.appInfo?.id || "",
      themeAuthor,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || ""
    );
    console.log("getThemeObj res:", res);

    if (res[0] == null) {
      return ["", null];
    }
    const fileManager = new FileManager(
      this.dcutil,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(
      cid,
      "",
      cidNeedConnect.NOT_NEED
    );
    if (!fileContent) {
      return ["", null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this.handleThemeObj(fileContentString);
    console.log("getThemeObj allContent:", allContent);
    return [allContent, null];
  };
  private handleThemeComments = async (fileContentString: string) => {
    const reader = new BrowserLineReader(fileContentString);
    let allContent: Array<{
      theme: string;
      appId: string;
      themeAuthor: string;
      blockheight: number;
      userPubkey: string;
      commentCid: string;
      comment: string;
      commentSize: number;
      status: number;
      refercommentkey: string;
      CCount: number;
      UpCount: number;
      DownCount: number;
      TCount: number;
      type: number;
      signature: string;
      vaccount: string;
    }> = [];
    if (!this.publicKey) {
      return;
    }
    // readLine 循环
    while (true) {
      const { line, error } = readLine(reader);
      if (error && error.message !== "EOF") {
        console.error("读取错误:", error);
        break;
      } else if (line) {
        // 将Uint8Array转回字符串
        const decoder = new TextDecoder();
        const lineString = decoder.decode(line);
        console.log("读取的行:", lineString);
        if (!lineString) {
          console.error("结束");
          break;
        }
        const lineContent = base32.decode(lineString);
        const plainContent = await this.privKey.decrypt(lineContent);
        const content =
          dcnet.pb.PublishCommentToThemeRequest.decode(plainContent);
        console.log("content:", content);

        allContent.push({
          theme: uint8ArrayToString(content.theme),
          appId: uint8ArrayToString(content.appId),
          themeAuthor: uint8ArrayToString(content.themeAuthor),
          blockheight: content.blockheight,
          userPubkey: uint8ArrayToString(content.userPubkey),
          commentCid: uint8ArrayToString(content.commentCid),
          comment: uint8ArrayToString(content.comment),
          commentSize: content.commentSize,
          status: content.status,
          refercommentkey: uint8ArrayToString(content.refercommentkey),
          CCount: content.CCount,
          UpCount: content.UpCount,
          DownCount: content.DownCount,
          TCount: content.TCount,
          type: content.type,
          signature: bytesToHex(content.signature),
          vaccount: bytesToHex(content.vaccount),
        });
      }
    }
    return allContent;
  };

  // todo
  // Comment_GetThemeComments 获取指定已开通对象的评论列表，私密评论只有评论者和被评论者可见
  //    Theme 被评论对象ID
  //    objAuthor 被发布评论的对象的用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
  //    startBlockheight 开始区块高度
  //    direction 方向 0:向前 1:向后
  //    offset 偏移量
  //    seekKey 起始key
  //    limit 限制条数
  //    返回对象下的评论列表，格式[{"Theme":"bafk...6q","AppId":"testapp","ThemeAuthor":"bba...6u","Blockheight":3116,"UserPubkey":"bba...y6u","CommentCid":"ba...aygu","Comment":"hello worldd","CommentSize":11,"Status":0,"Signature":"blo...cwpada","Refercommentkey":"","CCount":0,"UpCount":0,"DownCount":0,"TCount":0}]
  getThemeComments = async (
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getThemeComments(
      this.appInfo?.id || "",
      theme,
      themeAuthor,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || ""
    );
    console.log("getThemeComments res:", res);
    if (res[0] == null) {
      return ["", null];
    }
    const fileManager = new FileManager(
      this.dcutil,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(
      cid,
      "",
      cidNeedConnect.NOT_NEED
    );
    console.log("getThemeComments fileContent:", fileContent);
    if (!fileContent) {
      return ["", null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this.handleThemeComments(fileContentString);
    console.log("getThemeComments allContent:", allContent);
    return [allContent, null];
  };

  //todo
  // Comment_GetUserComments 获取指定用户发布过的评论，私密评论只有评论者和被评论者可见
  //    userPubkey 用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码或者账号的16进制编码(0x开头)
  //    startBlockheight 开始区块高度
  //    direction 方向 0:向前 1:向后
  //    offset 偏移量
  //    seekKey 起始key
  //    limit 限制条数
  //    返回用户评论列表，格式：[{"Theme":"bafk...fpy","AppId":"testapp","ThemeAuthor":"bbaa...jkhmm","Blockheight":3209,"UserPubkey":"bba...2hzm","CommentCid":"baf...2aygu","Comment":"hello world","CommentSize":11,"Status":0,"Signature":"bkqy...b6dkda","Refercommentkey":"","CCount":0,"UpCount":0,"DownCount":0,"TCount":0}]
  getUserComments = async (
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getUserComments(
      this.appInfo?.id || "",
      userPubkey,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || ""
    );
    console.log("getUserComments res:", res);
    if (res[0] == null) {
      return ["", null];
    }
    const fileManager = new FileManager(
      this.dcutil,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(
      cid,
      "",
      cidNeedConnect.NOT_NEED
    );
    console.log("getUserComments fileContent:", fileContent);
    if (!fileContent) {
      return ["", null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this.handleThemeComments(fileContentString);
    console.log("getUserComments allContent:", allContent);
    return [allContent, null];
  };

  // 发送消息到用户消息盒子
  sendMsgToUserBox = async (receiver: string, msg: string) => {
    const messageManager = new MessageManager(
      this.AccountBackupDc,
      this.dcutil,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const res = await messageManager.sendMsgToUserBox(
      this.appInfo?.id || "",
      receiver,
      msg
    );
    return res;
  };

  // 从用户消息盒子获取消息
  getMsgFromUserBox = async (limit?: number) => {
    const messageManager = new MessageManager(
      this.AccountBackupDc,
      this.dcutil,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const res = await messageManager.getMsgFromUserBox(
      this.appInfo?.id || "",
      limit
    );
    return res;
  };

  /**
   * 开启定时验证 token 线程
   * 对应 Go 中的 dcPeerTokenKeepValidTask()
   */
  private startDcPeerTokenKeepValidTask(): void {
    // 如果已经有定时任务在跑，直接返回
    if (this.TokenTask) {
      return;
    }
    this.TokenTask = true;

    // 30秒一次心跳维持连接
    const period = 10000;
    let count = 0;

    // 启动ticker
    (async () => {
      while (this.TokenTask) {
        count++;
        console.info(
          `********** 定时验证token任务开始执行, 当前次数: ${count} **********`
        );
        await this.getTokenWithDCConnectInfo(this.connectedDc);
        await this.getTokenWithDCConnectInfo(this.AccountBackupDc);
        await sleep(period);
      }
    })();
  }

  private newDcClient = async (nodeAddr: Multiaddr): Promise<Client | undefined> => {
    if (!this.connectedDc.nodeAddr) {
      return;
    }
    const dcClient = new Client(
      this.dcNodeClient.libp2p,
      this.dcNodeClient.blockstore,
      nodeAddr,
      dc_protocol
    );
    return dcClient;
  };
  private async getTokenWithDCConnectInfo(connectInfo: DCConnectInfo) {
    try {
      // 判断 client 是否为空
      if (!connectInfo.client) {
        return;
      }
      // 判断 client 是否连接，不连接则需要连接
      if (
        !connectInfo.client?.p2pNode ||
        connectInfo.client?.p2pNode.status !== "started"
      ) {
        try {
          const nodeAddr = connectInfo.client?.peerAddr;
          if (!nodeAddr) {
            console.error("nodeAddr is null");
            return;
          }
          console.log("newDcClient start ");
          connectInfo.client = await this.newDcClient(nodeAddr);
          console.log("newDcClient end ");
        } catch (e) {
          console.error("connectInfo failed", e);
          return;
        }
      }
    } catch (error) {
      console.error("error111 failed", error);
      return;
    }

    // 判断 token 是否为空
    if (!connectInfo.client?.token) {
      // 直接获取token
      if (!this.publicKey) {
        return;
      }
      console.log("get token start ");
      await connectInfo.client?.GetToken(
        this.publicKey.string(),
        (payload: Uint8Array): Uint8Array => {
          return this.sign(payload);
        }
      );
      console.log("get token end ");
      return;
    }

    // 调用 ValidToken
    try {
      console.log("ValidToken start ");
      await connectInfo.client?.ValidToken();
      console.log("ValidToken end ");
    } catch (err: any) {
      // 若 token 无效，需要刷新；否则重连
      if (err?.message && err.message.endsWith(Errors.INVALID_TOKEN.message)) {
        if (!this.publicKey) {
          return;
        }
        console.log("refreshToken start ");
        await connectInfo.client?.refreshToken(
          this.publicKey.string(),
          (payload: Uint8Array): Uint8Array => {
            // Implement your signCallback logic here
            const signature = this.sign(payload);
            return signature;
          }
        );
        console.log("refreshToken end ");
      } else {
        console.log("需要重连 start ");
        // 需要重连
        let resClient: Client | undefined;
        try {
          const nodeAddr = await this.dcutil?._getNodeAddr(
            connectInfo.nodeAddr?.getPeerId() as string
          );
          if (!nodeAddr) {
            console.error("nodeAddr is null");
            return;
          }
          resClient = await this.newDcClient(nodeAddr);
          if (!resClient) {
            console.error("resClient is null");
            return;
          }
        } catch (e: any) {
          console.debug(
            `GetClient失败, err: ${
              e?.message
            }, PEERID: ${connectInfo.nodeAddr?.getPeerId()}`
          );
          return;
        }

        if (resClient) {
          connectInfo.client = resClient;
        }
        try {
          // 直接获取token
          if (!this.publicKey) {
            return;
          }
          console.log("GetToken start ");
          await connectInfo.client?.GetToken(
            this.publicKey.string(),
            (payload: Uint8Array): Uint8Array => {
              return this.sign(payload);
            }
          );
          console.log("GetToken end ");
        } catch (tokenErr: any) {
          console.debug(
            `获取token失败, err: ${
              tokenErr?.message
            }, PEERID: ${connectInfo.nodeAddr?.getPeerId()}`
          );
        }
      }
    }
  }
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: number, size: number) => void
  ) {
    const fileManager = new FileManager(
      this.dcutil,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const res = await fileManager.addFile(file, enkey, onUpdateTransmitSize);
    // console.log("addFile res:", res);
    return res;
  }

  async newDBManager(): Promise<void> {
    const tdatastore = await createTxnDatastore(this.appInfo.name);
    const keyBook = await newKeyBook(tdatastore);
    const addrBook = await newAddrBook(tdatastore);
    const headBook = newHeadBook(tdatastore);
    const threadMetadata = newThreadMetadata(tdatastore);
    const logstore = newLogstore(keyBook, addrBook, headBook, threadMetadata);
    const dagService = dagCbor(this.dcNodeClient);
    const n = name;
    if (!this.publicKey) {
      throw new Error("publicKey is null");
    }
    const net = new Network(
      this.dcutil,
      this.dcChain,
      this.dcNodeClient.libp2p,
      this.grpcServer,
      logstore,
      this.dcNodeClient.blockstore,
      dagService,
      this.privKey
    );
    const dbmanager = new DBManager(
      tdatastore,
      net,
      this.dcutil,
      this.connectedDc,
      {},
      this.dcChain,
      storagePrefix,
      this
    );
    this.dbManager = dbmanager;
    return;
  }

  async newDB(
    name: string,
    b32Rk: string,
    b32Sk: string,
    jsonCollections: ICollectionConfig[]
  ): Promise<string> {
    if (!this.dbManager) {
      await this.newDBManager()
    }
    // 创建数据库
   const [threadId,err] = await this.dbManager.newDB(name, b32Rk, b32Sk, jsonCollections);
    if (err) {
      console.error("newDB error", err);
      return "";
    }
    return threadId;
  }

  async syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: ICollectionConfig[]  
  ): Promise<void> {
    if (!this.dbManager) {
      await this.newDBManager()
    }
  await this.dbManager.syncDBFromDC(null,
      threadid,dbname,dbAddr,b32Rk,b32Sk,block,collectionInfos
    );
  }

}
