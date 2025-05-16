import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../chain";
import { DcUtil } from "../dcutil";
import { DCConnectInfo, User } from "../types/types";
import { AccountClient } from "./client";
import { uint32ToLittleEndianBytes } from "../util/utils";
import { DCContext } from "lib";

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
  context: DCContext;
  constructor(context: DCContext) {
    this.connectedDc = context.connectedDc;
    this.dc = context.dcutil;
    this.chainUtil = context.dcChain;
    this.context = context;
  }

  // 获取用户备用节点
  getAccountNodeAddr = async (): Promise<[Multiaddr | null, Error | null]> => {
    if (!this.connectedDc.client) {
      console.error("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if(!this.context) {
      console.error("context is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    const pubkeyRaw = this.context.getPubkeyRaw();
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
      console.error("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    // 从链上获取
    const userInfo = await this.chainUtil.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return [userInfo, null];
  };
  bindAccessPeerToUser = async (peerAddr: Multiaddr): Promise< [boolean | null, Error | null] > => {
    if (!this.connectedDc.client) {
      console.error("dcClient is null");
      return [false, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if(!this.context) {
      console.error("context is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    const peerId = peerAddr.getPeerId();
    if(!peerId) {
      console.error("peerId is null");
      return [null, Errors.ErrNoAccountPeerConnected];
    }
    // 绑定节点
    const blockHeight = await this.chainUtil.getBlockHeight();
    const headerValue = new TextEncoder().encode("add_request_peer_id_to_user");
    const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
    const peerIdValue = new TextEncoder().encode(peerId.toString());

    const messageParts = new Uint8Array([
      ...headerValue,
      ...bhValue,
      ...peerIdValue,
    ]);
    const signature = await this.context.sign(messageParts);
    const accountClient = new AccountClient(
      this.connectedDc.client,
    );
    const bindResult = await accountClient.bindAccessPeerToUser(
      blockHeight ? blockHeight : 0, 
      signature
    );
    console.log("bindAccessPeerToUser bindResult:", bindResult);
    return [true, null];
  }
}
