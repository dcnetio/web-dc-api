import { ChainUtil } from "./chain";
import { isName, multiaddr } from "@multiformats/multiaddr";
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";
import {MemoryDatastore} from "datastore-core";
import {MemoryBlockstore} from "blockstore-core";
import { keys } from "@libp2p/crypto";
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webTransport } from "@libp2p/webtransport";
import { createHelia, HeliaLibp2p, libp2pDefaults } from "helia";
import { createLibp2p, Libp2p } from "libp2p";
import { identify, identifyPush } from "@libp2p/identify";
import { gossipsub } from '@chainsafe/libp2p-gossipsub' 

import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import type { Multiaddr } from "@multiformats/multiaddr";
import { kadDHT, removePublicAddressesMapper } from "@libp2p/kad-dht";
import { loadKeyPair, saveKeyPair } from "./util/utils";
import { Ed25519PrivateKey } from "@libp2p/interface";
import { webSockets } from "@libp2p/websockets";
import { createBitswap } from '@helia/bitswap' 
import { prefixLogger } from '@libp2p/logger' 
import { ping } from '@libp2p/ping'
import { Bitswap } from '@helia/bitswap'
// import {mdns} from '@libp2p/mdns'
import {autoNAT} from '@libp2p/autonat'
import { dcutr } from '@libp2p/dcutr'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import { bitswap ,trustlessGateway} from '@helia/block-brokers'
import { CID } from "multiformats/cid";
import { ProviderEvent,PeerResponseEvent } from "@libp2p/kad-dht"; 
import { pushable } from 'it-pushable' 

import { pipe } from 'it-pipe'  
import { fromString } from 'uint8arrays/from-string'  
import { peerIdFromString } from "@libp2p/peer-id";
import { truncate } from "fs";



// import {uPnPNAT} from '@libp2p/upnp-nat'
export class DcUtil {
  dcChain: ChainUtil;
  connectLength: number;
  dcNodeClient: HeliaLibp2p<Libp2p> | undefined; // 什么类型？dc node 对象，主要用于建立连接
  dcNodeClient2: HeliaLibp2p<Libp2p> | undefined; // 什么类型？dc node 对象，主要用于建立连接
  defaultPeerId: string | undefined; // 默认 peerId

  constructor(dcChain: ChainUtil) {
    this.dcChain = dcChain;
    this.connectLength = 5;
  }
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
          console.log("no nodeAddr return");
          num++;
          if (num >= len) {
            reject("no nodeAddr return");
          }
          return;
        }

        try {
          const resCon = await _this.dcNodeClient?.libp2p.dial(nodeAddr);
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
        } catch (error) {
          console.log("dial nodeAddr error,error:%s", error.message);
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
            const res = await _this.dcNodeClient.libp2p.dial(nodeAddr);
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
    console.log("_createHeliaNode=======");
    const datastore = new IDBDatastore("helia-meta");
    await datastore.open();
    const blockstore = new IDBBlockstore("helia-blocks");
    await blockstore.open();
    
    const blockstore1 = new MemoryBlockstore(); 
    const datastore1 = new MemoryDatastore();
   // const memoryDatastore = new MemoryDatastore();
    // 创建或导入私钥
    let keyPair = await loadKeyPair("1") as Ed25519PrivateKey;
    if(!keyPair){
      keyPair = await keys.generateKeyPair("Ed25519"); 
      await saveKeyPair("1",keyPair);
    }
    let keyPair2 = await loadKeyPair("2") as Ed25519PrivateKey;
    if(!keyPair2){
      keyPair2 = await keys.generateKeyPair("Ed25519"); 
      await saveKeyPair("2",keyPair2);
    }
    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore: datastore1,
      transports: [webRTCDirect(), circuitRelayTransport(),webRTC() ], // 
      connectionEncrypters: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },
      
      connectionManager: {  
        maxParallelDials: 100,  
        maxConnections: 1000,
        inboundConnectionThreshold:100,
      },

     
      streamMuxers: [yamux({  
        
        maxStreamWindowSize: 256 * 1024, // 流窗口大小  
        maxMessageSize:   1024,     // 消息分片阈值  
        keepAliveInterval: 30_000,            // 保活检测间隔 (ms) 
          
      })]  ,
      // peerDiscovery: [
      //   bootstrap({list:[
      //       "/ip4/192.168.31.42/udp/4009/webrtc-direct/certhash/uEiDJmrI4aTWMwQPTW4dRvDJLGLaDkoxVss0f6nGIKchhZw/p2p/12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf"
      //   ]}),
      // ],
      services: {
       
        // dht: kadDHT({
        //   protocol: "/ipfs/kad/1.0.0", // 标准公网协议
        //   kBucketSize:100,
        //   clientMode: false, // 作为全节点参与
        //   maxOutboundStreams: 100,
        //   maxInboundStreams: 20,
        //   querySelfInterval:1,
        //   initialQuerySelfInterval:10000,
        //   allowQueryWithZeroPeers: true,
        //   validators: {
        //     ipns: ipnsValidator
        //   },
        //   selectors: {
        //     ipns: ipnsSelector
        //   },
        //   providers:{cacheSize: 1024},
        //   reprovide: {interval: 10000},
        // }),
        autoNAT: autoNAT(),
        dcutr: dcutr(),
        identify: identify(), 
        identifyPush: identifyPush(), 
        ping: ping(), 
        autoRelay: (components) => ({  // 使用函数式配置  
          enabled: true,               // 通过闭包传递参数  
          maxListeners: 2,  
          peerSource: components.peerStore  // 注入依赖组件  
        })
      },
      addresses: {
        listen: [
          '/webrtc-direct',
          '/p2p-circuit',
          '/webrtc'
        ],
      },
    });
    console.log('libp2p getProtocols', libp2p.getProtocols())
    console.log('libp2p peerId', libp2p.peerId.toString())
    console.log('libp2p 服务列表:', Object.keys(libp2p.services))  
    console.log('libp2p 已连接节点列表:', Object.keys(libp2p.getPeers()))
   
   // libp2p.handle("/ipfs/bitswap/1.2.0", this.handler);
 
    
  
    const dcNodeClient = await createHelia({
      blockBrokers: [  
        bitswap({  
          maxInboundStreams: 64,  
          maxOutboundStreams: 128,   
        })  
      ],
      datastore:datastore1,
      blockstore:blockstore1,
      libp2p,
    });


     // libp2p is the networking layer that underpins Helia
     const libp2p2 = await createLibp2p({
      privateKey: keyPair2,
      datastore: datastore,
      transports: [webRTCDirect(), circuitRelayTransport(),webRTC() ], // 
      connectionEncrypters: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },
      
      connectionManager: {  
        maxParallelDials: 20,  
        maxConnections: 100,
        inboundConnectionThreshold:10,
      },

     
      streamMuxers: [yamux({  
        
        maxStreamWindowSize: 256 * 1024, // 流窗口大小  
        maxMessageSize: 1024,     // 消息分片阈值  
        keepAliveInterval: 30_000,            // 保活检测间隔 (ms) 
          
      })]  ,
      peerDiscovery: [
        bootstrap({list:[
            "/ip4/192.168.31.42/udp/4009/webrtc-direct/certhash/uEiDJmrI4aTWMwQPTW4dRvDJLGLaDkoxVss0f6nGIKchhZw/p2p/12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf"
        ]}),
      ],
      services: {
       
        dht: kadDHT({
          protocol: "/ipfs/kad/1.0.0", // 标准公网协议
       //   peerInfoMapper: removePublicAddressesMapper,
          kBucketSize:100,
          clientMode: true, // 作为全节点参与
          maxOutboundStreams: 100,
          maxInboundStreams: 100,
          initialQuerySelfInterval:10,
          providers:{cacheSize: 102400},
          reprovide: {interval: 1000},
        }),
        autoNAT: autoNAT(),
        dcutr: dcutr(),
        identify: identify(), 
        identifyPush: identifyPush(), 
        ping: ping(), 
        autoRelay: (components) => ({  // 使用函数式配置  
          enabled: true,               // 通过闭包传递参数  
          maxListeners: 2,  
          peerSource: components.peerStore  // 注入依赖组件  
        })
      },
      addresses: {
        listen: [
          '/webrtc-direct',
          '/p2p-circuit',
          '/webrtc'
        ],
      },
    });

// Bitswap 协议标识符  
const BITSWAP_PROTOCOL = '/ipfs/bitswap/1.2.0' 
    
  










    console.log('libp2p2 peerId', libp2p2.peerId.toString())
    const dcNodeClient2 = await createHelia({
      // blockBrokers: [  
      //   bitswap({  
      //     maxInboundStreams: 64,  
      //     maxOutboundStreams: 128,   
      //   })  
      // ],  
      datastore,
      blockstore,
      libp2p:libp2p2,
    });

    // const bs = bitswap(dcNodeClient)  

    // // 数据块内容  
    // const data = new TextEncoder().encode('广播内容')  
  
    // // 创建高优先级 Bitswap 会话  
    // const session = bs.session({ priority: 1 })  
  
    this.dcNodeClient = dcNodeClient;
    this.dcNodeClient2 = dcNodeClient2;
    this.dcNodeClient.start();
    this.dcNodeClient2.start();

    //await libp2p2.unhandle(BITSWAP_PROTOCOL)  
  //   libp2p2.handle(BITSWAP_PROTOCOL, async ({ connection, stream }) => {  
  //     const peerId = connection.remotePeer.toString()  
  //     console.log(`[自定义 Bitswap] 拦截来自 ${peerId} 的 Bitswap 请求`)  
  
  //     // try {  
  //     //   // 使用 pipe 处理 Bitswap 消息流  
  //     //   await pipe(  
  //     //     stream.source,  
  //     //     async function* (source) {  
  //     //       // 处理输入流  
  //     //       for await (const data of source) {  
  //     //         try {  
  //     //           // 解析 Bitswap 消息  
  //     //           const message = BitswapMessage.deserialize(data)  
  //     //           console.log(`[自定义 Bitswap] 收到消息类型:`, message)  
  
  //     //           // 检查是否包含 wantlist  
  //     //           if (message.wantlist && message.wantlist.entries.length > 0) {  
  //     //             console.log(`[自定义 Bitswap] Wantlist 条目:`,   
  //     //               message.wantlist.entries.map(e => ({   
  //     //                 cid: e.cid.toString(),  
  //     //                 priority: e.priority  
  //     //               }))  
  //     //             )  
  
  //     //             // 这里可以自定义处理 wantlist 请求  
  //     //             // 例如：过滤特定 CID、优先处理某些请求等  
  //     //             const customHandledCids = await processWantlist(message.wantlist.entries)  
                  
  //     //             if (customHandledCids.length > 0) {  
  //     //               // 创建响应消息  
  //     //               const responseMsg = new Message(false)  
                    
  //     //               // 添加我们自定义处理的区块  
  //     //               for (const { cid, data } of customHandledCids) {  
  //     //                 responseMsg.addBlock(CID.parse(cid), data)  
  //     //               }  
                    
  //     //               // 序列化响应并发送  
  //     //               yield responseMsg.serialize()  
  //     //               continue // 跳过下一步处理  
  //     //             }  
  //     //           }  
  
  //     //           // 如果不需要自定义处理，可以传递原始数据  
  //     //           yield data  
  //     //         } catch (err) {  
  //     //           console.error('[自定义 Bitswap] 解析消息错误:', err)  
  //     //           yield data // 出错时仍传递原始数据  
  //     //         }  
  //     //       }  
  //       //  },  
  //      //   stream.sink  
  //     //  )  
  //     // } catch (err) {  
  //     //   console.error('[自定义 Bitswap] 处理流错误:', err)  
  //     // }  
  //   }) 
    return dcNodeClient;
  };
  async  manualAnnounce(helia:HeliaLibp2p, cid:CID,flag:boolean) {  
    // 手动广播CID  
  
    const peerId  = peerIdFromString('12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf')
    const peerInfo = await helia.libp2p.peerRouting.findPeer(peerId)
    console.log('发现节点:', peerInfo.id.toString())
    await helia.routing.provide(cid)
  
  
    console.log('广播CID:', cid.toString())
   // helia.blockBrokers.bitswap.announce(cid, new Uint8Array(0))
    // 验证广播结果  
    if (flag) {
    
    const providers =  helia.routing.findProviders(cid)
    for await (const provider of providers) {
      console.log('发现提供者:', provider.id.toString())
    }
    }

  }


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
      let nodeAddr = await this._getNodeAddr(peerId);
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
}
