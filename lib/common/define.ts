import config from "../../config.json";
import configPro from "../../config.prod.json";
const _isDev =
  typeof globalThis !== "undefined" ? (globalThis as any).isDev : false;
const configInfo = _isDev ? config : configPro;

const _walletOpenType =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenType : ""; // 用于判断是否是直接打开;

// 判断是否iframe打开钱包
const _isIframeOpen = (): boolean => {
  if (_walletOpenType == "iframe") {
    return true;
  }
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("micromessenger") !== -1;
  // todo 临时测试
  // return true
};
const _walletIframeOpenFlag =
  typeof globalThis !== "undefined" &&
  typeof (globalThis as any).walletIframeOpenFlag !== "undefined"
    ? (globalThis as any).walletIframeOpenFlag
    : true; // 是否需要打开/iframe，默认打开iframe;
const _walletOpenOrigin =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenOrigin : ""; // 用户传入的打开钱包的源;
const _walletOpenVersion =
  typeof globalThis !== "undefined"
    ? (globalThis as any).walletOpenVersion
    : ""; // 钱包版本号;
const _shouldReturnUserInfo = !!(
  typeof globalThis !== "undefined" &&
  typeof (globalThis as any).shouldReturnUserInfo !== "undefined"
); // 用于判断需要返回用户信息;

let _baseUrl = configInfo.baseUrl;
let _walletOrigin = configInfo.walletOrigin;
if (_walletOpenOrigin) {
  _walletOrigin = _walletOpenOrigin;
}
if (_walletOpenVersion) {
  _baseUrl =
    _walletOpenVersion && _walletOpenVersion.startsWith("/")
      ? _walletOpenVersion
      : "/" + _walletOpenVersion;
}
export const isIframeOpen = _isIframeOpen;
export const walletIframeOpenFlag = _walletIframeOpenFlag;
export const walletOrigin = _walletOrigin;
export const walletUrl = _walletOrigin + _baseUrl; // 钱包地址后面统一改成origin+version
export const shouldReturnUserInfo = _shouldReturnUserInfo;
export const walletWindowName = "walletWindow"; // 窗口名称
export const dc_protocol = "/dc/thread/0.0.1";
export const dial_timeout = 3000;
// 直连指定节点（如编译服务器，走 WSS + TLS 握手）的拨号超时，
// 比链上并行拨号的 dial_timeout 更宽松，避免弱网下握手未完成就超时。
export const peer_dial_timeout = 10000;
// WebRTC ICE 服务器。默认的 @libp2p/webrtc 内置 STUN（stun.l.google.com、
// global.stun.twilio.com 等）在国内网络基本不可达，ICE 收集会一直卡住，
// 表现为入站取 block 的 DataChannel "Blocks sent: 0" 写超时。
// 这里显式覆盖为国内可达的 STUN，可通过 config.json 的 iceServers 追加 TURN。
const _defaultStunUrls = [
  "stun:stun.miwifi.com:3478",
  "stun:stun.qq.com:3478",
  "stun:turn.cloudflare.com:3478",
  "stun:stun.l.google.com:19302",
];
export const iceServers: RTCIceServer[] =
  (configInfo as any).iceServers?.length > 0
    ? (configInfo as any).iceServers
    : [{ urls: _defaultStunUrls }];
export const rtcConfiguration: RTCConfiguration = {
  iceServers,
  iceCandidatePoolSize: 4,
};
// 连接心跳。libp2p 的 ConnectionMonitor 默认 abortConnectionOnPingFailure=true，
// 一次 ping 超时就会 conn.abort() 掉整条连接上的所有流（AI 流、block 流一起死）。
// 应用内本来就有按 peer 的存活探测，这里只保留 rtt 采样，不再授权它杀连接。
export const connection_monitor_ping_interval = 30000;
// 主动存活探测的超时。原值 3s，在大块传输造成队头阻塞时会把健康连接误判成
// 半死，进而 hangUp 重连，反而放大抖动。
export const liveness_ping_timeout = 10000;
export const connection_monitor_min_timeout = 20000;
export const connection_monitor_max_timeout = 60000;
// 公网发布环境的对象传输首包/写入时间不能沿用本地节点的 10 秒阈值。
// 节点重连、TLS/Relay 建链和浏览器后台限速都会让首个可写窗口超过 10 秒；
// 过早中止会进一步触发 gRPC 连接驱逐，形成连续的 Write timeout/newStream failed。
export const transfer_stream_open_timeout = 30000;
export const transfer_stream_first_chunk_timeout = 30000;
export const transfer_stream_idle_timeout = 60000;
export const transfer_stream_write_timeout = 30000;
// 关闭半开传输流时也必须有界；否则一次写入超时会把 muxer 流槽长期占住，
// 后续 gRPC newStream 会在同一条连接上持续排队并最终 signal timed out。
export const transfer_stream_close_timeout = 5000;
// 传输闸门排队等待另一方向释放的最长时限。超过后不再死等，宁可让后台
// 拉取/回推与前台 AI 长流短暂重叠，也不能让“拉取内容”无限期卡住。
// 前台 AI 流（/proxy 的 DoAIProxyCall）是分钟级长流，若它卡住/很长，
// 后台 ThreadDB 拉取和构建源码回推会永远等不到 foreground 计数归零。
export const transfer_gate_wait_timeout = 15000;
export const keyExpire = 60 * 60 * 24; // setcachekey 过期时间默认一天
export const OffChainOpTimes = 20000; // 链下操作次数
export const OffChainSpaceLimit = 1024 * 1024 * 10; // 评论空间下限10m
export const OffChainOpTimesLimit = 1000; // 链下操作次数下限
export const payProtocol = configInfo.payProtocol || "/dc/pay/1.0.0"; // 支付协议
export enum Direction {
  Forward = 0,
  Reverse = 1,
}
export enum CommentType {
  /** 普通评论 */
  Comment = 0,

  /** 赞 */
  Up = 1,

  /** 踩 */
  Down = 2,

  /** 推荐或转发 */
  Transfer = 3,

  /** keyvalue形式的数据 */
  KeyValue = 4,
}
