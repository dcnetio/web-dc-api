// dc-compat.ts
// 兼容层，提供与旧版 DC 类相同的 API

import { DC } from './dc';
import { createLogger } from './util/logger';

const logger = createLogger('DCCompat');

/**
 * DC兼容类
 * 提供与旧版 DC 类相同的 API，但内部使用模块化架构
 */
export class DCCompat extends DC {
  /**
   * 获取可寻址文件流
   */
  getSeekableFileStream(ipfsPath: string, decryptKey: string) {
    return this.file.getSeekableFileStream(ipfsPath, decryptKey);
  }
  
  /**
   * 清理文件缓存
   */
  clearFileCache(pathname?: string): void {
    return this.file.clearFileCache(pathname);
  }
  
  /**
   * 获取文件
   */
  getFile(cid: string, decryptKey: string) {
    return this.file.getFile(cid, decryptKey);
  }
  
  /**
   * 创建文件流
   */
  createFileStream(cid: string, decryptKey: string) {
    return this.file.createFileStream(cid, decryptKey);
  }
  
  /**
   * 添加文件
   */
  addFile(file: File, enkey: string, onUpdateTransmitSize: (status: number, size: number) => void) {
    return this.file.addFile(file, enkey, onUpdateTransmitSize);
  }
  
  /**
   * 账户登录
   */
  accountLogin(nftAccount: string, password: string, safecode: string) {
    return this.auth.accountLogin(nftAccount, password, safecode);
  }
  
  /**
   * 获取用户信息
   */
  getUserInfoWithNft(nftAccount: string) {
    return this.auth.getUserInfoWithNft(nftAccount);
  }
  
  /**
   * 检查用户空间是否足够
   */
  ifEnoughUserSpace(needSize?: number) {
    return this.auth.ifEnoughUserSpace(needSize);
  }
  
  /**
   * 刷新用户信息
   */
  refreshUserInfo() {
    return this.auth.refreshUserInfo();
  }
  
  /**
   * 添加用户评论空间
   */
  addUserOffChainSpace() {
    return this.comment.addUserOffChainSpace();
  }
  
  /**
   * 为指定对象开通评论功能
   */
  addThemeObj(theme: string, openFlag: number, commentSpace?: number) {
    return this.comment.addThemeObj(theme, openFlag, commentSpace);
  }
  
  /**
   * 为开通评论的对象增加评论空间
   */
  addThemeSpace(theme: string, addSpace: number) {
    return this.comment.addThemeSpace(theme, addSpace);
  }
  
  /**
   * 发布评论
   */
  publishCommentToTheme(
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
    openFlag?: number
  ) {
    return this.comment.publishCommentToTheme(
      theme,
      themeAuthor,
      commentType,
      comment,
      refercommentkey,
      openFlag
    );
  }
  
  /**
   * 删除评论
   */
  deleteSelfComment(theme: string, themeAuthor: string, commentKey: string) {
    return this.comment.deleteSelfComment(theme, themeAuthor, commentKey);
  }
  
  /**
   * 获取评论对象列表
   */
  getThemeObj(
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) {
    return this.comment.getThemeObj(
      themeAuthor,
      startHeight,
      direction,
      offset,
      limit,
      seekKey
    );
  }
  
  /**
   * 获取主题评论列表
   */
  getThemeComments(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) {
    return this.comment.getThemeComments(
      theme,
      themeAuthor,
      startHeight,
      direction,
      offset,
      limit,
      seekKey
    );
  }
  
  /**
   * 获取用户评论列表
   */
  getUserComments(
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ) {
    return this.comment.getUserComments(
      userPubkey,
      startHeight,
      direction,
      offset,
      limit,
      seekKey
    );
  }
  
  /**
   * 创建新数据库
   */
  newDB(name: string, b32Rk: string, b32Sk: string, jsonCollections: any[]) {
    return this.db.newDB(name, b32Rk, b32Sk, jsonCollections);
  }
  
  /**
   * 从DC同步数据库
   */
  syncDbFromDC(
    threadid: string,  
    dbname: string,  
    dbAddr: string,  
    b32Rk: string,  
    b32Sk: string,  
    block: boolean,  
    collectionInfos: any[]  
  ) {
    return this.db.syncDbFromDC(
      threadid,
      dbname,
      dbAddr,
      b32Rk,
      b32Sk,
      block,
      collectionInfos
    );
  }
  
  /**
   * 创建数据库查询
   */
  createQuery(collectionName: string, threadId: string) {
    return this.db.createQuery(collectionName, threadId);
  }
  
  /**
   * 创建数据库事务
   */
  createTransaction(threadId: string) {
    return this.db.createTransaction(threadId);
  }
  
  /**
   * 发送消息到用户消息盒子
   */
  sendMsgToUserBox(receiver: string, msg: string) {
    return this.message.sendMsgToUserBox(receiver, msg);
  }
  
  /**
   * 从用户消息盒子获取消息
   */
  getMsgFromUserBox(limit?: number) {
    return this.message.getMsgFromUserBox(limit);
  }
  
  /**
   * 创建存储主题
   */
  vaCreateStoreTheme(themeAuthor: string, theme: string, space: number, type: number) {
    return this.keyValue.vaCreateStoreTheme(themeAuthor, theme, space, type);
  }
  
  /**
   * 从dc网络获取缓存值
   */
  getCacheValue(key: string) {
    return this.keyValue.getCacheValue(key);
  }
  
  /**
   * 设置缓存值
   */
  setCacheKey(value: string, expire?: number) {
    return this.keyValue.setCacheKey(value, expire);
  }
  
  /**
   * 获取区块高度
   */
  getBlockHeight() {
    return this.dcChain.getBlockHeight();
  }
  
  /**
   * 获取hostid
   */
  getHostID() {
    const DCManager = require('./dc/manager').DCManager;
    const dcManager = new DCManager(this.connectedDc);
    return dcManager.getHostID();
  }
}