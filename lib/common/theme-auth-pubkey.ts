import { Ed25519PubKey } from "./dc-key/ed25519";
import type { ThemeAuthInfo, ThemeComment } from "./types/types";

export const ALL_THEME_AUTH_USERS = "all";

export class InvalidThemeAuthPubkeyError extends Error {
  constructor(pubkey: string) {
    super(`Invalid theme auth pubkey: ${pubkey || "<empty>"}`);
    this.name = "InvalidThemeAuthPubkeyError";
  }
}

export class InvalidThemeAuthorizationRecordsError extends Error {
  readonly recordKeys: string[];

  constructor(recordKeys: string[]) {
    super(
      `Invalid theme authorization records (${recordKeys.length}): ${recordKeys
        .slice(0, 3)
        .join(", ")}`,
    );
    this.name = "InvalidThemeAuthorizationRecordsError";
    this.recordKeys = [...recordKeys];
  }
}

export class InvalidThemeAuthorizationInfoError extends Error {
  constructor() {
    super("Invalid theme authorization info");
    this.name = "InvalidThemeAuthorizationInfoError";
  }
}

/**
 * Validate an authorization target and return its canonical base32 form.
 * The reserved `all` target is returned unchanged.
 */
export function normalizeThemeAuthPubkey(authPubkey: string): string {
  const candidate = String(authPubkey ?? "").trim();
  if (candidate === ALL_THEME_AUTH_USERS) {
    return candidate;
  }
  if (!candidate) {
    throw new InvalidThemeAuthPubkeyError(candidate);
  }

  try {
    const parserInput = candidate.startsWith("0X")
      ? `0x${candidate.substring(2)}`
      : candidate;
    return Ed25519PubKey.edPubkeyFromStr(parserInput).string();
  } catch {
    throw new InvalidThemeAuthPubkeyError(candidate);
  }
}

/** Convert a validated authorization target to the format persisted by DC nodes. */
export function serializeThemeAuthPubkey(authPubkey: string): string {
  const normalized = normalizeThemeAuthPubkey(authPubkey);
  if (normalized === ALL_THEME_AUTH_USERS) {
    return normalized;
  }
  return `0x${Ed25519PubKey.edPubkeyFromStr(normalized).toString()}`;
}

/** Parse the compact authorization response returned by GetUserAuth APIs. */
export function parseThemeAuthorizationInfo(authInfo: string): ThemeAuthInfo {
  const parts = String(authInfo ?? "").split("$$$");
  if (parts.length < 3 || !/^-?\d+$/.test(parts[1]!)) {
    throw new InvalidThemeAuthorizationInfoError();
  }

  let pubkey: string;
  try {
    pubkey = normalizeThemeAuthPubkey(parts[0]!);
  } catch {
    throw new InvalidThemeAuthorizationInfoError();
  }

  const permission = Number(parts[1]);
  if (!Number.isSafeInteger(permission)) {
    throw new InvalidThemeAuthorizationInfoError();
  }

  return {
    pubkey,
    permission,
    remark: parts.slice(2).join("$$$"),
  };
}

export function parseThemeAuthorizationComments(themeComments: ThemeComment[]): {
  authList: ThemeAuthInfo[];
  parseError: Error | null;
} {
  const authList: ThemeAuthInfo[] = [];
  const invalidRecords: string[] = [];

  for (const item of themeComments) {
    const content = item.comment;
    const parts = content.split(":");
    const recordKey = `${item.blockheight}/${item.commentCid}`;
    if (parts.length < 2) {
      invalidRecords.push(recordKey);
      continue;
    }

    if (!/^-?\d+$/.test(parts[1]!)) {
      invalidRecords.push(recordKey);
      continue;
    }
    const permission = Number(parts[1]);
    if (!Number.isSafeInteger(permission)) {
      invalidRecords.push(recordKey);
      continue;
    }

    let authPubkey: string;
    try {
      authPubkey = normalizeThemeAuthPubkey(parts[0]!);
    } catch {
      invalidRecords.push(recordKey);
      continue;
    }

    const remarkStart = parts[0]!.length + parts[1]!.length + 2;
    const remark = content.length > remarkStart ? content.substring(remarkStart) : "";
    authList.push({
      pubkey: authPubkey,
      permission,
      remark,
      key: recordKey,
    });
  }

  const parseError = invalidRecords.length > 0
    ? new InvalidThemeAuthorizationRecordsError(invalidRecords)
    : null;
  return { authList, parseError };
}
