import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";

export class BCClient {
  client: Client;

  constructor(dcClient: Client, peerAddr?: Multiaddr) {
    this.client = dcClient;
  }


}
