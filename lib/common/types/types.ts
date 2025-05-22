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
  id: string;
  name: string;
  icon?: string;
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
  blockheight: number;  // 设置时的区块高度
  isAIModel: number;    // 0: AI模型 1: MCPServer
  apiType: number;      // 当type 为0时起作用,表示模型的接口类型,如0:anthropic,1:openai 2:ollama 3:googleai 4:azureopenai
  authorization: string;
  endpoint: string;
  organization: string; // 组织名称或ID (fixed spelling from 'Orgnization')
  apiVersion: string;   // api版本号
  model: string;        // 模型
  remark: string;
}