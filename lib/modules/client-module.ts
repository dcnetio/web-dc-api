// modules/client-module.ts
// 消息功能模块

import { IClientOperations } from "../interfaces/client-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { DCManager } from "../implements/dc/manager";
import { createLogger } from "../util/logger";

const logger = createLogger('ClientModule');

/**
 * 消息模块
 * 提供消息收发功能
 */
export class ClientModule implements DCModule, IClientOperations {
  readonly moduleName = CoreModuleName.CLIENT;
  private context: DCContext;
  private clientManager: DCManager;
  private initialized: boolean = false;
  
  /**
   * 初始化消息模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      this.clientManager = new DCManager(
        context.connectedDc,
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

  async getHostID(): Promise<[{ peerID: string; reqAddr: string } | null, Error | null]> {
    this.assertInitialized();
    return this.clientManager.getHostID();
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