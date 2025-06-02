import { SeekableFileStream } from "../implements/file/seekableFileStream";

/**
 * 文件操作接口
 * 提供文件上传、下载、缓存等功能
 */
export interface IFileOperations {
  /**
   * 获取可寻址文件流
   * @param ipfsPath IPFS路径或CID
   * @param decryptKey 解密密钥,base32的symmetric key
   * @returns 可寻址文件流实例
   */
  getSeekableFileStream(ipfsPath: string, decryptKey: string): Promise<SeekableFileStream>;
  
  /**
   * 清理文件缓存
   * @param pathname 可选的特定路径，不提供则清除所有缓存
   */
  clearFileCache(pathname?: string): void;
  
  /**
   * 获取缓存统计信息
   * @returns 包含缓存总数和键列表的统计对象
   */
  getCacheStats(): { total: number, keys: string[] };
  
  /**
   * 获取文件内容
   * @param cid 文件的内容标识符
   * @param decryptKey 解密密钥
   * @returns 文件的字节数组，失败则返回undefined
   */
  getFile(cid: string, decryptKey: string): Promise<Uint8Array | undefined>;
  
  /**
   * 创建文件可读流
   * @param cid 文件的内容标识符
   * @param decryptKey 解密密钥
   * @returns 可读流对象，失败则返回null
   */
  createFileStream(cid: string, decryptKey: string): Promise<ReadableStream<Uint8Array> | null>;
  
  /**
   * 添加文件到存储
   * @param file 要上传的文件对象
   * @param enkey 加密密钥
   * @param onUpdateTransmitSize 传输进度回调函数
   * @returns 添加结果
   */
  addFile(file: File, enkey: string, onUpdateTransmitSize: (status: number, size: number) => void): Promise<any>;


  /**
   * 添加文件夹到存储
   * @param files 要上传的文件夹下的文件列表
   * @param enkey 加密密钥
   * @param onUpdateTransmitCount 传输进度回调函数
   * @returns 添加结果
   */
  addFolder(files: FileList, enkey: string, onUpdateTransmitCount: (status: number,total: number, process: number) => void): Promise<any>;

}