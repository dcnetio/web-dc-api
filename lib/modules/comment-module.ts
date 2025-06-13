// modules/comment-module.ts
// 评论功能模块

import {  ICommentOperations } from "../interfaces/comment-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { CommentManager } from "../implements/comment/manager";
import { createLogger } from "../util/logger";
import { ThemePermission } from "../common/constants";
import { ThemeAuthInfo, ThemeComment, ThemeObj } from "../common/types/types";

const logger = createLogger('CommentModule');

/**
 * 评论模块
 * 处理评论相关功能
 */
export class CommentModule implements DCModule, ICommentOperations {
  readonly moduleName = CoreModuleName.COMMENT;
  private context!: DCContext;
  private commentManager!: CommentManager;
  private initialized: boolean = false;
  
  /**
   * 初始化评论模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      this.commentManager = new CommentManager(
        context
      );
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("评论模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭评论模块
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
  }
  
  /**
   * 添加用户评论空间
   */
  async addUserOffChainSpace(): Promise<[boolean | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.addUserOffChainSpace();
      if(!res[1]){
        logger.info("添加用户评论空间成功");
      }
      return res;
    } catch (error) {
      logger.error("添加用户评论空间失败:", error);
      throw error;
    }
  }

/**
 * 添加用户链下操作次数
 */
async addUserOffChainOpTimes(
  times: number,
  vaccount?: string
): Promise<[boolean | null, Error | null]> {
  this.assertInitialized();
  
  try {
    const res = await this.commentManager.addUserOffChainOpTimes(times, vaccount);
    if(!res[1]){
      logger.info("添加用户操作次数成功");
    }
    return res;
  } catch (error) {
    logger.error("添加用户操作次数失败:", error);
    throw error;
  }
}

  
  /**
   * 为指定对象开通评论功能
   * @param theme 主题
   * @param openFlag 开放标志
   * @param commentSpace 评论空间大小
   */
  async addThemeObj(theme: string, openFlag: number, commentSpace?: number): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.addThemeObj(
        this.context.appInfo?.appId || "",
        theme,
        openFlag,
        commentSpace || 50 * 1024 * 1024 // 50M
      );
      if(!res[1]){
        logger.info(`为主题 ${theme} 开通评论功能成功`);
      }
      return res;
    } catch (error) {
      logger.error(`为主题 ${theme} 开通评论功能失败:`, error);
      throw error;
    }
  }
  
  /**
   * 为开通评论的对象增加评论空间
   * @param theme 主题
   * @param addSpace 增加的空间大小
   */
  async addThemeSpace(theme: string, addSpace: number): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.addThemeSpace(
        this.context.appInfo?.appId || "",
        theme,
        addSpace
      );
      if(!res[1]){
        logger.info(`为主题 ${theme} 增加 ${addSpace} 字节评论空间成功`);
      }
      return res;
    } catch (error) {
      logger.error(`为主题 ${theme} 增加评论空间失败:`, error);
      throw error;
    }
  }
  
  /**
   * 发布评论
   * @param theme 主题
   * @param themeAuthor 主题作者 base32编码格式
   * @param commentType 评论类型
   * @param comment 评论内容
   * @param refercommentkey 引用评论的键
   * @param openFlag 开放标志
   */
  async publishCommentToTheme(
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
    openFlag?: number
  ): Promise<[string | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.publishCommentToTheme(
        this.context.appInfo?.appId || "",
        theme,
        themeAuthor,
        commentType,
        comment,
        refercommentkey || "",
        openFlag
      );
      if(!res[1]){
        logger.info(`发布评论到主题 ${theme} 成功`);
      }
      return res;
    } catch (error) {
      logger.error(`发布评论到主题 ${theme} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 删除评论
   * @param theme 主题
   * @param themeAuthor 主题作者
   * @param commentKey 评论键
   */
  async deleteSelfComment(
    theme: string,
    themeAuthor: string,
    commentKey: string
  ): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.deleteSelfComment(
        this.context.appInfo?.appId || "",
        theme,
        themeAuthor,
        commentKey
      );
      if(!res[1]){
        logger.info(`删除评论 ${commentKey} 成功`);
      }
      return res;
    } catch (error) {
      logger.error(`删除评论 ${commentKey} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取评论对象列表
   * @param themeAuthor 主题作者
   * @param startHeight 起始高度
   * @param direction 方向
   * @param offset 偏移量
   * @param limit 限制数量
   * @param seekKey 搜索键
   */
  async getThemeObj(
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string 
  ): Promise<[ThemeObj[] | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.getThemeObj(
        this.context.appInfo?.appId || "",
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 100,
        seekKey || ""
      );
      if(!res[1]){
        logger.info(`获取作者 ${themeAuthor} 的主题对象列表成功`);
      }
      return res;
    } catch (error) {
      logger.error(`获取作者 ${themeAuthor} 的主题对象列表失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取主题评论列表
   * @param theme 主题
   * @param themeAuthor 主题作者
   * @param startHeight 起始高度
   * @param direction 方向
   * @param offset 偏移量
   * @param limit 限制数量
   * @param seekKey 搜索键
   */
  async getThemeComments(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<[ThemeComment[] | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.getThemeComments(
        this.context.appInfo?.appId || "",
        theme,
        themeAuthor,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 100,
        seekKey || ""
      );
      if(!res[1]){
        logger.info(`获取主题 ${theme} 的评论列表成功`);
      }
      return res;
    } catch (error) {
      logger.error(`获取主题 ${theme} 的评论列表失败:`, error);
      throw error;
    }
  }
  
  /**
     * 配置主题的授权信息
     * @param themeAuthor 主题作者的公钥
     * @param theme 主题名称
     * @param authPubkey 被授权者的公钥
     * @param permission 权限级别
     * @param remark 备注信息
     * @param vaccount 可选的虚拟账户
     * @returns [授权状态码, 错误信息]
     */
   async configAuth(
      themeAuthor: string,
      theme: string,
      authPubkey: string,
      permission: ThemePermission,
      remark: string,
      vaccount?: string
    ): Promise<[number | null, Error | null]> {
      this.assertInitialized();
      return await this.commentManager.configAuth(
        this.context.appInfo?.appId || "",
        themeAuthor,
        theme,
        authPubkey,
        permission,
        remark,
        vaccount
      );
    }


 /**
   * 获取指定主题的授权列表,
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题/对象标识符
   * @param vaccount 可选，虚拟账户
   * @returns [授权列表, 评论列表, 错误信息]
   */
 async getAuthList(
      themeAuthor: string,
      theme: string,
      vaccount?: string
    ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> {
    this.assertInitialized();
    return await this.commentManager.getAuthList(
      this.context.appInfo?.appId || "",
      themeAuthor,
      theme,
      vaccount
    );
  }


  /**
   * 获取用户评论列表
   * @param userPubkey 用户公钥
   * @param startHeight 起始高度
   * @param direction 方向
   * @param offset 偏移量
   * @param limit 限制数量
   * @param seekKey 搜索键
   */
  async getUserComments(
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<[ThemeComment[] | null, Error | null]> {
    this.assertInitialized();
    
    try {
      const res = await this.commentManager.getUserComments(
        this.context.appInfo?.appId || "",
        userPubkey,
        startHeight || 0,
        direction || 0,
        offset || 0,
        limit || 100,
        seekKey || ""
      );
      if(!res[1]){
        logger.info(`获取用户 ${userPubkey} 的评论列表成功`);
      }
      return res;
    } catch (error) {
      logger.error(`获取用户 ${userPubkey} 的评论列表失败:`, error);
      throw error;
    }
  }
  
  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("评论模块未初始化");
    }
  }
}