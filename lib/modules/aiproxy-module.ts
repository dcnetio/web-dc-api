// modules/aiproxy-module.ts
// AI代理功能模块

import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { createLogger } from "../util/logger";
import {
  AIProxyAliyunRealtimeAudioSessionOptions,
  AIProxyAliyunRealtimeVoiceSessionOptions,
  AIProxyConfig,
  AIProxyRealtimeConfig,
  AIServiceUsage,
  AIProxyRealtimeAudioAuthInfo,
  AIProxyRealtimeAudioSessionOptions,
  AIProxyRealtimeVoiceSessionOptions,
  GetUserAIProxyAuthParams,
  IAIProxyRealtimeAudioSession,
  IAIProxyRealtimeVoiceSession,
  OnStreamResponseType,
  ProxyCallConfig,
  UserAIProxyAuthResult,
  UserProxyCallConfig,
  AIStreamResponseFlag,
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

// 将字节流分块转 base64（避免一次性 String.fromCharCode 超出调用栈上限）
const bytesToBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa !== "undefined") {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, sub as unknown as number[]);
    }
    return btoa(binary);
  }
  // Node 环境兜底
  return Buffer.from(bytes).toString("base64");
};

// 通过文件头魔数嗅探常见媒体 MIME 类型
const sniffMimeTypeFromBytes = (bytes: Uint8Array): string | null => {
  if (bytes.length < 12) return null;
  // MP4/MOV/M4A 系：偏移 4 处为 'ftyp'
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "video/mp4";
  // WebM/MKV (EBML)
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "video/webm";
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  // RIFF 容器：WAVE / WEBP / AVI
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    if (bytes[8] === 0x57 && bytes[9] === 0x41) return "audio/wav";   // 'WA'VE
    if (bytes[8] === 0x57 && bytes[9] === 0x45) return "image/webp";  // 'WE'BP
    if (bytes[8] === 0x41 && bytes[9] === 0x56) return "video/x-msvideo"; // 'AV'I
    return null;
  }
  // MP3 (ID3 tag 或 MPEG 帧同步头)
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return "audio/mpeg";
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  // OGG
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return "audio/ogg";
  // PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  return null;
};

// 判断内容下载的错误响应是否值得重试：
// - 确定性错误（404/路径不存在/无权限等，通常是服务商根本不支持 content 接口）→ 快速失败，避免空耗重试
// - 响应只是任务状态对象（已完成但无内容，如兼容查询接口被误路由）→ 重试也不会有结果，快速失败
// - 其余（如 task status is IN_PROGRESS、400 落盘延迟、短暂断流）→ 可重试
const isRetryableContentError = (text: string): boolean => {
  if (/not[\s_-]?found|no\s+such|unknown\s+(?:path|route|api|method)|method\s+not\s+allowed|"(?:status|code)"\s*:\s*"?40[1345]"?|unauthorized|forbidden|invalid[\s_-]?(?:api|parameter|url|request|path)|unsupported|不存在|无权限/i.test(text)) {
    return false;
  }
  // 响应是“已完成”的任务状态对象（而非文件内容/未就绪错误）：重试无意义
  if (/"(?:status|state|task_status|job_status)"\s*:\s*"(?:success|succeeded|finished|completed|done)"/i.test(text)) {
    return false;
  }
  return true;
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
    [UserProxyCallConfig[] | null, AIProxyConfig[] | null, number, Uint8Array | null, Error | null]
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
      return Promise.resolve([null, null, 0, null, error as Error]);
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

  async GetUserOwnAIProxyUsage(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[usageServices: Record<string, AIServiceUsage> | null, error: Error | null]> {
    try {
      this.assertInitialized();
      return this.aiProxyManager.GetUserOwnAIProxyUsage(
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
        console.debug("开始调用AI代理: themeAuthor=", resolvedConfig.themeAuthor, " configTheme=", resolvedConfig.configTheme, " serviceName=", resolvedConfig.serviceName);

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

  /**
   * 统一的 AI 代理响应 JSON 提取工具
   * 将深层 AST 遍历抽取媒体 URL 和 task_id 的逻辑抽离，保证所有返回一致
   */
  public ExtractAIResourceResult(payloadText: string, taskIdField?: string, expectedMediaType?: 'image' | 'video' | 'audio' | 'doc') {
    const result = {
      origin_result: payloadText as any,
      task_id: undefined as string | undefined, // 初始化为空
      imagelist: [] as { [key: string]: string }[],
      videolist: [] as { [key: string]: string }[],
      audiolist: [] as { [key: string]: string }[],
      doclist: [] as { [key: string]: string }[]
    };

    let parsedObj;
    try {
      parsedObj = JSON.parse(payloadText);
      result.origin_result = parsedObj;
      
      if (parsedObj !== null && typeof parsedObj === 'object') {
        const extractId = (obj: any) => {
          if (taskIdField && obj[taskIdField] != null) return obj[taskIdField];
          return obj.task_id ?? obj.taskId ?? obj.taskid ?? obj.job_id ?? obj.jobId ?? obj.id;
        };

        let possibleTaskId = extractId(parsedObj);
        // 依次尝试常见的包装字段: data / result / items[0]
        if (possibleTaskId == null && parsedObj.data != null && typeof parsedObj.data === 'object') {
            possibleTaskId = extractId(parsedObj.data);
        }
        if (possibleTaskId == null && parsedObj.result != null && typeof parsedObj.result === 'object') {
            possibleTaskId = extractId(parsedObj.result);
        }
        if (possibleTaskId == null && Array.isArray(parsedObj.items) && parsedObj.items.length > 0 && typeof parsedObj.items[0] === 'object') {
            possibleTaskId = extractId(parsedObj.items[0]);
        }

        if (possibleTaskId != null && (typeof possibleTaskId === 'string' || typeof possibleTaskId === 'number')) {
            result.task_id = String(possibleTaskId);
        }
      }
    } catch (e) {
      return result; // 解析失败直接返回原始文本结构
    }
    
    const imgExts = /\.(png|jpg|jpeg|gif|webp|bmp|svg)([\?#].*)?$/i;
    const vidExts = /\.(mp4|webm|avi|mov|mkv|flv|ts|m3u8|m4v|3gp)([\?#].*)?$/i;
    const audioExts = /\.(mp3|wav|ogg|aac|flac|m4a|opus|wma)([\?#].*)?$/i;
    const docExts = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md|csv)([\?#].*)?$/i;
    const visited = new Set<any>();

    const traverse = (node: any, pathStr: string) => {
      if (node !== null && typeof node === 'object') {
        if (visited.has(node)) return;
        visited.add(node);
      }

      if (typeof node === 'string') {
        const isUrl = /^(https?:\/\/|data:(image|video|audio|application)\/)/i.test(node);
        if (isUrl) {
            const lowerNode = node.toLowerCase();
            const lowerPath = pathStr.toLowerCase();
            const isImg = imgExts.test(node) || lowerNode.startsWith('data:image/');
            const isVid = vidExts.test(node) || lowerNode.startsWith('data:video/');
            const isAudio = audioExts.test(node) || lowerNode.startsWith('data:audio/');
            const isDoc = docExts.test(node) || lowerNode.startsWith('data:application/');

            if (isImg) {
                result.imagelist.push({ [pathStr || "url"]: node });
            } else if (isVid) {
                result.videolist.push({ [pathStr || "url"]: node });
            } else if (isAudio) {
                result.audiolist.push({ [pathStr || "url"]: node });
            } else if (isDoc) {
                result.doclist.push({ [pathStr || "url"]: node });
            } else {
                // 扩展名无法判断时，依次按路径关键词 → expectedMediaType → 默认 doclist
                if (/image|pic|cover|avatar|logo|thumbnail/.test(lowerPath)) {
                    result.imagelist.push({ [pathStr || "url"]: node });
                } else if (/video|media/.test(lowerPath)) {
                    result.videolist.push({ [pathStr || "url"]: node });
                } else if (/audio|voice|speech|sound/.test(lowerPath)) {
                    result.audiolist.push({ [pathStr || "url"]: node });
                } else if (expectedMediaType === 'image') {
                    result.imagelist.push({ [pathStr || "url"]: node });
                } else if (expectedMediaType === 'video') {
                    result.videolist.push({ [pathStr || "url"]: node });
                } else if (expectedMediaType === 'audio') {
                    result.audiolist.push({ [pathStr || "url"]: node });
                } else if (expectedMediaType === 'doc') {
                    result.doclist.push({ [pathStr || "url"]: node });
                } else {
                    result.doclist.push({ [pathStr || "url"]: node });
                }
            }
        }
      } else if (Array.isArray(node)) {
        node.forEach((item, index) => traverse(item, `${pathStr}[${index}]`));
      } else if (node !== null && typeof node === 'object') {
        // Gemini / 多模态内联数据结构：{ inlineData: { mimeType, data } }
        // 或 snake_case { inline_data: { mime_type, data } }。
        // 生成的图片/视频/音频以「纯 base64」放在 data 字段（无 data: 前缀、无 http URL），
        // 常规字符串遍历无法识别，这里重建为 data URI 以便应用层直接渲染/下载。
        const inline = (node as any).inlineData ?? (node as any).inline_data;
        if (inline !== null && typeof inline === 'object') {
          const mime = String(inline.mimeType ?? inline.mime_type ?? '').toLowerCase();
          const b64 = inline.data;
          if (
            typeof b64 === 'string' &&
            b64.length > 0 &&
            !/^(https?:\/\/|data:)/i.test(b64)
          ) {
            const dataUri = `data:${mime || 'application/octet-stream'};base64,${b64}`;
            const inlinePath = pathStr
              ? `${pathStr}.inlineData`
              : 'inlineData';
            if (mime.startsWith('image/')) {
              result.imagelist.push({ [inlinePath]: dataUri });
            } else if (mime.startsWith('video/')) {
              result.videolist.push({ [inlinePath]: dataUri });
            } else if (mime.startsWith('audio/')) {
              result.audiolist.push({ [inlinePath]: dataUri });
            } else if (mime) {
              result.doclist.push({ [inlinePath]: dataUri });
            } else if (expectedMediaType === 'image') {
              result.imagelist.push({ [inlinePath]: dataUri });
            } else if (expectedMediaType === 'video') {
              result.videolist.push({ [inlinePath]: dataUri });
            } else if (expectedMediaType === 'audio') {
              result.audiolist.push({ [inlinePath]: dataUri });
            } else {
              result.doclist.push({ [inlinePath]: dataUri });
            }
          }
        }
        for (const key of Object.keys(node)) {
          traverse(node[key], pathStr ? `${pathStr}.${key}` : key);
        }
      }
    };

    if (parsedObj !== undefined) {
        traverse(parsedObj, '');
    }

    return result;
  }

  /**
   * 轮询获取异步任务的生成结果
   */
  async PollAITaskResult(
    context: { signal?: AbortSignal },
    reqBody: string, // 主要是传入 { "task_id": "xxx", "action": "poll" } 等服务商需要的查询报文
    forceRefresh: boolean,
    appId?: string,
    themeAuthor?: string,
    configTheme?: string,
    serviceName?: string,
    headers?: Record<string, string>,
    path?: string,
    model?: string,
    taskIdField?: string,
    expectedMediaType?: 'image' | 'video' | 'audio' | 'doc'
  ): Promise<[ReturnType<typeof this.ExtractAIResourceResult> | null, Error | null]> {
    return new Promise(async (resolve) => {
      let payloadText = "";
      
      const wrappedOnStreamResponse: OnStreamResponseType = (flag, content, err) => {
        if (content && flag !== 1) {
          payloadText += content;
        }

        if (flag === 2 || flag === 3 || flag === 4 || flag === 7 || flag === 88 || flag === 99) { 
          if (err && (!payloadText || payloadText.trim() === '')) {
             resolve([null, new Error(err)]);
             return;
          }
          const stdResult = this.ExtractAIResourceResult(payloadText, taskIdField, expectedMediaType);
          resolve([stdResult, null]);
        }
      };

      const [res, error] = await this.DoAIProxyCall(
        context, reqBody, forceRefresh, wrappedOnStreamResponse,
        appId, themeAuthor, configTheme, serviceName, headers, path, model
      );

      // 如果代理调用本身瞬间异常
      if (error) resolve([null, error]);
    });
  }

  /**
   * 下载 AI 任务的结果内容（二进制字节流 / JSON 包 URL）
   *
   * 适配「任务查询接口只返回状态、不返回资源 URL」的服务商：
   * 如 laozhang veo 系列任务完成后需 GET /v1/videos/{id}/content 下载 MP4 字节流。
   *
   * 响应自适应处理（便于以后扩展其他服务商的取结果方式）：
   * - 二进制字节流（MP4/PNG/MP3 等）：自动嗅探 MIME 类型并转换为 data URI 返回；
   * - JSON 且含资源 URL：直接返回该 URL（部分服务商 content 接口返回 JSON 包装的 URL）；
   * - JSON 错误（如 task status is IN_PROGRESS，文件落盘延迟 / 400 错误）：按间隔自动重试。
   */
  async DownloadAIResourceContent(
    context: { signal?: AbortSignal },
    options: {
      appId?: string;
      themeAuthor?: string;
      configTheme?: string;
      serviceName?: string;
      headers?: Record<string, string>;
      path?: string;                 // 下载路径，如 /task_xxx/content（拼接在服务 endpoint 之后）
      model?: string;
      reqBody?: string;              // 默认空 body（REST GET 风格）
      forceRefresh?: boolean;
      expectedMediaType?: 'image' | 'video' | 'audio' | 'doc'; // 用于 URL 分类与兜底 MIME 推断
      mimeType?: string;             // 字节流 MIME 嗅探失败时的兜底类型
      maxRetries?: number;           // 文件未就绪（JSON 错误）时的重试次数，默认 3
      retryIntervalMs?: number;      // 重试间隔，默认 15000ms（官方建议 10-20 秒）
    }
  ): Promise<[{ url?: string; dataUri?: string; bytes?: Uint8Array; mimeType?: string } | null, Error | null]> {
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

      const maxRetries = options.maxRetries ?? 3;
      const retryIntervalMs = Math.max(1000, options.retryIntervalMs ?? 15000);
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (context.signal?.aborted) {
          return [null, new Error("内容下载被安全中止")];
        }
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, retryIntervalMs));
          if (context.signal?.aborted) {
            return [null, new Error("内容下载被安全中止")];
          }
        }

        const chunks: Uint8Array[] = [];
        let streamErr = "";
        const finishedOk = await new Promise<boolean>((resolveAttempt) => {
          let settled = false;
          const settle = (ok: boolean) => { if (!settled) { settled = true; resolveAttempt(ok); } };
          this.aiProxyManager.DoAIProxyCall(
            context,
            resolvedConfig.appId,
            resolvedConfig.themeAuthor,
            resolvedConfig.configTheme,
            resolvedConfig.serviceName,
            options.reqBody || "",
            !!options.forceRefresh,
            (flag, _content, err) => {
              if (err) streamErr += err;
              if (flag === AIStreamResponseFlag.CONNECTION_CLOSED) {
                settle(true);
              } else if (
                flag === AIStreamResponseFlag.PERMISSION_DENIED ||
                flag === AIStreamResponseFlag.FETCH_FAILED ||
                flag === AIStreamResponseFlag.EXTERNAL_EXIT ||
                flag === AIStreamResponseFlag.STREAM_HANG ||
                flag === AIStreamResponseFlag.OTHER_ERROR
              ) {
                settle(false);
              }
            },
            resolvedConfig.headersStr,
            resolvedConfig.path,
            resolvedConfig.model,
            (chunk) => { chunks.push(chunk); },  // 二进制透传模式收取原始字节
          ).catch((e) => {
            streamErr += e instanceof Error ? e.message : String(e);
            settle(false);
          });
        });

        const totalLen = chunks.reduce((sum, c) => sum + c.length, 0);
        if (totalLen === 0) {
          // 无内容（网络异常或文件未就绪的短暂断流），重试
          lastError = new Error(streamErr || "内容下载响应为空（文件可能尚未就绪）");
          if (context.signal?.aborted) return [null, lastError];
          continue;
        }
        if (!finishedOk) {
          lastError = new Error(streamErr || "内容下载失败");
          continue;
        }

        const bytes = new Uint8Array(totalLen);
        let offset = 0;
        for (const c of chunks) { bytes.set(c, offset); offset += c.length; }

        // 嗅探响应类型：JSON（含资源 URL / 未就绪错误）or 二进制字节流
        let i = 0;
        while (i < bytes.length && (bytes[i] === 0x20 || bytes[i] === 0x09 || bytes[i] === 0x0a || bytes[i] === 0x0d)) i++;
        const firstByte = bytes[i];
        if (firstByte === 0x7b /* { */ || firstByte === 0x5b /* [ */) {
          let jsonText = "";
          let parsed: any = undefined;
          try {
            jsonText = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
            parsed = JSON.parse(jsonText);
          } catch (_) { /* 非合法 JSON，按二进制处理 */ }
          if (parsed !== undefined) {
            // JSON 响应里带资源 URL：直接返回（部分服务商 content 接口返回 JSON 包 URL）
            const extracted = this.ExtractAIResourceResult(jsonText, undefined, options.expectedMediaType);
            const firstOf = (list: { [key: string]: string }[]) =>
              list.length > 0 ? Object.values(list[0])[0] : undefined;
            const url = firstOf(extracted.videolist) || firstOf(extracted.audiolist)
              || firstOf(extracted.imagelist) || firstOf(extracted.doclist);
            if (url) {
              return [{ url }, null];
            }
            // JSON 无资源 URL：视为文件未就绪或错误（如 task status is IN_PROGRESS）
            lastError = new Error(`内容尚未就绪或下载出错: ${jsonText.slice(0, 300)}`);
            // 确定性错误（如 404/接口不存在）快速失败，避免对不支持 content 接口的服务商空耗重试
            if (!isRetryableContentError(jsonText)) {
              return [null, lastError];
            }
            continue;
          }
        }

        const sniffedMime = sniffMimeTypeFromBytes(bytes);
        // 非已知二进制格式且体积小：尝试按纯文本处理（裸 URL / 纯文本错误提示），
        // 避免把服务商的文本错误（如 "task status is IN_PROGRESS"）当成字节流打包成假媒体
        if (!sniffedMime && totalLen < 64 * 1024) {
          let text = "";
          try {
            text = new TextDecoder("utf-8", { fatal: true }).decode(bytes).trim();
          } catch (_) { /* 非 UTF-8 文本，按二进制处理 */ }
          if (text) {
            // 部分服务商 content 接口直接返回裸 URL 文本
            if (/^https?:\/\/\S+$/i.test(text)) {
              return [{ url: text }, null];
            }
            // 纯文本错误/未就绪提示
            lastError = new Error(`内容尚未就绪或下载出错: ${text.slice(0, 300)}`);
            if (!isRetryableContentError(text)) {
              return [null, lastError];
            }
            continue;
          }
        }

        const mimeType = sniffedMime
          || options.mimeType
          || (options.expectedMediaType === 'image' ? 'image/png'
            : options.expectedMediaType === 'audio' ? 'audio/mpeg'
            : options.expectedMediaType === 'video' ? 'video/mp4'
            : 'application/octet-stream');
        const dataUri = `data:${mimeType};base64,${bytesToBase64(bytes)}`;
        return [{ dataUri, bytes, mimeType }, null];
      }

      return [null, lastError || new Error("内容下载失败")];
    } catch (error) {
      logger.error("下载AI任务结果内容失败:", error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  /**
   * ✨ 完备化生成与轮询通用接口
   * 实现了同步执行与异步任务（提交 + 提取 task_id + 循环轮询 + 收取媒体资源）的高度一体化和解耦。
   */
  async GenerateAndPollAIResource(
    context: { signal?: AbortSignal },
    reqBody: string,
    forceRefresh: boolean,
    options: {
      appId?: string;
      themeAuthor?: string;
      configTheme?: string;
      
      // ===================
      // 第1阶段：任务提交服务
      // ===================
      submitServiceName?: string; 
      submitHeaders?: Record<string, string>;
      submitPath?: string;
      submitModel?: string;

      // ===================
      // 第2阶段：任务轮询服务 (若为异步任务)
      // ===================
      isAsync?: boolean;
      pollServiceName?: string;
      pollHeaders?: Record<string, string>;
      pollPath?: string;
      pollModel?: string;
      
      // ===================
      // 参数与策略控制
      // ===================
      pollIntervalMs?: number;    // 轮询间隔 (默认 3000ms)
      pollTimeoutMs?: number;     // 轮询超时总时间 (默认 180000ms -> 3分钟)
      taskIdField?: string;       // 明确指定任务 ID 在 JSON 中的字段名
      existingTaskId?: string;    // 从外部直接传入已有的 task_id (跳过提交，直接进行轮询)
      expectedMediaType?: 'image' | 'video' | 'audio' | 'doc'; // 当 URL 无扩展名且路径无媒体关键词时，用于兜底分类
      
      // 构造轮询报文的自定义方法（服务商接口大多不同，需要外部根据 taskId 动态生成 query payload）
      buildPollReqBody?: (taskId: string) => string;
      // 动态构造轮询路径的方法（目前很多主流大模型会将 taskId 拼接到 URL 路径中如 /tasks/{task_id} ）
      buildPollPath?: (taskId: string) => string;

      // ===================
      // 第3阶段：结果内容下载（默认自动启用）
      // 适配「轮询接口只返回任务状态、不返回资源 URL」的服务商
      // （如 laozhang veo：完成后需 GET /v1/videos/{id}/content 下载 MP4 字节流）
      // 仅当任务显式完成且轮询响应中未提取到任何资源时才触发，
      // 因此对轮询响应已含 URL 的服务商（如阿里云）无任何影响；
      // 下载失败（如服务商不支持 content 接口时快速失败）不视为任务失败，回退为原始轮询结果。
      // 不传 = 自动启用（默认策略）；传 false = 禁用；传对象 = 自定义下载方式
      // ===================
      contentDownload?: false | {
        serviceName?: string;                      // 下载服务名，默认复用 pollServiceName
        headers?: Record<string, string>;          // 默认复用 pollHeaders
        model?: string;                            // 默认复用 pollModel
        path?: string;                             // 基础路径，默认复用 pollPath；最终请求 {path}/{taskId}/content
        buildPath?: (taskId: string) => string;    // 完全自定义下载路径（优先级最高，便于适配其他服务商的取结果接口）
        buildReqBody?: (taskId: string) => string; // 自定义请求体，默认空 body（REST GET 风格）
        mimeType?: string;                         // 字节流 MIME 嗅探失败时的兜底类型（默认按 expectedMediaType 推断）
        maxRetries?: number;                       // 文件落盘延迟重试次数（默认 3）
        retryIntervalMs?: number;                  // 重试间隔（默认 15000ms）
      };
      
      // ===================
      // 生命周期 Hooks
      // ===================
      onTaskSubmitted?: (taskId: string, initialResult: any) => void;
      onPollTick?: (pollResult: any) => void; 
    }
  ): Promise<[ReturnType<typeof this.ExtractAIResourceResult> | null, Error | null]> {
    return new Promise((resolve) => {
      let payloadText = "";
      let isSubmitFired = false;
      let isResolved = false;
      const safeResolve: typeof resolve = (v) => { if (!isResolved) { isResolved = true; resolve(v); } };
      
      const startPolling = (taskId: string, initialResult?: any) => {
          if (!options.pollServiceName) {
            safeResolve([initialResult || null, new Error("若开启 isAsync 或使用了 existingTaskId，必须配置 pollServiceName")]);
            return;
          }

          const pollInterval = Math.max(1000, options.pollIntervalMs || 3000); 
          const pollTimeout = options.pollTimeoutMs || 900000;
          const startTime = Date.now();
          let isPollingNow = false;

          const timer = setInterval(async () => {
             // 1. 中止或超时拦截
             if (context.signal?.aborted) {
                 clearInterval(timer);
                 safeResolve([null, new Error("轮询被安全中止")]);
                 return;
             }
             if (Date.now() - startTime > pollTimeout) {
                 clearInterval(timer);
                 safeResolve([null, new Error(`轮询超时，已超过 ${pollTimeout}ms`)]);
                 return;
             }
             if (isPollingNow) return; 
             isPollingNow = true;

             try {
                // 动态构建发送给服务商查询节点的 JSON/Query
                // 默认走 REST GET 风格：空 body + 路径末尾拼 taskId（即 GET /api/v1/tasks/{taskId}）
                // 若需要 POST body 模式，显式传入 buildPollReqBody: (id) => JSON.stringify({ task_id: id })
                const pollReqBody = options.buildPollReqBody
                     ? options.buildPollReqBody(taskId)
                     : "";
                
                // 动态判断路径：默认将 taskId 拼到路径末尾
                let activePollPath: string;
                if (options.buildPollPath) {
                     activePollPath = options.buildPollPath(taskId);
                } else {
                     const base = options.pollPath || "";
                     activePollPath = base ? `${base.replace(/\/$/, '')}/${taskId}` : `/${taskId}`;
                }

                // 调用封装好的单次轮询
                const [pollResult, pollErr] = await this.PollAITaskResult(
                     context,
                     pollReqBody,
                     forceRefresh,
                     options.appId,
                     options.themeAuthor,
                     options.configTheme,
                     options.pollServiceName,
                     options.pollHeaders,
                     activePollPath,
                     options.pollModel,
                     options.taskIdField,
                     options.expectedMediaType
                );

                if (pollErr) {
                     logger.warn(`轮询出现网络抖动(继续重试 | taskId: ${taskId}):`, pollErr);
                } else if (pollResult) {
                     // 触发每一次收到新信息的通知
                     if (options.onPollTick) {
                         options.onPollTick(pollResult.origin_result);
                     }

                     // 完成检测核心逻辑：一旦检测到图片、视频或文档资源被成功提取出，则视为完成
                     // 注：audiolist 不参与完成判定（音频输入类任务可能在进行中回显输入音频 URL），
                     // 仅在下方内容下载触发条件中单独检查
                     const hasResource = 
                          (pollResult.imagelist && pollResult.imagelist.length > 0) || 
                          (pollResult.videolist && pollResult.videolist.length > 0) || 
                          (pollResult.doclist && pollResult.doclist.length > 0);

                     // 辅助保障：某些接口提取不出URL，但显式声明成功
                     const origin = pollResult.origin_result;
                     let isExplicitFinished = false;
                     let isExplicitFailed = false;
                     if (origin && typeof origin === 'object') {
                          const statusFinishedRe = /"(?:status|state|task_status|job_status)"\s*:\s*"(?:success|succeeded|finished|completed|done)"/;
                          const statusFailedRe = /"(?:status|state|task_status|job_status)"\s*:\s*"(?:failed|failure|error|fail|canceled|cancelled|timeout|unknown)"/;
                          const statusPendingRe = /"(?:status|state|task_status|job_status)"\s*:\s*"(?:pending|queued|processing|running|in_progress|submitted)"/;
                          // 若响应是 items 数组，需要全部 item 都完成才算完成（避免批量接口部分完成误判）
                          const items = Array.isArray((origin as any).items) ? (origin as any).items : null;
                          if (items && items.length > 0) {
                               const allDone = items.every((item: any) => statusFinishedRe.test(JSON.stringify(item).toLowerCase()));
                               const anyFailed = items.some((item: any) => statusFailedRe.test(JSON.stringify(item).toLowerCase()));
                               const anyPending = items.some((item: any) => statusPendingRe.test(JSON.stringify(item).toLowerCase()));
                               isExplicitFinished = allDone;
                               isExplicitFailed = !allDone && anyFailed && !anyPending;
                          } else {
                               const statusStr = JSON.stringify(origin).toLowerCase();
                               if (statusFinishedRe.test(statusStr)) {
                                    isExplicitFinished = true;
                               } else if (statusFailedRe.test(statusStr) || 
                                          statusStr.includes('"code":-1') || statusStr.includes('"code":500')) {
                                    isExplicitFailed = true;
                               }
                          }
                     }

                     if (hasResource || isExplicitFinished) {
                          clearInterval(timer);
                          // 第3阶段（默认自动）：任务显式完成但轮询响应中没有任何资源 URL
                          // （如 laozhang veo：完成状态不带 URL，需 GET /v1/videos/{id}/content 下载字节流）
                          // SDK 自动尝试下载并把结果补进媒体列表，调用方无需感知服务商差异；
                          // 传 contentDownload: false 可禁用，传对象可自定义下载方式
                          const hasAnyResource = hasResource ||
                               (pollResult.audiolist && pollResult.audiolist.length > 0);
                          if (!hasAnyResource && options.contentDownload !== false) {
                               try {
                                    const cd = (options.contentDownload && typeof options.contentDownload === "object")
                                         ? options.contentDownload
                                         : {};
                                    const downloadPath = cd.buildPath
                                         ? cd.buildPath(taskId)
                                         : `${(cd.path || options.pollPath || "").replace(/\/$/, '')}/${taskId}/content`;
                                    const [dlResult, dlErr] = await this.DownloadAIResourceContent(context, {
                                         appId: options.appId,
                                         themeAuthor: options.themeAuthor,
                                         configTheme: options.configTheme,
                                         serviceName: cd.serviceName || options.pollServiceName,
                                         headers: cd.headers || options.pollHeaders,
                                         model: cd.model || options.pollModel,
                                         path: downloadPath,
                                         reqBody: cd.buildReqBody ? cd.buildReqBody(taskId) : "",
                                         forceRefresh,
                                         expectedMediaType: options.expectedMediaType,
                                         mimeType: cd.mimeType,
                                         maxRetries: cd.maxRetries,
                                         retryIntervalMs: cd.retryIntervalMs,
                                    });
                                    if (dlResult && (dlResult.url || dlResult.dataUri)) {
                                         const resourceUrl = (dlResult.url || dlResult.dataUri) as string;
                                         const mime = dlResult.mimeType || "";
                                         const entry = { content_download: resourceUrl };
                                         if (mime.startsWith("image/")) pollResult.imagelist.push(entry);
                                         else if (mime.startsWith("audio/")) pollResult.audiolist.push(entry);
                                         else if (mime.startsWith("video/")) pollResult.videolist.push(entry);
                                         else if (options.expectedMediaType === "image") pollResult.imagelist.push(entry);
                                         else if (options.expectedMediaType === "audio") pollResult.audiolist.push(entry);
                                         else if (options.expectedMediaType === "video") pollResult.videolist.push(entry);
                                         else pollResult.doclist.push(entry);
                                    } else {
                                         // 下载失败不视为任务失败：保留原始完成响应，交由上层兜底展示
                                         logger.warn(`任务已完成但结果内容下载失败(taskId: ${taskId}):`, dlErr);
                                    }
                               } catch (e) {
                                    logger.warn(`任务结果内容下载异常(taskId: ${taskId}):`, e);
                               }
                          }
                          safeResolve([pollResult, null]);
                     } else if (isExplicitFailed) {
                          clearInterval(timer);
                          // 尽量从原始响应中提取失败原因，方便前端展示
                          let failReason = "任务执行失败";
                          try {
                               const o = pollResult.origin_result as any;
                               const msg = o?.output?.message || o?.output?.task_metrics?.FAILED_MSG
                                    || o?.message || o?.error?.message || o?.error_message || o?.msg || o?.errmsg;
                               if (msg && typeof msg === "string") failReason = msg;
                          } catch (_) {}
                          const failErr = new Error(failReason);
                          (failErr as any).isTaskFailed = true;
                          safeResolve([pollResult, failErr]);
                     }
                }
             } catch (e) {
                logger.error("轮询处理逻辑异常:", e);
             } finally {
                isPollingNow = false;
             }
          }, pollInterval);
      };

      // == 优先处理 existingTaskId 情况 ==
      if (options.existingTaskId) {
        // 如果存在 existingTaskId，直接复用轮询逻辑，跳过 DoAIProxyCall
        startPolling(options.existingTaskId);
        return;
      }

      const submitStreamResponse: OnStreamResponseType = async (flag, content, err) => {
        if (content && flag !== 1) {
          payloadText += content;
        }

        // 监听结束态
        if (!isSubmitFired && (flag === 2 || flag === 3 || flag === 4 || flag === 7 || flag === 88 || flag === 99)) {
          isSubmitFired = true;
          
          if (err && !payloadText) {
            safeResolve([null, new Error(err)]);
            return;
          }
          
          const stdResult = this.ExtractAIResourceResult(payloadText, options.taskIdField, options.expectedMediaType);
          
          // 若为同步任务配置，或者虽为异步但提取不到taskId（极大可能是报错/限流响应），则直接返回结束
          if (!options.isAsync || !stdResult.task_id) {
            safeResolve([stdResult, null]);
            return;
          }

          // ===== 以下进入异步长轮询分支 =====
          const taskId = stdResult.task_id;
          
          // 触发“已成功提交”的回调，让前端可以拿到状态和进度
          if (options.onTaskSubmitted) {
            options.onTaskSubmitted(taskId, stdResult.origin_result);
          }

          startPolling(taskId, stdResult);
        }
      };

      // 触发初始长连接或同步提交
      this.DoAIProxyCall(
        context,
        reqBody,
        forceRefresh,
        submitStreamResponse,
        options.appId,
        options.themeAuthor,
        options.configTheme,
        options.submitServiceName,
        options.submitHeaders,
        options.submitPath,
        options.submitModel
      ).then(([res, err]) => {
         if (err) safeResolve([null, err]); // 立刻挂掉
      });
    });
  }

  /* 已删除 DoAIResourceGenerateAndEdit 接口 */

  async GetAliyunV3Token(params: {
    channelId?: string;
    userId?: string;
    reqBody?: Record<string, any>;
    forceRefresh?: boolean;
    appId?: string;
    themeAuthor?: string;
    configTheme?: string;
    serviceName?: string;
    headers?: Record<string, string>;
  }): Promise<[ { token: string,serviceAppId?: string, expiresAt?: number, expiresIn?: number } | null, Error | null ]> {
    try {
      this.assertInitialized();

      const resolvedConfig = this.resolveAICallConfig(
        params.appId,
        params.themeAuthor,
        params.configTheme,
        params.serviceName,
        params.headers,
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
        params.headers, // headers
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
      const normalizedOptions: AIProxyAliyunRealtimeVoiceSessionOptions = {
        ...options,
      };

      const normalizedAppId = String(normalizedOptions.appId || "").trim();
      const normalizedThemeAuthor = String(normalizedOptions.themeAuthor || "").trim();
      const normalizedConfigTheme = String(normalizedOptions.configTheme || "").trim();
      const normalizedServiceName = String(normalizedOptions.serviceName || "").trim();
      if (!normalizedAppId || !normalizedThemeAuthor || !normalizedConfigTheme || !normalizedServiceName) {
        throw new Error("CreateAliyunTranscriptionSession 参数不能为空: appId/themeAuthor/configTheme/serviceName");
      }

      normalizedOptions.appId = normalizedAppId;
      normalizedOptions.themeAuthor = normalizedThemeAuthor;
      normalizedOptions.configTheme = normalizedConfigTheme;
      normalizedOptions.serviceName = normalizedServiceName;

      const resolvedConfig = this.resolveAICallConfig(
        normalizedOptions.appId,
        normalizedOptions.themeAuthor,
        normalizedOptions.configTheme,
        normalizedOptions.serviceName,
        normalizedOptions.headers,
        normalizedOptions.path,
        normalizedOptions.model,
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
        normalizedOptions,
      );
      const inputMode = normalizedOptions.inputMode;
      const resolvedCommit =
        inputMode === "manual"
          ? false
          : normalizedOptions.aliyunProtocolOptions?.autoCommitOnStop ?? true;
      const resolvedRequestResponse =
        inputMode === "manual"
          ? false
          : normalizedOptions.aliyunProtocolOptions?.autoCreateResponseOnStop ?? true;

      const existingSession =
        (normalizedOptions.aliyunProtocolOptions?.session as Record<string, unknown> | undefined) ||
        undefined;
      const nextSession = {
        ...(existingSession || {}),
      } as Record<string, unknown>;
      if (inputMode === "manual") {
        nextSession.turn_detection = null;
      } else if (inputMode === "auto-vad" && typeof nextSession.turn_detection === "undefined") {
        nextSession.turn_detection = { type: "server_vad" };
      }
      const normalizedAliyunProtocolOptions = inputMode
        ? {
            ...(normalizedOptions.aliyunProtocolOptions || {}),
            session: nextSession,
          }
        : normalizedOptions.aliyunProtocolOptions;

      const stopVoiceInputOptions = {
        finishSession: false,
        ...(normalizedOptions.stopVoiceInputOptions || {}),
        commit: resolvedCommit,
        requestResponse: resolvedRequestResponse,
      };

      const shouldUseMultimodalDialog = !useOpenAIRealtimeProtocol && (
        effectiveResolvedConfig.model === "multimodal-dialog" ||
        effectiveResolvedConfig.model?.includes("cosyvoice") ||
        effectiveResolvedConfig.model?.includes("sambert") ||
        effectiveResolvedConfig.model?.includes("gummy")
      );

      return this.CreateVoiceSession({
        ...normalizedOptions,
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
              normalizedOptions.websocketBaseUrl,
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
        } : shouldUseMultimodalDialog ? {
          resolveAuthInfo: (payloadText: string) => {
            const info = this.parseRealtimeAudioAuthInfoWithServiceConfig(
              payloadText,
              realtimeConfig,
            );
            const finalUrl = info.url || info.websocketUrl || this.buildAliyunRealtimeWebSocketUrl(
              normalizedOptions.websocketBaseUrl,
              effectiveResolvedConfig.path,
            );
            const infoHeaders = { ...(info.headers || {}) };
            let updatedAuthMode = info.authMode;
            let updatedQueryName = info.authQueryName || "api_key";
            const actualToken =
              info.apiKey ||
              info.tempApiKey ||
              info.token ||
              info.tempToken ||
              this.extractBearerCredential(
                info.headers?.Authorization || info.headers?.authorization,
              );
            let updatedApiKey = info.apiKey || info.tempApiKey;

            if (actualToken && (info.authMode === "bearer" || info.authMode === "token" || !info.authMode)) {
              updatedAuthMode = "apikey";
              updatedQueryName = "api_key";
              updatedApiKey = actualToken;
            }

            if (updatedQueryName && updatedApiKey) {
              delete infoHeaders.Authorization;
              delete infoHeaders.authorization;
            }

            return {
              ...info,
              url: finalUrl,
              websocketUrl: finalUrl,
              endpoint: finalUrl,
              authMode: updatedAuthMode,
              authQueryName: updatedQueryName,
              apiKey: updatedApiKey,
              tempApiKey: updatedApiKey,
              headers: Object.keys(infoHeaders).length > 0 ? infoHeaders : undefined,
            };
          },
        } : {}),
        stopVoiceInputOptions,
        protocolAdapter: useOpenAIRealtimeProtocol
          ? createOpenAIRealtimeVoiceProtocolAdapter({
              ...normalizedAliyunProtocolOptions,
              model: effectiveResolvedConfig.model,
            })
          : shouldUseMultimodalDialog
            ? createQwenMultimodalDialogAdapter({
                ...normalizedAliyunProtocolOptions,
                model: effectiveResolvedConfig.model,
              })
            : createAliyunRealtimeVoiceProtocolAdapter({
                ...normalizedAliyunProtocolOptions,
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

  async CreateAliyunTranscriptionSessionByTheme(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
    onModelEvent?: (message: unknown) => void,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]> {
    const normalizedAppId = String(appId || "").trim();
    const normalizedThemeAuthor = String(themeAuthor || "").trim();
    const normalizedConfigTheme = String(configTheme || "").trim();
    const normalizedServiceName = String(serviceName || "").trim();

    const mergedOptions = {
      inputMode: "auto-vad",
      runtime: "browser",
      initRequestBody: {
        scene: "voice-chat",
        user_id: "anonymous",
      },
      aliyunProtocolOptions: {
        session: {
          turn_detection: { type: "server_vad" },
        },
      },
      appId: normalizedAppId,
      themeAuthor: normalizedThemeAuthor,
      configTheme: normalizedConfigTheme,
      serviceName: normalizedServiceName,
      autoStartInput: true,
      autoPlayOutput: true,
      onModelEvent,
      stopVoiceInputOptions: {
        finishSession: false,
        commit: true,
        requestResponse: true,
      },
    } as AIProxyAliyunRealtimeVoiceSessionOptions;

    return this.CreateAliyunTranscriptionSession(mergedOptions);
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
      const inputMode = options.inputMode;
      const resolvedCommit =
        inputMode === "manual"
          ? false
          : options.aliyunProtocolOptions?.autoCommitOnStop ?? true;
      const resolvedRequestResponse =
        inputMode === "manual"
          ? false
          : options.aliyunProtocolOptions?.autoCreateResponseOnStop ?? true;

      const existingSession =
        (options.aliyunProtocolOptions?.session as Record<string, unknown> | undefined) ||
        undefined;
      const nextSession = {
        ...(existingSession || {}),
      } as Record<string, unknown>;
      if (inputMode === "manual") {
        nextSession.turn_detection = null;
      } else if (inputMode === "auto-vad" && typeof nextSession.turn_detection === "undefined") {
        nextSession.turn_detection = { type: "server_vad" };
      }
      const normalizedAliyunProtocolOptions = inputMode
        ? {
            ...(options.aliyunProtocolOptions || {}),
            session: nextSession,
          }
        : options.aliyunProtocolOptions;

      const stopVoiceInputOptions = {
        finishSession: false,
        ...(options.stopVoiceInputOptions || {}),
        commit: resolvedCommit,
        requestResponse: resolvedRequestResponse,
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
        protocolAdapter: createOpenAIRealtimeVoiceProtocolAdapter({ ...normalizedAliyunProtocolOptions, model: resolvedConfig.model }),
      });
    } catch (error) {
      logger.error("创建OpenAI/Qwen实时语音会话失败:", error);
      return [
        null,
        error instanceof Error ? error : new Error(String(error)),
      ];
    }
  }

  async CreateSimpleRealtimeVoiceSession(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
     manualFlag?: boolean,
  ): Promise<[IAIProxyRealtimeVoiceSession | null, Error | null]> {
    try {
      this.assertInitialized();

      const isManual = manualFlag === true;
      const resolvedCommit = !isManual;
      const resolvedRequestResponse = !isManual;

      const normalizedAppId = String(appId || "").trim();
      const normalizedThemeAuthor = String(themeAuthor || "").trim();
      const normalizedConfigTheme = String(configTheme || "").trim();
      const normalizedServiceName = String(serviceName || "").trim();
      if (!normalizedAppId || !normalizedThemeAuthor || !normalizedConfigTheme || !normalizedServiceName) {
        throw new Error("CreateSimpleRealtimeVoiceSession 参数不能为空: appId/themeAuthor/configTheme/serviceName");
      }

      const loweredTheme = normalizedConfigTheme.toLowerCase();
      const loweredService = normalizedServiceName.toLowerCase();
      const shouldUseConversation =
        loweredTheme.includes("qwen-omni") ||
        loweredService.includes("qwen-omni") ||
        (loweredTheme.includes("omni") && loweredTheme.includes("realtime")) ||
        (loweredService.includes("omni") && loweredService.includes("realtime"));

      const normalizedAliyunProtocolOptions = {
        session: {
          turn_detection: isManual ? null : { type: "server_vad" },
        },
      };

      const normalizedOptions: AIProxyAliyunRealtimeVoiceSessionOptions = {
        appId: normalizedAppId,
        themeAuthor: normalizedThemeAuthor,
        configTheme: normalizedConfigTheme,
        serviceName: normalizedServiceName,
        runtime: "browser",
        initRequestBody: {
          scene: "voice-chat",
          user_id: "anonymous",
        },
        aliyunProtocolOptions: normalizedAliyunProtocolOptions,
        // 默认启用自动音频采集和播放
        autoStartInput: true,
        autoPlayOutput: true,
        // 根据顶层参数设置 stopVoiceInputOptions
        stopVoiceInputOptions: {
          finishSession: false,
          commit: resolvedCommit,
          requestResponse: resolvedRequestResponse,
        },
      };

      if (shouldUseConversation) {
        return this.CreateConversationalVoiceSession(normalizedOptions);
      }

      return this.CreateAliyunTranscriptionSession(normalizedOptions);
    } catch (error) {
      logger.error("创建傻瓜版实时语音会话失败:", error);
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
  ): Promise<[result: UserAIProxyAuthResult | null, error: Error | null]> {
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
    const providerData = this.extractActualRealtimePayload(parsed, actualDataField);
    const providerDataRecord =
      providerData && typeof providerData === "object" && !Array.isArray(providerData)
        ? (providerData as Record<string, unknown>)
        : undefined;

    // Build field mapping from response config (supports custom field names and dotted paths)
    const fieldMapping = responseConfig ? {
      tokenField: responseConfig.responseTokenField,
      tempTokenField: responseConfig.responseTempTokenField,
      apiKeyField: responseConfig.responseApiKeyField,
      tempApiKeyField: responseConfig.responseTempApiKeyField,
      expiresInField: responseConfig.responseExpiresInField,
      expiresAtField: responseConfig.responseExpiresAtField,
    } : undefined;

    const responseConnection = this.extractRealtimeConnectionFromPayload(parsed);
    const parsedCredentials = customResponse
      ? this.extractRealtimeCredentialsFromPayload(parsed, undefined, fieldMapping)
      : this.extractRealtimeCredentialsFromPayload(parsed, parsed, fieldMapping);
    const providerCredentials = providerDataRecord
      ? this.extractRealtimeCredentialsFromPayload(providerDataRecord, providerDataRecord, fieldMapping)
      : {};
    const responseCredentials = {
      authorization: parsedCredentials.authorization || providerCredentials.authorization,
      token: parsedCredentials.token || providerCredentials.token,
      tempToken: parsedCredentials.tempToken || providerCredentials.tempToken,
      apiKey: parsedCredentials.apiKey || providerCredentials.apiKey,
      tempApiKey: parsedCredentials.tempApiKey || providerCredentials.tempApiKey,
      expiresAt: parsedCredentials.expiresAt || providerCredentials.expiresAt,
      expiresIn: parsedCredentials.expiresIn || providerCredentials.expiresIn,
      authMode: parsedCredentials.authMode || providerCredentials.authMode,
    };

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

    const expiresIn =
      responseCredentials.expiresIn || responseConfig?.defaultExpiresIn;

    if (
      !responseCredentials.authorization &&
      !responseCredentials.token &&
      !responseCredentials.tempToken &&
      !responseCredentials.apiKey &&
      !responseCredentials.tempApiKey
    ) {
      logger.warn("实时鉴权响应未解析到凭证字段", {
        actualDataField,
        hasTopLevelCredentials: Object.prototype.hasOwnProperty.call(parsed, "credentials"),
        topLevelKeys: Object.keys(parsed).slice(0, 20),
        providerDataType: providerData == null ? "null" : Array.isArray(providerData) ? "array" : typeof providerData,
        providerDataKeys: providerDataRecord ? Object.keys(providerDataRecord).slice(0, 20) : [],
      });
    }

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
    fieldMapping?: {
      tokenField?: string;
      tempTokenField?: string;
      apiKeyField?: string;
      tempApiKeyField?: string;
      expiresInField?: string;
      expiresAtField?: string;
    },
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
    const parsedRecord = this.toLooseRecord(parsed);
    const fallbackRecord = this.toLooseRecord(fallbackSource);
    const credentialsValue = parsedRecord?.credentials;
    const credentialsRecord = this.toLooseRecord(credentialsValue);
    const credentialSource =
      credentialsRecord ||
      parsedRecord ||
      fallbackRecord ||
      parsed;

    // Custom field resolution with dotted-path support (e.g. "client_secret.value")
    const resolveCustomStr = (path: string | undefined): string | undefined => {
      if (!path) return undefined;
      return this.readNestedStringValue(parsedRecord, path) ||
             this.readNestedStringValue(fallbackRecord, path) ||
             this.readNestedStringValue(credentialsRecord, path) ||
             undefined;
    };
    const resolveCustomNum = (path: string | undefined): number | undefined => {
      if (!path) return undefined;
      return this.readNestedNumberValue(parsedRecord, path) ||
             this.readNestedNumberValue(fallbackRecord, path) ||
             undefined;
    };
    // For expiresAt: handles both numeric and string-encoded timestamps
    const resolveCustomNumOrStr = (path: string | undefined): number | string | undefined => {
      if (!path) return undefined;
      return this.readNestedNumberOrStringValue(parsedRecord, path) ||
             this.readNestedNumberOrStringValue(fallbackRecord, path) ||
             this.readNestedNumberOrStringValue(credentialsRecord, path) ||
             undefined;
    };

    const authorization =
      this.readStringField(credentialSource, ["Authorization", "authorization"]) ||
      this.readStringField(parsedRecord, ["Authorization", "authorization"]) ||
      this.readStringField(fallbackRecord, ["Authorization", "authorization"]);
    const token =
      resolveCustomStr(fieldMapping?.tokenField) ||
      this.readStringField(credentialSource, ["token", "access_token", "accessToken"]) ||
      this.readStringField(parsedRecord, ["token", "access_token", "accessToken"]) ||
      this.readStringField(fallbackRecord, ["token", "access_token", "accessToken"]);
    const tempToken =
      resolveCustomStr(fieldMapping?.tempTokenField) ||
      this.readStringField(credentialSource, ["tempToken", "temp_token"]) ||
      this.readStringField(parsedRecord, ["tempToken", "temp_token"]) ||
      this.readStringField(fallbackRecord, ["tempToken", "temp_token"]) ||
      token;
    const apiKey =
      resolveCustomStr(fieldMapping?.apiKeyField) ||
      this.readStringField(credentialSource, ["apiKey", "api_key"]) ||
      this.readStringField(parsedRecord, ["apiKey", "api_key"]) ||
      this.readStringField(fallbackRecord, ["apiKey", "api_key"]);
    const tempApiKey =
      resolveCustomStr(fieldMapping?.tempApiKeyField) ||
      this.readStringField(credentialSource, ["tempApiKey", "temp_api_key"]) ||
      this.readStringField(parsedRecord, ["tempApiKey", "temp_api_key"]) ||
      this.readStringField(fallbackRecord, ["tempApiKey", "temp_api_key"]) ||
      apiKey;
    const expiresAt =
      resolveCustomNumOrStr(fieldMapping?.expiresAtField) ||
      this.readNumberOrStringField(credentialSource, ["expiresAt", "expires_at"]) ||
      this.readNumberOrStringField(parsedRecord, ["expiresAt", "expires_at"]) ||
      this.readNumberOrStringField(fallbackRecord, ["expiresAt", "expires_at"]);
    const expiresIn =
      resolveCustomNum(fieldMapping?.expiresInField) ||
      this.readNumberField(credentialSource, ["expiresIn", "expires_in"]) ||
      this.readNumberField(parsedRecord, ["expiresIn", "expires_in"]) ||
      this.readNumberField(fallbackRecord, ["expiresIn", "expires_in"]);
    const authMode =
      this.readStringField(credentialSource, ["authMode", "auth_mode"]) ||
      this.readStringField(parsedRecord, ["authMode", "auth_mode"]) ||
      this.readStringField(fallbackRecord, ["authMode", "auth_mode"]);

    return {
      authorization,
      token,
      tempToken,
      apiKey,
      tempApiKey,
      expiresAt,
      expiresIn,
      authMode: authMode as
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

  private toLooseRecord(value: unknown): Record<string, unknown> | undefined {
    if (!value) {
      return undefined;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return undefined;
      }
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  // Reads a (possibly dotted-path) string field, e.g. "client_secret.value"
  private readNestedStringValue(
    record: Record<string, unknown> | undefined,
    path: string,
  ): string | undefined {
    if (!record || !path) return undefined;
    const dotIdx = path.indexOf('.');
    if (dotIdx < 0) {
      return this.toOptionalString(record[path]) || undefined;
    }
    const head = path.slice(0, dotIdx);
    const tail = path.slice(dotIdx + 1);
    const nested = record[head];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return this.readNestedStringValue(nested as Record<string, unknown>, tail);
    }
    return undefined;
  }

  private readNestedNumberValue(
    record: Record<string, unknown> | undefined,
    path: string,
  ): number | undefined {
    if (!record || !path) return undefined;
    const dotIdx = path.indexOf('.');
    if (dotIdx < 0) {
      return this.toOptionalNumber(record[path]);
    }
    const head = path.slice(0, dotIdx);
    const tail = path.slice(dotIdx + 1);
    const nested = record[head];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return this.readNestedNumberValue(nested as Record<string, unknown>, tail);
    }
    return undefined;
  }

  // Like readNestedNumberValue but also handles string-encoded numbers (e.g. expiresAt as "1748246400")
  private readNestedNumberOrStringValue(
    record: Record<string, unknown> | undefined,
    path: string,
  ): number | string | undefined {
    if (!record || !path) return undefined;
    const dotIdx = path.indexOf('.');
    if (dotIdx < 0) {
      return this.toNumberOrString(record[path]);
    }
    const head = path.slice(0, dotIdx);
    const tail = path.slice(dotIdx + 1);
    const nested = record[head];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return this.readNestedNumberOrStringValue(nested as Record<string, unknown>, tail);
    }
    return undefined;
  }

  private readStringField(
    record: Record<string, unknown> | undefined,
    keys: string[],
  ): string | undefined {
    if (!record) {
      return undefined;
    }
    for (const key of keys) {
      const value = this.toOptionalString(record[key]);
      if (value) {
        return value;
      }
    }
    return undefined;
  }

  private readNumberField(
    record: Record<string, unknown> | undefined,
    keys: string[],
  ): number | undefined {
    if (!record) {
      return undefined;
    }
    for (const key of keys) {
      const value = this.toOptionalNumber(record[key]);
      if (value != null) {
        return value;
      }
    }
    return undefined;
  }

  private readNumberOrStringField(
    record: Record<string, unknown> | undefined,
    keys: string[],
  ): number | string | undefined {
    if (!record) {
      return undefined;
    }
    for (const key of keys) {
      const value = this.toNumberOrString(record[key]);
      if (value != null) {
        return value;
      }
    }
    return undefined;
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
