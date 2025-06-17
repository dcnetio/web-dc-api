// modules/auth-module.ts
// 认证功能模块

import { DCModule, CoreModuleName } from "../common/module-system";
import { AccountManager } from "../implements/account/manager";
import { CommonClient } from "../common/commonclient";
import { Client } from "../common/dcapi";
import { createLogger } from "../util/logger";
import {
  sleep,
} from "../util/utils";
import { Ed25519PrivKey, Ed25519PubKey } from "../common/dc-key/ed25519";
import { Errors } from "../common/error";
import { dc_protocol, OffChainOpTimes, OffChainOpTimesLimit, OffChainSpaceLimit } from "../common/define";
import { Multiaddr } from "@multiformats/multiaddr";
import { WalletManager } from "../implements/wallet/manager";
import { Account, EIP712SignReqMessage, NFTBindStatus, SignReqMessage, SignResponseMessage, User } from "../common/types/types";
import { IAuthOperations } from "../interfaces/auth-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { CommentManager } from "../../lib/implements/comment/manager";

const logger = createLogger("AuthModule");

/**
 * 认证模块
 * 处理用户登录、Token管理等功能
 */
export class AuthModule implements DCModule, IAuthOperations {
  readonly moduleName = CoreModuleName.AUTH;
  private context!: DCContext;
  private initialized: boolean = false;
  private tokenTask: boolean = false;
  private walletManager!: WalletManager;

  /**
   * 初始化认证模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      const walletManager = new WalletManager(this.context);
      this.walletManager = walletManager;
      this.initialized = true;
      await walletManager.init();
      return true;
    } catch (error) {
      logger.error("认证模块初始化失败:", error);
      return false;
    }
  }

  /**
   * 关闭认证模块
   */
  async shutdown(): Promise<void> {
    // 停止Token维护任务
    this.stopTokenKeepValidTask();
    this.initialized = false;
  }

  /**
   * 账户登录
   * @returns 是否登录成功
   */
  async accountLoginWithWallet(): Promise<Account | null> {
    this.assertInitialized();

    if (!this.context.connectedDc?.client) {
      throw new Error("dcClient is null");
    }

    try {
      const data = await this.walletManager.openConnect();
      const publicKey = new Ed25519PubKey(data.appAccount);
      this.context.publicKey = publicKey;
      this.context.ethAddress = data.ethAccount;
      // 获取token
      const token = await this.context.connectedDc?.client.GetToken(
        this.context.appInfo.appId || "",
        publicKey.string(),
        (payload: Uint8Array): Promise<Uint8Array> => {
          return this.signWithWallet(payload);
        }
      );

      if (!token) {
        throw new Error("GetToken error");
      }
      // 存在token， 获取用户备用节点
      await this.getAccountBackupDc();
      // 给用户添加用户评论空间
      const userInfo = await this.getUserInfoWithAccount('0x' + publicKey.toString());
      if(userInfo == null) {
        throw Errors.USER_NOT_BIND_TO_PEER;
      }
      if(userInfo.offchainSpace < OffChainSpaceLimit || userInfo.offchainOptimes < OffChainOpTimesLimit) {
        const commentManager = new CommentManager(this.context);
        if(userInfo.offchainSpace < OffChainSpaceLimit) {
          const [addOffChainBool, addOffChainError] = await commentManager.addUserOffChainSpace();
          if (addOffChainError || !addOffChainBool) {
            throw addOffChainError || new Error("addUserOffChainSpace error");
          }
        }
        if(userInfo.offchainOptimes < OffChainOpTimesLimit) {
          const [addOffChainOpTimesBool, addOffChainOpTimesError] = await commentManager.addUserOffChainOpTimes(OffChainOpTimes);
          if (addOffChainOpTimesError || !addOffChainOpTimesBool) {
            throw addOffChainOpTimesError || new Error("addUserOffChainSpace error");
          }
        }
      }
      return data;

    } catch (error) {
      console.error("accountLogin error", error);
      return null;
    };
  }

  /**
   * 账户登录(钱包登录)不抛出异常
   * @returns [账户信息, 错误信息]
   */
  async accountLoginWithWalletNoThrow(): Promise<[Account | null, Error | null]> {
    try {
      return [await this.accountLoginWithWallet(), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 账户登录(钱包登录)
   * @param nftAccount NFT账户
   * @param password 密码
   * @param safecode 安全码
   * @returns 是否登录成功
   */
  async accountLogin(
    nftAccount: string,
    password: string,
    safecode: string
  ): Promise<{
    mnemonic: string | null;
  }> {
    this.assertInitialized();

    if (!this.context.connectedDc?.client) {
      throw new Error("dcClient is null");
    }
    //连接account所在的节点,并获取client
    let client = this.context.connectedDc?.client || null;
    const walletAccount = await this.context.dcChain?.getUserWalletAccount(nftAccount);
    if(!walletAccount) {
      throw new Error("getUserWalletAccount error");
    }
    const userPubkey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(walletAccount);
    const connectedClient = await this.context.dcutil.connectToUserDcPeer(userPubkey.raw);
    if (!connectedClient) {
      throw new Error("connect to user dc peer failed");
    }
    client = connectedClient;
    this.context.AccountBackupDc.client = client;
    const commonClient = new CommonClient(client);
    const mnemonic = await commonClient.accountLogin(
      nftAccount,
      password,
      safecode
    );
    console.log("=================accountLogin success");

    if (mnemonic) {
      if(this.context.appInfo?.appId){
        const accountManager = new AccountManager(this.context);
        const res = await accountManager.generateAppAccount(this.context.appInfo?.appId, mnemonic);
        console.log("=================generateAppAccount success");
        if (res[0] === null) {
          throw res[1] || new Error("generateAppAccount error");
        }
        // 获取私钥
        const privKey = Ed25519PrivKey.unmarshalString(res[0]);
        console.log("=================获取私钥 success");
      }
      return {
        mnemonic,
      };
    }
    return {
      mnemonic: '',
    };
  }

  /**
   * 账户登录(钱包登录)不抛出异常
   * @param nftAccount NFT账户
   * @param password 密码
   * @param safecode 安全码
   * @returns [是否登录成功, 错误信息]
   */
  async accountLoginWithNoThrow(
    nftAccount: string,
    password: string,
    safecode: string
  ): Promise<[boolean, Error | null]> {
    try {
      await this.accountLogin(nftAccount, password, safecode);
      return [true, null];
    } catch (error) {
      return [false, error as Error];
    }
  }

  async signWithWallet(payload: Uint8Array): Promise<Uint8Array> {
    if (!this.walletManager) {
      throw new Error("walletManager is null");
    } else {
      const signature = await this.walletManager.sign(payload);
      return signature;
    }
  }

   async sign(payload: Uint8Array): Promise<Uint8Array> {
    return  this.signWithWallet(payload);
  }

  async signWithNoThrow(payload: Uint8Array): Promise<[Uint8Array | null, Error | null]> {
    try {
      const signature = await this.signWithWallet(payload);
      return [signature, null];
    } catch (error) {
      return [null, error as Error];
    }
  }


   async decryptWithWallet(payload: Uint8Array): Promise<Uint8Array> {
     if (!this.walletManager) {
      throw new Error("walletManager is null");
    } else {
      const signature = await this.walletManager.decrypt(payload);
      return signature;
    }
  }
  async decryptWithWalletNoThrow(payload: Uint8Array): Promise<[Uint8Array | null, Error | null]> {
    try {
      const decryptedData = await this.decryptWithWallet(payload);
      return [decryptedData, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async signMessageWithWallet(data: SignReqMessage): Promise<SignResponseMessage | null> {
    if (!this.walletManager) {
      throw new Error("walletManager is null");
    } else {
      const response = await this.walletManager.signMessage(data);
      return response;
    }
  }

  async signEIP712MessageWithWallet(data: EIP712SignReqMessage): Promise<SignResponseMessage | null> {
    if (!this.walletManager) {
      throw new Error("walletManager is null");
    } else {
      const response = await this.walletManager.signEIP712Message(data);
      return response;
    }
  }
  /**
   * 将私钥绑定NFT账号(NFT账号+密码+安全码)
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @returns [状态码, 错误信息]
   */
  async bindNFTAccount(
    account: string,
    password: string,
    seccode: string,
    mnemonic: string
  ): Promise<[NFTBindStatus, Error | null]> {
    this.assertInitialized();

    if (!this.context.connectedDc?.client) {
      throw new Error("dcClient is null");
    }

    try {
      const accountManager = new AccountManager(this.context);
      const res = await accountManager.bindNFTAccount(
        account,
        password,
        seccode,
        mnemonic
      );
      return res;
    } catch (error) {
      return [NFTBindStatus.Error, error as Error];
    }
  }
  /**
   * 将私钥绑定NFT账号(NFT账号+密码+安全码)不抛出异常
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @returns [状态码, 错误信息]
   */
  async bindNFTAccountWithNoThrow(
    account: string,
    password: string,
    seccode: string,
    mnemonic: string
  ): Promise<[NFTBindStatus | null, Error | null]> {
    try {
      const res = await this.bindNFTAccount(account, password, seccode, mnemonic);
      return [res[0], null];
    } catch (error) {
      return [null, error as Error];
    }
  }
  

  /**
   * 创建子账号，只有带有助记词的用户才能创建子账号
   * 子账号创建后，用助记词登陆子账号App，与调用登陆了主账号的App进行授权登陆，是同一个用户
   *
   * @param appId 应用ID
   * @returns [私钥字符串, 错误]
   */
  async generateAppAccount(
    appId: string,
    mnemonic: string
  ): Promise<[string | null, Error | null]> {
    this.assertInitialized();
    const accountManager = new AccountManager(this.context);
    return await accountManager.generateAppAccount(appId, mnemonic);
  }

  /**
   * 创建子账号，只有带有助记词的用户才能创建子账号
   * 子账号创建后，用助记词登陆子账号App，与调用登陆了主账号的App进行授权登陆，是同一个用户
   *
   * @param appId 应用ID
   * @returns [私钥字符串, 错误]
   */
  async generateAppAccountWithNoThrow(
    appId: string,
    mnemonic: string
  ): Promise<[string | null, Error | null]> {
    try {
      const res = await this.generateAppAccount(appId, mnemonic);
      return [res[0], null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 检查NFT账号是否成功绑定到用户的公钥
   * @param nftAccount NFT账号
   * @param pubKeyStr 公钥字符串
   * @returns 是否成功绑定
   */
  async isNftAccountBindSuccess(nftAccount: string, pubKeyStr: string): Promise<boolean> {
    this.assertInitialized();
    const accountManager = new AccountManager(this.context);
    const res = await accountManager.isNftAccountBindSuccess(nftAccount, pubKeyStr);
    return res;
  }
  /**
   * 检查NFT账号是否成功绑定到用户的公钥,不抛出异常
   * @param nftAccount NFT账号
   * @param pubKeyStr 公钥字符串
   * @returns [是否成功绑定, 错误信息]
   */
  async isNftAccountBindSuccessWithNoThrow(nftAccount: string, pubKeyStr: string): Promise<[boolean | null, Error | null]> {
    try {
      const res = await this.isNftAccountBindSuccess(nftAccount, pubKeyStr);
      return [res, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 检查NFT账号是否已经被绑定
   * @param nftAccount NFT账号
   * @returns 是否被其他账号绑定
   */
  async isNftAccountBinded(nftAccount: string): Promise<boolean> {
    this.assertInitialized();
    const accountManager = new AccountManager(this.context);
    const res = await accountManager.isNftAccountBinded(nftAccount);
    return res;
  }

  /**
   * 检查NFT账号是否已经被绑定,不抛出异常
   * @param nftAccount NFT账号
   * @returns [是否被其他账号绑定, 错误信息]
   */
  async isNftAccountBindedWithNoThrow(nftAccount: string): Promise<[boolean | null, Error | null]> {
    try {
      const res = await this.isNftAccountBinded(nftAccount);
      return [res, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  // 获取用户钱包信息
  async getUserInfoWithAccount(account: string): Promise<User> {
    this.assertInitialized();
    const res = await this.context.dcChain.getUserInfoWithAccount(account);
    return res;
  }

  // 获取用户钱包信息，不抛出异常
  async getUserInfoWithAccountWithNoThrow(account: string): Promise<[User | null, Error | null]> {
    try {
      const res = await this.getUserInfoWithAccount(account);
      return [res, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 获取用户备用节点
   */
  public async getAccountBackupDc(): Promise<void> {
    // 存在token， 获取用户备用节点
    const accountManager = new AccountManager(this.context);

    const reply = await accountManager.getAccountNodeAddr();
    if (reply && reply[0]) {
      const nodeAddr = reply[0];
      this.context.AccountBackupDc.nodeAddr = nodeAddr; // 当前地址
      this.context.AccountBackupDc.client = await this.newDcClient(nodeAddr);
    }
  }

  /**
   * 创建新的DC客户端
   * @param nodeAddr 节点地址
   * @returns DC客户端实例
   */
  private async newDcClient(nodeAddr: Multiaddr): Promise<Client | undefined> {
    if (!nodeAddr) {
      return;
    }

    const dcClient = new Client(
      this.context.dcNodeClient.libp2p,
      this.context.dcNodeClient.blockstore,
      nodeAddr,
      dc_protocol
    );

    return dcClient;
  }

  /**
   * 开启定时验证 token 线程
   */
  startDcPeerTokenKeepValidTask(): void {
    this.assertInitialized();

    // 如果已经有定时任务在跑，直接返回
    if (this.tokenTask) {
      return;
    }
    this.tokenTask = true;

    // 60秒一次心跳维持连接
    const period = 60000;
    let count = 0;

    // 启动ticker
    (async () => {
      while (this.tokenTask) {
        count++;
        logger.info(`Token验证任务: 执行次数 ${count}`);
        await this.getTokenWithDCConnectInfo(this.context.connectedDc);
        await this.getTokenWithDCConnectInfo(this.context.AccountBackupDc);
        await sleep(period);
      }
    })();
  }
 
  /**
   * 开启定时验证 token 线程,不抛出异常
   */
  async startDcPeerTokenKeepValidTaskWithNoThrow(): Promise<[boolean, Error | null]> {
    try {
      this.startDcPeerTokenKeepValidTask();
      return [true, null];
    } catch (error) {
      return [false, error as Error];
    }
  }
  

  /**
   * 停止token验证任务
   */
  stopTokenKeepValidTask(): void {
    this.tokenTask = false;
  }
  /**
   * 停止token验证任务,不抛出异常
   */
  async stopTokenKeepValidTaskWithNoThrow(): Promise<[boolean, Error | null]> {
    try {
      this.stopTokenKeepValidTask();
      return [true, null];
    } catch (error) {
      return [false, error as Error];
    }
  }

  /**
   * 获取或刷新指定连接信息的Token
   * @param connectInfo 连接信息
   */
  async getTokenWithDCConnectInfo(connectInfo: any): Promise<void> {
    this.assertInitialized();

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
            logger.error("nodeAddr is null");
            return;
          }
          logger.info("重新创建DC客户端");
          connectInfo.client = await this.newDcClient(nodeAddr);
        } catch (e) {
          logger.error("重新连接失败", e);
          return;
        }
      }
    } catch (error) {
      logger.error("连接检查失败", error);
      return;
    }

    // 判断 token 是否为空
    if (!connectInfo.client?.token) {
      // 直接获取token
      if (!this.context.publicKey) {
        return;
      }
      logger.info("获取新Token");
      await connectInfo.client?.GetToken(
        this.context.appInfo.appId || '',
        this.context.publicKey.string(),
        this.context.sign
      );
      return;
    }

    // 调用 ValidToken
    try {
      logger.debug("验证Token有效性");
      await connectInfo.client?.ValidToken();
    } catch (err: any) {
      // 若 token 无效，需要刷新；否则重连
      if (err?.message && err.message.endsWith(Errors.INVALID_TOKEN.message)) {
        if (!this.context.publicKey) {
          return;
        }
        logger.info("刷新Token");
        await connectInfo.client?.refreshToken(
          this.context.appInfo.appId || '',
          this.context.publicKey.string(),
          this.context.sign
        );
      } else {
        logger.info("需要重连节点");
        // 需要重连
        let resClient: Client | undefined;
        try {
          const nodeAddr = await this.context.dcutil?._getNodeAddr(
            connectInfo.nodeAddr?.getPeerId() as string
          );
          if (!nodeAddr) {
            logger.error("无法获取节点地址");
            return;
          }
          resClient = await this.newDcClient(nodeAddr);
          if (!resClient) {
            logger.error("创建客户端失败");
            return;
          }
        } catch (e: any) {
          logger.error(
            `获取客户端失败, err: ${
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
          if (!this.context.publicKey) {
            return;
          }
          logger.info("获取新Token");
          await connectInfo.client?.GetToken(
            this.context.appInfo.appId || '',
            this.context.publicKey.string(),
            this.context.sign
          );
        } catch (tokenErr: any) {
          logger.error(
            `获取token失败, err: ${
              tokenErr?.message
            }, PEERID: ${connectInfo.nodeAddr?.getPeerId()}`
          );
        }
      }
    }
  }

  async getTokenWithDCConnectInfoWithNoThrow(connectInfo: any): Promise<[boolean, Error | null]> {
    try {
      await this.getTokenWithDCConnectInfo(connectInfo);
      return [true, null];
    } catch (error) {
      return [false, error as Error];
    }
  }

  /**
   * 获取用户信息
   * @param nftAccount NFT账户
   * @returns 用户信息
   */
  async getUserInfoWithNft(nftAccount: string): Promise<[User | null, Error | null]> {
    this.assertInitialized();

    const accountManager = new AccountManager(this.context);

    const userInfo = await accountManager.getUserInfoWithNft(nftAccount);
    logger.info("获取用户信息成功:", userInfo);
    return userInfo;
  }
  /**
   * 获取用户信息,不抛出异常
   * @param nftAccount NFT账户
   * @returns [用户信息, 错误信息]
   */
  async getUserInfoWithNftWithNoThrow(nftAccount: string): Promise<[User | null, Error | null]> {
    try {
      const res = await this.getUserInfoWithNft(nftAccount);
      return [res[0], null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 检查用户空间是否足够
   * @param needSize 需要的空间大小
   * @returns 空间信息
   */
  async ifEnoughUserSpace(needSize?: number): Promise<boolean> {
    this.assertInitialized();

    const pubkeyRaw = this.context.getPubkeyRaw();
    return this.context.dcChain.ifEnoughUserSpace(pubkeyRaw, needSize);
  }
  /**
   * 检查用户空间是否足够,不抛出异常
   * @param needSize 需要的空间大小
   * @returns [是否足够, 错误信息]
   */
  async ifEnoughUserSpaceWithNoThrow(needSize?: number): Promise<[boolean | null, Error | null]> {
    try {
      const res = await this.ifEnoughUserSpace(needSize);
      return [res, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 刷新用户信息
   * @returns 用户信息
   */
  async refreshUserInfo(): Promise<User> {
    this.assertInitialized();

    const pubkeyRaw = this.context.getPubkeyRaw();
    if (!pubkeyRaw) {
      throw new Error("用户未登录!");
    }
    return this.context.dcChain.refreshUserInfo(pubkeyRaw);
  }
  /**
   * 刷新用户信息,不抛出异常
   * @returns [用户信息, 错误信息]
   */
  async refreshUserInfoWithNoThrow(): Promise<[User | null, Error | null]> {
    try {
      const res = await this.refreshUserInfo();
      return [res, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 获取用户默认数据库
   * @param threadId 数据库ID
   * @param rk 读取密钥,主要用来加解密真正的数据,注意对数据记录进行加密和解密
   * @param sk 服务密钥,主要用来处理传输过程加解密,主要对数据链表头进行加密和解密
   * @param remark 备注信息
   * @returns 用户默认数据库信息
   */
  async setUserDefaultDB(threadId: string, rk: string,sk: string,remark: string,vaccount?: string): Promise<void> {
    this.assertInitialized();
     const accountManager = new AccountManager(this.context);
    return accountManager.setUserDefaultDB(threadId,rk,sk,remark,vaccount);
  }

  /**
   * 获取用户默认数据库,不抛出异常
   * @param threadId 数据库ID
   * @param rk 读取密钥,主要用来加解密真正的数据,注意对数据记录进行加密和解密
   * @param sk 服务密钥,主要用来处理传输过程加解密,主要对数据链表头进行加密和解密
   * @param remark 备注信息
   * @returns [用户默认数据库信息, 错误信息]
   */
  async setUserDefaultDBWithNoThrow(threadId: string, rk: string, sk: string, remark: string, vaccount?: string): Promise< Error | null> {
    try {
      await this.setUserDefaultDB(threadId, rk, sk, remark, vaccount);
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("认证模块未初始化");
    }
  }
}
