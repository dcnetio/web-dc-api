import { dcnet } from "../../lib/proto/dcnet_proto";

/**
 * 消息操作接口
 * 提供用户消息盒子的收发功能
 */
export interface IMessageOperations {
  /**
   * 发送消息到用户消息盒子
   * @param receiver 接收者的公钥或账号标识
   * @param msg 消息内容
   * @returns 发送结果，包含消息ID和时间戳
   */
  sendMsgToUserBox(receiver: string, msg: string): Promise<[number | null, Error | null]>;

  /**
   * 从用户消息盒子获取消息
   * @param limit 可选，限制返回消息的最大数量，默认由系统决定
   * @returns 消息列表，按时间顺序排列
   */
  getMsgFromUserBox(limit?: number): Promise<[dcnet.pb.IUserMsg[] | null, Error | null]>;
}