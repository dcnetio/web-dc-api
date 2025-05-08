import type { Multiaddr } from "@multiformats/multiaddr";
import { KeyValueClient } from "./client";
import { DCConnectInfo, SignHandler, ThemeComment } from "../types/types";
import { OpenFlag } from "lib/constants";
import { CommentManager } from "lib/comment/manager";
import { HeliaLibp2p } from "helia";
import { ChainUtil } from "lib/chain";
import { DcUtil } from "lib/dcutil";
import { Ed25519PubKey } from "lib/dc-key/ed25519";
import { sha256, uint32ToLittleEndianBytes } from "lib/util/utils";
import { base32 } from "multiformats/bases/base32";
import { Client } from "lib/dcapi";
import { Direction } from "lib/define";
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
  private signHandler: SignHandler;
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    accountBackupDc: DCConnectInfo,
    dcNodeClient: HeliaLibp2p,
    chainUtil: ChainUtil,
    signHandler: SignHandler
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc;
    this.accountBackupDc = accountBackupDc;
    this.dcNodeClient = dcNodeClient;
    this.chainUtil = chainUtil;
    this.signHandler = signHandler;
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
      const commentManager = new CommentManager(
        this.dc,
        this.connectedDc,
        this.dcNodeClient,
        this.chainUtil,
        this.signHandler
      );
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
    const userPubkey = this.signHandler.getPublicKey();
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
    const type = 0;
    // Create binary representation of type (little endian)
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(type ? type : 0);
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

    const signature = await this.signHandler.sign(preSign);

    const keyValueClient = new KeyValueClient(client, this.signHandler);
    try {
      const res = await keyValueClient.configThemeObjAuth(
        themeValue,
        appIdValue,
        themeAuthorValue,
        blockHeight,
        userPubkeyStr,
        contentCidValue,
        content,
        contentSize,
        type,
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
        const commentManager = new CommentManager(
          this.dc,
          this.connectedDc,
          this.dcNodeClient,
          this.chainUtil,
          this.signHandler
        );
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
  ){
    if (!theme.startsWith("keyvalue_")) {
      return new Error("Va_SetKeyValue failed, theme must start with 'keyvalue_'");
    }
    const userPubkey = this.signHandler.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.pubkeyToEdStr(themeAuthor);
    const  client = await this.dc.connectToUserDcPeer(themeAuthorPubkey.raw);
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    const serverPeerId = client.peerAddr.getPeerId();
    const content = `${key}:${value}`;

  }
}
