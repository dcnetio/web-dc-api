// modules/keyvalue-module.ts
// 键值存储功能模块

import {  IKeyValueOperations } from "../interfaces/keyvalue-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import {  KeyValueStoreType } from "../implements/keyvalue/manager";
import { ThemeManager } from "../implements/cache/manager";
import { createLogger } from "../util/logger";
import { AIProxyConfig, OnStreamResponseType, ProxyCallConfig, ThemeComment, UserProxyCallConfig } from "../common/types/types";
import { AIProxyManager } from "lib/implements/aiproxy/manager";
import { AIProxyUserPermission } from "lib/common/constants";
const logger = createLogger('KeyValueModule');

/**
 * AI代理模块
 * 提供AI代理的配置和调用
 */
export class AIProxyModule implements DCModule {
  readonly moduleName = CoreModuleName.AIPROXY;
  private context: DCContext;
  private aiProxyManager: AIProxyManager;
  private initialized: boolean = false;
  
  /**
   * 初始化AI代理模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      this.aiProxyManager = new AIProxyManager(
        context.dcutil,
        context.AccountBackupDc,
        context.dcNodeClient,
        context.dcChain,
        context
      );
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("AI代理模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭AI代理模块
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
  }


    // 创建AI调用的Proxy配置
  async createProxyConfig(
    appId: string,
    configTheme: string, 
  ): Promise<[number, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.createProxyConfig(appId, configTheme);
  }


   //配置AI代理的访问配置,如果key的值设置为空,则表示删除该key的配置
configAIProxy(
    appId: string,
    configAuthor: string,
    configTheme: string,
    serviceName: string,
    serviceConfig?: AIProxyConfig,
    vaccount?: string
  ): Promise<[boolean, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.configAIProxy(appId, configAuthor, configTheme, serviceName, serviceConfig, vaccount);
}
  

//配置用户的访问权限
async configAuth(
appId: string,
configAuthor: string,
configTheme: string,
authPubkey: string,
permission: AIProxyUserPermission,
authConfig: ProxyCallConfig,
vaccount?: string
): Promise<[number, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.configAuth(appId, configAuthor, configTheme, authPubkey, permission, authConfig, vaccount);
}


 //获取的ai代理的所有配置,包括服务与授权列表
  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configThem: string,
    vaccount?: string
  ): Promise<[UserProxyCallConfig[] | null,AIProxyConfig[] | null, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.GetAIProxyConfig(appId, themeAuthor, configThem, vaccount);
  }


async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configThem: string,
    ): Promise<[authConfig: ProxyCallConfig, error: Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.GetUserOwnAIProxyAuth(appId, themeAuthor, configThem);
}


  //AI相关代理的调用,包括代理与AI的通信或者与MCPServer的通信
 async DoAIProxyCall( 
    appId: string,
    themeAuthor: string,
    configThem: string,
    serviceName: string,
    reqBody: string,
    forceRefresh: boolean,
    onStreamResponse: OnStreamResponseType = null ,
    headers?: string,
    path?: string,
    model?: string): Promise< number>
    {
        this.assertInitialized();
        return this.aiProxyManager.DoAIProxyCall(appId, themeAuthor, configThem, serviceName, reqBody, forceRefresh, onStreamResponse, headers, path, model);
    }


  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("键值存储模块未初始化");
    }
  }
}