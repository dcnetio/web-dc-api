import { keccak_256 } from "@noble/hashes/sha3.js";

const virtualAccountPrefix = new TextEncoder().encode("$vir$");

export type VirtualAccountInitializationStage =
  | "chain-binding"
  | "chain-confirmation"
  | "storage-identity-binding"
  | "storage-identity-confirmation"
  | "offchain-space";

export class VirtualAccountInitializationError extends Error {
  readonly virAccount: string;
  readonly stage: VirtualAccountInitializationStage;
  readonly cause?: unknown;

  constructor(
    message: string,
    virAccount: string,
    stage: VirtualAccountInitializationStage,
    cause?: unknown,
  ) {
    super(message);
    this.name = "VirtualAccountInitializationError";
    this.virAccount = virAccount;
    this.stage = stage;
    this.cause = cause;
  }
}

export function generateVirtualAccountRaw(): Uint8Array {
  const raw = new Uint8Array(32);
  raw.set(virtualAccountPrefix);
  crypto.getRandomValues(raw.subarray(virtualAccountPrefix.length));
  return raw;
}

export function encodeRuntimeBytes(value: string): string {
  const bytes = new TextEncoder().encode(value);
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function hashEthExtrinsicPayload(payload: Uint8Array): Uint8Array {
  return keccak_256(payload);
}