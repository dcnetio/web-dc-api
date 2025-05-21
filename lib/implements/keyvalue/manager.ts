import type { Multiaddr } from "@multiformats/multiaddr";
import { KeyValueClient } from "./client";
import { DCConnectInfo, ThemeComment } from "../../common/types/types";
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
import { DCContext } from "../../interfaces";
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

  async vaCreateStoreTheme(
    appId: string,
    themeAuthor: string,
    theme: string,
    space: number,
    type: number
  ): Promise<[number, Error | null]> {
    // Default group to "DCAPP" if empty
    if (appId === "") {
      appId = "DCAPP";
    }

    // Set minimum space (1GB)
    if (space < 1 << 30) {
      space = 1 << 30;
    }

    // Validate theme type, default to 2
    if (type !== 1 && type !== 2) {
      type = 2;
    }

    // Theme must start with "keyvalue_" or "auth_"
    if (!theme.startsWith("keyvalue_") && !theme.startsWith("auth_")) {
      return [
        -1,
        new Error(
          "vaCreateStoreTheme failed, auth theme must start with 'keyvalue_' or 'auth_'"
        ),
      ];
    }

    // NOTE: There seems to be a logical error in the original code:
    // It checks if theme ends with "_pub" and returns an error if it does,
    // but the error message suggests it should end with "_pub".
    // I'm assuming the condition should check if it doesn't end with "_pub"
    if (type === 2) {
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
        OpenFlag.PRIVATE,
        space || 20 * 1024 * 1024 // 20M
      );
      return res;
    } catch (error) {
      return [null, error as Error];
    }
  }

  async vaConfigThemeAuthForVAccount(
    appId: string,
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number, Error | null]> {
    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }
    let client: Client | null = null;
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    if (vaccount !== "") {
      // Virtual account delegation operation, need to connect to specified virtual account node
      const account = new TextEncoder().encode(vaccount);
      client = await this.dc.connectToUserDcPeer(account);
      userPubkeyStr = vaccount;
    } else {
      client = this.accountBackupDc.client;
    }

    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.pubkeyToEdStr(themeAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey;
    try {
      forPubkey = Ed25519PubKey.pubkeyToEdStr(authPubkey);
    } catch (error) {
      pubkeyFlag = false;
    }

    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }

    // Convert to hex
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

    const contentSize = content.length;

    // Create binary representation of blockHeight (little endian)
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    // Create binary representation of type (little endian)
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.KeyValue
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
        CommentType.KeyValue,
        signature
      );

      if (res !== 0) {
        return [null, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async vaGetThemeAuthListForVAccount(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ) {
    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }
    let seekKey: string = "";
    let authList: ThemeComment[] = [];
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
        console.log("getThemeComments res:", res);
        if (res[0] && res[0].length == 0) {
          return [];
        }
        const resList = res[0];
        authList.push(...resList);

        if (resList.length < 1000) {
          break;
        }

        seekKey = `${resList[resList.length - 1].blockheight}/${
          resList[resList.length - 1].commentCid
        }`;
      }
    } catch (error) {
      return [null, error];
    }
    return [authList, null];
  }

  async vaSetKeyValueForVAccount(
    appId: string,
    themeAuthor: string,
    theme: string,
    key: string,
    value: string,
    vaccount?: string
  ): Promise<[boolean, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      return [
        null,
        new Error("Va_SetKeyValue failed, theme must start with 'keyvalue_'"),
      ];
    }
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.pubkeyToEdStr(themeAuthor);
    const client = await this.dc.connectToUserDcPeer(themeAuthorPubkey.raw);
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    const content = `${key}:${value}`;
    const contentUint8 = new TextEncoder().encode(content);
    const contenthash = await sha256(contentUint8);
    const contentCidBase32 = base32.encode(contenthash);

    const contentSize = content.length;

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

  async vaGetValueWithKeyForVAccount(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      return [
        null,
        new Error(
          "vaGetValueWithKeyForVAccount failed, theme must start with 'keyvalue_'"
        ),
      ];
    }
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.pubkeyToEdStr(themeAuthor);
    const client = await this.dc.connectToUserDcPeer(themeAuthorPubkey.raw);
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
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

  async vaGetValuesWithKeysForVAccount(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
    vaccount?: string
  ): Promise<[string, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      return [
        null,
        new Error(
          "vaGetValuesWithKeysForVAccount failed, theme must start with 'keyvalue_'"
        ),
      ];
    }
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.pubkeyToEdStr(themeAuthor);
    const client = await this.dc.connectToUserDcPeer(themeAuthorPubkey.raw);
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
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
}
