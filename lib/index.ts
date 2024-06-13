// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { ApiPromise, WsProvider } from '@polkadot/api'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { webSockets } from '@libp2p/websockets'
import * as Filters from '@libp2p/websockets/filters'
import { createHelia, libp2pDefaults, type DefaultLibp2pServices, type HeliaLibp2p } from 'helia'
import { createLibp2p } from 'libp2p'
import { identify } from '@libp2p/identify'
import { bootstrap } from '@libp2p/bootstrap'
import { CID } from 'multiformats'
import { unixfs } from '@helia/unixfs'
import { base32 } from 'multiformats/bases/base32'
import { ServiceClient } from './DcnetServiceClientPb'

import { yamux } from '@chainsafe/libp2p-yamux'
import { isName, multiaddr } from '@multiformats/multiaddr'
import toBuffer from 'it-to-buffer'
import * as JsCrypto from 'jscrypto/es6'
import * as buffer from 'buffer/'
import { noise } from '@chainsafe/libp2p-noise'
import dcnet_pb from './dcnet_pb' // proto import: "dcnet.proto"
const { Buffer } = buffer
const { Word32Array, AES, pad, mode, Base64 } = JsCrypto
const NonceBytes = 12
const TagBytes = 16
//const ALGORITHM = 'aes-256-gcm'
// const BlockChainAddr = 'ws://127.0.0.1:9944'
// const BootAddrs = [
//   '/ip4/192.168.31.150/tcp/4021/ws/p2p/12D3KooWH5cjmz7jH7VcgLQtiVW5dyofYy6emNWsFF7DhMukX1im'
//   // '/ip4/192.168.31.150/tcp/4006/ws/p2p/12D3KooWNr1ERkUSdUQjGtmtWPB8AtWGVuDVhcoZSH4UkudU2in9',
//   // '/ip4/192.168.31.150/tcp/4007/ws/p2p/12D3KooW9uTxgK7nFzg4mENPWCxJiJbs8dzY2juv72UBnj3SN4rG',
//   // '/ip4/192.168.31.150/tcp/4008/ws/p2p/12D3KooWAQjZAZ9fEuP6xJ4DJ1yeaKXPQqP2DTPrXvx9PSM1gnjW',
//   // '/ip4/192.168.31.150/tcp/4009/ws/p2p/12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf',
//   // '/ip4/192.168.31.150/tcp/4010/ws/p2p/12D3KooWNogPyxPxFYmKWoEYCEHmWQ3k2HarS8KjKGm6Misv41kW'
//   // '/ip4/192.168.31.150/tcp/4012/ws/p2p/12D3KooWH5cjmz7jH7VcgLQtiVW5dyofYy6emNWsFF7DhMukX1im',
//   // '/ip4/192.168.31.150/tcp/4006/ws/p2p/12D3KooWNr1ERkUSdUQjGtmtWPB8AtWGVuDVhcoZSH4UkudU2in9',
//   // '/ip4/192.168.31.150/tcp/4007/ws/p2p/12D3KooW9uTxgK7nFzg4mENPWCxJiJbs8dzY2juv72UBnj3SN4rG',
//   // '/ip4/192.168.31.150/tcp/4008/ws/p2p/12D3KooWAQjZAZ9fEuP6xJ4DJ1yeaKXPQqP2DTPrXvx9PSM1gnjW',
//   // '/ip4/192.168.31.150/tcp/4009/ws/p2p/12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf',
//   // '/ip4/192.168.31.150/tcp/4010/ws/p2p/12D3KooWNogPyxPxFYmKWoEYCEHmWQ3k2HarS8KjKGm6Misv41kW'
// ]
export class DcUtil {
  blockChainAddr: string
  bootAddrs: string[]
  dcchainapi: ApiPromise | undefined
  dcNodeClient: any | undefined // 什么类型？

  constructor(blockChainAddr: string, bootAddrs: string[]) {
    this.blockChainAddr = blockChainAddr
    this.bootAddrs = bootAddrs.map((p2pAddr) => {
      return this._p2pAddrToWsAddr(p2pAddr)
    })
  }

  // 初始化
  init = async () => {
    const chainProvider = new WsProvider(this.blockChainAddr)
    // 创建一个ApiPromise实例，并等待其初始化完成
    this.dcchainapi = await ApiPromise.create({ provider: chainProvider })
    this.dcNodeClient = await this._createHeliaNode()
  }

  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    console.log("first 11111")
    const res = await this._connectToObjNodes(cid)
    if(!res){
      console.log("return nulllllllll")
      return null;
    }
    console.log("first 2")
    const fs = unixfs(this.dcNodeClient)
    console.log("first 3")
    let headDealed = false
    let waitBuffer = new Uint8Array(0)
    let fileContent = new Uint8Array(0)

    const encryptextLen = 3 << (20 + NonceBytes + TagBytes) //每段密文长度(最后一段可能会短一点)
    const catOptions = {
      offset: 0,
      length: 32,
      signal: AbortSignal.timeout(5000)
    }
    let readCount = 0
    try {
      for (;;) {
        if (!headDealed) {
          //处理文件头
          const headBuf = await toBuffer(fs.cat(CID.parse(cid), catOptions))
          console.log("first 4")
          readCount += headBuf.length
          if (headBuf.length > 0) {
            waitBuffer = mergeUInt8Arrays(waitBuffer, headBuf)
            if (waitBuffer.length < 32) {
              catOptions.offset = waitBuffer.length
              catOptions.length = 32 - waitBuffer.length
              continue
            } else {
              //判断是否是dc网络存储的文件头
              headDealed = true
              if (compareByteArrays(waitBuffer.subarray(0, 10), Buffer.from('$$dcfile$$'))) {
                //判断是否是dc网络存储的文件头
                waitBuffer = waitBuffer.subarray(32, waitBuffer.length)
              }
            }
          } else {
            if (waitBuffer.length > 0) {
              if (decryptKey != '') {
                const decrypted = decryptContentForBrowser(waitBuffer, decryptKey)
                fileContent = mergeUInt8Arrays(fileContent, decrypted)
              } else {
                fileContent = mergeUInt8Arrays(fileContent, waitBuffer)
              }
            }
            break
          }
          continue
        }
        catOptions.offset = readCount
        catOptions.length = encryptextLen
        const buf = await toBuffer(fs.cat(CID.parse(cid), catOptions))
        if (buf.length > 0) {
          readCount += buf.length
        }
        if (buf.length > 0) {
          waitBuffer = mergeUInt8Arrays(waitBuffer, buf)
          while (waitBuffer.length >= encryptextLen) {
            const encryptBuffer = waitBuffer.subarray(0, encryptextLen)
            waitBuffer = waitBuffer.subarray(encryptextLen, waitBuffer.length)
            if (decryptKey == '') {
              fileContent = mergeUInt8Arrays(fileContent, encryptBuffer)
              continue
            }
            //解密
            const decrypted = decryptContentForBrowser(encryptBuffer, decryptKey)
            fileContent = mergeUInt8Arrays(fileContent, decrypted)
          }
        } else {
          if (waitBuffer.length > 0) {
            if (decryptKey != '') {
              const decrypted = decryptContentForBrowser(waitBuffer, decryptKey)
              fileContent = mergeUInt8Arrays(fileContent, decrypted)
            } else {
              fileContent = mergeUInt8Arrays(fileContent, waitBuffer)
            }
          }
          break
        }
      }
      return fileContent
    } catch (error) {
      console.log('error', error)
      return ''
    }
  }

  /// <reference path = "dcnet_pb.d.ts" />
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (key: string) => {
    //解析出peerid与cachekey
    const keys = key.split('/')
    if (keys.length != 2) {
      console.log('key format error!')
      return
    }
    const peerid = keys[0]
    const cacheKey = keys[1]
    let nodeAddr = await this._getDcNodeAddr(peerid)
    if (!nodeAddr) {
      console.log('no node address found for peer: ', peerid)
      return
    }
    if (isName(nodeAddr)) {
      const addrs = await nodeAddr.resolve()
      nodeAddr = addrs[0]
    }
    // 转化为grpc请求地址(端口号在地址的基础上再加10,相比原始tcp监听端口已经加20)
    const resovledNodeAddr = nodeAddr.nodeAddress()

    const request = new dcnet_pb.GetCacheValueRequest()
    request.setKey(Buffer.from(cacheKey))

    const client = new ServiceClient(
      'http://' + resovledNodeAddr.address + ':' + (resovledNodeAddr.port + 10),
      null,
      {
        withCredentials: false
      }
    )
    let resValue = ''

    const res = await this._getCacheV(client, request)
    if (res.err) {
      console.log('getCacheValueFromDc', res.err)
    } else {
      resValue = res.value
    }
    return resValue
  }
  _p2pAddrToWsAddr = (nodeAddr: string) => {
    if (nodeAddr.indexOf('/ws') != -1) {
      return nodeAddr
    }
    //节点ws监听端口号在原来的tcp监听的基础上加10
    let newNodeAddr = ''
    const parts = nodeAddr.split('/')
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] == 'tcp' && i < parts.length - 1) {
        const newPort = parseInt(parts[i + 1]) + 10
        newNodeAddr += parts[i] + '/' + newPort + '/'
        i++
      } else if (parts[i] == 'p2p') {
        newNodeAddr += 'ws/' + parts[i] + '/'
      } else {
        newNodeAddr += parts[i] + '/'
      }
    }
    return newNodeAddr
  }

  // 连接到所有文件存储节点
  _connectToObjNodes = async (cid: string) => {
    const fileInfo = (await this.dcchainapi?.query.dcNode.files(cid)) || null
    console.log("new first 1")
    const fileInfoJSON = fileInfo?.toJSON()
    
    console.log("fileInfoJSON",fileInfoJSON)
    if (
      !fileInfoJSON ||
      typeof fileInfoJSON !== 'object' ||
      (fileInfoJSON as { peers: any[] }).peers.length == 0
    ) {
      console.log('no peers found for file: ', cid)
      return
    }
    const res = await this._connectPeer(fileInfoJSON as { peers: any[] })
    console.log("new first 2")
    console.log(res)
    return res;
  }
  _connectPeer = (fileInfoJSON: { peers: any[] }) => {
    return new Promise((reslove, reject) => {
      const _this = this
      const len = (fileInfoJSON as { peers: any[] }).peers.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        const nodeAddr = await _this._getDcNodeAddr((fileInfoJSON as { peers: any[] }).peers[i])
        console.log("nodeAddr",nodeAddr)
        if (!nodeAddr) {
          console.log("nodeAddr return")
          num++;
          if(num >= len){
            reslove(false)
          }
          return
        }
        
        try {
          const res = await _this.dcNodeClient.libp2p.dial(nodeAddr)
          console.log("nodeAddr try return")
          console.log(res)
          if(res){
            reslove(res)
          }else {
            num++;
            if(num >= len){
              reslove(false)
            }
          }
        } catch (error) {
          console.log("nodeAddr catch return",error)
          num++;
          if(num >= len){
            reslove(false)
          }
        }
      }


      // 遍历传进来的promise数组
      for (let i = 0; i < len; i++) {
        dialNodeAddr(i)
      }
    })
  }

  // 链上查询节点信息
  _getDcNodeAddr = async (peerid: string) => {
    const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid)
    const peerInfoJson = peerInfo?.toJSON()
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== 'object' ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ''
    ) {
      console.log('no ip address found for peer: ', peerid)
      return
    }
    const nodeAddr = Buffer.from(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
      'hex'
    ).toString('utf8')
    //节点ws监听端口号在原来的tcp监听的基础上加10
    let newNodeAddr = ''
    const parts = nodeAddr.split('/')
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] == 'tcp' && i < parts.length - 1) {
        const newPort = parseInt(parts[i + 1]) + 10
        newNodeAddr += parts[i] + '/' + newPort + '/'
        i++
      } else if (parts[i] == 'p2p') {
        newNodeAddr += 'ws/' + parts[i] + '/'
      } else {
        newNodeAddr += parts[i] + '/'
      }
    }
    const addr = multiaddr(newNodeAddr)
    console.log("newNodeAddr",newNodeAddr)
    return addr
  }
  _getCacheV = async (
    client: ServiceClient,
    request: dcnet_pb.GetCacheValueRequest
  ): Promise<any> => {
    return new Promise((resolve) => {
      // const credentials = getChannelCredentials()
      const metadata = {
        authorization: 'Bearer TOKEN',
        contenttype: 'application/grpc-web-text; charset=utf-8'
      }
      client.getCacheValue(request, metadata, (err, response) => {
        if (!err) {
          resolve({ value: response.getValue() })
        } else {
          resolve({ err })
        }
      })
    })
  }

  _createHeliaNode = async () => {
    // the blockstore is where we store the blocks that make up files
    const blockstore = new MemoryBlockstore()

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore()

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      datastore,
      transports: [
        webSockets({
          filter: Filters.all // this is necessary to dial insecure websockets
        })
      ],
      connectionEncryption: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false // this is necessary to dial local addresses at all
      },
      streamMuxers: [yamux()],
      services: {
        identify: identify()
      },
      peerDiscovery: [
        bootstrap({
          list: this.bootAddrs || []
        })
      ]
    })

    return await createHelia({
      datastore,
      blockstore,
      libp2p
    })
  }
}

function decryptContentForBrowser(encryptBuffer: Uint8Array, decryptKey: string) {
  if (decryptKey == '' || encryptBuffer.length <= 28) {
    return encryptBuffer
  }
  const nonce = encryptBuffer.subarray(0, NonceBytes)
  const iv = new Word32Array(nonce)
  const tag = encryptBuffer.subarray(encryptBuffer.length - TagBytes, encryptBuffer.length)
  const kdfSalt = new Word32Array(tag)
  const encryptContent = encryptBuffer.subarray(NonceBytes, encryptBuffer.length - TagBytes)
  const cipherText = new Word32Array(encryptContent)
  const key = new Word32Array(base32.decode(decryptKey))
  const decrypted = AES.decrypt(cipherText.toString(Base64), key, {
    iv: iv,
    padding: pad.NoPadding,
    mode: mode.GCM,
    kdfSalt: kdfSalt
  })
  return decrypted.toUint8Array()
}

// 比较两个字节数组是否相等
function compareByteArrays(array1: Uint8Array, array2: Uint8Array) {
  if (array1.byteLength != array2.byteLength) {
    return false
  }
  const view1 = new DataView(array1.buffer, array1.byteOffset)
  const view2 = new DataView(array2.buffer, array2.byteOffset)
  for (let i = 0; i < array1.length; i++) {
    if (view1.getUint8(i) !== view2.getUint8(i)) {
      return false
    }
  }
  return true
}

function mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  // sum of individual array lengths
  const mergedArray = new Uint8Array(a1.length + a2.length)
  mergedArray.set(a1)
  mergedArray.set(a2, a1.length)
  return mergedArray
}
