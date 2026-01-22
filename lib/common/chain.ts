/**
 * 区块链相关的方法
 */

import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { ApiPromise, WsProvider } from "@polkadot/api";

import { isUser, sha256, hexToAscii } from "../util/utils";
import { IAppInfo, User, PeerStatus } from "./types/types";

import { base32 } from "multiformats/bases/base32";
import * as buffer from "buffer/";
import { Ed25519PubKey } from "./dc-key/ed25519";
const { Buffer } = buffer;

const _hexMap: Record<string, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  a: 10, b: 11, c: 12, d: 13, e: 14, f: 15,
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
};

function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
  
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const high = _hexMap[hex[i * 2]];
    const low = _hexMap[hex[i * 2 + 1]];
    if (high === undefined || low === undefined) {
      throw new Error("hexToBytes: received invalid hex characters");
    }
    array[i] = (high << 4) | low;
  }
  return array;
}

// 错误定义
export class ChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainError";
  }
}
export const Errors = {
  ErrWalletAccountStorageIsNull: new ChainError("walletAccountStorage is null"),
  ErrParentWalletAccountStorageIsNull: new ChainError(
    "parentWalletAccountStorage is null"
  ),
  ErrUserInfoIsNull: new ChainError("userInfo is null"),
  ErrWalletAccountStorageIsNotUser: new ChainError(
    "walletAccountStorage is not user"
  ),
};
export interface StoreunitInfo {
  size: number;
  utype: number;
  peers: Set<string>;
  users: Set<string>;
  mbusers: Set<string>; //base32 编码的用户
  logs: Set<string>;
}

export class ChainUtil {
  dcchainapi: ApiPromise | undefined;
  private blockChainAddr: string = "";
  private isReconnecting: boolean = false;

  // 连接链节点
  create = async (blockChainAddr: string) => {
    this.blockChainAddr = blockChainAddr;
    const chainProvider = new WsProvider(blockChainAddr);

    chainProvider.on("connected", () => {
      console.log("Chain connected to " + blockChainAddr);
    });
    chainProvider.on("disconnected", () => {
      console.warn("Chain disconnected from " + blockChainAddr);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    });
    chainProvider.on("error", (err) => {
      console.error("Chain connection error:", err);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    });

    try {
      this.dcchainapi = await ApiPromise.create({
        provider: chainProvider,
        throwOnConnect: true,
        throwOnUnknown: true,
      });
    } catch (e) {
      console.error("dcchainapi init exception:", e);
      try {
        await chainProvider.disconnect();
      } catch (ignore) {}
      return false;
    }

    if (!this.dcchainapi) {
      console.error("dcchainapi init failed");
      return false;
    }

    return true;
  };

  // 重连操作
  reconnect = async () => {
    if (this.isReconnecting) return;
    this.isReconnecting = true;

    console.log("Attempting to reconnect to chain...");
    if (this.dcchainapi) {
      try {
        await this.dcchainapi.disconnect();
      } catch (ignore) {}
      this.dcchainapi = undefined;
    }

    const doReconnect = async () => {
      if (!this.blockChainAddr) {
        this.isReconnecting = false;
        return;
      }

      const success = await this.create(this.blockChainAddr);
      if (success) {
        console.log("Reconnection successful");
        this.isReconnecting = false;
        // 再次检查连接状态，防止在重连过程中发生的断线被忽略
        if (this.dcchainapi && !this.dcchainapi.isConnected) {
          this.reconnect();
        }
      } else {
        console.warn("Reconnection failed, retrying in 5s...");
        setTimeout(doReconnect, 5000);
      }
    };

    if (this.blockChainAddr) {
      // 避免立即重连造成的频繁尝试
      setTimeout(doReconnect, 3000);
    } else {
      this.isReconnecting = false;
    }
  };

  // 获取区块高度
  async getBlockHeight(): Promise<number> {
    const lastBlock = await this.dcchainapi?.rpc.chain.getBlock();
    const blockHeight = lastBlock?.block.header.number.toNumber();
    return blockHeight || 0;
  }
  // 获取用户钱包信息
  async getUserInfoWithAccount(account: string): Promise<User> {
    const walletAccountStorage = await (
      this.dcchainapi?.query as any
    ).dcNode.walletAccountStorage(account);
    if (!walletAccountStorage) {
      throw Errors.ErrWalletAccountStorageIsNull;
    }
    let userInfo = walletAccountStorage.toJSON();
    if (userInfo === null) {
      throw Errors.ErrUserInfoIsNull;
    }

    if (!isUser(userInfo)) {
      throw Errors.ErrWalletAccountStorageIsNotUser;
    }
    if (userInfo?.parentAccount !== account) {
      const parentWalletAccountStorage = await (
        this.dcchainapi?.query as any
      ).dcNode.walletAccountStorage(userInfo?.parentAccount);
      if (!parentWalletAccountStorage) {
        throw Errors.ErrParentWalletAccountStorageIsNull;
      }
      const parentUserInfo = parentWalletAccountStorage?.toJSON();
      if (!parentUserInfo || !isUser(parentUserInfo)) {
        return userInfo;
      }
      userInfo.requestPeers = parentUserInfo.requestPeers;
      if (userInfo.peers?.length == 0) {
        //If the sub-account does not have account backup node information (this will happen if the sub-account is not bound to an nft account), the backup node information of the parent account will be obtained.
        userInfo.peers = parentUserInfo.peers;
      }
      userInfo.subscribeSpace = parentUserInfo.subscribeSpace;
      userInfo.usedSpace = parentUserInfo.usedSpace;
      userInfo.expireNumber = parentUserInfo.expireNumber;
      userInfo.purchaseNumber = parentUserInfo.purchaseNumber;
      // 冻结不为0则更新
      if (parentUserInfo.commentFrozenStatus != 0) {
        userInfo.commentFrozenStatus = parentUserInfo.commentFrozenStatus;
      }
      if (parentUserInfo.spamFrozenStatus != 0) {
        userInfo.spamFrozenStatus = parentUserInfo.spamFrozenStatus;
      }
    }
    //peers 进行统一处理
    for (let i = 0; i < userInfo.peers.length; i++) {
      userInfo.peers[i] = hexToAscii(userInfo.peers[i]!);
    }
    for (let i = 0; i < userInfo.requestPeers.length; i++) {
      userInfo.requestPeers[i] = hexToAscii(userInfo.requestPeers[i]!);
    }
    if (userInfo.dbConfig.length <= 2) {
      userInfo.dbConfig = ""; // 如果 dbConfig 为空，则设置为 ""
    } else {
      userInfo.dbConfigRaw = hexToBytes(userInfo.dbConfig.slice(2));
    }
    if (userInfo.encNftAccount.length <= 2) {
      userInfo.encNftAccount = "";
    }
    // 对 userInfo.peers 按与用户公钥的 XOR 距离进行排序
    if (userInfo.peers && Array.isArray(userInfo.peers) && account) {
      userInfo.peers.sort((peerA, peerB) => {
        // 将 peer 字符串转换为 Uint8Array (如果需要)
        const peerABytes =
          typeof peerA === "string" ? new TextEncoder().encode(peerA) : peerA;
        const peerBBytes =
          typeof peerB === "string" ? new TextEncoder().encode(peerB) : peerB;
        //account 是一个0x开头的16进制字符串转换为 Uint8Array
        const accountBytes = hexToBytes(account.slice(2));
        // 计算每个 peer 与公钥的 XOR 距离
        const distance1 = this.calculateDistance(peerABytes, accountBytes);
        const distance2 = this.calculateDistance(peerBBytes, accountBytes);
        if (distance1 < distance2) return -1;
        if (distance1 > distance2) return 1;
        return 0;
      });
    }
    return userInfo;
  }
  // 获取用户钱包信息
  async getUserInfoWithNftHex(nftHexAccount: string): Promise<User> {
    const walletAccount = await (
      this.dcchainapi?.query as any
    ).dcNode.nftToWalletAccount(nftHexAccount);
    if (!walletAccount || !walletAccount.toString()) {
      throw new Error("walletAccount is null");
    }
    return await this.getUserInfoWithAccount(
      walletAccount.toString()
    );
   
  }

  /**
   * 计算两个字节数组之间的XOR距离
   * @param key1 第一个字节数组
   * @param key2 第二个字节数组
   * @returns 两个键之间的XOR距离，以BigInt表示
   */
  calculateDistance(key1: Uint8Array, key2: Uint8Array): bigint {
    // 使用两个字节数组的最小长度
    const minLen = Math.min(key1.length, key2.length);

    // 创建结果数组存储XOR结果
    const result = new Uint8Array(minLen);

    // 按字节计算XOR距离
    for (let i = 0; i < minLen; i++) {
      result[i] = key1[i]! ^ key2[i]!;
    }

    // 将结果转换为BigInt用于比较
    // 首先转换为十六进制字符串以处理大数值
    let hexString = "0x";
    for (let i = 0; i < result.length; i++) {
      hexString += result[i]!.toString(16).padStart(2, "0");
    }

    // 如果结果为空（全零），返回0n
    if (hexString === "0x") {
      return BigInt(0);
    }

    return BigInt(hexString);
  }

  // 获取用户钱包信息
  async getUserInfoWithNft(nftAccount: string): Promise<User | null> {
    const accountBytes = new TextEncoder().encode(nftAccount);
    const accountHash = await sha256(accountBytes);

    const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
    return await this.getUserInfoWithNftHex(nftHexAccount);
  
  }

  async getUserWalletAccount(nftAccount: string): Promise<string | null> {
    const accountBytes = new TextEncoder().encode(nftAccount);
    const accountHash = await sha256(accountBytes);
    const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
    const walletAccount = await (
      this.dcchainapi?.query as any
    ).dcNode.nftToWalletAccount(nftHexAccount);
    if (!walletAccount || !walletAccount.toString()) {
      throw new Error("walletAccount is null");
    }
    return walletAccount.toString();
  }

  // 获取所有文件存储节点
  getObjNodes = async (cid: string): Promise<string[] | undefined> => {
    const fileInfo =
      (await (this.dcchainapi?.query as any).dcNode.files(cid)) || null;
    const fileInfoJSON = fileInfo?.toJSON();
    if (
      !fileInfoJSON ||
      typeof fileInfoJSON !== "object" ||
      (fileInfoJSON as { peers: string[] }).peers.length == 0
    ) {
      return;
    }
    return (fileInfoJSON as { peers: string[] }).peers || [];

  };

  // 获取用户节点列表
  getAccountPeers = async (account: Uint8Array): Promise<string[] | null> => {
    try {
      const hexAccount = "0x" + Buffer.from(account).toString("hex");
      const userInfo = await this.getUserInfoWithAccount(hexAccount);
      if (!userInfo || !isUser(userInfo)) {
        return null;
      }
      return userInfo.peers;

    } catch (error) {
      console.error("getAccountPeers error:", error);
      return null;
    }
  };

  // 链上查询节点信息
  // getDcNodeAddr = async (peerid: string) => {
  //   const peerInfo = await (this.dcchainapi?.query as any).dcNode.peers(peerid);
  //   const peerInfoJson = peerInfo?.toJSON();
  //   if (
  //     !peerInfoJson ||
  //     typeof peerInfoJson !== "object" ||
  //     (peerInfoJson as { ipAddress: string }).ipAddress == ""
  //   ) {
  //     console.log("no ip address found for peer: ", peerid);
  //     return;
  //   }
  //   let nodeAddr = Buffer.from(
  //     (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
  //     "hex"
  //   ).toString("utf8");
  //   let addrParts = nodeAddr.split(",");
  //   nodeAddr = addrParts[0];
  //   //节点ws监听端口号在原来的tcp监听的基础上加10
  //   let newNodeAddr = "";
  //   const parts = nodeAddr.split("/");
  //   for (let i = 0; i < parts.length; i++) {
  //     if (parts[i] == "tcp" && i < parts.length - 1) {
  //       const newPort = parseInt(parts[i + 1]) + 10;
  //       newNodeAddr += parts[i] + "/" + newPort + "/";
  //       i++;
  //     } else if (parts[i] == "p2p") {
  //       newNodeAddr += "ws/" + parts[i] + "/";
  //     } else {
  //       newNodeAddr += parts[i] + "/";
  //     }
  //   }
  //   const addr = multiaddr(newNodeAddr);
  //   console.log("newNodeAddr", newNodeAddr);
  //   return addr;
  // };
  // 链上查询节点webrtc direct的地址信息,
  // peerid: 节点的peerid
  // 直接连接节点的地址
  getDcNodeWebrtcDirectAddr = async (
    peerid: string
  ): Promise<[Multiaddr | null, PeerStatus]> => {
    const peerInfo = await (this.dcchainapi?.query as any).dcNode.peers(peerid);
    const peerInfoJson = peerInfo?.toJSON();
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== "object" ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ""
    ) {
      console.error("no ip address found for peer: ", peerid);
      return [null, PeerStatus.PeerStatusOffline];
    }
    let nodeAddr = Buffer.from(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
      "hex"
    ).toString("utf8");
    let addrParts = nodeAddr.split(",");
    if (addrParts.length < 2) {
      return [null, PeerStatus.PeerStatusOffline];
    }
    const addr = multiaddr(addrParts[1]);
    const peerStatus =
      (peerInfoJson as { status: number }).status ||
      PeerStatus.PeerStatusOffline;
    return [addr, peerStatus];
  };

  // 链上查询节点列表
  getDcNodeList = async (): Promise<string[]> => {
    const peerList = await (
      this.dcchainapi?.query as any
    ).dcNode.onlineNodesAddress();
    const peerListJson = peerList?.toJSON();
    if (!peerListJson || typeof peerListJson !== "object") {
      console.error("no peer list found");
      return [];
    }
    let peers: string[] = [];
    if (Array.isArray(peerListJson)) {
      for (let i = 0; i < peerListJson.length; i++) {
        const peer = peerListJson[i];
        if (typeof peer === "string") {
          const peerJson = Buffer.from(peer.slice(2), "hex").toString("utf8");
          peers = peers.concat(peerJson);
        }
      }
    }
    return peers;
  };

  objectState = async (
    cid: string
  ): Promise<[StoreunitInfo | null, Error | null]> => {
    if (!this.dcchainapi) {
      return [null, new Error("dcchainapi is not initialized")];
    }

    const fileInfo = await (this.dcchainapi.query as any).dcNode.files(cid);

    if (!fileInfo || fileInfo.isEmpty) {
      return [null, new Error(`File with CID ${cid} not found`)];
    }

    const data = fileInfo.toJSON();

    if (!data) {
      return [null, new Error(`File with CID ${cid} not found`)];
    }
    // 构造返回数据
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return [
        {
          size: Number((data as any)["fileSize"] || 0),
          utype: Number((data as any)["fileType"] || 0),
          peers: new Set(
            Array.isArray((data as any)["peers"])
              ? (data as any)["peers"].map((peer: any) => {
                  try {
                    return hexToAscii(String(peer));
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(peer); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
          users: new Set(
            Array.isArray((data as any)["users"])
              ? (data as any)["users"].map(String)
              : []
          ),
          mbusers: new Set(
            Array.isArray((data as any)["users"])
              ? (data as any)["users"].map((user: any) => {
                  try {
                    const userBytes = hexToBytes(user.slice(2));
                    return base32.encode(userBytes);
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(user); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
          logs: new Set(
            Array.isArray((data as any)["dbLog"])
              ? (data as any)["dbLog"].map((log: any) => {
                  try {
                    return hexToAscii(String(log));
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(log); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
        },
        null,
      ];
    }
    return [null, new Error(`File with CID ${cid} not found`)];
  };

  ifEnoughUserSpace = async (
    pubkeyRaw: Uint8Array,
    needSize?: number
  ): Promise<boolean> => {
    const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
    // 获取用户存储空间
    const userInfo = await this.getUserInfoWithAccount(hexAccount);
    if (!userInfo) {
      throw new Error("get user info error");
    }

    // 用户冻结
    if (userInfo.commentFrozenStatus != 0 || userInfo.spamFrozenStatus != 0) {
      return false;
    }

    // 过期高度判断
    const blockHeight = (await this.getBlockHeight()) || 0;
    if (userInfo.expireNumber > 0 && userInfo.expireNumber < blockHeight) {
      return false;
    }

    // 用户存储空间判断
    const needSizeNumber = needSize || 1024 * 1024; // 1M
    if (userInfo.subscribeSpace - userInfo.usedSpace < needSizeNumber) {
      return false;
    }

    return true;
  };
  refreshUserInfo = async (pubkeyRaw: Uint8Array): Promise<User> => {
    const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
    return await this.getUserInfoWithAccount(hexAccount);
  };

  // 获取应用信息
  getAPPInfo = async (appId: string): Promise<IAppInfo> => {
    if (!this.dcchainapi || !this.dcchainapi.isReady) {
      throw new Error("dcchainapi is not initialized");
    }
    const appIdBytes = new TextEncoder().encode(appId);
    const appIdHex = "0x" + Buffer.from(appIdBytes).toString("hex");
    const appInfoStr = await (this.dcchainapi?.query as any).dcNode.appsInfo(
      appIdHex
    );
    if (!appInfoStr || appInfoStr.isEmpty) {
      throw new Error(`App info for ${appId} not found`);
    }
    const appJsonInfo = appInfoStr.toJSON() as any;
    if (!appJsonInfo || typeof appJsonInfo !== "object") {
      throw new Error(`App info for ${appId} is not valid`);
    }
    //将 ownerAccount 转换为 Ed25519PubKey
    const ownerBytes = hexToBytes(appJsonInfo?.ownerAccount.slice(2));
    const owner = new Ed25519PubKey(ownerBytes);
    const rewarder = appJsonInfo?.rewardedStash;

    let domain = "";
    if (appJsonInfo?.domain && appJsonInfo?.domain.length > 0) {
      const domainBytes = hexToBytes(appJsonInfo?.domain.slice(2));
      domain = new TextDecoder().decode(domainBytes).toString();
    }

    let fid = "";
    if (appJsonInfo?.fileId && appJsonInfo?.fileId.length > 0) {
      const fidBytes = hexToBytes(appJsonInfo?.fileId.slice(2));
      fid = new TextDecoder().decode(fidBytes).toString();
    }
    const appInfo: IAppInfo = {
      appId: appId,
      domain: domain,
      owner: owner.string(),
      rewarder: rewarder,
      fid: fid,
    };
    return appInfo;
  };
}
