// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { KeyManager } from "./dc-key/keyManager";

import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";

import type { Multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";
import * as buffer from "buffer/";
import { compareByteArrays, decryptContentForBrowser, mergeUInt8Arrays, sha256, sleep, uint32ToLittleEndianBytes } from "./util/utils";
import { Ed25519PrivKey } from "./dc-key/ed25519";
import { decryptContent } from "./util/dccrypt";
import { ChainUtil } from "./chain";
import type { DCConnectInfo } from "./types/types";
import { DCClient } from "./dcapi";
import { DC } from "./DCFuns";
import { ErrInvalidToken } from "./error";

const NonceBytes = 12;
const TagBytes = 16;
const protocol = "/dc/thread/0.0.1";
const { Buffer } = buffer;
export class DcUtil {
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: any | undefined; // 什么类型？dc node 对象，主要用于建立连接
  privKey: Ed25519PrivKey | undefined; // 私钥
  dc: DC | undefined;

  public TokenTask: boolean = false;
  public ConnectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public AppId: string = "";
  public Identity: string = "";
  public Blockheight: number = 0;

  constructor(options: { wssUrl: string; backWssUrl: string }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.dc = new DC(this.dcChain);
  }

  // 初始化
  init = async () => {
    let createChain = false;
    try {
      createChain = await this.dcChain.create(this.blockChainAddr);
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.log("dcchainapi init failed");
          return;
        }
      }
    } catch (error) {
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.log("dcchainapi init failed");
          return;
        }
      }
    } finally {
      // 如果链节点已经连接
      if (createChain) {
        this.dcNodeClient = await this.dc?._createHeliaNode();
        // 获取默认dc节点地址
        const nodeAddr = await this.dc?._getDefaultDcNodeAddr();
        if (nodeAddr) {
          this.ConnectedDc.nodeAddr = nodeAddr; // 当前地址
          this.ConnectedDc.client = await this._newDcClient(nodeAddr);
        }
        // 定时维系token
        this.startDcPeerTokenKeepValidTask();
      }
    }
  };

  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    console.log("first 11111");
    const res = await this.dc?._connectToObjNodes(cid);
    if (!res) {
      console.log("return nulllllllll");
      return null;
    }
    console.log("first 2");
    const fs = unixfs(this.dcNodeClient);
    console.log("first 3");
    let headDealed = false;
    let waitBuffer = new Uint8Array(0);
    let fileContent = new Uint8Array(0);
    console.log("first 31");

    const encryptextLen = (3 << 20) + NonceBytes + TagBytes; //每段密文长度(最后一段可能会短一点)
    const catOptions = {
      offset: 0,
      length: 32,
      // signal: AbortSignal.timeout(5000),
    };
    console.log("first 32");
    let readCount = 0;
    try {
      for (;;) {
        if (!headDealed) {
          //处理文件头
          console.log("first 33");
          const headBuf = await toBuffer(fs.cat(CID.parse(cid), catOptions));
          console.log("first 4");
          readCount += headBuf.length;
          if (headBuf.length > 0) {
            waitBuffer = mergeUInt8Arrays(waitBuffer, headBuf);
            if (waitBuffer.length < 32) {
              catOptions.offset = waitBuffer.length;
              catOptions.length = 32 - waitBuffer.length;
              continue;
            } else {
              //判断是否是dc网络存储的文件头
              headDealed = true;
              if (
                compareByteArrays(
                  waitBuffer.subarray(0, 10),
                  Buffer.from("$$dcfile$$")
                )
              ) {
                //判断是否是dc网络存储的文件头
                waitBuffer = waitBuffer.subarray(32, waitBuffer.length);
              }
            }
          } else {
            if (waitBuffer.length > 0) {
              if (decryptKey != "") {
                const decrypted = await decryptContent(waitBuffer, decryptKey);
                fileContent = mergeUInt8Arrays(fileContent, decrypted);
              } else {
                fileContent = mergeUInt8Arrays(fileContent, waitBuffer);
              }
            }
            break;
          }
          continue;
        }
        catOptions.offset = readCount;
        catOptions.length = encryptextLen;
        const buf = await toBuffer(fs.cat(CID.parse(cid), catOptions));
        if (buf.length > 0) {
          readCount += buf.length;
        }
        if (buf.length > 0) {
          waitBuffer = mergeUInt8Arrays(waitBuffer, buf);
          while (waitBuffer.length >= encryptextLen) {
            const encryptBuffer = waitBuffer.subarray(0, encryptextLen);
            waitBuffer = waitBuffer.subarray(encryptextLen, waitBuffer.length);
            if (decryptKey == "") {
              fileContent = mergeUInt8Arrays(fileContent, encryptBuffer);
              continue;
            }
            //解密
            const decrypted = decryptContentForBrowser(
              encryptBuffer,
              decryptKey
            );
            fileContent = mergeUInt8Arrays(fileContent, decrypted);
          }
        } else {
          if (waitBuffer.length > 0) {
            if (decryptKey != "") {
              const decrypted = decryptContentForBrowser(
                waitBuffer,
                decryptKey
              );
              fileContent = mergeUInt8Arrays(fileContent, decrypted);
            } else {
              fileContent = mergeUInt8Arrays(fileContent, waitBuffer);
            }
          }
          break;
        }
      }
      return fileContent;
    } catch (error) {
      console.log("error", error);
      return "";
    }
  };

  /// <reference path = "dcnet_pb.d.ts" />

  // 获取hostid
  getHostID = async (): Promise<
    { peerID: string; reqAddr: string } | undefined
  > => {
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    const getHostIdreply = await this.ConnectedDc.client?.getHostID();
    console.log("getHostIdreply:", getHostIdreply);
    return getHostIdreply;
  };
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (key: string) => {
    //解析出peerid与cachekey
    const pkeys = key.split("/");
    if (pkeys.length != 2) {
      console.log("key format error!");
      return;
    }
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    const peerid = pkeys[0];
    const cacheKey = pkeys[1];
    try {
      let nodeAddr: Multiaddr | undefined;
      if (this.ConnectedDc.nodeAddr) {
        const connectedPeerId = this.ConnectedDc.nodeAddr.getPeerId() || "";
        if (connectedPeerId && connectedPeerId === peerid) {
          // 同一个节点
          nodeAddr = this.ConnectedDc.nodeAddr;
        } else {
          // 不是同一个节点
          nodeAddr = await this.dc?._getNodeAddr(peerid);
        }
      } else {
        nodeAddr = await this.dc?._getNodeAddr(peerid);
      }
      if (!nodeAddr) {
        console.log("nodeAddr is null");
        return;
      }

      const getCacheValuereply = await this.ConnectedDc.client?.GetCacheValue(
        nodeAddr,
        cacheKey
      );
      console.log("GetCacheValueReply reply:", getCacheValuereply);
      return getCacheValuereply;
    } catch (err) {
      console.log("getCacheValue error:", err);
      return;
    }
  };
  register = async () => {
    // //生成助记词
    //  const mnemonic = KeyManager.generateMnemonic();
    //  //生成私钥
    // const privKey = KeyManager.getEd25519KeyFromMnemonic(mnemonic);
    // const pubKey = privKey.publicKey;
  };

  // 登陆
  accountLogin = async (
    nftAccount: string,
    password: string,
    safecode: string,
    appName: string
  ) => {
    //登录
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    if (!this.ConnectedDc.nodeAddr) {
      console.log("nodeAddr is null");
      return;
    }
    const prikey = await this.ConnectedDc.client.AccountLogin(
      nftAccount,
      password,
      safecode,
      this.ConnectedDc.nodeAddr
    );
    console.log("AccountLogin success:", prikey);
    let mnemonic = "";
    if (prikey.startsWith("mnemonic:")) {
      mnemonic = prikey.slice(9);
    } else if (prikey.startsWith("privatekey:")) {
      const basePriKey = prikey.slice(11);
      let priKey: Uint8Array;
    }
    const keymanager = new KeyManager();
    //const privKey1 = await keymanager.getEd25519KeyFromMnemonic(mnemonic);
    const privKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      appName
    );
    const pubKey = privKey.publicKey;
    console.log("get privKey:", privKey);
    console.log("get pubKey:", pubKey);
    this.privKey = privKey;
    //获取token
    const token = await this.ConnectedDc.client.GetToken(
      pubKey.string(),
      (payload: Uint8Array): Uint8Array => {
        // Implement your signCallback logic here
        const signature = privKey.sign(payload);
        return signature;
      }
    );
    console.log("GetToken reply:", token);
    // 获取用户备用节点
    const peerAddrs = await this.dcChain.getAccountPeers(pubKey.raw);
    if (peerAddrs && peerAddrs.length > 0) {
      // 连接备用节点
      const nodeAddr = await this.dc?._connectPeers(peerAddrs);
      console.log("_connectNodeAddrs nodeAddr:", nodeAddr);
      if (!nodeAddr) {
        return false;
      }
      this.AccountBackupDc.nodeAddr = nodeAddr as Multiaddr; // 当前地址
      this.AccountBackupDc.client = await this._newDcClient(
        nodeAddr as Multiaddr
      );
    }
    return true;
  };

  // // 退出登陆
  // accountLogout = async () => {
  //   if (!this.ConnectedDc.client) {
  //     console.log("dcClient is null");
  //     return;
  //   }
  //   if (!this.ConnectedDc.nodeAddr) {
  //     console.log("nodeAddr is null");
  //     return;
  //   }
  //   const logoutReply = await this.ConnectedDc.client.AccountLogout(
  //     this.ConnectedDc.nodeAddr
  //   );
  //   console.log("AccountLogout reply:", logoutReply);
  //   return logoutReply;
  // };

  // 获取用户信息
  getUserInfoWithNft = async (nftAccount: string) => {
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    // todo 从链上获取
    const userInfo = await this.dcChain.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return userInfo;
  };

  // 获取用户数据列表

  // 添加用户评论空间
  addUserOffChainSpace = async () => {
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    if (!this.ConnectedDc.nodeAddr) {
      console.log("nodeAddr is null");
      return;
    }
    if (!this.privKey) {
      console.log("privKey is null");
      return;
    }
    const blockHeight = (await this.dcChain.getBlockHeight()) || 0;
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const peerIdValue: Uint8Array = new TextEncoder().encode(
      this.ConnectedDc.nodeAddr.getPeerId() || ""
    );

    // 将 hValue 和 peerIdValue 连接起来
    const preSign = new Uint8Array(peerIdValue.length + hValue.length);
    preSign.set(peerIdValue, 0);
    preSign.set(hValue, peerIdValue.length);
    const signature = this.privKey.sign(preSign);
    const pubKey = this.privKey.publicKey;
    this.ConnectedDc.client.AddUserOffChainSpace(
      pubKey.string(),
      blockHeight,
      signature,
      this.ConnectedDc.nodeAddr
    );
    console.log("AddUserOffChainSpace end");
  };

  // 设置缓存值
  setCacheKey = async (value: string) => {
    if (!this.ConnectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    if (!this.privKey) {
      console.log("privKey is null");
      return;
    }
    //获取最新区块高度
    const blockHeight = await this.dcChain.getBlockHeight();
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

    const signature = this.privKey.sign(preSign);
    const setCacheValueReply = await this.ConnectedDc.client.SetCacheKey(
      value,
      blockHeight ? blockHeight : 0,
      expire,
      signature
    );
    console.log("SetCacheKey reply:", setCacheValueReply);
    return setCacheValueReply;
  };

  /**
   * 开启定时验证 token 线程
   * 对应 Go 中的 dcPeerTokenKeepValidTask()
   */
  public startDcPeerTokenKeepValidTask(): void {
    // 如果已经有定时任务在跑，直接返回
    if (this.TokenTask) {
      return;
    }
    this.TokenTask = true;

    // 30秒一次心跳维持连接
    const period = 10000;
    let count = 0;

    // 启动ticker
    (async () => {
      while (this.TokenTask) {
        count++;
        console.info(
          `********** 定时验证token任务开始执行, 当前次数: ${count} **********`
        );
        await this._getTokenWithDCConnectInfo(this.ConnectedDc);
        await this._getTokenWithDCConnectInfo(this.AccountBackupDc);
        await sleep(period);
      }
    })();
  }

  _newDcClient = async (nodeAddr: Multiaddr): Promise<DCClient | undefined> => {
    if (!this.ConnectedDc.nodeAddr) {
      return;
    }
    const dcClient = new DCClient(this.dcNodeClient.libp2p, nodeAddr, protocol);
    return dcClient;
  };
  async _getTokenWithDCConnectInfo(connectInfo: DCConnectInfo) {
    try {
      // 判断 client 是否为空
      if (!connectInfo.client) {
        return;
      }
      // 判断 client 是否连接，不连接则需要连接
      if (
        !connectInfo.client?.p2pNode ||
        connectInfo.client?.p2pNode.status !== "started"
      ) {
        try {
          const nodeAddr = connectInfo.client?.peerAddr;
          if (!nodeAddr) {
            console.log("nodeAddr is null");
            return;
          }
          console.log("_newDcClient start ");
          connectInfo.client = await this._newDcClient(nodeAddr);
          console.log("_newDcClient end ");
        } catch (e) {
          console.log("connectInfo failed", e);
          return;
        }
      }
    } catch (error) {
      console.log("error111 failed", error);
      return;
    }

    // 判断 token 是否为空
    if (!connectInfo.client?.token) {
      // 直接获取token
      if (!this.privKey) {
        return;
      }
      const privKey = this.privKey;
      const pubKey = privKey.publicKey;
      console.log("get token start ");
      await connectInfo.client?.GetToken(
        pubKey.string(),
        (payload: Uint8Array): Uint8Array => {
          // Implement your signCallback logic here
          const signature = privKey.sign(payload);
          return signature;
        }
      );
      console.log("get token end ");
      return;
    }

    // 调用 ValidToken
    try {
      console.log("ValidToken start ");
      await connectInfo.client?.ValidToken();
      console.log("ValidToken end ");
    } catch (err: any) {
      // 若 token 无效，需要刷新；否则重连
      if (err?.message && err.message.endsWith(ErrInvalidToken.message)) {
        if (!this.privKey) {
          return;
        }
        const privKey = this.privKey;
        const pubKey = privKey.publicKey;
        console.log("refreshToken start ");
        await connectInfo.client?.refreshToken(
          pubKey.string(),
          (payload: Uint8Array): Uint8Array => {
            // Implement your signCallback logic here
            const signature = privKey.sign(payload);
            return signature;
          }
        );
        console.log("refreshToken end ");
      } else {
        console.log("需要重连 start ");
        // 需要重连
        let resClient: DCClient | undefined;
        try {
          const nodeAddr = await this.dc?._getNodeAddr(
            connectInfo.nodeAddr?.getPeerId() as string
          );
          if (!nodeAddr) {
            console.log("nodeAddr is null");
            return;
          }
          resClient = await this._newDcClient(nodeAddr);
          if (!resClient) {
            console.log("resClient is null");
            return;
          }
        } catch (e: any) {
          console.debug(
            `GetClient失败, err: ${
              e?.message
            }, PEERID: ${connectInfo.nodeAddr?.getPeerId()}`
          );
          return;
        }

        if (resClient) {
          connectInfo.client = resClient;
        }
        try {
          // 直接获取token
          if (!this.privKey) {
            return;
          }
          const privKey = this.privKey;
          const pubKey = privKey.publicKey;
          console.log("GetToken start ");
          await connectInfo.client?.GetToken(
            pubKey.string(),
            (payload: Uint8Array): Uint8Array => {
              // Implement your signCallback logic here
              const signature = privKey.sign(payload);
              return signature;
            }
          );
          console.log("GetToken end ");
        } catch (tokenErr: any) {
          console.debug(
            `获取token失败, err: ${
              tokenErr?.message
            }, PEERID: ${connectInfo.nodeAddr?.getPeerId()}`
          );
        }
      }
    }
  }
}
