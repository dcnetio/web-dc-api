import {
  AIProxyRealtimeAudioAuthInfo,
  AIProxyRealtimeAudioSocketLike,
  AIProxyRealtimeAudioSessionOptions,
  AIProxyRealtimeAudioSocketFactoryOptions,
  AIProxyRealtimeAudioWriteData,
  IAIProxyRealtimeAudioSession,
} from "../../common/types/types";

type TimerHandle = ReturnType<typeof setTimeout>;

interface RealtimeAudioConnectionOptions {
  url: string;
  protocols: string[];
  headers: Record<string, string>;
}

function describeCloseEvent(event: unknown): string {
  if (!event || typeof event !== "object") {
    return "close";
  }

  const closeLike = event as {
    code?: unknown;
    reason?: unknown;
    wasClean?: unknown;
    type?: unknown;
    target?: { url?: unknown; readyState?: unknown };
    currentTarget?: { url?: unknown; readyState?: unknown };
  };
  const target = closeLike.target || closeLike.currentTarget;
  const parts = [typeof closeLike.type === "string" ? closeLike.type : "close"];

  if (typeof closeLike.code === "number") {
    parts.push(`code=${closeLike.code}`);
  }
  if (typeof closeLike.reason === "string" && closeLike.reason) {
    parts.push(`reason=${closeLike.reason}`);
  }
  if (typeof closeLike.wasClean === "boolean") {
    parts.push(`wasClean=${closeLike.wasClean}`);
  }
  if (typeof target?.readyState === "number") {
    parts.push(`readyState=${target.readyState}`);
  }
  if (typeof target?.url === "string" && target.url) {
    parts.push(`url=${target.url}`);
  }

  return parts.join(", ");
}

const DEFAULT_CONNECT_TIMEOUT_MS = 15000;
const DEFAULT_REFRESH_BEFORE_MS = 60000;
const DEFAULT_RECONNECT_DELAY_MS = 1000;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;

function toRealtimeAudioError(
  error: unknown,
  fallbackMessage: string,
): Error {
  if (error instanceof Error) {
    return error;
  }

  if (error && typeof error === "object") {
    const eventLike = error as {
      type?: unknown;
      message?: unknown;
      target?: { readyState?: unknown; url?: unknown };
      currentTarget?: { readyState?: unknown; url?: unknown };
    };
    const target = eventLike.target || eventLike.currentTarget;
    const typeText = typeof eventLike.type === "string" ? eventLike.type : "";
    const readyStateText =
      typeof target?.readyState === "number"
        ? `, readyState=${target.readyState}`
        : "";
    const urlText =
      typeof target?.url === "string" && target.url
        ? `, url=${target.url}`
        : "";
    const messageText =
      typeof eventLike.message === "string" && eventLike.message.trim()
        ? `, message=${eventLike.message.trim()}`
        : "";

    if (typeText || readyStateText || urlText || messageText) {
      return new Error(
        `${fallbackMessage}: ${typeText || "event"}${readyStateText}${urlText}${messageText}`,
      );
    }
  }

  return new Error(fallbackMessage);
}

export class AIProxyRealtimeAudioSession
  implements IAIProxyRealtimeAudioSession
{
  private readonly options: AIProxyRealtimeAudioSessionOptions;
  private readonly fetchAuthInfo: (
    forceRefresh: boolean,
  ) => Promise<AIProxyRealtimeAudioAuthInfo>;
  private socket: AIProxyRealtimeAudioSocketLike | null = null;
  private connectPromise: Promise<void> | null = null;
  private refreshTimer: TimerHandle | null = null;
  private reconnectTimer: TimerHandle | null = null;
  private heartbeatTimer: TimerHandle | null = null;
  // Use 10s instead of 50s to prevent early WebSocket drops during long playback
  private heartbeatIntervalMs: number = 10000;
  private readonly outboundQueue: Array<string | Blob | ArrayBuffer> = [];
  private manualClose = false;
  private authExpiresAtMs: number | null = null;
  private currentAuthInfo: AIProxyRealtimeAudioAuthInfo | null = null;
  private abortListener: (() => void) | null = null;

  constructor(
    options: AIProxyRealtimeAudioSessionOptions,
    fetchAuthInfo: (forceRefresh: boolean) => Promise<AIProxyRealtimeAudioAuthInfo>,
  ) {
    this.options = options;
    this.fetchAuthInfo = fetchAuthInfo;
    this.bindAbortSignal();
  }

  get authInfo(): AIProxyRealtimeAudioAuthInfo | null {
    return this.currentAuthInfo;
  }

  get isConnected(): boolean {
    return this.socket?.readyState === SOCKET_OPEN;
  }

  get readyState(): number {
    return this.socket?.readyState ?? SOCKET_CLOSED;
  }

  async connect(): Promise<void> {
    if (this.connectPromise) {
      return this.connectPromise;
    }
    this.manualClose = false;
    this.connectPromise = this.connectInternal();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  async write(data: AIProxyRealtimeAudioWriteData): Promise<void> {
    const payload = this.normalizeWriteData(data);
    if (this.isConnected && this.socket) {
      this.socket.send(payload);
      return;
    }

    this.outboundQueue.push(payload);
    await this.connect();
  }

  async refreshAuth(
    forceRefresh: boolean = false,
  ): Promise<AIProxyRealtimeAudioAuthInfo> {
    const authInfo = await this.fetchAndStoreAuthInfo(forceRefresh);
    this.options.onAuthRefreshed?.(authInfo);

    const shouldReconnect =
      this.isConnected &&
      (authInfo.reconnectOnRefresh || this.options.reconnectOnAuthRefresh);
    if (shouldReconnect) {
      this.reconnect();
    }

    return authInfo;
  }

  close(code?: number, reason?: string): void {
    this.manualClose = true;
    this.clearTimers();
    this.removeAbortSignal();

    const currentSocket = this.socket;
    this.socket = null;
    if (
      currentSocket &&
      currentSocket.readyState !== SOCKET_CLOSING &&
      currentSocket.readyState !== SOCKET_CLOSED
    ) {
      currentSocket.close(code, reason);
    }
  }

  private async connectInternal(): Promise<void> {
    this.options.context?.signal?.throwIfAborted();
    const authInfo = await this.ensureAuthInfo();
    const connectionOptions = this.buildConnectionOptions(authInfo);
    const socket = this.createSocket(connectionOptions, authInfo);
    this.socket = socket;
    socket.binaryType = "arraybuffer";

    await new Promise<void>((resolve, reject) => {
      const connectTimeoutMs =
        this.options.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
      let timeoutHandle: TimerHandle | null = null;

      const cleanup = () => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("error", handleError);
        socket.removeEventListener("close", handleCloseBeforeOpen);
      };

      const handleOpen = () => {
        cleanup();
        this.attachSocketListeners(socket);
        this.flushQueue();
        this.startHeartbeat();
        this.options.onConnected?.(this, authInfo);
        resolve();
      };

      const handleError = (event: Event) => {
        cleanup();
        const error = toRealtimeAudioError(event, "实时音频 WebSocket 连接失败");
        this.options.onError?.(event);
        reject(error);
      };

      const handleCloseBeforeOpen = (event: unknown) => {
        cleanup();
        reject(
          new Error(`实时音频 WebSocket 握手阶段被关闭: ${describeCloseEvent(event)}`),
        );
      };

      timeoutHandle = setTimeout(() => {
        cleanup();
        try {
          socket.close();
        } catch {
          // noop
        }
        reject(new Error("实时音频 WebSocket 连接超时"));
      }, connectTimeoutMs);

      socket.addEventListener("open", handleOpen, { once: true });
      socket.addEventListener("error", handleError, { once: true });
      socket.addEventListener("close", handleCloseBeforeOpen, { once: true });
    });
  }

  private attachSocketListeners(socket: AIProxyRealtimeAudioSocketLike): void {
    socket.onmessage = (event) => {
      const data = event.data as string | ArrayBuffer | Blob;
      this.options.onMessage?.(data, event);

      if (typeof data === "string") {
        try {
          this.options.onJsonMessage?.(JSON.parse(data), event);
        } catch {
          // ignore non-json messages
        }
      }
    };

    socket.onerror = (event) => {
      this.options.onError?.(event);
    };

    socket.onclose = (event) => {
      if (this.socket === socket) {
        this.socket = null;
        this.stopHeartbeat();
      }
      this.options.onClose?.(event);

      if (
        !this.manualClose &&
        this.options.autoReconnect !== false &&
        !this.options.context?.signal?.aborted
      ) {
        this.scheduleReconnect();
      }
    };
  }

  private async ensureAuthInfo(): Promise<AIProxyRealtimeAudioAuthInfo> {
    if (this.currentAuthInfo && !this.isAuthExpiringSoon()) {
      return this.currentAuthInfo;
    }
    return this.fetchAndStoreAuthInfo(this.options.forceRefresh ?? false);
  }

  private async fetchAndStoreAuthInfo(
    forceRefresh: boolean,
  ): Promise<AIProxyRealtimeAudioAuthInfo> {
    const authInfo = await this.fetchAuthInfo(forceRefresh);
    this.currentAuthInfo = authInfo;
    this.authExpiresAtMs = this.resolveAuthExpiresAtMs(authInfo);
    this.scheduleRefresh();
    return authInfo;
  }

  private resolveAuthExpiresAtMs(
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ): number | null {
    const explicitExpire = this.normalizeTimestamp(authInfo.expiresAt);
    if (explicitExpire) {
      return explicitExpire;
    }

    if (typeof authInfo.expiresIn === "number" && Number.isFinite(authInfo.expiresIn)) {
      return Date.now() + authInfo.expiresIn * 1000;
    }

    const authorizationHeader = authInfo.headers?.Authorization || authInfo.headers?.authorization;
    const bearerCredential = this.extractBearerCredential(authorizationHeader);
    const jwtExpire = this.extractJwtExpiresAt(
      authInfo.tempToken ||
        authInfo.token ||
        authInfo.tempApiKey ||
        authInfo.apiKey ||
        bearerCredential,
    );
    return jwtExpire;
  }

  private normalizeTimestamp(value?: number | string): number | null {
    if (value == null) {
      return null;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const numericValue = Number(trimmed);
      if (Number.isFinite(numericValue)) {
        return this.normalizeTimestamp(numericValue);
      }
      const dateValue = Date.parse(trimmed);
      return Number.isFinite(dateValue) ? dateValue : null;
    }

    if (!Number.isFinite(value)) {
      return null;
    }

    if (value > 1_000_000_000_000) {
      return value;
    }
    if (value > 1_000_000_000) {
      return value * 1000;
    }
    return null;
  }

  private extractJwtExpiresAt(token?: string): number | null {
    if (!token) {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payloadText = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadText) as { exp?: number };
      if (typeof payload.exp !== "number") {
        return null;
      }
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  private isAuthExpiringSoon(): boolean {
    if (!this.authExpiresAtMs) {
      return false;
    }
    const refreshBeforeMs =
      this.options.refreshBeforeMs ?? DEFAULT_REFRESH_BEFORE_MS;
    return Date.now() + refreshBeforeMs >= this.authExpiresAtMs;
  }

  private scheduleRefresh(): void {
    if (!this.authExpiresAtMs) {
      return;
    }

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    const refreshBeforeMs =
      this.options.refreshBeforeMs ?? DEFAULT_REFRESH_BEFORE_MS;
    const delayMs = Math.max(this.authExpiresAtMs - Date.now() - refreshBeforeMs, 1000);

    this.refreshTimer = setTimeout(() => {
      this.refreshAuth(true).catch((error) => {
        this.options.onError?.(toRealtimeAudioError(error, "实时音频鉴权刷新失败"));
      });
    }, delayMs);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    const reconnectDelayMs =
      this.options.reconnectDelayMs ?? DEFAULT_RECONNECT_DELAY_MS;
    this.reconnectTimer = setTimeout(() => {
      this.reconnect();
    }, reconnectDelayMs);
  }

  private reconnect(): void {
    if (this.manualClose || this.connectPromise) {
      return;
    }

    const currentSocket = this.socket;
    this.socket = null;
    if (
      currentSocket &&
      currentSocket.readyState !== SOCKET_CLOSING &&
      currentSocket.readyState !== SOCKET_CLOSED
    ) {
      currentSocket.close();
    }

    void this.connect().catch((error) => {
      this.options.onError?.(toRealtimeAudioError(error, "实时音频重连失败"));
    });
  }

  private flushQueue(): void {
    if (!this.socket || this.socket.readyState !== SOCKET_OPEN) {
      return;
    }

    while (this.outboundQueue.length > 0) {
      const payload = this.outboundQueue.shift();
      if (payload != null) {
        this.socket.send(payload);
      }
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startHeartbeat(): void {
    // DashScope Realtime Audio has no explicit HeartBeat packet support,
    // and sending invalid JSON or unsupported 'action: HeartBeat' throws
    // a protocol error forcing an abrupt WebSocket closure after exactly 10s.
    // Instead of active ping, rely on keep-alive headers/TCP layer or
    // just avoid causing explicit protocol errors.
    this.stopHeartbeat();
  }

  private buildConnectionOptions(
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ): RealtimeAudioConnectionOptions {
    const rawUrl = authInfo.websocketUrl || authInfo.url || authInfo.endpoint;
    if (!rawUrl) {
      throw new Error("未获取到实时音频服务地址");
    }

    const url = new URL(this.normalizeWebSocketUrl(rawUrl));
    const headers = { ...(authInfo.headers || {}) };
    const protocols = [...(authInfo.protocols || [])];
    const authQueryName = authInfo.authQueryName;
    const supportsHandshakeHeaders = !!this.options.createWebSocket;

    for (const [key, value] of Object.entries(authInfo.query || {})) {
      url.searchParams.set(key, String(value));
    }

    const authorizationHeader = headers.Authorization || headers.authorization;
    const bearerCredential = this.extractBearerCredential(authorizationHeader);
    const credentialValue =
      authInfo.tempToken ||
      authInfo.token ||
      authInfo.tempApiKey ||
      authInfo.apiKey ||
      bearerCredential;

    if (authInfo.authMode === "bearer" && credentialValue && !headers.Authorization) {
      headers.Authorization = `Bearer ${credentialValue}`;
    }
    if (credentialValue) {
      if (authQueryName) {
        url.searchParams.set(authQueryName, credentialValue);
      }
    }

    if (!supportsHandshakeHeaders && authQueryName && credentialValue) {
      delete headers.Authorization;
      delete headers.authorization;
    }

    return {
      url: url.toString(),
      protocols,
      headers,
    };
  }

  private normalizeWebSocketUrl(value: string): string {
    if (value.startsWith("ws://") || value.startsWith("wss://")) {
      return value;
    }
    if (value.startsWith("https://")) {
      return `wss://${value.slice("https://".length)}`;
    }
    if (value.startsWith("http://")) {
      return `ws://${value.slice("http://".length)}`;
    }
    return value;
  }

  private extractBearerCredential(value?: string): string | undefined {
    if (!value) {
      return undefined;
    }
    const match = value.match(/^bearer\s+(.+)$/i);
    return match?.[1]?.trim() || undefined;
  }

  private createSocket(
    connectionOptions: RealtimeAudioConnectionOptions,
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ): AIProxyRealtimeAudioSocketLike {
    const { createWebSocket } = this.options;
    if (createWebSocket) {
      const options: AIProxyRealtimeAudioSocketFactoryOptions = {
        url: connectionOptions.url,
        protocols: connectionOptions.protocols,
        headers: connectionOptions.headers,
        authInfo,
      };
      return createWebSocket(options);
    }

    if (Object.keys(connectionOptions.headers).length > 0) {
      throw new Error(
        "当前运行环境使用原生 WebSocket，无法在握手时附带自定义请求头。请让代理返回 query 方式的鉴权参数，或传入 createWebSocket 自定义建连工厂。",
      );
    }

    if (connectionOptions.protocols.length > 0) {
      return new WebSocket(connectionOptions.url, connectionOptions.protocols);
    }
    return new WebSocket(connectionOptions.url);
  }

  private normalizeWriteData(
    data: AIProxyRealtimeAudioWriteData,
  ): string | Blob | ArrayBuffer {
    if (typeof data === "string" || data instanceof Blob || data instanceof ArrayBuffer) {
      return data;
    }

    if (ArrayBuffer.isView(data)) {
      return data.buffer instanceof ArrayBuffer
        ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice()
            .buffer;
    }

    return JSON.stringify(data);
  }

  private bindAbortSignal(): void {
    const signal = this.options.context?.signal;
    if (!signal) {
      return;
    }

    if (signal.aborted) {
      this.close(1000, "aborted");
      return;
    }

    this.abortListener = () => {
      this.close(1000, "aborted");
    };
    signal.addEventListener("abort", this.abortListener, { once: true });
  }

  private removeAbortSignal(): void {
    if (this.abortListener && this.options.context?.signal) {
      this.options.context.signal.removeEventListener("abort", this.abortListener);
      this.abortListener = null;
    }
  }

  private clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}