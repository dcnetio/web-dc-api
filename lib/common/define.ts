
let _baseUrl = '/v0_0_2'
let _walletOrigin = 'https://wallet.dcnetio.com'
// if (process.env.NODE_ENV === 'development') {
//   _baseUrl =''
//   _walletOrigin = 'http://localhost:3000'
// }
export const walletOrigin = _walletOrigin;
export const  walletUrl = _walletOrigin + _baseUrl; // 钱包地址后面统一改成origin+version
export const walletWindowName = "walletWindow"; // 窗口名称
export const dc_protocol = "/dc/thread/0.0.1";
export const dial_timeout = 2000;
export const keyExpire = 60 * 60 * 24; // setcachekey 过期时间默认一天
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