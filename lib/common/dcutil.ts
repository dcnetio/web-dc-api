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
import { peerIdFromString } from "@libp2p/peer-id";

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

export const EXTRA_SEP = "$$$dckv_extra$$$";

export function extractRawValue(s: string): [string, string] {
  const i = s.indexOf(EXTRA_SEP);
  return i >= 0 ? [s.slice(0, i), s.slice(i + EXTRA_SEP.length)] : [s, ""];
}

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
import {
  connection_monitor_max_timeout,
  connection_monitor_min_timeout,
  connection_monitor_ping_interval,
  dc_protocol,
  dial_timeout,
  liveness_ping_timeout,
  peer_dial_timeout,
  rtcConfiguration,
  transfer_stream_first_chunk_timeout,
  transfer_stream_idle_timeout,
  transfer_stream_open_timeout,
  transfer_stream_close_timeout,
  transfer_stream_write_timeout,
  transfer_gate_wait_timeout,
} from "./define";

const controller = new AbortController();
const { signal } = controller;
const peer_close_timeout = 5000;

/**
 * Race an async transfer operation against a timeout and clear the timer as
 * soon as the operation settles. Transfer streams can process thousands of
 * chunks, so retaining one timer per successful read/write creates avoidable
 * main-thread work in a published browser app.
 */
const withTransferTimeout = async <T>(
  operation: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(timeoutMessage)),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
};

/**
 * libp2p 3.x 的 MessageStream 通过 onDrain() 暴露背压等待，而不是保证会派发
 * TypedEventTarget 的旧式 drain 事件。兼容旧实现的事件回退仍保留，但新实现优先
 * 使用可取消的 onDrain，避免公网发布后等待永远不会到来的 drain 事件。
 */
const waitForTransferDrain = async (stream: Stream): Promise<void> => {
  const candidate = stream as Stream & {
    onDrain?: (options?: { signal?: AbortSignal }) => Promise<void>;
  };
  if (typeof candidate.onDrain === "function") {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      transfer_stream_write_timeout,
    );
    try {
      await candidate.onDrain({ signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error("Stream drain timeout");
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
    return;
  }

  await withTransferTimeout(
    new Promise<void>((resolve, reject) => {
      const eventStream = stream as Stream & {
        addEventListener?: (
          type: string,
          listener: (...args: any[]) => void,
        ) => void;
        removeEventListener?: (
          type: string,
          listener: (...args: any[]) => void,
        ) => void;
      };
      const onDrain = () => {
        cleanup();
        resolve();
      };
      const onClose = () => {
        cleanup();
        reject(new Error("Stream closed"));
      };
      const cleanup = () => {
        eventStream.removeEventListener?.("drain", onDrain);
        eventStream.removeEventListener?.("close", onClose);
      };
      eventStream.addEventListener?.("drain", onDrain);
      eventStream.addEventListener?.("close", onClose);
    }),
    transfer_stream_write_timeout,
    "Stream drain timeout",
  );
};

/**
 * 上层主动取消回推流时抛出的错误。
 * 回推流是后台流，正常退出只有三种：对端发 Close、首包/空闲超时。上层（如构建）
 * 结束后没有任何信号能让它提前退出，只能停在读循环里等 30s 写超时或 60s 空闲超时，
 * 期间既占着 muxer 流槽，也会在连接被重建时以 "Write timeout / Blocks sent: 0"
 * 的形式报错。取消是预期路径，不能按传输故障打日志。
 */
const TRANSFER_CANCELLED_MESSAGE = "Transfer stream cancelled";
const createTransferCancelledError = (): Error =>
  new Error(TRANSFER_CANCELLED_MESSAGE);
export const isTransferCancelledError = (error: unknown): boolean =>
  error instanceof Error && error.message === TRANSFER_CANCELLED_MESSAGE;

/**
 * 让一次读/写与取消信号赛跑。
 * 不用 AbortSignal.any：目标浏览器包含微信 X5（Chrome 53~86），那里没有该 API。
 */
const withTransferCancel = async <T>(
  operation: Promise<T>,
  signal?: AbortSignal,
): Promise<T> => {
  if (!signal) return operation;
  if (signal.aborted) throw createTransferCancelledError();
  let onAbort: (() => void) | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        onAbort = () => reject(createTransferCancelledError());
        signal.addEventListener("abort", onAbort);
      }),
    ]);
  } finally {
    if (onAbort) signal.removeEventListener("abort", onAbort);
  }
};

/** 关闭可能处于半开状态的流，绝不让清理动作把上层请求再次挂住。 */
const closeTransferStream = async (stream: Stream, abortReason?: unknown) => {
  const candidate = stream as Stream & {
    close?: (options?: { signal?: AbortSignal }) => Promise<void>;
    abort?: (error?: Error) => void;
  };
  try {
    if (typeof candidate.close === "function") {
      await withTransferTimeout(
        Promise.resolve(candidate.close()),
        transfer_stream_close_timeout,
        "Transfer stream close timeout",
      );
    }
  } catch {
    try {
      candidate.abort?.(
        abortReason instanceof Error
          ? abortReason
          : new Error(String(abortReason || "transfer stream cleanup")),
      );
    } catch {
      // 流已经关闭或 muxer 已经销毁，忽略二次清理错误。
    }
  }
};

// import {uPnPNAT} from '@libp2p/upnp-nat'
export class DcUtil {
  dcChain: ChainUtil;
  connectLength: number;
  dcNodeClient: Helia<Libp2p> | undefined; // 什么类型？dc node 对象，主要用于建立连接
  defaultPeerId: string | undefined; // 默认 peerId
  // 前台 AI 请求和后台 ThreadDB/文件传输共用 libp2p muxer。发布环境中，
  // 后台回推若与 AI 同时开流，半死连接会把两类流一起拖入 signal timed out。
  // 用一个轻量的读写闸门让两类传输互斥：前台优先，后台等待前台结束。
  private foregroundTransportCount = 0;
  private backgroundTransportCount = 0;
  private transportWaiters: Array<{
    timer: ReturnType<typeof setTimeout>;
    resolve: (ok: boolean) => void;
  }> = [];
  private readonly peerConnectionTasks = new Map<
    string,
    { forceReconnect: boolean; promise: Promise<Multiaddr> }
  >();

  constructor(dcChain: ChainUtil) {
    this.dcChain = dcChain;
    this.connectLength = 5;
  }

  private notifyTransportWaiters(): void {
    if (this.foregroundTransportCount > 0 || this.backgroundTransportCount > 0) {
      return;
    }
    const waiters = this.transportWaiters.splice(0);
    for (const waiter of waiters) {
      clearTimeout(waiter.timer);
      waiter.resolve(true);
    }
  }

  /**
   * 等待共享传输闸门空闲（前台和后台计数都为 0）。
   *
   * 返回 true 表示闸门已空闲可继续；返回 false 表示等待超过 boundMs 或
   * 上层 signal 已取消，调用方此时应放弃等待（但绝不能死锁——闸门本身上层
   * 的回推/拉取绝不能因为另一个方向的长流而无限期卡住，见下文 acquire*）。
   */
  private waitForTransportIdle(
    boundMs: number,
    signal?: AbortSignal,
  ): Promise<boolean> {
    if (this.foregroundTransportCount === 0 && this.backgroundTransportCount === 0) {
      return Promise.resolve(true);
    }
    if (boundMs <= 0 || signal?.aborted) {
      return Promise.resolve(false);
    }
    return new Promise<boolean>((resolve) => {
      const waiter: {
        timer: ReturnType<typeof setTimeout>;
        resolve: (ok: boolean) => void;
      } = {
        timer: 0 as unknown as ReturnType<typeof setTimeout>,
        resolve,
      };
      this.transportWaiters.push(waiter);
      const fail = () => {
        const idx = this.transportWaiters.indexOf(waiter);
        if (idx >= 0) this.transportWaiters.splice(idx, 1);
        clearTimeout(waiter.timer);
        if (signal) signal.removeEventListener("abort", fail);
        resolve(false);
      };
      waiter.timer = setTimeout(fail, boundMs);
      if (signal && !signal.aborted) signal.addEventListener("abort", fail, { once: true });
    });
  }

  /**
   * 标记一个前台长连接（AI/蓝图）开始。前台请求会等待已经在进行的
   * 后台传输完成；同一 DC 实例上的多个前台请求可以并行共享 muxer。
   *
   * 等待有界（transfer_gate_wait_timeout）：超过后宁可让前台与后台短暂
   * 重叠，也不能让前台 AI 流在后台闸门占住时永远得不到执行。
   */
  async acquireForegroundTransport(signal?: AbortSignal): Promise<() => void> {
    while (this.backgroundTransportCount > 0) {
      const idle = await this.waitForTransportIdle(
        transfer_gate_wait_timeout,
        signal,
      );
      if (!idle) {
        if (signal?.aborted) {
          throw new Error("acquireForegroundTransport cancelled");
        }
        console.warn("传输闸门等待后台释放超时，前台流提前开始");
        break;
      }
    }
    this.foregroundTransportCount += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.foregroundTransportCount = Math.max(
        0,
        this.foregroundTransportCount - 1,
      );
      this.notifyTransportWaiters();
    };
  }

  /**
   * 标记一个后台传输（ThreadDB/文件/区块/构建源码回推）开始。后台传输不会
   * 插队到前台 AI 流中，避免回推流的背压把 AI 的 gRPC 开流一起拖死。
   *
   * 等待有界（transfer_gate_wait_timeout）：前台 AI 流（/proxy 的
   * DoAIProxyCall）是分钟级长流，若它卡住/很长，后台拉取绝不能无限期等它。
   * 超时后强制开始，宁可短暂重叠，也不能让“拉取内容 / 源码回推”卡死。
   */
  async acquireBackgroundTransport(signal?: AbortSignal): Promise<() => void> {
    while (this.foregroundTransportCount > 0) {
      const idle = await this.waitForTransportIdle(
        transfer_gate_wait_timeout,
        signal,
      );
      if (!idle) {
        if (signal?.aborted) {
          throw new Error("acquireBackgroundTransport cancelled");
        }
        console.warn("传输闸门等待前台释放超时，后台传输提前开始");
        break;
      }
    }
    this.backgroundTransportCount += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.backgroundTransportCount = Math.max(
        0,
        this.backgroundTransportCount - 1,
      );
      this.notifyTransportWaiters();
    };
  }

  /** 有界地等待当前前台流结束，用于已创建的后台任务在真正开流前让路。 */
  async waitForForegroundTransport(signal?: AbortSignal): Promise<void> {
    while (this.foregroundTransportCount > 0) {
      const idle = await this.waitForTransportIdle(
        transfer_gate_wait_timeout,
        signal,
      );
      if (!idle) break;
    }
  }
  // 连接到所有文件存储节点
  _connectToObjNodes = async (
    cid: string,
    multiPeersFlag: boolean = true,
  ): Promise<[Multiaddr | null, string[] | null]> => {
    const peers = await this.dcChain.getObjNodes(cid);
    if (!peers) {
      return [null, null];
    }

    if (!multiPeersFlag) {
      let lastError: unknown;
      for (const peer of peers) {
        try {
          return [await this._connectPeers([peer]), peers];
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("Failed to connect to object nodes");
    }

    const res = await this._connectPeers(peers);
    return [res, peers];
  };



  connectToPeerWithAddr = async (
    peerAddr: string,
    options?: { forceReconnect?: boolean; timeout?: number },
  ): Promise<Multiaddr> => {
    // 直接使用传入的地址拨号，不走链上查询
    let addr: Multiaddr;
    try {
      addr = multiaddr(peerAddr);
    } catch (error) {
      throw new Error("peerAddr must be a valid multiaddr");
    }

    const peerIdStr = getPeerIdString(addr);
    if (!peerIdStr) {
      throw new Error("peerId not found in peerAddr");
    }

    if (!this.dcNodeClient?.libp2p) {
      throw new Error("dcNodeClient is not initialized");
    }

    const runningTask = this.peerConnectionTasks.get(peerIdStr);
    if (runningTask) {
      // 普通连接请求可以复用任何正在进行的连接操作；强制重连只可复用另一个
      // 强制重连。这样同一 peer 不会并发 ping、hangUp 或 dial。
      if (!options?.forceReconnect || runningTask.forceReconnect) {
        return runningTask.promise;
      }

      try {
        await runningTask.promise;
      } catch {
        // 无论前一个普通连接检查是否成功，当前强制重连仍需继续执行。
      }
      return this.connectToPeerWithAddr(peerAddr, options);
    }

    const task = this.connectToPeerWithAddrInternal(addr, peerIdStr, options);
    const taskState = {
      forceReconnect: options?.forceReconnect === true,
      promise: task,
    };
    this.peerConnectionTasks.set(peerIdStr, taskState);

    try {
      return await task;
    } finally {
      if (this.peerConnectionTasks.get(peerIdStr) === taskState) {
        this.peerConnectionTasks.delete(peerIdStr);
      }
    }
  };

  private connectToPeerWithAddrInternal = async (
    addr: Multiaddr,
    peerIdStr: string,
    options?: { forceReconnect?: boolean; timeout?: number },
  ): Promise<Multiaddr> => {
    const dialTimeout = options?.timeout ?? peer_dial_timeout;
    const libp2p = this.dcNodeClient!.libp2p;

    let peerId: any = null;
    try {
      peerId = peerIdFromString(peerIdStr);
    } catch (e) {
      peerId = null;
    }

    // 检查是否已经有可复用连接
    if (peerId) {
      const connections = libp2p.getConnections(peerId);
      const openConn = connections?.find((conn) => conn.status === "open");
      if (openConn) {
        if (options?.forceReconnect) {
          // 强制重连必须确认旧连接已关闭；否则 dial 可能直接复用同一条半死连接。
          await this.hangUpPeerConnection(libp2p, peerId, "forced reconnect");
        } else if (await this.isConnectionAlive(peerId)) {
          // 复用前做一次存活探测，剔除"状态 open 但实际不可用"的连接
          return openConn.remoteAddr;
        } else {
          await this.hangUpPeerConnection(libp2p, peerId, "stale connection");
        }
      }
    }

    const resCon = await libp2p.dial(addr, {
      signal: AbortSignal.timeout(dialTimeout),
    });
    if (!resCon) {
      throw new Error("dial peerAddr failed");
    }

    return addr;
  };

  private hangUpPeerConnection = async (
    libp2p: Libp2p,
    peerId: any,
    reason: string,
  ): Promise<void> => {
    const stillOpenConnections = () =>
      libp2p
        .getConnections(peerId)
        .filter((connection) => connection.status === "open");

    try {
      await libp2p.hangUp(peerId, {
        signal: AbortSignal.timeout(peer_close_timeout),
      });
    } catch (error) {
      if (stillOpenConnections().length > 0) {
        console.warn(
          `connectToPeerWithAddr: hangUp ${reason} failed, will abort forcefully`,
          error,
        );
      }
    }

    // hangUp 是优雅关闭，要等对端确认；连接半死时这一步必然超时。
    // 原实现在这里直接抛错，会让整个重连流程失败（表现为「AI 代理连接重建失败」），
    // 且旧连接仍留着，后续重试继续撞同一条死连接——正是"断线后再也连不上"的一环。
    // 优雅关闭失败就改用 abort：abort 是本地同步操作，不依赖对端响应。
    const lingering = stillOpenConnections();
    if (lingering.length > 0) {
      const abortError = new Error(
        `connectToPeerWithAddr: ${reason} forced abort`,
      );
      for (const connection of lingering) {
        try {
          connection.abort(abortError);
        } catch (abortErr) {
          console.warn(
            `connectToPeerWithAddr: abort ${reason} failed`,
            abortErr,
          );
        }
      }
    }

    if (stillOpenConnections().length > 0) {
      throw new Error(
        `connectToPeerWithAddr: ${reason} remained open after hangUp and abort`,
      );
    }
  };

  // 通过 libp2p ping 探测连接是否真正存活。
  // 同一 peer 的连接操作已由 peerConnectionTasks 合并；容量冲突可能来自 libp2p
  // 的其它保活任务，此时短暂等待后重试，不能把探测失败误判成连接健康。
  private isConnectionAlive = async (peerId: any): Promise<boolean> => {
    const pingService = (this.dcNodeClient?.libp2p as any)?.services?.ping;
    if (!pingService || typeof pingService.ping !== "function") {
      return true;
    }

    // ConnectionMonitor 已在周期性采样 rtt。它成功采到过 rtt 说明连接确实通，
    // 直接复用，避免再开一条竞争同一协议流槽的 ping。
    const monitored = (this.dcNodeClient?.libp2p as Libp2p | undefined)
      ?.getConnections(peerId)
      ?.some(
        (connection: any) =>
          connection.status === "open" &&
          typeof connection.rtt === "number" &&
          connection.rtt >= 0,
      );
    if (monitored) {
      return true;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const signal = AbortSignal.timeout(liveness_ping_timeout);
      try {
        await pingService.ping(peerId, { signal });
        return true;
      } catch (e) {
        if (signal.aborted) {
          // 探测超时，连接大概率已半死
          console.warn(
            "connectToPeerWithAddr: liveness ping timed out, will reconnect",
            e,
          );
          return false;
        }

        const message =
          e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        const pingStreamBusy =
          /TooManyOutboundProtocolStreams|Too many outbound protocol streams/i.test(
            message,
          );

        if (pingStreamBusy) {
          if (attempt < 2) {
            await new Promise((resolve) =>
              setTimeout(resolve, 150 * (attempt + 1)),
            );
            continue;
          }
          // 流槽被占满只说明探测不了，不能证明连接本身失效；
          // 误判成失效会触发不必要的 hangUp 重连，放大抖动。
          const stillOpen = (this.dcNodeClient?.libp2p as Libp2p | undefined)
            ?.getConnections(peerId)
            ?.some((connection: any) => connection.status === "open");
          console.warn(
            "connectToPeerWithAddr: liveness ping capacity stayed busy, fallback to connection status",
            e,
          );
          return Boolean(stillOpen);
        }

        // 明确不支持 ping 协议只表示无法探测，不代表底层连接失效。
        if (
          /unsupported\s+protocol|protocol[^\n]*(?:not\s+supported|unsupported)|protocol\s+selection\s+failed|multistream[^\n]*(?:not\s+supported|select)/i.test(
            message,
          )
        ) {
          return true;
        }

        // 其它快速失败（连接关闭、流状态错误、写入失败等）都不能证明连接健康。
        console.warn(
          "connectToPeerWithAddr: liveness ping failed, will reconnect",
          e,
        );
        return false;
      }
    }

    return false;
  };


  connectToPeer = async (peerId: string): Promise<Multiaddr> => {
    // 从 peerAddr 中提取 peerId；支持 multiaddr 或纯 peerId 字符串
    let peerIdStr: string | undefined;

    if (peerId.trim().startsWith("/")) {
      try {
        const addr = multiaddr(peerId);
        peerIdStr = getPeerIdString(addr);
      } catch (error) {
        peerIdStr = undefined;
      }
    }

    if (!peerIdStr) {
      peerIdStr = peerId.trim();
    }

    try {
      peerIdFromString(peerIdStr);
    } catch (error) {
      throw new Error("peerId not found in peerAddr");
    }

    return await this._connectPeers([peerIdStr]);
  };

  _connectPeers = (peerListJson: string[]): Promise<Multiaddr> => {
    return new Promise((reslove, reject) => {
      const _this = this;
      const len = peerListJson.length;

      if (len === 0) {
        reject(new Error("peer list is empty"));
        return;
      }

      let num = 0;

      async function dialNodeAddr(i: number) {
        if (!peerListJson[i]) {
          num++;
          if (num >= len) {
            reject(new Error("peer list contains no valid peer"));
          }
          return;
        }

        // 检查是否已经连接
        try {
          const peerId = peerIdFromString(peerListJson[i]);
          const connections = _this.dcNodeClient?.libp2p.getConnections(peerId);
          if (connections && connections.length > 0) {
            if (connections[0].status === "open") {
              reslove(connections[0].remoteAddr);
              return;
            }
          }
        } catch (e) {
        }

        const [nodeAddr, _] = await _this.dcChain.getDcNodeWebrtcDirectAddr(
          peerListJson[i],
        );
        if (!nodeAddr) {
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
          // 如果出现 TooManyOutboundProtocolStreamsError，说明可能已经存在连接流，再次检查连接状态
          if (
            error &&
            typeof error === "object" &&
            "message" in error &&
            ((error as any).message.includes(
              "TooManyOutboundProtocolStreamsError",
            ) ||
              (error as any).message.includes("The operation was aborted"))
          ) {
            try {
              const peerId = peerIdFromString(peerListJson[i]);
              const connections =
                _this.dcNodeClient?.libp2p.getConnections(peerId);
              if (
                connections &&
                connections.length > 0 &&
                connections[0].status === "open"
              ) {
                reslove(connections[0].remoteAddr);
                return;
              }
            } catch (e) {
              console.warn("check connection error in catch", e);
            }
          }

          if (error && typeof error === "object" && "message" in error) {
            num++;
            if (num >= len) {
              console.warn(
                "dial nodeAddr error,error:%s",
                (error as any).message,
              );
              reject((error as any).message);
            }
          } else {
            num++;
            if (num >= len) {
              console.warn("dial nodeAddr error,error:", error);
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

  connectToUserDcPeerCandidates = async (
    account: Uint8Array,
    excludedPeerId?: string,
  ): Promise<Client[]> => {
    const peerAddrs = await this.dcChain.getAccountPeers(account);
    if (!peerAddrs || peerAddrs.length === 0 || !this.dcNodeClient?.libp2p) {
      return [];
    }

    const candidates = excludedPeerId
      ? peerAddrs.filter((peerId) => peerId !== excludedPeerId)
      : peerAddrs;
    const clients: Client[] = [];
    for (const peerId of candidates) {
      try {
        const nodeAddr = await this._connectPeers([peerId]);
        clients.push(
          new Client(
            this.dcNodeClient.libp2p,
            this.dcNodeClient.blockstore,
            nodeAddr,
            dc_protocol,
          ),
        );
      } catch (error) {
        console.warn("connectToUserDcPeerCandidates error", error);
      }
    }
    return clients;
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
          console.warn("connectToUserAllDcPeers error", error);
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
        webRTCDirect({ rtcConfiguration }),
        circuitRelayTransport(),
        webRTC({ rtcConfiguration }),
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

      // 心跳只用于采样 rtt，不允许它 abort 连接。默认行为是 ping 一旦超时
      // （AdaptiveTimeout 下限仅 5s）就 conn.abort()，会把同一条连接上正在
      // 传输的 AI 流和 block 流全部以 "TimeoutError: signal timed out" 中止。
      // 大块传输造成的队头阻塞很容易触发，是级联断线的直接原因。
      connectionMonitor: {
        abortConnectionOnPingFailure: false,
        pingInterval: connection_monitor_ping_interval,
        pingTimeout: {
          minTimeout: connection_monitor_min_timeout,
          maxTimeout: connection_monitor_max_timeout,
        },
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
        // 应用同时包含构建、AI 与文件传输。保留有限并发余量，并由上层按
        // peer 合并主动存活探测，避免默认 1 条流导致 2/1 容量冲突。
        // ConnectionMonitor 会对每条连接周期性开同一个 ping 协议的流，和上层
        // isConnectionAlive 抢流槽；4 条上限太容易触发
        // TooManyOutboundProtocolStreams，故放宽。
        ping: ping({ maxOutboundStreams: 32, maxInboundStreams: 32 }),
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
      console.warn("no node address found for peer: ", peerId);
      return;
    }
    // if (isName(nodeAddr)) {
    //   const addrs = await nodeAddr.resolve();
    //   nodeAddr = addrs[0] ? addrs[0] : null;
    // }
    return nodeAddr ? nodeAddr : undefined;
  };

  getDefaultDcNodeAddr = async (
    excludedPeerId?: string,
  ): Promise<Multiaddr | undefined> => {
    const peerId = await this._getConnectedPeerId();
    if (peerId && peerId !== excludedPeerId) {
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
      this.defaultPeerId = undefined;
      localStorage.removeItem("defaultPeerId");
    }
    if (peerId === excludedPeerId) {
      this.defaultPeerId = undefined;
      localStorage.removeItem("defaultPeerId");
    }
    // 获取节点上的默认节点列表，随机获取几个，批量连接节点，得到最快的节点
    const allNodeList = await this.dcChain.getDcNodeList();
    if (!allNodeList) {
      return;
    }
    const candidateNodeList = excludedPeerId
      ? allNodeList.filter((node) => node.split(",")[0] !== excludedPeerId)
      : allNodeList;
    if (candidateNodeList.length === 0) {
      return;
    }
    // 连接节点，得到最快的节点（随机取几个连接取最快，如果都没有连接上继续随机取）
    const nodeAddr = await this._getConnectDcNodeList(candidateNodeList);
    if (!nodeAddr) {
      console.warn("no node connected");
      return;
    }

    // 保存默认节点
    const defaultPeerId = getPeerIdString(nodeAddr);
    if (defaultPeerId) {
      this.defaultPeerId = defaultPeerId.toString();
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
  // signal：上层任务（如一次构建）结束后用它主动收流，见 TRANSFER_CANCELLED_MESSAGE。
  async createTransferStream(
    libp2p: Libp2p,
    blockstore: Blocks,
    nodeAddr: Multiaddr,
    type: number,
    oid: string,
    options?: { signal?: AbortSignal },
  ): Promise<void> {
    const signal = options?.signal;
    if (signal?.aborted) return;
    // 文件/区块上报属于后台传输。统一登记到闸门，保证它不会在 AI/蓝图
    // 长流占用账号节点时再打开新的 muxer 流。排队等闸门期间若上层已
    // 取消（signal aborted），则让 gate 提前放弃，避免 cancel 卡在排队上。
    try {
      const releaseTransport = await this.acquireBackgroundTransport(signal);
      try {
        // 排队等闸门期间上层可能已经结束，此时不必再开流。
        if (signal?.aborted) return;
        await this.createTransferStreamInternal(
          libp2p,
          blockstore,
          nodeAddr,
          type,
          oid,
          signal,
        );
      } finally {
        releaseTransport();
      }
    } catch (error) {
      if (signal?.aborted) return; // 排队期间被上层取消，静默结束。
      throw error;
    }
  }

  private async createTransferStreamInternal(
    libp2p: Libp2p,
    blockstore: Blocks,
    nodeAddr: Multiaddr,
    type: number,
    oid: string,
    signal?: AbortSignal,
  ): Promise<void> {
    let nodeConn: any;
    const peerIdStr = getPeerIdString(nodeAddr);
    if (peerIdStr) {
      try {
        const peerId = peerIdFromString(peerIdStr);
        const connections = libp2p.getConnections(peerId);
        if (connections && connections.length > 0) {
          const openConn = connections.find((conn) => conn.status === "open");
          if (openConn) {
            nodeConn = openConn;
          }
        }
      } catch (err) {
        console.warn("createTransferStream: getConnections failed", err);
      }
    }

    if (!nodeConn) {
      nodeConn = await withTransferCancel(
        libp2p.dial(nodeAddr, {
          signal: AbortSignal.timeout(dial_timeout),
        }),
        signal,
      );
    }
    const stream = await withTransferCancel<Stream>(
      nodeConn.newStream("/dc/transfer/1.0.0", {
        signal: AbortSignal.timeout(transfer_stream_open_timeout),
      }),
      signal,
    );
    let closePromise: Promise<void> | undefined;
    const closeOnce = (abortReason?: unknown): Promise<void> => {
      if (!closePromise) {
        closePromise = closeTransferStream(stream, abortReason);
      }
      return closePromise;
    };

    // 使用新版 Stream 接口: stream.send / stream.close
    const streamSink = async (source: AsyncIterable<Uint8Array>) => {
      try {
        for await (const chunk of source) {
          const data =
            chunk instanceof Uint8Array ? chunk : (chunk as any).subarray();
          if (!stream.send(data)) {
            await waitForTransferDrain(stream);
          }
        }
      } catch (err) {
        if (
          (err as Error).message !== "Stream closed" &&
          (err as Error).message !== "Stream aborted"
        ) {
          console.warn("Stream sink error:", err);
        }
        stream.abort(err as Error);
        throw err;
      } finally {
        await closeOnce();
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
      const IDLE_TIMEOUT = transfer_stream_idle_timeout;

      while (true) {
        if (signal?.aborted) {
          throw createTransferCancelledError();
        }
        let iteratorResult: IteratorResult<Uint8Array>;
        if (waitingForFirstChunk) {
          const firstChunkTimeoutMessage =
            `Transfer stream: First chunk timed out after ${transfer_stream_first_chunk_timeout / 1000}s`;
          try {
            iteratorResult = await withTransferCancel(
              withTransferTimeout(
                chunkIterable.next(),
                transfer_stream_first_chunk_timeout,
                firstChunkTimeoutMessage,
              ),
              signal,
            );
          } catch (err) {
            if ((err as Error).message === firstChunkTimeoutMessage) {
              console.warn(firstChunkTimeoutMessage);
              break;
            }
            throw err;
          }
          waitingForFirstChunk = false;
        } else {
          try {
            iteratorResult = await withTransferCancel(
              withTransferTimeout(
                chunkIterable.next(),
                IDLE_TIMEOUT,
                `Read timeout after ${transfer_stream_idle_timeout / 1000}s`,
              ),
              signal,
            );
          } catch (err) {
            if (
              (err as Error).message ===
              `Read timeout after ${transfer_stream_idle_timeout / 1000}s`
            ) {
              console.warn(
                `Stream read timeout after ${transfer_stream_idle_timeout / 1000}s idle`,
              );
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

              await withTransferCancel(
                withTransferTimeout(
                  writer.write(replyData),
                  transfer_stream_write_timeout,
                  "Write timeout",
                ),
                signal,
              );
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

                await withTransferCancel(
                  withTransferTimeout(
                    writer.write(responseData),
                    transfer_stream_write_timeout,
                    "Write timeout",
                  ),
                  signal,
                );
                blocksSent++;
                bytesSent += responseData.length;
              } catch (error) {
                if (!isTransferCancelledError(error)) {
                  console.warn("Error retrieving/sending block:", error);
                }
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
      // 上层主动收流是预期路径：把它当传输故障打日志，只会在控制台留下
      // 一串与真实故障无法区分的 Write timeout / Blocks sent: 0。
      if (isTransferCancelledError(err)) {
        return;
      }
      console.warn(
        "Transfer stream error:",
        err,
        `- Blocks sent: ${blocksSent}, Bytes sent: ${(bytesSent / 1024 / 1024).toFixed(2)}MB`,
      );
      throw err;
    } finally {
      await closeOnce();
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
        const res: Uint8Array =
          value instanceof Uint8ArrayList
            ? value.subarray()
            : (value as Uint8Array);
        yield res;
      } catch (err) {
        console.warn("Stream chunk error:", err);
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
