import type { Multiaddr } from '@multiformats/multiaddr'
import { AccountKey, DCConnectInfo } from '../types/types'
import { FileClient } from './client'
import type { HeliaLibp2p } from 'helia'
import { ChainUtil } from '../chain'
import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sha256,
  uint32ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  uint64ToLittleEndianBytes,
} from '../util/utils'

import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import { unixfs } from '@helia/unixfs'
import { SymmetricKey } from '../threaddb/key'
import { CID } from 'multiformats/cid'
import { PeerInfo } from '@libp2p/interface'
import { DcUtil } from '../dcutil'
import toBuffer from "it-to-buffer";
import { decryptContent } from '../util/dccrypt'
import * as buffer from "buffer/";
const { Buffer } = buffer;

const NonceBytes = 12;
const TagBytes = 16;
const dcFileHead = '$$dcfile$$'
const chunkSize = 3 * 1024 * 1024 // 1MB chunks
// 创建一个可以取消的信号
const controller = new AbortController()
const { signal } = controller

// 错误定义
export class FileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileError'
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new FileError('no dc peer connected'),
  ErrNoFileChose: new FileError('no file choose'),
  ErrNoPeerIdIsNull: new FileError('peerId is null'),
}

export class FileManager {
  dc: DcUtil;
  connectedDc: DCConnectInfo = {}
  chainUtil: ChainUtil
  dcNodeClient: HeliaLibp2p
  accountKey: AccountKey
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    chainUtil: ChainUtil,
    dcNodeClient: HeliaLibp2p,
    accountKey: AccountKey,
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc
    this.chainUtil = chainUtil
    this.dcNodeClient = dcNodeClient
    this.accountKey = accountKey
  }
  // 处理文件头
  async _processHeader(
    pubkeyBytes: Uint8Array,
    fileSize: number,
    content: Uint8Array,
    isFirstChunk: boolean,
  ): Promise<Uint8Array> {
    if (isFirstChunk) {
      // 计算 pubkey 的 hash
      const pubkeyHash = await crypto.subtle.digest('SHA-256', pubkeyBytes)
      const pubkeyHashArray = new Uint8Array(pubkeyHash)

      // 创建文件头
      const headArray = new TextEncoder().encode(dcFileHead)
      const pubkeyHashPart = pubkeyHashArray.slice(10, 24)

      // 创建表示文件大小的字节数组
      const realSizeBuffer = uint64ToBigEndianBytes(fileSize)
      const realSizeBytes = new Uint8Array(realSizeBuffer)

      // 组合所有部分
      const result = new Uint8Array([...headArray, ...pubkeyHashPart, ...realSizeBytes, ...content])

      return result
    }
    return content
  }
  async _uploadLargeFileAdvanced(
    file: File,
    resumeState = { offset: 0, chunkHashes: [] },
    pubkeyBytes?: Uint8Array,
    symKey?: SymmetricKey | null,
  ) {
    const fs = unixfs(this.dcNodeClient)

    let offset = resumeState.offset || 0
    const chunkHashes = resumeState.chunkHashes || {}

    const _this = this
    const contentGenerator = async function* () {
      while (offset < file.size) {
        // todo 检查是否取消
        if (signal.aborted) {
          throw new Error('Operation cancelled')
        }

        // 读取数据
        const chunk = file.slice(offset, offset + chunkSize)
        const arrayBuffer = await chunk.arrayBuffer()
        let content = new Uint8Array(arrayBuffer)

        // 如果需要加密
        if (symKey) {
          content = symKey.encrypt(content)
        }

        // 处理文件头
        if(pubkeyBytes){
          content = await _this._processHeader(pubkeyBytes, file.size, content, offset === 0)
        }
       console.info('=======content1111', content.slice(0, 100))

        yield content
        offset += chunkSize
      }
    }

    const cid = await fs.addFile({
      path: file.name,
      content: contentGenerator(),
    })
    // let cid: CID;
    // for await (const chunk of contentGenerator()) {  
    //   cid = await fs.addBytes(chunk)
    // }

    // const chunk = file.slice(0, 20)
    // const arrayBuffer = await chunk.arrayBuffer()
    // let content = new Uint8Array(arrayBuffer)
    // const cid = await fs.addBytes(content)
    console.log('File cid successfully:',  cid? cid.toString() : null)
    return cid
  }
  // 上传文件
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: number, size: number) => void,
  ): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected]
    }
    const blockHeight = await this.chainUtil.getBlockHeight()
    const peerId = this.connectedDc.nodeAddr?.getPeerId()
    if (!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull]
    }

    try {
      const fileSize = file.size
      const symKey = enkey && enkey.length > 0 ? SymmetricKey.fromString(enkey) : null
      const fs = unixfs(this.dcNodeClient)
      const pubkeyBytes = this.accountKey.getPubkeyRaw()

      const cid = await this._uploadLargeFileAdvanced(
        file,
        { offset: 0, chunkHashes: [] },
        pubkeyBytes,
        symKey,
      )
      console.log('==========_uploadLargeFileAdvanced', cid.toString())

      const cidStr = cid.toString()
      console.log('=========cidStr', cidStr)
      // for await (const buf of fs.cat(cid, {
      //   offset: 0,
      //   length: 100,
      // })) {
      //   console.info('=======buf', buf.toString())
      // }
      const startTime = Date.now()
      console.log('=========startTime', startTime)
      this.dcNodeClient.libp2p.contentRouting.provide(cid)  
      this.dcNodeClient.pins.add(cid)
      console.log('=========endTime', Date.now() - startTime)
      pubsubPeerDiscovery()

      this.dc.manualAnnounce(this.dcNodeClient.libp2p, cid)
      // 验证 DHT 功能  
      // const providers: PeerInfo[] = []  
      // for await (const peer of this.dcNodeClient.libp2p.contentRouting.findProviders(cid)) {
      //   console.log('=========peer', peer.id)  
      //   providers.push(peer)  
      // }
      // console.log('=========providers', providers)
      const sizeValue = uint64ToLittleEndianBytes(fileSize)
      const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0)
      const typeValue = uint32ToLittleEndianBytes(1)
      // 将字符串 (dc.ConnectedDc.peerid) 转换为字节数组
      const peerIdValue = new TextEncoder().encode(peerId)
      const cidIdValue = new TextEncoder().encode(cidStr)
      // 将 cidIdValue,sizeValue,bhValue,typeValue 和 peerIdValue 连接起来

      // 组合所有部分
      const messageParts = new Uint8Array([
        ...cidIdValue,
        ...sizeValue,
        ...bhValue,
        ...typeValue,
        ...peerIdValue,
      ])

      const signature = this.accountKey.sign(messageParts)
      const fileClient = new FileClient(this.connectedDc.client, this.dcNodeClient)
      const res = await fileClient.storeFile(
        fileSize,
        blockHeight ? blockHeight : 0,
        signature,
        cidStr,
        onUpdateTransmitSize,
      )
      console.log('addFile res', res)



      // // todo临时测试
      // const cid = await this._uploadLargeFileAdvanced(
      //   file,
      //   { offset: 0, chunkHashes: [] },
      // )
      // console.log('==========_uploadLargeFileAdvanced', cid.toString())
      // const cidStr = cid.toString()
      // console.log('=========cidStr', cidStr)
      // this.dcNodeClient.libp2p.contentRouting.provide(cid)  
      // pubsubPeerDiscovery()
      // console.log('libp2p getProtocols', this.dcNodeClient.libp2p.getProtocols())
      // console.log('libp2p peerId', this.dcNodeClient.libp2p.peerId.toString())
      // console.log('libp2p 服务列表:', Object.keys(this.dcNodeClient.libp2p.services))  
      // const addrs = this.dcNodeClient.libp2p.getMultiaddrs()
      // console.log("libp2p节点地址:", addrs);  



      return [cidStr, null]
    } catch (error) {
      console.log('addFile error', error)
      throw error
    }
  }

  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    console.log("first 11111");
    const res = await this.dc?._connectToObjNodes(cid);
    if (!res) {
      console.log("return nulllllllll");
      return null;
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
      console.log("error", error);
      return "";
    }
  };
}
