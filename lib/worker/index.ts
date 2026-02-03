import * as Comlink from "comlink";
import { DC } from "../dc";

/**
 * 暴露 DC 类
 * 供 Web Worker 入口文件调用
 */
export function exposeDC() {
  Comlink.expose(DC);
}

/**
 * 包装 Worker
 * 供主线程调用
 */
export function wrapWorker(worker: Worker): any {
  return Comlink.wrap(worker);
}
