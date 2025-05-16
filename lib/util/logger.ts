// util/logger.ts
// 提供统一的日志接口

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * 日志配置接口
 */
export interface LogConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableModuleName: boolean;
}

let globalConfig: LogConfig = {
  level: LogLevel.INFO,
  enableTimestamp: true,
  enableModuleName: true
};

/**
 * 设置全局日志配置
 * @param config 日志配置
 */
export function configureLogger(config: Partial<LogConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * 日志接口
 */
export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * 创建日志记录器
 * @param module 模块名称
 * @returns 日志记录器对象
 */
export function createLogger(module: string): Logger {
  return {
    debug(message: string, ...args: any[]): void {
      if (globalConfig.level <= LogLevel.DEBUG) {
        const prefix = buildPrefix('DEBUG', module);
        console.debug(prefix + message, ...args);
      }
    },
    
    info(message: string, ...args: any[]): void {
      if (globalConfig.level <= LogLevel.INFO) {
        const prefix = buildPrefix('INFO', module);
        console.info(prefix + message, ...args);
      }
    },
    
    warn(message: string, ...args: any[]): void {
      if (globalConfig.level <= LogLevel.WARN) {
        const prefix = buildPrefix('WARN', module);
        console.warn(prefix + message, ...args);
      }
    },
    
    error(message: string, ...args: any[]): void {
      if (globalConfig.level <= LogLevel.ERROR) {
        const prefix = buildPrefix('ERROR', module);
        console.error(prefix + message, ...args);
      }
    }
  };
}

/**
 * 构建日志前缀
 * @param level 日志级别
 * @param module 模块名称
 * @returns 格式化的前缀字符串
 */
function buildPrefix(level: string, module: string): string {
  let prefix = '';
  
  if (globalConfig.enableTimestamp) {
    prefix += `[${new Date().toISOString()}] `;
  }
  
  if (globalConfig.enableModuleName) {
    prefix += `[${module}] `;
  }
  
  prefix += `[${level}] `;
  
  return prefix;
}