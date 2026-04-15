import { Multiaddr } from "@multiformats/multiaddr";
import { PublicKey } from "@libp2p/interface";
import type { Client } from "../dcapi";
import { Ed25519PubKey } from "../dc-key/ed25519";
export interface User {
  callMinusNumber: number; //调用手续费单位（与用户订阅的空间大小相关，空间越大这个值越小）
  commentFrozenStatus: number; //评论相关功能(包括keyvalue数据库、主题评论等功能)冻结状态
  commentReportAmount: number; //评论举报次数
  commentReportNumber: number; //下一次消除举报次数的区块高度
  dbConfigStr: string; //用户个体库配置信息，格式（threadid|sk|rk)加密后的值，（用户公钥加密后的字符串值，用户私钥可以解密）
  dbConfig: string; //dbConfig,私钥加密后的
  dbConfigRaw: Uint8Array; //dbConfig,私钥加密后的原始值
  dbUpdateNumber: number; //用户个体库信息更新区块高度
  encNftAccount: string; //用户绑定的账号加密后字符串（用户公钥加密后的值，用户私钥可以解密）
  expireNumber: number; //订阅过期区块高度
  loginNumber: number; //登录次数
  nftUpdateNumber: number; //用户nft账号更新区块高度
  offchainOptimes: number; //链下允许总调用次数,当前会一直累加
  offchainSpace: number; //链下允许总调用空间，当前会一直累加
  parentAccount: string; //父账号pubkey
  peers: Array<string>; //账号登录信息存储的节点ID列表
  purchaseNumber: number; //购买高度
  requestPeers: Array<string>; //允许上传文件的节点ID列表,如果不在列表中则无法上传文件,需要先发起绑定请求
  spamFrozenStatus: number; //垃圾信息相关功能冻结状态
  spamReportAmount: number; //垃圾信息举报次数
  spamReportNumber: number; //下一次消除垃圾信息举报次数的区块高度
  subscribePrice: string; //订阅价格
  subscribeSpace: number; //订阅空间大小，单位KB
  usedSpace: number; //已使用空间大小，单位KB
}

export interface DCConnectInfo {
  client?: Client | undefined;
  nodeAddr?: Multiaddr | undefined;
}

export interface SignHandler {
  sign(payload: Uint8Array): Uint8Array;
  getPublicKey(): Ed25519PubKey;
  getPubkeyRaw: () => Uint8Array;
  decrypt: (content: Uint8Array) => Promise<Uint8Array>;
}
// 类型定义
export interface FileTransmit {
  updateTransmitSize(status: string, size: number): void;
}

export interface APPInfo {
  appId: string;
  rtcAppId?: string;
  appName: string;
  appIcon?: string;
  appUrl?: string;
  appVersion?: string;
}

export interface ThemeObj {
  theme: string;
  appId: string;
  rtcAppId?: string;
  blockheight: number;
  commentSpace: number;
  allowSpace: number;
  userPubkey: string;
  openFlag: number;
  signature: string;
  CCount: number;
  UpCount: number;
  DownCount: number;
  TCount: number;
  vaccount: string;
}

export interface ThemeAuthInfo {
  pubkey: string; // 用户公钥
  permission: number; // 权限
  remark: string; // 预留配置
  key?: string; // 预留配置，权限配置的唯一标识
}
export interface ThemeComment {
  theme: string;
  appId: string;
  rtcAppId?: string;
  themeAuthor: string;
  blockheight: number;
  userPubkey: string;
  commentCid: string;
  comment: string;
  commentSize: number;
  status: number;
  refercommentkey: string;
  CCount: number;
  UpCount: number;
  DownCount: number;
  TCount: number;
  type: number;
  signature: string;
  vaccount: string;
}

export interface ProxyCallConfig {
  No: number; //订阅序号,每次调用都必须在上次的基础上进行加1
  Tlim?: number; //总访问次数限制
  Dlim?: number; //日访问次数限制
  Wlim?: number; //周访问次数限制
  Mlim?: number; //月访问次数限制
  Ylim?: number; //年访问次数限制
  Exp?: number; //过期区块高度
}

export interface UserProxyCallConfig {
  UserPubkey: string; //用户公钥
  permission: number; //权限
  authConfig: ProxyCallConfig; //授权配置
}

export interface AIProxyRealtimeConnectionPreset {
  protocol?: "WebSocket";
  url?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  protocols?: string[];
  // bearer 依赖 WebSocket 握手头时，在浏览器原生 WebSocket 环境中通常不可直接使用。
  // 如果选择 bearer，请优先确认服务端支持 query/token 方式，或通过 createWebSocket 注入自定义 socket factory。
  authMode?: "token" | "apikey" | "bearer" | "none";
  authQueryName?: string;
}

export interface AIProxyRealtimeResponsePreset {
  customResponse?: boolean;
  actualDataField?: string;
  defaultExpiresIn?: number;
  reconnectOnRefresh?: boolean;
}

export interface AIProxyRealtimeCredentialExchangePreset {
  enabled?: boolean;
  mode?: "fallback" | "prefer" | "required";
  endpoint?: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
  appId?: string;
  appKey?: string;
  appSecret?: string;
  appIdField?: string;
  appKeyField?: string;
  appSecretField?: string;
  appIdLocation?: "query" | "body" | "header";
  appKeyLocation?: "query" | "body" | "header";
  appSecretLocation?: "query" | "body" | "header";
  responseTokenField?: string;
  responseTempTokenField?: string;
  responseApiKeyField?: string;
  responseTempApiKeyField?: string;
  responseExpiresInField?: string;
  responseExpiresAtField?: string;
}

export interface AIProxyRealtimeConfig {
  enabled?: boolean;
  connection?: AIProxyRealtimeConnectionPreset;
  response?: AIProxyRealtimeResponsePreset;
  credentialExchange?: AIProxyRealtimeCredentialExchangePreset;
  extend?: Record<string, string>;
}

// 动态签名相关接口定义
export interface AIProxySignatureNodeInjectTimestamp {
  key: string;
  format: 'unix_s' | 'unix_ms' | 'unix' | 'unix_us' | 'unix_ns' | 'iso8601' | 'iso8601_nano' | 'rfc3339' | 'rfc1123' | 'rfc822' | 'datetime' | 'compact' | 'date' | string; // 时间戳格式
  offset?: number; // 时间戳偏移量（单位：秒）
}

export interface AIProxySignatureNodeInjectNonce {
  key: string;
  length: number;
}

export interface AIProxySignatureNodeInject {
  timestamp?: AIProxySignatureNodeInjectTimestamp;
  nonce?: AIProxySignatureNodeInjectNonce;
}

export interface AIProxySignatureIncludes {
  useBody?: boolean; // 是否包含请求体参数
  useQuery?: boolean; // 是否包含URL查询参数
  headers?: string[]; // 需要包含的特定Header列表
  nodeInject?: AIProxySignatureNodeInject; // 节点自动注入的动态字段
  fixedParams?: Record<string, string>; // 固定参与签名的参数
}

export interface AIProxySignatureAssembler {
  sort: 'ascii_key_asc' | 'ascii_key_desc' | 'none'; // 参数排序方式
  format: 'url_query' | 'json' | 'json_pretty' | 'kv_concat' | 'kv_lines' | 'xml' | 'custom_delimiter' | 'pattern'; // 参数拼装格式
  encoding?: 'query_escape_plus' | 'percent_encode' | 'rfc3986' | 'raw'; // 参数编码策略
  delimiter?: string; // 项与项的分隔符，用于 custom_delimiter 模式
  kvDelimiter?: string; // 键值的分隔符，用于 custom_delimiter 模式
  pattern?: string; // 拼接模板，用于 pattern 模式 (如 "{appId}{secret}{timestamp}")
}

export interface AIProxySignatureSecretUsage {
  type: 'hmac_key' | 'append_to_string' | 'prepend_to_string' | 'pattern_inject' | 'none'; // 秘钥使用方式
  keyName?: string; // 用于拼接模式下的Key名称
}

export interface AIProxySignatureOutput {
  target: 'header' | 'query' | 'body'; // 签名输出位置
  key: string; // 输出字段名, 如 "Authorization", "X-Sign"
  prefix?: string; // 前缀, 如 "Signature ", "Bearer "
  encoding: 'hex' | 'hex_with_0x' | 'base64' | 'base64url'; // 签名编码方式
}

export interface AIProxySignatureConfig {
  template?: 'tencent_tc3' | 'aliyun' | 'aliyun_concat' | string; // 云厂商签名模板
  algorithm: 'HMAC-SHA256' | 'HMAC-SHA1' | 'MD5' | 'RSA-SHA256' | 'SHA256'; // 签名算法
  includes?: AIProxySignatureIncludes; // 参与签名的参数收集规则
  assembler?: AIProxySignatureAssembler; // 参数装配与排序规则
  secretUsage?: AIProxySignatureSecretUsage; // 秘钥使用方式
  output?: AIProxySignatureOutput; // 签名输出配置
}

export enum AIModelType {
  ModelType_AI = 0,
  ModelType_MCPServer = 1,
  ModelType_SubTheme = 2
}

export interface AIProxyConfig {
  service: string; // 服务名称
  isAIModel: AIModelType; // 0: AI模型 1: MCPServer 2: subtopic
  apiType: number; // 当type 为0时起作用,表示模型的接口类型,如0:anthropic,1:openai 2:ollama 3:googleai 4:azureopenai
  authorization: string;
  endpoint: string;
  organization: string; // 组织名称或ID
  apiVersion: string; // api版本号
  modelConfig: ModelConfig; // 模型配置
  remark: string;
  realtime?: AIProxyRealtimeConfig; // 实时调用扩展配置
  signature?: AIProxySignatureConfig; // 动态签名配置
  blockheight?: number; // 可以不设置,由sdk自动设置
  timestamp?: number; // 设置时间戳,DC节点自动设置
  userPubkey?: string; // 设置配置用户公钥,DC节点自动设置
}

// 函数定义结构
export interface FunctionDef {
  name: string; // 函数名称
  description: string; // 函数描述
  parameters?: any; // 可选参数，可以为任意类型
}

// 工具定义结构
export interface ToolDefinition {
  type: string; // 工具类型
  function?: FunctionDef; // 可选的函数定义
}

// 模型配置结构
export interface ModelConfig {
  model: string; // 模型名称
  temperature: number; // 温度参数
  maxTokens: number; // 最大 token 数量
  topP: number; // Top-P 采样参数
  topK: number; // Top-K 采样参数
  stopSequences: string[]; // 停止序列数组
  systemPrompt: string; // 系统提示
  stream: boolean; // 是否启用流模式
  tools?: ToolDefinition[]; // 可选的工具定义数组
}

export interface Account {
  nftAccount: string; // NFT账号
  appAccount: Uint8Array; // 应用专用账号公钥
  account: string; // 存储账号公钥,appAccount的base32编码字符串
  ethAccount: string; // 以太坊兼容链上账号
  chainId?: string; // 区块链ID
  chainName?: string; // 区块链名称
  accountInfo?: AccountInfo;
}

// modelConfig := ModelConfig{
// 		Model:         "tngtech/deepseek-r1t-chimera:free",
// 		Temperature:   0.7,
// 		MaxTokens:     10000,
// 		TopP:          0.9,
// 		TopK:          40,
// 		StopSequences: []string{},
// 		SystemPrompt:  "你是一个软件开发专家.",
// 		Stream:        true,
// 	}

// 定义AI流式响应状态枚举
export enum AIStreamResponseFlag {
  /** 流式响应进行中 */
  STREAMING = 0,
  /** 推理信息流式响应进行中 */
  STREAMING_REASON = 1,
  /** 权限不足 */
  PERMISSION_DENIED = 2,
  /** 获取失败 */
  FETCH_FAILED = 3,
  /** 关闭连接 */
  CONNECTION_CLOSED = 4,
  /** Token数超限，需要继续请求 */
  TOKEN_LIMIT_EXCEEDED = 5,
  TOOLCALL = 6,
  // 外部退出
  EXTERNAL_EXIT = 7,
  /** 卡住了 */
  STREAM_HANG = 88,
  /** 其他错误 */
  OTHER_ERROR = 99,
}

// 调用AIProxy的流式回调函数
// flag: 0表示开始接收数据, 1:权限不足 2:获取失败 3:关闭连接 4: 其他错误
// content: 接收到的数据
export type OnStreamResponseType = (
  flag: AIStreamResponseFlag,
  content: string,
  err: string,
) => void;

export enum NFTBindStatus {
  Success = 0,
  UserBinded = 1, // 用户已绑定其他nft账号
  NftAccountBinded = 2, // nft账号已经被其他用户绑定
  NoBcAccount = 3, // 区块链账号不存在
  DcPeerNotConnected = 4, // 还没有建立到存储节点的连接
  EncryptError = 5, // 加密数据过程出错
  BlockchainError = 6, // 区块链相关错误
  SignError = 7, // 签名错误
  SpaceExpired = 8, // 用户有效期已过
  NoLeftSpace = 9, // 空间不足
  NetworkErr = 10, // 网络错误
  Error = 99, // 其他异常
}

export enum UploadStatus {
  OK = 0,
  ENCRYPTING = 1, // 加密中
  UPLOADING = 2, // 上传中
  ERROR = 3,
  ABNORMAL = 4,
  PULLERROR = 5,
  FILESIZEERROR = 6, // 文件大小错误
  FILECOUNTERROR = 7, // 文件总数错误
  NOSPACE = 8, // 存储空间不足
}

export enum PeerStatus {
  PeerStatusOffline = 1,
  PeerStatusJoining = 2, //Joining the network
  PeerStatusOnline = 3,
  PeerStatusStaked = 4,
  PeerStatusErr = 5,
  PeerStatusClose = 6,
  PeerStatusDiscard = 7,
}

export type SignReqMessageData = {
  appUrl: string;
  ethAccount: string;
  messageType?: string; // 'string',//string,hex,base64,eip712
  message: string;
};

export type SignReqMessage = {
  type: string;
  origin: string;
  data: SignReqMessageData;
};

export type SignResponseMessage = {
  success: boolean;
  signature: string;
};

type EIP712SignReqMessageData = {
  appUrl: string;
  ethAccount: string;
  domain: any;
  types: any;
  primaryType: string;
  message: any;
};

export type EIP712SignReqMessage = {
  type: string;
  origin: string;
  data: EIP712SignReqMessageData;
};

export type SendMessage<T> = {
  type: string;
  data?: T;
};

export type ResponseMessage<T> = {
  type: string;
  data: T;
};

export interface IAICallConfig {
  appId: string;
  rtcAppId?: string;
  themeAuthor: string;
  theme: string;
  service: string;
  headers?: Record<string, string>;
  path?: string;
  model?: string;
}

export type AIProxyRealtimeAudioWriteData =
  | string
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | Record<string, unknown>;

export interface AIProxyRealtimeAudioAuthInfo {
  websocketUrl?: string;
  url?: string;
  endpoint?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  protocols?: string[];
  token?: string;
  tempToken?: string;
  apiKey?: string;
  tempApiKey?: string;
  // bearer 表示凭据语义在 Authorization 头中；在浏览器原生 WebSocket 环境下通常不能直接依赖该头发起握手。
  // 若 authMode=bearer，通常需要 createWebSocket 提供自定义运行时，或改由服务端支持 query/token 透传。
  authMode?: "token" | "apikey" | "bearer" | "none";
  authQueryName?: string;
  expiresAt?: number | string;
  expiresIn?: number;
  reconnectOnRefresh?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AIProxyRealtimeSocketMessageEvent {
  data: string | ArrayBuffer | Blob;
  type?: string;
  [key: string]: unknown;
}

export interface AIProxyRealtimeSocketCloseEvent {
  code?: number;
  reason?: string;
  wasClean?: boolean;
  type?: string;
  [key: string]: unknown;
}

export interface AIProxyRealtimeSocketErrorEvent {
  error?: unknown;
  message?: string;
  type?: string;
  [key: string]: unknown;
}

export interface AIProxyRealtimeAudioSocketLike {
  readonly readyState: number;
  binaryType?: BinaryType | string;
  onmessage:
    | ((event: MessageEvent | AIProxyRealtimeSocketMessageEvent) => void)
    | null;
  onclose:
    | ((event: CloseEvent | AIProxyRealtimeSocketCloseEvent) => void)
    | null;
  onerror:
    | ((event: Event | Error | AIProxyRealtimeSocketErrorEvent) => void)
    | null;
  addEventListener(
    type: "open" | "message" | "error" | "close",
    listener: (event: unknown) => void,
    options?: { once?: boolean },
  ): void;
  removeEventListener(
    type: "open" | "message" | "error" | "close",
    listener: (event: unknown) => void,
  ): void;
  send(data: string | Blob | ArrayBuffer): void;
  close(code?: number, reason?: string): void;
}

export interface AIProxyRealtimeAudioSocketFactoryOptions {
  url: string;
  protocols: string[];
  // 仅在自定义 socket factory 可消费时有效；浏览器原生 WebSocket 构造函数不会直接接受这些 headers。
  headers: Record<string, string>;
  authInfo: AIProxyRealtimeAudioAuthInfo;
}

export interface IAIProxyRealtimeAudioSession {
  readonly authInfo: AIProxyRealtimeAudioAuthInfo | null;
  readonly isConnected: boolean;
  readonly readyState: number;

  connect(): Promise<void>;
  write(data: AIProxyRealtimeAudioWriteData): Promise<void>;
  refreshAuth(forceRefresh?: boolean): Promise<AIProxyRealtimeAudioAuthInfo>;
  close(code?: number, reason?: string): void;
}

export interface AIProxyRealtimeAudioSessionOptions {
  context?: { signal?: AbortSignal };
  initRequestBody: string | Record<string, unknown>;
  // 当 realtimeConfig.connection.authMode 为 bearer 时，浏览器原生 WebSocket 通常无法直接发送 Authorization 头。
  // 这类场景应优先使用 query/token 模式，或通过 createWebSocket 接入支持自定义请求头的运行时实现。
  realtimeConfig?: AIProxyRealtimeConfig;
  forceRefresh?: boolean;
  appId?: string;
  themeAuthor?: string;
  configTheme?: string;
  serviceName?: string;
  headers?: Record<string, string>;
  path?: string;
  model?: string;
  autoReconnect?: boolean;
  reconnectDelayMs?: number;
  connectTimeoutMs?: number;
  refreshBeforeMs?: number;
  reconnectOnAuthRefresh?: boolean;
  resolveAuthInfo?: (
    payload: string,
  ) => AIProxyRealtimeAudioAuthInfo;
  // 如果需要在浏览器外或特殊运行时里透传 Authorization 等握手头，可使用自定义 socket factory。
  createWebSocket?: (
    options: AIProxyRealtimeAudioSocketFactoryOptions,
  ) => AIProxyRealtimeAudioSocketLike;
  onConnected?: (
    session: IAIProxyRealtimeAudioSession,
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ) => void;
  onAuthRefreshed?: (authInfo: AIProxyRealtimeAudioAuthInfo) => void;
  onMessage?: (
    data: string | ArrayBuffer | Blob,
    event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ) => void;
  onJsonMessage?: (
    data: unknown,
    event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ) => void;
  onError?: (error: Error | Event | AIProxyRealtimeSocketErrorEvent) => void;
  onClose?: (event: CloseEvent | AIProxyRealtimeSocketCloseEvent) => void;
}

export interface AIProxyAliyunRealtimeAudioSessionOptions
  extends Omit<AIProxyRealtimeAudioSessionOptions, "realtimeConfig"> {
  // 阿里云 DashScope 实时接口的 WebSocket 基地址，默认会拼成 /api-ws/v1/inference 并附带 model query。
  websocketBaseUrl?: string;
  // 阿里云默认按 query 透传 api_key；只有在服务端或自定义 socket factory 明确支持时才建议改成其它模式。
  authQueryName?: string;
  // 自定义返回中真实下游数据挂载字段，默认 providerData。
  actualDataField?: string;
  // 鉴权返回未显式给出 expiresIn 时的默认秒数，默认 600。
  defaultExpiresIn?: number;
}

export type AIProxyRealtimeVoiceRuntime =
  | "auto"
  | "browser"
  | "wechat-browser"
  | "mini-program"
  | "custom";

export interface AIProxyRealtimeVoiceInputFrame {
  data: ArrayBuffer | ArrayBufferView | Blob;
  format?: "pcm16" | "pcm-f32" | string;
  sampleRate?: number;
  channels?: number;
  mimeType?: string;
  sequence?: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface AIProxyRealtimeVoiceOutputFrame {
  data: string | ArrayBuffer | ArrayBufferView | Blob;
  format?: "pcm16" | "pcm-f32" | string;
  sampleRate?: number;
  channels?: number;
  mimeType?: string;
  sequence?: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface AIProxyRealtimeVoiceStopOptions {
  commit?: boolean;
  requestResponse?: boolean;
  finishSession?: boolean;
}

export interface AIProxyRealtimeVoiceProtocolContext {
  runtime: Exclude<AIProxyRealtimeVoiceRuntime, "auto">;
  transport: IAIProxyRealtimeAudioSession;
  authInfo: AIProxyRealtimeAudioAuthInfo | null;
}

export interface AIProxyRealtimeVoiceInputContext {
  runtime: Exclude<AIProxyRealtimeVoiceRuntime, "auto">;
  signal?: AbortSignal;
  emitFrame: (frame: AIProxyRealtimeVoiceInputFrame) => void | Promise<void>;
  emitError: (error: Error) => void;
}

export interface IAIProxyRealtimeVoiceInputAdapter {
  start(context: AIProxyRealtimeVoiceInputContext): Promise<void> | void;
  stop(): Promise<void> | void;
  pause?(): Promise<void> | void;
  resume?(): Promise<void> | void;
}

export interface IAIProxyRealtimeVoiceOutputAdapter {
  start?(): Promise<void> | void;
  play(frame: AIProxyRealtimeVoiceOutputFrame): Promise<void> | void;
  stop(): Promise<void> | void;
  clear?(): Promise<void> | void;
}

export interface AIProxyRealtimeVoiceProtocolAdapter {
  buildConnectMessages?: (
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  buildAudioInputMessages: (
    frame: AIProxyRealtimeVoiceInputFrame,
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  buildTextInputMessages?: (
    text: string,
    context: AIProxyRealtimeVoiceProtocolContext,
    params?: AIProxyRealtimeVoiceTextInputOptions,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  buildCommitMessages?: (
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  buildResponseCreateMessages?: (
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  buildFinishMessages?: (
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeAudioWriteData
    | AIProxyRealtimeAudioWriteData[]
    | Promise<AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null>
    | null;
  extractOutputFrames?: (
    message: unknown,
    rawData: string | ArrayBuffer | Blob,
    context: AIProxyRealtimeVoiceProtocolContext,
  ) =>
    | AIProxyRealtimeVoiceOutputFrame
    | AIProxyRealtimeVoiceOutputFrame[]
    | Promise<AIProxyRealtimeVoiceOutputFrame | AIProxyRealtimeVoiceOutputFrame[] | null>
    | null;
}

export interface AIProxyRealtimeVoiceBrowserAdapterOptions {
  sampleRate?: number;
  channelCount?: number;
  bufferSize?: number;
  audioConstraints?: MediaTrackConstraints;
}

export interface AIProxyRealtimeVoiceAliyunProtocolOptions {
  session?: Record<string, unknown>;
  response?: Record<string, unknown>;
  inputAudioFormat?: string;
  outputAudioFormat?: string;
  autoCommitOnStop?: boolean;
  autoCreateResponseOnStop?: boolean;
  model?: string;
  modalities?: ("text" | "audio")[];
}

export interface AIProxyWechatMiniProgramSocketTaskLike {
  send(options: { data: string | ArrayBuffer }): void;
  close(options?: { code?: number; reason?: string }): void;
  onOpen(callback: (event: unknown) => void): void;
  onMessage(callback: (event: { data: string | ArrayBuffer }) => void): void;
  onError(callback: (event: unknown) => void): void;
  onClose(
    callback: (event: { code?: number; reason?: string }) => void,
  ): void;
}

export interface AIProxyWechatMiniProgramRecorderLike {
  start(options?: Record<string, unknown>): void;
  stop(): void;
  pause?(): void;
  resume?(): void;
  onFrameRecorded?(
    callback: (event: { frameBuffer: ArrayBuffer; isLastFrame?: boolean }) => void,
  ): void;
  onError(callback: (event: unknown) => void): void;
}

export interface AIProxyWechatMiniProgramInnerAudioContextLike {
  autoplay: boolean;
  src: string;
  play(): void;
  stop(): void;
  destroy?(): void;
  onEnded?(callback: () => void): void;
  onError?(callback: (event: unknown) => void): void;
}

export interface AIProxyWechatMiniProgramAPI {
  connectSocket(options: {
    url: string;
    protocols?: string[];
    header?: Record<string, string>;
  }): AIProxyWechatMiniProgramSocketTaskLike;
  getRecorderManager?(): AIProxyWechatMiniProgramRecorderLike;
  createInnerAudioContext?(): AIProxyWechatMiniProgramInnerAudioContextLike;
}

export interface AIProxyRealtimeVoiceMiniProgramOptions {
  wx?: AIProxyWechatMiniProgramAPI;
  recorderOptions?: Record<string, unknown>;
}

export interface AIProxyRealtimeVoiceImageInput {
  type?: 'url' | 'base64';
  value?: string;
  url?: string;
  data?: string;
  mediaType?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AIProxyRealtimeVoiceTextInputOptions {
  type?: 'prompt' | 'transcript';
  images?: Array<string | AIProxyRealtimeVoiceImageInput>;
  input?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export type AIProxyRealtimeVoiceImagePromptOptions = Omit<
  AIProxyRealtimeVoiceTextInputOptions,
  'images'
>;

export interface IAIProxyRealtimeVoiceSession {
  readonly transport: IAIProxyRealtimeAudioSession | null;
  readonly runtime: Exclude<AIProxyRealtimeVoiceRuntime, "auto">;
  readonly isCapturing: boolean;
  connect(): Promise<void>;
  startVoiceInput(): Promise<void>;
  stopVoiceInput(options?: AIProxyRealtimeVoiceStopOptions): Promise<void>;
  sendText(text: string, options?: AIProxyRealtimeVoiceTextInputOptions): Promise<void>;
  sendImagePrompt(
    text: string,
    image: string | AIProxyRealtimeVoiceImageInput,
    options?: AIProxyRealtimeVoiceImagePromptOptions,
  ): Promise<void>;
  sendEvent(data: AIProxyRealtimeAudioWriteData): Promise<void>;
  commitInput(): Promise<void>;
  requestResponse(): Promise<void>;
  finishSession(): Promise<void>;
  close(code?: number, reason?: string): Promise<void>;
}

export interface AIProxyRealtimeVoiceSessionOptions
  extends AIProxyRealtimeAudioSessionOptions {
  runtime?: AIProxyRealtimeVoiceRuntime;
  protocolAdapter: AIProxyRealtimeVoiceProtocolAdapter;
  inputAdapter?: IAIProxyRealtimeVoiceInputAdapter;
  outputAdapter?: IAIProxyRealtimeVoiceOutputAdapter;
  browserAdapterOptions?: AIProxyRealtimeVoiceBrowserAdapterOptions;
  miniProgramOptions?: AIProxyRealtimeVoiceMiniProgramOptions;
  autoStartInput?: boolean;
  autoPlayOutput?: boolean;
  stopVoiceInputOptions?: AIProxyRealtimeVoiceStopOptions;
  onModelEvent?: (message: unknown) => void;
  onVoiceInputFrame?: (frame: AIProxyRealtimeVoiceInputFrame) => void;
  onVoiceOutputFrame?: (frame: AIProxyRealtimeVoiceOutputFrame) => void;
  onVoiceError?: (error: Error) => void;
}

export interface AIProxyAliyunRealtimeVoiceSessionOptions
  extends Omit<
    AIProxyRealtimeVoiceSessionOptions,
    "realtimeConfig" | "protocolAdapter"
  >,
    AIProxyAliyunRealtimeAudioSessionOptions {
  aliyunProtocolOptions?: AIProxyRealtimeVoiceAliyunProtocolOptions;
}

export interface AIMessageMediaSource {
  url?: string;
  type?: string;
  name?: string;
}

export interface AIMessageContent {
  type: string;
  text?: string;
  source?: AIMessageMediaSource;
}

export interface AIChatMessage {
  role: string;
  content: AIMessageContent[];
}

export interface AIChatMessageRequest {
  chatMessages: AIChatMessage[];
}

export interface IAppInfo {
  appId: string;
  rtcAppId?: string;
  domain: string;
  owner: string;
  rewarder: string;
  fid: string;
}

export type AccountInfo = {
  url?: string;
  name: string;
  nftAccount: string;
  account: string;
  credentialId: string;
  iv: Uint8Array;
  mnemonic: ArrayBuffer;
  timeStamp: number;
  type: string;
};

export interface GetUserAIProxyAuthParams {
  theme: string; // 状态汇聚对象CID
  appId: string;
  rtcAppId?: string; // 应用标志
  themeAuthor: string; // 发布状态汇聚对象的的pubkey
  UserPubkey: string; // 申请访问配置的用户pubkey
  vaccount?: string | null; // 虚拟账号,可选,如果有虚拟账号
}
