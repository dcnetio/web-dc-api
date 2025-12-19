import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { DCConnectInfo, NFTBindStatus, User } from "../../common/types/types";
import { AccountClient } from "./client";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { Ed25519PrivKey, Ed25519PubKey } from "../../common/dc-key/ed25519";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { PeerId } from "@libp2p/interface";
import {
  extractPublicKeyFromPeerId,
  generateSymKeyForPrikey,
  KeyManager,
} from "../../common/dc-key/keyManager";
import { SymmetricKey } from "../threaddb/common/key";
import { peerIdFromString } from "@libp2p/peer-id";
import { Client } from "../../common/dcapi";
import { dc_protocol } from "../../common/define";

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
  ErrAccountPrivateSignIsNull: new AccountError(
    "account privatekey sign is null"
  ),
  // 公钥唯恐
  ErrAccountPublicKeyIsNull: new AccountError("account publickey is null"),
};
export class AccountManager {
  dc: DcUtil;
  chainUtil: ChainUtil | undefined;
  context: DCContext;
  constructor(context: DCContext) {
    this.dc = context.dcutil;
    this.chainUtil = context.dcChain;
    this.context = context;
  }

  // 获取用户备用节点
  getAccountNodeAddr = async (): Promise<[Multiaddr | null, Error | null]> => {
    if (!this.context.connectedDc.client) {
      console.error("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if (!this.context) {
      console.error("context is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    const pubkeyRaw = this.context.getPubkeyRaw();
    const peerAddrs = await this.chainUtil.getAccountPeers(pubkeyRaw);
    if (peerAddrs && peerAddrs.length > 0) {
      // 连接备用节点
      const nodeAddr = await this.dc?._connectPeers(peerAddrs);
      if (nodeAddr) {
        return [nodeAddr, null];
      }
    }
    return [null, Errors.ErrNoAccountPeerConnected];
  };
  // 获取用户信息
  getUserInfoWithNft = async (
    nftAccount: string
  ): Promise<[User | null, Error | null]> => {
    if (!this.context.connectedDc.client) {
      console.error("dcClient is null");
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    // 从链上获取
    const userInfo = await this.chainUtil.getUserInfoWithNft(nftAccount);
    return [userInfo, null];
  };
  bindAccessPeerToUser = async (
    peerAddr: Multiaddr
  ): Promise<[boolean | null, Error | null]> => {
    if (!this.context.connectedDc.client) {
      console.error("dcClient is null");
      return [false, Errors.ErrNoDcPeerConnected];
    }
    if (!this.chainUtil) {
      console.error("chainUtil is null");
      return [null, Errors.ErrChainUtilIsNull];
    }
    if (!this.context) {
      console.error("context is null");
      return [null, Errors.ErrAccountPrivateSignIsNull];
    }
    const peerId = peerAddr.getPeerId();
    if (!peerId) {
      console.error("peerId is null");
      return [null, Errors.ErrNoAccountPeerConnected];
    }
    // 绑定节点
    const blockHeight = await this.chainUtil.getBlockHeight();
    const accountClient = new AccountClient(this.context.connectedDc.client);
    const bindResult = await accountClient.bindAccessPeerToUser(
      this.context,
      blockHeight ? blockHeight : 0,
      peerId.toString()
    );
    return [true, null];
  };

  /**
   * 将私钥绑定NFT账号(NFT账号+密码+安全码)
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param isParent 是否为主账号
   * @param mnemonic 助记词
   * @returns [状态码, 错误信息]
   */
  async bindNFTAccount(
    account: string,
    password: string,
    seccode: string,
    isParent: boolean,
    mnemonic?: string
  ): Promise<[NFTBindStatus, Error | null]> {
    // 检查节点连接
    if (!this.context.connectedDc.client) {
      return [NFTBindStatus.DcPeerNotConnected, Errors.ErrNoDcPeerConnected];
    }
    if (!this.context.connectedDc.nodeAddr) {
      return [NFTBindStatus.DcPeerNotConnected, Errors.ErrNodeAddrIsNull];
    }

    try {
      const connectedPeerIdStr = this.context.connectedDc.nodeAddr.getPeerId();
      if (!connectedPeerIdStr) {
        return [NFTBindStatus.DcPeerNotConnected, Errors.ErrNodeAddrIsNull];
      }
      const connectedPeerId = peerIdFromString(connectedPeerIdStr);
      // 生成账户请求
      const [req, status] = await this.generateAccountDealRequest(
        account,
        password,
        seccode,
        connectedPeerId,
        isParent,
        mnemonic
      );

      if (status !== NFTBindStatus.Success) {
        return [
          status,
          new AccountError(`Failed to generate account request: ${status}`),
        ];
      }

      // 获取客户端
      const accountClient = new AccountClient(this.context.connectedDc.client);
      // 调用账户绑定API
      await accountClient.accountBind(req, mnemonic, this.context);

      // 绑定成功
      return [NFTBindStatus.Success, null];
    } catch (error) {
      // 错误处理，匹配各种特定错误类型
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("user already binded")) {
        return [
          NFTBindStatus.UserBinded,
          error instanceof Error ? error : new Error(errorMsg),
        ];
      } else if (errorMsg.includes("account already binded")) {
        return [
          NFTBindStatus.NftAccountBinded,
          error instanceof Error ? error : new Error(errorMsg),
        ];
      } else if (errorMsg.includes("user space expired")) {
        return [
          NFTBindStatus.SpaceExpired,
          error instanceof Error ? error : new Error(errorMsg),
        ];
      } else if (errorMsg.includes("no enough user space")) {
        return [
          NFTBindStatus.NoLeftSpace,
          error instanceof Error ? error : new Error(errorMsg),
        ];
      } else {
        console.error("NFT账号绑定失败:", error);
        return [
          NFTBindStatus.Error,
          error instanceof Error ? error : new Error(errorMsg),
        ];
      }
    }
  }

  /**
   * 生成Nft账号处理的请求（包括绑定NFT账号以及修改账号对应的登录信息）,
   * 如果登录账号的助记词存在，则使用助记词进行绑定，否则使用私钥进行绑定
   *
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param serverPid 服务器节点ID
   * @param isParent 是否为父账户
   * @returns [AccountDealRequest对象, 状态码]
   */
  private async generateAccountDealRequest(
    account: string,
    password: string,
    seccode: string,
    serverPid: PeerId,
    isParent: boolean,
    mnemonic?: string
  ): Promise<
    [
      {
        accounthashencrypt: Uint8Array;
        accountencrypt: Uint8Array;
        prikeyencrypt2: Uint8Array;
        blockheight: number;
        loginkeyrandencrypt: Uint8Array;
        peerid: Uint8Array;
        signature: Uint8Array;
      } | null,
      NFTBindStatus
    ]
  > {
    try {
      if (isParent && !mnemonic) {
        return [null, NFTBindStatus.Error];
      }

      // 确定要加密的内容（私钥或助记词）
      let needEncryptStr = "";
      if (isParent) {
        needEncryptStr = `mnemonic:${mnemonic}`;
      } else {
        if (!this.context.privateKey) {
          return [null, NFTBindStatus.Error];
        }
        needEncryptStr = `privatekey:${this.context.privateKey.string()}`;
      }

      // 哈希账号
      const accountBytes = new TextEncoder().encode(account);
      const accountHash = await crypto.subtle.digest("SHA-256", accountBytes);
      const accountHashArray = new Uint8Array(accountHash);

      // 获取节点公钥
      const serverPubkey = await extractPublicKeyFromPeerId(serverPid);
      if (!serverPubkey) {
        return [null, NFTBindStatus.Error];
      }

      // 确定使用的密钥
      // 生成
      const keymanager = new KeyManager();
      let selfPrivkey: Ed25519PrivKey | null | undefined;
      if (isParent && mnemonic) {
        selfPrivkey = await keymanager.getEd25519KeyFromMnemonic(mnemonic, "");
      } else {
        selfPrivkey = this.context.privateKey;
      }

      if (!selfPrivkey) {
        return [null, NFTBindStatus.Error];
      }
      const selfPubkey = selfPrivkey.publicKey;

      // 用自身公钥加密账号
      const accountEncrypt = await selfPubkey.encrypt(
        new TextEncoder().encode(account)
      );
      if (!accountEncrypt) {
        return [null, NFTBindStatus.EncryptError];
      }

      // 用服务器公钥加密账号哈希
      const accountHashCrypt = await serverPubkey.encrypt(accountHashArray);
      if (!accountHashCrypt) {
        return [null, NFTBindStatus.EncryptError];
      }
      // 生成对称密钥
      const aeskey = await generateSymKeyForPrikey(account, password);
      if (!aeskey) {
        return [null, NFTBindStatus.EncryptError];
      }
      const encryptKey = SymmetricKey.fromSymKey(aeskey);
      // 用对称密钥加密私钥/助记词
      const prikeyencrypt = await encryptKey.encrypt(
        new TextEncoder().encode(needEncryptStr)
      );
      if (!prikeyencrypt) {
        return [null, NFTBindStatus.EncryptError];
      }
      // 用服务器公钥再次加密
      const prikeyencrypt2 = await serverPubkey.encrypt(prikeyencrypt);
      if (!prikeyencrypt2) {
        return [null, NFTBindStatus.EncryptError];
      }
      // 获取区块链高度
      if (!this.chainUtil) {
        return [null, NFTBindStatus.BlockchainError];
      }

      const blockHeight = await this.chainUtil.getBlockHeight();
      if (blockHeight === undefined) {
        return [null, NFTBindStatus.BlockchainError];
      }

      // 生成随机密钥
      const randKey = new Uint8Array(32);
      crypto.getRandomValues(randKey);

      // 生成登录密钥
      const passwordBytes = new TextEncoder().encode(password);
      const passwordHashBytes = new Uint8Array(
        await crypto.subtle.digest("SHA-256", passwordBytes.slice(0, 2))
      );

      // 组合登录密钥种子
      const loginKeySeed = new Uint8Array(
        accountHashArray.length + 2 + new TextEncoder().encode(seccode).length
      );
      loginKeySeed.set(accountHashArray, 0);
      loginKeySeed.set(passwordHashBytes.slice(-2), accountHashArray.length);
      loginKeySeed.set(
        new TextEncoder().encode(seccode),
        accountHashArray.length + 2
      );

      // 计算登录密钥
      const loginKeyHash = await crypto.subtle.digest("SHA-256", loginKeySeed);
      const loginkey = new Uint8Array(loginKeyHash);

      // 加密登录密钥和随机密钥
      const loginRandKey = new Uint8Array(loginkey.length + randKey.length);
      loginRandKey.set(loginkey, 0);
      loginRandKey.set(randKey, loginkey.length);

      const loginkeyRandEncrypt = await serverPubkey.encrypt(loginRandKey);
      if (!loginkeyRandEncrypt) {
        return [null, NFTBindStatus.EncryptError];
      }

      // 准备签名数据
      const serverPidBytes = new TextEncoder().encode(serverPid.toString());
      const prikeyencryptHash = new Uint8Array(
        await crypto.subtle.digest("SHA-256", prikeyencrypt as any)
      );

      // 区块高度转为小端字节序
      const hvalue = uint32ToLittleEndianBytes(blockHeight);

      // 组合预签名数据
      const preSign = new Uint8Array(
        accountHashArray.length +
          accountEncrypt.length +
          prikeyencryptHash.length +
          hvalue.length +
          serverPidBytes.length
      );

      let offset = 0;
      preSign.set(accountHashArray, offset);
      offset += accountHashArray.length;
      preSign.set(accountEncrypt, offset);
      offset += accountEncrypt.length;
      preSign.set(prikeyencryptHash, offset);
      offset += prikeyencryptHash.length;
      preSign.set(hvalue, offset);
      offset += hvalue.length;
      preSign.set(serverPidBytes, offset);

      // 签名
      let signature: Uint8Array;
      if (selfPrivkey != null) {
        signature = selfPrivkey.sign(preSign);
      } else {
        signature = await this.context.sign(preSign);
      }
      if (!signature) {
        return [null, NFTBindStatus.SignError];
      }
      // 创建请求对象
      const req = {
        accounthashencrypt: accountHashCrypt,
        accountencrypt: accountEncrypt,
        prikeyencrypt2: prikeyencrypt2,
        blockheight: blockHeight,
        loginkeyrandencrypt: loginkeyRandEncrypt,
        peerid: serverPidBytes,
        signature: signature,
      };

      return [req, NFTBindStatus.Success];
    } catch (error) {
      console.error("生成账户请求失败:", error);
      return [null, NFTBindStatus.Error];
    }
  }

  /**
   * 检查NFT账号是否成功绑定到用户的公钥
   * @param nftAccount NFT账号
   * @param pubKeyStr 公钥字符串
   * @returns 是否成功绑定
   */
  async isNftAccountBindSuccess(
    nftAccount: string,
    pubKeyStr: string
  ): Promise<boolean> {
    try {
      if (!this.chainUtil || !this.chainUtil.dcchainapi) {
        return false;
      }
      const accountBytes = new TextEncoder().encode(nftAccount);
      const accountHash = await sha256(accountBytes);
      const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
      const walletAccount = await (
        this.chainUtil.dcchainapi?.query as any
      ).dcNode.nftToWalletAccount(nftHexAccount);
      // 比较公钥
      return (
        walletAccount.toString() ==
        (pubKeyStr.indexOf("0x") === 0 ? pubKeyStr : "0x" + pubKeyStr)
      );
    } catch (error) {
      console.error("检查NFT账号绑定状态失败:", error);
      return false;
    }
  }

  /**
   * 检查NFT账号是否已经被绑定
   * @param nftAccount NFT账号
   * @returns 是否被其他账号绑定
   */
  async isNftAccountBinded(nftAccount: string): Promise<boolean> {
    try {
      if (!this.chainUtil || !this.chainUtil.dcchainapi) {
        return false;
      }
      const accountBytes = new TextEncoder().encode(nftAccount);
      const accountHash = await sha256(accountBytes);
      const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
      const walletAccount = await (
        this.chainUtil.dcchainapi?.query as any
      ).dcNode.nftToWalletAccount(nftHexAccount);
      if (!walletAccount.toString()) {
        return false;
      }
    } catch (error) {
      console.error("检查NFT账号绑定状态失败:", error);
      return false;
    }
    return true;
  }

  /**
   * 创建子账号，只有带有助记词的用户才能创建子账号
   * 子账号创建后，用助记词登陆子账号App，与调用登陆了主账号的App进行授权登陆，是同一个用户
   *
   * @param appId 应用ID
   * @returns [私钥字符串,基于base32编码, 错误]
   */
  async generateAppAccount(
    appId: string,
    mnemonic: string
  ): Promise<[string | null, Error | null]> {
    if (!mnemonic) {
      return [null, new AccountError("Mnemonic is required")];
    }
    if (!appId) {
      return [null, new AccountError("App ID is required")];
    }
    if (!this.context.connectedDc.nodeAddr) {
      return [null, new AccountError("No connected node")];
    }
    let subPrivateKey: Ed25519PrivKey;
    try {
      // 生成有效的应用子账号
      const keymanager = new KeyManager();
      subPrivateKey = await keymanager.getEd25519KeyFromMnemonic(
        mnemonic,
        appId
      );
      // 获取公钥
      const subPubkey = subPrivateKey.publicKey;
      const existFlag = await this.isAppAccountExists(subPubkey.toString());
      if (existFlag) {
        return [subPrivateKey.string(), null];
      }
      // 获取当前区块高度
      const blockHeight = await this.chainUtil?.getBlockHeight();
      if (blockHeight === undefined) {
        return [null, new AccountError("Failed to get blockchain height")];
      }
      // 获取服务器节点ID
      const serverPidStr = this.context.connectedDc.nodeAddr.getPeerId();
      if (!serverPidStr) {
        return [null, new AccountError("No connected peer ID")];
      }
      const serverPidBytes = new TextEncoder().encode(serverPidStr);

      // 生成签名数据
      const hvalue = uint32ToLittleEndianBytes(blockHeight);

      // 组合预签名数据: subPubkey + blockHeight + peerid
      const preSign = new Uint8Array(
        subPubkey.raw.length + hvalue.length + serverPidBytes.length
      );

      let offset = 0;
      preSign.set(subPubkey.raw, offset);
      offset += subPubkey.raw.length;
      preSign.set(hvalue, offset);
      offset += hvalue.length;
      preSign.set(serverPidBytes, offset);

      // 使用父私钥签名
      const privateKey = await keymanager.getEd25519KeyFromMnemonic(
        mnemonic,
        ""
      );
      const signature = privateKey.sign(preSign);
      if (!signature) {
        return [
          null,
          new AccountError("Failed to sign with parent private key"),
        ];
      }

      // 获取token
      if (!this.context.connectedDc.client) {
        throw [null, Errors.ErrNoAccountPeerConnected];
      }
      if (this.context.connectedDc.client.token == "") {
        const token = await this.context.connectedDc.client.GetToken(
          this.context.appInfo.appId || "",
          privateKey.publicKey.string(),
          async (payload: Uint8Array): Promise<Uint8Array> => {
            return privateKey.sign(payload);
          }
        );
        if (!token) {
          return [null, new AccountError("Failed to get token")];
        }
      }

      // 创建请求对象
      const req = {
        subpubkey: subPubkey.raw,
        blockheight: blockHeight,
        peerid: serverPidBytes,
        signature: signature,
      };

      const client = new AccountClient(this.context.connectedDc.client);
      // 添加子公钥
      await client.addSubPubkey(req);
      // Wait for app account creation
      let waitCount = 0;
      while (true) {
        // Check if app account exists
        try {
          const accountExists = await this.isAppAccountExists(
            subPubkey.toString()
          );
          if (accountExists) {
            break;
          }
        } catch (err) {
          console.warn("Error checking app account status:", err);
        }
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        waitCount++;
        if (waitCount > 30) {
          try {
            const accountExists = await this.isAppAccountExists(
              subPubkey.toString()
            );
            if (accountExists) {
              break;
            }
          } catch (err) {
            // Ignore error on final check
          }
          // Timeout after ~30 seconds
          return [null, new AccountError("Wait app account create timeout")];
        }
      }
      // 返回编码后的私钥
      return [subPrivateKey.string(), null];
    } catch (error) {
      console.error("Failed to generate app account:", error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  /**
   * Check if an application account exists
   * @param pubkeyStr The public key string of the account to check
   * @returns True if the account exists, false otherwise
   */
  private async isAppAccountExists(pubkeyStr: string): Promise<boolean> {
    try {
      const account =
        pubkeyStr.indexOf("0x") === 0 ? pubkeyStr : "0x" + pubkeyStr;
      const user = await this.context.dcChain?.getUserInfoWithAccount(account);
      return !!user;
    } catch (error) {
      return false;
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
  async setUserDefaultDB(
    threadId: string,
    rk: string,
    sk: string,
    remark: string,
    vaccount?: string
  ): Promise<void> {
    if (!this.context.publicKey) {
      throw Errors.ErrAccountPublicKeyIsNull;
    }
    if (!this.context.connectedDc.client) {
      throw Errors.ErrNoDcPeerConnected;
    }
    if (!this.context.connectedDc.nodeAddr) {
      throw Errors.ErrNodeAddrIsNull;
    }
    const dbinfo = threadId + "|" + rk + "|" + sk + "|" + remark;
    const dbinfocrypto = await this.context.publicKey.encrypt(
      new TextEncoder().encode(dbinfo)
    );
    const blockHeight = await this.chainUtil?.getBlockHeight();
    if (blockHeight === undefined) {
      throw new AccountError("Failed to get blockchain height");
    }
    if (this.context.connectedDc.client.token == "") {
      const token = await this.context.connectedDc.client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        async (payload: Uint8Array): Promise<Uint8Array> => {
          return this.context.sign(payload);
        }
      );
      if (!token) {
        throw new AccountError("Failed to get token");
      }
    }
    const accountClient = new AccountClient(this.context.connectedDc.client);
    const serverPidStr = this.context.connectedDc.nodeAddr.getPeerId() || "";
    const serverPidBytes = new TextEncoder().encode(serverPidStr);
    // 生成签名数据
    const hvalue = uint32ToLittleEndianBytes(blockHeight);
    // 组合预签名数据: subPubkey + blockHeight + peerid
    const preSign = new Uint8Array(
      dbinfocrypto.length + hvalue.length + serverPidBytes.length
    );
    let offset = 0;
    preSign.set(dbinfocrypto, offset);
    offset += dbinfocrypto.length;
    preSign.set(hvalue, offset);
    offset += hvalue.length;
    preSign.set(serverPidBytes, offset);
    // 使用私钥签名
    const signature = await this.context.sign(preSign);

    await accountClient.setUserDefaultDB(
      dbinfocrypto,
      blockHeight ? blockHeight : 0,
      serverPidStr,
      signature,
      vaccount
    );
    return;
  }

  /**
   * NFT账号密码修改，如果是主账号登录，则修改主账号密码，如果是子账号登录，则修改子账号密码
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param isParent 是否为主账号
   * @param mnemonic 助记词（如果是主账号）
   */
  async nftAccountPasswordModify(
    account: string,
    password: string,
    seccode: string,
    isParent: boolean,
    mnemonic?: string
  ): Promise<Error | null> {
    if (!this.context.publicKey) {
      return Errors.ErrAccountPublicKeyIsNull;
    }

    // 链上钱包账号对应的peers是否为空，如果为空，则修改请求变为绑定请求
    const [userInfo, err] = await this.getUserInfoWithNft(account);
    if (err) {
      return err;
    }

    if (!userInfo || !userInfo.peers || userInfo.peers.length === 0) {
      // 发起绑定让用户绑定到指定的节点
      // 如果是主账号或者没有助记词，无法进行绑定操作（因为绑定需要助记词）
      // 但根据Go代码逻辑，这里直接调用 BindNFTAccount，Go代码中 BindNFTAccount 似乎不需要 mnemonic 如果是子账号？
      // Go代码: dc.BindNFTAccount(account, password, seccode)
      // Go的 BindNFTAccount 实现里: if isParent && len(dc.Mnemonic) == 0 { return nil, StatusNoMnemonic }
      // 所以如果 isParent 为 false，它使用 private key。

      // 修正：为了保持一致性，我应该重构 bindNFTAccount。
      // 但现在我先实现主要逻辑。
      if (!isParent && !this.context.privateKey) {
        // 子账号尝试绑定，需要修改 bindNFTAccount 支持无 mnemonic
        // 暂时返回错误
        return new Error("Cannot bind account without mnemonic or private key");
      }

      const [status, err] = await this.bindNFTAccount(
        account,
        password,
        seccode,
        isParent,
        mnemonic
      );
      if (err) {
        return err;
      }
      if (status !== NFTBindStatus.Success) {
        return new Error(`Bind failed with status: ${status}`);
      }
      return null;
    }

    // 遍历所有账号所在节点，尝试建立连接
    const peers = userInfo.peers;
    for (const peerIdStr of peers) {
      try {
        const peerId = peerIdFromString(peerIdStr);
        // 连接节点
        const connected = await this.dc.connectToPeer(peerIdStr);
        if (!connected) {
          continue;
        }

        // 获取 client
        const nodeAddr = await this.dc._getNodeAddr(peerIdStr);
        if (!nodeAddr) {
          continue;
        }

        const client = new Client(
          this.context.dcNodeClient.libp2p,
          this.context.dcNodeClient.blockstore,
          nodeAddr,
          dc_protocol
        );

        // 刷新 token
        // identity logic from Go: identity := dc.Identity; if isParent { identity = dc.ParentIdentity }
        // In TS, we use context.publicKey or derived key.
        // refreshToken needs pubkey and sign callback.

        let pubkeyStr = "";
        let signCallback: (payload: Uint8Array) => Promise<Uint8Array>;

        if (isParent && mnemonic) {
          const keymanager = new KeyManager();
          const privKey = await keymanager.getEd25519KeyFromMnemonic(
            mnemonic,
            ""
          );
          pubkeyStr = privKey.publicKey.string();
          signCallback = async (payload) => privKey.sign(payload);
        } else {
          if (!this.context.publicKey) continue;
          pubkeyStr = this.context.publicKey.string();
          signCallback = async (payload) => this.context.sign(payload);
        }

        await client.refreshToken(
          this.context.appInfo.appId || "",
          pubkeyStr,
          signCallback
        );

        // 生成请求
        const [req, status] = await this.generateAccountDealRequest(
          account,
          password,
          seccode,
          peerId,
          isParent,
          mnemonic
        );

        if (status !== NFTBindStatus.Success || !req) {
          continue;
        }

        // 发送请求
        const accountClient = new AccountClient(client);
        await accountClient.accountInfoModify(req);

        // 只要有一个成功就返回？Go代码是:
        // for client := range connected { ... if err == nil { return } }
        // 是的，只要成功一个就返回。
        return null;
      } catch (e) {
        console.error(`Failed to modify password on peer ${peerIdStr}:`, e);
        continue;
      }
    }

    return new Error("Failed to modify password on any peer");
  }
}
