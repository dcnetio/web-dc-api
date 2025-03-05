import type { Client } from "../dcapi";

export class AccountClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }
}
