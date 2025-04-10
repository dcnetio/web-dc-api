import { ChainUtil } from "../chain";
import { DCConnectInfo, SignHandler, User } from "../types/types";
import * as buffer from "buffer/";
import { MessageClient } from "./client";
import { CID } from "multiformats";
import { sha256 } from "multiformats/hashes/sha2";
import { Ed25519PubKey } from "../dc-key/ed25519";
import { uint32ToLittleEndianBytes } from "../util/utils";
import { DcUtil } from "../dcutil";
import { HeliaLibp2p } from "helia";
import { dc_protocol } from "../define";
import { Client } from "../dcapi";
const { Buffer } = buffer;
// 错误定义
export class DCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DCError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new DCError("no dc peer connected"),
  ErrGetUserInfoError: new DCError("get user info error"),
  ErrNoAccountPeerConnected: new DCError("no account peer connected"),
  ErrNoReceiverPeerConnected: new DCError("no receiver peer connected"),
};

export class MessageManager {
  private accountBackupDc: DCConnectInfo = {};
  private signHandler: SignHandler;
  private chainUtil: ChainUtil;
  private dcNodeClient: HeliaLibp2p;
  private dc: DcUtil;
  constructor(
    accountBackupDc: DCConnectInfo,
    dc: DcUtil,
    chainUtil: ChainUtil,
    dcNodeClient: HeliaLibp2p,
    signHandler: SignHandler
  ) {
    this.accountBackupDc = accountBackupDc;
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.dcNodeClient = dcNodeClient;
    this.signHandler = signHandler;
  }

  sendMsgToUserBox = async (
    appName: string,
    receiver: string, 
    msg: string
  ) => {
    if (!this.accountBackupDc.client) {
      return [null, Errors.ErrNoAccountPeerConnected];
    }
    const timeStamp = Date.now() * 1000; // Microsecond timestamp
    const preId = `${msg}${timeStamp}`;

    // Create SHA2-256 hash
    const preIdBytes = new TextEncoder().encode(preId);
    const hash = await sha256.digest(preIdBytes);

    // Create CID version 1 with raw codec
    const cid = CID.create(1, 0x55, hash);
    const messageIdValue = new TextEncoder().encode(cid.toString());

    const appNameValue = new TextEncoder().encode(appName);

    const sendPublicKey = await this.signHandler.publickey();
    const sendPublicKeyValue = new TextEncoder().encode(sendPublicKey.string());

    let receiverPubkey: Ed25519PubKey = Ed25519PubKey.pubkeyToEdStr(receiver)
    const receiverPubkeyValue = new TextEncoder().encode(receiverPubkey.string());

    const blockHeight = await this.chainUtil.getBlockHeight() || 0;
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight
    );
    const msgValue = new TextEncoder().encode(msg);
    const encryptMsgValue = await receiverPubkey.encrypt(msgValue);
    

    const preSign = new Uint8Array([
      ...messageIdValue,
      ...receiverPubkeyValue,
      ...appNameValue,
      ...hValue,
      ...encryptMsgValue,
    ]);
    const signature = this.signHandler.sign(preSign);

    // 获取用户节点
    const peerAddrs = await this.chainUtil.getAccountPeers(receiverPubkey.raw);
    if (!peerAddrs || peerAddrs.length == 0) {
      return [null, Errors.ErrNoReceiverPeerConnected];
    }
    // 连接节点
    const nodeAddr = await this.dc?._connectPeers(peerAddrs);
    console.log("_connectNodeAddrs nodeAddr:", nodeAddr);
    if (!nodeAddr) {
      return [null, Errors.ErrNoReceiverPeerConnected];
    }
    const receiverClient = new Client(this.dcNodeClient.libp2p, nodeAddr, dc_protocol);

    const messageClient = new MessageClient(
      this.accountBackupDc.client,
      receiverClient,
    );
    const reply = await messageClient.sendMsgToUserBox(
      appName,
      blockHeight,
      sendPublicKeyValue,
      receiverPubkeyValue,
      encryptMsgValue,
      messageIdValue,
      signature

    );
    return [reply, null];
  };

}
