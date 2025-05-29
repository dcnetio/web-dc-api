/**
 * 区块链相关的方法
 */

import { multiaddr } from "@multiformats/multiaddr";
import { ApiPromise, WsProvider } from "@polkadot/api";

import { isUser, sha256,hexToAscii } from "../util/utils";
import { User } from "./types/types";

import { hexToBytes } from "@noble/curves/abstract/utils";
import { base32 } from "multiformats/bases/base32";
import * as buffer from "buffer/";
import { WalletManager } from "lib/implements/wallet/manager";
const { Buffer } = buffer;

export interface StoreunitInfo {  
  size: number;  
  utype: number;  
  peers: Set<string>;  
  users: Set<string>;  
  mbusers: Set<string>;//base32 编码的用户
  logs: Set<string>;  
}  



export class ChainUtil {
  dcchainapi: ApiPromise | undefined;
  // 连接链节点
  create = async (blockChainAddr) => {
    const chainProvider = new WsProvider(blockChainAddr);
    this.dcchainapi = await ApiPromise.create({
      provider: chainProvider,
      throwOnConnect: true,
      throwOnUnknown: true,
    });
    if (!this.dcchainapi) {
      console.error("dcchainapi init failed");
      return false;
    }
    return true;
  };

  // 获取区块高度
  async getBlockHeight() {
    const lastBlock = await this.dcchainapi?.rpc.chain.getBlock();
    const blockHeight = lastBlock?.block.header.number.toNumber();
    return blockHeight;
  }
  // 获取用户钱包信息
  async getUserInfoWithAccount(account: string): Promise<User> {
    const walletAccountStorage =
      await this.dcchainapi?.query.dcNode.walletAccountStorage(account);
    if (!walletAccountStorage) {
      throw new Error("walletAccountStorage is null");
    }
    let userInfo = walletAccountStorage.toJSON();
    if (userInfo === null) {
      throw new Error("userInfo is null");
    }
    if (!isUser(userInfo)) {
      throw new Error("walletAccountStorage is not user");
    }
    if (userInfo?.parentAccount !== account.toString()) {
      const parentWalletAccountStorage =
        await this.dcchainapi?.query.dcNode.walletAccountStorage(
          userInfo?.parentAccount
        );
      if (!parentWalletAccountStorage) {
        throw new Error("parentWalletAccountStorage is null");
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
      if(parentUserInfo.commentFrozenStatus != 0){
        userInfo.commentFrozenStatus = parentUserInfo.commentFrozenStatus;
      }
      if(parentUserInfo.spamFrozenStatus != 0){
        userInfo.spamFrozenStatus = parentUserInfo.spamFrozenStatus;
      }

    }
     //peers 进行统一处理
      for (let i = 0; i < userInfo.peers.length; i++) {
        userInfo.peers[i] = hexToAscii(userInfo.peers[i]);
      }
      for (let i = 0; i < userInfo.requestPeers.length; i++) {
        userInfo.requestPeers[i] = hexToAscii(userInfo.requestPeers[i]);
      }
   // 对 userInfo.peers 按与用户公钥的 XOR 距离进行排序
    if (userInfo.peers && Array.isArray(userInfo.peers) && account) {
        userInfo.peers.sort((peerA, peerB) => {
        // 将 peer 字符串转换为 Uint8Array (如果需要)
        const peerABytes = typeof peerA === 'string' ? new TextEncoder().encode(peerA) : peerA;
        const peerBBytes = typeof peerB === 'string' ? new TextEncoder().encode(peerB) : peerB;
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
    const walletAccount =
      await this.dcchainapi?.query.dcNode.nftToWalletAccount(nftHexAccount);
    console.log("=========walletAccount", walletAccount);
    if (!walletAccount.toString()) {
      throw new Error("walletAccount is null");
    }
    const userInfo = await this.getUserInfoWithAccount(
      walletAccount.toString()
    );
    return userInfo;
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
    result[i] = key1[i] ^ key2[i];
  }
  
  // 将结果转换为BigInt用于比较
  // 首先转换为十六进制字符串以处理大数值
  let hexString = '0x';
  for (let i = 0; i < result.length; i++) {
    hexString += result[i].toString(16).padStart(2, '0');
  }
  
  // 如果结果为空（全零），返回0n
  if (hexString === '0x') {
    return BigInt(0);
  }
  
  return BigInt(hexString);
}

  // 获取用户钱包信息
  async getUserInfoWithNft(nftAccount: string): Promise<User | null> {
    console.log("=========nftAccount", nftAccount);
    const accountBytes = new TextEncoder().encode(nftAccount);
    const accountHash = await sha256(accountBytes);

    const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
    const userInfo = await this.getUserInfoWithNftHex(nftHexAccount);
    return userInfo;
  }

  // 获取所有文件存储节点
  getObjNodes = async (cid: string): Promise<string[] | undefined> => {
    const fileInfo = (await this.dcchainapi?.query.dcNode.files(cid)) || null;
    console.log("new first 1");
    const fileInfoJSON = fileInfo?.toJSON();

    console.log("fileInfoJSON", fileInfoJSON);
    if (
      !fileInfoJSON ||
      typeof fileInfoJSON !== "object" ||
      (fileInfoJSON as { peers: string[] }).peers.length == 0
    ) {
      console.error("no peers found for file: ", cid);
      return;
    }
    const peers = (fileInfoJSON as { peers: string[] }).peers || [];
    return peers;
  };

  // 获取用户节点列表
  getAccountPeers = async (account: Uint8Array) => {
    const hexAccount = "0x" + Buffer.from(account).toString("hex");
    const userInfo = await this.getUserInfoWithAccount(hexAccount);
    if (!userInfo || !isUser(userInfo)) {
      return null;
    }
    const peers = userInfo.peers;
    return peers;
  };

  // 链上查询节点信息
  // getDcNodeAddr = async (peerid: string) => {
  //   const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid);
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
  getDcNodeWebrtcDirectAddr = async (peerid: string) => {
    const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid);
    const peerInfoJson = peerInfo?.toJSON();
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== "object" ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ""
    ) {
      console.error("no ip address found for peer: ", peerid);
      return;
    }
    let nodeAddr = Buffer.from(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
      "hex"
    ).toString("utf8");
    let addrParts = nodeAddr.split(",");
    if (addrParts.length < 2) {
      return;
    }
    console.log("nodeAddr", addrParts[1]);
    const addr = multiaddr(addrParts[1]);
    return addr;
  };

  // 链上查询节点列表
  getDcNodeList = async () => {
    const peerList = await this.dcchainapi?.query.dcNode.onlineNodesAddress();
    const peerListJson = peerList?.toJSON();
    console.log(
      "peerListJson================================================",
      peerListJson
    );
    if (!peerListJson || typeof peerListJson !== "object") {
      console.error("no peer list found");
      return [];
    }
    let peers: string[] = [];
    for (let i = 0; i < (peerListJson as string[]).length; i++) {
      const peerJson = Buffer.from(peerListJson[i].slice(2), "hex").toString(
        "utf8"
      );
      console.log("peerJson", peerJson);
      peers = peers.concat(peerJson);
    }
    console.log("peers", peers);
    return peers;
  };

  objectState =  async (cid: string): Promise<StoreunitInfo | null> =>{
      if (!this.dcchainapi) {  
          throw new Error('Blockchain not connected');  
      }  

      const fileInfo = await this.dcchainapi.query.dcNode.files(cid);  
      
      if (!fileInfo || fileInfo.isEmpty) {  
          return null;  
      }  

      const data = fileInfo.toJSON();  

      if (!data) {  
          return null;  
      }  
      // 构造返回数据  
      return {  
        size: Number(data['fileSize'] || 0),  
        utype: Number(data['fileType'] || 0),  
        peers: new Set(
          Array.isArray(data['peers']) 
            ? data['peers'].map(peer => {
                try {
                  return hexToAscii(String(peer));
                } catch (e) {
                  console.warn('Failed to convert peer ID format:', e);
                  return String(peer); // 如果转换失败，保留原格式
                }
              })
            : []
        ),   
        users: new Set(Array.isArray(data['users']) ? data['users'].map(String) : []),  
        mbusers: new Set(
          Array.isArray(data['users']) 
            ? data['users'].map(user => {
                try {
                  const userBytes = hexToBytes(user.slice(2));
                  const mbUser =  base32.encode(userBytes); 
                  return mbUser
                } catch (e) {
                  console.warn('Failed to convert peer ID format:', e);
                  return String(user); // 如果转换失败，保留原格式
                }
              })
            : []
        ),   
        logs: new Set(
          Array.isArray(data['dbLog']) 
            ? data['dbLog'].map(log => {
                try {
                  return hexToAscii(String(log));
                } catch (e) {
                  console.warn('Failed to convert peer ID format:', e);
                  return String(log); // 如果转换失败，保留原格式
                }
              })
            : []
        ),   
    };    
  }

    ifEnoughUserSpace = async (
      pubkeyRaw: Uint8Array,
      needSize?: number
    ): Promise<boolean> => {
      const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
      // 获取用户存储空间
      const userInfo = await this.getUserInfoWithAccount(
        hexAccount
      );
      if (!userInfo) {
        throw new Error("get user info error");
      }
  
      // 用户冻结
      if (userInfo.commentFrozenStatus != 0 || userInfo.spamFrozenStatus != 0) {
        return false
      }
  
      // 过期高度判断
      const blockHeight = (await this.getBlockHeight()) || 0;
      if (userInfo.expireNumber > 0 && userInfo.expireNumber < blockHeight) {
        return false
      }
  
      // 用户存储空间判断
      const needSizeNumber = needSize || 1024 * 1024; // 1M
      if (userInfo.subscribeSpace - userInfo.usedSpace < needSizeNumber) {
        return false
      }
  
      return true
    };
    refreshUserInfo = async (pubkeyRaw: Uint8Array): Promise<User> => {
      const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
      const userInfo = await this.getUserInfoWithAccount(hexAccount);
      return userInfo;
    };

}
