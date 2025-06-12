// dc.ts
// 主 DC 类，基于模块系统重构

import { type Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "./common/chain";
import type { DCConnectInfo, APPInfo, User } from "./common/types/types";
import { DcUtil } from "./common/dcutil";
import { type HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";
import { dc_protocol } from "./common/define";
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
  UtilModule
} from "./modules";
import { Client } from "./common/dcapi";
import { ICollectionConfig, IDBInfo } from "./implements/threaddb/core/core";

const logger = createLogger('DC');

/**
 * DC主类，整合所有功能模块
 * 基于模块系统，更轻量级和可扩展
 */
export class DC implements DCContext {
  // 核心属性
  blockChainAddr: string;
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient!: HeliaLibp2p<Libp2p>;
  dcutil: DcUtil;
  publicKey: Ed25519PubKey | undefined;
  
  // 连接相关
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public Identity: string = "";
  public Blockheight: number = 0;
  public grpcServer!: DCGrpcServer;
  public appInfo: APPInfo;
  public dbManager: any;
  public swUrl: string = "";
  
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
    appInfo?: APPInfo ;
    swUrl?: string;
    logLevel?: LogLevel;
    names?: string[];
  }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.swUrl = options.swUrl || "";
    this.dcChain = new ChainUtil();
    this.dcutil = new DcUtil(this.dcChain);
    // //todo remove 
      this.dcutil.defaultPeerId= "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
    // //todo remove end
    this.appInfo = options.appInfo || {} as APPInfo;
    
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
    if(names && names.length > 0) {
      // 注册自定义模块
      for (const name of names) {
        const module = this.moduleSystem.getModule(name);
        if (module) {
          this.moduleSystem.registerModule(module);
        } else {
          logger.warn(`模块 ${name} 不存在，跳过注册`);
        }
      }
    }else {
      // 注册核心功能模块
      this.moduleSystem.registerModule(new FileModule(this.swUrl || ""));
      this.moduleSystem.registerModule(new AuthModule());
      this.moduleSystem.registerModule(new CommentModule());
      this.moduleSystem.registerModule(new DatabaseModule());
      this.moduleSystem.registerModule(new MessageModule());
      this.moduleSystem.registerModule(new KeyValueModule());
      this.moduleSystem.registerModule(new ClientModule());
      this.moduleSystem.registerModule(new CacheModule());
      this.moduleSystem.registerModule(new AIProxyModule());
      this.moduleSystem.registerModule(new UtilModule());
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
   * @returns 是否成功初始化
   */
  init = async (): Promise<boolean> => {
    if (this.initialized) {
      logger.warn("DC已经初始化，跳过重复初始化");
      return true;
    }
    
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
      
      // 链节点已连接
      logger.info("链节点连接成功");
      
      // 创建节点客户端
      this.dcNodeClient = await this.dcutil?._createHeliaNode();
      logger.info("Helia节点创建成功");
      
      // 启动GRPC服务器
      this.grpcServer = new DCGrpcServer(
        this.dcNodeClient.libp2p,
        dc_protocol
      );
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
          
          // 初始化所有模块
          const modulesInitialized = await this.moduleSystem.initializeAll();
          if (!modulesInitialized) {
            logger.error("模块初始化失败");
            return false;
          }
          // 在这里设置初始化标志，确保后续模块方法可以正常访问
          this.initialized = true;
          
          // todo临时测试，指定私钥 -- start
          const privateKey = Ed25519PrivKey.fromString('a572e69c99603ab728494f23363dff78d775214d84a6881b633767e7be1d0228de683b70333f1ddded37a80ffd10dbb7ae20e08e14dd201cc48a6da36567a9a1') 
          this.publicKey = privateKey.publicKey;
          // 存在token， 获取用户备用节点
          await this.auth.getAccountBackupDc();
          // todo临时测试，指定私钥 -- end
          // 定时维系token
          this.auth.startDcPeerTokenKeepValidTask();
          
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


     /**
     * 获取当前用户的去中心数据库信息,如果用户数据库不存在,则会自动创建
     * @param collections 集合配置数组，定义数据库中的集合结构
     * @param reset 是否重置数据库，默认为false,如果为true，则会重置数据库,原来的数据会丢失,应该只在开发调试时使用
     * @returns 当前用户的数据库信息
     */
    async initUserDB(collections:ICollectionConfig[],reset?:boolean ): Promise<[IDBInfo|null,Error | null]> { 
      const dbName = "user_threaddb";
      let userInfo: User | null = null;
      try {
            this.assertInitialized();
            userInfo = await this.auth.refreshUserInfo();
            if (!userInfo) {
              return [null,new Error("用户信息不存在")];
            }
     
      if (!reset &&userInfo && userInfo.dbConfig) {// 如果存在dbConfig，说明已经设置了应用数据库,进行解密 
        try{
          const dbConfig = await this.auth.decryptWithWallet(userInfo.dbConfigRaw);
          const threadDBInfo =  new TextDecoder().decode(dbConfig);
          const threadDBInfos = threadDBInfo ? threadDBInfo.split('|') : [];
          if (threadDBInfos && threadDBInfos.length >= 3) {
              const threadid = threadDBInfos[0];
              const rk = threadDBInfos[1];
              const sk = threadDBInfos[2];
              const fid =  threadDBInfos[3] || ''; //预加载记录文件ID
              const preCount = threadDBInfos[4] || 0; //预加载记录条数
              //判断本地是否存在数据库
              const [dbinfo,error] = await this.db.getDBInfo(threadid);
              if (dbinfo != null && !error) {          
                this.db.refreshDBFromDC(threadid);
                return [dbinfo,null];
              }else{//本地数据库不存在,从DC同步
                   await this.db.syncDbFromDC(
                    threadid,
                    dbName,
                    "",
                    rk,
                    sk,
                    true,
                    collections,
                  );
                  const [dbinfo,error] = await this.db.getDBInfo(threadid);
                  if (dbinfo != null && !error) {
                    return [dbinfo,null] ; //返回dbinfo;
                  }else {
                    // 获取DB失败
                    return [null,error?error:new Error('获取DB失败')];
                  }
                }
              }
        }catch (error:any) {
          console.error('解密dbConfig失败', error);
          return  [null,error];
        }
        
      }
      //数据库不存在，创建应用数据库
      const rk =  this.util.createSymmetricKey();
      const sk =  this.util.createSymmetricKey();
      // 初始化DB数据库结构
      const threadId = await this.db.newDB(
        dbName,
        rk.toString(),
        sk.toString(),
        collections,
      );
      if (threadId !== '') {//数据库创建成功
        // 设置用户默认DB
        const setUserDefaultDBRes = await this._setUserDefaultDB(
          this,
          threadId,
          rk.toString(),
          sk.toString(),
        );
        if (!setUserDefaultDBRes) {
          // 设置用户默认DB失败
          console.error('设置用户去中心DB失败');
          return  [null,new Error('设置用户去中心DB失败')];
        }
        
      }
      const [dbinfo,error] = await this.db.getDBInfo(threadId);
      if (dbinfo != null && !error) {
        return [dbinfo,null] ; //返回dbinfo;
      }else {
        // 获取DB失败
        console.error('获取DB失败', error);
        return  [null,error];
      }

      } catch (error:any) {
        console.error('初始化用户DB失败', error);
        return  [null,error];
      }
    }
  


// 设置用户DB
 async _setUserDefaultDB(
  dc: DC,
  DBthreadid: string,
  rk: string,
  sk: string,
  remark?: string,
): Promise<boolean> {
    // 加到用户信息上
    try {
      await dc.auth.setUserDefaultDB(
        DBthreadid,
        rk,
        sk,
        remark || '',
      );
    } catch (error) {
      console.error('设置用户默认DB失败', error);
      return false; 
    }
  // 循环获取用户信息，是否存在db,true成功
  const res = await this._checkSetUserDefaultDB(dc);
  return res;
};



// 判断是否设置用户默认DB
async _checkSetUserDefaultDB (dc: DC): Promise<boolean>  {
  return new Promise(async resolve => {
    let intervalNum = 0; // 定时判断是否绑定成功
    // 初始化定时器
    let interval = setInterval(async () => {
      intervalNum++;
      // 获取用户信息，判断空间有效期是否延长
      const getUserInfoRes = await dc.auth.refreshUserInfo();
      if (getUserInfoRes && getUserInfoRes.dbConfig) {
        // 绑定成功停止定时任务
        interval ? clearInterval(interval) : '';
        intervalNum = 0;
        resolve(true);
      } else if (intervalNum > 20) {
        // 超时停止定时任务
        interval ? clearInterval(interval) : '';
        intervalNum = 0;
        resolve(false);
      }
    }, 1000);
  });
};



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
   * 签名方法
   * @param payload 需要签名的数据
   * @returns 签名结果
   */
  sign =async (payload: Uint8Array): Promise<Uint8Array>  => {
    const signature = this.auth.signWithWallet(payload);
    return signature;
  };

  setPublicKey(publicKey: Ed25519PubKey) {
    this.publicKey = publicKey;
  }
  /**
   * 获取公钥
   * @returns 公钥对象
   */
  getPublicKey(): Ed25519PubKey {
    if (!this.publicKey) {
      throw new Error("公钥未初始化");
    }
    return this.publicKey;
  }


  /**
   * 获取原始公钥数据
   * @returns 原始公钥字节数据
   */
  getPubkeyRaw(): Uint8Array {
    if (!this.publicKey) {
      throw new Error("公钥未初始化");
    }
    return this.publicKey.raw;
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
        dc_protocol
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
  getModule<T extends DCModule>(moduleName: string): T {
    this.assertInitialized();
    const module = this.moduleSystem.getModule<T>(moduleName);
    if (!module) {
      throw new Error(`模块 ${moduleName} 不存在或未注册`);
    }
    return module;
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
    return  this.getModule<UtilModule>(CoreModuleName.UTIL);
  }
}