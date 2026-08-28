const virtualAccountPrefix = new TextEncoder().encode("$vir$");

export function generateVirtualAccountRaw(): Uint8Array {
  const raw = new Uint8Array(32);
  raw.set(virtualAccountPrefix);
  crypto.getRandomValues(raw.subarray(virtualAccountPrefix.length));
  return raw;
}