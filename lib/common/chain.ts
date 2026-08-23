/**
 * 区块链相关的方法
 */

import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { ApiPromise, WsProvider } from "@polkadot/api";

import { isUser, sha256, hexToAscii, uint8ArrayToHex, hexToUtf8 } from "../util/utils";
import { IAppInfo, User, PeerStatus } from "./types/types";

import { base32 } from "multiformats/bases/base32";
import { Ed25519PubKey } from "./dc-key/ed25519";
import {
  AppDailyLoginStats,
  AppLoginMonthComparison,
  AppLoginMonthComparisonOptions,
  AppLoginDailyStatsOptions,
  AppLoginStats,
  AppLoginStatsSnapshotLoader,
  AppLoginYearComparison,
  AppLoginYearComparisonOptions,
  buildSimulatedDayBoundaries,
  buildSimulatedMonthBoundaries,
  buildSimulatedYearBoundaries,
  createAppLoginStatsSnapshotLoader,
  createPersistentAppLoginStatsSnapshotLoader,
  loadAppLoginCalendarBoundary,
  calculateAppLoginPeriod,
  calculateAppLoginIntervals,
  codecDecimal,
  findAppLoginInfo,
} from "./app-login-stats";

export type {
  AppDailyLoginStats,
  AppLoginMonthComparison,
  AppLoginMonthComparisonOptions,
  AppLoginDailyStatsOptions,
  AppLoginStats,
  AppLoginStatsSnapshotLoader,
  AppLoginYearComparison,
  AppLoginYearComparisonOptions,
} from "./app-login-stats";

const _hexMap: Record<string, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  a: 10, b: 11, c: 12, d: 13, e: 14, f: 15,
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
};

function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2) throw new Error("hexToBytes: received invalid unpadded hex");
  
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const high = _hexMap[hex[i * 2]];
    const low = _hexMap[hex[i * 2 + 1]];
    if (high === undefined || low === undefined) {
      throw new Error("hexToBytes: received invalid hex characters");
    }
    array[i] = (high << 4) | low;
  }
  return array;
}

// 错误定义
export class ChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainError";
  }
}
export const Errors = {
  ErrWalletAccountStorageIsNull: new ChainError("walletAccountStorage is null"),
  ErrParentWalletAccountStorageIsNull: new ChainError(
    "parentWalletAccountStorage is null"
  ),
  ErrUserInfoIsNull: new ChainError("userInfo is null"),
  ErrWalletAccountStorageIsNotUser: new ChainError(
    "walletAccountStorage is not user"
  ),
};
export interface StoreunitInfo {
  size: number;
  utype: number;
  peers: Set<string>;
  users: Set<string>;
  mbusers: Set<string>; //base32 编码的用户
  logs: Set<string>;
}

export class ChainUtil {
  dcchainapi: ApiPromise | undefined;
  private blockChainAddr: string = "";
  private isReconnecting: boolean = false;
  private chainIdentity: string = "";

  // 连接链节点
  create = async (blockChainAddr: string) => {
    this.blockChainAddr = blockChainAddr;
    const chainProvider = new WsProvider(blockChainAddr, 5000, undefined, 30000);

    chainProvider.on("connected", () => {
      console.log("Chain connected to " + blockChainAddr);
    });
    chainProvider.on("disconnected", () => {
      console.warn("Chain disconnected from " + blockChainAddr);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    });
    chainProvider.on("error", (err) => {
      if (!this.isReconnecting) {
        this.reconnect();
      }
    });

    try {
      this.dcchainapi = await ApiPromise.create({
        provider: chainProvider,
        throwOnConnect: true,
        throwOnUnknown: true,
      });
    } catch (e) {
      try {
        await chainProvider.disconnect();
      } catch (ignore) {}
      return false;
    }

    if (!this.dcchainapi) {
      return false;
    }

    try {
      this.chainIdentity = (await this.dcchainapi.rpc.chain.getBlockHash(0)).toHex();
    } catch (_) {
      this.chainIdentity = blockChainAddr;
    }

    return true;
  };

  // 重连操作
  reconnect = async () => {
    if (this.isReconnecting) return;
    this.isReconnecting = true;

    console.log("Attempting to reconnect to chain...");
    if (this.dcchainapi) {
      try {
        await this.dcchainapi.disconnect();
      } catch (ignore) {}
      this.dcchainapi = undefined;
    }

    const doReconnect = async () => {
      if (!this.blockChainAddr) {
        this.isReconnecting = false;
        return;
      }

      const success = await this.create(this.blockChainAddr);
      if (success) {
        console.log("Reconnection successful");
        this.isReconnecting = false;
        // 再次检查连接状态，防止在重连过程中发生的断线被忽略
        if (this.dcchainapi && !this.dcchainapi.isConnected) {
          this.reconnect();
        }
      } else {
        console.warn("Reconnection failed, retrying in 5s...");
        setTimeout(doReconnect, 5000);
      }
    };

    if (this.blockChainAddr) {
      // 避免立即重连造成的频繁尝试
      setTimeout(doReconnect, 3000);
    } else {
      this.isReconnecting = false;
    }
  };

  // 获取区块高度
  async getBlockHeight(): Promise<number> {
    const lastBlock = await this.dcchainapi?.rpc.chain.getBlock();
    const blockHeight = lastBlock?.block.header.number.toNumber();
    return blockHeight || 0;
  }

  // 获取应用累计登录上报数；指定区块高度时需要连接归档节点。
  async getAppLoginStats(
    appId: string,
    blockHeight?: number,
  ): Promise<AppLoginStats> {
    if (!this.dcchainapi || !this.dcchainapi.isReady) {
      throw new Error("dcchainapi is not initialized");
    }

    const blockHash = blockHeight === undefined
      ? await this.dcchainapi.rpc.chain.getFinalizedHead()
      : await this.dcchainapi.rpc.chain.getBlockHash(blockHeight);
    const targetHeight = blockHeight ?? (
      await this.dcchainapi.rpc.chain.getHeader(blockHash)
    ).number.toNumber();
    const queryApi = await this.dcchainapi.at(blockHash);
    const codec = await (queryApi.query as any).dcNode.appsAccountLoginTimes();
    const info = findAppLoginInfo(codec, appId);

    return {
      appId,
      loginTimes: codecDecimal(info?.loginTimes ?? info?.login_times),
      rewardedStash: info?.rewardedStash ?? info?.rewarded_stash ?? null,
      blockHeight: targetHeight,
    };
  }

  // 相邻区块快照做差，表示该区间新增的链上登录上报，不等同于页面访问次数。
  async getAppDailyLoginStats(
    appId: string,
    days: number = 7,
    blocksPerDay: number = 14400,
    currentStats?: AppLoginStats,
    now: Date = new Date(),
    loadSnapshot?: AppLoginStatsSnapshotLoader,
    options: AppLoginDailyStatsOptions = {},
  ): Promise<AppDailyLoginStats[]> {
    if (!Number.isSafeInteger(days) || days < 1) {
      throw new RangeError("days must be a positive safe integer");
    }
    if (!Number.isSafeInteger(blocksPerDay) || blocksPerDay < 1) {
      throw new RangeError("blocksPerDay must be a positive safe integer");
    }
    const safeDays = Math.min(31, days);
    const current = currentStats ?? await this.getAppLoginStats(appId);
    const boundaryNow = options.endDate ?? now;
    if (Number.isNaN(boundaryNow.getTime())) {
      throw new RangeError("endDate must be a valid date");
    }
    const currentMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(boundaryNow.getFullYear(), boundaryNow.getMonth(), boundaryNow.getDate());
    const dayOffset = Math.round(
      (currentMidnight.getTime() - targetMidnight.getTime()) / 86400000,
    );
    const currentDayBoundaries = buildSimulatedDayBoundaries(
      current.blockHeight,
      blocksPerDay,
      1,
      now,
    );
    const windowEndBlock = Math.max(
      0,
      currentDayBoundaries.todayStartBlock - dayOffset * blocksPerDay,
    );
    const boundaries = buildSimulatedDayBoundaries(
      windowEndBlock,
      blocksPerDay,
      safeDays,
      boundaryNow,
    );
    const getSnapshot = loadSnapshot ?? ((height: number) =>
      this.getAppLoginStats(appId, height)
    );
    const boundaryDates = boundaries.boundaries.slice(0, -1).map((_, index) =>
      new Date(boundaryNow.getFullYear(), boundaryNow.getMonth(), boundaryNow.getDate() - (safeDays - 1 - index))
    );
    const isCurrentWindow = !options.endDate
      || targetMidnight.getTime() === currentMidnight.getTime();
    const dates = isCurrentWindow
      ? boundaryDates
      : [...boundaryDates, targetMidnight];
    const historicalSnapshots: AppLoginStats[] = [];
    for (let index = 0; index < dates.length; index += 2) {
      historicalSnapshots.push(...await Promise.all(
        dates.slice(index, index + 2).map((date, offset) =>
          loadAppLoginCalendarBoundary(
            getSnapshot,
            date,
            boundaries.boundaries[index + offset],
          )
        )
      ));
    }
    return calculateAppLoginIntervals(isCurrentWindow
      ? [...historicalSnapshots, current]
      : historicalSnapshots);
  }

  // 使用少量累计快照模拟自然月统计；月边界按本地日期和固定块数近似投影。
  async getAppLoginMonthComparison(
    appId: string,
    options: AppLoginMonthComparisonOptions = {},
  ): Promise<AppLoginMonthComparison> {
    const blocksPerDay = options.blocksPerDay ?? 14400;
    const now = options.now ?? new Date();
    const latest = options.currentStats ?? await this.getAppLoginStats(appId);
    const targetDate = options.endDate ?? now;
    let current = latest;
    if (options.endDate) {
      const latestMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const dayOffset = Math.max(0, Math.round((latestMidnight.getTime() - targetMidnight.getTime()) / 86400000));
      const latestDay = buildSimulatedDayBoundaries(latest.blockHeight, blocksPerDay, 1, now);
      const estimatedHeight = Math.max(0, latestDay.todayStartBlock - dayOffset * blocksPerDay);
      const getSnapshot = options.loadSnapshot ?? ((height: number) => this.getAppLoginStats(appId, height));
      current = await loadAppLoginCalendarBoundary(
        getSnapshot,
        targetMidnight,
        estimatedHeight,
      );
    }
    const boundaries = buildSimulatedMonthBoundaries(
      current.blockHeight,
      blocksPerDay,
      targetDate,
      options.historyMonths ?? 6,
    );
    const requiredHeights = Array.from(new Set([
      boundaries.previousMonthStartBlock,
      boundaries.previousComparableEndBlock,
      boundaries.currentMonthStartBlock,
      ...boundaries.recentMonths.flatMap((month) => [month.startBlock, month.endBlock]),
    ])).filter((height) => height !== current.blockHeight);
    const getSnapshot = options.loadSnapshot ?? ((height: number) =>
      this.getAppLoginStats(appId, height)
    );
    const monthStartDates = boundaries.recentMonths.flatMap((month) => {
      const [year, monthNumber] = month.monthLabel.split("-").map(Number);
      return [
        [month.startBlock, new Date(year, monthNumber - 1, 1)] as const,
        [month.endBlock, new Date(year, monthNumber, 1)] as const,
      ];
    });
    const previousComparableDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() - 1,
      boundaries.comparableDays,
    );
    const boundaryDateByHeight = new Map<number, Date>(monthStartDates);
    boundaryDateByHeight.set(boundaries.previousComparableEndBlock, previousComparableDate);
    const snapshots = new Map<number, AppLoginStats>([[current.blockHeight, current]]);
    for (let index = 0; index < requiredHeights.length; index += 2) {
      const batch = await Promise.all(
        requiredHeights.slice(index, index + 2).map((height) =>
          loadAppLoginCalendarBoundary(
            getSnapshot,
            boundaryDateByHeight.get(height) || new Date(now),
            height,
          )
        )
      );
      batch.forEach((snapshot, offset) => {
        snapshots.set(requiredHeights[index + offset], snapshot);
      });
    }
    const snapshotAt = (height: number) => {
      const snapshot = snapshots.get(height);
      if (!snapshot) throw new Error(`Missing app login snapshot at block ${height}`);
      return snapshot;
    };

    return {
      appId,
      asOfBlock: current.blockHeight,
      blocksPerDay,
      asOfLocalDate: boundaries.asOfLocalDate,
      currentMonthLabel: boundaries.currentMonthLabel,
      previousMonthLabel: boundaries.previousMonthLabel,
      comparableDays: boundaries.comparableDays,
      currentMonthToDate: calculateAppLoginPeriod(
        snapshotAt(boundaries.currentMonthStartBlock),
        current,
      ),
      previousMonthToDate: calculateAppLoginPeriod(
        snapshotAt(boundaries.previousMonthStartBlock),
        snapshotAt(boundaries.previousComparableEndBlock),
      ),
      previousFullMonth: calculateAppLoginPeriod(
        snapshotAt(boundaries.previousMonthStartBlock),
        snapshotAt(boundaries.currentMonthStartBlock),
      ),
      recentMonths: boundaries.recentMonths.map((month) => ({
        monthLabel: month.monthLabel,
        partial: month.partial,
        incomplete: month.incomplete,
        ...calculateAppLoginPeriod(
          snapshotAt(month.startBlock),
          snapshotAt(month.endBlock),
        ),
      })),
      calendarBasis: "simulated-local-calendar",
      boundaryAccuracy: "approximate",
    };
  }

  // 使用年度边界累计快照模拟自然年统计，避免按 365 天逐日查询。
  async getAppLoginYearComparison(
    appId: string,
    options: AppLoginYearComparisonOptions = {},
  ): Promise<AppLoginYearComparison> {
    const blocksPerDay = options.blocksPerDay ?? 14400;
    const now = options.now ?? new Date();
    const current = options.currentStats ?? await this.getAppLoginStats(appId);
    const boundaries = buildSimulatedYearBoundaries(
      current.blockHeight,
      blocksPerDay,
      now,
    );
    const requiredHeights = Array.from(new Set([
      boundaries.previousYearStartBlock,
      boundaries.previousComparableEndBlock,
      boundaries.currentYearStartBlock,
      ...boundaries.recentYears.flatMap((year) => [year.startBlock, year.endBlock]),
    ])).filter((height) => height !== current.blockHeight);
    const getSnapshot = options.loadSnapshot ?? ((height: number) =>
      this.getAppLoginStats(appId, height)
    );
    const yearStartDates = boundaries.recentYears.flatMap((year) => [
      [year.startBlock, new Date(Number(year.yearLabel), 0, 1)] as const,
      [year.endBlock, new Date(Number(year.yearLabel) + 1, 0, 1)] as const,
    ]);
    const previousComparableDate = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      Math.min(
        now.getDate(),
        new Date(now.getFullYear() - 1, now.getMonth() + 1, 0).getDate(),
      ),
    );
    const boundaryDateByHeight = new Map<number, Date>(yearStartDates);
    boundaryDateByHeight.set(boundaries.previousComparableEndBlock, previousComparableDate);
    const snapshots = new Map<number, AppLoginStats>([[current.blockHeight, current]]);
    for (let index = 0; index < requiredHeights.length; index += 2) {
      const batch = await Promise.all(
        requiredHeights.slice(index, index + 2).map((height) =>
          loadAppLoginCalendarBoundary(
            getSnapshot,
            boundaryDateByHeight.get(height) || new Date(now),
            height,
          )
        )
      );
      batch.forEach((snapshot, offset) => {
        snapshots.set(requiredHeights[index + offset], snapshot);
      });
    }
    const snapshotAt = (height: number) => {
      const snapshot = snapshots.get(height);
      if (!snapshot) throw new Error(`Missing app login snapshot at block ${height}`);
      return snapshot;
    };

    return {
      appId,
      asOfBlock: current.blockHeight,
      blocksPerDay,
      asOfLocalDate: boundaries.asOfLocalDate,
      currentYearLabel: boundaries.currentYearLabel,
      previousYearLabel: boundaries.previousYearLabel,
      comparableDays: boundaries.comparableDays,
      currentYearToDate: calculateAppLoginPeriod(
        snapshotAt(boundaries.currentYearStartBlock),
        current,
      ),
      previousYearToDate: calculateAppLoginPeriod(
        snapshotAt(boundaries.previousYearStartBlock),
        snapshotAt(boundaries.previousComparableEndBlock),
      ),
      previousFullYear: calculateAppLoginPeriod(
        snapshotAt(boundaries.previousYearStartBlock),
        snapshotAt(boundaries.currentYearStartBlock),
      ),
      recentYears: boundaries.recentYears.map((year) => ({
        yearLabel: year.yearLabel,
        partial: year.partial,
        incomplete: year.incomplete,
        ...calculateAppLoginPeriod(
          snapshotAt(year.startBlock),
          snapshotAt(year.endBlock),
        ),
      })),
      calendarBasis: "simulated-local-calendar",
      boundaryAccuracy: "approximate",
    };
  }

  createAppLoginStatsSnapshotLoader(
    appId: string,
    currentStats: AppLoginStats,
  ): AppLoginStatsSnapshotLoader {
    const fetchSnapshot = (targetAppId: string, blockHeight: number) =>
      this.getAppLoginStats(targetAppId, blockHeight);
    if (typeof localStorage === "undefined") {
      return createAppLoginStatsSnapshotLoader(appId, currentStats, fetchSnapshot);
    }
    return createPersistentAppLoginStatsSnapshotLoader(
      this.chainIdentity || this.blockChainAddr,
      appId,
      currentStats,
      fetchSnapshot,
      localStorage,
    );
  }
  // 获取用户钱包信息
  async getUserInfoWithAccount(account: string): Promise<User> {
    const walletAccountStorage = await (
      this.dcchainapi?.query as any
    ).dcNode.walletAccountStorage(account);
    if (!walletAccountStorage) {
      throw Errors.ErrWalletAccountStorageIsNull;
    }
    let userInfo = walletAccountStorage.toJSON();
    if (userInfo === null) {
      throw Errors.ErrUserInfoIsNull;
    }

    if (!isUser(userInfo)) {
      throw Errors.ErrWalletAccountStorageIsNotUser;
    }
    if (userInfo?.parentAccount !== account) {
      const parentWalletAccountStorage = await (
        this.dcchainapi?.query as any
      ).dcNode.walletAccountStorage(userInfo?.parentAccount);
      if (!parentWalletAccountStorage) {
        throw Errors.ErrParentWalletAccountStorageIsNull;
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
      if (parentUserInfo.commentFrozenStatus != 0) {
        userInfo.commentFrozenStatus = parentUserInfo.commentFrozenStatus;
      }
      if (parentUserInfo.spamFrozenStatus != 0) {
        userInfo.spamFrozenStatus = parentUserInfo.spamFrozenStatus;
      }
    }
    //peers 进行统一处理
    for (let i = 0; i < userInfo.peers.length; i++) {
      userInfo.peers[i] = hexToAscii(userInfo.peers[i]!);
    }
    for (let i = 0; i < userInfo.requestPeers.length; i++) {
      userInfo.requestPeers[i] = hexToAscii(userInfo.requestPeers[i]!);
    }
    if (userInfo.dbConfig.length <= 2) {
      userInfo.dbConfig = ""; // 如果 dbConfig 为空，则设置为 ""
    } else {
      userInfo.dbConfigRaw = hexToBytes(userInfo.dbConfig.slice(2));
    }
    if (userInfo.encNftAccount.length <= 2) {
      userInfo.encNftAccount = "";
    }
    // 对 userInfo.peers 按与用户公钥的 XOR 距离进行排序
    if (userInfo.peers && Array.isArray(userInfo.peers) && account) {
      userInfo.peers.sort((peerA, peerB) => {
        // 将 peer 字符串转换为 Uint8Array (如果需要)
        const peerABytes =
          typeof peerA === "string" ? new TextEncoder().encode(peerA) : peerA;
        const peerBBytes =
          typeof peerB === "string" ? new TextEncoder().encode(peerB) : peerB;
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
    const walletAccount = await (
      this.dcchainapi?.query as any
    ).dcNode.nftToWalletAccount(nftHexAccount);
    if (!walletAccount || !walletAccount.toString()) {
      throw new Error("walletAccount is null");
    }
    return await this.getUserInfoWithAccount(
      walletAccount.toString()
    );
   
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
      result[i] = key1[i]! ^ key2[i]!;
    }

    // 将结果转换为BigInt用于比较
    // 首先转换为十六进制字符串以处理大数值
    let hexString = "0x";
    for (let i = 0; i < result.length; i++) {
      hexString += result[i]!.toString(16).padStart(2, "0");
    }

    // 如果结果为空（全零），返回0n
    if (hexString === "0x") {
      return BigInt(0);
    }

    return BigInt(hexString);
  }

  // 获取用户钱包信息
  async getUserInfoWithNft(nftAccount: string): Promise<User | null> {
    const accountBytes = new TextEncoder().encode(nftAccount);
    const accountHash = await sha256(accountBytes);

    const nftHexAccount = "0x" + uint8ArrayToHex(accountHash);
    return await this.getUserInfoWithNftHex(nftHexAccount);
  
  }

  async getUserWalletAccount(nftAccount: string): Promise<string | null> {
    const accountBytes = new TextEncoder().encode(nftAccount);
    const accountHash = await sha256(accountBytes);
    const nftHexAccount = "0x" + uint8ArrayToHex(accountHash);
    const walletAccount = await (
      this.dcchainapi?.query as any
    ).dcNode.nftToWalletAccount(nftHexAccount);
    if (!walletAccount || !walletAccount.toString()) {
      throw new Error("walletAccount is null");
    }
    return walletAccount.toString();
  }

  // 获取所有文件存储节点
  getObjNodes = async (cid: string): Promise<string[] | undefined> => {
    const fileInfo =
      (await (this.dcchainapi?.query as any).dcNode.files(cid)) || null;
    const fileInfoJSON = fileInfo?.toJSON();
    if (
      !fileInfoJSON ||
      typeof fileInfoJSON !== "object" ||
      (fileInfoJSON as { peers: string[] }).peers.length == 0
    ) {
      return;
    }
    return (fileInfoJSON as { peers: string[] }).peers || [];

  };

  // 获取用户节点列表
  getAccountPeers = async (account: Uint8Array): Promise<string[] | null> => {
    try {
      const hexAccount = "0x" + uint8ArrayToHex(account);
      const userInfo = await this.getUserInfoWithAccount(hexAccount);
      if (!userInfo || !isUser(userInfo)) {
        return null;
      }
      return userInfo.peers;

    } catch (error) {
      return null;
    }
  };

  // 链上查询节点信息
  // getDcNodeAddr = async (peerid: string) => {
  //   const peerInfo = await (this.dcchainapi?.query as any).dcNode.peers(peerid);
  //   const peerInfoJson = peerInfo?.toJSON();
  //   if (
  //     !peerInfoJson ||
  //     typeof peerInfoJson !== "object" ||
  //     (peerInfoJson as { ipAddress: string }).ipAddress == ""
  //   ) {
  //     console.log("no ip address found for peer: ", peerid);
  //     return;
  //   }
  //   let nodeAddr = hexToUtf8(
  //     (peerInfoJson as { ipAddress: string }).ipAddress.slice(2)
  //   );
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
  getDcNodeWebrtcDirectAddr = async (
    peerid: string
  ): Promise<[Multiaddr | null, PeerStatus]> => {
    const peerInfo = await (this.dcchainapi?.query as any).dcNode.peers(peerid);
    const peerInfoJson = peerInfo?.toJSON();
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== "object" ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ""
    ) {
      return [null, PeerStatus.PeerStatusOffline];
    }
    let nodeAddr = hexToUtf8(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2)
    );
    let addrParts = nodeAddr.split(",");
    if (addrParts.length < 2) {
      return [null, PeerStatus.PeerStatusOffline];
    }
    const addr = multiaddr(addrParts[1]);
    const peerStatus =
      (peerInfoJson as { status: number }).status ||
      PeerStatus.PeerStatusOffline;
    return [addr, peerStatus];
  };

  // 链上查询节点列表
  getDcNodeList = async (): Promise<string[]> => {
    const peerList = await (
      this.dcchainapi?.query as any
    ).dcNode.onlineNodesAddress();
    const peerListJson = peerList?.toJSON();
    if (!peerListJson || typeof peerListJson !== "object") {
      return [];
    }
    let peers: string[] = [];
    if (Array.isArray(peerListJson)) {
      for (let i = 0; i < peerListJson.length; i++) {
        const peer = peerListJson[i];
        if (typeof peer === "string") {
          const peerJson = hexToUtf8(peer.slice(2));
          peers = peers.concat(peerJson);
        }
      }
    }
    return peers;
  };

  objectState = async (
    cid: string
  ): Promise<[StoreunitInfo | null, Error | null]> => {
    if (!this.dcchainapi) {
      return [null, new Error("dcchainapi is not initialized")];
    }

    const fileInfo = await (this.dcchainapi.query as any).dcNode.files(cid);

    if (!fileInfo || fileInfo.isEmpty) {
      return [null, new Error(`File with CID ${cid} not found`)];
    }

    const data = fileInfo.toJSON();

    if (!data) {
      return [null, new Error(`File with CID ${cid} not found`)];
    }
    // 构造返回数据
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return [
        {
          size: Number((data as any)["fileSize"] || 0),
          utype: Number((data as any)["fileType"] || 0),
          peers: new Set(
            Array.isArray((data as any)["peers"])
              ? (data as any)["peers"].map((peer: any) => {
                  try {
                    return hexToAscii(String(peer));
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(peer); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
          users: new Set(
            Array.isArray((data as any)["users"])
              ? (data as any)["users"].map(String)
              : []
          ),
          mbusers: new Set(
            Array.isArray((data as any)["users"])
              ? (data as any)["users"].map((user: any) => {
                  try {
                    const userBytes = hexToBytes(user.slice(2));
                    return base32.encode(userBytes);
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(user); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
          logs: new Set(
            Array.isArray((data as any)["dbLog"])
              ? (data as any)["dbLog"].map((log: any) => {
                  try {
                    return hexToAscii(String(log));
                  } catch (e) {
                    console.warn("Failed to convert peer ID format:", e);
                    return String(log); // 如果转换失败，保留原格式
                  }
                })
              : []
          ),
        },
        null,
      ];
    }
    return [null, new Error(`File with CID ${cid} not found`)];
  };

  ifEnoughUserSpace = async (
    pubkeyRaw: Uint8Array,
    needSize?: number
  ): Promise<boolean> => {
    const hexAccount = "0x" + uint8ArrayToHex(pubkeyRaw);
    // 获取用户存储空间
    const userInfo = await this.getUserInfoWithAccount(hexAccount);
    if (!userInfo) {
      throw new Error("get user info error");
    }

    // 用户冻结
    if (userInfo.commentFrozenStatus != 0 || userInfo.spamFrozenStatus != 0) {
      return false;
    }

    // 过期高度判断
    const blockHeight = (await this.getBlockHeight()) || 0;
    if (userInfo.expireNumber > 0 && userInfo.expireNumber < blockHeight) {
      return false;
    }

    // 用户存储空间判断
    const needSizeNumber = needSize || 1024 * 1024; // 1M
    if (userInfo.subscribeSpace - userInfo.usedSpace < needSizeNumber) {
      return false;
    }

    return true;
  };
  refreshUserInfo = async (pubkeyRaw: Uint8Array): Promise<User> => {
    const hexAccount = "0x" + uint8ArrayToHex(pubkeyRaw);
    return await this.getUserInfoWithAccount(hexAccount);
  };

  // 获取应用信息
  getAPPInfo = async (appId: string): Promise<IAppInfo> => {
    if (!this.dcchainapi || !this.dcchainapi.isReady) {
      throw new Error("dcchainapi is not initialized");
    }
    const appIdBytes = new TextEncoder().encode(appId);
    const appIdHex = "0x" + uint8ArrayToHex(appIdBytes);
    const appInfoStr = await (this.dcchainapi?.query as any).dcNode.appsInfo(
      appIdHex
    );
    if (!appInfoStr || appInfoStr.isEmpty) {
      throw new Error(`App info for ${appId} not found`);
    }
    const appJsonInfo = appInfoStr.toJSON() as any;
    if (!appJsonInfo || typeof appJsonInfo !== "object") {
      throw new Error(`App info for ${appId} is not valid`);
    }
    //将 ownerAccount 转换为 Ed25519PubKey
    const ownerBytes = hexToBytes(appJsonInfo?.ownerAccount.slice(2));
    const owner = new Ed25519PubKey(ownerBytes);
    const rewarder = appJsonInfo?.rewardedStash;

    let domain = "";
    if (appJsonInfo?.domain && appJsonInfo?.domain.length > 0) {
      const domainBytes = hexToBytes(appJsonInfo?.domain.slice(2));
      domain = new TextDecoder().decode(domainBytes).toString();
    }

    let fid = "";
    if (appJsonInfo?.fileId && appJsonInfo?.fileId.length > 0) {
      const fidBytes = hexToBytes(appJsonInfo?.fileId.slice(2));
      fid = new TextDecoder().decode(fidBytes).toString();
    }
    const appInfo: IAppInfo = {
      appId: appId,
      domain: domain,
      owner: owner.string(),
      rewarder: rewarder,
      fid: fid,
    };
    return appInfo;
  };
}
