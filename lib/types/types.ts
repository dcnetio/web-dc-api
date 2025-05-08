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
  client2?: Client | undefined;
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