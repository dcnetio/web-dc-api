import { ChainUtil } from "./chain";
import { multiaddr } from "@multiformats/multiaddr";
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";
import { keys } from "@libp2p/crypto";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webSockets } from "@libp2p/websockets";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { createHelia, Helia } from "helia";
import { createLibp2p, Libp2p } from "libp2p";
import { identify, identifyPush } from "@libp2p/identify";

import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import type { Multiaddr } from "@multiformats/multiaddr";
import { kadDHT } from "@libp2p/kad-dht";
import { loadKeyPair, saveKeyPair, getPeerIdString } from "../util/utils";
import { Ed25519PrivateKey } from "@libp2p/interface";
import { ping } from "@libp2p/ping";
// import {mdns} from '@libp2p/mdns'
import { StreamWriter } from "../implements/file/streamwriter";
import { Stream } from "@libp2p/interface";
import { Uint8ArrayList } from "uint8arraylist";
import { oidfetch } from "../proto/oidfetch_proto";
import { Blocks } from "@helia/interface";
import { CID } from "multiformats/cid";
import { concatenateUint8Arrays } from "../util/utils";

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
  static Record = 3;
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

const controller = new AbortController();
const { signal } = controller;
// import {uPnPNAT} from '@libp2p/upnp-nat'
export class DcUtil {
  dcChain: ChainUtil;
  connectLength: number;
  dcNodeClient: Helia<Libp2p> | undefined; // 什么类型？dc node 对象，主要用于建立连接
  defaultPeerId: string | undefined; // 默认 peerId

  constructor(dcChain: ChainUtil) {
    this.dcChain = dcChain;
    this.connectLength = 5;
  }
  // 连接到所有文件存储节点
  _connectToObjNodes = async (
    cid: string,
  ): Promise<[Multiaddr | null, string[] | null]> => {
    const peers = await this.dcChain.getObjNodes(cid);
    if (!peers) {
      console.error("peers is null");
      return [null, null];
    }
    const res = await this._connectPeers(peers);
    return [res, peers];
  };

  connectToPeer = async (peerAddr: string): Promise<Multiaddr> => {
    return await this._connectPeers([peerAddr]);
  };

  _connectPeers = (peerListJson: string[]): Promise<Multiaddr> => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = peerListJson.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        if (!peerListJson[i]) {
          return;
        }
        const [nodeAddr, _] = await _this.dcChain.getDcNodeWebrtcDirectAddr(
          peerListJson[i],
        );
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
              signal: AbortSignal.timeout(dial_timeout),
            });
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
          if (error && typeof error === "object" && "message" in error) {
            num++;
            if (num >= len) {
              console.error(
                "dial nodeAddr error,error:%s",
                (error as any).message,
              );
              reject((error as any).message);
            }
          } else {
            num++;
            if (num >= len) {
              console.error("dial nodeAddr error,error:", error);
              reject(error);
            }
          }
        }
      }

      // 遍历传进来的promise数组
      for (let i = 0; i < len; i++) {
        dialNodeAddr(i);
      }
    });
  };
  connectToUserDcPeer = async (account: Uint8Array): Promise<Client | null> => {
    const peerAddrs = await this.dcChain.getAccountPeers(account);
    if (!peerAddrs || peerAddrs.length == 0) {
      return null;
    }
    // 连接节点
    if (!this.dcNodeClient || !this.dcNodeClient?.libp2p) {
      return null;
    }
    const nodeAddr = await this._connectPeers(peerAddrs);
    if (!nodeAddr) {
      return null;
    }
    const client = new Client(
      this.dcNodeClient?.libp2p,
      this.dcNodeClient.blockstore,
      nodeAddr,
      dc_protocol,
    );
    return client;
  };

  // 连接节点列表
  connectToUserAllDcPeers = async (
    account: Uint8Array,
  ): Promise<Client[] | null> => {
    const peerAddrs = await this.dcChain.getAccountPeers(account);
    if (!peerAddrs || peerAddrs.length == 0) {
      return null;
    }

    let clients: Client[] = [];
    // 连接节点
    for (let i = 0; i < peerAddrs.length; i++) {
      const item = peerAddrs[i];
      if (item) {
        try {
          if (!this.dcNodeClient || !this.dcNodeClient?.libp2p) {
            return null;
          }
          const nodeAddr = await this._connectPeers([item]);
          if (!nodeAddr) {
            return null;
          }
          const client = new Client(
            this.dcNodeClient?.libp2p,
            this.dcNodeClient.blockstore,
            nodeAddr,
            dc_protocol,
          );
          clients.push(client);
        } catch (error) {
          console.error("connectToUserAllDcPeers error", error);
        }
      }
    }
    return clients;
  };

  // 连接节点列表
  _connectNodeAddrs = (peers: string[]): Promise<Multiaddr | null> => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = peers.length;

      let num = 0;

      async function dialNodeAddr(i: number) {
        if (!peers[i]) {
          num++;
          if (num >= len) {
            reslove(null);
          }
          return;
        }
        const addrParts = peers[i].split(",");
        // // todo 临时测试，192.168.31.31改成10.0.0.2
        addrParts[1] = addrParts[1].replace(/192.168.31.31/g, "10.0.0.2");
        const nodeAddr = multiaddr(addrParts[1]);

        try {
          if (_this.dcNodeClient?.libp2p) {
            const res = await _this.dcNodeClient.libp2p.dial(nodeAddr, {
              signal: AbortSignal.timeout(dial_timeout),
            });
            if (res) {
              reslove(nodeAddr);
              return;
            }
          }
          num++;
          if (num >= len) {
            reslove(null);
          }
        } catch (error) {
          console.error("nodeAddr catch return", error);
          num++;
          if (num >= len) {
            reslove(null);
          }
        }
      }

      // 遍历传进来的promise数组
      for (let i = 0; i < len; i++) {
        dialNodeAddr(i);
      }
    });
  };

  _createHeliaNode = async (): Promise<Helia<Libp2p>> => {
    const datastore = new IDBDatastore("helia-meta");
    await datastore.open();
    const blockstore = new IDBBlockstore("helia-blocks");
    await blockstore.open();

    // const memoryDatastore = new MemoryDatastore();
    // 创建或导入私钥
    let keyPair = (await loadKeyPair(
      "ed25519_privateKey",
    )) as Ed25519PrivateKey;
    if (!keyPair) {
      keyPair = await keys.generateKeyPair("Ed25519");
      await saveKeyPair("ed25519_privateKey", keyPair);
    }
    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      datastore: datastore as any,
      transports: [
        webRTCDirect(),
        circuitRelayTransport(),
        webRTC(),
        webSockets(),
      ], //
      connectionEncrypters: [noise()],
      connectionGater: {
        denyDialMultiaddr: () => false, // this is necessary to dial local addresses at all
      },

      connectionManager: {
        maxParallelDials: 30,
        maxConnections: 30,
        inboundConnectionThreshold: 30,
      },

      streamMuxers: [
        yamux({
          // @ts-ignore
          maxStreamWindowSize: 256 * 1024, // 流窗口大小
          maxMessageSize: 16 * 1024, // 消息分片阈值
          keepAliveInterval: 15_000, // 保活检测间隔 (ms)
          maxInboundStreams: 30,
          maxOutboundStreams: 50,
          initialStreamWindowSize: 256 * 1024,
          enableKeepAlive: true,
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

    const dcNodeClient: Helia<Libp2p> = await createHelia({
      blockBrokers: [
        bitswap({
          maxInboundStreams: 32,
          maxOutboundStreams: 32,
        }),
      ],
      datastore: datastore as any,
      blockstore: blockstore as any,
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
    let [nodeAddr, _] = await this.dcChain.getDcNodeWebrtcDirectAddr(peerId);
    if (!nodeAddr) {
      console.error("no node address found for peer: ", peerId);
      return;
    }
    // if (isName(nodeAddr)) {
    //   const addrs = await nodeAddr.resolve();
    //   nodeAddr = addrs[0] ? addrs[0] : null;
    // }
    return nodeAddr ? nodeAddr : undefined;
  };

  getDefaultDcNodeAddr = async (): Promise<Multiaddr | undefined> => {
    const peerId = await this._getConnectedPeerId();
    if (peerId) {
      let nodeAddr = await this._getNodeAddr(peerId);
      if (nodeAddr) {
        try {
          const connection = await this.dcNodeClient?.libp2p.dial(nodeAddr, {
            signal: AbortSignal.timeout(dial_timeout),
          });
          if (connection) {
            return nodeAddr;
          }
        } catch (error) {}
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
    const defaultPeerId = getPeerIdString(nodeAddr);
    if (defaultPeerId) {
      localStorage.setItem("defaultPeerId", defaultPeerId.toString());
    }
    return nodeAddr as Multiaddr;
  };

  _getConnectDcNodeList = async (
    nodeList: string[],
  ): Promise<Multiaddr | undefined> => {
    if (nodeList.length > this.connectLength) {
      let dcNodeList = this._getRandomNodeList(nodeList, this.connectLength);
      const nodeAddr = await this._connectNodeAddrs(dcNodeList);
      if (!nodeAddr) {
        // allNodeList 过滤掉dcNodeList
        const leftNodeList = nodeList.filter(
          (node) => dcNodeList.indexOf(node) === -1,
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
  _getRandomNodeList = (nodeList: string[], num: number): string[] => {
    if (num > nodeList.length) {
      throw new Error("num cannot exceed nodeList length");
    }

    const res: string[] = [];
    const usedIndexes = new Set<number>(); // 使用 Set 提升查找效率

    while (res.length < num) {
      const randomIndex = Math.floor(Math.random() * nodeList.length);
      if (!usedIndexes.has(randomIndex)) {
        usedIndexes.add(randomIndex);
        res.push(nodeList[randomIndex]!);
      }
    }

    return res;
  };

  //创建主动上报流处理,type:1-文件或文件夹假Cid,2-threaddb threadid,3-threaddb recordid
  async createTransferStream(
    libp2p: Libp2p,
    blockstore: Blocks,
    nodeAddr: Multiaddr,
    type: number,
    oid: string,
  ) {
    const nodeConn = await libp2p.dial(nodeAddr, {
      signal: AbortSignal.timeout(dial_timeout),
    });
    const stream = await nodeConn.newStream("/dc/transfer/1.0.0", {
      signal: AbortSignal.timeout(10000),
    });

    // 使用新版 Stream 接口: stream.send / stream.close
    const streamSink = async (source: AsyncIterable<Uint8Array>) => {
      try {
        for await (const chunk of source) {
          const data =
            chunk instanceof Uint8Array ? chunk : (chunk as any).subarray();
          if (!stream.send(data)) {
            await new Promise<void>((resolve, reject) => {
              const cleanup = () => {
                stream.removeEventListener("drain", onDrain);
                stream.removeEventListener("close", onClose);
              };
              const onDrain = () => {
                cleanup();
                resolve();
              };
              const onClose = () => {
                cleanup();
                reject(new Error("Stream closed"));
              };

              stream.addEventListener("drain", onDrain);
              stream.addEventListener("close", onClose);
            });
          }
        }
      } catch (err) {
        if (
          (err as Error).message !== "Stream closed" &&
          (err as Error).message !== "Stream aborted"
        ) {
          console.error("Stream sink error:", err);
        }
        stream.abort(err as Error);
        throw err;
      } finally {
        await stream.close();
      }
    };

    let blocksSent = 0;
    let bytesReceived = 0;
    let bytesSent = 0;

    try {
      const writer = new StreamWriter(streamSink);
      const bufferList = new Uint8ArrayList();
      let parsedMessage: {
        type: number;
        version: number;
        payload: Uint8Array;
      } | null = null;
      let data: Uint8Array;
      let handshakeFlag = false;

      const chunkIterable = this.chunkGenerator(stream);
      let waitingForFirstChunk = true;
      const IDLE_TIMEOUT = 30000;

      while (true) {
        let iteratorResult: IteratorResult<Uint8Array>;
        if (waitingForFirstChunk) {
          let timeoutId: ReturnType<typeof setTimeout> | undefined;
          const timeoutPromise = new Promise<"timeout">((resolve) => {
            timeoutId = setTimeout(() => resolve("timeout"), 10_000);
          });
          const raceResult = await Promise.race([
            chunkIterable.next(),
            timeoutPromise,
          ]);
          if (raceResult === "timeout") {
            console.warn("Transfer stream: First chunk timed out after 10s");
            break;
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          iteratorResult = raceResult;
          waitingForFirstChunk = false;
        } else {
          const readTimeout = new Promise<IteratorResult<Uint8Array>>(
            (_, reject) => {
              setTimeout(
                () => reject(new Error("Read timeout after 30s")),
                IDLE_TIMEOUT,
              );
            },
          );
          try {
            iteratorResult = await Promise.race([
              chunkIterable.next(),
              readTimeout,
            ]);
          } catch (err) {
            if ((err as Error).message === "Read timeout after 30s") {
              console.warn("Stream read timeout after 30s idle");
              break;
            }
            throw err;
          }
        }

        if (iteratorResult.done) {
          break;
        }

        const chunk = iteratorResult.value;
        if (chunk instanceof Uint8ArrayList) {
          data = chunk.subarray();
        } else {
          data = chunk;
        }
        bytesReceived += data.length;
        bufferList.append(data);

        // bufferList loop to process messages
        let messagesProcessed = 0;
        while (bufferList.length >= 7) {
          const header = bufferList.subarray(0, 7);
          const payloadLength =
            ((header[3] << 24) |
              (header[4] << 16) |
              (header[5] << 8) |
              header[6]) >>>
            0;
          const totalLength = 7 + payloadLength;

          if (bufferList.length < totalLength) {
            break;
          }

          const fullMessage = bufferList.subarray(0, totalLength);
          bufferList.consume(totalLength);

          parsedMessage = this.parseMessage(fullMessage);

          if (parsedMessage) {
            if (parsedMessage.type === Http2_Type.Close) {
              console.log(
                `Transfer completed - Blocks sent: ${blocksSent}, Bytes sent: ${(bytesSent / 1024 / 1024).toFixed(2)}MB`,
              );
              return;
            }
            if (!handshakeFlag && parsedMessage.type === Http2_Type.Handshake) {
              const initReply = new oidfetch.pb.InitReply({
                type: type,
                oid: new TextEncoder().encode(oid),
              });
              const initReplyBytes =
                oidfetch.pb.InitReply.encode(initReply).finish();
              const replyData = this.assembleCustomMessage({
                type: Http2_Type.ACK,
                version: 1,
                payload: initReplyBytes,
              }) as any;

              const writeTimeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Write timeout")), 10000);
              });
              await Promise.race([writer.write(replyData), writeTimeout]);
              handshakeFlag = true;
            } else if (
              handshakeFlag &&
              parsedMessage.type === Http2_Type.Data
            ) {
              const fetchRequest = oidfetch.pb.FetchRequest.decode(
                parsedMessage.payload,
              );

              const resCid = new TextDecoder().decode(fetchRequest.cid);
              const cid = CID.parse(resCid);

              try {
                let block: any = await blockstore.get(cid);
                if (block && block[Symbol.asyncIterator]) {
                  const parts: Uint8Array[] = [];
                  for await (const part of block) {
                    parts.push(part);
                  }
                  block = concatenateUint8Arrays(...parts);
                }
                const fetchReply = new oidfetch.pb.FetchReply({ data: block });
                const fetchReplyBytes =
                  oidfetch.pb.FetchReply.encode(fetchReply).finish();
                const responseData = this.assembleCustomMessage({
                  type: Http2_Type.ACK,
                  version: 1,
                  payload: fetchReplyBytes,
                }) as any;

                const writeTimeout = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error("Write timeout")), 10000);
                });
                await Promise.race([writer.write(responseData), writeTimeout]);
                blocksSent++;
                bytesSent += responseData.length;
              } catch (error) {
                console.error("Error retrieving/sending block:", error);
                throw error;
              }
            }
          }

          // 每处理10条消息让出一次执行权，避免阻塞主线程
          messagesProcessed++;
          if (messagesProcessed % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
      }
    } catch (err) {
      console.error(
        "Transfer stream error:",
        err,
        `- Blocks sent: ${blocksSent}, Bytes sent: ${(bytesSent / 1024 / 1024).toFixed(2)}MB`,
      );
      throw err;
    } finally {
      try {
        stream.close();
      } catch (closeErr) {
        console.warn("Error closing stream:", closeErr);
      }
    }
  }

  private async *chunkGenerator(stream: Stream): AsyncGenerator<Uint8Array> {
    const iterator = stream[Symbol.asyncIterator]();
    while (true) {
      try {
        const { done, value } = await iterator.next();
        if (done) {
          break;
        }
        const res = value instanceof Uint8ArrayList ? value.subarray() : value;
        yield res;
      } catch (err) {
        console.error("Stream chunk error:", err);
        break;
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

  parseMessage(
    data: Uint8Array,
  ): { type: number; version: number; payload: Uint8Array } | null {
    if (data.length < 7) {
      return null;
    }

    // 第 1 字节: 消息类型
    const type = data[0]!;

    // 第 2 和 3 字节: 版本号（大端序）
    const version = (data[1]! << 8) | data[2]!; // 手动处理大端序

    // 第 4 至 7 字节: payload 长度（大端序）
    const payloadLength =
      (data[3]! << 24) | (data[4]! << 16) | (data[5]! << 8) | data[6]!;

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
