#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/backup.sh <mongo_uri> <output_dir>
MONGO_URI=${1:-mongodb://localhost:27017/enterprise}
OUT=${2:-./backups}
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$OUT"

echo "Backing up MongoDB from $MONGO_URI"
mongodump --uri="$MONGO_URI" --out "$OUT/$STAMP"
echo "Backup completed at $OUT/$STAMP"
