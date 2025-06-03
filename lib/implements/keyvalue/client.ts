import type { Multiaddr } from "@multiformats/multiaddr";
import type { Client } from "../../common/dcapi";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { dcnet } from "../../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Errors } from "../../common/error";
import { DCContext } from "../../../lib/interfaces/DCContext";

export class KeyValueClient {
  client: Client;
  context: DCContext;

  constructor(dcClient: Client, context: DCContext) {
    this.client = dcClient;
    this.context = context;
  }

  async configThemeObjAuth(
    theme: string,
    appId: string,
    themeAuthor: string,
    blockHeight: number,
    userPubkeyStr: string,
    contentCid: string,
    content: string,
    contentSize: number,
    type: number,
    signature: Uint8Array,
    vAccount?: string
  ): Promise<number> {
    const message = new dcnet.pb.ConfigThemeObjAuthRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.blockheight = blockHeight;
    message.content = new TextEncoder().encode(content);
    message.contentCid = new TextEncoder().encode(contentCid)
    message.contentSize = contentSize
    message.signature = signature;
    message.type = type;
    message.userPubkey = new TextEncoder().encode(userPubkeyStr);
    if(vAccount){
       message.vaccount = new TextEncoder().encode(vAccount)
     }
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
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
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

  async setKeyValue(
    theme: string,
    appId: string,
    themeAuthor: string,
    blockHeight: number,
    userPubkeyStr: string,
    contentCid: string,
    content: string,
    contentSize: number,
    type: number,
    signature: Uint8Array,
    vaccount?: string,
  ): Promise<number> {
    const message = new dcnet.pb.SetKeyValueRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.blockheight = blockHeight;
    message.content = new TextEncoder().encode(content);
    message.contentCid = new TextEncoder().encode(contentCid)
    message.contentSize = contentSize
    message.signature = signature;
    message.type = type;
    message.userPubkey = new TextEncoder().encode(userPubkeyStr);
    if(vaccount){
       message.vaccount = new TextEncoder().encode(vaccount)
     }
    const messageBytes = dcnet.pb.SetKeyValueRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/SetKeyValue",
        messageBytes,
        30000
      );
      console.log("SetKeyValue reply", reply);
      const decoded = dcnet.pb.SetKeyValueReply.decode(reply);
      console.log("SetKeyValue decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/SetKeyValue",
          messageBytes,
          30000
        );
        console.log("SetKeyValue reply", reply);
        const decoded = dcnet.pb.GetUserCommentsReply.decode(reply);
        console.log("SetKeyValue decoded", decoded);
        return decoded.flag;
      }
      console.error("SetKeyValue error:", error);
      throw error;
    }
  }

  async getValueWithKey(
    theme: string,
    appId: string,
    themeAuthor: string,
    userPubkey: string,
    key: string,
    vaccount?: string,
  ): Promise<Uint8Array|null> {
    const message = new dcnet.pb.GetValueWithKeyRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.UserPubkey = new TextEncoder().encode(userPubkey)
    message.Key = new TextEncoder().encode(key);
    if(vaccount){
       message.vaccount = new TextEncoder().encode(vaccount)
     }
    const messageBytes = dcnet.pb.GetValueWithKeyRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetValueWithKey",
        messageBytes,
        30000
      );
      console.log("GetValueWithKey reply", reply);
      const decoded = dcnet.pb.GetValueWithKeyReply.decode(reply);
      console.log("GetValueWithKey decoded", decoded);
      if(decoded.flag == 0) {
        return decoded.value;
      }
      return null;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetValueWithKey",
          messageBytes,
          30000
        );
        console.log("GetValueWithKey reply", reply);
        const decoded = dcnet.pb.GetValueWithKeyReply.decode(reply);
        console.log("GetValueWithKey decoded", decoded);
        if(decoded.flag == 0) {
          return decoded.value;
        }
        return null;
      }
      console.error("GetValueWithKey error:", error);
      throw error;
    }
  }

  async getValuesWithKeys(
    theme: string,
    appId: string,
    themeAuthor: string,
    userPubkey: string,
    keys: string,
    vaccount?: string,
  ): Promise<Uint8Array|null> {
    const message = new dcnet.pb.GetValuesWithKeysRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.UserPubkey = new TextEncoder().encode(userPubkey);
    message.Keys = new TextEncoder().encode(keys);
    if(vaccount){
       message.vaccount = new TextEncoder().encode(vaccount)
     }
    const messageBytes = dcnet.pb.GetValuesWithKeysRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetValuesWithKeys",
        messageBytes,
        30000
      );
      console.log("GetValuesWithKeys reply", reply);
      const decoded = dcnet.pb.GetValuesWithKeysReply.decode(reply);
      console.log("GetValuesWithKeys decoded", decoded);
      if(decoded.flag == 0) {
        return decoded.keyValues;
      }
      return null;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetValuesWithKeys",
          messageBytes,
          30000
        );
        console.log("GetValuesWithKeys reply", reply);
        const decoded = dcnet.pb.GetValuesWithKeysReply.decode(reply);
        console.log("GetValuesWithKeys decoded", decoded);
        if(decoded.flag == 0) {
          return decoded.keyValues;
        }
        return null;
      }
      console.error("GetValuesWithKeys error:", error);
      throw error;
    }
  }

   async getValuesWithIndex(
    appId: string,
    themeAuthor: string,
    theme: string,
    indexKey:string,
    indexValue:string,
    seekKey:string, 
    offset: number,
    limit: number,
    vaccount?: string
  ): Promise<Uint8Array|null> {
    const message = new dcnet.pb.GetValuesWithIndexRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.indexKey = new TextEncoder().encode(indexKey);
    message.indexValue = new TextEncoder().encode(indexValue);
    message.seekKey = new TextEncoder().encode(seekKey);
    message.offset = offset;
    message.limit = limit;
    if(vaccount){
      message.vaccount = new TextEncoder().encode(vaccount)
    }
    const messageBytes = dcnet.pb.GetValuesWithIndexRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetValuesWithIndex",
        messageBytes,
        30000
      );
      console.log("getValuesWithIndex reply", reply);
      const decoded = dcnet.pb.GetValuesWithIndexReply.decode(reply);
      console.log("getValuesWithIndex decoded", decoded);
      if(decoded.flag == 0) {
        return decoded.keyValues;
      }
      return null;
    } catch (error:any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetValuesWithIndex",
          messageBytes,
          30000
        );
        console.log("GetValuesWithIndex reply", reply);
        const decoded = dcnet.pb.GetValuesWithIndexReply.decode(reply);
        console.log("GetValuesWithIndex decoded", decoded);
        if(decoded.flag == 0) {
          return decoded.keyValues;
        }
        return null;
      }
      console.error("GetValuesWithIndex error:", error);
      throw error;
    }
  }

}
