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
    allSettled<T>(
      values: Iterable<T | PromiseLike<T>>,
    ): Promise<Array<PromiseSettledResult<T>>>;
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
  }

  interface AbortSignal {
    throwIfAborted(): void;
  }

  interface AbortSignalConstructor {
    timeout(milliseconds: number): AbortSignal;
  }

  interface Array<T> {
    at(index: number): T | undefined;
    findLastIndex(
      predicate: (value: T, index: number, array: T[]) => boolean,
      thisArg?: unknown,
    ): number;
    toSorted(compareFn?: (a: T, b: T) => number): T[];
    toReversed(): T[];
    toSpliced(start: number, deleteCount?: number, ...items: T[]): T[];
    with(index: number, value: T): T[];
  }

  interface String {
    at(index: number): string | undefined;
    replaceAll(
      searchValue: string | RegExp,
      replaceValue:
        | string
        | ((substring: string, ...args: unknown[]) => string),
    ): string;
  }

  interface ObjectConstructor {
    hasOwn(instance: object, prop: PropertyKey): boolean;
  }

  interface AggregateError extends Error {
    errors: any[];
  }

  var AggregateError: {
    new (errors: any[], message?: string): AggregateError;
    prototype: AggregateError;
  };

  function queueMicrotask(callback: () => void): void;
}

if (typeof Promise !== "undefined" && !Promise.withResolvers) {
  Promise.withResolvers = function <T = any>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof AggregateError === "undefined") {
  class AggregateErrorPolyfill extends Error {
    errors: any[];

    constructor(errors: unknown[], message?: string) {
      super(message ?? "AggregateError");
      this.name = "AggregateError";
      this.errors = errors;
    }
  }

  (
    globalThis as unknown as { AggregateError: typeof AggregateErrorPolyfill }
  ).AggregateError = AggregateErrorPolyfill;
}

if (typeof Promise !== "undefined" && !Promise.allSettled) {
  Promise.allSettled = function <T>(
    values: Iterable<T | PromiseLike<T>>,
  ): Promise<Array<PromiseSettledResult<T>>> {
    return Promise.all(
      Array.from(values).map((value) =>
        Promise.resolve(value).then(
          (result) =>
            ({
              status: "fulfilled",
              value: result,
            }) as PromiseFulfilledResult<T>,
          (reason) => ({ status: "rejected", reason }) as PromiseRejectedResult,
        ),
      ),
    );
  };
}

if (typeof Promise !== "undefined" && !Promise.any) {
  Promise.any = function <T>(values: Iterable<T | PromiseLike<T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const errors: unknown[] = [];
      let pending = 0;
      let settled = false;

      for (const value of values) {
        pending += 1;
        Promise.resolve(value).then(
          (result) => {
            if (settled) {
              return;
            }
            settled = true;
            resolve(result);
          },
          (reason) => {
            errors.push(reason);
            pending -= 1;
            if (pending === 0 && !settled) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          },
        );
      }

      if (pending === 0) {
        reject(new AggregateError([], "All promises were rejected"));
      }
    });
  };
}

if (
  typeof AbortSignal !== "undefined" &&
  !AbortSignal.prototype.throwIfAborted
) {
  AbortSignal.prototype.throwIfAborted = function () {
    if (!this.aborted) {
      return;
    }

    const reason = (this as AbortSignal & { reason?: unknown }).reason;
    if (reason instanceof Error) {
      throw reason;
    }

    if (typeof DOMException !== "undefined") {
      throw new DOMException("Aborted", "AbortError");
    }

    throw new Error("Aborted");
  };
}

if (
  typeof AbortSignal !== "undefined" &&
  typeof AbortController !== "undefined" &&
  !AbortSignal.timeout
) {
  AbortSignal.timeout = function (milliseconds: number): AbortSignal {
    const controller = new AbortController();
    const timerId = setTimeout(() => {
      try {
        controller.abort(new DOMException("Aborted", "AbortError"));
      } catch {
        controller.abort();
      }
    }, milliseconds);

    if (!controller.signal.aborted) {
      controller.signal.addEventListener(
        "abort",
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

const arrayProto = Array.prototype as unknown as {
  findLast?: <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ) => T | undefined;
  findLastIndex?: <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ) => number;
  toSorted?: <T>(this: T[], compareFn?: (a: T, b: T) => number) => T[];
  toReversed?: <T>(this: T[]) => T[];
  toSpliced?: <T>(
    this: T[],
    start: number,
    deleteCount?: number,
    ...items: T[]
  ) => T[];
  with?: <T>(this: T[], index: number, value: T) => T[];
  at?: <T>(this: T[], index: number) => T | undefined;
};

if (!arrayProto.findLast) {
  arrayProto.findLast = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ): T | undefined {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.findLast called on null or undefined",
      );
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }

    for (let i = this.length - 1; i >= 0; i -= 1) {
      const value = this[i];
      if (predicate.call(thisArg, value, i, this)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!arrayProto.at) {
  arrayProto.at = function <T>(this: T[], index: number): T | undefined {
    if (this == null) {
      throw new TypeError("Array.prototype.at called on null or undefined");
    }
    const len = this.length;
    let relativeIndex = Math.trunc(index) || 0;
    if (relativeIndex < 0) {
      relativeIndex += len;
    }
    if (relativeIndex < 0 || relativeIndex >= len) {
      return undefined;
    }
    return this[relativeIndex];
  };
}

if (!arrayProto.findLastIndex) {
  arrayProto.findLastIndex = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ): number {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.findLastIndex called on null or undefined",
      );
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }

    for (let i = this.length - 1; i >= 0; i -= 1) {
      if (predicate.call(thisArg, this[i], i, this)) {
        return i;
      }
    }
    return -1;
  };
}

if (!arrayProto.toSorted) {
  arrayProto.toSorted = function <T>(
    this: T[],
    compareFn?: (a: T, b: T) => number,
  ): T[] {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.toSorted called on null or undefined",
      );
    }
    const copy = this.slice();
    return compareFn ? copy.sort(compareFn) : copy.sort();
  };
}

if (!arrayProto.toReversed) {
  arrayProto.toReversed = function <T>(this: T[]): T[] {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.toReversed called on null or undefined",
      );
    }
    return this.slice().reverse();
  };
}

if (!arrayProto.toSpliced) {
  arrayProto.toSpliced = function <T>(
    this: T[],
    start: number,
    deleteCount?: number,
    ...items: T[]
  ): T[] {
    if (this == null) {
      throw new TypeError(
        "Array.prototype.toSpliced called on null or undefined",
      );
    }
    const copy = this.slice();
    if (deleteCount === undefined) {
      copy.splice(start);
    } else {
      copy.splice(start, deleteCount, ...items);
    }
    return copy;
  };
}

if (!arrayProto.with) {
  arrayProto.with = function <T>(this: T[], index: number, value: T): T[] {
    if (this == null) {
      throw new TypeError("Array.prototype.with called on null or undefined");
    }
    const len = this.length;
    const actualIndex = index < 0 ? len + index : index;
    if (actualIndex < 0 || actualIndex >= len) {
      throw new RangeError("Invalid index");
    }
    const copy = this.slice();
    copy[actualIndex] = value;
    return copy;
  };
}

if (!String.prototype.at) {
  String.prototype.at = function (index: number): string | undefined {
    if (this == null) {
      throw new TypeError("String.prototype.at called on null or undefined");
    }
    const str = String(this);
    const len = str.length;
    let relativeIndex = Math.trunc(index) || 0;
    if (relativeIndex < 0) {
      relativeIndex += len;
    }
    if (relativeIndex < 0 || relativeIndex >= len) {
      return undefined;
    }
    return str.charAt(relativeIndex);
  };
}

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (
    searchValue: string | RegExp,
    replaceValue: string | ((substring: string, ...args: unknown[]) => string),
  ): string {
    if (this == null) {
      throw new TypeError(
        "String.prototype.replaceAll called on null or undefined",
      );
    }
    const str = String(this);

    if (searchValue instanceof RegExp) {
      if (!searchValue.global) {
        throw new TypeError(
          "String.prototype.replaceAll called with a non-global RegExp",
        );
      }
      return str.replace(searchValue, replaceValue as string);
    }

    const escaped = String(searchValue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return str.replace(new RegExp(escaped, "g"), replaceValue as string);
  };
}

if (!Object.hasOwn) {
  Object.hasOwn = function (instance: object, prop: PropertyKey): boolean {
    if (instance == null) {
      throw new TypeError("Object.hasOwn called on null or undefined");
    }
    return Object.prototype.hasOwnProperty.call(Object(instance), prop);
  };
}

if (typeof queueMicrotask !== "function") {
  (
    globalThis as unknown as { queueMicrotask: (callback: () => void) => void }
  ).queueMicrotask = (callback) => {
    Promise.resolve()
      .then(callback)
      .catch((error) => {
        setTimeout(() => {
          throw error;
        }, 0);
      });
  };
}
export { DC } from "./dc";
export { pb } from "./proto/pay_server_proto";
export { BaseEntity } from "./serverless/base_entity";
export {
  EntityRepository,
  type FindIndexOptions,
  type FindValuesOptions,
  composeCompositeIndexValue,
} from "./serverless/base_repository";
export * from "./serverless/decorator_factory";
// export * from './serverless/browser_schema_extractor'; // 文件不存在，已注释
export {
  registerServiceWorker,
  isServiceWorkerActive,
  updateServiceWorker,
} from "./common/service-worker";
export * from "./common/types/types";
export * from "./interfaces";
export * from "./common/define";
export { ThemePermission, QWEN_VOICE_OPTIONS } from "./common/constants";
export { KeyValueDB } from "./implements/keyvalue/manager";

// 导出模块系统
export { ModuleSystem, CoreModuleName } from "./common/module-system";
export type { DCModule } from "./common/module-system";

// 导出核心模块
export * from "./modules";

// 导出工具类
export { createLogger, configureLogger, LogLevel } from "./util/logger";

// 导出keyManager
export { KeyManager } from "./common/dc-key/keyManager";
export {
  AIProxyRealtimeVoiceSession,
  createAliyunRealtimeVoiceProtocolAdapter,
  createOpenAIRealtimeVoiceProtocolAdapter,
  createBrowserRealtimeVoiceInputAdapter,
  createBrowserRealtimeVoiceOutputAdapter,
  createWechatMiniProgramRealtimeSocketFactory,
  createWechatMiniProgramVoiceInputAdapter,
  resolveRealtimeVoiceRuntime,
} from "./implements/aiproxy/realtime-voice-session";

// 导出Worker辅助函数
export { exposeDC, wrapWorker } from "./worker";

// 导出私钥
export { Ed25519PrivKey, Ed25519PubKey } from "./common/dc-key/ed25519";

// 导出错误类型
export { Errors } from "./common/error";
