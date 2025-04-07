import { ChainUtil } from "../chain";
import { DCConnectInfo, SignHandler, User } from "../types/types";
import * as buffer from "buffer/";
const { Buffer } = buffer;
// 错误定义
export class DCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DCError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new DCError("no dc peer connected"),
  ErrGetUserInfoError: new DCError("get user info error"),
};

export class BCManager {
  public connectedDc: DCConnectInfo = {};
  signHandler: SignHandler;
  chainUtil: ChainUtil;
  constructor(
    connectedDc: DCConnectInfo,
    chainUtil: ChainUtil,
    signHandler: SignHandler
  ) {
    this.connectedDc = connectedDc;
    this.chainUtil = chainUtil;
    this.signHandler = signHandler;
  }

  ifEnoughUserSpace = async (
    needSize?: number
  ): Promise<[boolean | null, Error | null]> => {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const pubkeyRaw = this.signHandler.getPubkeyRaw();
    const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
    // 获取用户存储空间
    const userInfo = await this.chainUtil.getUserInfoWithAccount(
      hexAccount
    );
    if (!userInfo) {
      return [null, Errors.ErrGetUserInfoError];
    }

    // 用户冻结
    if (userInfo.commentFrozenStatus != 0 || userInfo.spamFrozenStatus != 0) {
      return [false, null];
    }

    // 过期高度判断
    const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
    if (userInfo.expireNumber > 0 && userInfo.expireNumber < blockHeight) {
      return [false, null];
    }

    // 用户存储空间判断
    const needSizeNumber = needSize || 1024 * 1024; // 1M
    if (userInfo.subscribeSpace - userInfo.usedSpace < needSizeNumber) {
      return [false, null];
    }

    return [true, null];
  };

  refreshUserInfo = async (): Promise<[User, Error | null]> => {
    const pubkeyRaw = this.signHandler.getPubkeyRaw();
    const hexAccount = "0x" + Buffer.from(pubkeyRaw).toString("hex");
    const userInfo = await this.chainUtil.getUserInfoWithAccount(hexAccount);
    return [userInfo, null];
  };

  getBlockHeight = async (): Promise<[number, Error | null]> => {
    const blockHeight = await this.chainUtil.getBlockHeight() || 0;
    return [blockHeight, null];
  };
}
