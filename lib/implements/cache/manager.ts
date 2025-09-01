import type { Multiaddr } from "@multiformats/multiaddr";
import { DCConnectInfo } from "../../common/types/types";
import { CacheClient } from "./client";
import { DcUtil } from "../../common/dcutil";
import { ChainUtil } from "../../common/chain";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { DCContext } from "../../../lib/interfaces/DCContext";

// 错误定义
export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new CacheError("no dc peer connected"),
  ErrKeyNotValid: new CacheError("key not valid"),
  // nodeAddr is null
  ErrNodeAddrIsNull: new CacheError("nodeAddr is null"),
  // chainUtil is null
  ErrChainUtilIsNull: new CacheError("chainUtil is null"),
  // account privatekey sign is null
  ErrAccountPrivateSignIsNull: new CacheError("account privatekey sign is null"),
};

export class CacheManager{
  dc: DcUtil;
  chainUtil: ChainUtil | undefined;
  context : DCContext | undefined;
  constructor( dc: DcUtil, chainUtil?: ChainUtil, context?: DCContext) {
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  async getCacheValue(key: string, peerAddr?: Multiaddr): Promise<[string | null, Error | null]> {
    if (!this.context?.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    //解析出peerid与cachekey
    const pkeys = key.split("/");
    if (pkeys.length != 2) {
      console.log("key format error!");
      return [null, Errors.ErrKeyNotValid];
    }
    if (!this.context?.connectedDc.client) {
      console.log("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const peerid = pkeys[0]!;
    const cacheKey = pkeys[1]!;
    try {
      let nodeAddr: Multiaddr | undefined;
      if (this.context?.connectedDc.nodeAddr) {
        const connectedPeerId = this.context.connectedDc.nodeAddr.getPeerId() || "";
        if (connectedPeerId && connectedPeerId === peerid) {
          // 同一个节点
          nodeAddr = this.context.connectedDc.nodeAddr;
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

      const cacheClient = new CacheClient(this.context!,this.dc,this.context.connectedDc.client);
      const reply = await cacheClient.getCacheValue(nodeAddr, cacheKey);
      console.log("GetCacheValueReply reply:", reply);
      return [reply, null];
    } catch (err) {
      console.log("getCacheValue error:", err);
      return [null, err as Error];
    }
  }

  // 设置缓存值
  setCacheKey = async (value: string, expire: number, peerAddr?: Multiaddr) : Promise<[string | null, Error | null]> => {
    if (!this.context?.AccountBackupDc.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.log("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if(!this.context) {
      console.log("context is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    //获取最新区块高度
    const blockHeight = await this.chainUtil.getBlockHeight();
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

    const signature = await  this.context.sign(preSign);
    const cacheClient = new CacheClient(this.context,this.dc,this.context?.AccountBackupDc.client);
    const setCacheValueReply = await cacheClient.setCacheKey(
      value,
      blockHeight ? blockHeight : 0,
      expire,
      signature
    );
    console.log("SetCacheKey reply:", setCacheValueReply);
    return [setCacheValueReply, null];
  };
}
