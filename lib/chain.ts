/**
 * 区块链相关的方法
 */

import { multiaddr } from "@multiformats/multiaddr";
import { ApiPromise, WsProvider } from "@polkadot/api";
import * as buffer from "buffer/";
const { Buffer } = buffer;

export class ChainUtil {
  dcchainapi: ApiPromise | undefined;
  // 连接链节点
  create = async (blockChainAddr) => {
    const chainProvider = new WsProvider(blockChainAddr);
    this.dcchainapi = await ApiPromise.create({ 
      provider: chainProvider,
      throwOnConnect: true,
      throwOnUnknown: true,
    });
    if (!this.dcchainapi) {
      console.log("dcchainapi init failed");
      return false;
    }
    return true;
  }

  // 获取区块高度
  async getBlockHeight() {
    const lastBlock = await this.dcchainapi?.rpc.chain.getBlock();
    const blockHeight = lastBlock?.block.header.number.toNumber();
    return blockHeight;
  }


  // 获取所有文件存储节点
  getObjNodes = async (cid: string) => {
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
    const peers = (fileInfoJSON as { peers: any[] }).peers || [];
    return peers;
  };
  
  // 链上查询节点信息
  // getDcNodeAddr = async (peerid: string) => {
  //   const peerInfo = await this.dcchainapi?.query.dcNode.peers(peerid);
  //   const peerInfoJson = peerInfo?.toJSON();
  //   if (
  //     !peerInfoJson ||
  //     typeof peerInfoJson !== "object" ||
  //     (peerInfoJson as { ipAddress: string }).ipAddress == ""
  //   ) {
  //     console.log("no ip address found for peer: ", peerid);
  //     return;
  //   }
  //   let nodeAddr = Buffer.from(
  //     (peerInfoJson as { ipAddress: string }).ipAddress.slice(2),
  //     "hex"
  //   ).toString("utf8");
  //   let addrParts = nodeAddr.split(",");
  //   nodeAddr = addrParts[0];
  //   //节点ws监听端口号在原来的tcp监听的基础上加10
  //   let newNodeAddr = "";
  //   const parts = nodeAddr.split("/");
  //   for (let i = 0; i < parts.length; i++) {
  //     if (parts[i] == "tcp" && i < parts.length - 1) {
  //       const newPort = parseInt(parts[i + 1]) + 10;
  //       newNodeAddr += parts[i] + "/" + newPort + "/";
  //       i++;
  //     } else if (parts[i] == "p2p") {
  //       newNodeAddr += "ws/" + parts[i] + "/";
  //     } else {
  //       newNodeAddr += parts[i] + "/";
  //     }
  //   }
  //   const addr = multiaddr(newNodeAddr);
  //   console.log("newNodeAddr", newNodeAddr);
  //   return addr;
  // };
  // 链上查询节点webrtc direct的地址信息
  getDcNodeWebrtcDirectAddr = async (peerid: string) => {
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
      return;
    }

    console.log("nodeAddr", addrParts[1]);
    const addr = multiaddr(addrParts[1]);
    return addr;
  };

  // 链上查询节点列表
  getDcNodeList = async () => {
    const peerList = await this.dcchainapi?.query.dcNode.onlineNodesAddress();
    const peerListJson = peerList?.toJSON();
    console.log("peerListJson================================================", peerListJson);
    if (!peerListJson || typeof peerListJson!== "object") {
      console.log("no peer list found");
      return [];
    }
    let peers : string[] = [];
    for (let i = 0; i < (peerListJson as string[]).length; i++) {
      const peerJson = Buffer.from(peerListJson[i].slice(2), "hex").toString("utf8");
      console.log("peerJson", peerJson);
      peers = peers.concat(peerJson);
    }
    console.log("peers", peers);
    return peers;
  };

}