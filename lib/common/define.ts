// 只考虑浏览器环境
declare const __IS_PROD__: boolean | undefined;

let isProd = false;
// 打包后用 __IS_PROD__，源码直用时用 window.IS_PROD
if (typeof __IS_PROD__ !== "undefined") {
  isProd = __IS_PROD__;
} else if (
  typeof window !== "undefined" &&
  typeof (window as any).IS_PROD !== "undefined"
) {
  isProd = (window as any).IS_PROD;
}
const walletOpenType =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenType : ""; // 用于判断是否是直接打开;
const walletOpenOrgin =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenOrgin : ""; // 用户传入的打开钱包的源;
const walletOpenVersion =
  typeof globalThis !== "undefined" ? (globalThis as any).walletOpenVersion : ""; // 钱包版本号;


let _baseUrl = "";
let _walletOrigin = "";
if (true) {
    _baseUrl = "/v0_0_11";
    _walletOrigin = "https://wallet.dcnetio.com";
    if(walletOpenType === "iframe") {
      _walletOrigin = walletOpenOrgin || "https://wallet.dcnetio.com";
    }
    if(walletOpenVersion) {
      _baseUrl = walletOpenVersion && walletOpenVersion.startsWith("/") ? walletOpenVersion : "/" + walletOpenVersion;
    }
} else {
    _baseUrl = "";
    _walletOrigin = "http://localhost:3000";
}
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
