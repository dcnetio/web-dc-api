// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { ApiPromise, WsProvider } from "@polkadot/api";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTCDirect } from "@libp2p/webrtc";
import { KeyManager } from "./dc-key/keyManager";
import { keys } from "@libp2p/crypto";

import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { identify } from "@libp2p/identify";
import { CID } from "multiformats";
import { unixfs } from "@helia/unixfs";
import { base32 } from "multiformats/bases/base32";

import { yamux } from "@chainsafe/libp2p-yamux";
import { isName, multiaddr } from "@multiformats/multiaddr";
import type { Multiaddr } from "@multiformats/multiaddr";
import toBuffer from "it-to-buffer";
import * as JsCrypto from "jscrypto/es6";
import * as buffer from "buffer/";
import { noise } from "@chainsafe/libp2p-noise";
import { DCClient } from "./dcapi";
import { sha256, uint32ToLittleEndianBytes } from "./util/util";
import { Ed25519PrivKey } from "./dc-key/ed25519";
import { decryptContent } from "./util/dccrypt";
import { ChainUtil } from "./chain";

const { Buffer } = buffer;
const { Word32Array, AES, pad, mode, Base64 } = JsCrypto;
const NonceBytes = 12;
const TagBytes = 16;
const protocol = "/dc/thread/0.0.1";
export class DcUtil {
  blockChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: any | undefined; // 什么类型？
  dcClient: DCClient | undefined;
  nodeAddr: Multiaddr | undefined;
  accountNodeAddr: Multiaddr | undefined;
  privKey: Ed25519PrivKey | undefined;
  defaultPeerId: string | undefined;

  constructor(blockChainAddr: string) {
    this.blockChainAddr = blockChainAddr;
  }

  // 初始化
  init = async () => {
    this.dcChain = new ChainUtil();
    const createChain = await this.dcChain.create(this.blockChainAddr);
    if (!createChain) {
      console.log("dcchainapi init failed");
      return;
    }
    this.dcNodeClient = await this._createHeliaNode();
    
      const nodeAddr = await this._getDefaultDcNodeAddr();
      if (nodeAddr) {
        this.nodeAddr = nodeAddr;
        this.dcClient = await this._newDcClient(nodeAddr);
      }
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

  /// <reference path = "dcnet_pb.d.ts" />

  // 获取hostid
  getHostID = async (): Promise<
    { peerID: string; reqAddr: string } | undefined
  > => {
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    const getHostIdreply = await this.dcClient.getHostID();
    console.log("getHostIdreply:", getHostIdreply);
    return getHostIdreply;
  };
  // 从dc网络获取缓存值
  getCacheValueFromDc = async (key: string) => {
    //解析出peerid与cachekey
    const pkeys = key.split("/");
    if (pkeys.length != 2) {
      console.log("key format error!");
      return;
    }
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    const peerid = pkeys[0];
    const cacheKey = pkeys[1];
    try {
      let nodeAddr: Multiaddr | undefined;
      if (this.nodeAddr) {
        const connectedPeerId = this.nodeAddr.getPeerId() || "";
        if (connectedPeerId && connectedPeerId === peerid) {
          // 同一个节点
          nodeAddr = this.nodeAddr;
        } else {
          // 不是同一个节点
          nodeAddr = await this._getNodeAddr(peerid);
        }
      } else {
        nodeAddr = await this._getNodeAddr(peerid);
      }
      if (!nodeAddr) {
        console.log("nodeAddr is null");
        return;
      }
      // // 登陆
      // await this.accountLogin();
      // // 添加用户空间存储
      // await this.addUserOffChainSpace();
      // // 设置keyvalue
      // const setKey = await this.setCacheKey(JSON.stringify({
      //   cidList: [
      //     {
      //       AlbumId: "01j8mnyap0bk226s64ekeeq88f",
      //       CreateTime: 1732263381000,
      //       Duration: 0,
      //       Height: 900,
      //       Name: "1727598866014_1727598866014_3526c07d5206ee7bac6fd515071fe32c.jpg",
      //       ThumbCID:
      //         "bafybeidgxlgzahktprvoqyo2iesxui2z2uuwftxll6iyabszkyjhfmrz2y",
      //       Type: 1,
      //       UriCID:
      //         "bafybeidgxlgzahktprvoqyo2iesxui2z2uuwftxll6iyabszkyjhfmrz2y",
      //       Width: 601,
      //       _id: "01jdhhy9wj7fgcebwx58cp2y4d",
      //       enkey: "buzs2iwjaiixz2ql6jbt67xcpxcqeuhz774p2a7uzr2dpp55cplrq",
      //     },
      //     {
      //       AlbumId: "01j8mnyap0bk226s64ekeeq88f",
      //       CreateTime: 1731409392200,
      //       Duration: 0,
      //       Height: 372,
      //       Name: "t01fdbe074015146f42.webp",
      //       ThumbCID:
      //         "bafybeihqm5n7fnmbk32m4s4riwxg4lvfttwxzgtzchtukpivadbit2t3bi",
      //       Type: 1,
      //       UriCID:
      //         "bafybeihqm5n7fnmbk32m4s4riwxg4lvfttwxzgtzchtukpivadbit2t3bi",
      //       Width: 340,
      //       _id: "01jcg0nfjcsermj92372txc7gf",
      //       enkey: "buzs2iwjaiixz2ql6jbt67xcpxcqeuhz774p2a7uzr2dpp55cplrq",
      //     },
      //   ],
      // }));

      const getCacheValuereply = await this.dcClient.GetCacheValue(
        nodeAddr,
        cacheKey
      );
      console.log("GetCacheValueReply reply:", getCacheValuereply);
      return getCacheValuereply;
    } catch (err) {
      console.log("getCacheValue error:", err);
      return;
    }
  };
  register = async () => {
    // //生成助记词
    //  const mnemonic = KeyManager.generateMnemonic();
    //  //生成私钥
    // const privKey = KeyManager.getEd25519KeyFromMnemonic(mnemonic);
    // const pubKey = privKey.publicKey;
  };
  // 登陆
  accountLogin = async () => {
    //登录
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    if (!this.nodeAddr) {
      console.log("nodeAddr is null");
      return;
    }
    // todo获取账号的连接节点
    // const peerid = '12D3KooWNr1ERkUSdUQjGtmtWPB8AtWGVuDVhcoZSH4UkudU2in9';
    // const nodeAddr = await this._getNodeAddr(peerid);
    // this.accountNodeAddr = nodeAddr;
    const account = "tcorZTCZaDnyMmmYifnfztmzuxbjgy";
    const prikey = await this.dcClient.AccountLogin(
      account,
      "123456",
      "000000",
      this.nodeAddr
    );
    console.log("AccountLogin success:", prikey);
    let mnemonic = "";
    if (prikey.startsWith("mnemonic:")) {
      mnemonic = prikey.slice(9);
    } else if (prikey.startsWith("privatekey:")) {
      const basePriKey = prikey.slice(11);
      let priKey: Uint8Array;
    }
    const keymanager = new KeyManager();
    //const privKey1 = await keymanager.getEd25519KeyFromMnemonic(mnemonic);
    const privKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      "DCAPP"
    );
    const pubKey = privKey.publicKey;
    console.log("get privKey:", privKey);
    console.log("get pubKey:", pubKey);
    this.privKey = privKey;
    //获取token
    const token = await this.dcClient.GetToken(
      pubKey.string(),
      (payload: Uint8Array): Uint8Array => {
        // Implement your signCallback logic here
        const signature = privKey.sign(payload);
        return signature;
      }
    );
    console.log("GetToken reply:", token);
  };

  // 添加用户评论空间
  addUserOffChainSpace = async () => {
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    if (!this.nodeAddr) {
      console.log("nodeAddr is null");
      return;
    }
    if (!this.privKey) {
      console.log("privKey is null");
      return;
    }
    const blockHeight = (await this.dcChain.getBlockHeight()) || 0;
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const peerIdValue: Uint8Array = new TextEncoder().encode(
      this.nodeAddr.getPeerId() || ""
    );

    // 将 hValue 和 peerIdValue 连接起来
    const preSign = new Uint8Array(peerIdValue.length + hValue.length);
    preSign.set(peerIdValue, 0);
    preSign.set(hValue, peerIdValue.length);
    const signature = this.privKey.sign(preSign);
    const pubKey = this.privKey.publicKey;
    this.dcClient.AddUserOffChainSpace(
      pubKey.string(),
      blockHeight,
      signature,
      this.nodeAddr
    );
    console.log("AddUserOffChainSpace end");
  };

  // 设置缓存值
  setCacheKey = async (value: string) => {
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    if (!this.privKey) {
      console.log("privKey is null");
      return;
    }
    //获取最新区块高度
    const blockHeight = await this.dcChain.getBlockHeight();
    const expire = (blockHeight ? blockHeight : 0) + 10000;
    const valueArray = new TextEncoder().encode(value);
    const hashValue = await sha256(valueArray);

    // 将 Blockheight 和 Expire 转换为小端字节数组
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const expValue: Uint8Array = uint32ToLittleEndianBytes(expire);

    // 将 expValue 和 hValue 连接起来
    const preSignPart1 = new Uint8Array(expValue.length + hValue.length);
    preSignPart1.set(expValue, 0);
    preSignPart1.set(hValue, expValue.length);

    // 将 hashValue 追加到 preSignPart1 之后
    const preSign = new Uint8Array(preSignPart1.length + hashValue.length);
    preSign.set(preSignPart1, 0);
    preSign.set(hashValue, preSignPart1.length);

    const signature = this.privKey.sign(preSign);
    const setCacheValueReply = await this.dcClient.SetCacheKey(
      value,
      blockHeight ? blockHeight : 0,
      expire,
      signature
    );
    console.log("SetCacheKey reply:", setCacheValueReply);
    return setCacheValueReply;
  };

  // 连接到所有文件存储节点
  _connectToObjNodes = async (cid: string) => {
    const peers = await this.dcChain.getObjNodes(cid);
    if(!peers){
      console.log("peers is null");
      return
    }
    const res = await this._connectPeers(peers);
    console.log("new first 2");
    console.log(res);
    return res;
  };

  _connectPeers = (peerListJson: string[]) => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = peerListJson.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        const nodeAddr = await _this.dcChain.getDcNodeWebrtcDirectAddr(
          peerListJson[i]
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
          const res = await _this.dcNodeClient.libp2p.dial(nodeAddr);
          console.log("nodeAddr try return");
          console.log(res);
          if (res) {
            reslove(nodeAddr);
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

  _connectNodeAddrs = (peers: string[]) => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = peers.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        if (!peers[i]) {
          console.log("nodeAddr return");
          num++;
          if (num >= len) {
            reslove(false);
          }
          return;
        }
        const addrParts = peers[i].split(',');
        const nodeAddr = multiaddr(addrParts[1]);
        console.log("nodeAddr", nodeAddr);

        try {
          const res = await _this.dcNodeClient.libp2p.dial(nodeAddr);
          console.log("nodeAddr try return");
          console.log(res);
          if (res) {
            reslove(nodeAddr);
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
  _createHeliaNode = async () => {
    // the blockstore is where we store the blocks that make up files
    const blockstore = new MemoryBlockstore();

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore();
    // 创建或导入私钥
    const keyPair = await keys.generateKeyPair("Ed25519");

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore,
      transports: [webRTCDirect(), circuitRelayTransport()],
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
  _getConnectedPeerId = async (): Promise<string> => {
    // todo 获取默认peerid
    if (this.defaultPeerId) {
      return this.defaultPeerId;
    } else {
      return "";
      // return "12D3KooWNr1ERkUSdUQjGtmtWPB8AtWGVuDVhcoZSH4UkudU2in9";
      // return "12D3KooWQLMxZzZxwPgGjLTWW8NkeKomq8v2Kixu3QfchqNVG5in"
    }
  };
  _getNodeAddr = async (peerId): Promise<Multiaddr | undefined> => {
    let nodeAddr = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId);
    if (!nodeAddr) {
      console.log("no node address found for peer: ", peerId);
      return;
    }
    if (isName(nodeAddr)) {
      const addrs = await nodeAddr.resolve();
      nodeAddr = addrs[0];
    }
    return nodeAddr;
  };

  _getDefaultDcNodeAddr = async (): Promise<Multiaddr | undefined> => {
    const peerId = await this._getConnectedPeerId();
    if(peerId){
      let nodeAddr = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId);
      if (!nodeAddr) {
        console.log("no node address found for peer: ", peerId);
        return;
      }
      if (isName(nodeAddr)) {
        const addrs = await nodeAddr.resolve();
        nodeAddr = addrs[0];
      }
      return nodeAddr;
    }else { // 获取节点上的默认节点列表，批量连接节点，得到最快的几节点
      const dcNodeList = await this.dcChain.getDcNodeList();
      if (!dcNodeList) {
        return;
      }
      const nodeAddr = await this._connectNodeAddrs(dcNodeList);
      if (!nodeAddr) {
        console.log("no node connected");
        return;
      }
      return nodeAddr as Multiaddr;
    }
  }
  _newDcClient = async (nodeAddr: Multiaddr): Promise<DCClient | undefined> => {
    if (!this.nodeAddr) {
      return;
    }
    const dcClient = new DCClient(this.dcNodeClient.libp2p, nodeAddr, protocol);
    return dcClient;
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
