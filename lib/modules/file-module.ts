// modules/file-module.ts
// 文件功能模块

import {  IFileOperations } from "../interfaces/file-interface";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { FileManager } from "../implements/file/manager";
import { FileCacheManager } from "../implements/file/file-cache-manager";
import { SeekableFileStream } from "../implements/file/seekableFileStream";
import { createLogger } from "../util/logger";
import { registerServiceWorker } from "../common/service-worker";

const logger = createLogger('FileModule');

/**
 * 文件模块
 * 提供文件上传、下载、缓存等功能
 */
export class FileModule implements DCModule, IFileOperations {
  readonly moduleName = CoreModuleName.FILE;
  private fileManager!: FileManager;
  private fileCacheManager!: FileCacheManager;
  private initialized: boolean = false;
  private swUrl: string;
  
  constructor(url: string) {
    this.swUrl = url;
  }

  /**
   * 初始化文件模块
   * @param context DC上下文
   * @returns 是否初始化成功
   */
  async initialize(context: DCContext): Promise<boolean> {
    try {
      this.fileManager = new FileManager(
        context.dcutil,
        context.connectedDc,
        context.dcChain,
        context.dcNodeClient,
        context
      );
      
      this.fileCacheManager = new FileCacheManager();
      
      // 注册 Service Worker
      try {
        //todo remove commnet
        await registerServiceWorker(this, this.swUrl || '');
        logger.info('Service Worker 已注册');
      } catch (err) {
        logger.warn('Service Worker 注册失败:', err);
        // 服务工作者注册失败不阻断模块初始化
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error("文件模块初始化失败:", error);
      return false;
    }
  }
  
  /**
   * 关闭文件模块
   */
  async shutdown(): Promise<void> {
    // 清理所有缓存
    if (this.fileCacheManager) {
      this.clearFileCache();
      this.fileCacheManager.stopCacheCleanupTask();
    }
    this.initialized = false;
  }
  
  /**
   * 获取可寻址文件流
   */
  async getSeekableFileStream(ipfsPath: string, decryptKey: string): Promise<SeekableFileStream> {
    this.assertInitialized();
    
    try {
      // 先查看缓存
      const cachedStream = this.fileCacheManager.getCachedFileStream(ipfsPath, decryptKey);
      if (cachedStream) {
        return cachedStream;
      }
      
      // 没有缓存，创建新的流
      const fileStream = await this.fileManager.createSeekableFileStream(ipfsPath, decryptKey);
      if(!fileStream) {
        throw new Error(`获取文件流失败: ${ipfsPath}`);
      }
      
      // 将新创建的流保存到缓存
      this.fileCacheManager.cacheFileStream(ipfsPath, decryptKey, fileStream);
      
      return fileStream;
    } catch (error) {
      logger.error(`获取文件流失败: ${ipfsPath}`, error);
      throw new Error(`获取文件流失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 清理文件缓存
   */
  clearFileCache(pathname?: string): void {
    this.assertInitialized();
    try {
      this.fileCacheManager.clearFileCache(pathname);
    } catch (error) {
      logger.error(`清理文件缓存失败`, error);
    }
  }
  
  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { total: number, keys: string[] } {
    this.assertInitialized();
    return this.fileCacheManager.getCacheStats();
  }
  
  /**
   * 获取文件内容
   */
  async getFile(cid: string, decryptKey: string): Promise<Uint8Array | null> {
    this.assertInitialized();
    try {
      const fileContent = await this.fileManager.getFileFromDc(cid, decryptKey);
      return fileContent;
    } catch (error) {
      logger.error(`获取文件失败: ${cid}`, error);
      throw new Error(`获取文件失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 创建文件流
   */
  async createFileStream(
    cid: string,
    decryptKey: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    this.assertInitialized();
    try {
      const fileStream = await this.fileManager.createSeekableFileStream(
        cid,
        decryptKey
      );
      if(!fileStream) {
        return null;
      }
      return fileStream.createReadableStream();
    } catch (error) {
      logger.error(`创建文件流失败: ${cid}`, error);
      return null;
    }
  }
  
  /**
   * 添加文件
   */
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: number, size: number) => void
  ): Promise<[string | null, Error | null]> {
    this.assertInitialized();
    try {
      if (!file) {
        throw new Error("文件不能为空");
      }
      const res = await this.fileManager.addFile(file, enkey, onUpdateTransmitSize);
      return res;
    } catch (error) {

      logger.error(`添加文件失败: ${file?.name}`, error);
      throw new Error(`添加文件失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 添加文件夹
   */
  async addFolder(
    files: FileList,
    enkey: string,
    onUpdateTransmitCount: (status: number, total: number, process: number) => void
  ): Promise<[string | null, Error | null]> {
    this.assertInitialized();
    try {
      if (!files || files.length === 0) {
        throw new Error("文件夹不能为空");
      }
      const res = await this.fileManager.addFolder(files, enkey, onUpdateTransmitCount);
      return res;
    } catch (error) {
      logger.error(`添加文件夹失败`, error);
      throw new Error(`添加文件夹失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 断言模块已初始化
   */
  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("文件模块未初始化");
    }
  }
}