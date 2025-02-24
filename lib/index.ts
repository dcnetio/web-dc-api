// Description: 该文件包含了dc网络的工具函数，用于从dc网络获取文件或缓存值

import { ApiPromise, WsProvider } from "@polkadot/api";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTCDirect } from "@libp2p/webrtc";
import { KeyManager } from "./dc-key/keymanager";
import { compareByteArrays,mergeUInt8Arrays} from "./util/util"; 
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
  backChainAddr: string;
  dcChain: ChainUtil;
  dcNodeClient: any | undefined; // 什么类型？dc node 对象，主要用于建立连接
  dcClient: DCClient | undefined; // dc client 对象
  nodeAddr: Multiaddr | undefined; // dc node 地址
  accountNodeAddr: Multiaddr | undefined; // account dc node 地址
  privKey: Ed25519PrivKey | undefined; // 私钥
  defaultPeerId: string | undefined; // 默认 peerId
  connectLength: number; // 连接长度

  constructor(options: { wssUrl: string; backWssUrl: string }) {
    this.blockChainAddr = options.wssUrl;
    this.backChainAddr = options.backWssUrl;
    this.dcChain = new ChainUtil();
    this.connectLength = 5;
  }

  // 初始化
  init = async () => {
    let createChain;
    try {
      createChain = await this.dcChain.create(this.blockChainAddr);
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.log("dcchainapi init failed");
          return;
        }
      }
    } catch (error) {
      if (!createChain) {
        // 换个路径重新创建
        createChain = await this.dcChain.create(this.backChainAddr);
        if (!createChain) {
          console.log("dcchainapi init failed");
          return;
        }
      }
    } finally {
      // 如果链节点已经连接
      if (createChain) {
        this.dcNodeClient = await this._createHeliaNode();
        // 获取默认dc节点地址
        const nodeAddr = await this._getDefaultDcNodeAddr();
        if (nodeAddr) {
          this.nodeAddr = nodeAddr; // 当前地址
          this.dcClient = await this._newDcClient(nodeAddr);
        }
      }
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
  accountLogin = async (
    nftAccount: string,
    password: string,
    safecode: string,
    appName: string
  ) => {
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
    const prikey = await this.dcClient.AccountLogin(
      nftAccount,
      password,
      safecode,
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
      appName
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
    return true;
  };

  // 获取用户信息
  getUserInfoWithNft = async (nftAccount: string) => {
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    // todo 从链上获取
    const userInfo = await this.dcChain.getUserInfoWithNft(nftAccount);
    console.log("userInfo reply:", userInfo);
    return userInfo;
  };

  // 获取用户数据列表

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

/********************************数据库相关操作开始********************************/
 // 从DC网络拉取数据库到本地
  pullDBFromDc = async (cid: string, dbName: string) => {
    if (!this.dcClient) {
      console.log("dcClient is null");
      return;
    }
    const fs = unixfs(this.dcNodeClient);
    const dbContent = await toBuffer(fs.cat(CID.parse(cid)));
    console.log("dbContent:", dbContent);
    const dbContentStr = new TextDecoder().decode(dbContent);
    console.log("dbContentStr:", dbContentStr);
    const db = JSON.parse(dbContentStr);
    console.log("db:", db);
    return db;
  };
/********************************数据库相关操作结束********************************/



  // 连接到所有文件存储节点
  _connectToObjNodes = async (cid: string) => {
    const peers = await this.dcChain.getObjNodes(cid);
    if (!peers) {
      console.log("peers is null");
      return;
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

  // 连接节点列表
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
        const addrParts = peers[i].split(",");
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

  // 获取链接过的peerid
  _getConnectedPeerId = async (): Promise<string> => {
    if (this.defaultPeerId) {
      return this.defaultPeerId;
    } else {
      const defaultPeerId = localStorage.getItem("defaultPeerId");
      if (defaultPeerId) {
        return defaultPeerId;
      }
      return "";
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
    if (peerId) {
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
    } else {
      // 获取节点上的默认节点列表，随机获取几个，批量连接节点，得到最快的节点
      const allNodeList = await this.dcChain.getDcNodeList();
      if (!allNodeList) {
        return;
      }
      // 连接节点，得到最快的节点（随机取几个连接取最快，如果都没有连接上继续随机取）
      const nodeAddr = await this._getConnectDcNodeList(allNodeList);
      if (!nodeAddr) {
        console.log("no node connected");
        return;
      }

      // 保存默认节点
      const defaultPeerId = (nodeAddr as Multiaddr).getPeerId();
      if (defaultPeerId) {
        localStorage.setItem("defaultPeerId", defaultPeerId.toString());
      }
      return nodeAddr as Multiaddr;
    }
  };

  _getConnectDcNodeList = async (nodeList) => {
    if (nodeList.length > this.connectLength) {
      let dcNodeList = this._getRamdomNodeList(nodeList, this.connectLength);
      const nodeAddr = await this._connectNodeAddrs(dcNodeList);
      if (!nodeAddr) {
        // allNodeList 过滤掉dcNodeList
        const leftNodeList = nodeList.filter(
          (node) => dcNodeList.indexOf(node) === -1
        );
        return this._getConnectDcNodeList(leftNodeList);
      }
      return nodeAddr;
    } else {
      let nodeAddr = await this._connectNodeAddrs(nodeList);
      if (!nodeAddr) {
        return;
      }
      return nodeAddr;
    }
  };
  _getRamdomNodeList = (nodeList, num): string[] => {
    const len = nodeList.length;
    const res: string[] = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * len);
      res.push(nodeList[randomIndex]);
    }
    return res;
  };
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
