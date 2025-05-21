import type { Multiaddr } from "@multiformats/multiaddr";
import { DCClient } from "./client";
import { DCConnectInfo } from "../../types/types";
// 错误定义
export class DCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DCError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new DCError("no dc peer connected"),
};

export class DCManager {
  public connectedDc: DCConnectInfo = {};
  constructor(connectedDc: DCConnectInfo) {
    this.connectedDc = connectedDc;
  }

  async getHostID(
    peerAddr?: Multiaddr
  ): Promise<[{ peerID: string; reqAddr: string } | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const dcClient = new DCClient(
      this.connectedDc.client,
    );
    const reply = await dcClient.getHostID(peerAddr);
    return [reply, null];
  }
}
