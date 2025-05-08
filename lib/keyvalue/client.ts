import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Errors } from "lib/error";
import { SignHandler } from "lib/types/types";

export class KeyValueClient {
  client: Client;
  signHandler: SignHandler;

  constructor(dcClient: Client, signHandler: SignHandler) {
    this.client = dcClient;
    this.signHandler = signHandler;
  }

  async configThemeObjAuth(
    themeValue: Uint8Array,
    appIdValue: Uint8Array,
    themeAuthorValue: Uint8Array,
    blockHeight: number,
    userPubkeyStr: string,
    contentCidValue: Uint8Array,
    content: string,
    contentSize: number,
    type: number,
    signature: Uint8Array,
  ) {
    const message = new dcnet.pb.ConfigThemeObjAuthRequest({});
    message.appId = appIdValue
    message.themeAuthor = themeAuthorValue
    message.blockheight = blockHeight;
    message.content = new TextEncoder().encode(content);
    message.contentCid = contentCidValue
    message.contentSize = contentSize
    message.signature = signature;
    message.theme = themeValue;
    message.type = type;
    message.userPubkey = new TextEncoder().encode(userPubkeyStr);
    const messageBytes = dcnet.pb.ConfigThemeObjAuthRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/ConfigThemeObjAuth",
        messageBytes,
        30000
      );
      console.log("ConfigThemeObjAuth reply", reply);
      const decoded = dcnet.pb.ConfigThemeObjAuthReply.decode(reply);
      console.log("ConfigThemeObjAuth decoded", decoded);
      return decoded.flag;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.signHandler.getPublicKey().string(),
          (payload: Uint8Array): Uint8Array => {
            return this.signHandler.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/ConfigThemeObjAuth",
          messageBytes,
          30000
        );
        console.log("ConfigThemeObjAuth reply", reply);
        const decoded = dcnet.pb.GetUserCommentsReply.decode(reply);
        console.log("ConfigThemeObjAuth decoded", decoded);
        return decoded.flag;
      }
      console.error("ConfigThemeObjAuth error:", error);
      throw error;
    }
  }

}
