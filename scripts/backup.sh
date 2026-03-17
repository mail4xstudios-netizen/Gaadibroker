#!/bin/bash
# GaadiBroker Database Backup Script
# Schedule with cron: 0 2 * * * /path/to/backup.sh
#
# For MongoDB: Add MONGO_URI to .env
# For file-based: Backs up src/data/*.json

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/gaadi-broker}"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=30
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$BACKUP_DIR"

echo "[$DATE] Starting backup..."

# Backup JSON data files
if [ -d "$APP_DIR/src/data" ]; then
  tar -czf "$BACKUP_DIR/data-$DATE.tar.gz" -C "$APP_DIR" src/data/
  echo "  Data files backed up"
fi

# Backup .env (encrypted)
if [ -f "$APP_DIR/.env.local" ]; then
  cp "$APP_DIR/.env.local" "$BACKUP_DIR/env-$DATE.bak"
  chmod 600 "$BACKUP_DIR/env-$DATE.bak"
  echo "  Environment backed up"
fi

# MongoDB backup (uncomment if using MongoDB)
# if [ -n "${MONGO_URI:-}" ]; then
#   mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/mongo-$DATE"
#   tar -czf "$BACKUP_DIR/mongo-$DATE.tar.gz" "$BACKUP_DIR/mongo-$DATE"
#   rm -rf "$BACKUP_DIR/mongo-$DATE"
#   echo "  MongoDB backed up"
# fi

# Upload to S3 (uncomment if using AWS)
# if command -v aws &> /dev/null; then
#   aws s3 sync "$BACKUP_DIR" "s3://gaadi-broker-backups/$DATE/"
#   echo "  Uploaded to S3"
# fi

# Cleanup old backups
find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete
echo "  Old backups cleaned (>${RETENTION_DAYS} days)"

echo "[$DATE] Backup complete!"
