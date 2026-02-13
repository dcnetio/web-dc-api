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
