import { UnixFS } from "@helia/unixfs";
import { CID } from "multiformats/cid";
import toBuffer from "it-to-buffer";
import {
    decryptContentForBrowser,
    mergeUInt8Arrays,
    sleep,
} from '../util/utils';
import { decryptContent } from "lib/util/dccrypt";

/**
 * 可定位文件流类
 * 支持随机访问和流式读取加密和未加密的IPFS文件
 */
export class SeekableFileStream {
  private position: number = 0;
  private fs: UnixFS;
  private cid: CID;
  private decryptKey: string;
  private fileInfo: { size: number; hasHeader: boolean; headerSize: number };
  private encryptChunkSize: number;
  
  constructor(options: {
    fileInfo: { size: number; hasHeader: boolean; headerSize: number };
    fs: UnixFS;
    cid: CID;
    decryptKey: string;
    encryptChunkSize: number;
  }) {
    this.fileInfo = options.fileInfo;
    this.fs = options.fs;
    this.cid = options.cid;
    this.decryptKey = options.decryptKey;
    this.encryptChunkSize = options.encryptChunkSize;
  }
  
  /**
   * 获取文件大小
   */
  getSize(): number {
    return this.fileInfo.size;
  }
  
  /**
   * 定位到文件指定位置
   * @param position 目标位置
   */
  seek(position: number): void {
    if (position < 0) {
      position = 0;
    } else if (position > this.fileInfo.size) {
      position = this.fileInfo.size;
    }
    this.position = position;
  }
  
  /**
   * 获取当前位置
   */
  getPosition(): number {
    return this.position;
  }
  
  /**
   * 读取指定长度的数据
   * @param length 要读取的字节数
   */
  async read(length: number): Promise<Uint8Array> {
    // 使用局部变量存储当前位置，避免并发问题
    const startPosition = this.position;
    
    if (startPosition >= this.fileInfo.size) {
      // 已到达文件末尾
      return new Uint8Array(0);
    }
    
    // 计算实际读取长度（不超过文件末尾）
    const remainingBytes = this.fileInfo.size - startPosition;
    const actualLength = Math.min(length, remainingBytes);
    
    let result: Uint8Array;
    console.log("**************read actualLength:", actualLength);
    // 根据是否加密选择不同读取策略
    if (this.decryptKey) {
      result = await this.readEncrypted(startPosition, actualLength);
    } else {
      result = await this.readPlain(startPosition, actualLength);
    }
    console.log("**************read result length:", result.length);
    // 仅在成功读取后更新位置
    if(this.position  == startPosition) {  //表示没有seek过
      this.position = startPosition + result.length;
      console.log("**************read this.position:", this.position);
    }
    return result;
   
  }
  
  /**
   * 读取未加密的数据
   * @param startPosition 开始位置
   * @param length 读取长度
   */
  private async readPlain(startPosition: number, length: number): Promise<Uint8Array> {
    try {
      // 计算实际文件中的偏移量（考虑文件头）
      const actualOffset = startPosition + this.fileInfo.headerSize;
      
      // 直接读取指定长度
      const data = await toBuffer(this.fs.cat(this.cid, {
        offset: actualOffset,
        length: length
      }));
      
      return data;
    } catch (err) {
      console.error("Error reading plain data:", err);
      return new Uint8Array(0);
    }
  }
  /**
 * 读取并解密加密数据，无音视频帧保护
 * @param startPosition 开始位置
 * @param length 读取长度
 */
private async readEncrypted(startPosition: number, length: number): Promise<Uint8Array> {
  // 计算块相关参数
  const blockSize = 3 << 20; // 3MB 原始块大小
  const blockIndex = Math.floor(startPosition / blockSize);
  const offsetInBlock = startPosition % blockSize ;
  
  // 计算需要读取的块数
  const endPosition = startPosition + length ;
  const endBlockIndex = Math.floor(endPosition / blockSize);
  const neededBlocks = endBlockIndex - blockIndex + 1;
  
  // 分配适当大小的内存
  const totalSize = Math.min(neededBlocks * blockSize, offsetInBlock + length);
  let decryptedData = new Uint8Array(totalSize);
  
  // 计算文件中的起始位置
  let readStartPosition = this.fileInfo.headerSize + blockIndex * this.encryptChunkSize;


  const readTotalSize = neededBlocks * this.encryptChunkSize;
  
  try {
    // 读取加密块
    const encryptedBlocks = await toBuffer(this.fs.cat(this.cid, {
      offset: readStartPosition,
      length: readTotalSize
    }));
    
    // 确保获取到了数据
    if (encryptedBlocks.length === 0) {
      console.warn("无法读取加密数据");
      return new Uint8Array(0);
    }
    
    // 解密所有块并合并
    let currentOffset = 0;
    for (let i = 0; i < neededBlocks; i++) {
      const start = i * this.encryptChunkSize;
      if (start >= encryptedBlocks.byteLength){
        console.warn("*******加密数据块超出范围");
        break;
      } 
      
      const end = Math.min((i + 1) * this.encryptChunkSize, encryptedBlocks.length);
      const encryptedBlock = encryptedBlocks.slice(start, end);
      
      if (encryptedBlock.byteLength === 0){
        console.warn("*******加密数据块为空");
        continue;
      } 
      
      // 解密块
      const decryptedBlock = await decryptContent(encryptedBlock, this.decryptKey);
      
      // 合并到结果中
      const bytesToCopy = Math.min(decryptedBlock.length, decryptedData.length - currentOffset);
      decryptedData.set(decryptedBlock.subarray(0, bytesToCopy), currentOffset);
      currentOffset += bytesToCopy;
    }
    
    // 从解密数据中提取请求的范围
    let result = new Uint8Array(length);
    result.set(decryptedData.subarray(offsetInBlock, offsetInBlock + length), 0);
    return result;
  } catch (err) {
    console.error("Error reading encrypted data:", err);
    return new Uint8Array(0);
  }
}
  
  /**
   * 创建标准的可读流
   * 使用独立缓冲区，不影响随机访问读取
   */
  createReadableStream(options?: { start?: number, end?: number }): ReadableStream<Uint8Array> {
    // 为流创建独立的状态变量，不使用实例变量
    let streamPosition = options?.start !== undefined ? options.start : this.position;
    let streamBuffer = new Uint8Array(0);
    let streamBufferPosition = streamPosition;
    
    // 确保位置有效
    if (streamPosition < 0) {
      streamPosition = 0;
    } else if (streamPosition > this.fileInfo.size) {
      streamPosition = this.fileInfo.size;
    }
    
    const end = options?.end ?? this.fileInfo.size;
    const chunkSize = 64 * 1024; // 64KB 客户端块
    const bufferSize = 256 * 1024; // 256KB 预读缓冲区
    
    /**
     * 流式读取专用的预读函数
     * 使用独立缓冲区
     */
    const prefetchStreamData = async (size: number): Promise<void> => {
      const maxSize = Math.min(size, this.fileInfo.size - streamPosition);
      
      if (maxSize <= 0) return;
      
      try {
        // 读取数据到独立的流缓冲区
        let prefetchedData: Uint8Array;
        if (this.decryptKey) {
          prefetchedData = await this.readEncrypted(streamPosition, maxSize);
        } else {
          prefetchedData = await this.readPlain(streamPosition, maxSize);
        }
        
        // 更新流缓冲区和位置
        streamBuffer = prefetchedData;
        streamBufferPosition = streamPosition;
      } catch (err) {
        console.error("Error prefetching stream data:", err);
        streamBuffer = new Uint8Array(0);
      }
    };
    
    /**
     * 流式读取专用的读取函数
     * 使用独立缓冲区和位置
     */
    const streamRead = async (length: number): Promise<Uint8Array> => {
      if (streamPosition >= this.fileInfo.size) {
        return new Uint8Array(0);
      }
      
      const remainingBytes = this.fileInfo.size - streamPosition;
      const actualLength = Math.min(length, remainingBytes);
      
      let result: Uint8Array;
      
      // 检查流缓冲区中是否有足够数据
      if (streamPosition >= streamBufferPosition && 
          streamPosition + actualLength <= streamBufferPosition + streamBuffer.length) {
        
        // 从流缓冲区获取数据
        const bufferOffset = streamPosition - streamBufferPosition;
        result = streamBuffer.slice(bufferOffset, bufferOffset + actualLength);
      } else {
        // 缓冲区中没有所需数据，直接读取
        if (this.decryptKey) {
          result = await this.readEncrypted(streamPosition, actualLength);
        } else {
          result = await this.readPlain(streamPosition, actualLength);
        }
      }
      
      // 更新流位置
      streamPosition += result.length;
      return result;
    };
    
    return new ReadableStream({
      start: async (controller) => {
        // 初始预读
        try {
          await prefetchStreamData(bufferSize);
        } catch (err) {
          console.warn("Initial stream prefetch failed:", err);
        }
      },
      
      pull: async (controller) => {
        try {
          if (streamPosition >= end) {
            controller.close();
            return;
          }
          
          const bytesToRead = Math.min(chunkSize, end - streamPosition);
          
          // 检查流缓冲区中是否有足够数据
          if (streamPosition >= streamBufferPosition && 
              streamPosition + bytesToRead <= streamBufferPosition + streamBuffer.length) {
            
            // 从流缓冲区获取数据
            const bufferOffset = streamPosition - streamBufferPosition;
            const chunk = streamBuffer.slice(bufferOffset, bufferOffset + bytesToRead);
            streamPosition += chunk.length;
            controller.enqueue(chunk);
            
            // 如果接近缓冲区末尾，预读取更多数据
            const prefetchThreshold = chunkSize * 2;
            if (streamPosition + prefetchThreshold > streamBufferPosition + streamBuffer.length &&
                streamPosition < end) {
              prefetchStreamData(bufferSize)
                .catch(err => console.warn("Stream prefetch failed:", err));
            }
          } else {
            // 缓冲区中没有所需数据，直接读取并同时更新缓冲区
            await prefetchStreamData(Math.max(bufferSize, bytesToRead));
            
            // 从新缓冲区获取数据
            const bufferOffset = streamPosition - streamBufferPosition;
            if (bufferOffset >= 0 && bufferOffset < streamBuffer.length) {
              const chunk = streamBuffer.slice(bufferOffset, 
                  Math.min(bufferOffset + bytesToRead, streamBuffer.length));
              streamPosition += chunk.length;
              controller.enqueue(chunk);
            } else {
              // 缓冲区没有预期的数据，直接读取
              const chunk = await streamRead(bytesToRead);
              if (chunk.length > 0) {
                controller.enqueue(chunk);
              } else {
                controller.close();
              }
            }
          }
        } catch (err) {
          console.error("Stream read error:", err);
          controller.error(err);
        }
      },
      
      cancel: () => {
        // 清理资源
        streamBuffer = new Uint8Array(0);
        console.log("ReadableStream cancelled");
      }
    });
  }
}