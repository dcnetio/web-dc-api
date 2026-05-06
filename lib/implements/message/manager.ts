import { ChainUtil } from "../../common/chain";
import { DCConnectInfo } from "../../common/types/types";
import { MessageClient } from "./client";
import { CID } from "multiformats";
import { sha256 } from "multiformats/hashes/sha2";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { uint32ToLittleEndianBytes, getPeerIdString } from "../../util/utils";
import { DcUtil } from "../../common/dcutil";
import { dcnet } from "../../proto/dcnet_proto";
import { DCContext } from "../../../lib/interfaces/DCContext";
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
  private context: DCContext;
  private chainUtil: ChainUtil;
  private dc: DcUtil;
  private static readonly USER_BOX_CURSOR_PREFIX = "userBoxCursor_";
  constructor(
    dc: DcUtil,
    chainUtil: ChainUtil,
    context: DCContext
  ) {
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  sendMsgToUserBox = async (
    appId: string,
    receiver: string, 
    msg: string
  ): Promise<[number | null, Error | null]> => {
    try {
      if (!this.context.AccountBackupDc.client) {
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
        appId,
        sendPublicKey.string(),
        (payload: Uint8Array): Promise<Uint8Array> => {
          return this.context.sign(payload);
        }
      );
      receiverClient.token = token;
  
      const messageClient = new MessageClient(
        this.context.AccountBackupDc.client,
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
      if (!this.context.AccountBackupDc.client) {
        return [null, Errors.ErrNoAccountPeerConnected];
      }
      const publicKey = await this.context.getPublicKey();
      const publickey = publicKey.string();

      const clients = await this.dc.connectToUserAllDcPeers(publicKey.raw);
      if(!clients){
        return [null, Errors.ErrNoDcPeerConnected];
      }
      let allMsgs: dcnet.pb.IUserMsg[] = [];
      const seenMessageIds = new Set<string>();
      const safeLimit = limit > 0 ? limit : 100;
      for (const client of clients) {
        if (client) {
          const peerId = getPeerIdString(client.peerAddr) || "";
          const publicKeyString = publickey;
          // 获取token
          if(!client.token) {
            const token = await client.GetToken(
              appId,
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
          const maxKey = await messageClient.getMaxKeyFromUserBox(appId);
          if (!maxKey) {
            continue;
          }

          const cursor = this.getUserBoxCursor(publicKeyString, appId);
          const lastPeerCursor = cursor[peerId] || { ts: 0, maxKey: "", msgId: "" };

          if (lastPeerCursor.maxKey && lastPeerCursor.maxKey === maxKey) {
            continue;
          }

          let seekKey = lastPeerCursor.maxKey || "";
          let hasMore = true;
          let newestTs = lastPeerCursor.ts || 0;
          let newestMsgId = lastPeerCursor.msgId || "";
          
          let loopCount = 0;
          const MAX_PAGES = 10; // safeguard

          while (hasMore && loopCount < MAX_PAGES) {
            loopCount++;
            try {
              const res = await messageClient.getMsgFromUserBox(
                appId,
                seekKey,
                safeLimit
              );
              const list: dcnet.pb.IUserMsg[] = res && res["msgs"] ? res["msgs"] : [];

              for (const item of list) {
                if (!item || !item.messageId) {
                  continue;
                }
                const messageId = this.toMessageIdString(item.messageId);
                const blockheight = Number(item.blockheight || 0);

                if (
                  blockheight < (lastPeerCursor.ts || 0) ||
                  (blockheight === (lastPeerCursor.ts || 0) && messageId <= (lastPeerCursor.msgId || ""))
                ) {
                  continue;
                }
                if (seenMessageIds.has(messageId)) {
                  continue;
                }

                seenMessageIds.add(messageId);
                allMsgs.push(item);

                if (
                  blockheight > newestTs ||
                  (blockheight === newestTs && messageId > newestMsgId)
                ) {
                  newestTs = blockheight;
                  newestMsgId = messageId;
                }
              }

              if (list.length < safeLimit) {
                hasMore = false;
              } else {
                const lastItem = list[list.length - 1];
                const lastMsgId = this.toMessageIdString(lastItem.messageId);
                const lastBh = Number(lastItem.blockheight || 0);
                seekKey = `${lastBh}/${lastMsgId}`;
              }
            } catch (error) {
              console.log('messageClient.getMsgFromUserBox loop error', error);
              break;
            }
          }

          let finalMaxKey = lastPeerCursor.maxKey || "";
          if (newestMsgId !== "") {
            finalMaxKey = `${newestTs}/${newestMsgId}`;
          }
          if (!hasMore && loopCount <= MAX_PAGES) {
            finalMaxKey = maxKey;
          }

          cursor[peerId] = {
            ts: newestTs,
            maxKey: finalMaxKey,
            msgId: newestMsgId,
          };
          this.setUserBoxCursor(publicKeyString, appId, cursor);
        }
      }
      allMsgs.sort((a, b) => Number(b.blockheight || 0) - Number(a.blockheight || 0));
      return [allMsgs, null];
    } catch (error: any) {
      return [null, error];
    }
  };

  private getUserBoxCursor(
    publicKeyString: string,
    appId: string
  ): Record<string, { ts: number; maxKey: string; msgId: string }> {
    if (typeof localStorage === "undefined") {
      return {};
    }
    try {
      const key = `${MessageManager.USER_BOX_CURSOR_PREFIX}${publicKeyString}_${appId}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private setUserBoxCursor(
    publicKeyString: string,
    appId: string,
    cursor: Record<string, { ts: number; maxKey: string; msgId: string }>
  ): void {
    if (typeof localStorage === "undefined") {
      return;
    }
    const key = `${MessageManager.USER_BOX_CURSOR_PREFIX}${publicKeyString}_${appId}`;
    localStorage.setItem(key, JSON.stringify(cursor));
  }

  private toMessageIdString(messageId?: string | Uint8Array | null): string {
    if (!messageId) return "";
    if (typeof messageId === "string") {
      return messageId;
    }
    try {
      return new TextDecoder().decode(messageId);
    } catch {
      return Array.from(messageId)
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    }
  }
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
