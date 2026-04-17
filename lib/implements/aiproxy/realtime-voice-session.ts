import {
  AIProxyRealtimeAudioAuthInfo,
  AIProxyRealtimeAudioSocketFactoryOptions,
  AIProxyRealtimeAudioSocketLike,
  AIProxyRealtimeAudioWriteData,
  AIProxyRealtimeSocketCloseEvent,
  AIProxyRealtimeSocketErrorEvent,
  AIProxyRealtimeSocketMessageEvent,
  AIProxyRealtimeVoiceAliyunProtocolOptions,
  AIProxyRealtimeVoiceBrowserAdapterOptions,
  AIProxyRealtimeVoiceInputContext,
  AIProxyRealtimeVoiceInputFrame,
  AIProxyRealtimeVoiceMiniProgramOptions,
  AIProxyRealtimeVoiceOutputFrame,
  AIProxyRealtimeVoiceProtocolAdapter,
  AIProxyRealtimeVoiceProtocolContext,
  AIProxyRealtimeVoiceRuntime,
  AIProxyRealtimeVoiceImageInput,
  AIProxyRealtimeVoiceImagePromptOptions,
  AIProxyRealtimeVoiceSessionOptions,
  AIProxyRealtimeVoiceStopOptions,
  AIProxyRealtimeVoiceTextInputOptions,
  AIProxyWechatMiniProgramAPI,
  IAIProxyRealtimeAudioSession,
  IAIProxyRealtimeVoiceInputAdapter,
  IAIProxyRealtimeVoiceOutputAdapter,
  IAIProxyRealtimeVoiceSession,
} from "../../common/types/types";

type SocketEventType = "open" | "message" | "error" | "close";
type TimerHandle = ReturnType<typeof setTimeout>;

interface VoiceTransportHooks {
  onConnected?: (
    session: IAIProxyRealtimeAudioSession,
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ) => void;
  onMessage?: (
    data: string | ArrayBuffer | Blob,
    event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ) => void;
  onJsonMessage?: (
    data: unknown,
    event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ) => void;
  onError?: (error: Error | Event | AIProxyRealtimeSocketErrorEvent) => void;
  onClose?: (event: CloseEvent | AIProxyRealtimeSocketCloseEvent) => void;
}

type VoiceTransportFactory = (
  hooks: VoiceTransportHooks,
) => Promise<IAIProxyRealtimeAudioSession>;

type ListenerEntry = {
  original: (event: unknown) => void;
  wrapped: (event: unknown) => void;
};

const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;
const DEFAULT_BROWSER_SAMPLE_RATE = 16000;
const DEFAULT_OUTPUT_SAMPLE_RATE = 24000;

function toRealtimeVoiceError(error: unknown): Error {
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
    const typeText = typeof eventLike.type === "string" ? eventLike.type : "event";
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

    return new Error(
      `实时语音事件异常: ${typeText}${readyStateText}${urlText}${messageText}`,
    );
  }

  return new Error(String(error));
}

export function resolveRealtimeVoiceRuntime(
  runtime: AIProxyRealtimeVoiceRuntime = "auto",
): Exclude<AIProxyRealtimeVoiceRuntime, "auto"> {
  if (runtime !== "auto") {
    return runtime;
  }

  const maybeWx = (globalThis as { wx?: unknown }).wx;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";

  if (maybeWx && !isBrowser) {
    return "mini-program";
  }
  if (/MicroMessenger/i.test(userAgent)) {
    return "wechat-browser";
  }
  if (isBrowser) {
    return "browser";
  }
  return "custom";
}

class WechatMiniProgramSocketLike implements AIProxyRealtimeAudioSocketLike {
  readyState = SOCKET_CONNECTING;
  binaryType: BinaryType | string = "arraybuffer";
  onmessage: ((event: MessageEvent | AIProxyRealtimeSocketMessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent | AIProxyRealtimeSocketCloseEvent) => void) | null = null;
  onerror: ((event: Event | Error | AIProxyRealtimeSocketErrorEvent) => void) | null = null;
  private readonly listeners: Record<SocketEventType, ListenerEntry[]> = {
    open: [],
    message: [],
    error: [],
    close: [],
  };

  constructor(
    private readonly socketTask: ReturnType<AIProxyWechatMiniProgramAPI["connectSocket"]>,
  ) {
    this.socketTask.onOpen((event) => {
      this.readyState = SOCKET_OPEN;
      this.emit("open", event);
    });

    this.socketTask.onMessage((event) => {
      const messageEvent: AIProxyRealtimeSocketMessageEvent = {
        ...(event as Record<string, unknown>),
        data: event.data,
        type: "message",
      };
      this.onmessage?.(messageEvent);
      this.emit("message", messageEvent);
    });

    this.socketTask.onError((event) => {
      const errorEvent: AIProxyRealtimeSocketErrorEvent = {
        ...(event as Record<string, unknown>),
        type: "error",
      };
      this.onerror?.(errorEvent);
      this.emit("error", errorEvent);
    });

    this.socketTask.onClose((event) => {
      this.readyState = SOCKET_CLOSED;
      const closeEvent: AIProxyRealtimeSocketCloseEvent = {
        ...(event as Record<string, unknown>),
        code: event.code,
        reason: event.reason,
        type: "close",
      };
      this.onclose?.(closeEvent);
      this.emit("close", closeEvent);
    });
  }

  addEventListener(
    type: SocketEventType,
    listener: (event: unknown) => void,
    options?: { once?: boolean },
  ): void {
    const wrapped = (event: unknown) => {
      if (options?.once) {
        this.removeEventListener(type, listener);
      }
      listener(event);
    };
    this.listeners[type].push({ original: listener, wrapped });
  }

  removeEventListener(type: SocketEventType, listener: (event: unknown) => void): void {
    this.listeners[type] = this.listeners[type].filter(
      (entry) => entry.original !== listener,
    );
  }

  send(data: string | Blob | ArrayBuffer): void {
    if (data instanceof Blob) {
      throw new Error("微信小程序 socket 默认工厂暂不支持直接发送 Blob，请先转换为 ArrayBuffer 或字符串");
    }
    this.socketTask.send({ data });
  }

  close(code?: number, reason?: string): void {
    if (this.readyState === SOCKET_CLOSING || this.readyState === SOCKET_CLOSED) {
      return;
    }
    this.readyState = SOCKET_CLOSING;
    this.socketTask.close({ code, reason });
  }

  private emit(type: SocketEventType, event: unknown): void {
    for (const entry of [...this.listeners[type]]) {
      entry.wrapped(event);
    }
  }
}

export function createWechatMiniProgramRealtimeSocketFactory(
  wxLike?: AIProxyWechatMiniProgramAPI,
): (options: AIProxyRealtimeAudioSocketFactoryOptions) => AIProxyRealtimeAudioSocketLike {
  const wxApi = resolveWechatMiniProgramAPI(wxLike);
  return (options: AIProxyRealtimeAudioSocketFactoryOptions) => {
    const socketTask = wxApi.connectSocket({
      url: options.url,
      protocols: options.protocols,
      header: options.headers,
    });
    return new WechatMiniProgramSocketLike(socketTask);
  };
}

export function createBrowserRealtimeVoiceInputAdapter(
  options: AIProxyRealtimeVoiceBrowserAdapterOptions = {},
): IAIProxyRealtimeVoiceInputAdapter {
  let audioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let processor: ScriptProcessorNode | null = null;
  let silentGain: GainNode | null = null;
  let stopped = false;
  let sequence = 0;
  let currentHoldFrames = 0;

  return {
    async start(context: AIProxyRealtimeVoiceInputContext): Promise<void> {
      if (processor) {
        return;
      }
      const mediaDevices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
      if (!mediaDevices?.getUserMedia) {
        throw new Error("当前环境不支持麦克风采集，请注入自定义 inputAdapter");
      }

      const AudioContextCtor = resolveAudioContextCtor();
      if (!AudioContextCtor) {
        throw new Error("当前环境不支持 AudioContext，请注入自定义 inputAdapter");
      }

      stopped = false;
      const targetSampleRate = options.sampleRate ?? DEFAULT_BROWSER_SAMPLE_RATE;
      stream = await mediaDevices.getUserMedia({
        audio: options.audioConstraints || {
          channelCount: options.channelCount ?? 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioContext = new AudioContextCtor();
      await audioContext.resume();
      source = audioContext.createMediaStreamSource(stream);
      processor = audioContext.createScriptProcessor(options.bufferSize ?? 4096, 1, 1);
      silentGain = audioContext.createGain();
      silentGain.gain.value = 0;

      processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (stopped) {
          return;
        }
        const inputBuffer = event.inputBuffer;
        const mono = mixToMono(inputBuffer);
        const noiseGateThreshold =
          typeof options.noiseGateThreshold === "number" && options.noiseGateThreshold > 0
            ? options.noiseGateThreshold
            : 0;
        const shouldEmitSilenceOnNoiseGate = options.emitSilenceOnNoiseGate === true;

        if (noiseGateThreshold > 0) {
          const currentRms = calculateRms(mono);
          if (currentRms >= noiseGateThreshold) {
            currentHoldFrames = 10; // ~1 second hold time at 4096 buffer/48kHz
          } else if (currentHoldFrames > 0) {
            currentHoldFrames--;
          }
        }

        const isGated = noiseGateThreshold > 0 && currentHoldFrames === 0;
        const gatedMono = isGated
            ? (shouldEmitSilenceOnNoiseGate ? new Float32Array(mono.length) : null)
            : mono;

        if (!gatedMono) {
          return;
        }
        const pcm16 = convertFloat32ToPcm16(
          gatedMono,
          inputBuffer.sampleRate,
          targetSampleRate,
        );
        if (pcm16.length === 0) {
          return;
        }
        const frame: AIProxyRealtimeVoiceInputFrame = {
          data: pcm16,
          format: "pcm16",
          sampleRate: targetSampleRate,
          channels: 1,
          sequence: sequence++,
          timestamp: Date.now(),
        };
        Promise.resolve(context.emitFrame(frame)).catch((error) => {
          context.emitError(error instanceof Error ? error : new Error(String(error)));
        });
      };

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(audioContext.destination);
    },
    async stop(): Promise<void> {
      stopped = true;
      processor?.disconnect();
      source?.disconnect();
      silentGain?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      processor = null;
      source = null;
      silentGain = null;
      stream = null;
      if (audioContext) {
        await audioContext.close();
        audioContext = null;
      }
    },
    async pause(): Promise<void> {
      stopped = true;
    },
    async resume(): Promise<void> {
      stopped = false;
    },
  };
}

export function createBrowserRealtimeVoiceOutputAdapter(): IAIProxyRealtimeVoiceOutputAdapter {
  let audioContext: AudioContext | null = null;
  let playheadTime = 0;
  const activeAudios = new Set<HTMLAudioElement>();
  const activeSources = new Set<AudioBufferSourceNode>();

  const ensureContext = async (): Promise<AudioContext> => {
    if (!audioContext) {
      const AudioContextCtor = resolveAudioContextCtor();
      if (!AudioContextCtor) {
        throw new Error("当前环境不支持音频播放，请注入自定义 outputAdapter");
      }
      audioContext = new AudioContextCtor();
    }
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    playheadTime = Math.max(playheadTime, audioContext.currentTime);
    return audioContext;
  };

  return {
    async start(): Promise<void> {
      await ensureContext();
    },
    async play(frame: AIProxyRealtimeVoiceOutputFrame): Promise<void> {
      if (typeof frame.data === "string") {
        await playAudioUrl(frame.data, activeAudios);
        return;
      }

      const context = await ensureContext();
      if (frame.data instanceof Blob && frame.format !== "pcm16" && frame.format !== "pcm-f32") {
        const arrayBuffer = await frame.data.arrayBuffer();
        const decodedBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
        playheadTime = scheduleDecodedBuffer(context, decodedBuffer, playheadTime, activeSources);
        return;
      }

      const sampleRate = frame.sampleRate ?? DEFAULT_OUTPUT_SAMPLE_RATE;
      const channels = Math.max(frame.channels ?? 1, 1);
      const audioBuffer = createPcmAudioBuffer(context, frame, sampleRate, channels);
      playheadTime = scheduleDecodedBuffer(context, audioBuffer, playheadTime, activeSources);
    },
    async stop(): Promise<void> {
      for (const audio of [...activeAudios]) {
        audio.pause();
        activeAudios.delete(audio);
      }
      for (const source of [...activeSources]) {
        source.stop();
        activeSources.delete(source);
      }
      playheadTime = 0;
      if (audioContext) {
        await audioContext.close();
        audioContext = null;
      }
    },
    async clear(): Promise<void> {
      for (const audio of [...activeAudios]) {
        audio.pause();
        activeAudios.delete(audio);
      }
      for (const source of [...activeSources]) {
        source.stop();
        activeSources.delete(source);
      }
      playheadTime = audioContext ? audioContext.currentTime : 0;
    },
  };
}

export function createWechatMiniProgramVoiceInputAdapter(
  options: AIProxyRealtimeVoiceMiniProgramOptions = {},
): IAIProxyRealtimeVoiceInputAdapter {
  const wxApi = resolveWechatMiniProgramAPI(options.wx);
  const recorderManager = wxApi.getRecorderManager?.();
  if (!recorderManager) {
    throw new Error("当前微信小程序环境未提供 RecorderManager，请注入自定义 inputAdapter");
  }

  let contextRef: AIProxyRealtimeVoiceInputContext | null = null;
  let sequence = 0;

  recorderManager.onError((event) => {
    contextRef?.emitError(new Error(`微信小程序录音失败: ${JSON.stringify(event)}`));
  });
  recorderManager.onFrameRecorded?.((event) => {
    const frame: AIProxyRealtimeVoiceInputFrame = {
      data: event.frameBuffer,
      format: "pcm16",
      sequence: sequence++,
      timestamp: Date.now(),
    };
    Promise.resolve(contextRef?.emitFrame(frame)).catch((error) => {
      contextRef?.emitError(error instanceof Error ? error : new Error(String(error)));
    });
  });

  return {
    async start(context: AIProxyRealtimeVoiceInputContext): Promise<void> {
      contextRef = context;
      recorderManager.start({
        format: "pcm",
        frameSize: 2,
        ...(options.recorderOptions || {}),
      });
    },
    async stop(): Promise<void> {
      recorderManager.stop();
      contextRef = null;
    },
    async pause(): Promise<void> {
      recorderManager.pause?.();
    },
    async resume(): Promise<void> {
      recorderManager.resume?.();
    },
  };
}

export function createAliyunRealtimeVoiceProtocolAdapter(
  options: AIProxyRealtimeVoiceAliyunProtocolOptions = {},
): AIProxyRealtimeVoiceProtocolAdapter {
  const inputAudioFormat = options.inputAudioFormat || "pcm16";
  const outputAudioFormat = options.outputAudioFormat || "pcm16";
  const actualModel = options.model || "paraformer-realtime-v2";

  let taskId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const wrap = (action: "run-task" | "finish-task", inputPayload: any = {}) => {
    let parameters: any = {
      format: inputAudioFormat === 'pcm16' ? 'pcm' : inputAudioFormat,
      sample_rate: actualModel.includes('8k') ? 8000 : (options.session?.sample_rate || 16000),
      ...options.session,
    };
    
    // paraformer / sensevoice are ASR only, no text instructions or voices.
    if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
      delete parameters.instructions;
      delete parameters.voice;
      delete parameters.input_audio_format;
      delete parameters.output_audio_format;
    }

    return JSON.stringify({
      header: {
        action: action,
        task_id: taskId,
        streaming: "duplex",
      },
      payload: {
        task_group: "audio",
        task: actualModel.includes("cosyvoice") || actualModel.includes("sambert") ? "tts" : "asr",
        function: actualModel.includes("cosyvoice") || actualModel.includes("sambert") ? "synthesis" : "recognition",
        model: actualModel,
        ...(action === "run-task" ? {
          parameters
        } : {}),
        input: inputPayload,
      }
    });
  };

  return {
    buildConnectMessages() {
      taskId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
        return wrap("run-task", {});
      }
      
      const session = {
        input_audio_format: inputAudioFormat,
        output_audio_format: outputAudioFormat,
        ...(options.session || {}),
      };
      return wrap("run-task", {
        event_id: createRealtimeEventId(),
        type: "session.update",
        session,
      });
    },
    buildAudioInputMessages(frame) {
      if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
        return frame.data;
      }
      return wrap("run-task", {
        event_id: createRealtimeEventId(),
        type: "input_audio_buffer.append",
        audio: encodeBase64(frame.data),
      });
    },
    buildTextInputMessages(text) {
      if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
        return null;
      }
      return [
        wrap("run-task", {
          event_id: createRealtimeEventId(),
          type: "input_text_buffer.append",
          text,
        }),
        wrap("run-task", {
          event_id: createRealtimeEventId(),
          type: "input_text_buffer.commit",
        }),
      ];
    },
    buildCommitMessages() {
      if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
        return wrap("finish-task", {});
      }
      return wrap("run-task", {
        event_id: createRealtimeEventId(),
        type: "input_audio_buffer.commit",
      });
    },
    buildResponseCreateMessages() {
      if (actualModel.includes("paraformer") || actualModel.includes("sensevoice")) {
        return null;
      }
      return wrap("run-task", {
        event_id: createRealtimeEventId(),
        type: "response.create",
        ...(options.response ? { response: options.response } : {}),
      });
    },
    buildFinishMessages() {
      return wrap("finish-task", {});
    },
    extractOutputFrames(message, rawData) {
      if (rawData instanceof ArrayBuffer || rawData instanceof Blob) {
        return {
          data: rawData instanceof Blob ? new ArrayBuffer(0) : rawData,
          format: outputAudioFormat === "pcm" ? "pcm16" : outputAudioFormat,
          sampleRate: 16000,
          channels: 1,
          timestamp: Date.now(),
        };
      }

      if (!isPlainRecord(message)) {
        return null;
      }
      
      const header = isPlainRecord(message.header) ? message.header : {};
      const payload = isPlainRecord(message.payload) ? message.payload : message;
      
      if (payload.type === "response.audio.delta" && typeof payload.delta === "string") {
        return {
          data: decodeBase64(payload.delta),
          format: outputAudioFormat === "pcm" ? "pcm16" : outputAudioFormat,
          sampleRate: readAliyunSampleRate(payload, options),
          channels: 1,
          timestamp: Date.now(),
          metadata: message,
        };
      }
      
      return null;
    },
  };
}


export function createQwenMultimodalDialogAdapter(
  options: AIProxyRealtimeVoiceAliyunProtocolOptions = {},
): AIProxyRealtimeVoiceProtocolAdapter {
  let taskId = Math.random().toString(36).substring(2, 15);
  let dialogId = "";
  let listeningDialogId = "";
  const sessionRecord = isPlainRecord(options.session) ? options.session : {};
  const sessionClientInfo = isPlainRecord(sessionRecord.client_info)
    ? sessionRecord.client_info
    : null;
  const resolvedUserId = typeof sessionRecord.user_id === "string" && sessionRecord.user_id.trim()
    ? sessionRecord.user_id.trim()
    : typeof sessionClientInfo?.user_id === "string" && sessionClientInfo.user_id.trim()
      ? sessionClientInfo.user_id.trim()
      : "anonymous";
  const resolvedSampleRate = toOptionalSampleRate(options.session?.sample_rate) || 24000;
  const resolvedUpstreamMode = typeof options.session?.mode === "string" && options.session.mode.trim()
    ? options.session.mode.trim()
    : "duplex";
  const resolvedModalities = Array.isArray(options.modalities) && options.modalities.length > 0
    ? options.modalities
    : ["audio", "text"];
  const resolvedResponse = {
    ...(isPlainRecord(options.response) ? options.response : {}),
    modalities: resolvedModalities,
  };

  const wrap = (
    action: string,
    inputPayload: any,
    isStart = false,
    payloadOverrides?: Record<string, unknown>,
  ) => {
    return JSON.stringify({
      header: {
        action: action,
        task_id: taskId,
        streaming: "duplex",
      },
      payload: {
        ...(isStart ? {
          task_group: "aigc",
          task: "multimodal-generation",
          function: "generation",
          model: "multimodal-dialog"
        } : {}),
        input: inputPayload,
        ...(isStart ? {
          parameters: {
            modalities: resolvedModalities,
            upstream: {
              type: "AudioOnly",
              mode: resolvedUpstreamMode,
              ...(options.session?.input_audio_format ? { audio_format: options.session.input_audio_format === "pcm16" ? "pcm" : options.session.input_audio_format } : {}),
              ...(resolvedSampleRate ? { sample_rate: resolvedSampleRate } : {})
            },
            downstream: {
              sample_rate: resolvedSampleRate,
              ...(options.session?.output_audio_format ? { audio_format: options.session.output_audio_format === "pcm16" ? "pcm" : options.session.output_audio_format } : {}),
              ...(options.session?.voice ? { voice: options.session.voice } : {})
            },
            client_info: {
              user_id: resolvedUserId,
            },
            ...(options.session?.instructions ? {
                biz_params: {
                    user_prompt_params: {
                        prompt: options.session.instructions
                    }
                }
            } : {})
          }
        } : {}),
        ...(payloadOverrides || {})
      },
      ...(Object.keys(resolvedResponse).length > 0 ? { response: resolvedResponse } : {})
    });
  };

  return {
    buildConnectMessages() {
      taskId = Math.random().toString(36).substring(2, 15);
      const startInput: Record<string, unknown> = {
        directive: "Start",
        app_id: options.session?.app_id || "", 
      };

      if (typeof options.session?.workspace_id === "string" && options.session.workspace_id.trim()) {
        startInput.workspace_id = options.session.workspace_id.trim();
      }

      return wrap("run-task", startInput, true);
    },
    buildAudioInputMessages(frame) {
      // Audio is sent as pure binary stream for multimodal-dialog according to docs
      // "当前二进制消息仅包含音频数据。上传音频时，将原始音频直接转为二进制流即可，无需额外处理。"
      return frame.data;
    },
    buildTextInputMessages(text, _context, params) {
      const requestPayload = buildQwenMultimodalDialogRequestPayload(
        text,
        params,
        params?.images?.length ? listeningDialogId || dialogId : dialogId,
      );
      const mergedParameters = {
        modalities: resolvedModalities,
        ...(isPlainRecord(requestPayload.payloadOverrides?.parameters)
          ? requestPayload.payloadOverrides?.parameters
          : {}),
      };
      const mergedResponse = {
        ...resolvedResponse,
        ...(isPlainRecord(requestPayload.payloadOverrides?.response)
          ? requestPayload.payloadOverrides?.response
          : {}),
      };
      return [
        wrap("continue-task", requestPayload.input, false, {
          ...(requestPayload.payloadOverrides || {}),
          parameters: mergedParameters,
          response: mergedResponse,
        })
      ];
    },
    buildCommitMessages() {
      return wrap("continue-task", {
        directive: "Stop",
        ...(listeningDialogId || dialogId ? { dialog_id: listeningDialogId || dialogId } : {}),
      });
    },
    buildResponseCreateMessages() {
      return null;
    },
    buildFinishMessages() {
      return wrap("finish-task", {
        directive: "Stop",
      });
    },
    async extractOutputFrames(message, rawData, _context) {
      if (rawData instanceof ArrayBuffer || rawData instanceof Blob) {
        return {
          data: rawData instanceof Blob ? await rawData.arrayBuffer() : rawData,
          format: "pcm16",
          sampleRate: resolvedSampleRate,
          channels: 1,
          timestamp: Date.now(),
        };
      }
      try {
        const msg = typeof message === "string" ? JSON.parse(message) : message;
        const output = isPlainRecord(msg?.payload?.output) ? msg.payload.output : null;
        if (output?.event === "Started" || output?.event === "DialogStateChanged") {
          const did = output.dialog_id;
          if (did) { dialogId = did; }
          if (output?.event === "DialogStateChanged" && output?.state === "Listening" && did) {
            listeningDialogId = did;
          }
          return null;
        }

        const audioFrame = extractQwenDialogAudioFrame(
          output,
          resolvedSampleRate,
        );
        if (audioFrame) {
          return audioFrame;
        }
      } catch (e) { }
      return null;
    }
  };
}

export function createOpenAIRealtimeVoiceProtocolAdapter(
  options: AIProxyRealtimeVoiceAliyunProtocolOptions = {},
): AIProxyRealtimeVoiceProtocolAdapter {
  const inputAudioFormat = options.inputAudioFormat || "pcm16";
  const outputAudioFormat = options.outputAudioFormat || "pcm16";
  const normalizedModel = String(options.model || "").trim().toLowerCase();
  const supportsTranscriptTextBuffer = normalizedModel.includes("tts");
  const defaultModalities = Array.isArray(options.modalities)
    ? options.modalities
    : Array.isArray(options.response?.modalities)
      ? options.response.modalities
      : undefined;

  const wrap = (payload: any) => payload;

  return {
    buildConnectMessages() {
      const session = {
        input_audio_format: inputAudioFormat,
        output_audio_format: outputAudioFormat,
        ...(defaultModalities ? { modalities: defaultModalities } : {}),
        ...(options.model ? { model: options.model } : {}),
        ...(options.session || {}),
      };
      return wrap({
        event_id: createRealtimeEventId(),
        type: "session.update",
        session,
      });
    },
    buildAudioInputMessages(frame) {
      return wrap({
        event_id: createRealtimeEventId(),
        type: "input_audio_buffer.append",
        audio: encodeBase64(frame.data),
      });
    },
    buildTextInputMessages(text, context, params) {
      if (params?.type === "transcript" && supportsTranscriptTextBuffer) {
        return [
          wrap({
            event_id: createRealtimeEventId(),
            type: "input_text_buffer.append",
            text,
          }),
          wrap({
            event_id: createRealtimeEventId(),
            type: "input_text_buffer.commit",
          }),
        ];
      }

      return [
        wrap({
          event_id: createRealtimeEventId(),
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text }]
          }
        }),
        wrap({
          event_id: createRealtimeEventId(),
          type: "response.create",
        }),
      ];
    },
    buildCommitMessages() {
      return wrap({
        event_id: createRealtimeEventId(),
        type: "input_audio_buffer.commit",
      });
    },
    buildResponseCreateMessages() {
      const responseOpts = {
        ...(defaultModalities ? { modalities: defaultModalities } : {}),
        ...(options.response || {})
      };
      return wrap({
        event_id: createRealtimeEventId(),
        type: "response.create",
        ...(Object.keys(responseOpts).length > 0 ? { response: responseOpts } : {}),
      });
    },
    buildFinishMessages() {
      // Qwen / OpenAI doesn't have a specific finish-task message. We just close socket or optionally return null.
      return null;
    },
    extractOutputFrames(message, rawData) {
      if (rawData instanceof ArrayBuffer || rawData instanceof Blob) {
        return {
          data: rawData instanceof Blob ? new ArrayBuffer(0) : rawData,
          format: outputAudioFormat === "pcm" ? "pcm16" : outputAudioFormat,
          sampleRate: 16000,
          channels: 1,
          timestamp: Date.now(),
        };
      }

      if (!isPlainRecord(message)) return null;
      
      if (message.type === "response.audio.delta" && typeof message.delta === "string") {
        
        console.log("===> [WS 提取音频帧]: data length", message.delta.length);
        return {
          data: decodeBase64(message.delta),
          format: outputAudioFormat === "pcm" ? "pcm16" : outputAudioFormat,
          sampleRate: 24000, // Typically Qwen-Omni uses 24000 depending on config.
          channels: 1,
          timestamp: Date.now(),
          metadata: message,
        };
      }
      return null;
    },
  };
}

export class AIProxyRealtimeVoiceSession implements IAIProxyRealtimeVoiceSession {
  readonly runtime: Exclude<AIProxyRealtimeVoiceRuntime, "auto">;
  private readonly options: AIProxyRealtimeVoiceSessionOptions;
  private readonly transportFactory: VoiceTransportFactory;
  private transportSession: IAIProxyRealtimeAudioSession | null = null;
  private inputAdapter: IAIProxyRealtimeVoiceInputAdapter | null = null;
  private outputAdapter: IAIProxyRealtimeVoiceOutputAdapter | null = null;
  private connectPromise: Promise<void> | null = null;
  private outputStarted = false;
  private capturing = false;
  private inputPaused = false;

  constructor(
    options: AIProxyRealtimeVoiceSessionOptions,
    transportFactory: VoiceTransportFactory,
  ) {
    this.options = options;
    this.transportFactory = transportFactory;
    this.runtime = resolveRealtimeVoiceRuntime(options.runtime);
  }

  get transport(): IAIProxyRealtimeAudioSession | null {
    return this.transportSession;
  }

  get isCapturing(): boolean {
    return this.capturing;
  }

  async connect(): Promise<void> {
    if (this.transportSession) {
      return;
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = this.transportFactory({
      onConnected: (session, authInfo) => {
        this.transportSession = session;
        void this.handleTransportConnected(session, authInfo);
      },
      onMessage: (data, event) => {
        void this.handleTransportMessage(data, event);
      },
      onJsonMessage: (data, event) => {
        void this.handleTransportJsonMessage(data, event);
      },
      onError: (error) => {
          this.emitVoiceError(toRealtimeVoiceError(error));
      },
      onClose: () => {
        this.transportSession = null;
        this.outputStarted = false;
        if (this.capturing) {
          void this.stopVoiceInput({ commit: false, requestResponse: false, finishSession: false });
        }
      },
    }).then(async (transport) => {
      this.transportSession = transport;
      if (this.options.autoStartInput) {
        await this.startVoiceInput();
      }
    }).finally(() => {
      this.connectPromise = null;
    });

    return this.connectPromise;
  }

  async startVoiceInput(): Promise<void> {
    await this.resumeVoiceInput();
  }

  async resumeVoiceInput(): Promise<void> {
    await this.connect();
    if (this.capturing) {
      return;
    }

    const inputAdapter = this.resolveInputAdapter();
    this.inputAdapter = inputAdapter;

    if (this.inputPaused && inputAdapter.resume) {
      await inputAdapter.resume();
      this.inputPaused = false;
      this.capturing = true;
      return;
    }

    await inputAdapter.start({
      runtime: this.runtime,
      signal: this.options.context?.signal,
      emitFrame: async (frame) => {
        this.options.onVoiceInputFrame?.(frame);
        const context = this.requireProtocolContext();
        const messages = await this.options.protocolAdapter.buildAudioInputMessages(
          frame,
          context,
        );
        await this.writeMessages(messages);
      },
      emitError: (error) => {
        this.emitVoiceError(error);
      },
    });
    this.inputPaused = false;
    this.capturing = true;
  }

  async pauseVoiceInput(): Promise<void> {
    await this.connect();
    if (!this.inputAdapter || !this.capturing) {
      return;
    }

    if (this.inputAdapter.pause) {
      await this.inputAdapter.pause();
      this.inputPaused = true;
    } else {
      await this.inputAdapter.stop();
      this.inputPaused = false;
    }
    this.capturing = false;
  }

  async stopVoiceInput(options?: AIProxyRealtimeVoiceStopOptions): Promise<void> {
    const stopOptions = {
      commit: true,
      requestResponse: true,
      finishSession: false,
      ...(this.options.stopVoiceInputOptions || {}),
      ...(options || {}),
    };

    if (this.inputAdapter && this.capturing) {
      await this.inputAdapter.stop();
    }
    this.inputPaused = false;
    this.capturing = false;

    if (stopOptions.commit) {
      await this.commitInput();
    }
    if (stopOptions.requestResponse) {
      await this.requestResponse();
    }
    if (stopOptions.finishSession) {
      await this.finishSession();
    }
  }

  async clearOutput(): Promise<void> {
    if (this.outputAdapter?.clear) {
      await this.outputAdapter.clear();
    }
  }

  async sendText(text: string, options?: AIProxyRealtimeVoiceTextInputOptions): Promise<void> {
    await this.connect();
    const context = this.requireProtocolContext();
    const messages = this.options.protocolAdapter.buildTextInputMessages
      ? await this.options.protocolAdapter.buildTextInputMessages(text, context, options)
      : text;
    if (!messages || (Array.isArray(messages) && messages.length === 0)) {
      throw new Error("当前会话不支持文本补发或纯文本语音合成，请检查服务配置是否使用了 TTS / 多模态实时模型");
    }
    await this.writeMessages(messages);
  }

  async sendImagePrompt(
    text: string,
    image: string | AIProxyRealtimeVoiceImageInput,
    options?: AIProxyRealtimeVoiceImagePromptOptions,
  ): Promise<void> {
    await this.sendText(text, {
      ...(options || {}),
      images: [image],
    });
  }

  async sendEvent(data: AIProxyRealtimeAudioWriteData): Promise<void> {
    await this.connect();
    await this.transportSession?.write(data);
  }

  async commitInput(): Promise<void> {
    await this.connect();
    const context = this.requireProtocolContext();
    const messages = this.options.protocolAdapter.buildCommitMessages
      ? await this.options.protocolAdapter.buildCommitMessages(context)
      : null;
    await this.writeMessages(messages);
  }

  async requestResponse(): Promise<void> {
    await this.connect();
    const context = this.requireProtocolContext();
    const messages = this.options.protocolAdapter.buildResponseCreateMessages
      ? await this.options.protocolAdapter.buildResponseCreateMessages(context)
      : null;
    await this.writeMessages(messages);
  }

  async finishSession(): Promise<void> {
    await this.connect();
    const context = this.requireProtocolContext();
    const messages = this.options.protocolAdapter.buildFinishMessages
      ? await this.options.protocolAdapter.buildFinishMessages(context)
      : null;
    await this.writeMessages(messages);
  }

  async close(code?: number, reason?: string): Promise<void> {
    if (this.inputAdapter && this.capturing) {
      await this.inputAdapter.stop();
    }
    this.inputPaused = false;
    if (this.outputAdapter) {
      await this.outputAdapter.stop();
    }
    this.capturing = false;
    this.outputStarted = false;
    this.transportSession?.close(code, reason);
    this.transportSession = null;
  }

  private async handleTransportConnected(
    session: IAIProxyRealtimeAudioSession,
    authInfo: AIProxyRealtimeAudioAuthInfo,
  ): Promise<void> {
    const context = this.buildProtocolContext(session, authInfo);
    const connectMessages = this.options.protocolAdapter.buildConnectMessages
      ? await this.options.protocolAdapter.buildConnectMessages(context)
      : null;
    await this.writeMessages(connectMessages, session);
  }

  private async handleTransportMessage(
    data: string | ArrayBuffer | Blob,
    _event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ): Promise<void> {
    if (typeof data === "string") {
      return;
    }
    await this.consumeOutputFrames(null, data);
  }

  private async handleTransportJsonMessage(
    message: unknown,
    _event: MessageEvent | AIProxyRealtimeSocketMessageEvent,
  ): Promise<void> {
    this.options.onModelEvent?.(message);

    if (isPlainRecord(message) && isPlainRecord(message.header)) {
      if (message.header.event === "task-failed") {
        const payload = isPlainRecord(message.payload) ? message.payload : {};
        const errorMsg = String(message.header.error_message || payload.error_message || "阿里云语音任务失败");
        this.emitVoiceError(new Error(`[${message.header.error_code || "Unknown"}] ${errorMsg}`));
        void this.stopVoiceInput({ commit: false, finishSession: false, requestResponse: false });
        // continue consuming it so user plugins can log it
      } else if (message.header.event === "task-finished") {
        void this.stopVoiceInput({ commit: false, finishSession: false, requestResponse: false });
      }
    }

    await this.consumeOutputFrames(message, JSON.stringify(message));
  }

  private async consumeOutputFrames(
    message: unknown,
    rawData: string | ArrayBuffer | Blob,
  ): Promise<void> {
    if (!this.options.protocolAdapter.extractOutputFrames) {
      return;
    }

    const frames = await this.options.protocolAdapter.extractOutputFrames(
      message,
      rawData,
      this.requireProtocolContext(),
    );
    const normalizedFrames = normalizeArray(frames);
    if (normalizedFrames.length === 0) {
      return;
    }

    if (this.options.autoPlayOutput !== false) {
      await this.ensureOutputAdapterStarted();
    }

    for (const frame of normalizedFrames) {
      this.options.onVoiceOutputFrame?.(frame);
      if (this.options.autoPlayOutput !== false && this.outputAdapter) {
        await this.outputAdapter.play(frame);
      }
    }
  }

  private async ensureOutputAdapterStarted(): Promise<void> {
    if (this.outputStarted) {
      return;
    }
    const outputAdapter = this.resolveOutputAdapter();
    if (!outputAdapter) {
      return;
    }
    this.outputAdapter = outputAdapter;
    if (outputAdapter.start) {
      await outputAdapter.start();
    }
    this.outputStarted = true;
  }

  private resolveInputAdapter(): IAIProxyRealtimeVoiceInputAdapter {
    if (this.inputAdapter) {
      return this.inputAdapter;
    }
    if (this.options.inputAdapter) {
      return this.options.inputAdapter;
    }
    if (this.runtime === "browser" || this.runtime === "wechat-browser") {
      return createBrowserRealtimeVoiceInputAdapter(this.options.browserAdapterOptions);
    }
    if (this.runtime === "mini-program") {
      return createWechatMiniProgramVoiceInputAdapter(
        this.options.miniProgramOptions,
      );
    }
    throw new Error("当前运行环境无法自动创建语音输入适配器，请显式传入 inputAdapter");
  }

  private resolveOutputAdapter(): IAIProxyRealtimeVoiceOutputAdapter | null {
    if (this.outputAdapter) {
      return this.outputAdapter;
    }
    if (this.options.outputAdapter) {
      return this.options.outputAdapter;
    }
    if (this.runtime === "browser" || this.runtime === "wechat-browser") {
      return createBrowserRealtimeVoiceOutputAdapter();
    }
    return null;
  }

  private buildProtocolContext(
    transport: IAIProxyRealtimeAudioSession,
    authInfo: AIProxyRealtimeAudioAuthInfo | null,
  ): AIProxyRealtimeVoiceProtocolContext {
    return {
      runtime: this.runtime,
      transport,
      authInfo,
    };
  }

  private requireProtocolContext(): AIProxyRealtimeVoiceProtocolContext {
    if (!this.transportSession) {
      throw new Error("实时语音会话尚未连接");
    }
    return this.buildProtocolContext(this.transportSession, this.transportSession.authInfo);
  }

  private async writeMessages(
    messages: AIProxyRealtimeAudioWriteData | AIProxyRealtimeAudioWriteData[] | null | undefined,
    transport: IAIProxyRealtimeAudioSession | null = this.transportSession,
  ): Promise<void> {
    if (!messages) {
      return;
    }
    if (!transport) {
      throw new Error("实时语音底层传输尚未建立");
    }
    for (const message of normalizeArray(messages)) {
      // 调试：打印发送的数据（不打印纯二进制音频数据，防止刷屏）
      if (!(message instanceof ArrayBuffer) && !(message instanceof Blob) && !ArrayBuffer.isView(message)) {
        const payloadStr = typeof message === "string" ? message : JSON.stringify(message, null, 2);
        if (!payloadStr.includes("input_audio_buffer.append")) {
          console.log("===> [WS 发送数据]:\n", payloadStr);
        }
        this.options.onModelEvent?.({ direction: "send", event: typeof message === "string" ? JSON.parse(message) : message });
      }
      await transport.write(message);
    }
  }

  private emitVoiceError(error: Error): void {
    this.options.onVoiceError?.(error);
  }
}

function resolveWechatMiniProgramAPI(wxLike?: AIProxyWechatMiniProgramAPI): AIProxyWechatMiniProgramAPI {
  const wxApi = wxLike || (globalThis as { wx?: AIProxyWechatMiniProgramAPI }).wx;
  if (!wxApi) {
    throw new Error("当前运行环境未检测到微信小程序 wx API，请显式传入 miniProgramOptions.wx");
  }
  return wxApi;
}

function resolveAudioContextCtor(): typeof AudioContext | null {
  const candidate = (globalThis as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }).AudioContext ||
    (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return candidate || null;
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  const { length, numberOfChannels } = buffer;
  const mixed = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let index = 0; index < length; index++) {
      mixed[index] += channelData[index] / numberOfChannels;
    }
  }
  return mixed;
}

function calculateRms(input: Float32Array): number {
  if (input.length === 0) {
    return 0;
  }
  let sumSquares = 0;
  for (let index = 0; index < input.length; index++) {
    const sample = input[index];
    sumSquares += sample * sample;
  }
  return Math.sqrt(sumSquares / input.length);
}

function convertFloat32ToPcm16(
  input: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number,
): Int16Array {
  const resampled =
    inputSampleRate === outputSampleRate
      ? input
      : resampleFloat32(input, inputSampleRate, outputSampleRate);
  const output = new Int16Array(resampled.length);
  for (let index = 0; index < resampled.length; index++) {
    const sample = Math.max(-1, Math.min(1, resampled[index]));
    output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

function resampleFloat32(
  input: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number,
): Float32Array {
  if (input.length === 0 || inputSampleRate === outputSampleRate) {
    return input;
  }
  const ratio = inputSampleRate / outputSampleRate;
  const outputLength = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(outputLength);
  for (let index = 0; index < outputLength; index++) {
    const start = Math.floor(index * ratio);
    const end = Math.min(Math.floor((index + 1) * ratio), input.length);
    if (end <= start) {
      output[index] = input[Math.min(start, input.length - 1)] || 0;
      continue;
    }
    let sum = 0;
    for (let cursor = start; cursor < end; cursor++) {
      sum += input[cursor];
    }
    output[index] = sum / (end - start);
  }
  return output;
}

function createPcmAudioBuffer(
  context: AudioContext,
  frame: AIProxyRealtimeVoiceOutputFrame,
  sampleRate: number,
  channels: number,
): AudioBuffer {
  const floatData = convertOutputFrameToFloat32(frame);
  const frameCount = Math.max(1, Math.floor(floatData.length / channels));
  const audioBuffer = context.createBuffer(channels, frameCount, sampleRate);

  for (let channel = 0; channel < channels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let index = 0; index < frameCount; index++) {
      channelData[index] = floatData[index * channels + channel] || 0;
    }
  }

  return audioBuffer;
}

function convertOutputFrameToFloat32(
  frame: AIProxyRealtimeVoiceOutputFrame,
): Float32Array {
  if (typeof frame.data === "string") {
    throw new Error("字符串音频帧不能直接按 PCM 播放");
  }

  const data = toArrayBufferView(frame.data);
  if (frame.format === "pcm-f32") {
    return data instanceof Float32Array
      ? data
      : new Float32Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  }

  const int16 =
    data instanceof Int16Array
      ? data
      : new Int16Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  const output = new Float32Array(int16.length);
  for (let index = 0; index < int16.length; index++) {
    output[index] = int16[index] / 0x8000;
  }
  return output;
}

function toArrayBufferView(
  data: ArrayBuffer | ArrayBufferView | Blob,
): ArrayBufferView {
  if (data instanceof Blob) {
    throw new Error("Blob 音频帧请设置为可解码格式，避免直接按 PCM 处理");
  }
  if (ArrayBuffer.isView(data)) {
    return data;
  }
  return new Uint8Array(data);
}

function scheduleDecodedBuffer(
  context: AudioContext,
  audioBuffer: AudioBuffer,
  playheadTime: number,
  activeSources?: Set<AudioBufferSourceNode>,
): number {
  const source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
  const startAt = Math.max(playheadTime, context.currentTime);
  source.start(startAt);
  
  if (activeSources) {
    activeSources.add(source);
    source.onended = () => {
      activeSources.delete(source);
    };
  }
  
  return startAt + audioBuffer.duration;
}

async function playAudioUrl(
  url: string,
  activeAudios: Set<HTMLAudioElement>,
): Promise<void> {
  if (typeof Audio === "undefined") {
    throw new Error("当前环境不支持 Audio 标签播放，请注入自定义 outputAdapter");
  }
  const audio = new Audio(url);
  activeAudios.add(audio);
  await audio.play();
  audio.onended = () => {
    activeAudios.delete(audio);
  };
}

function normalizeArray<T>(
  value: T | T[] | null | undefined,
): T[] {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function isPlainRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

type QwenMultimodalDialogImageParameter = {
  type: "url" | "base64";
  value: string;
};

function normalizeRealtimeVoiceImageInputs(
  images?: AIProxyRealtimeVoiceTextInputOptions["images"],
): QwenMultimodalDialogImageParameter[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image) => {
      if (typeof image === "string") {
        const trimmed = image.trim();
        return trimmed ? { type: "url", value: trimmed } : null;
      }

      if (!isPlainRecord(image)) {
        return null;
      }

      const type = image.type === "base64" || image.type === "url" ? image.type : undefined;
      const value = typeof image.value === "string" ? image.value.trim() : "";
      const url = typeof image.url === "string" ? image.url.trim() : "";
      const data = typeof image.data === "string" ? image.data.trim() : "";
      const normalizedType = type || (value ? "url" : data ? "base64" : url ? "url" : undefined);
      const normalizedValue = value || data || url;

      if (!normalizedType || !normalizedValue) {
        return null;
      }

      return {
        type: normalizedType,
        value: normalizedValue,
      };
    })
    .filter((image): image is QwenMultimodalDialogImageParameter => !!image);
}

function buildQwenMultimodalDialogRequestPayload(
  text: string,
  params?: AIProxyRealtimeVoiceTextInputOptions,
  dialogId?: string,
): {
  input: Record<string, unknown>;
  payloadOverrides?: Record<string, unknown>;
} {
  const inputPayload = isPlainRecord(params?.input) ? { ...params.input } : {};
  const parameters = isPlainRecord(params?.parameters) ? { ...params.parameters } : {};
  const normalizedText = typeof text === "string" ? text.trim() : "";
  const images = normalizeRealtimeVoiceImageInputs(params?.images);

  if (typeof inputPayload.directive !== "string") {
    inputPayload.directive = "RequestToRespond";
  }
  const directive = inputPayload.directive;
  if (dialogId && inputPayload.dialog_id == null) {
    inputPayload.dialog_id = dialogId;
  }

  if (directive === "RequestToRespond") {
    const shouldPopulateTypeField =
      normalizedText.length > 0 ||
      images.length > 0 ||
      typeof params?.type === "string" ||
      typeof inputPayload.type === "string";

    const shouldPopulateTextField =
      normalizedText.length > 0 ||
      images.length > 0 ||
      typeof inputPayload.text === "string";

    if (shouldPopulateTypeField) {
      if (typeof inputPayload.type !== "string") {
        inputPayload.type = params?.type || "prompt";
      }
    }

    if (shouldPopulateTextField) {
      if (typeof inputPayload.text !== "string") {
        inputPayload.text = text;
      }
    }
  }

  if (images.length > 0 && !Array.isArray(parameters.images)) {
    parameters.images = images.slice(0, 1);
  }

  return Object.keys(parameters).length > 0
    ? { input: inputPayload, payloadOverrides: { parameters } }
    : { input: inputPayload };
}

function extractQwenDialogAudioFrame(
  output: Record<string, any> | null,
  sampleRate: number,
): AIProxyRealtimeVoiceOutputFrame | null {
  if (!output) {
    return null;
  }

  const audioCandidate = findQwenDialogAudioCandidate(output);
  if (audioCandidate?.kind === "base64") {
    return {
      data: decodeBase64(audioCandidate.value),
      format: "pcm16",
      sampleRate,
      channels: 1,
      timestamp: Date.now(),
      metadata: output,
    };
  }

  if (audioCandidate?.kind === "url") {
    return {
      data: audioCandidate.value,
      format: "pcm16",
      sampleRate,
      channels: 1,
      timestamp: Date.now(),
      metadata: output,
    };
  }

  return null;
}

function findQwenDialogAudioCandidate(
  value: unknown,
): { kind: "base64" | "url"; value: string } | null {
  const visited = new WeakSet<object>();
  const looksLikeAudioContext = (record: Record<string, unknown>, parentKey: string): boolean => {
    const normalizedParentKey = parentKey.toLowerCase();
    if (normalizedParentKey.includes("audio")) {
      return true;
    }

    const audioHints = [
      readOptionalString(record.type),
      readOptionalString(record.mimeType),
      readOptionalString(record.mime_type),
      readOptionalString(record.mediaType),
      readOptionalString(record.media_type),
      readOptionalString(record.event),
      readOptionalString(record.kind),
      readOptionalString(record.modality),
      readOptionalString(record.modalities),
      readOptionalString(record.content_type),
      readOptionalString(record.format),
    ]
      .filter((item): item is string => Boolean(item))
      .map((item) => item.toLowerCase());

    return audioHints.some((item) =>
      item.includes("audio") ||
      item.includes("speech") ||
      item.includes("pcm") ||
      item.includes("wav") ||
      item.includes("mp3") ||
      item.includes("opus")
    );
  };

  const walk = (current: unknown, parentKey = ""): { kind: "base64" | "url"; value: string } | null => {
    if (!current) {
      return null;
    }

    if (typeof current === "string") {
      const trimmed = current.trim();
      if (!trimmed) {
        return null;
      }
      if (looksLikeAudioUrl(trimmed) && parentKey.toLowerCase().includes("audio")) {
        return { kind: "url", value: trimmed };
      }
      if (looksLikeBase64Payload(trimmed) && parentKey.toLowerCase().includes("audio")) {
        return { kind: "base64", value: trimmed };
      }
      return null;
    }

    if (Array.isArray(current)) {
      for (const item of current) {
        const found = walk(item, parentKey);
        if (found) {
          return found;
        }
      }
      return null;
    }

    if (!isPlainRecord(current)) {
      return null;
    }
    if (visited.has(current)) {
      return null;
    }
    visited.add(current);

    const audioContext = looksLikeAudioContext(current, parentKey);
    if (audioContext) {
      const directCandidates = ["audio", "audio_url", "audioUrl", "delta", "data", "url", "value"];
      for (const key of directCandidates) {
        const candidate = current[key];
        if (typeof candidate !== "string") {
          continue;
        }
        const trimmed = candidate.trim();
        if (!trimmed) {
          continue;
        }
        if (looksLikeAudioUrl(trimmed)) {
          return { kind: "url", value: trimmed };
        }
        if (looksLikeBase64Payload(trimmed)) {
          return { kind: "base64", value: trimmed };
        }
      }
    }

    const prioritizedKeys = ["audio", "audio_url", "audioUrl", "delta", "data", "url", "value"];
    for (const key of prioritizedKeys) {
      if (key in current) {
        const found = walk(current[key], audioContext ? `audio:${key}` : key);
        if (found) {
          return found;
        }
      }
    }

    for (const [key, nested] of Object.entries(current)) {
      const found = walk(nested, key);
      if (found) {
        return found;
      }
    }

    return null;
  };

  return walk(value);
}

function readOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function looksLikeBase64Payload(value: string): boolean {
  if (!value || value.startsWith("http://") || value.startsWith("https://")) {
    return false;
  }
  return value.length > 24 && !/\s/.test(value);
}

function looksLikeAudioUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^blob:/i.test(value) || /^data:audio\//i.test(value);
}

function toOptionalSampleRate(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function encodeBase64(data: ArrayBuffer | ArrayBufferView | Blob): string {
  if (data instanceof Blob) {
    throw new Error("当前默认协议适配器不支持直接将 Blob 编码为 base64，请先转换为 ArrayBuffer");
  }
  const bytes = data instanceof ArrayBuffer
    ? new Uint8Array(data)
    : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  if (typeof btoa === "function") {
    return btoa(binary);
  }
  const BufferCtor = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(bytes).toString("base64");
  }
  throw new Error("当前环境缺少 base64 编码能力");
}

function decodeBase64(value: string): ArrayBuffer {
  if (typeof atob === "function") {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  }
  const BufferCtor = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  if (BufferCtor) {
    const bytes = BufferCtor.from(value, "base64");
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }
  throw new Error("当前环境缺少 base64 解码能力");
}

function createRealtimeEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readAliyunSampleRate(
  message: Record<string, any>,
  options: AIProxyRealtimeVoiceAliyunProtocolOptions,
): number {
  const sessionSampleRate = options.session?.sample_rate;
  const responseSampleRate =
    message.sample_rate ||
    message.response?.sample_rate ||
    message.audio?.sample_rate ||
    sessionSampleRate;
  return typeof responseSampleRate === "number"
    ? responseSampleRate
    : DEFAULT_OUTPUT_SAMPLE_RATE;
}