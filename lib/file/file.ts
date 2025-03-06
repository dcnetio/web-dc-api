import type { Multiaddr } from "@multiformats/multiaddr";
import { DCConnectInfo } from "../types/types";
import { FileClient } from "./client";
// 错误定义
export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new FileError("no dc peer connected"),
  ErrNoFileChose: new FileError("no file choose"),
};

export class FileManager {
  public connectedDc: DCConnectInfo = {};
  constructor(connectedDc: DCConnectInfo) {
    this.connectedDc = connectedDc;
  }

  // 上传文件
  async addFile(
    path: string,
    peerAddr?: Multiaddr
  ): Promise<[{ cid: string; decryptKey: string } | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if(!path) {
      return [null, Errors.ErrNoFileChose];
    }
    const fileClient = new FileClient(this.connectedDc.client);
    const [cid, decryptKey, err2] = await fileClient.addFile(
      path,
    )
    if (err2) {
      return [null, err2];
    }
    return [{ cid, decryptKey }, null];
  }

  // 下载文件
  

}
