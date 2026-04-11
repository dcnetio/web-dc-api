// dc.ts
// 主 DC 类，基于模块系统重构
import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "./common/chain";
import type {
  DCConnectInfo,
  APPInfo,
  User,
  AccountInfo,
  Account,
} from "./common/types/types";
import { DcUtil } from "./common/dcutil";
import { type Helia } from "helia";
import { Libp2p } from "@libp2p/interface";
import { dc_protocol, isIframeOpen } from "./common/define";
import { DCGrpcServer } from "./implements/threaddb/net/grpcserver";
import { Ed25519PrivKey, Ed25519PubKey } from "./common/dc-key/ed25519";
import { DCContext } from "../lib/interfaces/DCContext";
import { createLogger, configureLogger, LogLevel } from "./util/logger";
import { ModuleSystem, CoreModuleName, DCModule } from "./common/module-system";
import {
  FileModule,
  AuthModule,
  CommentModule,
  DatabaseModule,
  MessageModule,
  KeyValueModule,
  ClientModule,
  CacheModule,
  AIProxyModule,
  UtilModule,
  PayModule,
  RTCModule,
  RTMModule,
  WhiteboardModule,
} from "./modules";
import { Client } from "./common/dcapi";
import { ICollectionConfig, IDBInfo } from "./implements/threaddb/core/core";
import { KeyManager } from "./common/dc-key/keyManager";
import { initializeDatabase } from "./indexDB/db";

const logger = createLogger("DC");

/**
 * DC主类，整合所有功能模块
 * 基于模块系统，更轻量级和可扩展
 */
export class DC implements DCContext {
  // 核心属性
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient!: Helia<Libp2p>;
  dcutil: DcUtil;
  privateKey: Ed25519PrivKey | undefined | null;
  publicKey: Ed25519PubKey | undefined;
  parentPublicKey: Ed25519PubKey | undefined | null; // 应用私钥
  dbThreadId: string = ""; // 当前用户的去中心化数据库ID
  ethAddress: string = ""; // 以太坊格式的公钥,16进制字符串

  // 连接相关
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public Identity: string = "";
  public Blockheight: number = 0;
  public grpcServer!: DCGrpcServer;
  public appInfo: APPInfo;
  public accountInfo: AccountInfo; // 当前登录的账户信息
  public userInfo: Account | null = null;
  public dbManager: any;
  public swUrl: string = "";
  public swInited: boolean = false;

  // 模块系统
  private moduleSystem: ModuleSystem;

  // 状态标志
  private initialized: boolean = false;

  /**
   * 创建DC实例
   * @param options 配置选项
   */
  constructor(options: {
    wssUrl: string;
    backWssUrl: string;
    appInfo?: APPInfo;
    swUrl?: string;
    logLevel?: LogLevel;
    names?: string[];
  }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.swUrl = options.swUrl || "";
    this.dcChain = new ChainUtil();
    this.dcutil = new DcUtil(this.dcChain);
    // //todo 发布注释 remove
    //  this.dcutil.defaultPeerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
    // //todo remove end
    this.appInfo = options.appInfo || ({} as APPInfo);
    this.accountInfo = {} as AccountInfo;

    // 设置日志级别
    if (options.logLevel !== undefined) {
      configureLogger({ level: options.logLevel });
    }

    // 创建模块系统
    this.moduleSystem = new ModuleSystem(this);

    // 注册核心模块
    this.registerCoreModules(options.names || []);
  }

  /**
   * 注册核心模块
   */
  private registerCoreModules(names: string[] = []): void {
    if (names && names.length > 0) {
      // 注册自定义模块
      for (const name of names) {
        const module = this.moduleSystem.getModule(name);
        if (module) {
          this.moduleSystem.registerModule(module);
        } else {
          logger.warn(`模块 ${name} 不存在，跳过注册`);
        }
      }
    } else {
      // 注册核心功能模块
      this.moduleSystem.registerModule(new FileModule(this.swUrl || ""));
      this.moduleSystem.registerModule(new AuthModule());
      this.moduleSystem.registerModule(new PayModule());
      this.moduleSystem.registerModule(new CommentModule());
      this.moduleSystem.registerModule(new DatabaseModule());
      this.moduleSystem.registerModule(new MessageModule());
      this.moduleSystem.registerModule(new KeyValueModule());
      this.moduleSystem.registerModule(new ClientModule());
      this.moduleSystem.registerModule(new CacheModule());
      this.moduleSystem.registerModule(new AIProxyModule());
      this.moduleSystem.registerModule(new UtilModule());
      this.moduleSystem.registerModule(new RTCModule());
      this.moduleSystem.registerModule(new RTMModule());
      this.moduleSystem.registerModule(new WhiteboardModule());
    }

    logger.info("核心模块注册完成");
  }

  /**
   * 注册自定义模块
   * @param module 要注册的模块
   * @returns 是否注册成功
   */
  registerModule(module: DCModule): boolean {
    return this.moduleSystem.registerModule(module);
  }

  /**
   * 初始化DC实例
   * backStep 0-注册模块成功，1-链节点连接成功，2-节点连接成功，3-初始化模块成功，
   * @returns 是否成功初始化
   */
  init = async (
    backStep?: (step: number) => Promise<void>,
  ): Promise<boolean> => {
    if (this.initialized) {
      logger.warn("DC已经初始化，跳过重复初始化");
      return true;
    }
    backStep && (await backStep(0));

    let createChain = false;
    try {
      // 尝试创建主链接
      logger.info("尝试连接主链: " + this.blockChainAddr);
      createChain = await this.dcChain.create(this.blockChainAddr);

      if (!createChain) {
        // 换个路径重新创建
        logger.info("主链连接失败，尝试备用链: " + this.backChainAddr);
        createChain = await this.dcChain.create(this.backChainAddr);

        if (!createChain) {
          logger.error("dcchainapi 初始化失败: 无法连接任何链");
          return false;
        }
      }

      backStep && (await backStep(1));
      // 链节点已连接
      logger.info("链节点连接成功");

      // 创建节点客户端
      this.dcNodeClient = await this.dcutil?._createHeliaNode();
      logger.info("Helia节点创建成功");

      // 启动GRPC服务器
      this.grpcServer = new DCGrpcServer(this.dcNodeClient.libp2p, dc_protocol);
      this.grpcServer.start();
      logger.info("GRPC服务器启动成功");

      // 获取默认dc节点地址
      let nodeAddr = await this.dcutil?.getDefaultDcNodeAddr();
      if (nodeAddr) {
        logger.info("获取DC节点地址成功: " + nodeAddr.toString());

        try {
          // 拨号连接到节点
          const connection = await this.dcNodeClient?.libp2p.dial(nodeAddr, {
            signal: AbortSignal.timeout(5000),
          });
          logger.info("连接到DC节点成功");

          this.connectedDc.nodeAddr = nodeAddr; // 当前地址
          this.connectedDc.client = await this.newDcClient(nodeAddr);

          backStep && (await backStep(2));
          // 初始化所有模块
          const modulesInitialized = await this.moduleSystem.initializeAll();
          if (!modulesInitialized) {
            logger.error("模块初始化失败");
            return false;
          }
          // 在这里设置初始化标志，确保后续模块方法可以正常访问
          this.initialized = true;
          backStep && (await backStep(3));

          // 设置默认私钥
          const seed = crypto.getRandomValues(new Uint8Array(32));
          this.privateKey = Ed25519PrivKey.fromSeed(seed);
          const pubKey = this.privateKey.publicKey;
          this.publicKey = pubKey;

          backStep && (await backStep(4));
          // 是iframe打开的需要存储登录信息
          if (isIframeOpen()) {
            // indexDB初始
            initializeDatabase();
          }
          return true;
        } catch (error) {
          logger.error("连接到DC节点失败:", error);
          return false;
        }
      } else {
        logger.error("获取DC节点地址失败");
        return false;
      }
    } catch (error) {
      logger.error("DC初始化失败:", error);
      return false;
    }
  };

  setAppInfo(appInfo: APPInfo): void {
    this.appInfo = appInfo;
  }

  setAccountInfo(accountInfo: AccountInfo): void {
    this.accountInfo = accountInfo;
  }

  /**
   * 获取当前用户的去中心数据库信息,如果用户数据库不存在,则会自动创建
   * @param collections 集合配置数组，定义数据库中的集合结构
   * @param reset 是否重置数据库，默认为false,如果为true，则会重置数据库,原来的数据会丢失,应该只在开发调试时使用
   * @returns 当前用户的数据库信息
   */
  async initUserDB(
    collections: ICollectionConfig[],
    verno?: number, //版本编码,当版本编码变化时，需要重构表结构
    reset?: boolean,
  ): Promise<[IDBInfo | null, Error | null]> {
    const dbName = "user_threaddb";
    let userInfo: User | null = null;
    try {
      this.assertInitialized();
      if (!this.auth) {
        return [null, new Error("用户模块不存在")];
      }
      const [user, err] = await this.auth.refreshUserInfo();
      if (err) {
        return [null, err];
      }
      if (!user) {
        return [null, new Error("用户信息不存在")];
      }
      userInfo = user;

      if (!reset && userInfo && userInfo.dbConfig) {
        // 如果存在dbConfig，说明已经设置了应用数据库,进行解密
        try {
          const [dbConfig, err] = await this.auth.decrypt(userInfo.dbConfigRaw);
          if (err || !dbConfig) {
            return [null, err as unknown as Error];
          }
          const threadDBInfo = new TextDecoder().decode(dbConfig);
          const threadDBInfos = threadDBInfo ? threadDBInfo.split("|") : [];
          if (threadDBInfos && threadDBInfos.length >= 3) {
            const threadid = threadDBInfos[0] || "";
            const rk = threadDBInfos[1] || "";
            const sk = threadDBInfos[2] || "";
            const fid = threadDBInfos[3] || ""; //预加载记录文件ID
            const preCount = threadDBInfos[4] || 0; //预加载记录条数
            //判断本地是否存在数据库
            if (!this.db) {
              return [null, new Error("数据库模块不存在")];
            }
            const [dbinfo, error] = await this.db.getDBInfo(threadid);
            if (dbinfo != null && !error) {
              //本地数据库存在,检查是否需要表结构升级
              if (verno) {
                //获取本地localVersion
                const localVersion = await this.db.loadVerno(threadid);
                if (localVersion != verno) {
                  //版本号不一致，需要升级表结构
                  const err = await this.db.upgradeCollections(
                    threadid,
                    collections,
                  );
                  if (err) {
                    return [null, err];
                  }
                  // 更新本地版本号
                  await this.db.saveVerno(threadid, verno);
                }
                // 需要升级表结构
                await this.db.upgradeCollections(threadid, collections);
              }

              // 后台异步刷新数据库，不阻塞登录流程
              this.db.refreshDBFromDC(threadid).catch((err) => {
                console.warn("后台刷新数据库失败:", err);
              });
              //3秒后将本地数据库同步到DC
              setTimeout(() => {
                if (this.db) {
                  this.db.syncDBToDC(threadid);
                }
              }, 5000);
              this.dbThreadId = dbinfo.id;
              // 自动扩容threaddb,当threaddb的可用空间小于10MB，自动扩容50MB,无需等待结果
              this.autoExpandDBSpace(this, this.dbThreadId);
              return [dbinfo, null];
            } else if (threadid != "") {
              //本地数据库不存在,从DC同步
              await this.db.syncDbFromDC(
                threadid,
                dbName,
                "",
                rk,
                sk,
                true,
                collections,
              );
              const [dbinfo, error] = await this.db.getDBInfo(threadid);
              if (dbinfo != null && !error) {
                this.dbThreadId = dbinfo.id;
                // 后台异步刷新数据库，不阻塞登录流程
                this.db.refreshDBFromDC(threadid).catch((err) => {
                  console.warn("后台刷新数据库失败:", err);
                });
                // 自动扩容threaddb,当threaddb的可用空间小于10MB，自动扩容50MB,无需等待结果
                this.autoExpandDBSpace(this, this.dbThreadId);
                return [dbinfo, null]; //返回dbinfo;
              } else {
                // 获取DB失败
                return [null, error ? error : new Error("获取DB失败")];
              }
            }
          }
        } catch (error: any) {
          return [null, error];
        }
      }
      if (!this.util) {
        return [null, new Error("util模块不存在")];
      }
      if (!this.db) {
        return [null, new Error("数据库模块不存在")];
      }
      //数据库不存在，创建应用数据库
      const rk = this.util.createSymmetricKey();
      const sk = this.util.createSymmetricKey();
      // 初始化DB数据库结构
      const [threadId, newDBError] = await this.db.newDB(
        dbName,
        rk.toString(),
        sk.toString(),
        collections,
      );
      if (newDBError || !threadId) {
        return [null, newDBError];
      }
      if (threadId) {
        //数据库创建成功
        // 设置用户默认DB
        const setUserDefaultDBRes = await this.setUserDefaultDB(
          this,
          threadId,
          rk.toString(),
          sk.toString(),
        );
        if (!setUserDefaultDBRes) {
          // 设置用户默认DB失败
          return [null, new Error("设置用户去中心DB失败")];
        }
      }
      if (!this.db) {
        return [null, new Error("数据库模块不存在")];
      }
      const [dbinfo, error] = await this.db.getDBInfo(threadId);
      if (dbinfo != null && !error) {
        this.dbThreadId = dbinfo.id;
        return [dbinfo, null]; //返回dbinfo;
      } else {
        this.dbThreadId = "";
        // 获取DB失败
        return [null, error];
      }
    } catch (error: any) {
      return [null, error];
    }
  }

  // 自动扩容
  private async autoExpandDBSpace(
    dc: DC,
    DBThreadid: string,
  ): Promise<boolean> {
    //获取当前DB的可用空间
    if (!dc.db) {
      return false;
    }
    return dc.db.autoExpandDBSpace(DBThreadid, 50 * 1024 * 1024);
  }

  // 设置用户DB
  private async setUserDefaultDB(
    dc: DC,
    DBThreadid: string,
    rk: string,
    sk: string,
    remark?: string,
  ): Promise<boolean> {
    // 加到用户信息上
    try {
      if (!dc.auth) {
        return false;
      }
      await dc.auth.setUserDefaultDB(DBThreadid, rk, sk, remark || "");
    } catch (error) {
      return false;
    }
    // 循环获取用户信息，是否存在db,true成功
    const res = await this.checkSetUserDefaultDB(dc);
    return res;
  }

  // 判断是否设置用户默认DB
  private async checkSetUserDefaultDB(dc: DC): Promise<boolean> {
    return new Promise(async (resolve) => {
      let intervalNum = 0; // 定时判断是否绑定成功
      // 初始化定时器
      let interval = setInterval(async () => {
        intervalNum++;
        if (intervalNum > 20) {
          // 超时停止定时任务
          interval ? clearInterval(interval) : "";
          intervalNum = 0;
          resolve(false);
        }
        // 获取用户信息，判断空间有效期是否延长
        if (dc.auth) {
          const [user, err] = await dc.auth.refreshUserInfo();
          if (!err && user && user.dbConfig) {
            // 绑定成功停止定时任务
            interval ? clearInterval(interval) : "";
            intervalNum = 0;
            resolve(true);
          }
        }
      }, 1000);
    });
  }

  /**
   * 关闭并清理资源
   */
  async shutdown(): Promise<void> {
    logger.info("开始关闭DC...");

    // 关闭所有模块
    await this.moduleSystem.shutdownAll();

    // 关闭GRPC服务器
    if (this.grpcServer) {
      this.grpcServer.stop();
      logger.info("GRPC服务器已停止");
    }

    // 关闭libp2p连接
    if (this.dcNodeClient && this.dcNodeClient.libp2p) {
      await this.dcNodeClient.libp2p.stop();
      logger.info("libp2p连接已关闭");
    }

    this.initialized = false;
    logger.info("DC已成功关闭");
  }

  /**
   * 退出并清理资源
   */
  async exit() {
    this.AccountBackupDc = {}; // 清理账号备份连接信息
    this.publicKey = undefined; // 清理公钥
    this.dbThreadId = ""; // 清理数据库ID
    this.ethAddress = ""; // 清理以太坊地址

    // 清空iframe的私钥公钥
    if (this.auth) {
      this.auth.exitLogin();
    }
    logger.info("DC已退出并清理资源");
  }

  /**
   * 签名方法
   * @param payload 需要签名的数据
   * @returns 签名结果
   */
  sign = async (payload: Uint8Array): Promise<Uint8Array> => {
    if (!this.auth) {
      return new Uint8Array();
    }
    return this.auth.signWith(payload);
  };

  setPublicKey(publicKey: Ed25519PubKey) {
    this.publicKey = publicKey;
  }

  /**
   * 获取公钥
   * @returns 公钥对象
   */
  getPublicKey(): Ed25519PubKey {
    if (this.publicKey) {
      return this.publicKey;
    }
    throw new Error("公钥未初始化");
  }

  /**
   * 获取原始公钥数据
   * @returns 原始公钥字节数据
   */
  getPubkeyRaw(): Uint8Array {
    if (this.publicKey) {
      return this.publicKey.raw;
    }
    throw new Error("公钥未初始化");
  }

  /**
   * 提供清除浏览器缓存接口
   * 主要用于调试和重置数据环境，调用会清理 LocalStorage, SessionStorage 以及所有的 IndexedDB 和 CacheStorage
   */
  async clearBrowserCache(): Promise<void> {
    try {
      // 0. 尝试优雅停机并主动关闭资源，防止 IndexedDB 删除时被底层 P2P 节点和 DB 游标锁定导致死锁
      if (this.dbManager && typeof this.dbManager.close === "function") {
        try {
          await this.dbManager.close();
          logger.info("已成功关闭 dbManager 数据库连接");
        } catch (e) {
          logger.warn("关闭 dbManager 数据库连接时遇到异常:", e);
        }
      }

      if (this.grpcServer && typeof this.grpcServer.stop === "function") {
        try {
          this.grpcServer.stop();
          logger.info("已停止 grpcServer 监听");
        } catch (e) {
          logger.warn("停止 grpcServer 时释放失败:", e);
        }
      }

      if (this.dcNodeClient && typeof this.dcNodeClient.stop === "function") {
        try {
          await this.dcNodeClient.stop();
          logger.info("已成功停止 dcNodeClient(Helia) 底层节点，释放系统锁");
        } catch (e) {
          logger.warn("停止 dcNodeClient 时遇到异常:", e);
        }
      }

      // 1. 清除所有的 Storage 缓存（已兼容多端）
      const globalObj = typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : global) as any;
      
      if (typeof window !== "undefined") {
        if (window.localStorage && typeof window.localStorage.clear === "function") {
          try { window.localStorage.clear(); } catch (e) {}
        }
        if (window.sessionStorage && typeof window.sessionStorage.clear === "function") {
          try { window.sessionStorage.clear(); } catch (e) {}
        }
      }
      
      // 兼容环境：微信小程序 / Taro 等
      if (globalObj && globalObj.wx && typeof globalObj.wx.clearStorageSync === "function") {
        try { globalObj.wx.clearStorageSync(); } catch (e) {}
      }
      // 兼容环境：UniApp 等
      if (globalObj && globalObj.uni && typeof globalObj.uni.clearStorageSync === "function") {
        try { globalObj.uni.clearStorageSync(); } catch (e) {}
      }
      
      // 2. 清除所有的 IndexedDB (将原生回调事件包装成 Promise 实现优雅的串行等待)
      if (typeof window !== "undefined" && window.indexedDB) {
        if (typeof window.indexedDB.databases === "function") {
          try {
            const dbs = await window.indexedDB.databases();
            const deletePromises = dbs.map(db => {
              return new Promise<void>((resolve) => {
                if (!db.name) {
                  resolve();
                  return;
                }
                try {
                  const req = window.indexedDB.deleteDatabase(db.name);
                  req.onsuccess = () => resolve();
                  req.onerror = () => {
                    logger.error(`删除 IndexedDB: ${db.name} 失败`);
                    resolve();
                  };
                  req.onblocked = () => {
                    logger.warn(`请注意：有其他标签页或连接正在占用数据库: ${db.name}`);
                    resolve();
                  };
                } catch (e) {
                  logger.error(`同步删除 IndexedDB ${db.name} 时报错:`, e);
                  resolve();
                }
              });
            });
            await Promise.allSettled(deletePromises);
          } catch (listErr) {
            logger.warn("获取或清除 IndexedDB 列表时发生全局异常:", listErr);
          }
        } else {
          logger.warn("当前浏览器不支持获取所有 IndexedDB 列表 (indexedDB.databases API)，无法一键清空");
        }
      }

      // 3. 清除当前域下的所有 Service Worker Caches 缓存（如果存在缓存的音频头像配置等）
      if (typeof window !== "undefined" && window.caches) {
        try {
          const cacheKeys = await window.caches.keys();
          const cacheDeletePromises = cacheKeys.map(key => window.caches.delete(key));
          await Promise.allSettled(cacheDeletePromises);
        } catch (e) {
          logger.warn("清空 Service Worker Cache API 时遇到异常:", e);
        }
      }

      // 4. 清除并注销挂载的 ServiceWorker 拦截器 (避免旧版 SW 在后台驻留继续污染)
      if (typeof navigator !== "undefined" && navigator.serviceWorker) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
          logger.info("已成功注销所有后台 Service Worker 注册");
        } catch (e) {
          logger.warn("注销 Service Worker 时失败:", e);
        }
      }

      // 5. 尝试清除浏览器所有的 Cookies，有些遗留验证状态可能存储在这里
      if (typeof document !== "undefined" && document.cookie) {
        try {
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
          logger.info("已清理浏览器 Cookie");
        } catch (e) {
          logger.warn("清理 Cookie 时报错:", e);
        }
      }

      // 6. 原地解绑可能挂载在内存中的用户账号引用，防止逻辑逃逸
      this.initialized = false;
      this.dbThreadId = "";
      this.ethAddress = "";
      this.AccountBackupDc = {};
      this.connectedDc = {};
      this.userInfo = null;
      this.accountInfo = {} as AccountInfo;
      this.privateKey = null;
      
      logger.info("浏览器本地所有的环境数据 (Storage/IndexedDB/Caches/SW/Cookie/内存) 已被拔除清空，即将刷新页面重置系统状态...");

      // 7. 立即刷新页面 / 重开小程序栈，让应用强制回到未登录的初始状态
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location && typeof window.location.reload === "function") {
          try { window.location.reload(); } catch (e) {}
        } else {
          // 小程序场景：清理完缓存后抛出一个强提示或让小程序回到主注册页，通常首页路径为 '/pages/index/index' 或 '/'
          if (globalObj && globalObj.wx && typeof globalObj.wx.reLaunch === "function") {
            try { globalObj.wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {} // 微信小程序通用兜底策略
          } else if (globalObj && globalObj.uni && typeof globalObj.uni.reLaunch === "function") {
            try { globalObj.uni.reLaunch({ url: '/pages/index/index' }); } catch (e) {} // UniApp 通用兜底策略
          }
        }
      }, 500); // 给予 500ms 的缓冲期让日志能够正常打印出来
    } catch (error) {
      logger.error("清除浏览器本地存储时发生意外终止:", error);
      throw error;
    }
  }

  setParentPublicKey(parentPublicKey: Ed25519PubKey) {
    this.parentPublicKey = parentPublicKey;
  }
  setPrivateKey(appPrivateKey: Ed25519PrivKey | null) {
    this.privateKey = appPrivateKey;
  }
  /**
   * 创建DC客户端
   * @param nodeAddr 节点地址
   * @returns DC客户端
   */
  private newDcClient = async (nodeAddr: Multiaddr) => {
    if (!nodeAddr) {
      return undefined;
    }

    try {
      const dcClient = new Client(
        this.dcNodeClient.libp2p,
        this.dcNodeClient.blockstore,
        nodeAddr,
        dc_protocol,
      );
      return dcClient;
    } catch (error) {
      logger.error("创建DC客户端失败:", error);
      throw error;
    }
  };

  /**
   * 检查DC实例是否已初始化
   * @returns 是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 获取已注册的模块列表
   */
  getRegisteredModules(): string[] {
    return this.moduleSystem.getRegisteredModules();
  }

  /**
   * 获取指定模块
   * @param moduleName 模块名称
   * @returns 模块实例
   */
  getModule<T extends DCModule>(moduleName: string): T | null {
    try {
      this.assertInitialized();
      const module = this.moduleSystem.getModule<T>(moduleName);
      if (!module) {
        throw new Error(`模块 ${moduleName} 不存在或未注册`);
      }
      return module;
    } catch (error) {
      return null;
    }
  }

  /**
   * 断言DC已初始化
   * @throws 如果DC未初始化则抛出错误
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("DC未初始化，请先调用init()方法");
    }
  }

  // ========== 便捷访问核心模块的方法 ==========

  /**
   * 获取文件模块
   * @returns 文件模块实例
   */
  get file() {
    return this.getModule<FileModule>(CoreModuleName.FILE);
  }

  /**
   * 获取 RTC 模块
   * @returns RTC 模块实例
   */
  get rtc() {
    return this.getModule<RTCModule>(CoreModuleName.RTC);
  }

  /**
   * 获取 RTM 模块
   * @returns RTM 模块实例
   */
  get rtm() {
    return this.getModule<RTMModule>(CoreModuleName.RTM);
  }

  /**
   * 获取 Whiteboard 模块
   * @returns Whiteboard 模块实例
   */
  get whiteboard() {
    return this.getModule<WhiteboardModule>(CoreModuleName.WHITEBOARD);
  }

  /**
   * 获取支付模块
   * @returns 支付模块实例
   */
  get pay() {
    return this.getModule<PayModule>(CoreModuleName.PAY);
  }

  /**
   * 获取认证模块
   * @returns 认证模块实例
   */
  get auth() {
    return this.getModule<AuthModule>(CoreModuleName.AUTH);
  }

  /**
   * 获取评论模块
   * @returns 评论模块实例
   */
  get comment() {
    return this.getModule<CommentModule>(CoreModuleName.COMMENT);
  }

  /**
   * 获取数据库模块
   * @returns 数据库模块实例
   */
  get db() {
    return this.getModule<DatabaseModule>(CoreModuleName.DATABASE);
  }

  /**
   * 获取消息模块
   * @returns 消息模块实例
   */
  get message() {
    return this.getModule<MessageModule>(CoreModuleName.MESSAGE);
  }

  /**
   * 获取键值存储模块
   * @returns 键值存储模块实例
   */
  get keyValue() {
    return this.getModule<KeyValueModule>(CoreModuleName.KEYVALUE);
  }

  /**
   * client
   * @returns 客户端实例
   */
  get client() {
    return this.getModule<ClientModule>(CoreModuleName.CLIENT);
  }

  /**
   * 缓存模块
   * @returns 缓存模块实例
   */
  get cache() {
    return this.getModule<CacheModule>(CoreModuleName.CACHE);
  }

  /**
   * AI代理模块
   * @returns AI代理模块实例
   */
  get aiproxy() {
    return this.getModule<AIProxyModule>(CoreModuleName.AIPROXY);
  }

  /**
   * 工具模块
   * @returns 工具模块实例
   */
  get util() {
    return this.getModule<UtilModule>(CoreModuleName.UTIL);
  }

  get libp2p() {
    return this.dcNodeClient.libp2p;
  }
}
