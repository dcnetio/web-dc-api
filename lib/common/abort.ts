type AbortListener = EventListenerOrEventListenerObject;

interface AbortListenerRecord {
  listener: AbortListener;
  once: boolean;
}

export type AbortRuntimeGlobal = {
  AbortController?: typeof AbortController;
  AbortSignal?: typeof AbortSignal;
  DOMException?: typeof DOMException;
  Event?: typeof Event;
  AggregateError?: typeof AggregateError;
  queueMicrotask?: typeof queueMicrotask;
};

export function getRuntimeGlobal(): AbortRuntimeGlobal {
  if (typeof globalThis !== "undefined") return globalThis as AbortRuntimeGlobal;
  if (typeof self !== "undefined") return self as AbortRuntimeGlobal;
  if (typeof window !== "undefined") return window as AbortRuntimeGlobal;
  return {};
}

function createAbortEvent(): Event {
  const EventConstructor = getRuntimeGlobal().Event;
  if (typeof EventConstructor === "function") {
    try {
      return new EventConstructor("abort");
    } catch {
      // Older WebViews may expose Event without a constructable constructor.
    }
  }
  return { type: "abort" } as Event;
}

function invokeAbortListener(listener: AbortListener, event: Event): void {
  if (typeof listener === "function") {
    listener(event);
  } else {
    listener.handleEvent(event);
  }
}

export function createAbortError(
  message: string,
  name = "AbortError",
): Error {
  const DOMExceptionConstructor = getRuntimeGlobal().DOMException;
  if (typeof DOMExceptionConstructor === "function") {
    return new DOMExceptionConstructor(message, name);
  }
  const error = new Error(message);
  error.name = name;
  return error;
}

function createCompatibleAbortController(): AbortController {
  let aborted = false;
  let reason: unknown;
  let onabort: ((this: AbortSignal, event: Event) => unknown) | null = null;
  const listeners: AbortListenerRecord[] = [];

  const signal = Object.create(CompatAbortSignal.prototype) as AbortSignal & {
    onabort: ((this: AbortSignal, event: Event) => unknown) | null;
    dispatchEvent(event: Event): boolean;
  };
  Object.defineProperties(signal, {
    aborted: { enumerable: true, get: () => aborted },
    reason: { enumerable: true, get: () => reason },
    onabort: {
      enumerable: true,
      get: () => onabort,
      set: (listener) => {
        onabort = listener;
      },
    },
  });
  signal.addEventListener = (
    type: string,
    listener: AbortListener | null,
    options?: boolean | AddEventListenerOptions,
  ) => {
    if (type !== "abort" || !listener) return;
    if (listeners.some((record) => record.listener === listener)) return;
    listeners.push({
      listener,
      once: typeof options === "object" && options?.once === true,
    });
  };
  signal.removeEventListener = (type: string, listener: AbortListener | null) => {
    if (type !== "abort" || !listener) return;
    const index = listeners.findIndex((record) => record.listener === listener);
    if (index !== -1) listeners.splice(index, 1);
  };
  signal.dispatchEvent = (event: Event) => {
    if (event.type !== "abort") return true;
    for (const record of [...listeners]) {
      if (record.once) {
        const index = listeners.indexOf(record);
        if (index !== -1) listeners.splice(index, 1);
      }
      invokeAbortListener(record.listener, event);
    }
    onabort?.call(signal, event);
    return true;
  };
  signal.throwIfAborted = () => {
    if (aborted) {
      throw reason instanceof Error
        ? reason
        : createAbortError("Operation aborted");
    }
  };

  return {
    signal,
    abort(nextReason?: unknown) {
      if (aborted) return;
      aborted = true;
      reason =
        nextReason === undefined
          ? createAbortError("Operation aborted")
          : nextReason;
      signal.dispatchEvent(createAbortEvent());
    },
  } as AbortController;
}

class CompatAbortController {
  private readonly controller = createCompatibleAbortController();
  readonly signal = this.controller.signal;

  abort(reason?: unknown): void {
    this.controller.abort(reason);
  }
}

class CompatAbortSignal {
  static timeout(milliseconds: number): AbortSignal {
    return createFallbackTimeoutSignal(milliseconds);
  }
}

function createFallbackTimeoutSignal(milliseconds: number): AbortSignal {
  const controller = createCompatibleAbortController();
  const timeout = Math.max(0, Number(milliseconds) || 0);
  const timerId = setTimeout(() => {
    controller.abort(createAbortError("Aborted", "AbortError"));
  }, timeout);
  controller.signal.addEventListener(
    "abort",
    () => clearTimeout(timerId),
    { once: true },
  );
  return controller.signal;
}

/**
 * Use native cancellation whenever it exists. The fallback is event-driven,
 * has no polling, and is installed only for WebViews that lack the platform
 * API so the SDK's existing AbortSignal.timeout calls remain safe.
 */
export function ensureAbortController(): void {
  const runtime = getRuntimeGlobal();
  if (
    typeof runtime.AbortController === "function" &&
    typeof runtime.AbortSignal === "function"
  ) {
    return;
  }
  runtime.AbortController = CompatAbortController as unknown as typeof AbortController;
  runtime.AbortSignal = CompatAbortSignal as unknown as typeof AbortSignal;
}

export function createAbortController(): AbortController {
  const NativeAbortController = getRuntimeGlobal().AbortController;
  return typeof NativeAbortController === "function"
    ? new NativeAbortController()
    : createCompatibleAbortController();
}

export function createTimeoutSignal(milliseconds: number): AbortSignal {
  const signalConstructor = getRuntimeGlobal().AbortSignal;
  const timeout = signalConstructor?.timeout;
  if (typeof timeout === "function" && timeout !== CompatAbortSignal.timeout) {
    return timeout.call(signalConstructor, milliseconds);
  }
  return createFallbackTimeoutSignal(milliseconds);
}
