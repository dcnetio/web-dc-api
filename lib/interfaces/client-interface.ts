/**
 * client接口
 */
export interface IClientOperations {
  getHostID(): Promise<[{ peerID: string; reqAddr: string } | null, Error | null]>;
}