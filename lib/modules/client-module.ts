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
  private clientManager!: DCManager;
  private initialized: boolean = false;
  
  /**
   * 初始化消息模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
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
    try {
      this.assertInitialized();
      const res = await this.clientManager.getHostID();
      if (res[0]) {
        logger.info(`获取hostID成功: ${res[0].peerID}, 公网地址: ${res[0].reqAddr}`);
      } else {
        logger.error("获取hostID失败:", res[1]);
      }
      return res;
    } catch (error) {
      logger.error("获取hostID时发生错误:", error);
      return [null, error as Error];
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