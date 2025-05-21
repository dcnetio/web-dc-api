// module-system.ts
// 定义模块注册和管理系统

import { DCContext } from "./interfaces";
import { createLogger } from "./util/logger";

const logger = createLogger('ModuleSystem');

/**
 * 模块接口，所有功能模块必须实现此接口
 */
export interface DCModule {
  /**
   * 模块名称，用于标识和日志
   */
  readonly moduleName: string;
  
  /**
   * 模块初始化方法
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  initialize(context: DCContext): Promise<boolean>;
  
  /**
   * 模块关闭方法
   */
  shutdown(): Promise<void>;
}

/**
 * 核心模块名称枚举
 */
export enum CoreModuleName {
  FILE = 'file',
  AUTH = 'auth',
  COMMENT = 'comment',
  DATABASE = 'database',
  MESSAGE = 'message',
  KEYVALUE = 'keyvalue',
  CACHE = 'cache',
  CLIENT = 'client'
}

/**
 * 模块系统
 * 负责管理和协调所有功能模块
 */
export class ModuleSystem {
  private modules: Map<string, DCModule> = new Map();
  private context: DCContext;
  private initialized: boolean = false;
  
  /**
   * 创建模块系统
   * @param context DC上下文
   */
  constructor(context: DCContext) {
    this.context = context;
  }
  
  /**
   * 注册模块
   * @param module 要注册的模块
   * @returns 是否注册成功
   */
  registerModule(module: DCModule): boolean {
    if (this.modules.has(module.moduleName)) {
      logger.warn(`模块 ${module.moduleName} 已存在，无法重复注册`);
      return false;
    }
    
    this.modules.set(module.moduleName, module);
    logger.info(`模块 ${module.moduleName} 已注册`);
    return true;
  }
  
  /**
   * 获取模块
   * @param moduleName 模块名称
   * @returns 模块实例或undefined
   */
  getModule<T extends DCModule>(moduleName: string): T | undefined {
    return this.modules.get(moduleName) as T | undefined;
  }
  
  /**
   * 初始化所有已注册的模块
   * @returns 是否所有模块都成功初始化
   */
  async initializeAll(): Promise<boolean> {
    logger.info("开始初始化所有模块...");
    
    // 按照特定顺序初始化核心模块
    const initOrder = [
      CoreModuleName.AUTH,      // 认证模块优先，因为其他模块可能依赖认证
      CoreModuleName.FILE,      // 文件模块其次，许多功能依赖文件操作
      CoreModuleName.DATABASE,  // 数据库模块
      CoreModuleName.COMMENT,   // 评论模块
      CoreModuleName.MESSAGE,   // 消息模块
      CoreModuleName.KEYVALUE,   // 键值存储模块
      CoreModuleName.CLIENT     // 客户端模块
    ];
    
    // 先初始化核心模块
    for (const moduleName of initOrder) {
      const module = this.modules.get(moduleName);
      if (module) {
        logger.info(`初始化核心模块: ${moduleName}`);
        try {
          const success = await module.initialize(this.context);
          if (!success) {
            logger.error(`核心模块 ${moduleName} 初始化失败`);
            return false;
          }
        } catch (error) {
          logger.error(`核心模块 ${moduleName} 初始化出错:`, error);
          return false;
        }
      }
    }
    
    // 然后初始化其余的扩展模块
    for (const [name, module] of this.modules.entries()) {
      if (!initOrder.includes(name as CoreModuleName)) {
        logger.info(`初始化扩展模块: ${name}`);
        try {
          const success = await module.initialize(this.context);
          if (!success) {
            logger.error(`扩展模块 ${name} 初始化失败`);
            return false;
          }
        } catch (error) {
          logger.error(`扩展模块 ${name} 初始化出错:`, error);
          return false;
        }
      }
    }
    
    this.initialized = true;
    logger.info("所有模块初始化完成");
    return true;
  }
  
  /**
   * 关闭所有模块
   */
  async shutdownAll(): Promise<void> {
    logger.info("开始关闭所有模块...");
    
    // 逆序关闭模块
    const modules = Array.from(this.modules.entries());
    for (let i = modules.length - 1; i >= 0; i--) {
      const [name, module] = modules[i];
      try {
        logger.info(`关闭模块: ${name}`);
        await module.shutdown();
      } catch (error) {
        logger.error(`关闭模块 ${name} 时出错:`, error);
      }
    }
    
    this.initialized = false;
    logger.info("所有模块已关闭");
  }
  
  /**
   * 检查模块系统是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * 获取已注册的模块列表
   */
  getRegisteredModules(): string[] {
    return Array.from(this.modules.keys());
  }
}