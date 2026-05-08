#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/rss-blog-cron.log"
PAGES_PROJECT="${CF_PAGES_PROJECT:-kurtmorales-modern}"
BLOG_DOMAIN="${BLOG_DOMAIN:-blogs.kurtmorales.com}"
LIMIT="${RSS_BLOG_LIMIT:-1}"

{
  echo "== $(date -Is) RSS blog cron start =="
  cd "$ROOT_DIR"

  bun run rss:publish-local --limit="$LIMIT"

  cd "$ROOT_DIR/web"
  bun run build
  bunx wrangler pages deploy dist --project-name "$PAGES_PROJECT" --branch main

  echo "Production blog URL: https://$BLOG_DOMAIN/blog"
  echo "== $(date -Is) RSS blog cron done =="
} 2>&1 | tee -a "$LOG_FILE"
