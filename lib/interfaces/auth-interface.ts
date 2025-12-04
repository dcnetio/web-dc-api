import {
  DCConnectInfo,
  NFTBindStatus,
  User,
  Account,
  AccountInfo,
  SignReqMessage,
  SignResponseMessage,
  EIP712SignReqMessage,
} from "../common/types/types";

/**
 * 认证操作接口
 * 处理用户身份验证、账户管理和访问控制
 */
export interface IAuthOperations {
  /**
   * 账户登录通过钱包
   * @returns 是否登录成功
   */
  accountLoginWithWallet(
    accountInfo?: AccountInfo
  ): Promise<[Account | null, Error | null]>;

  /**
   * 账户登录
   * @param nftAccount NFT账户
   * @param password 密码
   * @param safecode 安全码,默认000000
   * @returns 是否登录成功
   */
  accountLogin(
    nftAccount: string,
    password: string,
    safecode: string
  ): Promise<[string, Error | null]>;

  /**
   * 签名数据
   * @param payload 要签名的数据
   * @returns 签名结果
   */
  sign(payload: Uint8Array): Promise<[Uint8Array | null, Error | null]>;

  /**
   * 解密数据
   * @param payload 要解密的数据
   * @returns 解密结果
   */
  decryptWithWallet(
    payload: Uint8Array
  ): Promise<[Uint8Array | null, Error | null]>;

  /**
   * 将公钥绑定NFT账号
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param mnemonic 助记词,将安全存储在DC云端
   * @returns [状态码, 错误信息]
   */
  bindNFTAccount(
    account: string,
    password: string,
    seccode: string,
    mnemonic: string
  ): Promise<[NFTBindStatus | null, Error | null]>;
  /**
   * NFT账号密码修改
   * @param account NFT账号
   * @param password 密码
   * @param seccode 安全码
   * @param mnemonic 助记词 (可选，如果是主账号登录则需要)
   */
  nftAccountPasswordModify(
    account: string,
    password: string,
    seccode: string,
    mnemonic?: string
  ): Promise<[boolean | null, Error | null]>;

  /**
   * 创建APP访问账号,返回APP专用私钥
   * @param appId 应用ID
   * @param mnemonic 助记词
   * @returns [私钥字符串, 错误]
   */
  generateAppAccount(
    appId: string,
    mnemonic: string
  ): Promise<[string | null, Error | null]>;

  /**
   * 检查NFT账号是否成功绑定到当前用户的公钥
   * @param nftAccount NFT账号
   * @param pubKeyStr 公钥字符串
   * @returns 是否成功绑定
   */
  isNftAccountBindSuccess(
    nftAccount: string,
    pubKeyStr: string
  ): Promise<[boolean | null, Error | null]>;

  /**
   * 检查NFT账号是否已经被公钥绑定
   * @param nftAccount NFT账号
   * @returns 是否被其他账号绑定
   */
  isNftAccountBinded(
    nftAccount: string
  ): Promise<[boolean | null, Error | null]>;

  /**
   * 获取用户信息
   * @param nftAccount NFT账户
   * @returns 用户信息
   */
  getUserInfoWithNft(nftAccount: string): Promise<[User | null, Error | null]>;

  /**
   * 获取用户钱包信息
   * @param pubkeyAccount 账户名
   * @returns 用户信息
   */
  getUserInfoWithAccount(
    pubkeyAccount: string
  ): Promise<[User | null, Error | null]>;

  /**
   * 开启定时验证token线程
   */
  startDcPeerTokenKeepValidTask(): Promise<[boolean, Error | null]>;

  /**
   * 检查用户空间是否足够
   * @param needSize 需要的空间大小
   * @returns 空间信息
   */
  ifEnoughUserSpace(needSize?: number): Promise<[boolean | null, Error | null]>;

  /**
   * 刷新用户信息
   * @returns 用户信息
   */
  refreshUserInfo(): Promise<[User | null, Error | null]>;

  /**
   * 获取用户默认数据库
   * @param threadId 数据库ID
   * @param rk 读取密钥,主要用来加解密真正的数据,注意对数据记录进行加密和解密
   * @param sk 服务密钥,主要用来处理传输过程加解密,主要对数据链表头进行加密和解密
   * @param remark 备注信息
   * @returns 用户默认数据库信息
   */
  setUserDefaultDB(
    threadId: string,
    rk: string,
    sk: string,
    remark: string,
    vaccount?: string
  ): Promise<Error | null>;

  /**
   * 跳转到钱包进行签名
   * @param data 签名数据
      SignReqMessage: {
          type: string,
          origin: string,
          data<SignReqMessageData>:{
              appUrl: string,
              ethAccount: string,
              messageType?: string, // 'string',//string,hex,base64,eip712
              message: string,
            }
        }
   */
  signMessageWithWallet(
    data: SignReqMessage
  ): Promise<[SignResponseMessage | null, Error | null]>;

  /**
   * 跳转到钱包进行EIP712签名
   * @param data 签名数据
      EIP712SignReqMessage: {
          type: string,
          origin: string,
          data<EIP712SignReqMessageData>:{
              appUrl: string,
              ethAccount: string,
              domain: any,
              types: any,
              primaryType: string,
              message: any,
          }
      }
   */
  signEIP712MessageWithWallet(
    data: EIP712SignReqMessage
  ): Promise<[SignResponseMessage | null, Error | null]>;

  /**
   * 退出登录
   */
  exitLogin(): void;
}
