export interface RtmTopicSubscriber {
  subscribe(options: { topic: string }): Promise<unknown>;
}

const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export async function subscribeRoomTopicWithRetry(
  client: RtmTopicSubscriber,
  channelId: string,
  options: {
    attempts?: number;
    retryDelayMs?: number;
    delay?: (delayMs: number) => Promise<void>;
  } = {},
): Promise<void> {
  const room = String(channelId || '').trim();
  if (!room) throw new Error('RTC room topic is empty');
  const attempts = Math.max(1, Math.min(5, Math.floor(options.attempts ?? 3)));
  const retryDelayMs = Math.max(0, Math.floor(options.retryDelayMs ?? 120));
  const delay = options.delay ?? wait;
  let lastError: unknown = new Error('Unknown RTM room topic subscription error');

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await client.subscribe({ topic: room });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts && retryDelayMs > 0) await delay(retryDelayMs);
    }
  }

  throw lastError;
}