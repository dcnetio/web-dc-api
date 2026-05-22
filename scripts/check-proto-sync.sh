#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DCAPI_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DCAPI_PROTO="${DCAPI_ROOT}/lib/proto/dcnet.proto"
DCNODE_PROTO_DEFAULT="${DCAPI_ROOT}/../dcnode/net/pb/dcnet.proto"
DCNODE_PROTO="${DCNODE_PROTO_PATH:-${DCNODE_PROTO_DEFAULT}}"

if [[ ! -f "${DCAPI_PROTO}" ]]; then
  echo "[proto-sync] ERROR: dcapi proto not found: ${DCAPI_PROTO}" >&2
  exit 2
fi

if [[ ! -f "${DCNODE_PROTO}" ]]; then
  echo "[proto-sync] ERROR: dcnode proto not found: ${DCNODE_PROTO}" >&2
  echo "[proto-sync] Hint: set DCNODE_PROTO_PATH=/absolute/path/to/dcnet.proto" >&2
  exit 2
fi

hash_file() {
  local file="$1"
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
  else
    openssl dgst -sha256 "$file" | awk '{print $NF}'
  fi
}

DCAPI_HASH="$(hash_file "${DCAPI_PROTO}")"
DCNODE_HASH="$(hash_file "${DCNODE_PROTO}")"

echo "[proto-sync] dcapi : ${DCAPI_PROTO}"
echo "[proto-sync] dcnode: ${DCNODE_PROTO}"
echo "[proto-sync] hash(dcapi) : ${DCAPI_HASH}"
echo "[proto-sync] hash(dcnode): ${DCNODE_HASH}"

if [[ "${DCAPI_HASH}" == "${DCNODE_HASH}" ]]; then
  echo "[proto-sync] OK: dcnet.proto is in sync."
  exit 0
fi

echo "[proto-sync] MISMATCH: dcapi/lib/proto/dcnet.proto is out of sync with dcnode/net/pb/dcnet.proto" >&2
echo "[proto-sync] Suggestion: copy and regenerate generated artifacts (dcnet_proto.js/.d.ts)." >&2
exit 1
