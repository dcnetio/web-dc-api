import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IWhiteboardOperations, IRtcWhiteboard, IWhiteboardAuthInfo, IWhiteboardJoinInfo } from '../interfaces/whiteboard-interface';
import { AliyunWhiteboardOperations } from '../implements/whiteboard/aliyun-whiteboard';
import { IRTMStandardMessage } from '../interfaces/rtm-interface';
import { Encryption } from '../util/curve25519Encryption';
import { Ed25519PubKey } from "../common/dc-key/ed25519";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";

export class WhiteboardModule implements DCModule, IWhiteboardOperations {
  public readonly moduleName = CoreModuleName.WHITEBOARD;
  private readonly whiteboardOps: AliyunWhiteboardOperations;
  private context?: DCContext;
  private customEventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();
  private rtmListenerAttached: boolean = false;
  private processedSignals = new Set<string>();

  private authInfo: IWhiteboardAuthInfo | null = null;
  private mainTokenExpireAt: number = 0;
  private tokenRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private tokenRefreshInFlightByChannel: Map<string, Promise<void>> = new Map();
  private activeChannelId: string = '';
  private refreshLoopEpoch: number = 0;
  private tokenRefreshFailureCount: number = 0;

  private static readonly CUSTOM_EVENTS: ReadonlySet<string> = new Set<string>([
    'onCallRequest',
    'onCallAccept',
    'onCallReject',
    'onCallEnd',
    'onInviteRequest',
    'onTokenRefreshError',
  ]);

  private static readonly RTM_SIGNAL_EVENTS: ReadonlySet<string> = new Set<string>([
    'onCallRequest',
    'onCallAccept',
    'onCallReject',
    'onCallEnd',
    'onInviteRequest',
  ]);

  constructor() {
    this.whiteboardOps = new AliyunWhiteboardOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    this.context = context;
    return true;
  }
  
  public async shutdown(): Promise<void> {
    this.stopTokenRefreshLoop();
    if (this.context) {
      const rtmModule = (this.context as any)?.getModule(CoreModuleName.RTM);
      if (rtmModule && this.rtmListenerAttached) {
        rtmModule.off('onMessageReceived', this.handleRTMMessage);
      }
    }
    this.rtmListenerAttached = false;
    this.customEventListeners.clear();
    await this.whiteboardOps.clear();
  }

  public async init(authInfo: IWhiteboardAuthInfo): Promise<void> {
    this.authInfo = {
      ...authInfo,
      appId: authInfo.appId || this.context?.appInfo?.appId || ""
    };
    return this.whiteboardOps.init(this.authInfo);
  }

  public async joinChannel(joinInfo: IWhiteboardJoinInfo): Promise<void> {
    return this.joinRoom(joinInfo);
  }

  public async joinRoom(roomIdOrJoinInfo: string | IWhiteboardJoinInfo): Promise<void> {
    if (!this.authInfo) throw new Error('Whiteboard Not initialized');

    const joinInfo = typeof roomIdOrJoinInfo === 'string' ? { roomId: roomIdOrJoinInfo } : roomIdOrJoinInfo;
    const channelId = joinInfo.roomId || joinInfo.channelId;
    if (!channelId) {
      throw new Error('joinRoom requires roomId or channelId');
    }

    this.stopTokenRefreshLoop();
    this.authInfo.channelId = channelId;
    
    // Auto-fetch token for new room if native proxy config exists
    if (!joinInfo.token && (this.context as any)?.aiproxy && this.authInfo.themeAuthor) {
      try {
        await this.refreshWhiteboardAuthToken(channelId, true);
        joinInfo.token = this.authInfo.token;
        if (this.authInfo.appId) joinInfo.appId = this.authInfo.appId;
      } catch (e: any) {
        this.notifyTokenRefreshError(channelId, e, 'initial');
        throw new Error(`[Whiteboard] Auto-fetch auth info failed: ${e.message}`);
      }
    }

    // Fill in necessary properties just like RTM / RTC joins
    const finalJoinInfo = {
      ...this.authInfo,
      ...joinInfo,
      channel: channelId,      // dingrtc WB SDK prefers channel
      channelId: channelId,
      uid: joinInfo.uid || this.authInfo.userId,
      userName: joinInfo.userName || this.authInfo.userId,
      role: 'Admin',
      roleType: 'Admin'
    };

    if (typeof (this.whiteboardOps as any).joinRoom === 'function') {
      await (this.whiteboardOps as any).joinRoom(finalJoinInfo);
    } else {
      await this.whiteboardOps.joinChannel(finalJoinInfo);
    }

    this.startTokenRefreshLoop(channelId);
  }

  public async leaveChannel(): Promise<void> {
    this.stopTokenRefreshLoop();
    return this.whiteboardOps.leaveChannel();
  }

  public async clear(): Promise<void> {
    return this.whiteboardOps.clear();
  }

  public async getWhiteboard(whiteboardId: string): Promise<IRtcWhiteboard> {
    return this.whiteboardOps.getWhiteboard(whiteboardId);
  }

  public async getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): Promise<any> {
    return this.whiteboardOps.getAnnotation(annotationId, sourceType);
  }

  public async on(event: string, callback: (...args: any[]) => void): Promise<void> {
    if (WhiteboardModule.CUSTOM_EVENTS.has(event)) {
      if (WhiteboardModule.RTM_SIGNAL_EVENTS.has(event)) {
        this.ensureRTMListener();
      }
      if (!this.customEventListeners.has(event)) {
        this.customEventListeners.set(event, []);
      }
      this.customEventListeners.get(event)!.push(callback);
    } else {
      return this.whiteboardOps.on(event, callback);
    }
  }

  public async off(event: string, callback: (...args: any[]) => void): Promise<void> {
    if (WhiteboardModule.CUSTOM_EVENTS.has(event)) {
      const callbacks = this.customEventListeners.get(event);
      if (callbacks) {
        const idx = callbacks.indexOf(callback);
        if (idx > -1) callbacks.splice(idx, 1);
      }
    } else {
      return this.whiteboardOps.off(event, callback);
    }
  }

  public async once(event: string, callback: (...args: any[]) => void): Promise<void> {
    return this.whiteboardOps.once(event, callback);
  }

  public async removeAllListeners(event?: string): Promise<void> {
    if (event && WhiteboardModule.CUSTOM_EVENTS.has(event)) {
      this.customEventListeners.delete(event);
    } else if (!event) {
      this.customEventListeners.clear();
      return this.whiteboardOps.removeAllListeners();
    } else {
      return this.whiteboardOps.removeAllListeners(event);
    }
  }

  // --- P2P 白板呼叫与信令处理 ---

  private generateSessionId(): string {
    const buffer = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < 8; i++) buffer[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public async callPeer(targetUserId: string): Promise<string> {
    const sessionId = this.generateSessionId();
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!rtmModule) throw new Error("RTM module is required for signaling");

    const payload = {
      type: 'DC_WHITEBOARD_CALL_REQUEST',
      sessionId,
      timestamp: Date.now()
    };
    
    await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    return sessionId;
  }

  public async acceptCall(targetUserId: string, sessionId: string): Promise<void> {
    const payload = { type: 'DC_WHITEBOARD_CALL_ACCEPT', sessionId };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  public async rejectCall(targetUserId: string): Promise<void> {
    const payload = { type: 'DC_WHITEBOARD_CALL_REJECT' };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  public async endCall(targetUserId: string, sessionId?: string): Promise<void> {
    const payload = { type: 'DC_WHITEBOARD_CALL_END', sessionId };
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (rtmModule) {
      await rtmModule.sendMessageToPeer(targetUserId, JSON.stringify(payload), true, true);
    }
  }

  public async createWhiteboardSession(userIds: string[], sessionDescription?: string, config?: any): Promise<string> {
    const sessionId = this.generateSessionId();
    const rtmModule = (this.context as any).getModule(CoreModuleName.RTM);
    if (!this.context || !rtmModule) {
      throw new Error("RTM module is required for creating a whiteboard session");
    }
    if (typeof this.context.sign !== 'function') {
      throw new Error("Context sign capability is required for creating a whiteboard session invite");
    }

    for (const userId of userIds) {
      let targetPubKeyBytes;
      try {
        targetPubKeyBytes = Ed25519PubKey.edPubkeyFromStr(userId);
      } catch (e: any) {
        throw new Error(`目标的 User ID (${userId}) 格式无效，必须是合法的公钥字符串，请复制对方真实的 UserID 进行私聊邀请。`);
      }

      const invitePayload = {
        isInvite: true,
        sessionId,
        sessionDescription,
        config
      };

      const payloadString = JSON.stringify(invitePayload);
      const payloadBytes = uint8ArrayFromString(payloadString);

      const encryptedBytes = await Encryption.encrypt(targetPubKeyBytes.bytes(), payloadBytes);
      const encryptedContent = uint8ArrayToString(encryptedBytes, 'base64');

      const appId = this.context.appInfo?.appId || 'unknown';
      const sourceUserId = (this.context as any).accountInfo?.uid || (this.context.publicKey ? this.context.publicKey.string() : '');
      const messageType = 'WHITEBOARD_INVITE';
      const timestamp = Date.now();
      const isEncrypted = true;

      const appIdValue = new TextEncoder().encode(appId);
      const messageTypeValue = new TextEncoder().encode(messageType);
      const contentValue = new TextEncoder().encode(encryptedContent);
      const isEncryptedValue = new TextEncoder().encode(String(isEncrypted));
      const timestampValue = new TextEncoder().encode(String(timestamp));

      const preSign = new Uint8Array([
        ...appIdValue,
        ...messageTypeValue,
        ...contentValue,
        ...isEncryptedValue,
        ...timestampValue,
      ]);

      const signatureBytes = await this.context.sign(preSign);
      const signature = uint8ArrayToString(signatureBytes, 'base64');

      const inviteMsg: IRTMStandardMessage = {
        appId,
        sourceUserId,
        messageType,
        content: encryptedContent,
        timestamp,
        isEncrypted,
        isInvite: true,
        signature
      };

      await rtmModule.sendMessageToPeer(userId, JSON.stringify(inviteMsg), true, true);
    }

    return sessionId;
  }

  public async acceptWhiteboardInvite(inviteMsg: IRTMStandardMessage | string): Promise<{ sessionId: string; sessionDescription?: string; config?: any }> {
    if (typeof inviteMsg === 'string') {
      try {
        inviteMsg = JSON.parse(inviteMsg) as IRTMStandardMessage;
      } catch (e) {
        throw new Error("Failed to parse invite message");
      }
    }

    if (!inviteMsg.isInvite || !inviteMsg.sourceUserId || !inviteMsg.signature || !inviteMsg.content || inviteMsg.messageType !== 'WHITEBOARD_INVITE') {
      throw new Error("Invalid WHITEBOARD invite message format");
    }

    const senderPubKey = Ed25519PubKey.edPubkeyFromStr(inviteMsg.sourceUserId);

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
      throw new Error("Invalid signature on WHITEBOARD invite message");
    }

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

    if (!payload.sessionId) {
      throw new Error("Invalid decrypted WHITEBOARD invite payload");
    }

    return { 
      sessionId: payload.sessionId, 
      sessionDescription: payload.sessionDescription,
      config: payload.config
    };
  }

  private handleRTMMessage = (msgEvent: any) => {
    try {
      const payload = JSON.parse(msgEvent.message);
      if (payload && payload.type) {
        const uid = msgEvent.publisher || msgEvent.uid || '';
        const sigKey = `${payload.type}_${payload.sessionId || ''}_${uid}_${payload.timestamp || ''}`;
        if (this.processedSignals.has(sigKey)) return;
        this.processedSignals.add(sigKey);
        setTimeout(() => this.processedSignals.delete(sigKey), 10000);

        if (payload.type === 'DC_WHITEBOARD_CALL_REQUEST') {
          this.emitCustomEvent('onCallRequest', {
            callerId: uid,
            sessionId: payload.sessionId,
            timestamp: payload.timestamp
          });
        } else if (payload.type === 'DC_WHITEBOARD_CALL_ACCEPT') {
          this.emitCustomEvent('onCallAccept', {
            calleeId: uid,
            sessionId: payload.sessionId
          });
        } else if (payload.type === 'DC_WHITEBOARD_CALL_REJECT') {
          this.emitCustomEvent('onCallReject', {
            calleeId: uid
          });
        } else if (payload.type === 'DC_WHITEBOARD_CALL_END') {
          this.emitCustomEvent('onCallEnd', {
            userId: uid,
            sessionId: payload.sessionId
          });
        }
      }
    } catch (e) {
      // ignore
    }
  };

  private ensureRTMListener() {
    if (this.rtmListenerAttached) return;
    this.rtmListenerAttached = true;
    
    setTimeout(() => {
      const rtmModule = (this.context as any)?.getModule(CoreModuleName.RTM);
      if (rtmModule) {
        rtmModule.on('onMessageReceived', this.handleRTMMessage);
      } else {
        this.rtmListenerAttached = false;
      }
    }, 100);
  }

  private emitCustomEvent(event: string, ...args: any[]) {
    const list = this.customEventListeners.get(event);
    if (list) {
      list.forEach(cb => cb(...args));
    }
  }

  private hasAliyunTokenProvider(): boolean {
    return !!((this.context as any)?.aiproxy && this.authInfo?.themeAuthor);
  }

  private async refreshWhiteboardAuthToken(channelId: string, forceRefresh: boolean): Promise<void> {
    if (!this.authInfo || !this.hasAliyunTokenProvider()) {
      return;
    }

    const authInfo = this.authInfo;

    const inFlight = this.tokenRefreshInFlightByChannel.get(channelId);
    if (inFlight) {
      return inFlight;
    }

    const epochAtStart = this.refreshLoopEpoch;

    const refreshPromise = (async () => {
      const [authRes, err] = await (this.context as any).aiproxy.GetAliyunV3Token({
        channelId,
        userId: authInfo.userId,
        appId: authInfo.appId,
        themeAuthor: authInfo.themeAuthor,
        configTheme: authInfo.configTheme,
        serviceName: authInfo.serviceName,
        forceRefresh,
      });

      if (err || !authRes || !authRes.token) {
        throw err || new Error('Failed to fetch token for whiteboard room');
      }

      // Prevent stale responses from previous room/loop from overwriting current auth state.
      if (epochAtStart !== this.refreshLoopEpoch || this.authInfo?.channelId !== channelId) {
        return;
      }

      this.authInfo.token = authRes.token;
      if (authRes.serviceAppId) this.authInfo.appId = authRes.serviceAppId;
      this.mainTokenExpireAt = authRes.expiresAt ? authRes.expiresAt * 1000 : (Date.now() + 24 * 60 * 60 * 1000);
      this.tokenRefreshFailureCount = 0;
    })();

    this.tokenRefreshInFlightByChannel.set(channelId, refreshPromise);

    try {
      await refreshPromise;
    } finally {
      if (this.tokenRefreshInFlightByChannel.get(channelId) === refreshPromise) {
        this.tokenRefreshInFlightByChannel.delete(channelId);
      }
    }
  }

  private startTokenRefreshLoop(channelId: string) {
    this.stopTokenRefreshLoop();
    if (!channelId || !this.hasAliyunTokenProvider()) return;

    this.activeChannelId = channelId;
    this.tokenRefreshFailureCount = 0;
    const loopEpoch = this.refreshLoopEpoch;
    const loopChannelId = channelId;
    this.tokenRefreshTimer = setInterval(async () => {
      if (!this.activeChannelId) return;
      if (this.refreshLoopEpoch !== loopEpoch) return;
      if (this.activeChannelId !== loopChannelId) return;
      try {
        await this.refreshWhiteboardAuthToken(loopChannelId, true);
      } catch (e) {
        this.notifyTokenRefreshError(loopChannelId, e, 'periodic');
        // Keep loop alive; join/leave lifecycle controls stop/start.
      }
    }, 60 * 1000);
  }

  private stopTokenRefreshLoop() {
    this.refreshLoopEpoch += 1;
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    this.activeChannelId = '';
    this.tokenRefreshInFlightByChannel.clear();
    this.tokenRefreshFailureCount = 0;
  }

  private notifyTokenRefreshError(channelId: string, error: any, phase: 'initial' | 'periodic') {
    this.tokenRefreshFailureCount += 1;
    const now = Date.now();
    const normalizedError = error instanceof Error ? error : new Error(String(error || 'Unknown token refresh error'));

    this.emitCustomEvent('onTokenRefreshError', {
      channelId,
      phase,
      error: normalizedError,
      message: normalizedError.message,
      failureCount: this.tokenRefreshFailureCount,
      retryInMs: 60 * 1000,
      nextRetryAt: now + 60 * 1000,
      timestamp: now,
    });
  }
}