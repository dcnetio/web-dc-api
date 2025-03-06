import { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
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

export interface AccountKey {
  sign: (payload: Uint8Array) => Uint8Array;
  getPubkeyRaw: () => Uint8Array;
  // getPubkeyString: () => string;
}