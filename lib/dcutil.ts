import { ChainUtil } from "./chain";
import { isName, multiaddr } from "@multiformats/multiaddr";
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";
import { keys } from "@libp2p/crypto";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { createHelia, HeliaLibp2p } from "helia";
import { createLibp2p, Libp2p } from "libp2p";
import { identify, identifyPush } from "@libp2p/identify";

import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import type { Multiaddr } from "@multiformats/multiaddr";
import { kadDHT } from "@libp2p/kad-dht";
import { loadKeyPair, saveKeyPair } from "./util/utils";
import { Ed25519PrivateKey } from "@libp2p/interface";
import { ping } from "@libp2p/ping";
// import {mdns} from '@libp2p/mdns'
import {StreamWriter } from './file/streamwriter'
import type { Connection }  from '@libp2p/interface'
import { Stream } from '@libp2p/interface'
import { Uint8ArrayList } from 'uint8arraylist'; 
import  { oidfetch } from "./proto/oidfetch_proto";
import { Blocks } from "@helia/interface";
import {CID} from 'multiformats/cid'
import {
  compareByteArrays,
  decryptContentForBrowser,
  mergeUInt8Arrays,
  sleep,
  uint32ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  uint64ToLittleEndianBytes,
  concatenateUint8Arrays,
} from './util/utils'
import internal from "stream";

// http2 type
export class Http2_Type {
  static Handshake = 0x00;
  static Data = 0x01;
  static ACK = 0x02;
  static Close = 0x03;
  
}

export class BrowserType {
  static File = 1;
  static ThreadDB = 2;
  static ThreadRec = 3;
}




interface CustomMessage {  
  type: number; // uint8 (1字节)  
  version: number; // uint16 (2字节, 大端序)  
  payload: Uint8Array; // 二进制数据  
} 


import { autoNAT } from "@libp2p/autonat";
import { dcutr } from "@libp2p/dcutr";
import { bitswap } from "@helia/block-brokers";
import { Client } from "./dcapi";
import { dc_protocol, dial_timeout } from "./define";
import { Ed25519PubKey } from "./dc-key/ed25519";

const controller = new AbortController();
const { signal } = controller;
// import {uPnPNAT} from '@libp2p/upnp-nat'
export class DcUtil {
  dcChain: ChainUtil;
  connectLength: number;
  dcNodeClient: HeliaLibp2p<Libp2p> | undefined; // 什么类型？dc node 对象，主要用于建立连接
  defaultPeerId: string | undefined; // 默认 peerId

  constructor(dcChain: ChainUtil) {
    this.dcChain = dcChain;
    this.connectLength = 5;
  }
  // 连接到所有文件存储节点
  _connectToObjNodes = async (cid: string) => {
    const peers = await this.dcChain.getObjNodes(cid);
    if (!peers) {
      console.error("peers is null");
      return;
    }
    const res = await this._connectPeers(peers);
    console.log("new first 2");
    console.log(res);
    return res;
  };

  _connectPeers = (peerListJson: string[]): Promise<Multiaddr> => {
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
          console.error("no nodeAddr return");
          num++;
          if (num >= len) {
            reject("no nodeAddr return");
          }
          return;
        }

        try {
          if (_this.dcNodeClient?.libp2p) {
            const resCon = await _this.dcNodeClient?.libp2p.dial(nodeAddr, {
              signal: AbortSignal.timeout(dial_timeout)
            });
            console.log("nodeAddr try return");
            console.log(resCon);
            if (resCon) {
              reslove(nodeAddr);
            } else {
              num++;
              if (num >= len) {
                reject("dial nodeAddr failed");
              }
            }
          }
        } catch (error) {
          console.error("dial nodeAddr error,error:%s", error.message);
          num++;
          if (num >= len) {
            reject(error.message);
          }
        }
      }

      // 遍历传进来的promise数组
      for (let i = 0; i < len; i++) {
        dialNodeAddr(i);
      }
    });
  };
  connectToUserDcPeer = async (
    account: Uint8Array, 
  ) : Promise<Client | null> => {
    const peerAddrs = await this.dcChain.getAccountPeers(account);
    if (!peerAddrs || peerAddrs.length == 0) {
      return null;
    }
    // 连接节点
    if (!this.dcNodeClient || !this.dcNodeClient?.libp2p) {
      return null;
    }
    const nodeAddr = await this._connectPeers(peerAddrs);
    console.log("_connectNodeAddrs nodeAddr:", nodeAddr);
    if (!nodeAddr) {
      return null;
    }
    const client = new Client(this.dcNodeClient?.libp2p,this.dcNodeClient.blockstore, nodeAddr, dc_protocol);

    return client;
  };

  // 连接节点列表
  connectToUserAllDcPeers = async (
    account: Uint8Array, 
  ) : Promise<Client[] | null> => {
    const peerAddrs = await this.dcChain.getAccountPeers(account);
    if (!peerAddrs || peerAddrs.length == 0) {
      return null;
    }

    let clients: Client[] = [];
    // 连接节点
    for (let i = 0; i < peerAddrs.length; i++) {
      const item = peerAddrs[i];
      if(item){
        try {
          if (!this.dcNodeClient || !this.dcNodeClient?.libp2p) {
            return null;
          }
          const nodeAddr = await this._connectPeers([item]);
          console.log("_connectNodeAddrs nodeAddr:", nodeAddr);
          if (!nodeAddr) {
            return null;
          }
          const client = new Client(this.dcNodeClient?.libp2p, this.dcNodeClient.blockstore, nodeAddr, dc_protocol);
          clients.push(client)
        } catch (error) {
          console.error("connectToUserAllDcPeers error", error);
        }
      }
    }
    return clients;
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
          if (_this.dcNodeClient?.libp2p) {
            const res = await _this.dcNodeClient.libp2p.dial(nodeAddr, {
              signal: AbortSignal.timeout(dial_timeout)
            });
            console.log("nodeAddr try return");
            console.log(res);
            if (res) {
              reslove(nodeAddr);
              return;
            }
          }
          num++;
          if (num >= len) {
            reslove(false);
          }
        } catch (error) {
          console.error("nodeAddr catch return", error);
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
    console.log("_createHeliaNode=======");
    const datastore = new IDBDatastore("helia-meta");
    await datastore.open();
    const blockstore = new IDBBlockstore("helia-blocks");
    await blockstore.open();

    // const memoryDatastore = new MemoryDatastore();
    // 创建或导入私钥
    let keyPair = (await loadKeyPair("Ed25519PrivateKey")) as Ed25519PrivateKey;
    if (!keyPair) {
      keyPair = await keys.generateKeyPair("Ed25519");
      await saveKeyPair("Ed25519PrivateKey", keyPair);
    }
    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore: datastore,
      transports: [webRTCDirect(), circuitRelayTransport(), webRTC()], //
      connectionEncrypters: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },

      connectionManager: {
        maxParallelDials: 100,
        maxConnections: 1000,
        inboundConnectionThreshold: 100,
      },

      streamMuxers: [
        yamux({
          maxStreamWindowSize: 256 * 1024, // 流窗口大小
          maxMessageSize: 16 * 1024, // 消息分片阈值
          keepAliveInterval: 15_000, // 保活检测间隔 (ms)
          maxInboundStreams: 100,
          maxOutboundStreams: 100,
          initialStreamWindowSize: 256 * 1024,
          enableKeepAlive: false,
        }),
      ],
      services: {
        dht: kadDHT({
          // 启用 DHT 加强节点发现
          clientMode: true,
        }),
        autoNAT: autoNAT(),
        dcutr: dcutr(),
        identify: identify(),
        identifyPush: identifyPush(),
        ping: ping(),
        autoRelay: (components) => ({
          // 使用函数式配置
          enabled: true, // 通过闭包传递参数
          maxListeners: 2,
          peerSource: components.peerStore, // 注入依赖组件
        }),
      },
      addresses: {
        listen: ["/webrtc-direct", "/p2p-circuit", "/webrtc"],
      },
    });
    console.log("libp2p getProtocols", libp2p.getProtocols());
    console.log("libp2p peerId", libp2p.peerId.toString());
    console.log("libp2p 服务列表:", Object.keys(libp2p.services));
    console.log("libp2p 已连接节点列表:", Object.keys(libp2p.getPeers()));

    const dcNodeClient = await createHelia({
      blockBrokers: [
        bitswap({
          maxInboundStreams: 64,
          maxOutboundStreams: 128,
        }),
      ],
      datastore,
      blockstore,
      libp2p,
    });

    this.dcNodeClient = dcNodeClient;

    return dcNodeClient;
  };

  // 获取链接过的peerid
  _getConnectedPeerId = async (): Promise<string> => {
    if (this.defaultPeerId) {
      return this.defaultPeerId;
    } else {
      const defaultPeerId = localStorage.getItem("defaultPeerId");
      if (defaultPeerId) {
        this.defaultPeerId = defaultPeerId;
        return defaultPeerId;
      }
      return "";
    }
  };
  _getNodeAddr = async (peerId: string): Promise<Multiaddr | undefined> => {
    let nodeAddr = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId);
    if (!nodeAddr) {
      console.error("no node address found for peer: ", peerId);
      return;
    }
    if (isName(nodeAddr)) {
      const addrs = await nodeAddr.resolve();
      nodeAddr = addrs[0];
    }
    return nodeAddr;
  };

  getDefaultDcNodeAddr = async (): Promise<Multiaddr | undefined> => {
    const peerId = await this._getConnectedPeerId();
    if (peerId) {
      let nodeAddr = await this._getNodeAddr(peerId);
      if (nodeAddr) {
        try {
          const connection = await this.dcNodeClient?.libp2p.dial(nodeAddr, {
            signal: AbortSignal.timeout(dial_timeout)
          });
          if (connection) {
            return nodeAddr;
          }
        } catch (error) {
        }
      }
      localStorage.removeItem("defaultPeerId");
    }
    // 获取节点上的默认节点列表，随机获取几个，批量连接节点，得到最快的节点
    const allNodeList = await this.dcChain.getDcNodeList();
    if (!allNodeList) {
      return;
    }
    // 连接节点，得到最快的节点（随机取几个连接取最快，如果都没有连接上继续随机取）
    const nodeAddr = await this._getConnectDcNodeList(allNodeList);
    if (!nodeAddr) {
      console.error("no node connected");
      return;
    }

    // 保存默认节点
    const defaultPeerId = (nodeAddr as Multiaddr).getPeerId();
    if (defaultPeerId) {
      localStorage.setItem("defaultPeerId", defaultPeerId.toString());
    }
    return nodeAddr as Multiaddr;
  };

  _getConnectDcNodeList = async (
    nodeList: string[]
  ): Promise<Multiaddr | undefined> => {
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
      return nodeAddr as Multiaddr;
    } else {
      let nodeAddr = await this._connectNodeAddrs(nodeList);
      if (!nodeAddr) {
        return;
      }
      return nodeAddr as Multiaddr;
    }
  };
  _getRamdomNodeList = (nodeList: string[], num: number): string[] => {
    const len = nodeList.length;
    const res: string[] = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * len);
      res.push(nodeList[randomIndex]);
    }
    return res;
  };





  //创建主动上报流处理,type:1-文件或文件夹假Cid,2-threaddb threadid,3-threaddb recordid
  async createTransferStream(libp2p: Libp2p,blockstore: Blocks,nodeAddr: Multiaddr, type: number,oid: string) {
    const nodeConn = await libp2p.dial(nodeAddr, {
      signal: AbortSignal.timeout(dial_timeout)
    });
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
          const initRequest = oidfetch.pb.InitRequset.decode(parsedMessage.payload)
          if (!initRequest) {
            continue
          }
          //mParts 清空
          mParts.length = 0
          //发送数据到服务器
          const message = new TextEncoder().encode(oid)
          const initReply  = new oidfetch.pb.InitReply({type: type, oid: message})
          //组装数据
          const initReplyBytes = oidfetch.pb.InitReply.encode(initReply).finish()
          const messageData = this.assembleCustomMessage({  
            type: Http2_Type.ACK,  
            version: 1,  
            payload: initReplyBytes,  
          })
          await writer.write(messageData)
          handshakeFlag = true
        }else{
            // 解析消息
            const fetchRequest = oidfetch.pb.FetchRequest.decode(parsedMessage.payload)
            
            const resCid =  new TextDecoder().decode(fetchRequest.cid)
            //获取resCid对应的block
            const cid = CID.parse(resCid);  

            // 通过 blockstore 获取该 CID 对应的区块  
            try {  
              const block = await blockstore.get(cid);  
              const fetchReply = new oidfetch.pb.FetchReply({data: block})
              const fetchReplyBytes = oidfetch.pb.FetchReply.encode(fetchReply).finish()
              const messageData = this.assembleCustomMessage({  
                type: Http2_Type.ACK,  
                version: 1,  
                payload: fetchReplyBytes,  
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

}
