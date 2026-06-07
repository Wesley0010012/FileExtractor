#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENTRYPOINT="$ROOT_DIR/dist/main.js"

if [[ "$1" == "-h" || "$1" == "--help" || "$#" -eq 0 ]]; then
    cat <<'HELP'
Usage:
  ./archiver.sh compress <type> <input> <output?>
  ./archiver.sh extract  <type> <input> <output?>
  ./archiver.sh inspect  <type> <input>

Types:
  zip, tar, gz, 7z, rar

Examples:
  ./archiver.sh compress zip ./test ./test.zip
  ./archiver.sh extract zip ./test.zip ./out
  ./archiver.sh inspect zip ./test.zip

HELP
    exit 0
fi

if [[ ! -f "$ENTRYPOINT" ]]; then
    echo "CLI Error [BUILD_NOT_FOUND]: dist/main.js not found. Run: $ROOT_DIR/install.sh or npm run build" >&2
    exit 1
fi

node "$ENTRYPOINT" "$@"
