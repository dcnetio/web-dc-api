// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { KeyManager } from "./dc-key/keyManager";

import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { base32 } from 'multiformats/bases/base32' 
import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";

import { multiaddr, type Multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";
import * as buffer from "buffer/";
import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sha256,
  sleep,
  uint32ToLittleEndianBytes,
} from "./util/utils";
import { Ed25519PrivKey, Ed25519PubKey } from "./dc-key/ed25519";
import { decryptContent } from "./util/dccrypt";
import { ChainUtil } from "./chain";
import type { SignHandler, DCConnectInfo } from "./types/types";
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
import { cidNeedConnect } from "./util/contant";
import { dcnet } from "./proto/dcnet_proto";
import { BrowserLineReader, readLine } from "./util/BrowserLineReader";
import { bytesToHex } from "@noble/curves/abstract/utils";
import {dc_protocol} from "./define";
import { BCManager } from "./bc/manager";
import { MessageManager } from "./message/manager";
import {DBManager} from "./threaddb/dbmanager";
import {createTxnDatastore} from "./threaddb/common/idbstore-adapter";
import {App,Connector}  from "./threaddb/core/app";
import { ThreadID } from '@textile/threads-id';

const NonceBytes = 12;
const TagBytes = 16;

const { Buffer } = buffer;
export class DC  implements SignHandler {
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: HeliaLibp2p<Libp2p<any>>; // 什么类型？dc node 对象，主要用于建立连接
  dcutil: DcUtil;
  privKey: Ed25519PrivKey | undefined; // 私钥

  public TokenTask: boolean = false;
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public AppId: string = "";
  public Identity: string = "";
  public Blockheight: number = 0;

  constructor(options: { wssUrl: string; backWssUrl: string }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.dcutil = new DcUtil(this.dcChain);
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
          console.log("dcchainapi init failed");
          return;
        }
      }
    } catch (error) {
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.log("dcchainapi init failed");
          return;
        }
      }
    } finally {
      // 如果链节点已经连接
      if (createChain) {
        this.dcNodeClient = await this.dc?._createHeliaNode();
       
        // todo 临时测试
        // const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
        // let nodeAddr = await this.dc?._getNodeAddr(peerId);
        // nodeAddr = multiaddr('/ip4/192.168.31.42/udp/4001/webrtc-direct/certhash/uEiBq5Ki7QE5Nl2IPWTOG52RNutWFaB3rfdIEgKAlVcFtHA/p2p/12D3KooWKfJGey3xUcTQ8bCokBxxudoDm3RAeCfdbuq2e34c7TWB')
        // 获取默认dc节点地址
        const nodeAddr = await this.dc?.getDefaultDcNodeAddr();
        if (nodeAddr) {
          console.log("--------nodeAddr---------", nodeAddr.toString());
          this.connectedDc.nodeAddr = nodeAddr; // 当前地址
          this.connectedDc.client = await this._newDcClient(nodeAddr);
          const connection =await this.dcNodeClient.libp2p.dial(nodeAddr);
          console.log("--------connection---------", connection);
          console.log('libp2p 已连接节点列表:', Object.keys(this.dcNodeClient.libp2p.getPeers()))
          console.log('libp2p 已连接连接列表:', Object.keys(this.dcNodeClient.libp2p.getConnections()))
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
  sign =  (payload: Uint8Array): Uint8Array => {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    const signature = this.privKey.sign(payload);
    return signature;
  }

  publickey(): Ed25519PubKey {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    return this.privKey.publicKey;
  }


  getPubkeyRaw() {
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    const pubKey = this.privKey.publicKey;
    return pubKey.raw;
  }


  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    try {
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.dcChain,
        this.dcNodeClient,
        this
      );
      const fileContent = await fileManager.getFileFromDc(cid, decryptKey);
      return fileContent;
    } catch (error) {
      console.log("error", error);
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
  getCacheValueFromDc = async (
    key: string
  ): Promise<string | null> => {
    const themeManager = new ThemeManager(this.connectedDc, this.dc);
    const res = await themeManager.getCacheValue(key);
    if(res[0]){
      return res[0]
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
  // register = async (
  //   appName: string
  // ) => {
  //   if (!this.connectedDc?.client) {
  //     throw new Error("dcClient is null");
  //   }
  //   const commonClient = new CommonClient(this.connectedDc.client);
  //   const privKey = await commonClient.register(appName);
  //   this.privKey = privKey;
  // };

  // 登陆
  accountLogin = async (
    nftAccount: string,
    password: string,
    safecode: string,
    appName: string
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
      appName
    );
    if (privKey) {
      this.privKey = privKey;
      // 获取token
      const pubkey =  this.privKey.publicKey;
      const token = await this.connectedDc?.client.GetToken(
        pubkey.string(),
        (payload: Uint8Array): Uint8Array => {
          return this.sign(payload);
        }
      );
      // todo 临时测试
      // if(this.connectedDc.nodeAddr) {
      //   const accountManager = new AccountManager(
      //     this.connectedDc,
      //     this.dc,
      //     this.dcChain,
      //     this,
      //   );
      //   accountManager.bindAccessPeerToUser(this.connectedDc.nodeAddr);
      // }

      if (!token) {
        throw new Error("GetToken error");
      }
      // 存在token， 获取用户备用节点
      const accountManager = new AccountManager(
        this.connectedDc,
        this.dcutil,
        this.dcChain,
        this,
      );
      const reply = await accountManager.getAccountNodeAddr();
      if (reply && reply[0]) {
        const nodeAddr = reply[0];
        this.AccountBackupDc.nodeAddr = nodeAddr; // 当前地址
        this.AccountBackupDc.client = await this._newDcClient(nodeAddr);
      }
    }
    return true;
  };

/**
 * 连接应用到指定线程
 * @param app 应用程序对象
 * @param id 线程ID
 * @returns 返回一个应用连接器
 * @throws 如果验证失败或获取线程信息出错则抛出异常
 */
async connectApp(app: App, id: ThreadID): Promise<Connector> {
  // 验证线程ID
 if (!id.isDefined()) {
   throw new Error("Invalid thread ID");
 }
  // 获取threaddb信息
  let info;
  try {
    info = await this.getThreadWithAddrs(id);
  } catch (err) {
    throw new Error(`Error getting thread ${id.toString()}: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  // 创建应用连接器
  let con;
  try {
    con =  new Connector(this, app, info);
  } catch (err) {
    throw new Error(`Error making connector ${id.toString()}: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  // 添加连接器到网络
  this.addConnector(id, con);
  
  return con;
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
      this.dc,
      this.dcChain
    );
    const userInfo = await accountManager.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return userInfo;
  };

  ifEnoughUserSpace = async (
    needSize?: number
  ) => {
    const bcManager = new BCManager(
      this.connectedDc,
      this.dcChain,
      this
    );
    return bcManager.ifEnoughUserSpace(needSize);
  }

  refreshUserInfo = async () => {
    const bcManager = new BCManager(
      this.connectedDc,
      this.dcChain,
      this
    );
    return bcManager.refreshUserInfo();
  };

  getBlockHeight = async () => {
    const bcManager = new BCManager(
      this.connectedDc,
      this.dcChain,
      this
    );
    return bcManager.getBlockHeight();
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
    appName: string,
    theme: string,
    openFlag:number,
    commentSpace?: number,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.addThemeObj(
      appName,
      theme,
      openFlag,
      commentSpace || 20 * 1024 * 1024, // 20M
    );
    console.log("addThemeObj res:", res);
    return res;
  };

	// Comment_AddThemeSpace 为开通评论的对象增加评论空间，
	//    Theme 要开通评论对象的cid
	//    commentSpace 评论空间大小
	//    返回 res-0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
  addThemeSpace = async (
    appName: string,
    theme: string,
    addSpace: number,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.addThemeSpace(
      appName,
      theme,
      addSpace,
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
    appName: string,
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.publishCommentToTheme(
      appName,
      theme,
      themeAuthor,
      commentType,
      comment,
      refercommentkey || '',
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
    appName: string,
    theme: string,
    themeAuthor: string,
    commentKey: string,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.deleteSelfComment(
      appName,
      theme,
      themeAuthor,
      commentKey,
    );
    console.log("deleteSelfComment res:", res);
    return res;
  };

  _handleThemeObj = async (
    fileContentString: string,
  ) => {
    const reader = new BrowserLineReader(fileContentString);  

    let allContent: Array<{
      theme: string,
      appId: string,
      blockheight: number,
      commentSpace: number,
      allowSpace: number,
      userPubkey: string,
      openFlag: number,
      signature: string,
      CCount: number,
      UpCount: number,
      DownCount: number,
      TCount: number,
      vaccount: string,
    }> = [];
    // readLine 循环
    while (true) {  
      const { line, error } = readLine(reader);  
      if (error && error.message !== 'EOF') {  
        console.error('读取错误:', error);  
        break;  
      } else if (line) {  
        // 将Uint8Array转回字符串  
        const decoder = new TextDecoder();  
        const lineString = decoder.decode(line);
        console.log('读取的行:', lineString);  
        if(!lineString) {
          console.error('结束');  
          break;  
        }
        const fileContentUint8Array = base32.decode(lineString)
        const content = dcnet.pb.AddThemeObjRequest.decode(fileContentUint8Array)
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
    appName: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getThemeObj(
      appName,
      themeAuthor,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || '',
    );
    console.log("getThemeObj res:", res);

    if(res[0] == null){
      return ['', null];
    }
    const fileManager = new FileManager(
      this.dc,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(cid, '', cidNeedConnect.NOT_NEED);
    if(!fileContent) {
      return ['', null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this._handleThemeObj(fileContentString);
    console.log("getThemeObj allContent:", allContent);
    return [allContent, null];
  };
  _handleThemeComments = async (
    fileContentString: string,
  ) => {
    const reader = new BrowserLineReader(fileContentString);  
    let allContent: Array<{
      theme: string,
      appId: string,
      themeAuthor: string,
      blockheight: number,
      userPubkey: string,
      commentCid: string,
      comment: string,
      commentSize: number,
      status: number,
      refercommentkey: string,
      CCount: number,
      UpCount: number,
      DownCount: number,
      TCount: number,
      type: number,
      signature: string,
      vaccount: string,
    }> = [];
    if (!this.privKey) {
      return;
    }
    // readLine 循环
    while (true) {  
      const { line, error } = readLine(reader);  
      if (error && error.message !== 'EOF') {  
        console.error('读取错误:', error);  
        break;  
      } else if (line) {  
        // 将Uint8Array转回字符串  
        const decoder = new TextDecoder();  
        const lineString = decoder.decode(line);
        console.log('读取的行:', lineString);  
        if(!lineString) {
          console.error('结束');  
          break;  
        }
        const lineContent = base32.decode(lineString)
        const plainContent = await this.privKey.decrypt(lineContent)
        const content = dcnet.pb.PublishCommentToThemeRequest.decode(plainContent)
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
    appName: string,
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getThemeComments(
      appName,
      theme,
      themeAuthor,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || '',
    );
    console.log("getThemeComments res:", res);
    if(res[0] == null){
      return ['', null];
    }
    const fileManager = new FileManager(
      this.dc,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(cid, '', cidNeedConnect.NOT_NEED);
    console.log("getThemeComments fileContent:", fileContent);
    if(!fileContent) {
      return ['', null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this._handleThemeComments(fileContentString);
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
    appName: string,
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string,
  ) => {
    const commentManager = new CommentManager(
      this.connectedDc,
      this.dcNodeClient,
      this.dcChain,
      this
    );
    const res = await commentManager.getUserComments(
      appName,
      userPubkey,
      startHeight || 0,
      direction || 0,
      offset || 0,
      limit || 100,
      seekKey || '',
    );
    console.log("getUserComments res:", res);
    if(res[0] == null){
      return ['', null];
    }
    const fileManager = new FileManager(
      this.dc,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const cid = Buffer.from(res[0]).toString();
    const fileContent = await fileManager.getFileFromDc(cid, '', cidNeedConnect.NOT_NEED);
    console.log("getUserComments fileContent:", fileContent);
    if(!fileContent) {
      return ['', null];
    }
    const fileContentString = uint8ArrayToString(fileContent);
    const allContent = await this._handleThemeComments(fileContentString);
    console.log("getUserComments allContent:", allContent);
    return [allContent, null];
  };


  // 发送消息到用户消息盒子
  sendMsgToUserBox = async (
    appName: string,
    receiver: string, 
    msg: string
  ) => {
    const messageManager = new MessageManager(
      this.AccountBackupDc, 
      this.dc, 
      this.dcChain, 
      this.dcNodeClient,
      this);
    const res = await messageManager.sendMsgToUserBox(appName, receiver, msg);
    return res;
    
  };

  /**
   * 开启定时验证 token 线程
   * 对应 Go 中的 dcPeerTokenKeepValidTask()
   */
  public startDcPeerTokenKeepValidTask(): void {
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
        await this._getTokenWithDCConnectInfo(this.connectedDc);
        await this._getTokenWithDCConnectInfo(this.AccountBackupDc);
        await sleep(period);
      }
    })();
  }

  _newDcClient = async (nodeAddr: Multiaddr): Promise<Client | undefined> => {
    if (!this.connectedDc.nodeAddr) {
      return;
    }
    const dcClient = new Client(this.dcNodeClient.libp2p, nodeAddr, dc_protocol);
    return dcClient;
  };
  async _getTokenWithDCConnectInfo(connectInfo: DCConnectInfo) {
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
            console.log("nodeAddr is null");
            return;
          }
          console.log("_newDcClient start ");
          connectInfo.client = await this._newDcClient(nodeAddr);
          console.log("_newDcClient end ");
        } catch (e) {
          console.log("connectInfo failed", e);
          return;
        }
      }
    } catch (error) {
      console.log("error111 failed", error);
      return;
    }

    // 判断 token 是否为空
    if (!connectInfo.client?.token) {
      // 直接获取token
      if (!this.privKey) {
        return;
      }
      const privKey = this.privKey;
      const pubKey = privKey.publicKey;
      console.log("get token start ");
      await connectInfo.client?.GetToken(
        pubKey.string(),
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
        if (!this.privKey) {
          return;
        }
        const privKey = this.privKey;
        const pubKey = privKey.publicKey;
        console.log("refreshToken start ");
        await connectInfo.client?.refreshToken(
          pubKey.string(),
          (payload: Uint8Array): Uint8Array => {
            // Implement your signCallback logic here
            const signature = privKey.sign(payload);
            return signature;
          }
        );
        console.log("refreshToken end ");
      } else {
        console.log("需要重连 start ");
        // 需要重连
        let resClient: Client | undefined;
        try {
          const nodeAddr = await this.dc?._getNodeAddr(
            connectInfo.nodeAddr?.getPeerId() as string
          );
          if (!nodeAddr) {
            console.log("nodeAddr is null");
            return;
          }
          resClient = await this._newDcClient(nodeAddr);
          if (!resClient) {
            console.log("resClient is null");
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
          if (!this.privKey) {
            return;
          }
          const privKey = this.privKey;
          const pubKey = privKey.publicKey;
          console.log("GetToken start ");
          await connectInfo.client?.GetToken(
            pubKey.string(),
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
      this.dc,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const res = await fileManager.addFile(file, enkey, onUpdateTransmitSize);
    // console.log("addFile res:", res);
    return res;
  }

  async newDB(
    name: string,
    b32Rk: string,  
    b32Sk: string,  
    jsonCollections: string 
  ): Promise<string> {
    const tdatastore = await createTxnDatastore(name)
    const dbmanager = new DBManager(
      tdatastore,
      this.dcNodeClient,
      this.dc,
      this.connectedDc,
      this.opts,
      this.chainUtil,
      this.storagePrefix
    )
    const db = await dbmanager.newDB(id, opts);
    return await DB.newDB(store, n, id, opts);
  }


/**
 * 获取线程信息并添加地址
 * @param id 线程ID
 * @returns 带有地址的线程信息
 * @throws 如果获取线程信息或创建组件失败则抛出异常
 */
async getThreadWithAddrs(id: ThreadID): Promise<ThreadInfo> {
  // 获取线程信息
  let tinfo: ThreadInfo;
  try {
    tinfo = await this.store.getThread(id);
  } catch (err) {
    throw new Error(`Failed to get thread: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  // 创建P2P组件
  let peerID;
  try {
    peerID = multiaddr.protocols.getProtocol('p2p').createComponent(this.host.ID().toString());
  } catch (err) {
    throw new Error(`Failed to create peer component: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  // 创建Thread组件
  let threadID;
  try {
    threadID = multiaddr.protocols.getProtocol('thread').createComponent(tinfo.id.toString());
  } catch (err) {
    throw new Error(`Failed to create thread component: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  // 获取主机地址并封装
  const addrs = this.host.getAddrs();
  const res: Multiaddr[] = [];
  
  for (const addr of addrs) {
    // 封装地址与peer ID和thread ID
    const encapsulatedAddr = addr.encapsulate(`/p2p/${this.host.ID().toString()}/thread/${tinfo.id.toString()}`);
    res.push(encapsulatedAddr);
  }
  
  // 更新线程信息中的地址
  tinfo.addrs = res;
  
  return tinfo;
}
}

