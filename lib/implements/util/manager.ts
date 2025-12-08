import type { Multiaddr } from "@multiformats/multiaddr";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import {
  DCConnectInfo,
  IAppInfo,
  NFTBindStatus,
  User,
} from "../../common/types/types";
import { UtilClient } from "./client";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { Ed25519PrivKey, Ed25519PubKey } from "../../common/dc-key/ed25519";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { PeerId } from "@libp2p/interface";
import {
  extractPublicKeyFromPeerId,
  generateSymKeyForPrikey,
  KeyManager,
} from "../../common/dc-key/keyManager";
import { SymmetricKey } from "../threaddb/common/key";
import { peerIdFromString } from "@libp2p/peer-id";
import { request } from "http";
import { Errors } from "../../../lib/common/error";
import { hexToBytes } from "@noble/curves/abstract/utils";

export class UtilManager {
  dc: DcUtil;
  chainUtil: ChainUtil | undefined;
  connectedDc: DCConnectInfo = {};
  context: DCContext;
  constructor(context: DCContext) {
    this.connectedDc = context.connectedDc;
    this.dc = context.dcutil;
    this.chainUtil = context.dcChain;
    this.context = context;
  }

  /**
   * 设置应用信息
   * @param appId 应用ID
   * @param domain 应用域名
   * @param owner 应用所有者公钥
   * @param rewarder 应用奖励者公钥
   * @returns 用户默认数据库信息
   */
  async setAppInfo(
    appId: string,
    domain: string,
    owner: string,
    rewarder: string,
    fid: string = ""
  ): Promise<void> {
    if (!this.context.publicKey || !this.context.ethAddress) {
      throw Errors.NO_USER_INFO;
    }
    if (!this.connectedDc.client) {
      throw Errors.NO_DC_PEER_CONNECTED;
    }
    if (!this.connectedDc.nodeAddr) {
      throw Errors.NO_DC_PEER_CONNECTED;
    }

    const blockHeight = await this.chainUtil?.getBlockHeight();
    if (blockHeight === undefined) {
      throw Errors.FAIL_TO_GET_BLOCKHEIGHT;
    }
    let ownerAccount = this.context.publicKey.bytes();
    if (owner && owner.length > 10) {
      ownerAccount = Ed25519PubKey.unmarshalString(owner).bytes();
    }
    let rewardAccount = hexToBytes(this.context.ethAddress.slice(2));
    if (rewarder && rewarder.length > 10) {
      rewardAccount = hexToBytes(rewarder.slice(2));
    }
    if (this.connectedDc.client.token == "") {
      const token = await this.connectedDc.client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        async (payload: Uint8Array): Promise<Uint8Array> => {
          return this.context.sign(payload);
        }
      );
      if (!token) {
        throw Errors.FAIL_TO_GET_TOKEN;
      }
    }
    const utilClient = new UtilClient(this.connectedDc.client, this.context);
    const serverPidStr = this.connectedDc.nodeAddr.getPeerId() || "";
    const serverPidBytes = new TextEncoder().encode(serverPidStr);
    const appIdBytes = new TextEncoder().encode(appId);
    const domainBytes = new TextEncoder().encode(domain);
    // 生成签名数据
    const hvalue = uint32ToLittleEndianBytes(blockHeight);
    const preSign = new Uint8Array(
      appIdBytes.length +
        domainBytes.length +
        ownerAccount.length +
        rewardAccount.length +
        hvalue.length +
        serverPidBytes.length +
        fid.length
    );
    let offset = 0;
    preSign.set(appIdBytes, offset);
    offset += appIdBytes.length;
    preSign.set(ownerAccount, offset);
    offset += ownerAccount.length;
    preSign.set(rewardAccount, offset);
    offset += rewardAccount.length;
    preSign.set(domainBytes, offset);
    offset += domainBytes.length;
    preSign.set(hvalue, offset);
    offset += hvalue.length;
    preSign.set(serverPidBytes, offset);
    offset += serverPidBytes.length;
    preSign.set(new TextEncoder().encode(fid), offset);
    // 使用私钥签名
    const signature = await this.context.sign(preSign);

    await utilClient.setAppInfo(
      appIdBytes,
      ownerAccount,
      rewardAccount,
      domainBytes,
      blockHeight,
      serverPidStr,
      fid,
      signature
    );
    return;
  }

  async getAppInfo(appId: string): Promise<IAppInfo> {
    if (!this.connectedDc.client) {
      throw Errors.NO_DC_PEER_CONNECTED;
    }
    if (!this.chainUtil) {
      throw Errors.NO_CHAIN_UTIL;
    }
    const appInfo = await this.chainUtil.getAPPInfo(appId);
    return appInfo;
  }
}
