import { DCConnectInfo, ThemeAuthInfo, ThemeComment, ThemeObj } from "../../common/types/types";
import type { HeliaLibp2p } from "helia";
import { ChainUtil } from "../../common/chain";
import { base32 } from 'multiformats/bases/base32' 

import { DcUtil } from "../../common/dcutil";
import * as buffer from "buffer/";
import { extractPeerIdFromMultiaddr } from "../../common/dc-key/keyManager";
import { Multiaddr } from "@multiformats/multiaddr";
import { CommentClient } from "./client";
import { parseUint32, sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { FileManager } from "../file/manager";
import { cidNeedConnect } from "../../common/constants";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { BrowserLineReader, readLine } from "../../util/BrowserLineReader";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { publicKeyFromRaw } from "@libp2p/crypto/keys";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { CommentType, Direction } from "../../common/define";
import { SymmetricKey } from "../threaddb/common/key";
import { Libp2p } from "@libp2p/interface";
const { Buffer } = buffer;

// 创建一个可以取消的信号
const controller = new AbortController();
const { signal } = controller;

// 错误定义
export class CommentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommentError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new CommentError("no dc peer connected"),
  ErrNodeAddrIsNull: new CommentError("nodeAddr is null"),
  ErrNoFileChose: new CommentError("no file choose"),
  ErrNoPeerIdIsNull: new CommentError("peerId is null"),
  ErrAddThemeObj: new CommentError("add theme obj error"),
  ErrPublishCommentToTheme: new CommentError("publish comment error"),
  // 评论空间没有配置
  ErrCommentSpaceNotConfig: new CommentError("comment space not config"),
  // 评论数据同步中
  ErrCommentDataSync: new CommentError("comment data sync"),
  // publickey is null
  ErrPublicKeyIsNull: new CommentError("publickey is null"),
};

export class CommentManager {
  dc: DcUtil;
  connectedDc: DCConnectInfo = {};
  accountBackupDc: DCConnectInfo = {};
  dcNodeClient: HeliaLibp2p<Libp2p>;
  chainUtil: ChainUtil;
  context:DCContext
  constructor(
    context: DCContext,
  ) {
    this.dc = context.dcutil;
    this.connectedDc = context.connectedDc;
    this.accountBackupDc = context.AccountBackupDc;
    this.dcNodeClient = context.dcNodeClient;
    this.chainUtil = context.dcChain;
    this.context = context;
  }

  // 配置或增加用户自身的评论空间 0:成功  1:失败
  async addUserOffChainSpace(): Promise<[boolean | null, Error | null]> {
    try {
      if (!this.accountBackupDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.accountBackupDc?.nodeAddr) {
        return [null, Errors.ErrNodeAddrIsNull];
      }
      const peerAddr = this.accountBackupDc.nodeAddr;
      const peerId = await extractPeerIdFromMultiaddr(peerAddr);

      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const peerIdValue: Uint8Array = new TextEncoder().encode(peerId.toString());

      // 将 hValue 和 peerIdValue 连接起来
      const preSign = new Uint8Array(peerIdValue.length + hValue.length);
      preSign.set(peerIdValue, 0);
      preSign.set(hValue, peerIdValue.length);
      const signature = await  this.context.sign(preSign);
      const userPubkey = this.context.getPublicKey();

      console.log("AddUserOffChainSpace peerId", peerId);
      const commentClient = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
      const res = await commentClient.addUserOffChainSpace(
        userPubkey.string(),
        blockHeight || 0,
        peerId.toString(),
        signature
      );
      return [true, null];
    } catch (err) {
      console.error("AddUserOffChainSpace error:", err);
      throw err;
    }
  }

  async addThemeObj(
    appId: string,
    theme: string,
    openFlag:number,
    commentSpace: number,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.accountBackupDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if(this.accountBackupDc.client.token == ""){
        await this.accountBackupDc.client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const spaceValue: Uint8Array = uint32ToLittleEndianBytes(commentSpace);
      const statusValue: Uint8Array = uint32ToLittleEndianBytes(openFlag);

      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const preSign = new Uint8Array([
        ...themeValue,
        ...appIdValue,
        ...hValue,
        ...spaceValue,
        ...statusValue,
      ]);
      const signature = await  this.context.sign(preSign);
      const userPubkey = this.context.getPublicKey();
      const commentClient = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
      let res = await commentClient.addThemeObj(
        appId,
        theme,
        blockHeight || 0,
        commentSpace,
        userPubkey.string(),
        openFlag,
        signature,
      );
      // res 0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
      if(res === 0){
        return [res, null];
      }
      if(res === 1){
        // 评论空间没有配置 
        return [null, Errors.ErrCommentSpaceNotConfig];
      }
      if(res === 2){
        // 添加空间
        await this.addUserOffChainSpace();
        // 继续调用
        res = await commentClient.addThemeObj(
          appId,
          theme,
          blockHeight || 0,
          commentSpace,
          userPubkey.string(),
          openFlag,
          signature,
        );
        if(res === 0){
          return [res, null];
        }
      }
      if(res === 3){
        // 评论数据同步中
        return [null, Errors.ErrCommentDataSync];
      }
      return [null, Errors.ErrAddThemeObj]
    } catch (err) {
      console.error("addThemeObj error:", err);
      throw err;
    }
  }

async addUserOffChainOpTimes(
  times: number,
  vaccount: string = "",
): Promise<[boolean | null, Error | null]> {
  try {
    // 检查连接
    if (!this.accountBackupDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if(!this.accountBackupDc?.nodeAddr){
      return [null, Errors.ErrNoDcPeerConnected];
    }

    // 检查公钥
    if (!this.context.publicKey) {
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if(this.accountBackupDc.client.token == ""){
      await this.accountBackupDc.client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign);
    }

    // 获取区块链高度
    let blockHeight = await this.chainUtil.getBlockHeight() || 0;
    

    // 准备签名数据
    const hValue = uint32ToLittleEndianBytes(blockHeight);
    const tValue = uint32ToLittleEndianBytes(times);
    const peerId = this.accountBackupDc?.nodeAddr.getPeerId() || "";
    const peerIdBytes = new TextEncoder().encode(peerId);
    const preSign = new Uint8Array([
      ...peerIdBytes,
      ...tValue,
      ...hValue
    ]);

    // 签名
    const signature = await this.context.sign(preSign);
    const userPubkey = this.context.getPublicKey();

    const client = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
    
    try {
      // 第一次尝试调用
       const res = await client.addUserOffChainOpTimes(userPubkey.string(), blockHeight, peerId, times, signature, vaccount);
      return [res, null];
    } catch (err: any) {
        return [false, err as Error];
      
    }
  } catch (err) {
    console.error("addUserOffChainOpTimes error:", err);
    return [false, err as Error];
  }
}

  async addThemeSpace(
    appId: string,
    theme: string,
    addSpace: number,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.accountBackupDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if(this.accountBackupDc.client.token == ""){
        await this.accountBackupDc.client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const spaceValue: Uint8Array = uint32ToLittleEndianBytes(addSpace);

      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const preSign = new Uint8Array([
        ...themeValue,
        ...appIdValue,
        ...hValue,
        ...spaceValue,
      ]);
      const signature = await  this.context.sign(preSign);
      const userPubkey = this.context.getPublicKey();
      const commentClient = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
      const res = await commentClient.addThemeSpace(
        appId,
        theme,
        blockHeight || 0,
        addSpace,
        userPubkey.string(),
        signature,
      );
      return [res, null];
    } catch (err) {
      console.error("addThemeSpace error:", err);
      throw err;
    }
  }

  async publishCommentToTheme(
    appId: string,
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey: string,
    openFlag?: number
  ): Promise<[string | null, Error | null]> {
    try {
      if (!this.accountBackupDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if(this.accountBackupDc.client.token == ""){
        await this.accountBackupDc.client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const typeValue: Uint8Array = uint32ToLittleEndianBytes(commentType);

      const commentUint8 = new TextEncoder().encode(comment);
      const commenthash = await sha256(commentUint8);
      const commentCidBase32 = base32.encode(commenthash)

      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const authValue: Uint8Array = new TextEncoder().encode(themeAuthor);
      const cidValue: Uint8Array = new TextEncoder().encode(commentCidBase32);
      const referValue: Uint8Array = new TextEncoder().encode(refercommentkey);
      const preSign = new Uint8Array([
        ...themeValue,
        ...appIdValue,
        ...authValue,
        ...hValue,
        ...cidValue,
        ...referValue,
        ...typeValue,
      ]);
      const signature = await  this.context.sign(preSign);
      const userPubkey = this.context.getPublicKey();
      const commentClient = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
      let res = await commentClient.publishCommentToTheme(
        appId,
        theme,
        themeAuthor,
        blockHeight || 0,
        userPubkey.string(),
        commentType,
        commentCidBase32,
        comment,
        refercommentkey,
        signature,
        openFlag,
      );
      // res 0:成功 1:评论空间没有配置 2:评论空间不足
      if(res === 0){
        // 获取高度
        const commentBlockHeight = (await this.chainUtil.getBlockHeight()) || 0;
        const commentKey = `${commentBlockHeight}/${commentCidBase32}`
        return [commentKey, null];
      }
      if(res === 1){
        // 评论空间没有配置 
        return [null, Errors.ErrCommentSpaceNotConfig];
      }
      if(res === 2){
        // 添加空间
        await this.addUserOffChainSpace();
        // 继续调用
        res = await commentClient.publishCommentToTheme(
          appId,
          theme,
          themeAuthor,
          blockHeight || 0,
          userPubkey.string(),
          commentType,
          commentCidBase32,
          comment,
          refercommentkey,
          signature,
        );
        if(res === 0){
          // 获取高度
          const commentBlockHeight = (await this.chainUtil.getBlockHeight()) || 0;
          const commentKey = `${commentBlockHeight}/${commentCidBase32}`
          return [commentKey, null];
        }
      }
      return [null, Errors.ErrPublishCommentToTheme]
    } catch (err) {
      console.error("publishCommentToTheme error:", err);
      throw err;
    }
  }

  async deleteSelfComment(
    appId: string,
    theme: string,
    themeAuthor: string,
    commentKey: string,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.accountBackupDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if(this.accountBackupDc.client.token == ""){
        await this.accountBackupDc.client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const commentCid = commentKey.split("/")[1];
      const commentBlockHeight = commentKey.split("/")[0];
      // commentBlockHeight 转32位无符号整数
      const commentBlockHeightUint32 = parseUint32(commentBlockHeight);
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const authValue: Uint8Array = new TextEncoder().encode(themeAuthor);
      const cidValue: Uint8Array = new TextEncoder().encode(commentCid);
      const preSign = new Uint8Array([
        ...themeValue,
        ...appIdValue,
        ...authValue,
        ...hValue,
        ...cidValue,
      ]);
      const signature = await  this.context.sign(preSign);
      const userPubkey = this.context.getPublicKey();
      const commentClient = new CommentClient(
        this.accountBackupDc.client,
        this.dcNodeClient,
        this.context
      );
      let delSelfRes: number = -1;
      let delObjRes: number = -1;
      let delSelfError: CommentError | null = null;
      let delObjError: CommentError | null = null;
      try {
        delSelfRes = await commentClient.deleteSelfComment(
          appId,
          theme,
          themeAuthor,
          blockHeight || 0,
          userPubkey.string(),
          commentCid,
          commentBlockHeightUint32,
          signature,
        );
      } catch (error: any) {
        delSelfError = new CommentError("deleteSelfComment error" + (error && error.message));
      }
      try {
        delObjRes = await commentClient.deleteCommentToObj(
          appId,
          theme,
          themeAuthor,
          blockHeight || 0,
          userPubkey.string(),
          commentCid,
          commentBlockHeightUint32,
          signature,
        );
      } catch (error: any) {
        delObjError = new CommentError("deleteCommentToObj error" + (error && error.message));
      }
      
      if(delSelfRes !== 0){
        return [delSelfRes, delSelfError || new CommentError("deleteSelfComment error")];
      }
      if(delObjRes !== 0){
        return [delObjRes, delObjError || new CommentError("deleteCommentToObj error")];
      }
      return [0, null];
    } catch (err) {
      console.error("deleteSelfComment error:", err);
      throw err;
    }
  }

  async getThemeObj(
    appId: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
  ): Promise<[ThemeObj[] | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      let client = this.connectedDc.client;
      if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
        const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
        const connectedClient = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
        if (!connectedClient) {
          return [null, Errors.ErrNoPeerIdIsNull];
        }
        client = connectedClient;
      }
      if(client.token == ""){
        await client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const commentClient = new CommentClient(
        client,
        this.dcNodeClient,
        this.context
      );
     
      const res = await commentClient.getThemeObj(
        appId,
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey || '',
      ); 
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.chainUtil,
        this.dcNodeClient,
        this.context
      );
      const cid = Buffer.from(res).toString();
      const fileContent = await fileManager.getFileFromDc(
        cid,
        "",
        cidNeedConnect.NOT_NEED
      );
      if (!fileContent) {
        return [[], null];
      }
      const fileContentString = uint8ArrayToString(fileContent);
      const allContent = await this.handleThemeObj(fileContentString);
      console.log("getThemeObj allContent:", allContent);
      return [allContent, null];
    } catch (err) {
      console.error("getThemeObj error:", err);
      throw err;
    }
  }

  async getThemeComments(
    appId: string,
    theme: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
    vaccount?: string,
  ): Promise<[ThemeComment[] | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      let client = this.connectedDc.client;
      if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
        const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
        const connectedClient = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
        if (!connectedClient) {
          return [null, Errors.ErrNoPeerIdIsNull];
        }
        client = connectedClient;
      }
       if(client.token == ""){
        await client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const aesKey = SymmetricKey.new();// 生成aeskey文件加密密码
       const commentClient = new CommentClient(
        client,
        this.dcNodeClient,
        this.context
      );
      const res = await commentClient.getThemeComments(
        appId,
        theme,
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey || '',
        aesKey ? aesKey.toString() : "",
        vaccount,
      );
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.chainUtil,
        this.dcNodeClient,
        this.context
      );
      const cid = Buffer.from(res).toString();
      const fileContent = await fileManager.getFileFromDc(
        cid,
        "",
        cidNeedConnect.NOT_NEED
      );
      console.log("getThemeComments fileContent:", fileContent);
      if (!fileContent) {
        return [[], null];
      }
      const fileContentString = uint8ArrayToString(fileContent);
      const allContent = await this.handleThemeComments(fileContentString, aesKey);
      console.log("getThemeComments allContent:", allContent);
      return [allContent || null, null];
    } catch (err) {
      console.error("getThemeComments error:", err);
      throw err;
    }
  }



    async configAuth(
      appId: string,
      themeAuthor: string,
      theme: string,
      authPubkey: string,
      permission: number,
      remark: string,
      vaccount?: string
    ): Promise<[number | null, Error | null]> {
      if (!theme.endsWith("_authlist")) {
        theme = theme + "_authlist";
      }
      if(!this.context.publicKey){
        return [null, Errors.ErrPublicKeyIsNull];
      }
      
      const userPubkey = this.context.publicKey;
      let userPubkeyStr = userPubkey.string();
  
      let client = this.accountBackupDc.client;
      if (themeAuthor != userPubkeyStr) {//查询他人主题评论
        const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
        const connectedClient = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
        if (!connectedClient) {
          return [null, Errors.ErrNoPeerIdIsNull];
        }
        client = connectedClient;
       
      }
      if (!client) {
        return [null, new Error("ErrConnectToAccountPeersFail")];
      }
  
      if (client.peerAddr === null) {
        return [null, new Error("ErrConnectToAccountPeersFail")];
      }
      if(client.token == ""){
        await client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const themeAuthorPubkey: Ed25519PubKey =
        Ed25519PubKey.edPubkeyFromStr(themeAuthor);
  
      let forPubkeyHex: string;
      try {
        const forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
        forPubkeyHex = forPubkey.string();
      } catch (error) {
        forPubkeyHex = authPubkey;
      }
  
      const content = `${forPubkeyHex}:${permission}:${remark}`;
  
      // Generate contentCid (sha256 of content)
      const commentUint8 = new TextEncoder().encode(content);
      const contentHash = await sha256(commentUint8);
      const contentCid = base32.encode(contentHash);
  
      // Get blockchain height
      let blockHeight: number;
      try {
        blockHeight = await this.chainUtil.getBlockHeight() || 0;
      } catch (error) {
        return [null, new Error("ErrGetBlockHeightFail")];
      }
  
      const contentSize = commentUint8.length;
  
      // Create binary representation of blockHeight (little endian)
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      // Create binary representation of type (little endian)
      const typeValue: Uint8Array = uint32ToLittleEndianBytes(
        CommentType.Comment
      );
      // sign(Theme+appId+objAuthor+blockheight+contentCid)
      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const themeAuthorValue: Uint8Array = new TextEncoder().encode(
        themeAuthorPubkey.string()
      );
      const contentCidValue: Uint8Array = new TextEncoder().encode(contentCid);
      let preSign = new Uint8Array([
        ...themeValue,
        ...appIdValue,
        ...themeAuthorValue,
        ...hValue,
        ...contentCidValue,
        ...typeValue,
      ]);
  
      const signature = await this.context.sign(preSign);
  
       const commentClient = new CommentClient(
        client,
        this.dcNodeClient,
        this.context
      );
      try {
        const res = await commentClient.configThemeObjAuth(
          theme,
          appId,
          themeAuthor,
          blockHeight,
          userPubkeyStr,
          contentCid,
          content,
          contentSize,
          CommentType.Comment,
          signature,
          vaccount
        );
  
        if (res !== 0) {
          return [res, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
        }else {
          return [0, null];
        }
      } catch (error: any) {
        return [null, error];
      }
    }


    async getAuthList(
      appId: string,
      themeAuthor: string,
      theme: string,
      vaccount?: string
    ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> {
      if (!theme.endsWith("_authlist")) {
        theme = theme + "_authlist";
      }
      let seekKey: string = "";
      let originAuthList: ThemeComment[] = [];
      let authList: ThemeAuthInfo[] = [];
      try {
        while (true) {
          const commentManager = new CommentManager(this.context);
          const res = await commentManager.getThemeComments(
            appId,
            theme,
            themeAuthor,
            0,
            Direction.Forward,
            0,
            1000,
            seekKey || "",
            vaccount
          );
          if (res[0] && res[0].length == 0) {
            return [authList,originAuthList, null];
          }
          
          const resList = res[0];
          if (!resList || resList.length == 0) {
            break;
          }
          for (let i = 0; i < resList.length; i++) {
              originAuthList.push(resList[i]);
              const content = resList[i].comment
              const parts = content.split(":");
              if (parts.length < 2) {
                continue;
              }
              const authPubkey = parts[0];
              const permission = parseInt(parts[1]);
              const remark = content.substring(parts[0].length + 2);
              authList.push({
              pubkey: authPubkey,
              permission: permission,
              remark: remark,
            });
          }
          if (resList.length < 1000) {
            break;
          }
          seekKey = `${resList[resList.length - 1].blockheight}/${
            resList[resList.length - 1].commentCid
          }`;
        }
      } catch (error: any) {
        return [authList,originAuthList, error];
      }
      return [authList,originAuthList, null];
    }

  async getUserComments(
    appId: string,
    userPubkey: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
  ): Promise<[ThemeComment[] | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if(!this.context.publicKey){
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if(this.connectedDc.client.token == ""){
        await this.connectedDc.client.GetToken(appId, this.context.publicKey.string(),this.context.sign);
      }
      const aesKey = SymmetricKey.new();// 生成aeskey文件加密密码
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient,
        this.context
      );
      const res = await commentClient.getUserComments(
        appId,
        userPubkey,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey || '',
        aesKey ? aesKey.toString()  : ''
      );
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.chainUtil,
        this.dcNodeClient,
        this.context
      );
      const cid = Buffer.from(res).toString();
      const fileContent = await fileManager.getFileFromDc(
        cid,
        "",
        cidNeedConnect.NOT_NEED
      );
      console.log("getUserComments fileContent:", fileContent);
      if (!fileContent) {
        return [[], null];
      }
      const fileContentString = uint8ArrayToString(fileContent);
      const allContent = await this.handleThemeComments(fileContentString, aesKey);
      console.log("getUserComments allContent:", allContent);
      return [allContent || null, null];
    } catch (err) {
      console.error("getUserComments error:", err);
      throw err;
    }
  }
  private handleThemeObj = async (fileContentString: string): Promise<ThemeObj[]> => {
    const reader = new BrowserLineReader(fileContentString);

    let allContent: Array<ThemeObj> = [];
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
        if (!lineString) {
          break;
        }
        const fileContentUint8Array = base32.decode(lineString);
        const content = dcnet.pb.AddThemeObjRequest.decode(
          fileContentUint8Array
        );
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
  private handleThemeComments = async (fileContentString: string, aesKey: SymmetricKey): Promise<ThemeComment[]> => {
    const reader = new BrowserLineReader(fileContentString);
    let allContent: Array<ThemeComment> = [];

    if (!this.context.getPublicKey()) {
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
        if (!lineString) {
          break;
        }
        const lineContent = base32.decode(lineString);
        const plainContent = await aesKey.decrypt(lineContent);
        const content =
          dcnet.pb.PublishCommentToThemeRequest.decode(plainContent);
        
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
}

