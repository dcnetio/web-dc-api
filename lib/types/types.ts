import { Multiaddr } from "@multiformats/multiaddr";
import type { DCClient } from "../dcapi";
import { PublicKey } from "@libp2p/interface";
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
  client?: DCClient | undefined;
  nodeAddr?: Multiaddr | undefined;
}

export interface SignHandler {
  sign(payload: Uint8Array): Promise<Uint8Array>;
  publickey: PublicKey;
}
