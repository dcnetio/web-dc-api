// index.ts
// 导出主要类和功能

export { DC } from './dc';
export { registerServiceWorker, isServiceWorkerActive, updateServiceWorker } from './common/service-worker';
export * from './common/types/types';
export * from './interfaces';
export * from './common/define';
export {ThemePermission} from './common/constants';

// 导出模块系统
export { ModuleSystem, CoreModuleName } from './common/module-system';
export type { DCModule } from './common/module-system';
 

// 导出核心模块
export * from './modules';

// 导出工具类
export { createLogger, configureLogger, LogLevel } from './util/logger';

// 导出keyManager
export { KeyManager } from './common/dc-key/keyManager';

// 导出私钥
export { Ed25519PrivKey, Ed25519PubKey } from './common/dc-key/ed25519';

// 导出错误类型
export { Errors } from './common/error';


