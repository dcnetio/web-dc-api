// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { KeyManager } from "./dc-key/keyManager";

import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";

import { multiaddr, type Multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";
import * as buffer from "buffer/";
import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sha256,
  sleep,
  uint32ToLittleEndianBytes,
} from "./util/utils";
import { Ed25519PrivKey } from "./dc-key/ed25519";
import { decryptContent } from "./util/dccrypt";
import { ChainUtil } from "./chain";
import type { AccountKey, DCConnectInfo } from "./types/types";
import { Client } from "./dcapi";
import { DcUtil } from "./dcutil";
import { ErrInvalidToken } from "./error";
import { DCManager } from "./dc/dcmanager";
import { ThemeManager } from "./theme/thememanager";
import { AccountManager } from "./account/accountmanager";
import { CommonClient } from "./commonclient";
import { FileManager } from "./file/filemanager";
import type { HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";

const NonceBytes = 12;
const TagBytes = 16;
const protocol = "/dc/thread/0.0.1";
const { Buffer } = buffer;
export class DC implements AccountKey {
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: HeliaLibp2p<Libp2p<any>>; // 什么类型？dc node 对象，主要用于建立连接
  dc: DcUtil;
  privKey: Ed25519PrivKey | undefined; // 私钥

  public TokenTask: boolean = false;
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public AppId: string = "";
  public Identity: string = "";
  public Blockheight: number = 0;

  constructor(options: { wssUrl: string; backWssUrl: string }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.dc = new DcUtil(this.dcChain);
  }

  sign = (payload: Uint8Array): Uint8Array => {
    if (!this.privKey) {
      throw new Error("privKey is null");
    }
    return this.privKey.sign(payload);
  };
  getPubkeyRaw() {
    if (!this.privKey) {
      throw new Error("Private key is not initialized");
    }
    const pubKey = this.privKey.publicKey;
    return pubKey.raw;
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
        // todo 临时测试
        const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
        let nodeAddr = await this.dc?._getNodeAddr(peerId);
        // nodeAddr = multiaddr('/ip4/192.168.31.127/udp/4001/webrtc-direct/certhash/uEiBq5Ki7QE5Nl2IPWTOG52RNutWFaB3rfdIEgKAlVcFtHA/p2p/12D3KooWKfJGey3xUcTQ8bCokBxxudoDm3RAeCfdbuq2e34c7TWB')
        // 获取默认dc节点地址
        // const nodeAddr = await this.dc?._getDefaultDcNodeAddr();
        if (nodeAddr) {
          this.connectedDc.nodeAddr = nodeAddr; // 当前地址
          this.connectedDc.client = await this._newDcClient(nodeAddr);
          this.dcNodeClient.libp2p.dial(nodeAddr);
        }

        // 定时维系token
        // this.startDcPeerTokenKeepValidTask();
      }
    }
  };

  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    try {
      const fileManager = new FileManager(
        this.dc,
        this.connectedDc,
        this.dcChain,
        this.dcNodeClient,
        this
      );
      const fileContent = await fileManager.getFileFromDc(cid, decryptKey);
      return fileContent;
    } catch (error) {
      console.log("error", error);
      return "";
    }
  };

  /// <reference path = "dcnet_pb.d.ts" />

  // 获取hostid
  getHostID = async (): Promise<
    [{ peerID: string; reqAddr: string } | null, Error | null]
  > => {
    const dcManager = new DCManager(this.connectedDc);
    const res = await dcManager.getHostID();
    return res;
  };
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (
    key: string
  ): Promise<string | null> => {
    const themeManager = new ThemeManager(this.connectedDc, this.dc);
    const res = await themeManager.getCacheValue(key);
    if(res[0]){
      return res[0]
    }
    return null;
  };
  // 设置缓存值
  setCacheKey = async (value: string) => {
    const themeManager = new ThemeManager(
      this.connectedDc,
      this.dc,
      this.dcChain,
      this
    );
    const res = await themeManager.setCacheKey(value);
    return res;
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
    //登录accountLogin
    if (!this.connectedDc?.client) {
      throw new Error("dcClient is null");
    }
    const commonClient = new CommonClient(this.connectedDc.client);
    const privKey = await commonClient.accountLogin(
      nftAccount,
      password,
      safecode,
      appName
    );
    if (privKey) {
      this.privKey = privKey;
      // 获取token
      const pubkey = await this.privKey.publicKey;
      const token = await this.connectedDc?.client.GetToken(
        pubkey.string(),
        (payload) => {
          return this.sign(payload);
        }
      );
      // todo 临时测试
      // if(this.connectedDc.nodeAddr) {
      //   const accountManager = new AccountManager(
      //     this.connectedDc,
      //     this.dc,
      //     this.dcChain,
      //     this,
      //   );
      //   accountManager.bindAccessPeerToUser(this.connectedDc.nodeAddr);
      // }

      if (!token) {
        throw new Error("GetToken error");
      }
      // // 存在token， 获取用户备用节点
      // const accountManager = new AccountManager(
      //   this.connectedDc,
      //   this.dc,
      //   this.dcChain,
      //   this,
      // );
      // const reply = await accountManager.getAccountNodeAddr();
      // if (reply && reply[0]) {
      //   const nodeAddr = reply[0];
      //   this.AccountBackupDc.nodeAddr = nodeAddr; // 当前地址
      //   this.AccountBackupDc.client = await this._newDcClient(nodeAddr);
      // }
    }
    return true;
  };

  // 退出登陆
  // accountLogout = async () => {
  //   if (!this.connectedDc.client) {
  //     console.log("dcClient is null");
  //     return;
  //   }
  //   if (!this.connectedDc.nodeAddr) {
  //     console.log("nodeAddr is null");
  //     return;
  //   }
  //   const logoutReply = await this.connectedDc.client.AccountLogout(
  //     this.connectedDc.nodeAddr
  //   );
  //   console.log("AccountLogout reply:", logoutReply);
  //   return logoutReply;
  // };

  // 获取用户信息
  getUserInfoWithNft = async (nftAccount: string) => {
    const accountManager = new AccountManager(
      this.connectedDc,
      this.dc,
      this.dcChain
    );
    const userInfo = await accountManager.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return userInfo;
  };

  // 获取用户数据列表

  // 添加用户评论空间
  addUserOffChainSpace = async () => {
    if (!this.connectedDc.client) {
      console.log("dcClient is null");
      return;
    }
    if (!this.connectedDc.nodeAddr) {
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
      this.connectedDc.nodeAddr.getPeerId() || ""
    );

    // 将 hValue 和 peerIdValue 连接起来
    const preSign = new Uint8Array(peerIdValue.length + hValue.length);
    preSign.set(peerIdValue, 0);
    preSign.set(hValue, peerIdValue.length);
    const signature = this.privKey.sign(preSign);
    const pubKey = this.privKey.publicKey;
    this.connectedDc.client.AddUserOffChainSpace(
      pubKey.string(),
      blockHeight,
      signature,
      this.connectedDc.nodeAddr
    );
    console.log("AddUserOffChainSpace end");
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
        await this._getTokenWithDCConnectInfo(this.connectedDc);
        await this._getTokenWithDCConnectInfo(this.AccountBackupDc);
        await sleep(period);
      }
    })();
  }

  _newDcClient = async (nodeAddr: Multiaddr): Promise<Client | undefined> => {
    if (!this.connectedDc.nodeAddr) {
      return;
    }
    const dcClient = new Client(this.dcNodeClient.libp2p, nodeAddr, protocol);
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
          return this.sign(payload);
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
        let resClient: Client | undefined;
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
              return this.sign(payload);
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
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: number, size: number) => void
  ) {
    const fileManager = new FileManager(
      this.dc,
      this.connectedDc,
      this.dcChain,
      this.dcNodeClient,
      this
    );
    const res = await fileManager.addFile(file, enkey, onUpdateTransmitSize);
  }
}
