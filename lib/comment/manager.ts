import { AccountKey, DCConnectInfo, SignHandler } from "../types/types";
import type { HeliaLibp2p } from "helia";
import { ChainUtil } from "../chain";

import { DcUtil } from "../dcutil";
import * as buffer from "buffer/";
import { extractPeerIdFromMultiaddr } from "../dc-key/keyManager";
import { Multiaddr } from "@multiformats/multiaddr";
import { CommentClient } from "./client";
import { uint32ToLittleEndianBytes } from "../util/utils";
const { Buffer } = buffer;

// 创建一个可以取消的信号
const controller = new AbortController();
const { signal } = controller;

// 错误定义
export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new FileError("no dc peer connected"),
  ErrNodeAddrIsNull: new FileError("nodeAddr is null"),
  ErrNoFileChose: new FileError("no file choose"),
  ErrNoPeerIdIsNull: new FileError("peerId is null"),
};

export class CommentManager {
  connectedDc: DCConnectInfo = {};
  dcNodeClient: HeliaLibp2p;
  chainUtil: ChainUtil;
  signHandler: SignHandler;
  constructor(
    connectedDc: DCConnectInfo,
    dcNodeClient: HeliaLibp2p,
    chainUtil: ChainUtil,
    signHandler: SignHandler
  ) {
    this.connectedDc = connectedDc;
    this.dcNodeClient = dcNodeClient;
    this.chainUtil = chainUtil;
    this.signHandler = signHandler;
  }

  // 配置或增加用户自身的评论空间 0:成功  1:失败
  async addUserOffChainSpace(): Promise<[boolean | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      if (!this.connectedDc?.nodeAddr) {
        return [null, Errors.ErrNodeAddrIsNull];
      }
      const peerAddr = this.connectedDc.nodeAddr;
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
      const signature = this.signHandler.sign(preSign);
      const userPubkey = this.signHandler.publickey();

      console.log("AddUserOffChainSpace peerId", peerId);
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
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
    theme: string,
    appId: string,
    openFlag:number,
    commentSpace: number,
    allowSpace: number,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
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
      const signature = this.signHandler.sign(preSign);
      const userPubkey = this.signHandler.publickey();
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.addThemeObj(
        theme,
        appId,
        blockHeight || 0,
        commentSpace,
        allowSpace,
        userPubkey.toString(),
        openFlag,
        signature,
      );
      return [res, null];
    } catch (err) {
      console.error("addThemeObj error:", err);
      throw err;
    }
  }

  async addThemeSpace(
    theme: string,
    appId: string,
    addSpace: number,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
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
      const signature = this.signHandler.sign(preSign);
      const userPubkey = this.signHandler.publickey();
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.addThemeSpace(
        theme,
        appId,
        blockHeight || 0,
        addSpace,
        userPubkey.toString(),
        signature,
      );
      return [res, null];
    } catch (err) {
      console.error("addThemeSpace error:", err);
      throw err;
    }
  }

  async publishCommentToTheme(
    theme: string,
    appId: string,
    themeAuthor: string,
    commentType: number,
    commentCid: string,
    comment: string,
    refercommentkey: string
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const typeValue: Uint8Array = uint32ToLittleEndianBytes(commentType);

      const themeValue: Uint8Array = new TextEncoder().encode(theme);
      const appIdValue: Uint8Array = new TextEncoder().encode(appId);
      const authValue: Uint8Array = new TextEncoder().encode(themeAuthor);
      const cidValue: Uint8Array = new TextEncoder().encode(commentCid);
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
      const signature = this.signHandler.sign(preSign);
      const userPubkey = this.signHandler.publickey();
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.publishCommentToTheme(
        theme,
        appId,
        themeAuthor,
        blockHeight || 0,
        userPubkey.toString(),
        commentType,
        commentCid,
        comment,
        refercommentkey,
        signature,
      );
      return [res, null];
    } catch (err) {
      console.error("publishCommentToTheme error:", err);
      throw err;
    }
  }

  async deleteSelfComment(
    theme: string,
    appId: string,
    themeAuthor: string,
    commentCid: string,
    commentBlockheight: number,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
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
      const signature = this.signHandler.sign(preSign);
      const userPubkey = this.signHandler.publickey();
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.deleteSelfComment(
        theme,
        appId,
        themeAuthor,
        blockHeight || 0,
        userPubkey.toString(),
        commentBlockheight || 0,
        commentCid,
        signature,
      );
      return [res, null];
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
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
      const hValue: Uint8Array = uint32ToLittleEndianBytes(
        blockHeight ? blockHeight : 0
      );
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.getThemeObj(
        appId,
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey,
      );
      return [res, null];
    } catch (err) {
      console.error("getThemeObj error:", err);
      throw err;
    }
  }

  async getThemeComments(
    appId: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.getThemeComments(
        appId,
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey,
      );
      return [res, null];
    } catch (err) {
      console.error("getThemeComments error:", err);
      throw err;
    }
  }

  async getUserComments(
    appId: string,
    userPubkey: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
  ): Promise<[number | null, Error | null]> {
    try {
      if (!this.connectedDc?.client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const commentClient = new CommentClient(
        this.connectedDc.client,
        this.dcNodeClient
      );
      const res = await commentClient.getUserComments(
        appId,
        userPubkey,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 0,
        seekKey,
      );
      return [res, null];
    } catch (err) {
      console.error("getUserComments error:", err);
      throw err;
    }
  }
}
