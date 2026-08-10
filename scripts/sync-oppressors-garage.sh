#!/usr/bin/env bash
# Sync local oppressor portraits to Garage (S3-compatible).
#
# Prerequisites:
#   - AWS CLI configured with Garage access key / secret
#   - Bucket website (or CDN) serving objects at NEXT_PUBLIC_FALLEN_ASSET_BASE
#
# Usage:
#   export AWS_ACCESS_KEY_ID=...
#   export AWS_SECRET_ACCESS_KEY=...
#   export GARAGE_ENDPOINT=https://s3.worldseeiran.org
#   export GARAGE_BUCKET=fallen
#   ./scripts/sync-oppressors-garage.sh
#
# Objects land at: s3://$GARAGE_BUCKET/oppressors/{file}
# Public URLs:     $NEXT_PUBLIC_FALLEN_ASSET_BASE/oppressors/{file}

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/oppressors"
ENDPOINT="${GARAGE_ENDPOINT:-https://s3.worldseeiran.org}"
BUCKET="${GARAGE_BUCKET:-fallen}"

if [[ ! -d "$SRC" ]]; then
  echo "Missing $SRC — extract portraits first." >&2
  exit 1
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for Garage." >&2
  exit 1
fi

echo "Syncing $SRC -> s3://$BUCKET/oppressors/ ($ENDPOINT)"
aws --endpoint-url "$ENDPOINT" s3 sync "$SRC" "s3://$BUCKET/oppressors/" \
  --exclude ".DS_Store" \
  --exclude "*.md"

echo "Done. Smoke-test: \$NEXT_PUBLIC_FALLEN_ASSET_BASE/oppressors/ali-khamenei.jpg"
