import { DCConnectInfo, User } from "lib/common/types/types";
import { NFTBindStatus } from "lib/implements/account/manager";



/**
 * 认证操作接口
 * 处理用户身份验证、账户管理和访问控制
 */
export interface IAuthOperations {
  /**
   * 获取存储的token
   * @param peerId 节点ID
   */
  getSavedToken(peerId: string): Promise<void>;
  
  /**
   * 账户登录
   * @param nftAccount NFT账户
   * @param password 密码
   * @param safecode 安全码
   * @returns 是否登录成功
   */
  accountLogin(nftAccount: string, password: string, safecode: string): Promise<boolean>;
  
  /**
   * 签名数据
   * @param payload 要签名的数据
   * @returns 签名结果
   */
  sign(payload: Uint8Array): Promise<Uint8Array>;
  
  /**
   * 将私钥绑定NFT账号
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param mnemonic 助记词
   * @returns [状态码, 错误信息]
   */
  bindNFTAccount(account: string, password: string, seccode: string, mnemonic: string): Promise<[NFTBindStatus, Error | null]>;
  
  /**
   * 创建子账号
   * @param appId 应用ID
   * @param mnemonic 助记词
   * @returns [私钥字符串, 错误]
   */
  generateAppAccount(appId: string, mnemonic: string): Promise<[string | null, Error | null]>;
  
  /**
   * 检查NFT账号是否成功绑定到用户的公钥
   * @param account NFT账号
   * @returns 是否成功绑定
   */
  isNftAccountBindSuccess(account: string): Promise<boolean>;
  
  /**
   * 检查NFT账号是否已经被绑定
   * @param account NFT账号
   * @returns 是否被其他账号绑定
   */
  isNftAccountBinded(account: string): Promise<boolean>;
  
  /**
   * 获取用户钱包信息
   * @param account 账户名
   * @returns 用户信息
   */
  getUserInfoWithAccount(account: string): Promise<User>;
  
  /**
   * 开启定时验证token线程
   */
  startDcPeerTokenKeepValidTask(): void;
  
  /**
   * 停止token验证任务
   */
  stopTokenKeepValidTask(): void;
  
  /**
   * 获取或刷新指定连接信息的Token
   * @param connectInfo 连接信息
   */
  getTokenWithDCConnectInfo(connectInfo: DCConnectInfo): Promise<void>;
  
  /**
   * 获取用户信息
   * @param nftAccount NFT账户
   * @returns 用户信息
   */
  getUserInfoWithNft(nftAccount: string): Promise<any>;
  
  /**
   * 检查用户空间是否足够
   * @param needSize 需要的空间大小
   * @returns 空间信息
   */
  ifEnoughUserSpace(needSize?: number): Promise<any>;
  
  /**
   * 刷新用户信息
   * @returns 用户信息
   */
  refreshUserInfo(): Promise<any>;
}