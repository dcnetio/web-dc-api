// modules/keyvalue-module.ts
// 键值存储功能模块

import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { createLogger } from "../util/logger";
import { AIProxyConfig, OnStreamResponseType, ProxyCallConfig, UserProxyCallConfig } from "../common/types/types";
import { AIProxyManager } from "../implements/aiproxy/manager";
import { AIProxyUserPermission } from "../common/constants";

const logger = createLogger('KeyValueModule');

import { IAICallConfig } from "../common/types/types";
import { IAIProxyOperations } from "../../lib/interfaces/aiproxy-interface";


/**
 * AI代理模块
 * 提供AI代理的配置和调用
 */
export class AIProxyModule implements DCModule ,IAIProxyOperations{
  readonly moduleName = CoreModuleName.AIPROXY;
  private aiProxyManager!: AIProxyManager;
  private initialized: boolean = false;
  private aiCallConfig: IAICallConfig | null = null;
  
  /**
   * 初始化AI代理模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.aiProxyManager = new AIProxyManager(
        context.dcutil,
        context.AccountBackupDc,
        context.dcNodeClient as any, // Type assertion to bypass service map differences
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
  ): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.createProxyConfig(appId, configTheme);
  }

  async deleteProxyConfig(
    appId: string,
    configTheme: string, 
  ): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.deleteProxyConfig(appId, configTheme);
  }
  


   //配置AI代理的访问配置,如果key的值设置为空,则表示删除该key的配置
configAIProxy(
    appId: string,
    configAuthor: string,
    configTheme: string,
    serviceName: string,
    serviceConfig?: AIProxyConfig,
    vaccount?: string
  ): Promise<[boolean | null, Error | null]> {
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
): Promise<[number | null, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.configAuth(appId, configAuthor, configTheme, authPubkey, permission, authConfig, vaccount);
}


 //获取的ai代理的所有配置,包括服务与授权列表
  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    vaccount?: string
  ): Promise<[UserProxyCallConfig[] | null,AIProxyConfig[] | null, Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.GetAIProxyConfig(appId, themeAuthor, configTheme, vaccount);
  }


async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    ): Promise<[authConfig: ProxyCallConfig | null, error: Error | null]> {
    this.assertInitialized();
    return this.aiProxyManager.GetUserOwnAIProxyAuth(appId, themeAuthor, configTheme);
}


  //AI相关代理的调用,包括代理与AI的通信或者与MCPServer的通信
 async DoAIProxyCall( 
    context: { signal?: AbortSignal },
    reqBody: string,
    forceRefresh: boolean,
    onStreamResponse: OnStreamResponseType,
    appId?: string,
    themeAuthor?: string,
    configTheme?: string,
    serviceName?: string,
    headers?: Record<string, string>,
    path?: string,
    model?: string): Promise<[number | null, Error | null]>
    {
      try{

      
        this.assertInitialized();
        if (this.aiCallConfig == null && (!appId || !themeAuthor || !configTheme || !serviceName)) {
            throw new Error("AI调用配置未设置");
        }
        let headersStr = "";
        if (headers) {
            headersStr = JSON.stringify(headers);
        }else if (this.aiCallConfig?.headers) {
            headersStr = JSON.stringify(this.aiCallConfig.headers);
        }
        if (!configTheme) {
            configTheme = this.aiCallConfig?.theme;
        }
        if (!configTheme) {
            throw new Error("配置主题不能为空");
        }
        if (!appId) {
            appId = this.aiCallConfig?.appId;
        }
        if (!appId) {
            throw new Error("应用ID不能为空");
        }
        if (!themeAuthor) {
            themeAuthor = this.aiCallConfig?.themeAuthor;
        }
        if (!themeAuthor) {
            throw new Error("主题作者公钥不能为空");
        }
        if (!serviceName) {
            serviceName = this.aiCallConfig?.service;
        }
        if (!serviceName) {
            throw new Error("服务名称不能为空");
        }
        const res = await this.aiProxyManager.DoAIProxyCall(context,appId , themeAuthor, configTheme, serviceName, reqBody, forceRefresh, onStreamResponse, headersStr, path|| this.aiCallConfig?.path, model|| this.aiCallConfig?.model);
        return [res, null];
      } catch (error) {
        logger.error("AI代理调用失败:", error);
        return [null, error instanceof Error ? error : new Error(String(error))];
      }
    }


    /**
   * 设置AI调用的配置
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param configTheme 配置主题
   * @param serviceName 服务名称
   * @param headers 请求头(可选)
   * @param path 请求路径(可选)
   * @param model 模型名称(可选)
   * @returns Promise<void>
   * */
  async SetAICallConfig(
    callConfig:IAICallConfig
  ): Promise<Error | null> {
    try{
      this.assertInitialized();
    this.aiCallConfig = callConfig
    return null
    } catch (error) {
      logger.error("设置AI调用配置失败:", error);
      return error as Error;
    }
   
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