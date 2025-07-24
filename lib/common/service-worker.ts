// service-worker.ts
// 负责处理 Service Worker 相关的功能

import { IFileOperations } from "../interfaces";
import { createLogger } from "../util/logger";

const logger = createLogger('ServiceWorker');

/**
 * 注册 Service Worker 并设置消息监听器
 * @param fileOps 文件操作对象，用于处理IPFS请求
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function registerServiceWorker(fileOps?: IFileOperations, swUrl: string = ''): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      // const registration = await navigator.serviceWorker.register(
      //   new URL('/sw.js', import.meta.url).href
      // );
      if (window.location.protocol != 'https:' && window.location.hostname != 'localhost') {
        logger.error('ServiceWorker 仅支持https协议');
        return null;
      }
      
      // 路径在函数内部解析，不在模块顶层
      const swPath = typeof window !== 'undefined' 
      ? (new URL(swUrl || '/sw.js', window.location.origin).href)
      : '/sw.js';
      
      const registration = await navigator.serviceWorker.register(swPath);
      
      // 设置消息监听器处理IPFS资源请求
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'ipfs-fetch') {
           await handleIpfsRequest(event.data, event.ports[0]!, fileOps);
        }
      });
      
      return registration;
    } catch (error) {
      logger.error('ServiceWorker 注册失败:', error);
      return null;
    }
  }
  return Promise.reject('Service Worker not supported');
}

/**
 * 处理IPFS请求
 * @param data 请求数据
 * @param port 消息端口
 * @param fileOps 文件操作对象
 */
async function handleIpfsRequest(
  data: { id: string, pathname: string, range?: string }, 
  port: MessagePort, 
  fileOps?: IFileOperations
): Promise<void> {
  const { id, pathname, range } = data;
  let fileSize = 0;
  
  try {
    // 从路径提取IPFS路径和解密密钥
    const pathParts = pathname.split('/');
    let ipfsPath = pathParts[3]!; // <ipfs-hash>[_<key>]
    
    // 提取加密密钥（如果有）
    let decryptKey = '';
    const keyParts = ipfsPath.split('_');
    if (keyParts.length > 1) {
      ipfsPath = keyParts[0]!;
      decryptKey = keyParts[1]!;
    }
    
    let fileData: Uint8Array | null = null;
    const DEFAULT_CHUNK_SIZE = 3 * 1024 * 1024; // 默认返回3MB数据块
    let start = 0;
    let end = 0;
    
    if (fileOps) {
      if (range) {
        // 处理范围请求（视频跳转等）
        try {
          const fileStream = await fileOps.getSeekableFileStream(ipfsPath, decryptKey);
          fileSize = fileStream.getSize();
          if (fileStream) {
            const match = range.match(/bytes=(\d+)-(\d+)?/);
            if (match) {
              start = parseInt(match[1]!);
              end = match[2] ? parseInt(match[2]) : start + DEFAULT_CHUNK_SIZE-1;
              if (end >= fileSize) {
                // 如果请求的结束范围超过文件大小，则调整为文件大小
                end = fileSize - 1;
              }
              logger.info(`处理范围请求: ${start}-${end}, 总大小: ${fileStream.getSize()}`);
              fileStream.seek(start);
              fileData = await fileStream.read(end - start + 1);
              
              // 如果读取到文件末尾，清理缓存
              if (end >= fileStream.getSize() - 1) {
                logger.info(`文件读取完成，清理缓存: ${pathname}`);
                fileOps.clearFileCache(pathname);
              }
            }
          }
        } catch (err) {
          logger.error('文件流操作失败:', err);
          // 发生错误时清理缓存
          fileOps.clearFileCache(pathname);
          port.postMessage({
            success: false,
            error: err instanceof Error ? err.message : 'File stream operation failed'
          });
          return;
        }
      } else {
        const [fileContent, error] = await fileOps.getFile(ipfsPath, decryptKey);
       fileData = fileContent;
        // 普通文件请求
        fileSize = fileData ? fileData.length : 0;
        // 非范围请求的文件读取完成后，清理缓存
        fileOps.clearFileCache(pathname);
      }
      
      if (!fileData) {
        port.postMessage({
          success: false,
          error: 'no data',
        });
        return 
      }
      
      if (fileData && fileData.buffer) {
        // 创建不包含 buffer 的基本响应对象
        const responseObj = {
          success: true,
          status: range ? 206 : 200,
          headers: {
            'Content-Range': range ? `bytes ${start}-${end}/${fileSize}` : undefined,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Content-Length': fileData.length,
          },
        };
        
        // 传递时才添加 data 字段
        // 注意：在这个方法里 fileData.buffer 被转移后，fileData 将不再可用
        port.postMessage({
          ...responseObj,
          data: fileData.buffer
        }, [fileData.buffer]);
      
        // 手动清除引用
        fileData = null;
      } else {
        port.postMessage({
          success: false,
          error: 'Missing data buffer'
        });
      }
    } else {
      // 文件操作对象不可用
      port.postMessage({
        success: false,
        error: 'File operations not available'
      });
    }
  } catch (error) {
    logger.error('处理IPFS请求失败:', error);
    // 全局错误捕获时也清理缓存
    if (fileOps && pathname) {
      fileOps.clearFileCache(pathname);
    }
    port.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * 检查Service Worker状态
 * @returns Promise<boolean> Service Worker是否活跃
 */
export async function isServiceWorkerActive(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    return !!registration.active;
  } catch (error) {
    logger.error('检查Service Worker状态失败:', error);
    return false;
  }
}

/**
 * 强制更新Service Worker
 * @returns Promise<boolean> 是否成功更新
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      logger.info('Service Worker 已更新');
      return true;
    }
    return false;
  } catch (error) {
    logger.error('更新Service Worker失败:', error);
    return false;
  }
}