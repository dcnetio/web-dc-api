import type { Multiaddr } from '@multiformats/multiaddr'
import type { SignHandler, DCConnectInfo } from '../types/types'
import { FileClient } from './client'
import type { HeliaLibp2p } from 'helia'
import { ChainUtil } from '../chain'
import { fixedSize }  from 'ipfs-unixfs-importer/chunker'
import  { cidfetch } from "../proto/cidfetch_proto";
import {EnhancedStreamWriter as StreamWriter } from './streamwriter'

import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sha256,
  sleep,
  uint32ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  uint64ToLittleEndianBytes,
  concatenateUint8Arrays,
} from '../util/utils'

import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import { UnixFS, unixfs } from '@helia/unixfs'
import { SymmetricKey } from '../threaddb/key'
import { CID } from 'multiformats/cid'
import { DcUtil } from '../dcutil'
import toBuffer from "it-to-buffer";
import { decryptContent } from '../util/dccrypt'
import * as buffer from "buffer/";
import { map } from 'streaming-iterables'
import { Uint8ArrayList } from 'uint8arraylist'; 
import { Init } from '@polkadot/api/base/Init'
import { Stream } from '@libp2p/interface'
const { Buffer } = buffer;

const NonceBytes = 12;
const TagBytes = 16;
const dcFileHead = '$$dcfile$$'
const chunkSize = 3 * 1024 * 1024 // 3MB chunks
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


interface CustomMessage {  
  type: number; // uint8 (1字节)  
  version: number; // uint16 (2字节, 大端序)  
  payload: Uint8Array; // 二进制数据  
} 


export class FileManager {
  dc: DcUtil;
  connectedDc: DCConnectInfo = {}
  chainUtil: ChainUtil
  dcNodeClient: HeliaLibp2p
  dcNodeClient2: HeliaLibp2p
  accountKey: SignHandler
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    chainUtil: ChainUtil,
    dcNodeClient: HeliaLibp2p,
    dcNodeClient2: HeliaLibp2p,
    accountKey: SignHandler,
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc
    this.chainUtil = chainUtil
    this.dcNodeClient = dcNodeClient
    this.dcNodeClient2= dcNodeClient
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
    const fs = unixfs(this.dcNodeClient2)  
  
    let offset = resumeState.offset || 0  
    const chunkHashes = resumeState.chunkHashes || {}  
  
    const _this = this  
    
    // 创建符合流式接口的内容生成器  
    const contentStream = async function* () {  
      while (offset < file.size) {  
        // // 检查取消信号（需要补充signal参数）  
        // if (_this.signal?.aborted) {  
        //   throw new AbortError('Upload cancelled')  
        // }  
  
        // 读取分块  
        const chunk = file.slice(offset, offset + chunkSize)  
        const arrayBuffer = await chunk.arrayBuffer()  
        let content = new Uint8Array(arrayBuffer)  
  
        // 加密处理  
        if (symKey) {  
          content = symKey.encrypt(content)  
        }  
  
        // 文件头处理（仅在第一个分块添加）  
        if(pubkeyBytes && offset === 0){  
          content = await _this._processHeader(  
            pubkeyBytes,   
            file.size,  
            content,  
            true // isFirstChunk  
          )  
        }  
  
        offset += chunkSize  
        yield content  
      }  
    }  
  
    // 流式上传（关键修改点）  
    const cid = await fs.addByteStream(contentStream(),{     
      rawLeaves: true,  
      reduceSingleLeafToSelf: false,  
      chunker: fixedSize() // 保持与之前相同的分块策略  
    })  
    // const pin =  this.dcNodeClient.pins.add(cid, {
    //   onProgress: (evt) => {
    //   console.info('pin event', evt.type, evt.detail)
    // }});
    // try {  
    //   for await (const cid of pin) {  
    //     console.log('获取的cid值:', cid.toString());  
    //     this.dc.manualAnnounce(this.dcNodeClient2, cid,false) 
    //   }  
    //   console.log('遍历完成');  
    // } catch (error) {  
    //   console.error('遍历出错:', error);  
    // }  

  
    console.log('File CID:', cid.toString())  
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
    if (!this.connectedDc || !this.connectedDc.nodeAddr) {
      console.log('=========Errors.ErrNoDcPeerConnected')
        return [null, Errors.ErrNoDcPeerConnected]
     }
   
   // this.dcNodeClient.libp2p.dialProtocol(this.connectedDc.nodeAddr, '/ipfs/bitswap/1.2.0')
    const blockHeight = await this.chainUtil.getBlockHeight()
    const peerId = this.connectedDc.nodeAddr?.getPeerId()
    if (!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull]
    }

    try {
      const fileSize = file.size
      const symKey = enkey && enkey.length > 0 ? SymmetricKey.fromString(enkey) : null
      const fs = unixfs(this.dcNodeClient2)
      const pubkeyBytes = this.accountKey.getPubkeyRaw()
      const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
      let nodeAddr = await this.dc?._getNodeAddr(peerId);
      if (!nodeAddr) {
        return [null, Errors.ErrNoDcPeerConnected]
      }
       const nodeConn = await this.dcNodeClient2.libp2p.dial(nodeAddr,{force: true});
      const cid = await this._uploadLargeFileAdvanced(
        file,
        { offset: 0, chunkHashes: [] },
        pubkeyBytes,
        symKey,
      )
      console.log('==========_uploadLargeFileAdvanced', cid.toString())
      if (!cid) {
        return [null, Errors.ErrNoFileChose]
      }
      const cidStr = cid.toString()
      console.log('=========cidStr', cidStr)
      const startTime = Date.now()
      console.log('=========startTime', startTime)
    
   //  this.dc.manualAnnounce(this.dcNodeClient2, cid,true)
      console.log('libp2p getProtocols', this.dcNodeClient.libp2p.getProtocols())
      console.log('libp2p peerId', this.dcNodeClient.libp2p.peerId.toString())
      console.log('libp2p 服务列表:', Object.keys(this.dcNodeClient.libp2p.services))  
      console.log('libp2p 已连接节点列表:', Object.keys(this.dcNodeClient.libp2p.getPeers()))
      console.log('libp2p 已连接连接列表:', Object.keys(this.dcNodeClient.libp2p.getConnections()))
    //  const peerInfo = await this.dcNodeClient.libp2p.dial(this.connectedDc.nodeAddr)
    //  console.log('=========peerInfo', peerInfo)
    

     

   
      // 验证 DHT 功能  
      // const providers: PeerInfo[] = []  
      // for await (const peer of this.dcNodeClient.libp2p.contentRouting.findProviders(cid)) {
      //   console.log('=========peer', peer.id)  
      //   providers.push(peer)  
      // }
      // console.log('=========providers', providers)
      const stats = await fs.stat(cid)
      console.log('=========stats', stats)
      const dagFileSize  = Number(stats.dagSize)
      const sizeValue = uint64ToLittleEndianBytes(dagFileSize)
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
      fileClient.storeFile(
        dagFileSize,
        blockHeight ? blockHeight : 0,
        signature,
        cidStr,
        onUpdateTransmitSize,
      )
     
      await sleep(1000)
     //创建文件主动上报流
     const stream = await nodeConn.newStream("/dc/transfer/1.0.0")
     const writer =  new StreamWriter(stream.sink) 
     const mParts: Uint8Array[] = [];
      let parsedMessage: { type: number; version: number; payload: Uint8Array } | null = null;
      let data: Uint8Array;  
      let handshakeFlag = false
      
      for await (const chunk of this.chunkGenerator(stream)) { 
        if (chunk instanceof Uint8ArrayList) {
          data = chunk.subarray();
        } else {
          data = chunk;
        }
        mParts.push(data);  
         // 合并所有数据块为完整 Uint8Array  
        const fullMessage = concatenateUint8Arrays(...mParts);  
        parsedMessage = null
        parsedMessage = this.parseMessage(fullMessage);  
        if (parsedMessage) {  
          if (parsedMessage.type === 3) {//close
            break
          }
          if (!handshakeFlag){
            // 解析消息
            const initRequest = cidfetch.pb.InitRequset.decode(parsedMessage.payload)
            console.log('Received message:', initRequest.toJSON())
            //mParts 清空
            mParts.length = 0
            //发送数据到服务器
            const message = new TextEncoder().encode(cidStr)
            const initReply  = new cidfetch.pb.InitReply({cid: message})
            //组装数据
            const initReplyBytes = cidfetch.pb.InitReply.encode(initReply).finish()
            const testBytes = new Uint8Array(40850)
            const messageData = this.assembleCustomMessage({  
              type: 2,  
              version: 1,  
              payload: testBytes,  
            })
            await writer.write(messageData)
            handshakeFlag = true
          }else{
              // 解析消息
              const fetchRequest = cidfetch.pb.FetchRequest.decode(parsedMessage.payload)
              console.log('Received message:', fetchRequest.toJSON())
              const resCid =  new TextDecoder().decode(fetchRequest.cid)
              //获取resCid对应的block
              const cid = CID.parse(resCid);  
  
              // 通过 blockstore 获取该 CID 对应的区块  
              try {  
                const block = await this.dcNodeClient2.blockstore.get(cid);  
                const fetchReply = new cidfetch.pb.FetchReply({data: block})
                const fetchReplyBytes = cidfetch.pb.FetchReply.encode(fetchReply).finish()
                const testBytes = new Uint8Array(40840)
                const messageData = this.assembleCustomMessage({  
                  type: 2,  
                  version: 1,  
                  payload: testBytes,  
                })
                await writer.write(messageData)
                mParts.length = 0
              } catch (error) {  
                console.error('Error retrieving block:', error);  
              }  
          }
        }
      }
      stream.close()
      } catch (error) {
      console.log('=========stream close')
      }
      return ["", null]
 }
  
 private async *chunkGenerator(stream: Stream): AsyncGenerator<Uint8Array> {
  const iterator = stream.source[Symbol.asyncIterator]();
  while (true) {
    try {
      const { done, value } = await iterator.next();
      if (done) 
        break;
      const res = value instanceof Uint8ArrayList ? value.subarray() : value;
      yield res;
    } catch (err) {
      console.log('chunkGenerator error:', err);

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
  parseMessage(data: Uint8Array): { type: number; version: number; payload: Uint8Array } | null {  
    if (data.length < 7) {  
      return null;  
    }  

    // 第 1 字节: 消息类型  
    const type = data[0];  

    // 第 2 和 3 字节: 版本号（大端序）  
    const version = (data[1] << 8) | data[2]; // 手动处理大端序  

    // 第 4 至 7 字节: payload 长度（大端序）  
    const payloadLength = (data[3] << 24) | (data[4] << 16) | (data[5] << 8) | data[6];  

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
