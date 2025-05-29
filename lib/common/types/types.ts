import { Multiaddr } from "@multiformats/multiaddr";
import { PublicKey } from "@libp2p/interface";
import type { Client } from "../dcapi";
import { Ed25519PubKey } from "../dc-key/ed25519";
export interface User {
  callMinusNumber: number;
  commentFrozenStatus: number;
  commentReportAmount: number;
  commentReportNumber: number;
  dbConfig: string;
  dbUpdateNumber: number;
  encNftAccount: string;
  expireNumber: number;
  loginNumber: number;
  nftUpdateNumber: number;
  offchainOptimes: number;
  offchainSpace: number;
  parentAccount: string;
  peers: Array<string>;
  purchaseNumber: number;
  requestPeers: Array<string>;
  spamFrozenStatus: number;
  spamReportAmount: number;
  spamReportNumber: number;
  subscribePrice: string;
  subscribeSpace: number;
  usedSpace: number;
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