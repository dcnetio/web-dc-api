import {
  AIProxyConfig,
  GetUserAIProxyAuthParams,
  IAICallConfig,
  OnStreamResponseType,
  ProxyCallConfig,
  UserProxyCallConfig,
} from "../common/types/types";
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
  ): Promise<[number | null, Error | null]>;

  /**
   * 删除AI调用的Proxy配置
   * @param appId 应用ID
   * @param configTheme 配置主题
   * @returns [状态码, 错误信息]
   */
  deleteProxyConfig(
    appId: string,
    configTheme: string
  ): Promise<[number | null, Error | null]>;

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
  ): Promise<[boolean | null, Error | null]>;

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
  ): Promise<[number | null, Error | null]>;

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
  ): Promise<
    [UserProxyCallConfig[] | null, AIProxyConfig[] | null, Error | null]
  >;

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
  ): Promise<[ProxyCallConfig | null, Error | null]>;

  /**
   * 执行AI代理调用
   * 包括代理与AI的通信或者与MCPServer的通信
   * @param reqBody 请求体
   * @param forceRefresh 是否强制刷新,强制刷鞋会消耗一定数量的token,一般在更新了用户授权后,才需要强制刷新
   * @param onStreamResponse 流式响应回调函数
   * @param appId 应用ID(可选),为空时使用默认的调用配置中的appId
   * @param themeAuthor(可选) 主题作者的公钥,为空时使用默认的调用配置中的themeAuthor
   * @param configTheme(可选) 配置主题,为空时使用默认的调用配置中的configTheme
   * @param serviceName(可选) 服务器名称,为空时使用默认的调用配置中的serviceName
   * @param headers 请求头(可选),为空时使用默认的调用配置中的headers
   * @param path 请求路径(可选),为空时使用默认的调用配置中的path
   * @param model 模型名称(可选),为空时使用默认的调用配置中的model
   * @returns 调用状态码
   */
  DoAIProxyCall(
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
    model?: string
  ): Promise<[number | null, Error | null]>;

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
  SetAICallConfig(callConfig: IAICallConfig): Promise<Error | null>;

  /**
   * 获取用户授权信息
   * @param params 授权参数
   * @param params.appId 应用ID
   * @param params.themeAuthor 主题作者的公钥
   * @param params.configTheme 配置主题
   * @param params.UserPubkey 用户公钥
   * @param params.vaccount 虚拟账户
   * @returns [授权信息, 错误信息]
   */
  GetUserAIProxyAuth(
    params: GetUserAIProxyAuthParams
  ): Promise<[authConfigs: ProxyCallConfig[] | null, error: Error | null]>;
}
