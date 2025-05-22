// modules/message-module.ts
// 消息功能模块

import { IMessageOperations } from "lib/interfaces/message-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { MessageManager } from "../implements/message/manager";
import { createLogger } from "../util/logger";

const logger = createLogger('MessageModule');

/**
 * 消息模块
 * 提供消息收发功能
 */
export class MessageModule implements DCModule, IMessageOperations {
  readonly moduleName = CoreModuleName.MESSAGE;
  private context: DCContext;
  private messageManager: MessageManager;
  private initialized: boolean = false;
  
  /**
   * 初始化消息模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      this.messageManager = new MessageManager(
        context.AccountBackupDc,
        context.dcutil,
        context.dcChain,
        context.dcNodeClient,
        context
      );
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("消息模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭消息模块
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
  }
  
  /**
   * 发送消息到用户消息盒子
   * @param receiver 接收者
   * @param msg 消息内容
   * @returns 发送结果
   */
  async sendMsgToUserBox(receiver: string, msg: string): Promise<any> {
    this.assertInitialized();
    
    try {
      const res = await this.messageManager.sendMsgToUserBox(
        this.context.appInfo?.id || "",
        receiver,
        msg
      );
      
      logger.info(`发送消息到用户 ${receiver} 成功`);
      return res;
    } catch (error) {
      logger.error(`发送消息到用户 ${receiver} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 从用户消息盒子获取消息
   * @param limit 限制数量
   * @returns 消息列表
   */
  async getMsgFromUserBox(limit?: number): Promise<any> {
    this.assertInitialized();
    
    try {
      const res = await this.messageManager.getMsgFromUserBox(
        this.context.appInfo?.id || "",
        limit
      );
      
      logger.info("获取用户消息成功");
      return res;
    } catch (error) {
      logger.error("获取用户消息失败:", error);
      throw error;
    }
  }
  
  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("消息模块未初始化");
    }
  }
}