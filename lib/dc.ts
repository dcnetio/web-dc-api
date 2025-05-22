// dc.ts
// 主 DC 类，基于模块系统重构

import { type Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "./common/chain";
import type { DCConnectInfo, APPInfo } from "./common/types/types";
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
  AIProxyModule
} from "./modules";
import { Client } from "./common/dcapi";

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
  dcNodeClient: HeliaLibp2p<Libp2p<any>>;
  dcutil: DcUtil;
  privKey: Ed25519PrivKey | undefined;
  publicKey: Ed25519PubKey | undefined;
  
  // 连接相关
  public connectedDc: DCConnectInfo = {};
  public AccountBackupDc: DCConnectInfo = {};
  public Identity: string = "";
  public Blockheight: number = 0;
  public grpcServer: DCGrpcServer;
  public appInfo: APPInfo;
  public dbManager: any;
  
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
    appInfo: APPInfo ;
    logLevel?: LogLevel;
    names?: string[];
  }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.dcutil = new DcUtil(this.dcChain);
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
      this.moduleSystem.registerModule(new FileModule());
      this.moduleSystem.registerModule(new AuthModule());
      this.moduleSystem.registerModule(new CommentModule());
      this.moduleSystem.registerModule(new DatabaseModule());
      this.moduleSystem.registerModule(new MessageModule());
      this.moduleSystem.registerModule(new KeyValueModule());
      this.moduleSystem.registerModule(new ClientModule());
      this.moduleSystem.registerModule(new CacheModule());
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
          
          // 获取存储的token
          await this.auth.getSavedToken(nodeAddr.getPeerId());
          
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

  setAppInfo(appInfo: APPInfo) {
    this.appInfo = appInfo;
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
   * 签名方法
   * @param payload 需要签名的数据
   * @returns 签名结果
   */
  sign =async (payload: Uint8Array): Promise<Uint8Array>  => {
    if (!this.privKey) {
      throw new Error("私钥未初始化，无法进行签名");
    }
    const signature = this.privKey.sign(payload);
    return signature;
  };

  /**
   * 解密方法
   * @param content 加密内容
   * @returns 解密后的内容
   */
  decrypt = async (content: Uint8Array): Promise<Uint8Array> => {
    if (!this.privKey) {
      throw new Error("私钥未初始化，无法进行解密");
    }
    const decodeContent = await this.privKey.decrypt(content);
    return decodeContent; 
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

  get cache() {
    return this.getModule<CacheModule>(CoreModuleName.CACHE);
  }

  get aiproxy() {
    return this.getModule<AIProxyModule>(CoreModuleName.AIPROXY);
  }
}