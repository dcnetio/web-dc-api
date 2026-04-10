import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTCOperations, IRTCAuthInfo, IRTCMember, IRTCStreamConfig } from '../interfaces/rtc-interface';
import { AliyunRTCOperations } from '../implements/rtc/aliyun-rtc';
import { Encryption } from '../util/curve25519Encryption';
import { Ed25519PubKey } from "../common/dc-key/ed25519";
import { extractPublicKeyFromPeerId } from "../common/dc-key/keyManager";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { IRTMStandardMessage } from '../interfaces/rtm-interface';

export class RTCModule implements DCModule, IRTCOperations {
  public readonly moduleName = CoreModuleName.RTC;
  private readonly rtcOps: AliyunRTCOperations;

  private context?: DCContext;

  constructor() {
    this.rtcOps = new AliyunRTCOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    this.context = context;
    return true;
  }
  
  public async shutdown(): Promise<void> {
    this.destroy();
  }

  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    return this.rtcOps.init(authInfo);
  }

  public async joinChannel(): Promise<void> {
    return this.rtcOps.joinChannel();
  }

  public async leaveChannel(): Promise<void> {
    return this.rtcOps.leaveChannel();
  }

  public async createRTCChannel(userIds: string[], channelDescription?: string, rtcConfig?: any): Promise<string> {
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!this.context || !rtmModule) {
      throw new Error("RTM module is required for creating an RTC channel");
    }

    // 生成随机的16位 hex 字符串作为 channelId
    const buffer = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < 8; i++) buffer[i] = Math.floor(Math.random() * 256);
    }
    const channelId = Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');

    // RTM 中，我们需要加密发送给目标方
    for (const userId of userIds) {
      let targetPubKeyBytes;
      try {
        targetPubKeyBytes = Ed25519PubKey.edPubkeyFromStr(userId);
      } catch (e: any) {
        throw new Error(`目标的 User ID (${userId}) 格式无效，必须是合法的公钥字符串，请复制对方真实的 UserID 进行私聊邀请。`);
      }

      const invitePayload = {
        isInvite: true,
        channelId,
        channelDescription,
        rtcConfig
      };

      const payloadString = JSON.stringify(invitePayload);
      const payloadBytes = uint8ArrayFromString(payloadString);

      const encryptedBytes = await Encryption.encrypt(targetPubKeyBytes.bytes(), payloadBytes);
      const encryptedContent = uint8ArrayToString(encryptedBytes, 'base64');

      const inviteMsg: any = {
        appId: this.context.appInfo?.appId || 'unknown',
        sourceUserId: (this.context as any).accountInfo?.uid || (this.context.publicKey ? this.context.publicKey.string() : ''),
        messageType: 'RTC_INVITE',
        content: encryptedContent,
        timestamp: Date.now(),
        isEncrypted: true,
        isInvite: true
      };

      const appIdValue = new TextEncoder().encode(inviteMsg.appId);
      const messageTypeValue = new TextEncoder().encode(inviteMsg.messageType);
      const contentValue = new TextEncoder().encode(inviteMsg.content);
      const isEncryptedValue = new TextEncoder().encode(String(inviteMsg.isEncrypted));
      const timestampValue = new TextEncoder().encode(String(inviteMsg.timestamp));

      const preSign = new Uint8Array([
        ...appIdValue,
        ...messageTypeValue,
        ...contentValue,
        ...isEncryptedValue,
        ...timestampValue,
      ]);

      if (this.context.sign) {
        const signatureBytes = await this.context.sign(preSign);
        inviteMsg.signature = uint8ArrayToString(signatureBytes, 'base64');
      } else {
        inviteMsg.signature = "signature_placeholder";
      }

      // 通过 RTM 的 P2P 离线消息分发
      await rtmModule.sendMessageToPeer(userId, JSON.stringify(inviteMsg), true, true);
    }

    return channelId;
  }

  public async acceptRTCChannelInvite(inviteMsg: IRTMStandardMessage | string): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: any }> {
    if (typeof inviteMsg === 'string') {
      try {
        inviteMsg = JSON.parse(inviteMsg) as IRTMStandardMessage;
      } catch (e) {
        throw new Error("Failed to parse invite message");
      }
    }

    if (!inviteMsg.isInvite || !inviteMsg.sourceUserId || !inviteMsg.signature || !inviteMsg.content || inviteMsg.messageType !== 'RTC_INVITE') {
      throw new Error("Invalid RTC invite message format");
    }

    // 1. 提取发送者的公钥
    const senderPubKey = Ed25519PubKey.edPubkeyFromStr(inviteMsg.sourceUserId);

    // 2. 验证签名
    const appIdValue = new TextEncoder().encode(inviteMsg.appId || 'unknown');
    const messageTypeValue = new TextEncoder().encode(inviteMsg.messageType);
    const contentValue = new TextEncoder().encode(inviteMsg.content);
    const isEncryptedValue = new TextEncoder().encode(String(inviteMsg.isEncrypted));
    const timestampValue = new TextEncoder().encode(String(inviteMsg.timestamp));

    const preSign = new Uint8Array([
      ...appIdValue,
      ...messageTypeValue,
      ...contentValue,
      ...isEncryptedValue,
      ...timestampValue,
    ]);

    const signatureBytes = uint8ArrayFromString(inviteMsg.signature, 'base64');

    const isValid = senderPubKey.verify(preSign, signatureBytes);
    if (!isValid) {
      throw new Error("Invalid signature on RTC invite message");
    }

    // 3. 解密内容
    const encryptedBytes = uint8ArrayFromString(inviteMsg.content, 'base64');
    let decryptedBytes: Uint8Array;
    
    if (this.context?.privateKey) {
      decryptedBytes = await Encryption.decrypt(this.context.privateKey.raw, encryptedBytes);
    } else if (this.context && (this.context as any).auth) {
      decryptedBytes = await (this.context as any).auth.decryptWith(encryptedBytes);
    } else {
      throw new Error("Private key or auth module not available for decryption");
    }
    
    const decryptedString = new TextDecoder().decode(decryptedBytes);
    const payload = JSON.parse(decryptedString);

    if (!payload.channelId) {
      throw new Error("Invalid decrypted RTC invite payload");
    }

    return { 
      channelId: payload.channelId, 
      channelDescription: payload.channelDescription,
      rtcConfig: payload.rtcConfig
    };
  }

  public destroy(): void {
    return this.rtcOps.destroy();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    return this.rtcOps.muteLocalCamera(mute);
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    return this.rtcOps.muteLocalMic(mute);
  }

  public async setDisplayRemoteVideo(userId: string, element: HTMLElement | null, streamType: number = 1): Promise<void> {
    return this.rtcOps.setDisplayRemoteVideo(userId, element, streamType);
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    return this.rtcOps.setDisplayLocalVideo(element);
  }

    public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = true, sendOffline: boolean = false): Promise<'success' | 'offline' | 'failed'> {
    let res: 'success' | 'offline' | 'failed' = 'failed';
    try {
      res = await this.rtcOps.sendMessageToPeer(userId, message, requireAck, sendOffline) as any;
    } catch (e: any) {
      res = 'failed';
    }
    
    if (res === 'offline' && sendOffline) {
       const dc = this.context as any;
       if (dc && dc.message) {
         try {
           await dc.message.sendMsgToUserBox(userId, message);
           return 'offline';
         } catch(err2: any) {
           return 'failed';
         }
       } else {
         return 'failed';
       }
    } else if (res === 'success') {
       return 'success';
    } else if (res === 'failed' && sendOffline) {
       const dc = this.context as any;
       if (dc && dc.message) {
         try {
           await dc.message.sendMsgToUserBox(userId, message);
           return 'offline';
         } catch(err2: any) {
           return 'failed';
         }
       } else {
         return 'failed';
       }
    } else {
       return res;
    }
  }

  public async sendMessageToSession(message: string): Promise<void> {
    return this.rtcOps.sendMessageToSession(message);
  }

  /**
   * 获取指定频道内的在线用户列表（可选参数 channelId，RTC主要指当前频道的用户列表）
   */
  public async getChannelUsers(channelId?: string): Promise<string[]> {
    return this.rtcOps.getChannelUsers(channelId);
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    return this.rtcOps.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    return this.rtcOps.off(event, callback);
  }
}
