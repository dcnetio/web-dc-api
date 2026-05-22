#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DCAPI_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DCAPI_PROTO="${DCAPI_ROOT}/lib/proto/dcnet.proto"
DCNET_PROTO_JS="${DCAPI_ROOT}/lib/proto/dcnet_proto.js"
DCNET_PROTO_DTS="${DCAPI_ROOT}/lib/proto/dcnet_proto.d.ts"
DCNODE_PROTO_DEFAULT="${DCAPI_ROOT}/../dcnode/net/pb/dcnet.proto"
DCNODE_PROTO="${DCNODE_PROTO_PATH:-${DCNODE_PROTO_DEFAULT}}"

if [[ ! -f "${DCNODE_PROTO}" ]]; then
  echo "[proto-gen] ERROR: dcnode proto not found: ${DCNODE_PROTO}" >&2
  echo "[proto-gen] Hint: set DCNODE_PROTO_PATH=/absolute/path/to/dcnet.proto" >&2
  exit 1
fi

PBJS_CMD=()
PBTS_CMD=()

if [[ -x "${DCAPI_ROOT}/node_modules/.bin/pbjs" && -x "${DCAPI_ROOT}/node_modules/.bin/pbts" ]]; then
  PBJS_CMD=("${DCAPI_ROOT}/node_modules/.bin/pbjs")
  PBTS_CMD=("${DCAPI_ROOT}/node_modules/.bin/pbts")
  echo "[proto-gen] Using local pbjs/pbts from node_modules/.bin"
else
  # Use a pinned CLI version as fallback to keep generation repeatable
  PBJS_CMD=(npx -y -p protobufjs-cli@1.1.3 pbjs)
  PBTS_CMD=(npx -y -p protobufjs-cli@1.1.3 pbts)
  echo "[proto-gen] Local pbjs/pbts not found, fallback to npx protobufjs-cli@1.1.3"
fi

echo "[proto-gen] Syncing dcnet.proto from: ${DCNODE_PROTO}"
cp "${DCNODE_PROTO}" "${DCAPI_PROTO}"

echo "[proto-gen] Generating ${DCNET_PROTO_JS}"
"${PBJS_CMD[@]}" \
  -t static-module \
  -w es6 \
  -r default \
  -o "${DCNET_PROTO_JS}" \
  "${DCAPI_PROTO}"

echo "[proto-gen] Generating ${DCNET_PROTO_DTS}"
"${PBTS_CMD[@]}" \
  -o "${DCNET_PROTO_DTS}" \
  "${DCNET_PROTO_JS}"

echo "[proto-gen] Verifying proto sync"
bash "${DCAPI_ROOT}/scripts/check-proto-sync.sh"

echo "[proto-gen] Done"
