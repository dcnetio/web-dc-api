
let _baseUrl = '';
let _walletOrigin = 'http://localhost:3000'
// todo 发布需要注释
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
  _baseUrl ='/v0_0_8'
  _walletOrigin = 'https://wallet.dcnetio.com'
}
export const walletOrigin = _walletOrigin;
export const  walletUrl = _walletOrigin + _baseUrl; // 钱包地址后面统一改成origin+version
export const walletWindowName = "walletWindow"; // 窗口名称
export const dc_protocol = "/dc/thread/0.0.1";
export const dial_timeout = 1000;
export const keyExpire = 60 * 60 * 24; // setcachekey 过期时间默认一天
export const OffChainOpTimes = 2000; // 链下操作次数
export const OffChainSpaceLimit = 1024 * 1024 * 10; // 评论空间下限10m
export const OffChainOpTimesLimit = 100; // 链下操作次数下限
export enum Direction {  
  Forward = 0,  
  Reverse = 1  
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
  KeyValue = 4
}