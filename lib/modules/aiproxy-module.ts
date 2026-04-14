// modules/keyvalue-module.ts
// 键值存储功能模块

import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { createLogger } from "../util/logger";
import {
  AIProxyAliyunRealtimeAudioSessionOptions,
  AIProxyAliyunRealtimeVoiceSessionOptions,
  AIProxyConfig,
  AIProxyRealtimeConfig,
  AIProxyRealtimeAudioAuthInfo,
  AIProxyRealtimeAudioSessionOptions,
  AIProxyRealtimeVoiceSessionOptions,
  GetUserAIProxyAuthParams,
  IAIProxyRealtimeAudioSession,
  IAIProxyRealtimeVoiceSession,
  OnStreamResponseType,
  ProxyCallConfig,
  UserProxyCallConfig,
} from "../common/types/types";
import { AIProxyManager } from "../implements/aiproxy/manager";
import { AIProxyRealtimeAudioSession } from "../implements/aiproxy/realtime-audio-session";
import {
  AIProxyRealtimeVoiceSession,
  createAliyunRealtimeVoiceProtocolAdapter,
  createOpenAIRealtimeVoiceProtocolAdapter,
  createQwenMultimodalDialogAdapter,
  createWechatMiniProgramRealtimeSocketFactory,
  resolveRealtimeVoiceRuntime,
} from "../implements/aiproxy/realtime-voice-session";
import { AIProxyUserPermission } from "../common/constants";

const logger = createLogger("KeyValueModule");
const REALTIME_AUTH_MARKER_HEADER = "X-DC-Realtime-Auth";
const REALTIME_AUTH_MARKER_VALUE = "1";

import { IAICallConfig } from "../common/types/types";
import { IAIProxyOperations } from "../../lib/interfaces/aiproxy-interface";

type ResolvedAICallConfig = {
  appId: string;
  themeAuthor: string;
  configTheme: string;
  serviceName: string;
  headersStr: string;
  path?: string;
  model?: string;
};

const isAliyunOpenAIRealtimeModel = (model?: string): boolean => {
  const normalizedModel = String(model || "").trim().toLowerCase();
  if (!normalizedModel) {
    return false;
  }
  if (
    normalizedModel.includes("paraformer") ||
    normalizedModel.includes("sensevoice") ||
    normalizedModel.includes("cosyvoice") ||
    normalizedModel.includes("sambert") ||
    normalizedModel.includes("gummy")
  ) {
    return false;
  }
  return (
    normalizedModel.includes("qwen-omni") ||
    normalizedModel.includes("qwen3") ||
    normalizedModel.includes("omni-plus-realtime") ||
    normalizedModel.includes("tts-flash-realtime") ||
    (normalizedModel.includes("omni") && normalizedModel.includes("realtime")) ||
    (normalizedModel.includes("qwen") && normalizedModel.includes("realtime"))
  );
};

/**
 * AI代理模块
 * 提供AI代理的配置和调用
 */
export class AIProxyModule implements DCModule, IAIProxyOperations {
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
    configTheme: string
  ): Promise<[number | null, Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.createProxyConfig(appId, configTheme);
    } catch (error) {
      return Promise.resolve([null, error as Error]);
    }
  }

  async deleteProxyConfig(
    appId: string,
    configTheme: string
  ): Promise<[number | null, Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.deleteProxyConfig(appId, configTheme);
    } catch (error) {
      return Promise.resolve([null, error as Error]);
    }
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
    try {
      this.assertInitialized();
      return this.aiProxyManager.configAIProxy(
        appId,
        configAuthor,
        configTheme,
        serviceName,
        serviceConfig,
        vaccount
      );
    } catch (error) {
      return Promise.resolve([null, error as Error]);
    }
  }

  //配置用户的访问权限
  async configAuth(
    appId: string,
    configAuthor: string,
    configTheme: string,
    authPubkey: string,
    permission: AIProxyUserPermission,
    authConfig: ProxyCallConfig[],
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.configAuth(
        appId,
        configAuthor,
        configTheme,
        authPubkey,
        permission,
        authConfig,
        vaccount
      );
    } catch (error) {
      return Promise.resolve([null, error as Error]);
    }
  }

  //获取的ai代理的所有配置,包括服务与授权列表
  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    vaccount?: string
  ): Promise<
    [UserProxyCallConfig[] | null, AIProxyConfig[] | null, Error | null]
  > {
    try {
      this.assertInitialized();
      return this.aiProxyManager.GetAIProxyConfig(
        appId,
        themeAuthor,
        configTheme,
        vaccount
      );
    } catch (error) {
      return Promise.resolve([null, null, error as Error]);
    }
  }

  async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[authConfig: ProxyCallConfig | null, error: Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.GetUserOwnAIProxyAuth(
        appId,
        themeAuthor,
        configTheme
      );
    } catch (error) {
      return Promise.resolve([null, error as Error]);
    }
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
        const resolvedConfig = this.resolveAICallConfig(
          appId,
          themeAuthor,
          configTheme,
          serviceName,
          headers,
          path,
          model,
        );
        console.debug("开始调用AI代理: themeAuthor=", themeAuthor, " configTheme=", configTheme, " serviceName=", serviceName);

        const res = await this.aiProxyManager.DoAIProxyCall(
          context,
          resolvedConfig.appId,
          resolvedConfig.themeAuthor,
          resolvedConfig.configTheme,
          resolvedConfig.serviceName,
          reqBody,
          forceRefresh,
          onStreamResponse,
          resolvedConfig.headersStr,
          resolvedConfig.path,
          resolvedConfig.model,
        );
        return [res, null];
      } catch (error) {
        logger.error("AI代理调用失败:", error);
        return [null, error instanceof Error ? error : new Error(String(error))];
      }
  }

  async GetAliyunV3Token(params: {
    channelId?: string;
    userId?: string;
    reqBody?: Record<string, any>;
    forceRefresh?: boolean;
    appId?: string;
    themeAuthor?: string;
    configTheme?: string;
    serviceName?: string;
  }): Promise<[ { token: string,serviceAppId?: string, expiresAt?: number, expiresIn?: number } | null, Error | null ]> {
    try {
      this.assertInitialized();

      const resolvedConfig = this.resolveAICallConfig(
        params.appId,
        params.themeAuthor,
        params.configTheme,
        params.serviceName,
        undefined,
        undefined,
        undefined
      );

      const requestBody = JSON.stringify({
        ...(params.reqBody || {}),
        channelId: params.channelId,
        userId: params.userId,
      });

      let payloadText = "";
      let streamError: Error | null = null;

      const [status, error] = await this.DoAIProxyCall(
        {}, // context
        requestBody,
        !!params.forceRefresh,
        (flag, content, err) => {
          if (content) {
            payloadText += content;
          }
          if (err) {
            streamError = new Error(err);
            return;
          }
          // flag 2/3/7/88/99 are typically errors in stream processing
          if (flag === 2 || flag === 3 || flag === 7 || flag === 88 || flag === 99) {
            streamError = new Error(err || "获取阿里云V3 Token鉴权信息失败");
          }
        },
        resolvedConfig.appId,
        resolvedConfig.themeAuthor,
        resolvedConfig.configTheme,
        resolvedConfig.serviceName,
        undefined, // headers
        resolvedConfig.path,
        undefined // model
      );

      if (error) {
        throw error;
      }
      if (streamError) {
        throw streamError;
      }
      if (status == null) {
        throw new Error("获取阿里云V3 Token请求失败");
      }
      if (!payloadText.trim()) {
        throw new Error("阿里云V3 Token返回为空");
      }

      const parsed = JSON.parse(payloadText) as Record<string, unknown>;
      
      if (typeof parsed.token !== "string" || !parsed.token) {
        throw new Error("返回数据中未包含有效 token 字段");
      }

      return [{
        token: parsed.token,
        serviceAppId: typeof parsed.app_id === "string" ? parsed.app_id : undefined,
        expiresAt: typeof parsed.expires_at === "number" ? parsed.expires_at : undefined,
        expiresIn: typeof parsed.expires_in === "number" ? parsed.expires_in : undefined,
      }, null];

    } catch (e) {
      logger.error("获取阿里云V3 Token发生异常:", e);
      return [null, e instanceof Error ? e : new Error(String(e))];
    }
  }

  async CreateAudioSocket(
    options: AIProxyRealtimeAudioSessionOptions,
  ): Promise<[IAIProxyRealtimeAudioSession | null, Error | null]> {
    try {
      this.assertInitialized();
      const resolvedConfig = this.resolveAICallConfig(
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.serviceName,
        options.headers,
        options.path,
        undefined, // 实时鉴权获取时不需要附带具体的 model
      );
      const session = new AIProxyRealtimeAudioSession(
        options,
        async (forceRefresh: boolean): Promise<AIProxyRealtimeAudioAuthInfo> => {
          return this.fetchRealtimeAudioAuthInfo(
            options,
            forceRefresh,
            resolvedConfig,
          );
        },
      );
      await session.connect();
      return [session, null];
    } catch (error) {
      logger.error("创建实时音频会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
    }
  }

  async CreateAliyunAudioSocket(
    options: AIProxyAliyunRealtimeAudioSessionOptions,
  ): Promise<[IAIProxyRealtimeAudioSession | null, Error | null]> {
    try {
      this.assertInitialized();
      const resolvedConfig = this.resolveAICallConfig(
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.serviceName,
        options.headers,
        options.path,
        options.model,
      );
      const realtimeConfig = this.buildAliyunRealtimeConfig(
        resolvedConfig,
        options,
      );
      return this.CreateAudioSocket({
        ...options,
        appId: resolvedConfig.appId,
        themeAuthor: resolvedConfig.themeAuthor,
        configTheme: resolvedConfig.configTheme,
        serviceName: resolvedConfig.serviceName,
        path: resolvedConfig.path,
        model: resolvedConfig.model,
        realtimeConfig,
      });
    } catch (error) {
      logger.error("创建阿里云实时音频会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
    }
  }

  async CreateVoiceSession(
    options: AIProxyRealtimeVoiceSessionOptions,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]> {
    try {
      this.assertInitialized();
      const resolvedConfig = this.resolveAICallConfig(
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.serviceName,
        options.headers,
        options.path,
        options.model,
      );
      const normalizedOptions = this.normalizeRealtimeVoiceSessionOptions({
        ...options,
        appId: resolvedConfig.appId,
        themeAuthor: resolvedConfig.themeAuthor,
        configTheme: resolvedConfig.configTheme,
        serviceName: resolvedConfig.serviceName,
        path: resolvedConfig.path,
        model: resolvedConfig.model,
      });
      const voiceSession = new AIProxyRealtimeVoiceSession(
        normalizedOptions,
        async (hooks) => {
          const [transport, error] = await this.CreateAudioSocket({
            ...normalizedOptions,
            onConnected: (session, authInfo) => {
              hooks.onConnected?.(session, authInfo);
              normalizedOptions.onConnected?.(session, authInfo);
            },
            onMessage: (data, event) => {
              hooks.onMessage?.(data, event);
              normalizedOptions.onMessage?.(data, event);
            },
            onJsonMessage: (data, event) => {
              hooks.onJsonMessage?.(data, event);
              normalizedOptions.onJsonMessage?.(data, event);
            },
            onError: (error) => {
              hooks.onError?.(error);
              normalizedOptions.onError?.(error);
            },
            onClose: (event) => {
              hooks.onClose?.(event);
              normalizedOptions.onClose?.(event);
            },
          });

          if (error || !transport) {
            throw error || new Error("创建实时语音底层会话失败");
          }

          return transport;
        },
      );
      await voiceSession.connect();
      return [voiceSession, null];
    } catch (error) {
      logger.error("创建实时语音会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
    }
  }

  async CreateAliyunTranscriptionSession(
    options: AIProxyAliyunRealtimeVoiceSessionOptions,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]> {
    try {
      this.assertInitialized();
      const resolvedConfig = this.resolveAICallConfig(
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.serviceName,
        options.headers,
        options.path,
        options.model,
      );
      const useOpenAIRealtimeProtocol = isAliyunOpenAIRealtimeModel(
        resolvedConfig.model,
      );
      const effectiveResolvedConfig = useOpenAIRealtimeProtocol
        ? {
            ...resolvedConfig,
            path: resolvedConfig.path || "/api-ws/v1/realtime",
          }
        : resolvedConfig;
      const realtimeConfig = this.buildAliyunRealtimeConfig(
        effectiveResolvedConfig,
        options,
      );
      const stopVoiceInputOptions = {
        commit: options.aliyunProtocolOptions?.autoCommitOnStop ?? true,
        requestResponse:
          options.aliyunProtocolOptions?.autoCreateResponseOnStop ?? true,
        finishSession: false,
        ...(options.stopVoiceInputOptions || {}),
      };

      const shouldUseMultimodalDialog = !useOpenAIRealtimeProtocol && (
        effectiveResolvedConfig.model === "multimodal-dialog" ||
        effectiveResolvedConfig.model?.includes("cosyvoice") ||
        effectiveResolvedConfig.model?.includes("sambert") ||
        effectiveResolvedConfig.model?.includes("gummy")
      );

      return this.CreateVoiceSession({
        ...options,
        appId: effectiveResolvedConfig.appId,
        themeAuthor: effectiveResolvedConfig.themeAuthor,
        configTheme: effectiveResolvedConfig.configTheme,
        serviceName: effectiveResolvedConfig.serviceName,
        path: effectiveResolvedConfig.path,
        model: effectiveResolvedConfig.model,
        realtimeConfig,
        ...(useOpenAIRealtimeProtocol ? {
          resolveAuthInfo: (payloadText: string) => {
            const info = this.parseRealtimeAudioAuthInfoWithServiceConfig(
              payloadText,
              realtimeConfig,
            );
            const finalUrl = this.normalizeOpenAIRealtimeWebSocketUrl(
              info.url || info.websocketUrl,
              options.websocketBaseUrl,
              effectiveResolvedConfig.model,
            );
            let updatedAuthMode = info.authMode;
            let updatedQueryName = info.authQueryName;
            const actualToken = info.apiKey || info.token || info.tempToken;
            let updatedApiKey = info.apiKey;
            if (actualToken && info.authMode === "bearer") {
              updatedAuthMode = "apikey";
              updatedQueryName = "api_key";
              updatedApiKey = actualToken;
            }
            return {
              ...info,
              url: finalUrl,
              websocketUrl: finalUrl,
              endpoint: finalUrl,
              authMode: updatedAuthMode,
              authQueryName: updatedQueryName,
              apiKey: updatedApiKey,
            };
          },
        } : {}),
        stopVoiceInputOptions,
        protocolAdapter: useOpenAIRealtimeProtocol
          ? createOpenAIRealtimeVoiceProtocolAdapter({
              ...options.aliyunProtocolOptions,
              model: effectiveResolvedConfig.model,
            })
          : shouldUseMultimodalDialog
            ? createQwenMultimodalDialogAdapter({
                ...options.aliyunProtocolOptions,
                model: effectiveResolvedConfig.model,
              })
            : createAliyunRealtimeVoiceProtocolAdapter({
                ...options.aliyunProtocolOptions,
                model: effectiveResolvedConfig.model,
              }),
      });
    } catch (error) {
      logger.error("创建阿里云实时语音会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
    }
  }

  async CreateConversationalVoiceSession(
    options: AIProxyAliyunRealtimeVoiceSessionOptions,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]> {
    try {
      this.assertInitialized();
      const resolvedConfig = this.resolveAICallConfig(
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.serviceName,
        options.headers,
        options.path,
        options.model,
      );
      // Explicitly set Qwen-Omni real-time endpoint if one wasn't provided
      const qwenResolvedConfig = {
        ...resolvedConfig,
        path: resolvedConfig.path || "/api-ws/v1/realtime",
      };
      const realtimeConfig = this.buildAliyunRealtimeConfig(
        qwenResolvedConfig,
        options,
      );
      const stopVoiceInputOptions = {
        commit: options.aliyunProtocolOptions?.autoCommitOnStop ?? true,
        requestResponse:
          options.aliyunProtocolOptions?.autoCreateResponseOnStop ?? true,
        finishSession: false,
        ...(options.stopVoiceInputOptions || {}),
      };

      return this.CreateVoiceSession({
        ...options,
        appId: resolvedConfig.appId,
        themeAuthor: resolvedConfig.themeAuthor,
        configTheme: resolvedConfig.configTheme,
        serviceName: resolvedConfig.serviceName,
        path: resolvedConfig.path,
        model: resolvedConfig.model,
        realtimeConfig,
        resolveAuthInfo: (payloadText: string) => {
          const info = this.parseRealtimeAudioAuthInfoWithServiceConfig(
            payloadText,
            realtimeConfig,
          );
          const finalUrl = this.normalizeOpenAIRealtimeWebSocketUrl(
            info.url || info.websocketUrl,
            options.websocketBaseUrl,
            resolvedConfig.model,
          );
          // Fix for Qwen browser Websocket api missing token natively
          // If bearer but missing from url, Qwen actually expects api_key param
          let updatedAuthMode = info.authMode;
          let updatedQueryName = info.authQueryName;
          const actualToken = info.apiKey || info.token || info.tempToken;
          let updatedApiKey = info.apiKey;
          if (actualToken && info.authMode === "bearer") {
               updatedAuthMode = "apikey";
               updatedQueryName = "api_key";
               updatedApiKey = actualToken;
          }
          return {
            ...info,
            url: finalUrl,
            websocketUrl: finalUrl,
            endpoint: finalUrl,
            authMode: updatedAuthMode,
            authQueryName: updatedQueryName,
            apiKey: updatedApiKey
          };
        },
        stopVoiceInputOptions,
        protocolAdapter: createOpenAIRealtimeVoiceProtocolAdapter({ ...options.aliyunProtocolOptions, model: resolvedConfig.model }),
      });
    } catch (error) {
      logger.error("创建OpenAI/Qwen实时语音会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
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
  async SetAICallConfig(callConfig: IAICallConfig): Promise<Error | null> {
    try {
      this.assertInitialized();
      this.aiCallConfig = callConfig;
      return null;
    } catch (error) {
      logger.error("设置AI调用配置失败:", error);
      return error as Error;
    }
  }

  async GetUserAIProxyAuth(
    params: GetUserAIProxyAuthParams
  ): Promise<[authConfigs: ProxyCallConfig[] | null, error: Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.GetUserAIProxyAuth(params);
    } catch (error) {
      return Promise.resolve([null, error as Error]);
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

  private resolveAICallConfig(
    appId?: string,
    themeAuthor?: string,
    configTheme?: string,
    serviceName?: string,
    headers?: Record<string, string>,
    path?: string,
    model?: string,
  ): ResolvedAICallConfig {
    if (
      this.aiCallConfig == null &&
      (!appId || !themeAuthor || !configTheme || !serviceName)
    ) {
      throw new Error("AI调用配置未设置");
    }

    const resolvedConfigTheme = configTheme || this.aiCallConfig?.theme;
    if (!resolvedConfigTheme) {
      throw new Error("配置主题不能为空");
    }

    const resolvedAppId = appId || this.aiCallConfig?.appId;
    if (!resolvedAppId) {
      throw new Error("应用ID不能为空");
    }

    const resolvedThemeAuthor = themeAuthor || this.aiCallConfig?.themeAuthor;
    if (!resolvedThemeAuthor) {
      throw new Error("主题作者公钥不能为空");
    }

    const resolvedServiceName = serviceName || this.aiCallConfig?.service;
    if (!resolvedServiceName) {
      throw new Error("服务名称不能为空");
    }

    const resolvedHeaders = headers || this.aiCallConfig?.headers;

    return {
      appId: resolvedAppId,
      themeAuthor: resolvedThemeAuthor,
      configTheme: resolvedConfigTheme,
      serviceName: resolvedServiceName,
      headersStr: resolvedHeaders ? JSON.stringify(resolvedHeaders) : "",
      path: path || this.aiCallConfig?.path,
      model: model || this.aiCallConfig?.model,
    };
  }

  private normalizeRealtimeVoiceSessionOptions(
    options: AIProxyRealtimeVoiceSessionOptions,
  ): AIProxyRealtimeVoiceSessionOptions {
    const runtime = resolveRealtimeVoiceRuntime(options.runtime);
    if (runtime !== "mini-program" || options.createWebSocket) {
      return {
        ...options,
        runtime,
      };
    }

    return {
      ...options,
      runtime,
      createWebSocket: createWechatMiniProgramRealtimeSocketFactory(
        options.miniProgramOptions?.wx,
      ),
    };
  }

  private async fetchRealtimeAudioAuthInfo(
    options: AIProxyRealtimeAudioSessionOptions,
    forceRefresh: boolean,
    resolvedConfig: ResolvedAICallConfig,
  ): Promise<AIProxyRealtimeAudioAuthInfo> {
    const requestBody =
      typeof options.initRequestBody === "string"
        ? options.initRequestBody
        : JSON.stringify(options.initRequestBody);

    let payloadText = "";
    let streamError: Error | null = null;
    const authHeaders = {
      ...(options.realtimeConfig?.extend || {}),
      ...(options.headers || {}),
      [REALTIME_AUTH_MARKER_HEADER]: REALTIME_AUTH_MARKER_VALUE,
    };

    const [status, error] = await this.DoAIProxyCall(
      options.context || {},
      requestBody,
      forceRefresh,
      (flag, content, err) => {
        if (content) {
          payloadText += content;
        }
        if (err) {
          streamError = new Error(err);
          return;
        }
        if (flag === 2 || flag === 3 || flag === 7 || flag === 88 || flag === 99) {
          streamError = new Error(err || "获取实时音频鉴权信息失败");
        }
      },
      resolvedConfig.appId,
      resolvedConfig.themeAuthor,
      resolvedConfig.configTheme,
      resolvedConfig.serviceName,
      authHeaders,
      resolvedConfig.path,
      undefined,
    );

    if (error) {
      throw error;
    }
    if (streamError) {
      throw streamError;
    }
    if (status == null) {
      throw new Error("获取实时音频鉴权信息失败");
    }
    if (!payloadText.trim()) {
      throw new Error("实时音频鉴权返回为空");
    }

    return this.parseRealtimeAudioAuthInfo(
      payloadText,
      options,
    );
  }

  private parseRealtimeAudioAuthInfo(
    payloadText: string,
    options: AIProxyRealtimeAudioSessionOptions,
  ): AIProxyRealtimeAudioAuthInfo {
    if (options.resolveAuthInfo) {
      return options.resolveAuthInfo(payloadText);
    }

    const realtimeConfig = options.realtimeConfig;
    if (realtimeConfig?.enabled) {
      return this.parseRealtimeAudioAuthInfoWithServiceConfig(
        payloadText,
        realtimeConfig,
      );
    }

    const parsed = JSON.parse(payloadText) as Record<string, unknown>;
    const proxyResponse = this.extractRealtimeAudioProxyResponse(parsed);
    const connection = proxyResponse.connection;
    const headers = this.toStringMap(connection.headers);
    const query = this.toStringValueMap(connection.query);

    const protocolsValue = connection.protocols;
    const protocols = Array.isArray(protocolsValue)
      ? protocolsValue.filter((item): item is string => typeof item === "string")
      : undefined;

    const authorization = headers?.Authorization || headers?.authorization;
    const bearerCredential = this.extractBearerCredential(authorization);
      const resolvedHeaders = bearerCredential
        ? {
            ...(headers || {}),
            Authorization: authorization || `Bearer ${bearerCredential}`,
          }
        : headers;
    const expiresAt =
      this.toNumberOrString(proxyResponse.expires_at) ||
      this.toNumberOrString(proxyResponse.expiresAt);
    const expiresIn =
      this.toOptionalNumber(proxyResponse.expires_in) ||
      this.toOptionalNumber(proxyResponse.expiresIn) ||
      (bearerCredential ? 600 : undefined);

    return {
      websocketUrl: connection.url,
      url: connection.url,
      endpoint: connection.url,
        headers: resolvedHeaders,
      query,
      protocols,
      apiKey: bearerCredential,
      tempApiKey: bearerCredential,
        authMode: bearerCredential ? "bearer" : "none",
      expiresAt,
      expiresIn,
      reconnectOnRefresh: true,
      metadata: {
        protocol: connection.protocol,
        scenario: this.toOptionalString(proxyResponse.scenario),
      },
    };
  }

  private parseRealtimeAudioAuthInfoWithServiceConfig(
    payloadText: string,
    realtimeConfig: AIProxyRealtimeConfig,
  ): AIProxyRealtimeAudioAuthInfo {
    const parsed = JSON.parse(payloadText) as Record<string, unknown>;
    const proxyRealtime = parsed.realtime as AIProxyRealtimeConfig | undefined;
    
    const responseConfig = proxyRealtime?.response || realtimeConfig.response;
    const connectionPreset = { 
      ...realtimeConfig.connection,
      ...(proxyRealtime?.connection || {})
    } as Exclude<AIProxyRealtimeConfig["connection"], undefined>;
    const actualDataField = responseConfig?.actualDataField || "providerData";
    const customResponse = responseConfig?.customResponse === true;

    const responseConnection = this.extractRealtimeConnectionFromPayload(parsed);
    const responseCredentials = customResponse
      ? this.extractRealtimeCredentialsFromPayload(parsed)
      : this.extractRealtimeCredentialsFromPayload(parsed, parsed);

    const mergedHeaders = {
      ...(connectionPreset?.headers || {}),
      ...(responseConnection?.headers || {}),
    };
    if (responseCredentials.authorization && !mergedHeaders.Authorization) {
      mergedHeaders.Authorization = responseCredentials.authorization;
    }

    const extractedPresetUrlParams: Record<string, string> = {};
    if (realtimeConfig.connection?.url) {
      try {
        const uString = realtimeConfig.connection.url.startsWith("http") || realtimeConfig.connection.url.startsWith("ws") ? realtimeConfig.connection.url : "ws://localhost" + realtimeConfig.connection.url;
        const u = new URL(uString);
        u.searchParams.forEach((val, key) => {
          extractedPresetUrlParams[key] = val;
        });
      } catch {}
    }

    const mergedQuery = {
      ...extractedPresetUrlParams,
      ...(connectionPreset?.query || {}),
      ...(responseConnection?.query || {}),
    };

    const mergedProtocols = responseConnection?.protocols?.length
      ? responseConnection.protocols
      : connectionPreset?.protocols;
    const mergedUrl =
      responseConnection?.url || connectionPreset?.url;

    if (!mergedUrl) {
      throw new Error("实时调用服务配置缺少 connection.url");
    }

    const providerData = this.extractActualRealtimePayload(parsed, actualDataField);
    const expiresIn =
      responseCredentials.expiresIn || responseConfig?.defaultExpiresIn;

    return {
      websocketUrl: mergedUrl,
      url: mergedUrl,
      endpoint: mergedUrl,
      headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : undefined,
      query: Object.keys(mergedQuery).length > 0 ? mergedQuery : undefined,
      protocols: mergedProtocols,
      token: responseCredentials.token,
      tempToken: responseCredentials.tempToken,
      apiKey: responseCredentials.apiKey,
      tempApiKey: responseCredentials.tempApiKey,
      authMode:
        responseCredentials.authMode ||
        connectionPreset?.authMode ||
        this.inferRealtimeAuthMode(responseCredentials),
      authQueryName: connectionPreset?.authQueryName,
      expiresAt: responseCredentials.expiresAt,
      expiresIn,
      reconnectOnRefresh: responseConfig?.reconnectOnRefresh ?? true,
      metadata: {
        protocol: responseConnection?.protocol || connectionPreset?.protocol,
        [actualDataField]: providerData,
      },
    };
  }

  private extractRealtimeConnectionFromPayload(
    parsed: Record<string, unknown>,
  ): {
    protocol?: "WebSocket";
    url?: string;
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean>;
    protocols?: string[];
  } | null {
    let connectionValue = parsed.connection;
    if (!connectionValue && parsed.realtime && typeof parsed.realtime === "object") {
      connectionValue = (parsed.realtime as Record<string, unknown>).connection;
    }
    
    if (!connectionValue || typeof connectionValue !== "object" || Array.isArray(connectionValue)) {
      return null;
    }

    const connection = connectionValue as Record<string, unknown>;
    const protocol = this.toOptionalString(connection.protocol) as
      | "WebSocket"
      | undefined;
    const url = this.toOptionalString(connection.url);
    return {
      protocol,
      url,
      headers: this.toStringMap(connection.headers),
      query: this.toStringValueMap(connection.query),
      protocols: Array.isArray(connection.protocols)
        ? connection.protocols.filter(
            (item): item is string => typeof item === "string",
          )
        : undefined,
    };
  }

  private extractRealtimeCredentialsFromPayload(
    parsed: Record<string, unknown>,
    fallbackSource?: Record<string, unknown>,
  ): {
    token?: string;
    tempToken?: string;
    apiKey?: string;
    tempApiKey?: string;
      authorization?: string;
    expiresAt?: number | string;
    expiresIn?: number;
      authMode?: "token" | "apikey" | "bearer" | "none";
  } {
    const credentialsValue = parsed.credentials;
    const credentialSource =
      credentialsValue &&
      typeof credentialsValue === "object" &&
      !Array.isArray(credentialsValue)
        ? (credentialsValue as Record<string, unknown>)
        : fallbackSource || parsed;

    const authorization = this.toOptionalString(
      (credentialSource.Authorization ||
        credentialSource.authorization) as unknown,
    );
    const tempToken = this.toOptionalString(
      credentialSource.tempToken || credentialSource.token,
    );
    const tempApiKey = this.toOptionalString(
      credentialSource.tempApiKey || credentialSource.apiKey,
    );

    return {
      authorization,
      token: this.toOptionalString(credentialSource.token),
      tempToken,
      apiKey: this.toOptionalString(credentialSource.apiKey),
      tempApiKey,
      expiresAt:
        this.toNumberOrString(credentialSource.expiresAt) ||
        this.toNumberOrString(credentialSource.expires_at),
      expiresIn:
        this.toOptionalNumber(credentialSource.expiresIn) ||
        this.toOptionalNumber(credentialSource.expires_in),
      authMode: this.toOptionalString(credentialSource.authMode) as
        | "token"
        | "apikey"
        | "bearer"
        | "none"
        | undefined,
    };
  }

  private extractActualRealtimePayload(
    parsed: Record<string, unknown>,
    actualDataField: string,
  ): unknown {
    if (Object.prototype.hasOwnProperty.call(parsed, actualDataField)) {
      return parsed[actualDataField];
    }
    return parsed;
  }

  private inferRealtimeAuthMode(credentials: {
    token?: string;
    tempToken?: string;
    apiKey?: string;
    tempApiKey?: string;
      authorization?: string;
    }): "token" | "apikey" | "bearer" | "none" {
    if (credentials.tempToken || credentials.token) {
      return "token";
    }
      if (credentials.authorization) {
        return "bearer";
      }
    if (credentials.tempApiKey || credentials.apiKey) {
      return "apikey";
    }
    return "none";
  }

  private buildAliyunRealtimeConfig(
    resolvedConfig: ResolvedAICallConfig,
    options: AIProxyAliyunRealtimeAudioSessionOptions,
  ): AIProxyRealtimeConfig {
    return {
      enabled: true,
      connection: {
        protocol: "WebSocket",
        url: this.buildAliyunRealtimeWebSocketUrl(
          options.websocketBaseUrl,
          resolvedConfig.path,
        ),
        authMode: "apikey",
        authQueryName: options.authQueryName || "api_key",
      },
      response: {
        customResponse: true,
        actualDataField: options.actualDataField || "providerData",
        defaultExpiresIn: options.defaultExpiresIn || 600,
        reconnectOnRefresh: true,
      },
    };
  }

  private buildAliyunRealtimeWebSocketUrl(
    websocketBaseUrl: string | undefined,
    path: string | undefined,
  ): string {
    const defaultBaseUrl = websocketBaseUrl || "wss://dashscope.aliyuncs.com";
    const defaultPath = path || "/api-ws/v1/inference";

    const url =
      defaultPath.startsWith("ws://") ||
      defaultPath.startsWith("wss://") ||
      defaultPath.startsWith("http://") ||
      defaultPath.startsWith("https://")
        ? new URL(defaultPath)
        : new URL(defaultPath, defaultBaseUrl);

    if (url.protocol === "http:") {
      url.protocol = "ws:";
    } else if (url.protocol === "https:") {
      url.protocol = "wss:";
    }

    return url.toString();
  }

  private normalizeOpenAIRealtimeWebSocketUrl(
    rawUrl: string | undefined,
    websocketBaseUrl: string | undefined,
    model: string | undefined,
  ): string {
    if (!rawUrl) {
      return this.buildAliyunRealtimeWebSocketUrl(
        websocketBaseUrl,
        "/api-ws/v1/realtime",
      );
    }

    try {
      const parsed = new URL(rawUrl);
      const pathname = parsed.pathname || "";
      const isDashscopeHost = parsed.hostname.includes("dashscope.aliyuncs.com");
      const isInferencePath = pathname.includes("/api-ws/v1/inference");
      const isProxyDashscopeRealtimePath = pathname.includes("dashscope-realtime");

      // For custom proxy domains, preserve the returned websocket path exactly as-is.
      // The proxy service already knows how to route to the correct downstream realtime path.
      // The legacy proxy path /dashscope-realtime still expects model in query.
      if (!isDashscopeHost) {
        if (isProxyDashscopeRealtimePath) {
          if (model && !parsed.searchParams.has("model")) {
            parsed.searchParams.set("model", model);
          }
        } else {
          parsed.searchParams.delete("model");
        }
        return parsed.toString();
      }

      parsed.searchParams.delete("model");

      if (!isInferencePath) {
        return parsed.toString();
      }

      const normalizedUrl = this.buildAliyunRealtimeWebSocketUrl(
        `${parsed.protocol}//${parsed.host}`,
        "/api-ws/v1/realtime",
      );
      const rebuilt = new URL(normalizedUrl);

      parsed.searchParams.forEach((value, key) => {
        if (key === "model") {
          return;
        }
        if (!rebuilt.searchParams.has(key)) {
          rebuilt.searchParams.set(key, value);
        }
      });

      return rebuilt.toString();
    } catch {
      return this.buildAliyunRealtimeWebSocketUrl(
        websocketBaseUrl || rawUrl,
        "/api-ws/v1/realtime",
      );
    }
  }

  private extractRealtimeAudioProxyResponse(
    parsed: Record<string, unknown>,
  ): {
    connection: {
      protocol: string;
      url: string;
      headers?: Record<string, string>;
      query?: Record<string, string | number | boolean>;
      protocols?: string[];
    };
    expires_at?: number | string;
    expiresAt?: number | string;
    expires_in?: number;
    expiresIn?: number;
    scenario?: string;
  } {
    const candidates = [parsed, parsed.data, parsed.result]
      .filter((item): item is Record<string, unknown> => {
        return !!item && typeof item === "object" && !Array.isArray(item);
      });

    for (const candidate of candidates) {
      const connectionValue = candidate.connection;
      if (!connectionValue || typeof connectionValue !== "object" || Array.isArray(connectionValue)) {
        continue;
      }

      const connection = connectionValue as Record<string, unknown>;
      const protocol = this.toOptionalString(connection.protocol);
      const url = this.toOptionalString(connection.url);
      if (!protocol || protocol.toLowerCase() !== "websocket" || !url) {
        continue;
      }

      return {
        connection: {
          protocol,
          url,
          headers: this.toStringMap(connection.headers),
          query: this.toStringValueMap(connection.query),
          protocols: Array.isArray(connection.protocols)
            ? connection.protocols.filter(
                (item): item is string => typeof item === "string",
              )
            : undefined,
        },
        expires_at: this.toNumberOrString(candidate.expires_at),
        expiresAt: this.toNumberOrString(candidate.expiresAt),
        expires_in: this.toOptionalNumber(candidate.expires_in),
        expiresIn: this.toOptionalNumber(candidate.expiresIn),
        scenario: this.toOptionalString(candidate.scenario),
      };
    }

    throw new Error(
      "实时音频鉴权返回结构不符合预期，需包含 connection.protocol=WebSocket 和 connection.url",
    );
  }

  private extractBearerCredential(value?: string): string | undefined {
    if (!value) {
      return undefined;
    }

    const match = value.trim().match(/^bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }

    return undefined;
  }

  private toOptionalString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value : undefined;
  }

  private toOptionalNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  }

  private toNumberOrString(value: unknown): number | string | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    return undefined;
  }

  private toStringMap(value: unknown): Record<string, string> | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }

    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item != null)
      .map(([key, item]) => [key, String(item)] as const);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  private toStringValueMap(
    value: unknown,
  ): Record<string, string | number | boolean> | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }

    const result: Record<string, string | number | boolean> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        result[key] = item;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }
}
