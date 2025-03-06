import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../chain";
import { DcUtil } from "../dcutil";
import { AccountKey, DCConnectInfo, User } from "../types/types";

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
  // account privatekey sign is null
  ErrAccountPrivateSignIsNull: new AccountError("account privatekey sign is null"),
};
export class AccountManager {
  dc: DcUtil;
  chainUtil: ChainUtil | undefined;
  connectedDc: DCConnectInfo = {};
  accountKey : AccountKey | undefined;
  constructor(connectedDc: DCConnectInfo, dc: DcUtil, chainUtil?: ChainUtil, accPrivateSign?: AccountKey) {
    this.connectedDc = connectedDc;
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.accountKey = accPrivateSign;
  }

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
    // 获取用户备用节点
    if(!this.accountKey) {
      console.log("accountKey is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    const pubkeyRaw = this.accountKey.getPubkeyRaw();
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
  // 获取用户信息
  getUserInfoWithNft = async (nftAccount: string): Promise< [User | null, Error | null] > => {
    if (!this.connectedDc.client) {
      console.log("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.log("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    // 从链上获取
    const userInfo = await this.chainUtil.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return [userInfo, null];
  };
}
