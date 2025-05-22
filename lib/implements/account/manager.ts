import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { DCConnectInfo, User } from "../../common/types/types";
import { AccountClient } from "./client";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { Ed25519PrivKey } from "lib";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { PeerId } from "@libp2p/interface";
import { extractPublicKeyFromPeerId, generateSymKeyForPrikey, KeyManager } from "../../common/dc-key/keyManager";
import { SymmetricKey } from "../threaddb/common/key";
import { peerIdFromString } from "@libp2p/peer-id";
import { request } from "http";

export enum NFTBindStatus {
  Success = 0,
  UserBinded = 1,           // 用户已绑定其他nft账号
  NftAccountBinded = 2,     // nft账号已经被其他用户绑定
  NoBcAccount = 3,          // 区块链账号不存在
  DcPeerNotConnected = 4,   // 还没有建立到存储节点的连接
  EncryptError = 5,         // 加密数据过程出错
  BlockchainError = 6,      // 区块链相关错误
  SignError = 7,            // 签名错误
  SpaceExpired = 8,         // 用户有效期已过
  NoLeftSpace = 9,          // 空间不足
  NetworkErr = 10,          // 网络错误
  Error = 99                // 其他异常
}
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
    const accountClient = new AccountClient(
      this.connectedDc.client,
    );
    const bindResult = await accountClient.bindAccessPeerToUser(this.context,
      blockHeight ? blockHeight : 0, 
      peerId.toString()
    );
    console.log("bindAccessPeerToUser bindResult:", bindResult);
    return [true, null];
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
  
  // 检查区块链账户
  const pubKey = this.context.getPublicKey();
  if (!pubKey) {
    return [NFTBindStatus.NoBcAccount, new AccountError("No blockchain account available")];
  }
  // 检查节点连接
  if (!this.connectedDc.client) {
    return [NFTBindStatus.DcPeerNotConnected, Errors.ErrNoDcPeerConnected];
  }
  
  try {
    const connectedPeerIdStr = this.connectedDc.nodeAddr.getPeerId();
    if (!connectedPeerIdStr) {
      return [NFTBindStatus.DcPeerNotConnected, Errors.ErrNodeAddrIsNull];
    }
    const connectedPeerId = peerIdFromString(connectedPeerIdStr);
    // 生成账户请求
    const [req, status] = await this.generateAccountDealRequest(
      account, 
      password, 
      seccode, 
      mnemonic,
      connectedPeerId, 
    );
    
    if (status !== NFTBindStatus.Success) {
      return [status, new AccountError(`Failed to generate account request: ${status}`)];
    }
    
    // 获取客户端
    const accountClient = new AccountClient(
      this.connectedDc.client,
    );
    // 调用账户绑定API
    await accountClient.accountBind(this.context, req);
    
    // 绑定成功
    return [NFTBindStatus.Success, null];
    
  } catch (error) {
    // 错误处理，匹配各种特定错误类型
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes("user already binded")) {
      return [NFTBindStatus.UserBinded, error instanceof Error ? error : new Error(errorMsg)];
    } else if (errorMsg.includes("account already binded")) {
      return [NFTBindStatus.NftAccountBinded, error instanceof Error ? error : new Error(errorMsg)];
    } else if (errorMsg.includes("user space expired")) {
      return [NFTBindStatus.SpaceExpired, error instanceof Error ? error : new Error(errorMsg)];
    } else if (errorMsg.includes("no enough user space")) {
      return [NFTBindStatus.NoLeftSpace, error instanceof Error ? error : new Error(errorMsg)];
    } else {
      console.error("NFT账号绑定失败:", error);
      return [NFTBindStatus.Error, error instanceof Error ? error : new Error(errorMsg)];
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
  mnemonic: string,
  serverPid: PeerId,
): Promise<[any, NFTBindStatus]> {
  try {
    
    // 确定要加密的内容（私钥或助记词）
    const needEncryptStr = `mnemonic:${mnemonic}`;
    // 哈希账号
    const accountBytes = new TextEncoder().encode(account);
    const accountHash = await crypto.subtle.digest('SHA-256', accountBytes);
    const accountHashArray = new Uint8Array(accountHash);

    // 获取节点公钥
    const serverPubkey = await  extractPublicKeyFromPeerId(serverPid);
    if (!serverPubkey) {
      return [null, NFTBindStatus.Error];
    }

    // 确定使用的密钥
    let selfPubkey, selfPrivkey;
    selfPubkey = this.context.publicKey;
    selfPrivkey = this.context.privKey;
    
    if (!selfPubkey || !selfPrivkey) {
      return [null, NFTBindStatus.Error];
    }

    // 用自身公钥加密账号
    const accountEncrypt = await selfPubkey.encrypt(new TextEncoder().encode(account));
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
    const prikeyencrypt = await encryptKey.encrypt(new TextEncoder().encode(needEncryptStr));
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
    const passwordHashBytes = new Uint8Array(await crypto.subtle.digest('SHA-256', passwordBytes.slice(0, 2)));
    
    // 组合登录密钥种子
    const loginKeySeed = new Uint8Array(
      accountHashArray.length + 2 + new TextEncoder().encode(seccode).length
    );
    loginKeySeed.set(accountHashArray, 0);
    loginKeySeed.set(passwordHashBytes.slice(-2), accountHashArray.length);
    loginKeySeed.set(new TextEncoder().encode(seccode), accountHashArray.length + 2);
    
    // 计算登录密钥
    const loginKeyHash = await crypto.subtle.digest('SHA-256', loginKeySeed);
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
    const prikeyencryptHash = new Uint8Array(await crypto.subtle.digest('SHA-256', prikeyencrypt));
    
    // 区块高度转为小端字节序
    const hvalue = uint32ToLittleEndianBytes(blockHeight);
    
    // 组合预签名数据
    const preSign = new Uint8Array(
      accountHashArray.length + accountEncrypt.length + 
      prikeyencryptHash.length + hvalue.length + serverPidBytes.length
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
    const signature = await selfPrivkey.sign(preSign);
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
      signature: signature
    };

    return [req, NFTBindStatus.Success];
  } catch (error) {
    console.error("生成账户请求失败:", error);
    return [null, NFTBindStatus.Error];
  }
}


/**
 * 检查NFT账号是否成功绑定到用户的公钥
 * @param account NFT账号
 * @returns 是否成功绑定
 */
async isNftAccountBindSuccess(account: string): Promise<boolean> {
  try {
    if (!this.chainUtil && !this.chainUtil.dcchainapi) {
      return false;
    }
    const accountBytes = new TextEncoder().encode(account);
    const accountHash = await sha256(accountBytes);
    const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
    const walletAccount = await this.chainUtil.dcchainapi?.query.dcNode.nftToWalletAccount(nftHexAccount);
    // 比较公钥
    return walletAccount.toString() == "0x" + this.context.publicKey.toString();
  } catch (error) {
    console.error("检查NFT账号绑定状态失败:", error);
    return false;
  }
}


/**
 * 检查NFT账号是否已经被绑定
 * @param account NFT账号
 * @returns 是否被其他账号绑定
 */
async isNftAccountBinded(account: string): Promise<boolean> {
  try {
    if (!this.chainUtil && !this.chainUtil.dcchainapi) {
      return false;
    }
    const accountBytes = new TextEncoder().encode(account);
    const accountHash = await sha256(accountBytes);
    const nftHexAccount = "0x" + Buffer.from(accountHash).toString("hex");
    const walletAccount = await this.chainUtil.dcchainapi?.query.dcNode.nftToWalletAccount(nftHexAccount);
    if (!walletAccount) {
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
 * @returns [私钥字符串, 错误]
 */
async generateAppAccount(appId: string,mnemonic: string): Promise<[string | null, Error | null]> {
  if (!mnemonic) {
    return [null, new AccountError("Mnemonic is required")];
  }
  if (!appId) {
    return [null, new AccountError("App ID is required")];
  }
  let subPrivateKey:Ed25519PrivKey
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
    const serverPidStr = this.connectedDc.nodeAddr.getPeerId();
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
    const signature =  await this.context.sign(preSign);
    if (!signature) {
      return [null, new AccountError("Failed to sign with parent private key")];
    }
    
    // 创建请求对象
    const req = {
      subpubkey: subPubkey.raw,
      blockheight: blockHeight,
      peerid: serverPidBytes,
      signature: signature
    };
    
     const client = new AccountClient(
      this.connectedDc.client,
    );
   
    // 添加子公钥
    await client.addSubPubkey(req);
    // Wait for app account creation
    let waitCount = 0;
    while (true) {
      // Check if app account exists
      try {
        const accountExists = await this.isAppAccountExists(subPubkey.toString());
        if (accountExists) {
          break;
        }
      } catch (err) {
        console.warn("Error checking app account status:", err);
      }
      // Sleep for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      waitCount++;
      if (waitCount > 30) {
        try {
          const accountExists = await this.isAppAccountExists(subPubkey.toString());
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
    const user = await this.context.dcChain?.getUserInfoWithAccount(pubkeyStr);
    return !!user;
  } catch (error) {
    return false;
  }
}






}
