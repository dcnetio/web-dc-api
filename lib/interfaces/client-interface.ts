/**
 * client接口
 */
export interface IClientOperations {
  /**
   * 获取链接DC节点的hostID以及本机的公网地址
   * 
   * @returns peerID表示DC节点的hostID,reqAddr表示本机的公网地址
   */
  getHostID(): Promise<[{ peerID: string; reqAddr: string } | null, Error | null]>;
}