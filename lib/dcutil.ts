import { ChainUtil } from "./chain";
import { isName, multiaddr } from "@multiformats/multiaddr";
import { IDBDatastore } from 'datastore-idb'  
import { IDBBlockstore } from 'blockstore-idb' 
import { keys } from "@libp2p/crypto";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTCDirect } from "@libp2p/webrtc";
import { createHelia,HeliaLibp2p } from "helia";
import { createLibp2p, Libp2p } from "libp2p";
import { identify } from "@libp2p/identify";
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import type { Multiaddr } from "@multiformats/multiaddr";
import { kadDHT,removePublicAddressesMapper } from "@libp2p/kad-dht";
import { createBitswap } from '@helia/bitswap' 
import { prefixLogger } from '@libp2p/logger' 
import { ping } from '@libp2p/ping'


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
          const res = await this.dcNodeClient.libp2p.dial(nodeAddr);
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
    console.log("_createHeliaNode=======");
    const datastore = new IDBDatastore('helia-meta')  
    await datastore.open();
    const blockstore = new IDBBlockstore('helia-blocks')
    await blockstore.open();
    // 创建或导入私钥
    const keyPair = await keys.generateKeyPair("Ed25519");

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore,
      transports: [webRTCDirect(), circuitRelayTransport()],
      connectionEncrypters: [noise()],
      addresses: {  
        listen: ['/webrtc-direct']  
      }  ,
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },
      connectionManager: {  
        maxParallelDials: 100,  
      }, 
      streamMuxers: [yamux()],
      services: {
        identify: identify(),
        ping: ping(),
        kadDHT: kadDHT({
          protocol: '/ipfs/kad/1.0.0', // 标准公网协议  
          clientMode: false, // 作为全节点参与 
          maxOutboundStreams: 5, 
        }) ,
  
        
        
       
      },
    });
  
  
// 构建依赖项  
const components = {  
  libp2p: libp2p,  
  blockstore: blockstore,  
  datastore: datastore,  
  peerId: libp2p.peerId, 
  routing: kadDHT({  
    protocol: '/ipfs/kad/1.0.0',   
  }),  
  logger: prefixLogger('bitswap')
} 


  // 自定义配置  
const options = {  
  protocol: '/ipfs/bitswap/1.3.0',  
  engine: {  
    targetMessageSize: 512 * 1024, // 512KB  
    taskQueueConcurrency: 10  
  }  
} 

// 创建实例  
const bitswap = createBitswap(components, options)  
libp2p.services.bitswap = bitswap;


    // libp2p.handle("/dc/thread/0.0.1", async ({ stream, connection }) => {
    //   // 处理入站流
    //   this.handleIncomingStream(stream);
    // });
    const dcNodeClient = await createHelia({
      datastore,
      blockstore,
      libp2p,
      metrics: libp2p.metrics,
      
      
    })
    this.dcNodeClient = dcNodeClient
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