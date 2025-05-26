import type { Multiaddr } from "@multiformats/multiaddr";
import { KeyValueClient } from "./client";
import { DCConnectInfo, ThemeAuthInfo, ThemeComment } from "../../common/types/types";
import { OpenFlag } from "../../common/constants";
import { CommentManager } from "../comment/manager";
import { HeliaLibp2p } from "helia";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { base32 } from "multiformats/bases/base32";
import { Client } from "../../common/dcapi";
import { CommentType, Direction } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";

//定义Key-Value存储的数据类型
export enum KeyValueStoreType { //存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权)
  Auth = 1,
  Public = 2
}
// 错误定义
export class KeyValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KeyValueError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new KeyValueError("no dc peer connected"),
};

export class KeyValueManager {
  private dc: DcUtil;
  private connectedDc: DCConnectInfo = {};
  private accountBackupDc: DCConnectInfo = {};
  private dcNodeClient: HeliaLibp2p;
  private chainUtil: ChainUtil;
  private context: DCContext;
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    accountBackupDc: DCConnectInfo,
    dcNodeClient: HeliaLibp2p,
    chainUtil: ChainUtil,
    context: DCContext
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc;
    this.accountBackupDc = accountBackupDc;
    this.dcNodeClient = dcNodeClient;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  // 创建Key-Value存储
  async createStore(
    appId: string,
    theme: string,
    space: number,
    type: KeyValueStoreType, 
  ): Promise<[number, Error | null]> {
    // Default group to "DCAPP" if empty
    if (appId === "") {
      appId = "DCAPP";
    }

    // Set minimum space (1GB)
    if (space < 1 << 30) {
      space = 1 << 30;
    }
    // Theme must start with "keyvalue_"
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    // NOTE: There seems to be a logical error in the original code:
    // It checks if theme ends with "_pub" and returns an error if it does,
    // but the error message suggests it should end with "_pub".
    // I'm assuming the condition should check if it doesn't end with "_pub"
    if (type === KeyValueStoreType.Public) {
      // Public theme must end with "_pub"
      if (!theme.endsWith("_pub")) {
        return [
          -1,
          new Error(
            "vaCreateStoreTheme failed, public theme must end with '_pub'"
          ),
        ];
      }
    }

    try {
      // Assuming AddThemeObjDeal is implemented elsewhere
      const commentManager = new CommentManager(this.context);
      const res = await commentManager.addThemeObj(
        appId,
        theme,
        OpenFlag.AUTH,
        space || 50 * 1024 * 1024 // 50M
      );
      return res;
    } catch (error) {
      return [null, error as Error];
    }
  }


  async configAuth(
    appId: string,
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }
    
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let client = this.connectedDc.client;
    if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
     
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if(client.token == ""){
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.edPubkeyFromStr(themeAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey;
    try {
      forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
    } catch (error) {
      pubkeyFlag = false;
    }
    let forPubkeyHex: string;
    if (pubkeyFlag) {
      forPubkeyHex = forPubkey.string();
    } else {
      forPubkeyHex = authPubkey;
    }

    const content = `${forPubkeyHex}:${permission}:${remark}`;

    // Generate contentCid (sha256 of content)
    const commentUint8 = new TextEncoder().encode(content);
    const contentHash = await sha256(commentUint8);
    const contentCid = base32.encode(contentHash);

    // Get blockchain height
    let blockHeight: number;
    try {
      blockHeight = await this.chainUtil.getBlockHeight();
    } catch (error) {
      return [null, new Error("ErrGetBlockHeightFail")];
    }

    const contentSize = commentUint8.length;

    // Create binary representation of blockHeight (little endian)
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    // Create binary representation of type (little endian)
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.Comment
    );
    // sign(Theme+appId+objAuthor+blockheight+contentCid)
    const themeValue: Uint8Array = new TextEncoder().encode(theme);
    const appIdValue: Uint8Array = new TextEncoder().encode(appId);
    const themeAuthorValue: Uint8Array = new TextEncoder().encode(
      themeAuthorPubkey.string()
    );
    const contentCidValue: Uint8Array = new TextEncoder().encode(contentCid);
    let preSign = new Uint8Array([
      ...themeValue,
      ...appIdValue,
      ...themeAuthorValue,
      ...hValue,
      ...contentCidValue,
      ...typeValue,
    ]);

    const signature = await this.context.sign(preSign);

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.configThemeObjAuth(
        theme,
        appId,
        themeAuthor,
        blockHeight,
        userPubkeyStr,
        contentCid,
        content,
        contentSize,
        CommentType.Comment,
        signature,
        vaccount
      );

      if (res !== 0) {
        return [res, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
      }else {
        return [0, null];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async getAuthList(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> {
     if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }
    let seekKey: string = "";
    let originAuthList: ThemeComment[] = [];
    let authList: ThemeAuthInfo[] = [];
    try {
      while (true) {
        const commentManager = new CommentManager(this.context);
        const res = await commentManager.getThemeComments(
          appId,
          theme,
          themeAuthor,
          0,
          Direction.Forward,
          0,
          1000,
          seekKey || "",
          vaccount
        );
        if (res[0] && res[0].length == 0) {
          return [authList,originAuthList, null];
        }
        
        const resList = res[0];
        for (let i = 0; i < resList.length; i++) {
            originAuthList.push(resList[i]);
            const content = resList[i].comment
            const parts = content.split(":");
            if (parts.length < 2) {
              continue;
            }
            const authPubkey = parts[0];
            const permission = parseInt(parts[1]);
            const remark = content.substring(parts[0].length + 2);
            authList.push({
            pubkey: authPubkey,
            permission: permission,
            remark: remark,
          });
        }
        if (resList.length < 1000) {
          break;
        }
        seekKey = `${resList[resList.length - 1].blockheight}/${
          resList[resList.length - 1].commentCid
        }`;
      }
    } catch (error) {
      return [authList,originAuthList, error];
    }
    return [authList,originAuthList, null];
  }

  async setKeyValue(
    appId: string,
    themeAuthor: string,
    theme: string,
    key: string,
    value: string,
    indexs: string, //索引列表,格式为key1:value1$$$key2:value2
    vaccount?: string
  ): Promise<[boolean, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    let client = this.connectedDc.client;
    if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if(client.token == ""){
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }
    let content = `${key}:${value}`;
    if (indexs != "") {
      content = `$$i_start$$${indexs}$$i_end$$${content}`;
    }
    const contentUint8 = new TextEncoder().encode(content);
    const contenthash = await sha256(contentUint8);
    const contentCidBase32 = base32.encode(contenthash);

    const contentSize = contentUint8.length;

    const blockHeight: number = await this.chainUtil.getBlockHeight();
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const themeValue: Uint8Array = new TextEncoder().encode(theme);
    const themeAuthorValue: Uint8Array = new TextEncoder().encode(themeAuthor);
    const appIdValue: Uint8Array = new TextEncoder().encode(appId);
    const contentCidValue: Uint8Array = new TextEncoder().encode(
      contentCidBase32
    );
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.KeyValue
    );

    const preSign = new Uint8Array([
      ...themeValue,
      ...appIdValue,
      ...themeAuthorValue,
      ...hValue,
      ...contentCidValue,
      ...typeValue,
    ]);
    const signature = await this.context.sign(preSign);
    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.setKeyValue(
        theme,
        appId,
        themeAuthor,
        blockHeight,
        userPubkeyStr,
        contentCidBase32,
        content,
        contentSize,
        CommentType.KeyValue,
        signature,
        vaccount
      );

      if (res !== 0) {
        return [null, new Error(`setKeyValue fail, resFlag:${res}`)];
      }
      return [true, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getValueWithKey(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
     if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.connectedDc.client;
    if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if(client.token == ""){
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValueWithKey(
        theme,
        appId,
        themeAuthor,
        writerPubkey,
        key,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValueWithKeyForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValue = new TextDecoder().decode(res);
      return [keyValue, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getValuesWithKeys(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
     let client = this.connectedDc.client;
    if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if(client.token == ""){
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValuesWithKeys(
        theme,
        appId,
        themeAuthor,
        writerPubkey,
        keys,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValuesWithKeysForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValues = new TextDecoder().decode(res);
      return [keyValues, null];
    } catch (error) {
      return [null, error];
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
  ): Promise<[string, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.connectedDc.client;
    if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      //获取token
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if(client.token == ""){
      await client.GetToken(this.context.publicKey.string(),this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValuesWithIndex(
        appId,
        themeAuthor,
        theme,
        indexKey,
        indexValue,
        seekKey,
        offset,
        limit,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValuesWithKeysForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValues = new TextDecoder().decode(res);
      return [keyValues, null];
    } catch (error) {
      return [null, error];
    }
  }

}
