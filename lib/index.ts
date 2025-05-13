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
import { FileManager } from "./file/manager";
import type { HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";
import { CommentManager } from "./comment/manager";
import { dcnet } from "./proto/dcnet_proto";
import { BrowserLineReader, readLine } from "./util/BrowserLineReader";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { dc_protocol, dial_timeout, keyExpire } from "./define";
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
import { KeyValueManager } from "./keyvalue/manager";
const { Buffer } = buffer;
const storagePrefix = "dc-";
const NonceBytes = 12;
const TagBytes = 16;

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
      // 如果链节点已经连接
      if (createChain) {
        this.dcNodeClient = await this.dcutil?._createHeliaNode();
        this.grpcServer = new DCGrpcServer(
          this.dcNodeClient.libp2p,
          dc_protocol
        );
        this.grpcServer.start();

        // todo 临时测试
        // const peerId = "12D3KooWAQjZAZ9fEuP6xJ4DJ1yeaKXPQqP2DTPrXvx9PSM1gnjW";
        // let nodeAddr = await this.dcutil?._getNodeAddr(peerId);
        // nodeAddr = multiaddr('/ip4/192.168.31.42/udp/4001/webrtc-direct/certhash/uEiBq5Ki7QE5Nl2IPWTOG52RNutWFaB3rfdIEgKAlVcFtHA/p2p/12D3KooWKfJGey3xUcTQ8bCokBxxudoDm3RAeCfdbuq2e34c7TWB')
        // 获取默认dc节点地址
        let nodeAddr = await this.dcutil?.getDefaultDcNodeAddr();
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
          // 获取存储的token
          this.getSavedToken(nodeAddr.getPeerId());
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
  // 获取存储的token
  private async getSavedToken(peerId: string){

    // 获取存储的pubkey
    const publicKeyString = await loadPublicKey();
    if(publicKeyString) {
      // 获取公钥
      const publicKey = Ed25519PubKey.pubkeyToEdStr(publicKeyString);
      this.publicKey = publicKey;
      // 获取token
      const token = await loadTokenWithPeerId(publicKeyString, peerId);
      if (token) {
        // 连接token还在
        this.connectedDc.client.token = token;
      }
      // token不在，说明换了节点，则重新获取
      await this.getTokenWithDCConnectInfo(this.connectedDc);
    }
  }

  // 签名,后续应该改成发送到钱包iframe中签名,发送数据包含payload和用户公钥
  sign = (payload: Uint8Array): Uint8Array => {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    const signature = this.privKey.sign(payload);
    return signature;
  };

  decrypt = async (content: Uint8Array) : Promise<Uint8Array> => {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    const decodeContent = await this.privKey.decrypt(content)
    return decodeContent; 
  }

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

  // 从dc网络获取指定文件
  getFile = async (cid: string, decryptKey: string) => {
    try {
      const fileManager = new FileManager(
        this.dcutil,
        this.connectedDc,
        this.dcChain,
        this.dcNodeClient,
        this
      );
      const fileContent = await fileManager.getFile(cid, decryptKey);
      return fileContent;
    } catch (error) {
      console.error("getFile error", error);
      return "";
    }
  };

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
  getCacheValue = async (key: string): Promise<string | null> => {
    const themeManager = new ThemeManager(this.connectedDc, this.dcutil);
    const res = await themeManager.getCacheValue(key);
    if (res[0]) {
      return res[0];
    }
    return null;
  };
  // 设置缓存值
  setCacheKey = async (value: string, expire?: number) => {
    const themeManager = new ThemeManager(
      this.connectedDc,
      this.dcutil,
      this.dcChain,
      this
    );
    const expireNumber = expire ? expire : keyExpire; // 默认一天
    const res = await themeManager.setCacheKey(value, expireNumber);
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
      this.dcutil,
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
      this.dcutil,
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
      this.dcutil,
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
  //    openFlag 开放标志 0-开放 1-私密
  //	  返回评论key,格式为:commentBlockHeight/commentCid
  publishCommentToTheme = async (
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
    openFlag?: number
  ) => {
    const commentManager = new CommentManager(
      this.dcutil,
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
      refercommentkey || "",
      openFlag,
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
      this.dcutil,
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
      this.dcutil,
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
    return res;
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
      this.dcutil,
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
    return res
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
      this.dcutil,
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
    return res;
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
    //todo remove
    console.log("newDB name:", name);
    console.log("newDB b32Rk:", b32Rk);
    console.log("newDB b32Sk:", b32Sk);
    console.log("newDB jsonCollections:", jsonCollections);
    //todo remove end
    // 创建数据库

   const [threadId,err] = await this.dbManager.newDB(name, b32Rk, b32Sk, jsonCollections);
   //todo remove 
   const tid = ThreadID.fromString(threadId);
   const db = await this.dbManager.getDB(tid);
   const userConnection = db.getCollection("person");
   const query = new Query();
  const user = await userConnection.find(query);
  for (let i = 0; i < user.length; i++) {
    console.log("id:",user[i]._id)
    console.log("name:",user[i].name)
    console.log("age:",user[i].age)
  }
    //todo remove end
    return threadId;
  }
  // createStoreTheme 创建一个存储主题,可以理解为创建一个数据库
  //
  //	themeAuthor 主题作者
  //	appId 存储主题所属组,可以自由指定,相当于对应的表,默认为DCAPP
  //	theme 存储主题
  //	Space 存储主题初始空间大小
  //	Type  存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权)
  //	返回res-0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
  async vaCreateStoreTheme (
    themeAuthor: string,
    theme: string,
    space: number,
    type: number,
  ){
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaCreateStoreTheme(
      this.appInfo.id,
      themeAuthor,
      theme,
      space,
      type
    )
    return res
  }

	// Va_ConfigThemeAuth 为存储主题配置访问授权,即可以设置哪些用户可以读取数据、可以写数据
	//	  themeAuthor 主题作者
	//	  Group 存储主题所属组,默认为DCAPP
	//    theme 存储主题
	//    authPubkey 用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
	//    permission 授权类型 0:无权限 1:读权限 2:读写权限 3:只写权限
	//    remark 备注,用户自定义
	// 返回是否配置成功
  async vaConfigThemeAuth (
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string
  ){
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaConfigThemeAuthForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      authPubkey,
      permission,
      remark
    )
    return res
  }

	// Va_ConfigThemeAuthForVAccount 为存储主题配置访问授权,即可以设置哪些用户可以读取数据、可以写数据,只有绑定了虚拟账号的用户才能配置
	//	  themeAuthor 主题作者
	//	  Group 存储主题所属组,默认为DCAPP
	//    theme 存储主题
	//    authPubkey 用户pubkey base32编码,或者pubkey经过libp2p-crypto protobuf编码后再base32编码
	//    permission 授权类型 0:无权限 1:读权限 2:读写权限 3:只写权限
	//    remark 备注,用户自定义
	//    virAccount 虚拟账号
	//    返回是否配置成功
  async vaConfigThemeAuthForVAccount (
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount: string
  ){
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaConfigThemeAuthForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      authPubkey,
      permission,
      remark,
      vaccount,
    )
    return res
  }


	// Va_GetThemeAuthList 获取存储主题的访问授权列表,查看存储主题的访问授权列表
	//
	//		theme 存储主题
	//		  themeAuthor  主题作者
	//		  group 存储主题所属组,默认为DCAPP
	//
	//	   返回存储主题的访问授权列表
  async vaGetThemeAuthList(
    themeAuthor: string,
    theme: string
  ){
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetThemeAuthListForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
    )
    return res
  }

	// Va_GetThemeAuthListForVAccount 获取存储主题的访问授权列表,查看存储主题的访问授权列表,只有绑定了虚拟账号的用户才能查看
	//		theme 存储主题
	//		  themeAuthor  主题作者
	//		  group 存储主题所属组,默认为DCAPP
	//		  virAccount 虚拟账号
	//	   返回存储主题的访问授权列表
  async vaGetThemeAuthListForVAccount(
    themeAuthor: string,
    theme: string,
    vaccount: string
  ){
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetThemeAuthListForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      vaccount,
    )
    return res
  }

	// Va_SetKeyValue 设置键值对,只有配置了权限的用户,才能设置键值对
	//
	//	themeAuthor 主题作者
	//	Group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	key 键
	//	value 值
	//	返回是否设置成功
  async vaSetKeyValue(
    themeAuthor: string,
    theme: string,
    key: string,
    value: string
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaSetKeyValueForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      key,
      value
    )
    return res
  }

	// Va_SetKeyValueForVAccount 设置键值对,只有配置了权限的用户,才能设置键值对,只有绑定了虚拟账号的用户才能设置
	//
	//	themeAuthor 主题作者
	//	Group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	key 键
	//	value 值
	//	virAccount 虚拟账号
	//	返回是否设置成功
  async vaSetKeyValueForVAccount(
    themeAuthor: string,
    theme: string,
    key: string,
    value: string,
    vaccount: string
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaSetKeyValueForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      key,
      value,
      vaccount,
    )
    return res
  }

	// Va_GetValueWithKey 获取键值对的值,如果是鉴权主题,则只有配置了权限的用户,才能获取键值对的值,
	//
	//	如果是公共主题,如NFT数据,则只对写账号鉴权,任何人都可以读
	//	themeAuthor 主题作者
	//	group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	writerPubkey 写入账号的pubkey
	//	key 键
	//	返回值
  async vaGetValueWithKey(
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetValueWithKeyForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      writerPubkey,
      key,
    )
    return res
  }

	// Va_GetValueWithKeyForVAccount 获取键值对的值,如果是鉴权主题,则只有配置了权限的用户,才能获取键值对的值,只有绑定了虚拟账号的用户才能获取
	//
	//	如果是公共主题,如NFT数据,则只对写账号鉴权,任何人都可以读
	//	themeAuthor 主题作者
	//	group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	writerPubkey 写入账号的pubkey
	//	key 键
	//	virAccount 虚拟账号
	//	返回值
  async vaGetValueWithKeyForVAccount(
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
    vaccount: string
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetValueWithKeyForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      writerPubkey,
      key,
      vaccount,
    )
    return res
  }

	// Va_GetValueWithKeys 批量获取键值对的值,如果是鉴权主题,则只有配置了权限的用户,才能获取键值对的值,
	//
	//	themeAuthor 主题作者
	//	group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	writerPubkey 写入账号的pubkey
	//	keys 键,逗号分隔
	//	返回值
  async vaGetValuesWithKeys(
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetValuesWithKeysForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      writerPubkey,
      keys,
    )
    return res
  }

	// Va_GetValuesWithKeysForVAccount 批量获取键值对的值,如果是鉴权主题,则只有配置了权限的用户,才能获取键值对的值,只有绑定了虚拟账号的用户才能获取
	//
	//	themeAuthor 主题作者
	//	group 存储主题所属组,默认为DCAPP
	//	theme 存储主题
	//	writerPubkey 写入账号的pubkey
	//	keys 键,逗号分隔
	//	virAccount 虚拟账号
	//	返回值
  async vaGetValuesWithKeysForVAccount(
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
    vaccount: string
  ) {
    const keyValueManager = new KeyValueManager(
      this.dcutil,
      this.connectedDc,
      this.AccountBackupDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await keyValueManager.vaGetValuesWithKeysForVAccount(
      this.appInfo.id,
      themeAuthor,
      theme,
      writerPubkey,
      keys,
      vaccount,
    )
    return res
  }
}
