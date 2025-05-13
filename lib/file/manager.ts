import type { SignHandler, DCConnectInfo } from "../types/types";
import { FileClient } from "./client";
import type { HeliaLibp2p } from "helia";
import { ChainUtil } from "../chain";
import { oidfetch } from "../proto/oidfetch_proto";
import { StreamWriter } from "./streamwriter";
import { Errors as GErrors } from "../error";

import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sleep,
  uint32ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  uint64ToLittleEndianBytes,
  concatenateUint8Arrays,
} from "../util/utils";

import { UnixFS, unixfs } from "@helia/unixfs";
import { SymmetricKey } from "../threaddb/common/key";
import { CID } from "multiformats/cid";
import { BrowserType, DcUtil } from "../dcutil";
import toBuffer from "it-to-buffer";
import { decryptContent } from "../util/dccrypt";
import * as buffer from "buffer/";
import { Uint8ArrayList } from "uint8arraylist";
import { Stream } from "@libp2p/interface";
import { cidNeedConnect } from "../constants";
import { AccountClient } from "lib/account/client";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";
const { Buffer } = buffer;

const NonceBytes = 12;
const TagBytes = 16;
const dcFileHead = "$$dcfile$$";
const chunkSize = 3 * 1024 * 1024; // 3MB chunks
// 创建一个可以取消的信号
const controller = new AbortController();
const { signal } = controller;

// 错误定义
export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new FileError("no dc peer connected"),
  ErrNoFileChose: new FileError("no file choose"),
  ErrNoPeerIdIsNull: new FileError("peerId is null"),
  ErrNoNeedUpload: new FileError("no need upload"),
};

interface CustomMessage {
  type: number; // uint8 (1字节)
  version: number; // uint16 (2字节, 大端序)
  payload: Uint8Array; // 二进制数据
}

export class FileManager {
  dc: DcUtil;
  connectedDc: DCConnectInfo = {};
  chainUtil: ChainUtil;
  dcNodeClient: HeliaLibp2p;
  accountKey: SignHandler;
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    chainUtil: ChainUtil,
    dcNodeClient: HeliaLibp2p,
    accountKey: SignHandler
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc;
    this.chainUtil = chainUtil;
    this.dcNodeClient = dcNodeClient;
    this.accountKey = accountKey;
  }
  // 处理文件头
  async _processHeader(
    pubkeyBytes: Uint8Array,
    fileSize: number,
    content: Uint8Array,
    isFirstChunk: boolean
  ): Promise<Uint8Array> {
    if (isFirstChunk) {
      // 计算 pubkey 的 hash
      const pubkeyHash = await crypto.subtle.digest("SHA-256", pubkeyBytes);
      const pubkeyHashArray = new Uint8Array(pubkeyHash);

      // 创建文件头
      const headArray = new TextEncoder().encode(dcFileHead);
      const pubkeyHashPart = pubkeyHashArray.slice(10, 24);

      // 创建表示文件大小的字节数组
      const realSizeBuffer = uint64ToBigEndianBytes(fileSize);
      const realSizeBytes = new Uint8Array(realSizeBuffer);

      // 组合所有部分
      const result = new Uint8Array([
        ...headArray,
        ...pubkeyHashPart,
        ...realSizeBytes,
        ...content,
      ]);

      return result;
    }
    return content;
  }
  async _uploadLargeFileAdvanced(
    file: File,
    resumeState = { offset: 0, chunkHashes: [] },
    pubkeyBytes?: Uint8Array,
    symKey?: SymmetricKey | null
  ) {
    const fs = unixfs(this.dcNodeClient);

    let offset = resumeState.offset || 0;
    const chunkHashes = resumeState.chunkHashes || {};

    const _this = this;

    // 创建符合流式接口的内容生成器
    const contentStream = async function* () {
      while (offset < file.size) {
        // // 检查取消信号（需要补充signal参数）
        // if (_this.signal?.aborted) {
        //   throw new AbortError('Upload cancelled')
        // }

        // 读取分块
        const chunk = file.slice(offset, offset + chunkSize);
        const arrayBuffer = await chunk.arrayBuffer();
        let content = new Uint8Array(arrayBuffer);

        // 加密处理
        if (symKey) {
          content = symKey.encrypt(content);
        }

        // 文件头处理（仅在第一个分块添加）
        if (pubkeyBytes && offset === 0) {
          content = await _this._processHeader(
            pubkeyBytes,
            file.size,
            content,
            true // isFirstChunk
          );
        }

        offset += chunkSize;
        yield content;
      }
    };
    const cid = await fs.addByteStream(contentStream(), {
      rawLeaves: false,
      leafType: "file",
      shardSplitThresholdBytes: 256 * 1024,
    });
    return cid;
  }

  // 上传文件
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: number, size: number) => void,
    vaccount?: string,
  ): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.connectedDc || !this.connectedDc.nodeAddr) {
      console.error("=========Errors.ErrNoDcPeerConnected");
      return [null, Errors.ErrNoDcPeerConnected];
    }

    // this.dcNodeClient.libp2p.dialProtocol(this.connectedDc.nodeAddr, '/ipfs/bitswap/1.2.0')
    const blockHeight = await this.chainUtil.getBlockHeight();
    const peerId = this.connectedDc.nodeAddr?.getPeerId();
    if (!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull];
    }
    let resCid = "";
    try {
      const fileSize = file.size;
      const symKey =
        enkey && enkey.length > 0 ? SymmetricKey.fromString(enkey) : null;
      const fs = unixfs(this.dcNodeClient);
      const pubkeyBytes = this.accountKey.getPubkeyRaw();
      // const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
      let nodeAddr = await this.dc?._getNodeAddr(peerId);
      if (!nodeAddr) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const cid = await this._uploadLargeFileAdvanced(
        file,
        { offset: 0, chunkHashes: [] },
        pubkeyBytes,
        symKey
      );
      console.log("==========_uploadLargeFileAdvanced", cid.toString());
      if (!cid) {
        return [resCid, Errors.ErrNoFileChose];
      }
      resCid = cid.toString();
      console.log("=========resCid", resCid);

      const stats = await fs.stat(cid);
      const filesize = stats.unixfs?.fileSize();
      console.log(
        "=========stats",
        stats.localDagSize,
        stats.localFileSize,
        stats.fileSize,
        stats.dagSize,
        filesize
      );
      const dagFileSize = Number(stats.localDagSize);

      const sizeValue = uint64ToLittleEndianBytes(dagFileSize);
      const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
      const typeValue = uint32ToLittleEndianBytes(1);
      // 将字符串 (dc.ConnectedDc.peerid) 转换为字节数组
      const peerIdValue = new TextEncoder().encode(peerId);
      const cidIdValue = new TextEncoder().encode(resCid);

      // 组合所有部分
      const messageParts = new Uint8Array([
        ...cidIdValue,
        ...sizeValue,
        ...bhValue,
        ...typeValue,
        ...peerIdValue,
      ]);
      const signature = this.accountKey.sign(messageParts);
      const fileClient = new FileClient(
        this.connectedDc.client,
        this.dcNodeClient,
        this.accountKey
      );
      let resStatus = 0;
      let resFlag = false;
      let resError: Error | null = null;
      fileClient.storeFile(
        dagFileSize,
        blockHeight ? blockHeight : 0,
        signature,
        resCid,
        (status: number, size: number): void => {
          resFlag = true;
          resStatus = status;
          onUpdateTransmitSize(status, size);
        },
        async (error: Error) => {
          if (
            error.message.indexOf(GErrors.USER_NOT_BIND_TO_PEER.message) != -1
          ) {
            // 绑定节点
            const headerValue = new TextEncoder().encode(
              "add_request_peer_id_to_user"
            );
            const messageParts = new Uint8Array([
              ...headerValue,
              ...bhValue,
              ...peerIdValue,
            ]);
            const bindSignature = await this.accountKey.sign(messageParts);
            const accountClient = new AccountClient(this.connectedDc.client);
            const bindResult = await accountClient.bindAccessPeerToUser(
              blockHeight ? blockHeight : 0,
              bindSignature
            );
            console.log("bindAccessPeerToUser bindResult:", bindResult);
            await fileClient.storeFile(
              dagFileSize,
              blockHeight ? blockHeight : 0,
              signature,
              resCid,
              (status: number, size: number): void => {
                resFlag = true;
                resStatus = status;
                onUpdateTransmitSize(status, size);
              },
              (error: Error) => {
                console.log("storeFile error:", error);
                resFlag = true;
                resError = error;
              }
            );
          } else {
            return [null, error];
          }
        }
      );
      //等待storeRes 为true
      while (!resFlag) {
        await sleep(100);
      }
      if (resError) {
        return [null, resError];
      }
      if (resStatus !== 2) {
        //不是上传中，不需要操作
        return [null, Errors.ErrNoNeedUpload];
      }

      //创建文件主动上报流
      await this.dc.createTransferStream(
        this.dcNodeClient.libp2p,
        this.dcNodeClient.blockstore,
        nodeAddr,
        BrowserType.File,
        resCid
      );
    } catch (error) {
      console.error("=========stream close", error);
      throw error;
    }
    return [resCid, null];
  }

  private async *chunkGenerator(stream: Stream): AsyncGenerator<Uint8Array> {
    const iterator = stream.source[Symbol.asyncIterator]();
    while (true) {
      try {
        const { done, value } = await iterator.next();
        if (done) break;
        const res = value instanceof Uint8ArrayList ? value.subarray() : value;
        yield res;
      } catch (err) {
        console.error("chunkGenerator error:", err);
      }
    }
  }

  /**
   * 组装 CustomMessage 数据到 Uint8Array
   * @param message - CustomMessage 包含消息的基本结构
   * @returns Uint8Array - 序列化后的数据
   */
  assembleCustomMessage(message: CustomMessage): Uint8Array {
    // Step 1: header部分（1字节类型 + 2字节版本号 + 4字节payload长度）
    const headerLength = 7; // Header固定长度：1字节Type + 2字节Version + 4字节Payload长度
    const payloadLength = message.payload.byteLength;

    const buffer = new Uint8Array(headerLength + payloadLength);

    buffer[0] = message.type;
    buffer[1] = (message.version >> 8) & 0xff;
    buffer[2] = message.version & 0xff;
    buffer[3] = (payloadLength >> 24) & 0xff;
    buffer[4] = (payloadLength >> 16) & 0xff;
    buffer[5] = (payloadLength >> 8) & 0xff;
    buffer[6] = payloadLength & 0xff;

    // Step 5: 设置 Payload 数据
    buffer.set(message.payload, headerLength);

    return buffer;
  }
  parseMessage(
    data: Uint8Array
  ): { type: number; version: number; payload: Uint8Array } | null {
    if (data.length < 7) {
      return null;
    }

    // 第 1 字节: 消息类型
    const type = data[0];

    // 第 2 和 3 字节: 版本号（大端序）
    const version = (data[1] << 8) | data[2]; // 手动处理大端序

    // 第 4 至 7 字节: payload 长度（大端序）
    const payloadLength =
      (data[3] << 24) | (data[4] << 16) | (data[5] << 8) | data[6];

    // 验证数据完整性
    if (data.length < 7 + payloadLength) {
      return null;
    }

    // 提取 payload
    const payload = data.slice(7, 7 + payloadLength); // 提取负载数据

    return {
      type,
      version,
      payload,
    };
  }

  // 从dc网络获取指定文件
  // flag 是否需要连接节点，0-获取，1-不获取
  getFile = async (cid: string, decryptKey: string, flag?: number) => {
    console.log("first 11111");
    if (flag !== cidNeedConnect.NOT_NEED) {
      const res = await this.dc?._connectToObjNodes(cid);
      if (!res) {
        console.log("return nulllllllll");
        return null;
      }
    }
    console.log("first 2");
    const fs = unixfs(this.dcNodeClient);
    console.log("first 3");
    let headDealed = false;
    let waitBuffer = new Uint8Array(0);
    let fileContent = new Uint8Array(0);
    console.log("first 31");

    const encryptextLen = (3 << 20) + NonceBytes + TagBytes; //每段密文长度(最后一段可能会短一点)
    const catOptions = {
      offset: 0,
      length: 32,
      // signal: AbortSignal.timeout(5000),
    };
    console.log("first 32");
    let readCount = 0;
    try {
      for (;;) {
        if (!headDealed) {
          //处理文件头
          console.log("first 33");
          const headBuf = await toBuffer(fs.cat(CID.parse(cid), catOptions));
          console.log("first 4");
          readCount += headBuf.length;
          if (headBuf.length > 0) {
            waitBuffer = mergeUInt8Arrays(waitBuffer, headBuf);
            if (waitBuffer.length < 32) {
              catOptions.offset = waitBuffer.length;
              catOptions.length = 32 - waitBuffer.length;
              continue;
            } else {
              //判断是否是dc网络存储的文件头
              headDealed = true;
              if (
                compareByteArrays(
                  waitBuffer.subarray(0, 10),
                  Buffer.from("$$dcfile$$")
                )
              ) {
                //判断是否是dc网络存储的文件头
                waitBuffer = waitBuffer.subarray(32, waitBuffer.length);
              }
            }
          } else {
            if (waitBuffer.length > 0) {
              if (decryptKey != "") {
                const decrypted = await decryptContent(waitBuffer, decryptKey);
                fileContent = mergeUInt8Arrays(fileContent, decrypted);
              } else {
                fileContent = mergeUInt8Arrays(fileContent, waitBuffer);
              }
            }
            break;
          }
          continue;
        }
        catOptions.offset = readCount;
        catOptions.length = encryptextLen;
        const buf = await toBuffer(fs.cat(CID.parse(cid), catOptions));
        if (buf.length > 0) {
          readCount += buf.length;
        }
        if (buf.length > 0) {
          waitBuffer = mergeUInt8Arrays(waitBuffer, buf);
          while (waitBuffer.length >= encryptextLen) {
            const encryptBuffer = waitBuffer.subarray(0, encryptextLen);
            waitBuffer = waitBuffer.subarray(encryptextLen, waitBuffer.length);
            if (decryptKey == "") {
              fileContent = mergeUInt8Arrays(fileContent, encryptBuffer);
              continue;
            }
            //解密
            const decrypted = decryptContentForBrowser(
              encryptBuffer,
              decryptKey
            );
            fileContent = mergeUInt8Arrays(fileContent, decrypted);
          }
        } else {
          if (waitBuffer.length > 0) {
            if (decryptKey != "") {
              const decrypted = decryptContentForBrowser(
                waitBuffer,
                decryptKey
              );
              fileContent = mergeUInt8Arrays(fileContent, decrypted);
            } else {
              fileContent = mergeUInt8Arrays(fileContent, waitBuffer);
            }
          }
          break;
        }
      }
      return fileContent;
    } catch (error) {
      console.error("getFile error", error);
      return "";
    }
  };
}
