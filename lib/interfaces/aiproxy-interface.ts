import { AIProxyConfig, OnStreamResponseType, ProxyCallConfig, UserProxyCallConfig } from "../common/types/types";
import { AIProxyUserPermission } from "../common/constants";

/**
 * AI代理操作接口
 * 提供AI代理的配置和调用功能
 */
export interface IAIProxyOperations {
  /**
   * 创建AI调用的Proxy配置
   * @param appId 应用ID
   * @param configTheme 配置主题
   * @returns [状态码, 错误信息]
   */
  createProxyConfig(
    appId: string,
    configTheme: string
  ): Promise<[number, Error | null]>;
  
  /**
   * 配置AI代理的访问配置
   * 如果serverConfig为空,则表示删除该serviceName的配置
   * @param appId 应用ID
   * @param configAuthor 配置作者的公钥
   * @param configTheme 配置主题
   * @param serviceName 服务名称
   * @param serviceConfig 服务配置(可选)
   * @param vaccount 虚拟账户(可选)
   * @returns [是否配置成功, 错误信息]
   */
  configAIProxy(
    appId: string,
    configAuthor: string,
    configTheme: string,
    serviceName: string,
    serviceConfig?: AIProxyConfig,
    vaccount?: string
  ): Promise<[boolean, Error | null]>;
  
  /**
   * 配置用户的访问权限
   * @param appId 应用ID
   * @param configAuthor 配置作者的公钥
   * @param configTheme 配置主题
   * @param authPubkey 被授权用户的公钥
   * @param permission 权限级别
   * @param authConfig 授权配置
   * @param vaccount 虚拟账户(可选)
   * @returns [状态码, 错误信息]
   */
  configAuth(
    appId: string,
    configAuthor: string,
    configTheme: string,
    authPubkey: string,
    permission: AIProxyUserPermission,
    authConfig: ProxyCallConfig,
    vaccount?: string
  ): Promise<[number, Error | null]>;
  
  /**
   * 获取AI代理的所有配置
   * 包括服务与授权列表
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param configTheme 配置主题
   * @param vaccount 虚拟账户(可选)
   * @returns [用户授权配置列表, AI代理配置列表, 错误信息]
   */
  GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    vaccount?: string
  ): Promise<[UserProxyCallConfig[] | null, AIProxyConfig[] | null, Error | null]>;
  
  /**
   * 获取当前用户自身的AI代理授权信息
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param configTheme 配置主题
   * @returns [授权配置, 错误信息]
   */
  GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[ProxyCallConfig, Error | null]>;
  
  /**
   * 执行AI代理调用
   * 包括代理与AI的通信或者与MCPServer的通信
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param configTheme 配置主题
   * @param serviceName 服务器名称
   * @param reqBody 请求体
   * @param forceRefresh 是否强制刷新,强制刷鞋会消耗一定数量的token,一般在更新了用户授权后,才需要强制刷新
   * @param onStreamResponse 流式响应回调函数
   * @param headers 请求头(可选)
   * @param path 请求路径(可选)
   * @param model 模型名称(可选)
   * @returns 调用状态码
   */
  DoAIProxyCall(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
    reqBody: string,
    forceRefresh: boolean,
    onStreamResponse?: OnStreamResponseType,
    headers?: string,
    path?: string,
    model?: string
  ): Promise<number>;
}