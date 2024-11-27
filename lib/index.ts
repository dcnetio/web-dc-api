// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { ApiPromise, WsProvider } from "@polkadot/api";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'  
import { webRTCDirect } from '@libp2p/webrtc' 
import {KeyManager} from "./dc-key/keyManager"
import { keys } from '@libp2p/crypto' 

import {createHelia} from "helia";
import { createLibp2p } from "libp2p";
import { identify } from "@libp2p/identify";
import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";
import { base32 } from "multiformats/bases/base32";

import { yamux } from "@chainsafe/libp2p-yamux";
import { isName, multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";
import * as JsCrypto from "jscrypto/es6";
import * as buffer from "buffer/";
import { noise } from "@chainsafe/libp2p-noise";
import {DCClient} from "./dcapi"
import {sha256,uint32ToLittleEndianBytes} from "./util/util"

const { Buffer } = buffer;
const { Word32Array, AES, pad, mode, Base64 } = JsCrypto;
const NonceBytes = 12;
const TagBytes = 16;
alert("dddd")
const protocol = '/dc/thread/0.0.1'
export class DcUtil {
  blockChainAddr: string;
  dcchainapi: ApiPromise | undefined;
  dcNodeClient: any | undefined; // 什么类型？

  constructor(blockChainAddr: string) {
    this.blockChainAddr = blockChainAddr;
  }

  
  // 初始化
  init = async () => {
    const chainProvider = new WsProvider(this.blockChainAddr);
    // 创建一个ApiPromise实例，并等待其初始化完成
    this.dcchainapi = await ApiPromise.create({ provider: chainProvider });
    if (!this.dcchainapi) {
      console.log("dcchainapi init failed");
      return;
    }
    this.dcNodeClient = await this._createHeliaNode();
   
  };


  // 从dc网络获取指定文件
  getFileFromDc = async (cid: string, decryptKey: string) => {
    console.log("first 11111");
    const res = await this._connectToObjNodes(cid);
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

    const encryptextLen = (3 << 20) + NonceBytes + TagBytes; //每段密文长度(最后一段可能会短一点)
    const catOptions = {
      offset: 0,
      length: 32,
      // signal: AbortSignal.timeout(5000),
    };
    let readCount = 0;
    try {
      for (;;) {
        if (!headDealed) {
          //处理文件头
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


  

  
  /// <reference path = "dcnet_pb.d.ts" />
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (key: string) => {

    //解析出peerid与cachekey
    const pkeys = key.split("/");
    if (pkeys.length != 2) {
      console.log("key format error!");
      return;
    }
   // const peerid = pkeys[0];
    const cacheKey = pkeys[1];
    const peerid = "12D3KooWNr1ERkUSdUQjGtmtWPB8AtWGVuDVhcoZSH4UkudU2in9"
    let nodeAddr = await this._getDcNodeWebrtcDirectAddr(peerid);
    if (!nodeAddr) {
      console.log("no node address found for peer: ", peerid);
      return;
    }
    if (isName(nodeAddr)) {
      const addrs = await nodeAddr.resolve();
      nodeAddr = addrs[0];
    }
    console.log("nodeAddr", nodeAddr.toString());
    const dcClient = new DCClient(this.dcNodeClient.libp2p,nodeAddr, protocol);
    const getHostIdreply = await dcClient.getHostID();
    console.log("getHostIdreply:", getHostIdreply);
    try {
      const getCacheValuereply = await dcClient.GetCacheValue(nodeAddr,"uIjsQ73e2wGmfSORDb_EbJA");
      console.log('GetCacheValueReply reply:', getCacheValuereply)
    }catch (err) {
      console.log("getCacheValue error:", err);
    }
   
    // //生成助记词
    //  const mnemonic = KeyManager.generateMnemonic();
    //  //生成私钥
    // const privKey = KeyManager.getEd25519KeyFromMnemonic(mnemonic);
    // const pubKey = privKey.publicKey;
    
    // //登录
    // const account = "sQCijJnNaSVnpzRMcRGqKhCCgERAFb";
    // const prikey = await dcClient.AccountLogin(account, "123456","000000",nodeAddr);
    // console.log('AccountLogin success:', prikey)
    // let mnemonic = "";
    // if (prikey.startsWith("mnemonic:")) {  
    //    mnemonic = prikey.slice(9);  
    // } else if (prikey.startsWith("privatekey:")) {  
    //   const basePriKey = prikey.slice(11);  
    //   let priKey: Uint8Array;  
    // }
    // const keymanager = new KeyManager();
    // //const privKey1 = await keymanager.getEd25519KeyFromMnemonic(mnemonic);
    // const privKey =await keymanager.getEd25519KeyFromMnemonic(mnemonic,"DCAPP");
    // const pubKey = privKey.publicKey;
    // console.log('get privKey:', privKey)
    // console.log('get pubKey:', pubKey)
    // //获取token
    // const token = await dcClient.GetToken( pubKey.string(),(payload: Uint8Array): Uint8Array => {
    //   // Implement your signCallback logic here
    //   const signature =  privKey.sign(payload);
    //   return signature; 
    // });
    // console.log('GetToken reply:', token)

    // // 添加用户评论空间
    // const blockHeight = await this.getBlockHeight() || 0;
    // const hValue: Uint8Array = uint32ToLittleEndianBytes(blockHeight? blockHeight : 0);  
    // const peerIdValue: Uint8Array = new TextEncoder().encode(peerid);

    // // 将 hValue 和 peerIdValue 连接起来  
    // const preSign = new Uint8Array(peerIdValue.length + hValue.length);  
    // preSign.set(peerIdValue, 0);  
    // preSign.set(hValue, peerIdValue.length);  
    // const signature = privKey.sign(preSign);
    // dcClient.AddUserOffChainSpace(pubKey.string(),blockHeight,signature,nodeAddr);
    // console.log('AddUserOffChainSpace end')

    // //设置缓存值
    // //获取最新区块高度
    // const blockHeight = await this.getBlockHeight();
    // const expire = (blockHeight? blockHeight : 0) + 10000;
    // const value = "testvalue";
    // const valueArray = new TextEncoder().encode(value);
    // const hashValue = await sha256(valueArray);  
    
    // // 将 Blockheight 和 Expire 转换为小端字节数组  
    // const hValue: Uint8Array = uint32ToLittleEndianBytes(blockHeight? blockHeight : 0);  
    // const expValue: Uint8Array = uint32ToLittleEndianBytes(expire);  

    // // 将 expValue 和 hValue 连接起来  
    // const preSignPart1 = new Uint8Array(expValue.length + hValue.length);  
    // preSignPart1.set(expValue, 0);  
    // preSignPart1.set(hValue, expValue.length);  

    // // 将 hashValue 追加到 preSignPart1 之后  
    // const preSign = new Uint8Array(preSignPart1.length + hashValue.length);  
    // preSign.set(preSignPart1, 0);  
    // preSign.set(hashValue, preSignPart1.length);  

    // const signature = privKey.sign(preSign);
    // const setCacheValueReply = await dcClient.SetCacheKey(value,blockHeight? blockHeight : 0,expire,signature);
    // console.log('SetCacheKey reply:', setCacheValueReply)
    return "";
  };


   async getBlockHeight() {
     const lastBlock = await this.dcchainapi?.rpc.chain.getBlock();
     const blockHeight = lastBlock?.block.header.number.toNumber();
    return blockHeight;
  }

  // 连接到所有文件存储节点
  _connectToObjNodes = async (cid: string) => {
    const fileInfo = (await this.dcchainapi?.query.dcNode.files(cid)) || null;
    console.log("new first 1");
    const fileInfoJSON = fileInfo?.toJSON();

    console.log("fileInfoJSON", fileInfoJSON);
    if (
      !fileInfoJSON ||
      typeof fileInfoJSON !== "object" ||
      (fileInfoJSON as { peers: any[] }).peers.length == 0
    ) {
      console.log("no peers found for file: ", cid);
      return;
    }
    const res = await this._connectPeer(fileInfoJSON as { peers: any[] });
    console.log("new first 2");
    console.log(res);
    return res;
  };
  _connectPeer = (fileInfoJSON: { peers: any[] }) => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = (fileInfoJSON as { peers: any[] }).peers.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        const nodeAddr = await _this._getDcNodeAddr(
          (fileInfoJSON as { peers: any[] }).peers[i]
        );
        console.log("nodeAddr", nodeAddr);
        if (!nodeAddr) {
          console.log("nodeAddr return");
          num++;
          if (num >= len) {
            reslove(false);
          }
          return;
        }

        try {
          const res = await _this.dcNodeClient.dial(nodeAddr);
          console.log("nodeAddr try return");
          console.log(res);
          if (res) {
            reslove(res);
          } else {
            num++;
            if (num >= len) {
              reslove(false);
            }
          }
        } catch (error) {
          console.log("nodeAddr catch return", error);
          num++;
          if (num >= len) {
            reslove(false);
          }
        }
      }

      // 遍历传进来的promise数组
      for (let i = 0; i < len; i++) {
        dialNodeAddr(i);
      }
    });
  };

  // 链上查询节点信息
  _getDcNodeAddr = async (peerid: string) => {
    const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid);
    const peerInfoJson = peerInfo?.toJSON();
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== "object" ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ""
    ) {
      console.log("no ip address found for peer: ", peerid);
      return;
    }
    let nodeAddr = Buffer.from(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
      "hex"
    ).toString("utf8");
   let addrParts = nodeAddr.split(",");
    nodeAddr = addrParts[0]
    //节点ws监听端口号在原来的tcp监听的基础上加10
    let newNodeAddr = "";
    const parts = nodeAddr.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] == "tcp" && i < parts.length - 1) {
        const newPort = parseInt(parts[i + 1]) + 10;
        newNodeAddr += parts[i] + "/" + newPort + "/";
        i++;
      } else if (parts[i] == "p2p") {
        newNodeAddr += "ws/" + parts[i] + "/";
      } else {
        newNodeAddr += parts[i] + "/";
      }
    }
    const addr = multiaddr(newNodeAddr);
    console.log("newNodeAddr", newNodeAddr);
    return addr;
  };


  // 链上查询节点webrtc direct的地址信息
  _getDcNodeWebrtcDirectAddr = async (peerid: string) => {
    const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid);
    const peerInfoJson = peerInfo?.toJSON();
    if (
      !peerInfoJson ||
      typeof peerInfoJson !== "object" ||
      (peerInfoJson as { ipAddress: string }).ipAddress == ""
    ) {
      console.log("no ip address found for peer: ", peerid);
      return;
    }
    let nodeAddr = Buffer.from(
      (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
      "hex"
    ).toString("utf8");
   let addrParts = nodeAddr.split(",");
   if (addrParts.length < 2) {
     return ;
    }

    console.log("nodeAddr", addrParts[1]);
    const addr = multiaddr(addrParts[1]);
    return addr;
  };



  _createHeliaNode = async () => {
    // the blockstore is where we store the blocks that make up files
    const blockstore = new MemoryBlockstore();

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore();
    // 创建或导入私钥  
    const keyPair = await keys.generateKeyPair('Ed25519')  

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore,
      transports: [
        webRTCDirect(),
        circuitRelayTransport(),     
      ],
      connectionEncrypters: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },
      streamMuxers: [yamux()],
      services: {
        identify: identify(),
      },
    });
  
    // libp2p.handle("/dc/thread/0.0.1", async ({ stream, connection }) => {  
    //   // 处理入站流  
    //   this.handleIncomingStream(stream);  
    // });
    return await createHelia({
      datastore,
      blockstore,
      libp2p,
    });
  };
}

function decryptContentForBrowser(
  encryptBuffer: Uint8Array,
  decryptKey: string
) {
  if (decryptKey == "" || encryptBuffer.length <= 28) {
    return encryptBuffer;
  }
  const nonce = encryptBuffer.subarray(0, NonceBytes);
  const iv = new Word32Array(nonce);
  const tag = encryptBuffer.subarray(
    encryptBuffer.length - TagBytes,
    encryptBuffer.length
  );
  const kdfSalt = new Word32Array(tag);
  const encryptContent = encryptBuffer.subarray(
    NonceBytes,
    encryptBuffer.length - TagBytes
  );
  const cipherText = new Word32Array(encryptContent);
  const key = new Word32Array(base32.decode(decryptKey));
  const decrypted = AES.decrypt(cipherText.toString(Base64), key, {
    iv: iv,
    padding: pad.NoPadding,
    mode: mode.GCM,
    kdfSalt: kdfSalt,
  });
  return decrypted.toUint8Array();
}

// 比较两个字节数组是否相等
function compareByteArrays(array1: Uint8Array, array2: Uint8Array) {
  if (array1.byteLength != array2.byteLength) {
    return false;
  }
  const view1 = new DataView(array1.buffer, array1.byteOffset);
  const view2 = new DataView(array2.buffer, array2.byteOffset);
  for (let i = 0; i < array1.length; i++) {
    if (view1.getUint8(i) !== view2.getUint8(i)) {
      return false;
    }
  }
  return true;
}

function mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  // sum of individual array lengths
  const mergedArray = new Uint8Array(a1.length + a2.length);
  mergedArray.set(a1);
  mergedArray.set(a2, a1.length);
  return mergedArray;
}
