import config from "../../config.json";
import configPro from "../../config.prod.json";
const isDev =
  typeof globalThis !== "undefined" ? (globalThis as any).isDev : false;
const configInfo = isDev ? config : configPro;

const _walletOpenType =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenType : ""; // 用于判断是否是直接打开;

const _walletIframeOpenFlag =
  typeof globalThis !== "undefined" &&
  typeof (globalThis as any).walletIframeOpenFlag !== "undefined"
    ? (globalThis as any).walletIframeOpenFlag
    : true; // 是否需要打开/iframe，默认打开iframe;
const walletOpenOrigin =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenOrigin : ""; // 用户传入的打开钱包的源;
const walletOpenVersion =
  typeof globalThis !== "undefined"
    ? (globalThis as any).walletOpenVersion
    : ""; // 钱包版本号;

let _baseUrl = configInfo.baseUrl;
let _walletOrigin = configInfo.walletOrigin;
if (!isDev) {
  if (walletOpenOrigin) {
    _walletOrigin = walletOpenOrigin;
  }
  if (walletOpenVersion) {
    _baseUrl =
      walletOpenVersion && walletOpenVersion.startsWith("/")
        ? walletOpenVersion
        : "/" + walletOpenVersion;
  }
}
export const walletOpenType = _walletOpenType;
export const walletIframeOpenFlag = _walletIframeOpenFlag;
export const walletOrigin = _walletOrigin;
export const walletUrl = _walletOrigin + _baseUrl; // 钱包地址后面统一改成origin+version
export const walletWindowName = "walletWindow"; // 窗口名称
export const dc_protocol = "/dc/thread/0.0.1";
export const dial_timeout = 1000;
export const keyExpire = 60 * 60 * 24; // setcachekey 过期时间默认一天
export const OffChainOpTimes = 20000; // 链下操作次数
export const OffChainSpaceLimit = 1024 * 1024 * 10; // 评论空间下限10m
export const OffChainOpTimesLimit = 1000; // 链下操作次数下限
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
