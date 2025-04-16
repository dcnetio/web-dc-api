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
import { dcnet } from "../proto/dcnet_proto";
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
    try {
      if (!this.accountBackupDc.client) {
        return [null, Errors.ErrNoAccountPeerConnected];
      }
      const receiverPubkey: Ed25519PubKey = Ed25519PubKey.pubkeyToEdStr(receiver)
      const sendPublicKey = await this.signHandler.publickey();

      const userMsg = await this.generateMsqBoxReq(
        appName,
        receiverPubkey,
        msg
      )
      // 连接receiver节点
      let receiverClient = await this.dc.connectToUserDcPeer(
        receiverPubkey.raw,
      );
      if(!receiverClient){
        return [null, Errors.ErrNoReceiverPeerConnected]
      }
      const token = await receiverClient.GetToken(
        sendPublicKey.string(),
        (payload: Uint8Array): Uint8Array => {
          return this.signHandler.sign(payload);
        }
      );
      receiverClient.token = token;
  
      const messageClient = new MessageClient(
        this.accountBackupDc.client,
        this.signHandler,
        receiverClient,
      );
      const reply = await messageClient.sendMsgToUserBox(
        userMsg
      );
      return [reply, null];
    } catch (error) {
      throw error;
    }
  };

  getMsgFromUserBox = async (
    appName: string,
    limit: number = 100
  ): Promise<[{ [k: string]: any }[] | null, Error | null]> => {
    try {
      if (!this.accountBackupDc.client) {
        return [null, Errors.ErrNoAccountPeerConnected];
      }
      const publicKey = await this.signHandler.publickey();
      const publickey = publicKey.string()

      const clients = await this.dc.connectToUserAllDcPeers(publicKey.raw);
      if(!clients){
        return [null, Errors.ErrNoDcPeerConnected]
      }
      let allMsgs: dcnet.pb.IUserMsg[] = [];
      for (const client of clients) {
        if (client) {
          const peerId = client.peerAddr.getPeerId() || "";
          // 获取token
          if(!client.token) {
            const token = await client.GetToken(
              this.signHandler.publickey().string(),
              (payload: Uint8Array): Uint8Array => {
                return this.signHandler.sign(payload);
              }
            );
            client.token = token;
          }
          const messageClient = new MessageClient(
            client,
            this.signHandler,
          );
          let maxKey = await messageClient.getMaxKeyFromUserBox(appName);
          const userBoxMaxKeyStr = localStorage.getItem('userBoxMaxKey') || '';
          let userBoxMaxKey = userBoxMaxKeyStr ? JSON.parse(userBoxMaxKeyStr) : {};
          if(maxKey){
            let preMaxKey = userBoxMaxKey[publickey] || {};
            preMaxKey[peerId] = maxKey;
          }
          let getFlag = true
          while(getFlag){
            try {
              // 获取的maxkey 不等于 之前保存的maxkey
              const res = await messageClient.getMsgFromUserBox(
                appName,
                maxKey,
                limit
              );
              const list = res && res.msgs ? res.msgs : [];
              console.log('messageClient.getMsgFromUserBox list', list)
              list.map((item) => {
                if(item && item.messageId) {
                  allMsgs.push(item)
                }
              })
              if(list.length < limit){
                if(maxKey) {
                  localStorage.setItem('userBoxMaxKey', JSON.stringify(userBoxMaxKey))
                }
                getFlag = false
              }
            } catch (error) {
              console.log('messageClient.getMsgFromUserBox error', error)
            }
          }
        }
      }
      return [allMsgs, null]
    } catch (error) {
      return [null, error]
    }
  };
  private generateMsqBoxReq = async (
    appName: string,
    receiverPubkey: Ed25519PubKey, 
    msg: string
  ): Promise<dcnet.pb.UserMsg> => {
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

      const userMsg = new dcnet.pb.UserMsg({});
      userMsg.appId = new TextEncoder().encode(appName);
      userMsg.blockheight = blockHeight;
      userMsg.encryptMsg = encryptMsgValue;
      userMsg.messageId = messageIdValue;
      userMsg.receiverPubkey = receiverPubkeyValue;
      userMsg.senderPubkey = sendPublicKeyValue;
      userMsg.signature = signature;
      return userMsg;
  }


}
