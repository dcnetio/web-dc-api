// modules/auth-module.ts
// 认证功能模块

import { DCContext, IAuthOperations } from "../interfaces";
import { DCModule, CoreModuleName } from "../common/module-system";
import { AccountManager, NFTBindStatus } from "../implements/account/manager";
import { CommonClient } from "../common/commonclient";
import { Client } from "../common/dcapi";
import { createLogger } from "../util/logger";
import { loadPublicKey, loadTokenWithPeerId, savePublicKey, sleep } from "../util/utils";
import { Ed25519PubKey } from "../common/dc-key/ed25519";
import { Errors } from "../common/error";
import { dc_protocol } from "../common/define";
import { Multiaddr } from "@multiformats/multiaddr";
import {WalletManager} from "../implements/wallet/manager";
import { User } from "../common/types/types";

const logger = createLogger('AuthModule');

/**
 * 认证模块
 * 处理用户登录、Token管理等功能
 */
export class AuthModule implements DCModule, IAuthOperations {
  readonly moduleName = CoreModuleName.AUTH;
  private context: DCContext;
  private initialized: boolean = false;
  private tokenTask: boolean = false;
  private walletManager: WalletManager;
  
  /**
   * 初始化认证模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.context = context;
      const walletManager = new WalletManager(this.context);
      await walletManager.init();
      this.walletManager = walletManager;
      this.initialized = true;
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
   * 获取存储的token
   * @param peerId 节点ID
   */
  async getSavedToken(peerId: string): Promise<void> {
    this.assertInitialized();
    
    // 获取存储的pubkey
    const publicKeyString = await loadPublicKey();
    if (publicKeyString) {
      // 获取公钥
      const publicKey = Ed25519PubKey.edPubkeyFromStr(publicKeyString);
      this.context.publicKey = publicKey;
      // 获取token
      const token = await loadTokenWithPeerId(publicKeyString, peerId);
      if (token) {
        // 连接token还在
        this.context.connectedDc.client.token = token;
      }
      // token不在，说明换了节点，则重新获取
      await this.getTokenWithDCConnectInfo(this.context.connectedDc);
    }
  }
  
  // /**
  //  * 账户登录
  //  * @returns 是否登录成功
  //  */
  // async accountLogin(): Promise<boolean> {
  //   this.assertInitialized();
    
  //   if (!this.context.connectedDc?.client) {
  //     throw new Error("dcClient is null");
  //   }

  //   try {
  //     const res = await this.walletManager.openConnect();
  //     if(!res) {
  //       throw new Error("openConnect error");
  //     }
  //     const data = res.responseData;
  //     if(!data.publicKey) {
  //       throw new Error("openConnect response is null");
  //     }
  //     const publicKey = Ed25519PubKey.formEd25519PublicKey(data.publicKey);
  //     this.context.publicKey = publicKey;
  //     savePublicKey(publicKey.string());
  //     console.log("accountLogin data", data);
  //     // 获取token
  //     const token = await this.context.connectedDc?.client.GetToken(
  //       publicKey.string(),
  //       (payload: Uint8Array): Promise<Uint8Array> => {
  //         return this.sign(payload);
  //       }
  //     );
      
  //     if (!token) {
  //       throw new Error("GetToken error");
  //     }
  //     // 存在token， 获取用户备用节点
  //     await this.getAccountBackupDc();

  //   } catch (error) {
  //     console.error("accountLogin error", error);
      
  //   }
  //   return true;
  // }

  /**
   * 账户登录
   * @param nftAccount NFT账户
   * @param password 密码
   * @param safecode 安全码
   * @returns 是否登录成功
   */
  async accountLogin(nftAccount: string, password: string, safecode: string): Promise<boolean> {
    this.assertInitialized();
    
    if (!this.context.connectedDc?.client) {
      throw new Error("dcClient is null");
    }
    const commonClient = new CommonClient(this.context.connectedDc.client);
    const privKey = await commonClient.accountLogin(
      nftAccount,
      password,
      safecode,
      this.context.appInfo?.id || ""
    );
    
    if (privKey) {
      this.context.privKey = privKey;
      // 保存公钥
      const pubkey = this.context.privKey.publicKey;
      this.context.publicKey = pubkey;
      console.log("accountLogin pubkey base32", pubkey.string());
      await savePublicKey(pubkey.string());
      // 获取token
      const token = await this.context.connectedDc?.client.GetToken(
        pubkey.string(),
        this.context.sign
      );
      
      if (!token) {
        throw new Error("GetToken error");
      }
      // 存在token， 获取用户备用节点
      await this.getAccountBackupDc();
    }
    return true;
  }

  async sign(payload: Uint8Array): Promise<Uint8Array>  {
    if (!this.walletManager) {
      throw new Error("walletManager is null");
    } else  {
      const signature = await this.walletManager.sign(payload);
      return signature;
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
    mnemonic: string,
  ): Promise<[NFTBindStatus, Error | null]> {
    this.assertInitialized();
    
    if (!this.context.connectedDc?.client) {
      throw new Error("dcClient is null");
    }
    
    try {
      const accountManager = new AccountManager(
        this.context
      );
      const res = await accountManager.bindNFTAccount(
        account,
        password,
        seccode,
        mnemonic
      );
      return res
    } catch (error) {
      return [NFTBindStatus.Error, error as Error];
    }
  }
  

/**
 * 创建子账号，只有带有助记词的用户才能创建子账号
 * 子账号创建后，用助记词登陆子账号App，与调用登陆了主账号的App进行授权登陆，是同一个用户
 * 
 * @param appId 应用ID
 * @returns [私钥字符串, 错误]
 */
async generateAppAccount(appId: string,mnemonic: string): Promise<[string | null, Error | null]> {
   this.assertInitialized();
  const accountManager = new AccountManager(
        this.context
      );
  return await accountManager.generateAppAccount(appId,mnemonic);
}
 


  /**
   * 检查NFT账号是否成功绑定到用户的公钥
   * @param account NFT账号
   * @returns 是否成功绑定
   */
  async isNftAccountBindSuccess(account: string): Promise<boolean> {
     this.assertInitialized();
    const accountManager = new AccountManager(
        this.context
      );
      const res = await accountManager.isNftAccountBindSuccess(account);
      return res;
  }



  /**
   * 检查NFT账号是否已经被绑定
   * @param account NFT账号
   * @returns 是否被其他账号绑定
   */
  async isNftAccountBinded(account: string): Promise<boolean> {
     this.assertInitialized();
    const accountManager = new AccountManager(
        this.context
      );
      const res = await accountManager.isNftAccountBinded(account);
      return res;
  }

  // 获取用户钱包信息
  async getUserInfoWithAccount(account: string): Promise<User> {
     this.assertInitialized();
    const res = await this.context.dcChain.getUserInfoWithAccount(account);
    return res;
  }

 
  /**
   * 获取用户备用节点
   */
  private async getAccountBackupDc(): Promise<void> {
    
    // 存在token， 获取用户备用节点
    const accountManager = new AccountManager(
      this.context
    );
    
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

    // 10秒一次心跳维持连接
    const period = 10000;
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
   * 停止token验证任务
   */
  stopTokenKeepValidTask(): void {
    this.tokenTask = false;
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
  
  /**
   * 获取用户信息
   * @param nftAccount NFT账户
   * @returns 用户信息
   */
  async getUserInfoWithNft(nftAccount: string): Promise<any> {
    this.assertInitialized();
    
    const accountManager = new AccountManager(
      this.context
    );
    
    const userInfo = await accountManager.getUserInfoWithNft(nftAccount);
    logger.info("获取用户信息成功:", userInfo);
    return userInfo;
  }
  
  /**
   * 检查用户空间是否足够
   * @param needSize 需要的空间大小
   * @returns 空间信息
   */
  async ifEnoughUserSpace(needSize?: number): Promise<any> {
    this.assertInitialized();
    
    const pubkeyRaw = this.context.getPubkeyRaw();
    return this.context.dcChain.ifEnoughUserSpace(pubkeyRaw, needSize);
  }
  
  /**
   * 刷新用户信息
   * @returns 用户信息
   */
  async refreshUserInfo(): Promise<any> {
    this.assertInitialized();
    
    const pubkeyRaw = this.context.getPubkeyRaw();
    return this.context.dcChain.refreshUserInfo(pubkeyRaw);
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