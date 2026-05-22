import {
  AIProxyAliyunRealtimeAudioSessionOptions,
  AIProxyAliyunRealtimeVoiceSessionOptions,
  AIProxyConfig,
  AIServiceUsage,
  AIProxyRealtimeAudioSessionOptions,
  AIProxyRealtimeVoiceSessionOptions,
  GetUserAIProxyAuthParams,
  IAICallConfig,
  IAIProxyRealtimeAudioSession,
  IAIProxyRealtimeVoiceSession,
  OnStreamResponseType,
  ProxyCallConfig,
  UserAIProxyAuthResult,
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
    authConfig: ProxyCallConfig[],
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
   * 获取当前用户在其备份节点上的使用量统计
   */
  GetUserOwnAIProxyUsage(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[Record<string, AIServiceUsage> | null, Error | null]>;

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
  *                如调用 MCP 通用服务并希望流式返回，请在 headers 中设置 Dc-Stream: true
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
   * 执行AI调用生成或编辑资源 (如图片生成、视频生成、PPT生成与编辑等)
   * 
   * 此方法在 DoAIProxyCall 的基础上，增加了资源结果统一解析功能。适用于需要提取富媒体资源（如图片、视频、文档）的场景。
   * 方法内部不仅会将原本流式响应的内容进行拼接，还会在响应结束时，尝试将完整结果解析为 JSON。
   * 然后遍历深度提取其中的 URL 链接，依据文件后缀或字段名自动归类至 imagelist, videolist, doclist 中，便于应用层直接渲染或下载。
   * 
   * @param context 控制调用的上下文，可传入 AbortSignal 取消请求
   * @param reqBody 请求体 (通常为 JSON 字符串格式)
   * @param forceRefresh 是否强制刷新 Token
   * @param onStreamResponse 流式响应回调 (如果不需要关心过程流，可传空函数)。当有流式数据到达时触发。
   * @param onResult 最终解析结果回调，会在底层完整响应结束 (如 CONNECTION_CLOSED 等) 时触发。
   *        - flag: 最终的完成标识状态码（参考 AIStreamResponseFlag）
   *        - result: 资源解析的完整对象。包括：
   *           - `origin_result`: 原始返回的完整内容，如果能转化为 JSON 则为 JSON 对象，否则为拼接的字符串。
   *           - `imagelist`: 提取到的图片链接列表。格式如: `[{"data.url": "https://..."}]`
   *           - `videolist`: 提取到的视频链接列表。格式如: `[{"video_uri": "https://..."}]`
   *           - `doclist`: 提取到的文档(PDF/PPT/TXT等)及其他链接列表。
   *        - err: 错误信息字符串
   * @param appId 应用ID(可选)
   * @param themeAuthor 主题作者公钥(可选)
   * @param configTheme 配置主题(可选)
   * @param serviceName 服务名称(可选)
   * @param headers 请求头(可选)
   * @param path 请求路径(可选)
   * @param model 模型名称(可选)

  /**
   * 提交生成类任务或流式输出，内置状态轮询生命周期钩子（通用大模型API、绘图等异
步任务封装）
   * @param context DC上下文
   * @param reqBody 请求体/Prompt
   * @param forceRefresh 是否强制刷新
   * @param options 参数与钩子回调配置
   */
  GenerateAndPollAIResource(
    context: { signal?: AbortSignal },
    reqBody: string,
    forceRefresh: boolean,
    options: {
      appId?: string;
      themeAuthor?: string;
      configTheme?: string;
      submitServiceName?: string;
      submitHeaders?: Record<string, string>;
      submitPath?: string;
      submitModel?: string;
      isAsync?: boolean;
      pollServiceName?: string;
      pollHeaders?: Record<string, string>;
      pollPath?: string;
      pollModel?: string;
      pollIntervalMs?: number;    // 轮询间隔 (默认 3000ms)
      pollTimeoutMs?: number;     // 轮询超时总时间 (默认 180000ms -> 3分钟)
      taskIdField?: string;       // 明确指定任务 ID 在 JSON 中的字段名
      existingTaskId?: string;    // 从外部直接传入已有的 task_id (跳过提交，直接进行轮询)
      buildPollReqBody?: (taskId: string) => string;
      buildPollPath?: (taskId: string) => string;
      onTaskSubmitted?: (taskId: string, initialResult: any) => void;
      onPollTick?: (pollResult: any) => void; 
    }
  ): Promise<[any, Error | null]>;

  /**
   * 单次任务轮询查询（提供给内建轮询调度使用，也可手动调用）
   * @param context DC上下文
   */
  PollAITaskResult(
    context: any,
    reqBody: string,
    forceRefresh?: boolean,
    appId?: string,
    themeAuthor?: string,
    configTheme?: string,
    serviceName?: string,
    headers?: Record<string, string>,
    path?: string,
    model?: string,
    taskIdField?: string
  ): Promise<[any, Error | null]>;


  /**
   * 获取阿里云V3的动态Token (通常用于 RTC / RTM 等场景)
   * 对应后端 ai_proxy_handler.go 中 endpoint 为 aliyun_createtoken_v3 的处理逻辑
   */
  GetAliyunV3Token(params: {
    /** 阿里云 RTC / RTM 会话使用的频道ID (Channel ID) */
    channelId?: string;
    /** 阿里云 RTC / RTM 会话使用的用户ID (User ID) */
    userId?: string;
    /**
     * 附加请求控制参数（根据后端 aliyun_apptoken.go 解析规则）。
     * @property expires_in - Token相对有效期(秒)，例如 3600，未指定则默认约12小时
     * @property expires_at / expiredts / timestamp - 绝对的到期时间戳(秒)
     * @property audio_publish - 是否允许发布音频，支持 "true", "1", "yes", "on" 或布尔值 true
     * @property video_publish - 是否允许发布视频，支持 "true", "1", "yes", "on" 或布尔值 true
     * @property screen_publish - 是否允许发布屏幕共享，支持 "true", "1", "yes", "on" 或布尔值 true
     * @property privilege - 直接指定 Int32 的权限掩码值 (如果指定，会覆盖音频/视频/屏幕共享的快速配置)
     * @property options - 高级配置结构，如 { engineOptions: { duration_per_channel: "3600", delay_close_per_channel: "300" } } (首层直接传 duration_per_channel 亦可)
     */
    reqBody?: Record<string, any>;
    /** 是否强制发起网络请求取新Token（避免只取到缓存的短效Token） */
    forceRefresh?: boolean;
    /** 应用ID，为空时使用初始化上下文默认配置 */
    appId?: string;
    /** 主题作者的公钥，为空时使用初始化上下文默认配置 */
    themeAuthor?: string;
    /** 配置主题，为空时使用初始化上下文默认配置 */
    configTheme?: string;
    /** 服务名称，为空时使用初始化上下文默认配置 */
    serviceName?: string;
    /** 额外请求头，可用于传递计价相关能力声明（如 audio_publish/video_publish/screen_publish） */
    headers?: Record<string, string>;
  }): Promise<[ { token: string,serviceAppId?: string, expiresAt?: number, expiresIn?: number } | null, Error | null ]>;

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
  ): Promise<[result: UserAIProxyAuthResult | null, error: Error | null]>;

  /**
   * 创建一个基于 DoAIProxyCall 预取鉴权信息的实时音频会话
   * 内部会负责凭据刷新、WebSocket 建连、音频数据转发和服务端消息回调
   * 注意: 如果 realtimeConfig.connection.authMode 使用 bearer，浏览器原生 WebSocket 通常不能直接附带 Authorization 握手头。
   * 这类场景请优先改用 query/token 形式，或通过 createWebSocket 提供支持自定义请求头的运行时实现。
   */
  CreateAudioSocket(
    options: AIProxyRealtimeAudioSessionOptions
  ): Promise<[IAIProxyRealtimeAudioSession | null, Error | null]>;

  /**
   * 创建阿里云 DashScope 实时音频会话
   * 内部会自动补齐实时连接模板和定制返回解析配置
   * 默认更适合 query 透传的 apikey 模式；若切换为 bearer，同样受浏览器原生 WebSocket 握手头限制影响。
   * 默认会按阿里云 DashScope 的 WebSocket 接口地址和 query api_key 透传方式构造连接参数。
   */
  CreateAliyunAudioSocket(
    options: AIProxyAliyunRealtimeAudioSessionOptions
  ): Promise<[IAIProxyRealtimeAudioSession | null, Error | null]>;

  /**
   * 创建统一的实时语音输入输出会话。
   * 该接口会在底层 realtime WebSocket 之上，再接管麦克风采集、音频帧发送、服务端语音帧解析和本地播放。
   * PC 浏览器、移动 H5、微信浏览器可直接复用浏览器默认音频适配器；小程序环境建议注入 createWebSocket、inputAdapter、outputAdapter，
   * 或至少通过 miniProgramOptions / 自定义适配器对接平台 API。
   */
  CreateVoiceSession(
    options: AIProxyRealtimeVoiceSessionOptions
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]>;

  /**
   * 创建多态兼容的阿里云实时语音/转写会话。
   * 这是一个通用的工厂方法，内部会根据传入的 `model` 名称动态选择底层协议适配器：
   * 1. 纯语音转写与翻译模型：自动分配阿里云原生协议适配器。
   * 2. 多模态对话模型 (如 multimodal-dialog, cosyvoice 等)：自动分配多模态对话适配器，包含特殊临时 Token 处理逻辑。
   * 3. OpenAI Realtime 兼容模型 (如 qwen-omni)：自动分配 OpenAI Realtime 协议适配器。
   * 
   * 推荐在动态切换多种语聊模型或主要用于实时转写场景下使用。
   * 浏览器环境默认可直接采集和播放；小程序环境建议注入平台专用的 socket 与音频适配器。
  *
  * 自动触发模式（VAD）：
  * ```
  * const [session] = await aiproxy.CreateAliyunTranscriptionSession({
  *   appId, themeAuthor, configTheme, serviceName,
  *   inputMode: "auto-vad",
  * });
  * await session?.connect();
  * ```
  *
  * 手工触发模式（持续收音）：
  * ```
  * const [session] = await aiproxy.CreateAliyunTranscriptionSession({
  *   appId, themeAuthor, configTheme, serviceName,
  *   inputMode: "manual",
  * });
  * await session?.connect();
  * // 用户持续说话时 SDK 持续收音；点击发送时手动触发
  * await session?.commitInput();
  * await session?.requestResponse();
  * ```
  *
   * 可通过 options.inputMode 指定输入模式：
   * - manual: 持续收音，手动触发 commitInput + requestResponse
   * - auto-vad: 语音间断自动触发（默认）
   */
  CreateAliyunTranscriptionSession(
    options: AIProxyAliyunRealtimeVoiceSessionOptions
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]>;

  /**
   * 创建多态兼容的阿里云实时语音/转写会话（四元组直传版）
   * 
   * 该方法已完整封装音频采集和播放的全生命周期：
   * - autoStartInput 默认为 true，连接后自动启动麦克风采集
   * - autoPlayOutput 默认为 true，自动播放服务器返回的语音
   * 
   * 自动模式（正常环境）：
   * ```
   * const [session] = await aiproxy.CreateAliyunTranscriptionSessionByTheme(
   *   appId, themeAuthor, configTheme, serviceName
   * );
   * if (session) {
   *   await session.connect();
   *   // 自动收音 → 自动识别 → 自动提交 → 自动播音
   * }
   * ```
  *
  * 使用 paraformer-realtime-v2 做实时语音识别时，建议在 `onModelEvent` 中按 `sentence_end` 判句：
  * - 事件通常为 `result-generated`
  * - 识别结果常位于 `payload.output.sentence`
  * - 当 `sentence_end === true`：当前 `text` 为该句最终识别结果，可写入最终输出
  * - 当 `sentence_end === false`：当前 `text` 为中间结果，仅建议用于临时字幕，不建议写入最终输出
  *
  * 典型处理示例：
  * ```ts
  * const [session] = await aiproxy.CreateAliyunTranscriptionSessionByTheme(
  *   appId,
  *   themeAuthor,
  *   configTheme,
  *   serviceName,
  *   (message) => {
  *     const output = (message as any)?.payload?.output;
  *     const sentence = output?.sentence;
  *     const text = sentence?.text;
  *     const sentenceEnd = sentence?.sentence_end === true;
  *
  *     if (!text) return;
  *     if (sentenceEnd) {
  *       // 采纳最终句
  *     } else {
  *       // 仅做临时预览
  *     }
  *   },
  * );
  * ```
   * 
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param configTheme 配置主题
   * @param serviceName 服务名称
  * @param onModelEvent 模型事件回调(可选)，可用于实时文本回显与 `sentence_end` 断句处理
   */
  CreateAliyunTranscriptionSessionByTheme(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
    onModelEvent?: (message: unknown) => void,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]>;

  /**
   * 创建纯会话型大模型（遵循 OpenAI Realtime 协议）的专用实时语音交互会话。
   * 主要针对如 Qwen-Omni (通义千问全模态实时) 此类端到端交互模型。
   * 
   * 与 CreateAliyunTranscriptionSession 相比，该方法具备以下专项优化：
   * 1. 协议独占：强制使用 OpenAI Realtime 协议适配器，提供完整的 session.update / input_audio_buffer.append / 等标准操作。
   * 2. 路径指定：在未提供特定请求路径时，默认显式映射至 `/api-ws/v1/realtime` 端点。
  * 3. 鉴权兼容：包含针对浏览器 WebSocket 鉴权限制的专项修复。当发现 AuthMode 为 bearer 时，
   *    会主动转换为 URL Query 上的 `api_key` 模式传递，从而突破浏览器 WebSocket 无法设置自定义 Header 的环境限制。
  * 4. 输入模式：支持 options.inputMode（manual / auto-vad）控制“手动触发”或“自动断句触发”。
  *
  * 示例：
  * ```
  * // 自动触发（VAD）
  * const [autoSession] = await aiproxy.CreateConversationalVoiceSession({
  *   appId, themeAuthor, configTheme, serviceName,
  *   inputMode: "auto-vad",
  * });
  *
  * // 手工触发
  * const [manualSession] = await aiproxy.CreateConversationalVoiceSession({
  *   appId, themeAuthor, configTheme, serviceName,
  *   inputMode: "manual",
  * });
  * await manualSession?.commitInput();
  * await manualSession?.requestResponse();
  * ```
   * 
   * 提示：如果确定业务上明确使用兼容 OpenAI Realtime 协议端点的大模型对话，直接调用此接口最为稳妥。
   */
  CreateConversationalVoiceSession(
    options: AIProxyAliyunRealtimeVoiceSessionOptions,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]>;

  /**
   * 创建“傻瓜版”实时语音会话。
   * 业务侧只需传入主题四元组（appId、themeAuthor、theme、service），其余参数走内置默认值。
   * mode=auto 时会根据 model/theme/service 自动选择 transcription 或 conversation 工厂。   * 
   * 已完整封装音频采集和播放的全生命周期：
   * - autoStartInput 默认为 true，连接后自动启动麦克风采集
   * - autoPlayOutput 默认为 true，自动播放服务器返回的语音
   * 
   * 使用方式超级简单：
   * ```
   * const [session] = await aiproxy.CreateSimpleRealtimeVoiceSession(
   *   appId, themeAuthor, configTheme, serviceName
   * );
   * if (session) {
   *   await session.connect();
   *   // 自动开始实时收音和播音
   * }
   * ```
   * 
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
  * @param configTheme 配置主题
  * @param serviceName 服务名称
   * @param manualFlag 是否手动提交：true=手动（不自动提交/不自动请求回复），false=自动
  */
  CreateSimpleRealtimeVoiceSession(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
    manualFlag?: boolean,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]>;

}
