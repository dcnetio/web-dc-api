// service-worker.ts
// 负责处理 Service Worker 相关的功能

import type { SeekableFileStream } from "../implements/file/seekableFileStream";
import type { IFileOperations } from "../interfaces";
import { createLogger } from "../util/logger";
import { parseRangeHeader } from "./http-range";

const logger = createLogger("ServiceWorker");

let swMessageHandler: ((event: MessageEvent) => void) | null = null;

/**
 * 注册 Service Worker 并设置消息监听器
 * @param fileOps 文件操作对象，用于处理IPFS请求
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function registerServiceWorker(
  fileOps?: IFileOperations,
  swUrl: string = "",
  swScope: string = ""
): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    logger.error("ServiceWorker 仅支持 https 或 localhost");
    return null;
  }
  const swPath = new URL(swUrl || "/sw.js", location.origin).href;
  const registration = await navigator.serviceWorker.register(
    swPath,
    swScope ? { scope: new URL(swScope, location.origin).href } : undefined
  );
  if (registration?.scope) {
    logger.info(`ServiceWorker scope: ${registration.scope}`);
  }
  // 只保留一个监听器，避免重复处理同一请求
  if (swMessageHandler) {
    navigator.serviceWorker.removeEventListener("message", swMessageHandler);
  }
  swMessageHandler = async (event: MessageEvent) => {
    if (event.data && event.data.type === "ipfs-fetch") {
      const port = event.ports?.[0];
      if (!port) {
        logger.warn("SW 未提供 MessagePort");
        return;
      }
      //里面回一个消息,通知已经收到请求
      port.postMessage({
        success: true,
        message: "Request received",
        status: 999,
      });
      try {
        await handleIpfsRequest(event.data, port, fileOps);
      } catch (e) {
        logger.error("handleIpfsRequest 处理异常:", e);
        port.postMessage({ success: false, error: String(e) });
      }
    }
  };
  navigator.serviceWorker.addEventListener("message", swMessageHandler);
  // 激活或接管异常不应无限阻塞整个 SDK 初始化。
  const ready = await new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => resolve(false), 10000);
    navigator.serviceWorker.ready.then(
      () => {
        clearTimeout(timeout);
        resolve(true);
      },
      () => {
        clearTimeout(timeout);
        resolve(false);
      }
    );
  });
  if (!ready) {
    logger.warn("ServiceWorker 激活等待超时，将在后续页面加载时继续接管");
  } else if (!navigator.serviceWorker.controller) {
    logger.warn("ServiceWorker 已注册但尚未控制当前页面");
  }
  return registration;
}

/**
 * 处理IPFS请求
 * @param data 请求数据
 * @param port 消息端口
 * @param fileOps 文件操作对象
 */
export async function handleIpfsRequest(
  data: { id: string; pathname: string; range?: string | null },
  port: MessagePort,
  fileOps?: IFileOperations
): Promise<void> {
  const { pathname, range } = data;
  let fileSize = 0;

  try {
    // 从路径提取IPFS路径和解密密钥
    const pathParts = pathname.split("/");
    const resource = pathParts[3]; // <ipfs-hash>[_<key>]
    if (!resource) throw new Error("无效的 IPFS 请求路径");
    let ipfsPath = resource;

    // 提取加密密钥（如果有）
    let decryptKey = "";
    const keySeparator = ipfsPath.indexOf("_");
    if (keySeparator >= 0) {
      decryptKey = ipfsPath.slice(keySeparator + 1);
      ipfsPath = ipfsPath.slice(0, keySeparator);
    }
    if (!ipfsPath) throw new Error("IPFS CID 不能为空");

    let fileData: Uint8Array | null = null;
    const DEFAULT_CHUNK_SIZE = 3 * 1024 * 1024; // 默认返回3MB数据块
    let start = 0;
    let end = 0;
    let subPath = "";
    if (pathParts.length > 4) {
      const encodedSubPath = pathParts.slice(4).join("/");
      try {
        subPath = decodeURIComponent(encodedSubPath); // 目录下的文件路径
      } catch {
        subPath = encodedSubPath;
      }
    }

    if (fileOps) {
      // 判断是文件还是目录
      const type = await fileOps.isFileOrDir(ipfsPath);
      if (range) {
        // 处理范围请求（视频跳转等）
        try {
          let fileStream: SeekableFileStream | null = null;
          if (type === "directory") {
            // 目录下的文件流
            fileStream = await fileOps.getSeekableFileStreamFromDir(
              ipfsPath,
              subPath,
              decryptKey
            );
          } else {
            // 普通文件流
            fileStream = await fileOps.getSeekableFileStream(
              ipfsPath,
              decryptKey
            );
          }
          if (!fileStream) {
            throw new Error(`获取文件流失败: ${ipfsPath}`);
          }
          fileSize = fileStream.getSize();
          const parsedRange = parseRangeHeader(
            range,
            fileSize,
            DEFAULT_CHUNK_SIZE,
          );
          if (!parsedRange) {
            fileOps.clearFileCache(pathname);
            port.postMessage({
              success: false,
              status: 416,
              error: "Range Not Satisfiable",
              headers: { "Content-Range": `bytes */${fileSize}` },
            });
            return;
          }

          ({ start, end } = parsedRange);
          logger.info(`处理范围请求: ${start}-${end}, 总大小: ${fileSize}`);
          fileStream.seek(start);
          fileData = await fileStream.read(end - start + 1);
          if (fileData.length === 0) {
            throw new Error(`范围读取未返回数据: ${start}-${end}`);
          }
          // 后端提前结束时按实际读取字节修正 Content-Range。
          end = start + fileData.length - 1;

          if (end >= fileSize - 1) {
            logger.info(`文件读取完成，清理缓存: ${pathname}`);
            fileOps.clearFileCache(pathname);
          }
        } catch (err) {
          logger.error("文件流操作失败:", err);
          // 发生错误时清理缓存
          fileOps.clearFileCache(pathname);
          port.postMessage({
            success: false,
            error:
              err instanceof Error
                ? err.message
                : "File stream operation failed",
          });
          return;
        }
      } else {
        let fileContent: Uint8Array | null = null;
        if (type === "directory") {
          // 目录下的文件请求
          const [content, error] = await fileOps.getFileFromDir(
            ipfsPath,
            subPath,
            decryptKey
          );
          if (error) {
            throw error;
          }
          if (content instanceof Uint8Array) {
            fileContent = content;
          } else {
            throw new Error("请求的路径不是文件");
          }
        } else {
          // 普通文件请求
          const [content, error] = await fileOps.getFile(ipfsPath, decryptKey);
          if (error) {
            throw error;
          }
          fileContent = content;
        }
        fileData = fileContent;
        // 普通文件请求
        fileSize = fileData ? fileData.length : 0;
        // 非范围请求的文件读取完成后，清理缓存
        fileOps.clearFileCache(pathname);
      }

      if (!fileData) {
        port.postMessage({
          success: false,
          error: "no data",
        });
        return;
      }

      if (fileData && fileData.buffer) {
        // 始终传递当前视图的精确字节，避免 subarray 把底层缓冲区的额外数据带给 SW。
        const responseData = fileData.slice().buffer;
        // 创建不包含 buffer 的基本响应对象
        const responseObj = {
          success: true,
          status: range ? 206 : 200,
          headers: {
            "Content-Range": range
              ? `bytes ${start}-${end}/${fileSize}`
              : undefined,
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache",
            "Content-Length": fileData.length,
          },
        };

        // 传递时才添加 data 字段
        // 传输复制后的精确缓冲区，不分离调用方持有的原始 Uint8Array。
        port.postMessage(
          {
            ...responseObj,
            data: responseData,
          },
          [responseData]
        );

        // 手动清除引用
        fileData = null;
      } else {
        port.postMessage({
          success: false,
          error: "Missing data buffer",
        });
      }
    } else {
      // 文件操作对象不可用
      port.postMessage({
        success: false,
        error: "File operations not available",
      });
    }
  } catch (error) {
    logger.error("处理IPFS请求失败:", error);
    // 全局错误捕获时也清理缓存
    if (fileOps && pathname) {
      fileOps.clearFileCache(pathname);
    }
    port.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * 检查Service Worker状态
 * @returns Promise<boolean> Service Worker是否活跃
 */
export async function isServiceWorkerActive(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration?.active;
  } catch (error) {
    logger.error("检查Service Worker状态失败:", error);
    return false;
  }
}

/**
 * 强制更新Service Worker
 * @returns Promise<boolean> 是否成功更新
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      logger.info("Service Worker 已更新");
      return true;
    }
    return false;
  } catch (error) {
    logger.error("更新Service Worker失败:", error);
    return false;
  }
}
