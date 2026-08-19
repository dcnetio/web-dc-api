import {
  IRTCAuthInfo,
  IRTCJoinRoomOptions,
  IRTCOperations,
  IRTCStreamConfig,
  IRTCCameraDevice,
  IRTCScreenShareConfig,
  RTCChannelInviteMessage,
  RTCGenericEventCallback,
} from '../../interfaces/rtc-interface';
import type { DCContext } from '../../interfaces/DCContext';
import { Encryption } from '../../util/curve25519Encryption';
import { Ed25519PubKey } from '../../common/dc-key/ed25519';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';

type PeerRole = 'offerer' | 'answerer' | undefined;

type WebRTCSignal = {
  kind: 'offer' | 'answer' | 'ice-candidate' | 'bye';
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

type WebRTCSignalEnvelope = {
  signal?: WebRTCSignal;
  content?: string;
  encrypted?: boolean;
  signature?: string;
  signalId?: string;
  timestamp?: number;
};

type WebRTCSignalChunk = WebRTCSignalEnvelope & {
  chunkIndex: number;
  chunkCount: number;
  chunkData: string;
  chunkSignature?: string;
};

/**
 * Native browser WebRTC provider.
 *
 * RTM is deliberately used only as a signaling transport. No media, room
 * mixer, token or cloud RTC SDK is involved in this class.
 */
export class WebRTCP2POperations implements IRTCOperations {
  private static readonly MAX_RTM_SIGNAL_CHUNK_SIZE = 2800;
  private static readonly MAX_RTM_SIGNAL_CHUNKS = 64;
  private static readonly MAX_PENDING_SIGNAL_ASSEMBLIES = 8;
  private authInfo: IRTCAuthInfo | null = null;
  private context: DCContext | undefined;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private remoteScreenStream: MediaStream | null = null;
  private screenTrack: MediaStreamTrack | null = null;
  private audioSender: RTCRtpSender | null = null;
  private cameraSender: RTCRtpSender | null = null;
  private screenSender: RTCRtpSender | null = null;
  private screenTransceiver: RTCRtpTransceiver | null = null;
  private peerUserId = '';
  private peerChannelId = '';
  private peerRole: PeerRole;
  private joined = false;
  private creatingOffer = false;
  private localDescriptionSent = false;
  private remoteDescriptionReady = false;
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private pendingSignals: Array<{ signal: WebRTCSignal; senderUserId: string }> = [];
  private localVideoElement: HTMLElement | null = null;
  private localPlaybackElement: HTMLMediaElement | null = null;
  private remoteAudioElement: HTMLAudioElement | null = null;
  private remoteVideoElements = new Map<string, HTMLElement>();
  private remotePlaybackElements = new Map<string, HTMLMediaElement>();
  private remoteScreenElements = new Map<string, HTMLElement>();
  private remoteScreenPlaybackElements = new Map<string, HTMLMediaElement>();
  private remoteAudioMuted = false;
  private dataChannel: RTCDataChannel | null = null;
  private localCameraMuted = false;
  private localMicMuted = false;
  private eventListeners = new Map<string, Array<(...args: any[]) => void>>();
  private connectionTimer: ReturnType<typeof setTimeout> | null = null;
  private signalChunks = new Map<string, { chunks: string[]; received: number; expiresAt: number; envelope: WebRTCSignalEnvelope }>();
  private acceptedSignalIds = new Map<string, number>();

  public initializeContext(context: DCContext): void {
    this.context = context;
  }

  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    this.authInfo = authInfo;
    this.peerUserId = authInfo.peerUserId || '';
    this.peerChannelId = authInfo.channelId || '';
    this.peerRole = undefined;
    this.joined = false;
    if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
      throw new Error('[RTC:p2p] Browser WebRTC (RTCPeerConnection) is not available.');
    }
    if (authInfo.webrtc?.requireRTM !== false && !this.getRTMModule()) {
      throw new Error('[RTC:p2p] RTM must be initialized before using WebRTC signaling.');
    }
  }

  /** Called by RTCModule after callPeer/acceptCall to bind signaling identity and role. */
  public preparePeer(peerUserId: string, channelId: string, role?: Exclude<PeerRole, undefined>): void {
    this.peerUserId = peerUserId;
    this.peerChannelId = channelId;
    this.peerRole = role;
    if (this.authInfo) {
      this.authInfo.peerUserId = peerUserId;
      this.authInfo.channelId = channelId;
    }
  }

  public async joinRoom(channelId: string, options?: IRTCJoinRoomOptions): Promise<void> {
    if (this.joined || this.peerConnection) await this.leaveChannel();
    if (!this.authInfo) throw new Error('[RTC:p2p] Provider is not initialized.');
    this.authInfo.channelId = channelId;
    this.peerChannelId = channelId;
    this.localCameraMuted = options?.videoPublish === false;
    this.localMicMuted = options?.audioPublish === false;
    this.remoteAudioMuted = false;
    this.localDescriptionSent = false;
    this.remoteDescriptionReady = false;
    this.pendingCandidates = [];
    this.joined = true;

    // A direct join can supply peerUserId in authInfo. Calls normally set it
    // through preparePeer(). Without it there is no safe RTM destination.
    if (!this.peerUserId) {
      throw new Error('[RTC:p2p] peerUserId is required. Use callPeer/acceptCall or set authInfo.peerUserId.');
    }

    const mediaDevices = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    if ((this.localCameraMuted === false || this.localMicMuted === false) && !mediaDevices?.getUserMedia) {
      throw new Error('[RTC:p2p] navigator.mediaDevices.getUserMedia is unavailable.');
    }
    if (mediaDevices?.getUserMedia) {
      const requested = await mediaDevices.getUserMedia({
        video: this.localCameraMuted ? false : true,
        audio: this.localMicMuted ? false : true,
      });
      this.localStream = requested;
      requested.getTracks().forEach(track => { track.enabled = track.kind === 'video' ? !this.localCameraMuted : !this.localMicMuted; });
      this.localPlaybackElement = this.resolvePlaybackElement(this.localVideoElement, this.localPlaybackElement);
      this.bindMediaElement(this.localPlaybackElement, requested, true);
    }

    await this.createPeerConnection();
    for (const pending of this.pendingSignals.splice(0)) {
      await this.applySignal(pending.signal, pending.senderUserId);
    }
  }

  public async joinChannel(): Promise<void> {
    if (!this.authInfo?.channelId) throw new Error('[RTC:p2p] channelId is missing.');
    await this.joinRoom(this.authInfo.channelId);
  }

  private async createPeerConnection(): Promise<void> {
    if (this.peerConnection) return;
    const config: RTCConfiguration = { iceServers: this.authInfo?.webrtc?.iceServers || [] };
    const pc = new RTCPeerConnection(config);
    this.peerConnection = pc;
    // Reserve the three media m-lines up front. This allows a user to enable a
    // muted camera/mic later, or start screen share, with replaceTrack() rather
    // than a second SDP negotiation and its associated glare/race handling.
    this.audioSender = pc.addTransceiver('audio', { direction: 'sendrecv' }).sender;
    this.cameraSender = pc.addTransceiver('video', { direction: 'sendrecv' }).sender;
    this.screenTransceiver = pc.addTransceiver('video', { direction: 'sendrecv' });
    this.screenSender = this.screenTransceiver.sender;
    const localAudio = this.localStream?.getAudioTracks()[0];
    const localCamera = this.localStream?.getVideoTracks()[0];
    if (localAudio) await this.audioSender.replaceTrack(localAudio);
    if (localCamera) await this.cameraSender.replaceTrack(localCamera);
    const shouldOffer = this.peerRole === 'offerer' ||
      (this.peerRole === undefined && this.localUserId() < this.peerUserId);
    if (shouldOffer) this.attachDataChannel(pc.createDataChannel('dc-p2p', { ordered: true }));
    pc.ondatachannel = event => this.attachDataChannel(event.channel);
    pc.onicecandidate = event => {
      if (event.candidate && this.authInfo?.webrtc?.trickleIce !== false) {
        void this.sendSignal({ kind: 'ice-candidate', candidate: event.candidate.toJSON() }).catch(error => {
          this.emit('onWebRTCSignalError', { error, peerUserId: this.peerUserId });
        });
      } else if (!event.candidate && this.authInfo?.webrtc?.trickleIce === false) {
        void this.sendCurrentDescription().catch(error => {
          this.emit('onWebRTCSignalError', { error, peerUserId: this.peerUserId });
        });
      }
    };
    pc.ontrack = event => {
      const isScreenTrack = event.track.kind === 'video' &&
        event.transceiver.mid !== null && event.transceiver.mid === this.screenTransceiver?.mid;
      const streamProperty = isScreenTrack ? 'remoteScreenStream' : 'remoteStream';
      let stream = this[streamProperty];
      if (!stream) {
        stream = new MediaStream();
        this[streamProperty] = stream;
      }
      const exists = stream.getTracks().some(track => track.id === event.track.id);
      if (!exists) stream.addTrack(event.track);
      const containers = isScreenTrack ? this.remoteScreenElements : this.remoteVideoElements;
      const playbackElements = isScreenTrack ? this.remoteScreenPlaybackElements : this.remotePlaybackElements;
      const container = containers.get(this.peerUserId) || null;
      const playback = this.resolvePlaybackElement(container, playbackElements.get(this.peerUserId) || null);
      if (playback) playbackElements.set(this.peerUserId, playback);
      this.bindMediaElement(playback, stream, false);
      if (event.track.kind === 'audio' && !isScreenTrack) {
        this.bindMediaElement(this.ensureRemoteAudioElement(), stream, false);
      }
      if (isScreenTrack) {
        this.emit('onScreenShareSubscribed', { userId: this.peerUserId, track: event.track });
      } else {
        this.emit('onTrackSubscribed', { userId: this.peerUserId, track: event.track, mediaType: event.track.kind });
      }
      event.track.onended = () => {
        this.emit(isScreenTrack ? 'onScreenShareUnSubscribed' : 'onUnPublisher',
          isScreenTrack ? { userId: this.peerUserId } : { user: { userId: this.peerUserId }, mediaType: event.track.kind });
      };
    };
    pc.onconnectionstatechange = () => {
      this.emit('onConnectionStateChanged', { state: pc.connectionState, peerUserId: this.peerUserId });
      if (pc.connectionState === 'connected') {
        this.clearConnectionTimer();
        void this.emitSelectedCandidatePair(pc);
      }
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
        this.emit('onUserLeft', { user: { userId: this.peerUserId } });
      }
    };
    pc.oniceconnectionstatechange = () => {
      this.emit('onIceConnectionStateChanged', { state: pc.iceConnectionState, peerUserId: this.peerUserId });
    };

    if (shouldOffer) await this.createAndSendOffer();
    this.startConnectionTimer();
  }

  private async createAndSendOffer(): Promise<void> {
    if (!this.peerConnection || this.creatingOffer || this.peerConnection.signalingState !== 'stable') return;
    this.creatingOffer = true;
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      if (this.authInfo?.webrtc?.trickleIce !== false) await this.sendCurrentDescription();
    } finally {
      this.creatingOffer = false;
    }
  }

  private async sendCurrentDescription(): Promise<void> {
    const description = this.peerConnection?.localDescription;
    if (!description || this.localDescriptionSent) return;
    this.localDescriptionSent = true;
    await this.sendSignal({
      kind: description.type === 'offer' ? 'offer' : 'answer',
      description: { type: description.type, sdp: description.sdp || undefined },
    });
  }

  /** Invoked by RTCModule when a DC_RTC_WEBRTC_SIGNAL arrives over RTM. */
  public async handleSignalEnvelope(envelope: WebRTCSignalEnvelope, senderUserId: string, channelId?: string): Promise<void> {
    const signal = await this.unwrapSignal(envelope, senderUserId, channelId);
    const signalId = envelope.signalId;
    if (signalId) {
      this.evictExpiredAcceptedSignals();
      const key = `${senderUserId}:${signalId}`;
      if (this.acceptedSignalIds.has(key)) return;
      this.acceptedSignalIds.set(key, Date.now() + 5 * 60 * 1000);
    }
    await this.handleSignal(signal, senderUserId, channelId);
  }

  /** Reassembles RTM-sized chunks before verifying and decrypting the signal. */
  public async handleSignalChunk(chunk: WebRTCSignalChunk, senderUserId: string, channelId?: string): Promise<void> {
    if (!Number.isInteger(chunk.chunkIndex) || !Number.isInteger(chunk.chunkCount) ||
      chunk.chunkIndex < 0 || chunk.chunkIndex >= chunk.chunkCount ||
      chunk.chunkCount <= 0 || chunk.chunkCount > WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNKS ||
      !chunk.signalId || typeof chunk.chunkData !== 'string' || typeof chunk.timestamp !== 'number') {
      throw new Error('[RTC:p2p] Invalid WebRTC signal chunk.');
    }
    if (Math.abs(Date.now() - chunk.timestamp) > 5 * 60 * 1000) {
      throw new Error('[RTC:p2p] WebRTC signal chunk is outside the accepted time window.');
    }
    if (this.authInfo?.webrtc?.encryptSignaling !== false) {
      if (!chunk.encrypted || !chunk.chunkSignature || !chunk.timestamp) {
        throw new Error('[RTC:p2p] Encrypted WebRTC signal chunk is incomplete.');
      }
      const senderPublicKey = Ed25519PubKey.edPubkeyFromStr(senderUserId);
      const valid = senderPublicKey.verify(
        this.chunkSigningBytes(channelId, chunk.signalId, chunk.timestamp, chunk.chunkIndex, chunk.chunkCount, chunk.chunkData),
        uint8ArrayFromString(chunk.chunkSignature, 'base64'),
      );
      if (!valid) throw new Error('[RTC:p2p] WebRTC signal chunk signature is invalid.');
    }
    this.evictExpiredSignalChunks();
    const key = `${senderUserId}:${chunk.signalId}`;
    let assembly = this.signalChunks.get(key);
    if (!assembly) {
      if (this.signalChunks.size >= WebRTCP2POperations.MAX_PENDING_SIGNAL_ASSEMBLIES) {
        throw new Error('[RTC:p2p] Too many incomplete WebRTC signal assemblies.');
      }
      assembly = {
        chunks: new Array(chunk.chunkCount),
        received: 0,
        expiresAt: Date.now() + 30000,
        envelope: {
          encrypted: chunk.encrypted,
          signature: chunk.signature,
          signalId: chunk.signalId,
          timestamp: chunk.timestamp,
        },
      };
      this.signalChunks.set(key, assembly);
    }
    if (assembly.chunks.length !== chunk.chunkCount) throw new Error('[RTC:p2p] Conflicting WebRTC signal chunks.');
    if (!assembly.chunks[chunk.chunkIndex]) {
      assembly.chunks[chunk.chunkIndex] = chunk.chunkData;
      assembly.received += 1;
    }
    if (assembly.received !== chunk.chunkCount) return;
    this.signalChunks.delete(key);
    const envelope = JSON.parse(assembly.chunks.join('')) as WebRTCSignalEnvelope;
    await this.handleSignalEnvelope(envelope, senderUserId, channelId);
  }

  private async handleSignal(signal: WebRTCSignal, senderUserId: string, channelId?: string): Promise<void> {
    if (!signal || !senderUserId) return;
    if (channelId && this.peerChannelId && channelId !== this.peerChannelId) return;
    if (this.peerUserId && senderUserId !== this.peerUserId) return;
    if (!this.peerUserId) this.peerUserId = senderUserId;
    if (!this.peerConnection) {
      this.pendingSignals.push({ signal, senderUserId });
      return;
    }
    await this.applySignal(signal, senderUserId);
  }

  private async applySignal(signal: WebRTCSignal, senderUserId: string): Promise<void> {
    if (!this.peerConnection || senderUserId !== this.peerUserId) return;
    if (signal.kind === 'bye') {
      await this.closePeerConnection(false);
      return;
    }
    if (signal.kind === 'offer' && signal.description) {
      await this.peerConnection.setRemoteDescription(signal.description);
      this.remoteDescriptionReady = true;
      await this.flushCandidates();
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      if (this.authInfo?.webrtc?.trickleIce !== false) await this.sendCurrentDescription();
      return;
    }
    if (signal.kind === 'answer' && signal.description) {
      await this.peerConnection.setRemoteDescription(signal.description);
      this.remoteDescriptionReady = true;
      await this.flushCandidates();
      return;
    }
    if (signal.kind === 'ice-candidate' && signal.candidate) {
      if (!this.remoteDescriptionReady) {
        this.pendingCandidates.push(signal.candidate);
      } else {
        await this.peerConnection.addIceCandidate(signal.candidate);
      }
    }
  }

  private async flushCandidates(): Promise<void> {
    if (!this.peerConnection) return;
    const candidates = this.pendingCandidates.splice(0);
    for (const candidate of candidates) await this.peerConnection.addIceCandidate(candidate);
  }

  private async sendSignal(signal: WebRTCSignal): Promise<void> {
    if (!this.peerUserId) return;
    const rtm = this.getRTMModule();
    if (!rtm) throw new Error('[RTC:p2p] RTM module is required for WebRTC signaling.');
    const timestamp = Date.now();
    const signalId = this.createSignalId();
    const payload: Record<string, unknown> = {
      type: 'DC_RTC_WEBRTC_SIGNAL',
      channelId: this.peerChannelId || this.authInfo?.channelId,
      signalId,
      timestamp,
    };
    if (this.authInfo?.webrtc?.encryptSignaling !== false) {
      const peerPublicKey = Ed25519PubKey.edPubkeyFromStr(this.peerUserId);
      const plaintext = new TextEncoder().encode(JSON.stringify(signal));
      const encrypted = await Encryption.encrypt(peerPublicKey.bytes(), plaintext);
      const content = uint8ArrayToString(encrypted, 'base64');
      const signature = await this.signSignal(payload.channelId as string | undefined, signalId, timestamp, content);
      payload.encrypted = true;
      payload.content = content;
      payload.signature = signature;
    } else {
      payload.signal = signal;
    }
    await this.sendSignalPayload(payload, rtm);
  }

  private getRTMModule(): any {
    return (this.context as any)?.getModule?.('rtm');
  }

  private localUserId(): string {
    return this.authInfo?.userId || this.context?.publicKey?.string() || '';
  }

  public async leaveChannel(): Promise<void> {
    await this.closePeerConnection(true);
  }

  private async closePeerConnection(notifyPeer: boolean): Promise<void> {
    if (notifyPeer && this.peerConnection && this.peerUserId) {
      try { await this.sendSignal({ kind: 'bye' }); } catch { /* peer may already be offline */ }
    }
    this.clearConnectionTimer();
    if (this.peerConnection) this.peerConnection.close();
    this.peerConnection = null;
    this.remoteDescriptionReady = false;
    this.localDescriptionSent = false;
    this.pendingCandidates = [];
    this.signalChunks.clear();
    this.acceptedSignalIds.clear();
    this.dataChannel?.close();
    this.dataChannel = null;
    this.remoteStream?.getTracks().forEach(track => track.stop());
    this.remoteStream = null;
    this.remoteScreenStream?.getTracks().forEach(track => track.stop());
    this.remoteScreenStream = null;
    this.remotePlaybackElements.clear();
    this.remoteScreenPlaybackElements.clear();
    if (this.remoteAudioElement) {
      this.remoteAudioElement.srcObject = null;
      this.remoteAudioElement.remove();
      this.remoteAudioElement = null;
    }
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;
    this.screenTrack = null;
    this.audioSender = null;
    this.cameraSender = null;
    this.screenSender = null;
    this.screenTransceiver = null;
    this.joined = false;
  }

  public async getChannelUsers(channelId?: string): Promise<string[]> {
    if (channelId && channelId !== this.authInfo?.channelId) return [];
    const users = this.localUserId() ? [this.localUserId()] : [];
    if (this.peerConnection && this.peerUserId && this.peerConnection.connectionState === 'connected') users.push(this.peerUserId);
    return users;
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    this.localCameraMuted = mute;
    if (!mute && !this.localStream?.getVideoTracks().length) await this.addLocalTrack('video');
    this.localStream?.getVideoTracks().forEach(track => { track.enabled = !mute; });
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    this.localMicMuted = mute;
    if (!mute && !this.localStream?.getAudioTracks().length) await this.addLocalTrack('audio');
    this.localStream?.getAudioTracks().forEach(track => { track.enabled = !mute; });
  }

  public async muteRemoteAudio(mute: boolean): Promise<void> {
    this.remoteAudioMuted = mute;
    this.remotePlaybackElements.forEach(element => { element.muted = mute; });
    if (this.remoteAudioElement) this.remoteAudioElement.muted = mute;
  }

  public async getCameras(): Promise<IRTCCameraDevice[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput').map(device => ({
      deviceId: device.deviceId,
      label: device.label,
      kind: device.kind,
      groupId: device.groupId,
    }));
  }

  public async switchCamera(deviceId: string): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('[RTC:p2p] getUserMedia is unavailable.');
    const replacement = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } }, audio: false });
    const track = replacement.getVideoTracks()[0];
    if (!track) throw new Error('[RTC:p2p] Camera track was not created.');
    const sender = this.cameraSender;
    if (sender) await sender.replaceTrack(track);
    const old = this.localStream?.getVideoTracks()[0];
    if (old) old.stop();
    if (!this.localStream) this.localStream = new MediaStream();
    if (old) this.localStream.removeTrack(old);
    this.localStream.addTrack(track);
    track.enabled = !this.localCameraMuted;
    this.localPlaybackElement = this.resolvePlaybackElement(this.localVideoElement, this.localPlaybackElement);
    this.bindMediaElement(this.localPlaybackElement, this.localStream, true);
  }

  public async startScreenShare(config?: IRTCScreenShareConfig): Promise<void> {
    if (!this.screenSender) throw new Error('[RTC:p2p] Join a peer session before starting screen share.');
    if (this.screenTrack) await this.stopScreenShare();
    const mediaDevices = navigator.mediaDevices as MediaDevices & { getDisplayMedia?: (constraints?: MediaStreamConstraints) => Promise<MediaStream> };
    if (!mediaDevices?.getDisplayMedia) throw new Error('[RTC:p2p] Screen sharing is not supported by this browser.');
    const displayStream = await mediaDevices.getDisplayMedia({ video: config || true, audio: false });
    const track = displayStream.getVideoTracks()[0];
    if (!track) throw new Error('[RTC:p2p] Screen track was not created.');
    const sender = this.screenSender;
    if (sender) await sender.replaceTrack(track);
    this.screenTrack = track;
    track.onended = () => { void this.stopScreenShare(); };
    this.emit('onLocalScreenShareStarted', { track });
  }

  public async stopScreenShare(): Promise<void> {
    if (!this.screenTrack) return;
    const track = this.screenTrack;
    this.screenTrack = null;
    if (this.screenSender) await this.screenSender.replaceTrack(null);
    track.stop();
    this.emit('onLocalScreenShareStopped');
  }

  public async setDisplayRemoteScreenShare(userId: string, element: HTMLElement | null): Promise<void> {
    if (!element) {
      this.remoteScreenElements.delete(userId);
      this.remoteScreenPlaybackElements.delete(userId);
      return;
    }
    this.remoteScreenElements.set(userId, element);
    const playback = this.resolvePlaybackElement(element, this.remoteScreenPlaybackElements.get(userId) || null);
    if (playback) this.remoteScreenPlaybackElements.set(userId, playback);
    this.bindMediaElement(playback, this.remoteScreenStream, false);
  }

  public async setDisplayRemoteVideo(userId: string, element: HTMLElement | null, _streamType = 1): Promise<void> {
    if (!element) {
      this.remoteVideoElements.delete(userId);
      this.remotePlaybackElements.delete(userId);
      return;
    }
    this.remoteVideoElements.set(userId, element);
    const playback = this.resolvePlaybackElement(element, this.remotePlaybackElements.get(userId) || null);
    if (playback) this.remotePlaybackElements.set(userId, playback);
    this.bindMediaElement(playback, this.remoteStream, false);
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    this.localVideoElement = element;
    this.localPlaybackElement = this.resolvePlaybackElement(element, this.localPlaybackElement);
    this.bindMediaElement(this.localPlaybackElement, this.localStream, true);
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck = true, sendOffline = false): Promise<'success' | 'offline' | 'failed'> {
    if (userId === this.peerUserId && this.dataChannel?.readyState === 'open') {
      try {
        this.dataChannel.send(message);
        return 'success';
      } catch { /* Use RTM as a continuity fallback during channel transition. */ }
    }
    const rtm = this.getRTMModule();
    if (!rtm) return 'failed';
    try { return await rtm.sendMessageToPeer(userId, message, requireAck, sendOffline); } catch { return 'failed'; }
  }

  public async sendMessageToSession(message: string): Promise<void> {
    if (!this.peerUserId) throw new Error('[RTC:p2p] No peer is connected.');
    const result = await this.sendMessageToPeer(this.peerUserId, message, false, false);
    if (result !== 'success') throw new Error(`[RTC:p2p] RTM message failed: ${result}`);
  }

  public async createRTCChannel(_userIds: string[], _channelDescription?: string, _rtcConfig?: IRTCStreamConfig): Promise<string> {
    throw new Error('[RTC:p2p] Use callPeer() to establish a point-to-point session.');
  }

  public async parseRTCChannelInvite(_inviteMsg: RTCChannelInviteMessage): Promise<{ channelId: string; channelDescription?: string; rtcConfig?: IRTCStreamConfig }> {
    throw new Error('[RTC:p2p] Invite parsing is handled by RTCModule.');
  }

  public async callPeer(): Promise<string> { throw new Error('[RTC:p2p] Call signaling is handled by RTCModule.'); }
  public async acceptCall(): Promise<void> { throw new Error('[RTC:p2p] Call signaling is handled by RTCModule.'); }
  public async rejectCall(): Promise<void> { throw new Error('[RTC:p2p] Call signaling is handled by RTCModule.'); }
  public async endCall(): Promise<void> { throw new Error('[RTC:p2p] Call signaling is handled by RTCModule.'); }
  public async createPersistentSession(): Promise<string> { throw new Error('[RTC:p2p] Session signaling is handled by RTCModule.'); }
  public async acceptPersistentSession(): Promise<void> { throw new Error('[RTC:p2p] Session signaling is handled by RTCModule.'); }

  public on(event: string, callback: RTCGenericEventCallback): void {
    const list = this.eventListeners.get(event) || [];
    list.push(callback);
    this.eventListeners.set(event, list);
  }

  public off(event: string, callback: RTCGenericEventCallback): void {
    const list = this.eventListeners.get(event);
    if (!list) return;
    const index = list.indexOf(callback);
    if (index >= 0) list.splice(index, 1);
  }

  public destroy(): void {
    void this.leaveChannel();
    this.eventListeners.clear();
    this.authInfo = null;
    this.peerUserId = '';
    this.peerChannelId = '';
  }

  private bindMediaElement(element: HTMLMediaElement | null, stream: MediaStream | null, muted: boolean): void {
    if (!element || !stream) return;
    try {
      element.srcObject = stream;
      element.autoplay = true;
      (element as HTMLVideoElement).playsInline = true;
      element.muted = muted || this.remoteAudioMuted;
      void element.play().catch(() => {});
    } catch { /* stale or non-video DOM element */ }
  }

  private async addLocalTrack(kind: 'audio' | 'video'): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('[RTC:p2p] getUserMedia is unavailable.');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: kind === 'audio',
      video: kind === 'video',
    });
    const track = kind === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];
    if (!track) throw new Error(`[RTC:p2p] ${kind} track was not created.`);
    if (!this.localStream) this.localStream = new MediaStream();
    this.localStream.addTrack(track);
    const sender = kind === 'audio' ? this.audioSender : this.cameraSender;
    if (sender) await sender.replaceTrack(track);
    if (kind === 'video') {
      this.localPlaybackElement = this.resolvePlaybackElement(this.localVideoElement, this.localPlaybackElement);
      this.bindMediaElement(this.localPlaybackElement, this.localStream, true);
    }
  }

  private emit(event: string, ...args: any[]): void {
    this.eventListeners.get(event)?.slice().forEach(callback => {
      try { callback(...args); } catch { /* user callback must not break signaling */ }
    });
  }

  private startConnectionTimer(): void {
    this.clearConnectionTimer();
    const timeout = this.authInfo?.webrtc?.connectionTimeoutMs ?? 20000;
    this.connectionTimer = setTimeout(() => {
      if (this.peerConnection && this.peerConnection.connectionState !== 'connected') {
        this.emit('onConnectionTimeout', { peerUserId: this.peerUserId, timeoutMs: timeout });
      }
    }, timeout);
  }

  private clearConnectionTimer(): void {
    if (this.connectionTimer) clearTimeout(this.connectionTimer);
    this.connectionTimer = null;
  }

  private async sendSignalPayload(payload: Record<string, unknown>, rtm: any): Promise<void> {
    const serialized = JSON.stringify(payload);
    if (serialized.length <= WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNK_SIZE) {
      const result = await rtm.sendMessageToPeer(this.peerUserId, serialized, false, false);
      if (result !== 'success') throw new Error(`[RTC:p2p] RTM signaling failed: ${result}`);
      return;
    }
    const signalId = payload.signalId as string;
    const channelId = payload.channelId as string | undefined;
    const chunkCount = Math.ceil(serialized.length / WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNK_SIZE);
    if (chunkCount > WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNKS) {
      throw new Error('[RTC:p2p] WebRTC signal exceeds the maximum RTM signaling size.');
    }
    for (let index = 0; index < chunkCount; index += 1) {
      const chunkPayload = {
        type: 'DC_RTC_WEBRTC_SIGNAL_CHUNK',
        channelId,
        signalId,
        encrypted: payload.encrypted,
        signature: payload.signature,
        timestamp: payload.timestamp,
        chunkIndex: index,
        chunkCount,
        chunkData: serialized.slice(index * WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNK_SIZE, (index + 1) * WebRTCP2POperations.MAX_RTM_SIGNAL_CHUNK_SIZE),
        chunkSignature: undefined as string | undefined,
      };
      if (this.authInfo?.webrtc?.encryptSignaling !== false) {
        chunkPayload.chunkSignature = await this.signChunk(
          channelId,
          signalId,
          payload.timestamp as number,
          index,
          chunkCount,
          chunkPayload.chunkData,
        );
      }
      const result = await rtm.sendMessageToPeer(this.peerUserId, JSON.stringify(chunkPayload), false, false);
      if (result !== 'success') throw new Error(`[RTC:p2p] RTM signaling chunk ${index + 1}/${chunkCount} failed: ${result}`);
    }
  }

  private resolvePlaybackElement(container: HTMLElement | null, existing: HTMLMediaElement | null): HTMLMediaElement | null {
    if (!container || typeof HTMLMediaElement === 'undefined') return null;
    if (container instanceof HTMLMediaElement) return container;
    if (existing?.parentElement === container) return existing;
    if (typeof document === 'undefined') return null;
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    container.appendChild(video);
    return video;
  }

  private ensureRemoteAudioElement(): HTMLAudioElement | null {
    if (this.remoteAudioElement?.isConnected) return this.remoteAudioElement;
    if (typeof document === 'undefined') return null;
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.style.display = 'none';
    document.body?.appendChild(audio);
    this.remoteAudioElement = audio;
    return audio;
  }

  private evictExpiredSignalChunks(): void {
    const now = Date.now();
    this.signalChunks.forEach((assembly, key) => {
      if (assembly.expiresAt <= now) this.signalChunks.delete(key);
    });
  }

  private evictExpiredAcceptedSignals(): void {
    const now = Date.now();
    this.acceptedSignalIds.forEach((expiresAt, key) => {
      if (expiresAt <= now) this.acceptedSignalIds.delete(key);
    });
  }

  private async emitSelectedCandidatePair(pc: RTCPeerConnection): Promise<void> {
    try {
      const stats = await pc.getStats();
      let selectedPair: any;
      stats.forEach((report: any) => {
        if (report.type === 'candidate-pair' && report.state === 'succeeded' && (report.nominated || report.selected)) {
          selectedPair = report;
        }
      });
      if (!selectedPair) return;
      const local = selectedPair.localCandidateId ? stats.get(selectedPair.localCandidateId) as any : undefined;
      const remote = selectedPair.remoteCandidateId ? stats.get(selectedPair.remoteCandidateId) as any : undefined;
      const localCandidateType = local?.candidateType;
      const remoteCandidateType = remote?.candidateType;
      this.emit('onSelectedCandidatePair', {
        peerUserId: this.peerUserId,
        localCandidateType,
        remoteCandidateType,
        transport: localCandidateType === 'relay' || remoteCandidateType === 'relay' ? 'turn-relay' : 'direct',
      });
    } catch { /* getStats is diagnostic-only and must not affect the call. */ }
  }

  private attachDataChannel(channel: RTCDataChannel): void {
    if (this.dataChannel && this.dataChannel !== channel) this.dataChannel.close();
    this.dataChannel = channel;
    channel.onopen = () => this.emit('onDataChannelStateChanged', { state: 'open', peerUserId: this.peerUserId });
    channel.onclose = () => this.emit('onDataChannelStateChanged', { state: 'closed', peerUserId: this.peerUserId });
    channel.onerror = () => this.emit('onDataChannelStateChanged', { state: 'error', peerUserId: this.peerUserId });
    channel.onmessage = event => {
      const message = typeof event.data === 'string' ? event.data : String(event.data);
      this.emit('onMessageReceived', { message, userId: this.peerUserId, publisher: this.peerUserId, channelId: this.peerChannelId });
    };
  }

  private async unwrapSignal(envelope: WebRTCSignalEnvelope, senderUserId: string, channelId?: string): Promise<WebRTCSignal> {
    if (!envelope.encrypted) {
      if (this.authInfo?.webrtc?.encryptSignaling !== false) {
        throw new Error('[RTC:p2p] Rejected unsigned plaintext WebRTC signal.');
      }
      if (!envelope.signal) throw new Error('[RTC:p2p] Signal payload is missing.');
      return envelope.signal;
    }
    if (!envelope.content || !envelope.signature || !envelope.signalId || !envelope.timestamp) {
      throw new Error('[RTC:p2p] Encrypted signal envelope is incomplete.');
    }
    if (Math.abs(Date.now() - envelope.timestamp) > 5 * 60 * 1000) {
      throw new Error('[RTC:p2p] WebRTC signal is outside the accepted time window.');
    }
    const senderPublicKey = Ed25519PubKey.edPubkeyFromStr(senderUserId);
    const verified = senderPublicKey.verify(
      this.signalSigningBytes(channelId, envelope.signalId, envelope.timestamp, envelope.content),
      uint8ArrayFromString(envelope.signature, 'base64'),
    );
    if (!verified) throw new Error('[RTC:p2p] WebRTC signal signature is invalid.');
    const privateKey = this.context?.privateKey?.raw;
    if (!privateKey) throw new Error('[RTC:p2p] Private key is unavailable for signal decryption.');
    const decrypted = await Encryption.decrypt(privateKey, uint8ArrayFromString(envelope.content, 'base64'));
    return JSON.parse(new TextDecoder().decode(decrypted)) as WebRTCSignal;
  }

  private async signSignal(channelId: string | undefined, signalId: string, timestamp: number, content: string): Promise<string> {
    if (!this.context?.sign) throw new Error('[RTC:p2p] Signing key is unavailable for encrypted WebRTC signaling.');
    const signature = await this.context.sign(this.signalSigningBytes(channelId, signalId, timestamp, content));
    return uint8ArrayToString(signature, 'base64');
  }

  private async signChunk(channelId: string | undefined, signalId: string, timestamp: number, index: number, count: number, data: string): Promise<string> {
    if (!this.context?.sign) throw new Error('[RTC:p2p] Signing key is unavailable for encrypted WebRTC signaling.');
    const signature = await this.context.sign(this.chunkSigningBytes(channelId, signalId, timestamp, index, count, data));
    return uint8ArrayToString(signature, 'base64');
  }

  private signalSigningBytes(channelId: string | undefined, signalId: string, timestamp: number, content: string): Uint8Array {
    return new TextEncoder().encode(['DC_RTC_WEBRTC_SIGNAL', channelId || '', signalId, String(timestamp), content].join('|'));
  }

  private chunkSigningBytes(channelId: string | undefined, signalId: string, timestamp: number, index: number, count: number, data: string): Uint8Array {
    return new TextEncoder().encode(['DC_RTC_WEBRTC_SIGNAL_CHUNK', channelId || '', signalId, String(timestamp), String(index), String(count), data].join('|'));
  }

  private createSignalId(): string {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  }
}
