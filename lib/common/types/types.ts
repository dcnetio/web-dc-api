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
  purchaseNumber: number; //购买次数
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
  appName: string;
  appIcon: string;
  appUrl: string;
  appVersion: string;
}

export interface ThemeObj {
  theme: string;
  appId: string;
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
}
export interface ThemeComment {
  theme: string;
  appId: string;
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


export interface ProxyCallConfig  {
    No: number;//订阅序号,每次调用都必须在上次的基础上进行加1
    Tlim?: number;//总访问次数限制
    Dlim?: number; //日访问次数限制
    Wlim?: number; //周访问次数限制
    Mlim?: number; //月访问次数限制
    Ylim?: number; //年访问次数限制
    Exp?: number;//过期区块高度
}   


export interface UserProxyCallConfig  {
    UserPubkey: string;//用户公钥
    permission: number;//权限
    authConfig: ProxyCallConfig;//授权配置
}  


export interface AIProxyConfig {
  isAIModel: number;    // 0: AI模型 1: MCPServer
  apiType: number;      // 当type 为0时起作用,表示模型的接口类型,如0:anthropic,1:openai 2:ollama 3:googleai 4:azureopenai
  authorization: string;
  endpoint: string;
  organization: string; // 组织名称或ID (fixed spelling from 'Orgnization')
  apiVersion: string;   // api版本号
  modelConfig: ModelConfig; // 模型配置
  remark: string;
  blockheight?: number;  // 可以不设置,由sdk自动设置
}

// 函数定义结构
export interface FunctionDef {
    name: string;                     // 函数名称
    description: string;              // 函数描述
    parameters?: any;                 // 可选参数，可以为任意类型
}

// 工具定义结构
export interface ToolDefinition {
    type: string;                     // 工具类型
    function?: FunctionDef;           // 可选的函数定义
}

// 模型配置结构
export interface ModelConfig {
    model: string;                    // 模型名称
    temperature: number;              // 温度参数
    maxTokens: number;                // 最大 token 数量
    topP: number;                     // Top-P 采样参数
    topK: number;                     // Top-K 采样参数
    stopSequences: string[];          // 停止序列数组
    systemPrompt: string;             // 系统提示
    stream: boolean;                  // 是否启用流模式
    tools?: ToolDefinition[];         // 可选的工具定义数组
}


export  interface Account{
      nftAccount:string, // NFT账号
      appAccount:Uint8Array, // 应用专用账号公钥 
      ethAccount:string, // 以太坊兼容链上账号
      chainId:string, // 区块链ID
      chainName:string, // 区块链名称
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

// 调用AIProxy的流式回调函数
// flag: 0表示开始接收数据, 1:权限不足 2:获取失败 3:关闭连接 4: 其他错误
// content: 接收到的数据
export type OnStreamResponseType = (flag: number, content: string,err: string) => void; 

export enum NFTBindStatus {
  Success = 0,
  UserBinded = 1,           // 用户已绑定其他nft账号
  NftAccountBinded = 2,     // nft账号已经被其他用户绑定
  NoBcAccount = 3,          // 区块链账号不存在
  DcPeerNotConnected = 4,   // 还没有建立到存储节点的连接
  EncryptError = 5,         // 加密数据过程出错
  BlockchainError = 6,      // 区块链相关错误
  SignError = 7,            // 签名错误
  SpaceExpired = 8,         // 用户有效期已过
  NoLeftSpace = 9,          // 空间不足
  NetworkErr = 10,          // 网络错误
  Error = 99                // 其他异常
}



export enum UploadStatus {
  OK= 0,
  ENCRYPTING=1, // 加密中
  UPLOADING=2, // 上传中
  ERROR=3,
  ABNORMAL=4,
};

export type ConnectReqMessage = {
    type?: string,
    origin: string,
    data?: {
        appId: string,
        appName: string,
        appIcon?: string,
        appUrl: string,
        appVersion: string,
        account?: string,
        chainId?: string,
    }
}

// ConnectReqMessage类型检查,每个字段类型也要检查
export function isConnectReqMessage(obj: any): obj is ConnectReqMessage {  
    return (  
      typeof obj === "object" &&  
      obj !== null &&  
      typeof obj.type === "string" &&  
      typeof obj.origin === "string" &&  
      typeof obj.data === "object" &&  
      obj.data !== null &&  
      typeof obj.data.appName === "string" &&  
      typeof obj.data.appUrl === "string" &&  
      typeof obj.data.appVersion === "string" &&  
      (typeof obj.data.appIcon === "string" || obj.data.appIcon === undefined) &&  
      (typeof obj.data.account === "string" || obj.data.account === undefined) &&  
      (typeof obj.data.chainId === "string" || obj.data.chainId === undefined)  
    );  
  }  


export type SignReqMessageData = {
    appUrl: string,
    ethAccount: string,
    messageType?: string, // 'string',//string,hex,base64,eip712
    message: string,
}

export type SignReqMessage = {
    type: string,
    origin: string,
    data: SignReqMessageData
}

// SignReqMessage类型检查,每个字段类型也要检查
export function isSignReqMessage(obj: any): obj is SignReqMessage {  
    return (  
      typeof obj === "object" &&  
      obj !== null &&  
      typeof obj.type === "string" &&  
      typeof obj.origin === "string" &&  
      typeof obj.data === "object" &&  
      obj.data !== null &&  
      typeof obj.data.appUrl === "string" &&  
      typeof obj.data.ethAccount === "string" &&  
      (typeof obj.data.messageType === "string" || obj.data.messageType === undefined) &&  
      typeof obj.data.message === "string"  
    );  
  }

  export type SignResponseMessage = {
    success: boolean,
    signature: string
  }


export  type EIP712SignReqMessage = {
    type: string,
    origin: string,
    data: {
        appUrl: string,
        ethAccount: string,
        domain: any,
        types: any,
        primaryType: string,
        message: any,
    }
}

// EIP712SignReqMessage类型检查,每个字段类型也要检查
export function isEIP712SignReqMessage(obj: any): obj is EIP712SignReqMessage {  
    return (  
      typeof obj === "object" &&  
      obj !== null &&  
      typeof obj.type === "string" &&  
      typeof obj.origin === "string" &&  
      typeof obj.data === "object" &&  
      obj.data !== null &&  
      typeof obj.data.ethAccount === "string" &&  
      typeof obj.data.domain === "object" &&  
      obj.data.domain !== null &&  
      typeof obj.data.types === "object" &&  
      obj.data.types !== null &&  
      typeof obj.data.primaryType === "string" &&  
      typeof obj.data.message === "object" &&  
      obj.data.message !== null  
    );  
  }

export  type SendMessage<T> = {
    type: string,
    data: T
}

export type ResponseMessage<T> = {
    type: string,
    data: T,
}

export interface IAICallConfig {
  appId: string ;
  themeAuthor: string ;
  theme: string ;
  service: string ;
  headers?: Record<string, string> ;
  path?: string ;
  model?: string ;
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