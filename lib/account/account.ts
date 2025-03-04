import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../chain";
import { KeyManager } from "../dc-key/keyManager";
import { DcUtil } from "../dcutil";
import { DCConnectInfo } from "../types/types";
import type { AccountClient } from "./client";

// 错误定义
export class AccountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new AccountError("no dc peer connected"),
  ErrNodeAddrIsNull: new AccountError("nodeAddr is null"),
  ErrChainUtilIsNull: new AccountError("chainUtil is null"),
  ErrAccountLogin: new AccountError("account login error"),
  ErrNoAccountPeerConnected: new AccountError("no account peer connected"),
  ErrNoAccountToken: new AccountError("no account token"),
  ErrAccountClientIsNull: new AccountError("account client is null"),
};
export class AccountManager {
  dc: DcUtil;
  chainUtil: ChainUtil | undefined;
  connectedDc: DCConnectInfo = {};
  accountClient: AccountClient | undefined;
  constructor(
    connectedDc: DCConnectInfo,
    dc: DcUtil,
    chainUtil?: ChainUtil,
    accountClient?: AccountClient
  ) {
    this.connectedDc = connectedDc;
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.accountClient = accountClient;
  }

  // 登陆
  accountLogin = async (
    nftAccount: string,
    password: string,
    safecode: string,
    appName: string
  ) => {
    //登录
    if (!this.connectedDc.client) {
      console.log("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.connectedDc.nodeAddr) {
      console.log("nodeAddr is null");
      return [null, Errors.ErrNodeAddrIsNull];
    }
    if (!this.chainUtil) {
      console.log("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if (!this.accountClient) {
      console.log("accountClient is null");
      return [null, Errors.ErrAccountClientIsNull];
    }

    const bool = await this.accountClient.accountLogin(
      nftAccount,
      password,
      safecode,
      appName
    );
    if (!bool) {
      return [null, Errors.ErrAccountLogin];
    }
    // 获取token
    const token = await this.accountClient.getToken();
    if (!token) {
      return [null, Errors.ErrNoAccountToken];
    }
    return [true, null];
  };

  // 获取用户备用节点
  getAccountNodeAddr = async (): Promise<[Multiaddr | null, Error | null]> => {
    if (!this.connectedDc.client) {
      console.log("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.log("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if (!this.accountClient) {
      console.log("accountClient is null");
      return [null, Errors.ErrAccountClientIsNull];
    }
    // 获取用户备用节点
    const pubkeyRaw = this.accountClient.getPubkeyRaw();
    const peerAddrs = await this.chainUtil.getAccountPeers(pubkeyRaw);
    if (peerAddrs && peerAddrs.length > 0) {
      // 连接备用节点
      const nodeAddr = await this.dc?._connectPeers(peerAddrs);
      console.log("_connectNodeAddrs nodeAddr:", nodeAddr);
      if (nodeAddr) {
        return [nodeAddr, null];
      }
    }
    return [null, Errors.ErrNoAccountPeerConnected];
  };
}
