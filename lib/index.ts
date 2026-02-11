// index.ts
// 导出主要类和功能
// 在您库的入口文件开头添加

declare global {
  interface PromiseConstructor {
    withResolvers<T = any>(): {
      promise: Promise<T>;
      resolve: (value: T | PromiseLike<T>) => void;
      reject: (reason?: any) => void;
    };
  }

  interface AbortSignal {
    throwIfAborted(): void;
  }

  interface AbortSignalConstructor {
    timeout(milliseconds: number): AbortSignal;
  }
}

if (typeof Promise !== 'undefined' && !Promise.withResolvers) {
  Promise.withResolvers = function<T = any>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof AbortSignal !== 'undefined' && !AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function () {
    if (!this.aborted) {
      return;
    }

    const reason = (this as AbortSignal & { reason?: unknown }).reason;
    if (reason instanceof Error) {
      throw reason;
    }

    if (typeof DOMException !== 'undefined') {
      throw new DOMException('Aborted', 'AbortError');
    }

    throw new Error('Aborted');
  };
}

if (
  typeof AbortSignal !== 'undefined' &&
  typeof AbortController !== 'undefined' &&
  !AbortSignal.timeout
) {
  AbortSignal.timeout = function (milliseconds: number): AbortSignal {
    const controller = new AbortController();
    const timerId = setTimeout(() => {
      try {
        controller.abort(new DOMException('Aborted', 'AbortError'));
      } catch {
        controller.abort();
      }
    }, milliseconds);

    if (!controller.signal.aborted) {
      controller.signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timerId);
        },
        { once: true },
      );
    } else {
      clearTimeout(timerId);
    }

    return controller.signal;
  };
}
export { DC } from './dc';
export {BaseEntity} from './serverless/base_entity';
export { EntityRepository,type FindIndexOptions, type FindValuesOptions,composeCompositeIndexValue} from './serverless/base_repository';
export * from './serverless/decorator_factory';
// export * from './serverless/browser_schema_extractor'; // 文件不存在，已注释
export { registerServiceWorker, isServiceWorkerActive, updateServiceWorker } from './common/service-worker';
export * from './common/types/types';
export * from './interfaces';
export * from './common/define';
export {ThemePermission} from './common/constants';
export {KeyValueDB} from './implements/keyvalue/manager';

// 导出模块系统
export { ModuleSystem, CoreModuleName } from './common/module-system';
export type { DCModule } from './common/module-system';
 

// 导出核心模块
export * from './modules';

// 导出工具类
export { createLogger, configureLogger, LogLevel } from './util/logger';

// 导出keyManager
export { KeyManager } from './common/dc-key/keyManager';

// 导出Worker辅助函数
export { exposeDC, wrapWorker } from './worker';

// 导出私钥
export { Ed25519PrivKey, Ed25519PubKey } from './common/dc-key/ed25519';

// 导出错误类型
export { Errors } from './common/error';


