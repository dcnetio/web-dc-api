import type { Multiaddr } from "@multiformats/multiaddr";
import { AccountKey, DCConnectInfo } from "../types/types";
import { ThemeClient } from "./client";
import { DcUtil } from "../dcutil";
import { ChainUtil } from "../chain";
import { sha256, uint32ToLittleEndianBytes } from "../util/utils";

// 错误定义
export class ThemeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThemeError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new ThemeError("no dc peer connected"),
  ErrKeyNotValid: new ThemeError("key not valid"),
  // nodeAddr is null
  ErrNodeAddrIsNull: new ThemeError("nodeAddr is null"),
  // privKey is null
  ErrPrivKeyIsNull: new ThemeError("privKey is null"),
  // chainUtil is null
  ErrChainUtilIsNull: new ThemeError("chainUtil is null"),
  // account privatekey sign is null
  ErrAccountPrivateSignIsNull: new ThemeError("account privatekey sign is null"),
};

export class ThemeManager{
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

  async getCacheValue(key: string): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    //解析出peerid与cachekey
    const pkeys = key.split("/");
    if (pkeys.length != 2) {
      console.log("key format error!");
      return [null, Errors.ErrKeyNotValid];
    }
    if (!this.connectedDc.client) {
      console.log("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const peerid = pkeys[0];
    const cacheKey = pkeys[1];
    try {
      let nodeAddr: Multiaddr | undefined;
      if (this.connectedDc.nodeAddr) {
        const connectedPeerId = this.connectedDc.nodeAddr.getPeerId() || "";
        if (connectedPeerId && connectedPeerId === peerid) {
          // 同一个节点
          nodeAddr = this.connectedDc.nodeAddr;
        } else {
          // 不是同一个节点
          nodeAddr = await this.dc?._getNodeAddr(peerid);
        }
      } else {
        nodeAddr = await this.dc?._getNodeAddr(peerid);
      }
      if (!nodeAddr) {
        console.log("nodeAddr is null");
        return [null, Errors.ErrNodeAddrIsNull];
      }

      const themeClient = new ThemeClient(this.connectedDc.client);
      const reply = await themeClient.getCacheValue(nodeAddr, cacheKey);
      console.log("GetCacheValueReply reply:", reply);
      return [reply, null];
    } catch (err) {
      console.log("getCacheValue error:", err);
      return [null, err];
    }
  }

  // 设置缓存值
  setCacheKey = async (value: string) : Promise<[string | null, Error | null]> => {
    if (!this.connectedDc.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.log("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if(!this.accountKey) {
      console.log("accountKey is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    //获取最新区块高度
    const blockHeight = await this.chainUtil.getBlockHeight();
    const expire = (blockHeight ? blockHeight : 0) + 10000;
    const valueArray = new TextEncoder().encode(value);
    const hashValue = await sha256(valueArray);

    // 将 Blockheight 和 Expire 转换为小端字节数组
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const expValue: Uint8Array = uint32ToLittleEndianBytes(expire);

    // 将 expValue 和 hValue 连接起来
    const preSignPart1 = new Uint8Array(expValue.length + hValue.length);
    preSignPart1.set(expValue, 0);
    preSignPart1.set(hValue, expValue.length);

    // 将 hashValue 追加到 preSignPart1 之后
    const preSign = new Uint8Array(preSignPart1.length + hashValue.length);
    preSign.set(preSignPart1, 0);
    preSign.set(hashValue, preSignPart1.length);

    const signature = this.accountKey.sign(preSign);
    const themeClient = new ThemeClient(this.connectedDc.client);
    const setCacheValueReply = await themeClient.setCacheKey(
      value,
      blockHeight ? blockHeight : 0,
      expire,
      signature
    );
    console.log("SetCacheKey reply:", setCacheValueReply);
    return [setCacheValueReply, null];
  };
}
