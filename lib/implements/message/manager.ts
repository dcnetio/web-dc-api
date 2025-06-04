import { ChainUtil } from "../../common/chain";
import { DCConnectInfo, User } from "../../common/types/types";
import * as buffer from "buffer/";
import { MessageClient } from "./client";
import { CID } from "multiformats";
import { sha256 } from "multiformats/hashes/sha2";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { uint32ToLittleEndianBytes } from "../../util/utils";
import { DcUtil } from "../../common/dcutil";
import { HeliaLibp2p } from "helia";
import { dc_protocol } from "../../common/define";
import { Client } from "../../common/dcapi";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
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
  private context: DCContext;
  private chainUtil: ChainUtil;
  private dcNodeClient: HeliaLibp2p;
  private dc: DcUtil;
  constructor(
    accountBackupDc: DCConnectInfo,
    dc: DcUtil,
    chainUtil: ChainUtil,
    dcNodeClient: HeliaLibp2p,
    context: DCContext
  ) {
    this.accountBackupDc = accountBackupDc;
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.dcNodeClient = dcNodeClient;
    this.context = context;
  }

  sendMsgToUserBox = async (
    appId: string,
    receiver: string, 
    msg: string
  ): Promise<[number | null, Error | null]> => {
    try {
      if (!this.accountBackupDc.client) {
        return [null, Errors.ErrNoAccountPeerConnected];
      }
      const receiverPubkey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(receiver)
      const sendPublicKey = await this.context.getPublicKey();

      const userMsg = await this.generateMsqBoxReq(
        appId,
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
        (payload: Uint8Array): Promise<Uint8Array> => {
          return this.context.sign(payload);
        }
      );
      receiverClient.token = token;
  
      const messageClient = new MessageClient(
        this.accountBackupDc.client,
        this.context,
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
    appId: string,
    limit: number = 100
  ): Promise<[dcnet.pb.IUserMsg[] | null, Error | null]> => {
    try {
      if (!this.accountBackupDc.client) {
        return [null, Errors.ErrNoAccountPeerConnected];
      }
      const publicKey = await this.context.getPublicKey();
      const publickey = publicKey.string()

      const clients = await this.dc.connectToUserAllDcPeers(publicKey.raw);
      if(!clients){
        return [null, Errors.ErrNoDcPeerConnected]
      }
      let allMsgs: dcnet.pb.IUserMsg[] = [];
      for (const client of clients) {
        if (client) {
          const peerId = client.peerAddr.getPeerId() || "";
          const publicKeyString = this.context.getPublicKey().string();
          // 获取token
          if(!client.token) {
            const token = await client.GetToken(
              publicKeyString,
              (payload: Uint8Array): Promise<Uint8Array> => {
                return this.context.sign(payload);
              }
            );
            client.token = token;
          }
          const messageClient = new MessageClient(
            client,
            this.context,
          );
          let maxKey = await messageClient.getMaxKeyFromUserBox(appId);
          const userBoxMaxKeyStr = localStorage.getItem('userBoxMaxKey_' + publicKeyString) || '';
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
                appId,
                maxKey,
                limit
              );
              const list = res && res.msgs ? res.msgs : [];
              console.log('messageClient.getMsgFromUserBox list', list)
              list.map((item: dcnet.pb.IUserMsg) => {
                if(item && item.messageId) {
                  allMsgs.push(item)
                }
              })
              if(list.length < limit){
                if(maxKey) {
                  localStorage.setItem('userBoxMaxKey_' + publicKeyString, JSON.stringify(userBoxMaxKey))
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
    } catch (error: any) {
      return [null, error]
    }
  };
  private generateMsqBoxReq = async (
    appId: string,
    receiverPubkey: Ed25519PubKey, 
    msg: string
  ): Promise<dcnet.pb.UserMsg> => {
      const timeStamp = Date.now() * 1000000; // na timestamp
      const preId = `${msg}${timeStamp}`;

      // Create SHA2-256 hash
      const preIdBytes = new TextEncoder().encode(preId);
      const hash = await sha256.digest(preIdBytes);

      // Create CID version 1 with raw codec
      const cid = CID.create(1, 0x55, hash);
      const messageIdValue = new TextEncoder().encode(cid.toString());

      const appIdValue = new TextEncoder().encode(appId);

      const sendPublicKey = await this.context.getPublicKey();
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
        ...appIdValue,
        ...hValue,
        ...encryptMsgValue,
      ]);
      const signature = await  this.context.sign(preSign);

      const userMsg = new dcnet.pb.UserMsg({});
      userMsg.appId = new TextEncoder().encode(appId);
      userMsg.blockheight = blockHeight;
      userMsg.encryptMsg = encryptMsgValue;
      userMsg.messageId = messageIdValue;
      userMsg.receiverPubkey = receiverPubkeyValue;
      userMsg.senderPubkey = sendPublicKeyValue;
      userMsg.signature = signature;
      return userMsg;
  }


}
