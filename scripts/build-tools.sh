#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
DB_NAME="${CF_D1_DATABASE_NAME:-kurtmorales-modern-db}"
PAGES_PROJECT="${CF_PAGES_PROJECT:-kurtmorales-modern}"
ZONE_ID="${CF_ZONE_ID:-}"
DOMAIN="${CF_DOMAIN:-kurtmorales.com}"

usage() {
  cat <<USAGE
BuildTools for kurtmorales-modern

Usage:
  scripts/build-tools.sh <command>

Commands:
  status           Show git, docker, bun, wrangler status
  build            Build Bun backend + React frontend
  build-web        Build React frontend
  seed             Seed local Bun backend data
  cf-whoami        Check Cloudflare auth
  cf-deploy        Build React web and deploy to Cloudflare Pages
  cf-preview       Build React web and deploy preview to Cloudflare Pages
  d1-create        Create Cloudflare D1 database
  d1-migrate       Apply D1 migrations remotely
  d1-migrate-local Apply D1 migrations locally
  d1-query SQL     Run remote D1 SQL query
  d1-query-local SQL Run local D1 SQL query
  dns-list         List DNS records for CF_ZONE_ID
  docker-web       Build frontend Docker image
  sync             git status + fetch + branch summary

Env:
  CF_PAGES_PROJECT=$PAGES_PROJECT
  CF_D1_DATABASE_NAME=$DB_NAME
  CF_ZONE_ID=$ZONE_ID
  CF_DOMAIN=$DOMAIN
USAGE
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }
}

wrangler() {
  (cd "$WEB_DIR" && bunx wrangler --config wrangler.toml "$@")
}

case "${1:-}" in
  status)
    require_cmd git
    echo "== Git ==" && (cd "$ROOT_DIR" && git status --short && git branch --show-current && git remote -v)
    echo "== Bun ==" && bun --version
    echo "== Docker ==" && (docker --version || true)
    echo "== Wrangler ==" && wrangler whoami || true
    ;;
  build) (cd "$ROOT_DIR" && bun run build) ;;
  build-web) (cd "$ROOT_DIR" && bun run build:web) ;;
  seed) (cd "$ROOT_DIR" && bun run seed) ;;
  cf-whoami) wrangler whoami ;;
  cf-deploy)
    (cd "$WEB_DIR" && bun run build)
    wrangler pages deploy dist --project-name "$PAGES_PROJECT" --branch main
    ;;
  cf-preview)
    (cd "$WEB_DIR" && bun run build)
    wrangler pages deploy dist --project-name "$PAGES_PROJECT"
    ;;
  d1-create) wrangler d1 create "$DB_NAME" ;;
  d1-migrate) wrangler d1 migrations apply "$DB_NAME" --remote ;;
  d1-migrate-local) wrangler d1 migrations apply "$DB_NAME" --local ;;
  d1-query)
    shift
    [ $# -gt 0 ] || { echo "Provide SQL query" >&2; exit 1; }
    wrangler d1 execute "$DB_NAME" --remote --command "$*"
    ;;
  d1-query-local)
    shift
    [ $# -gt 0 ] || { echo "Provide SQL query" >&2; exit 1; }
    wrangler d1 execute "$DB_NAME" --local --command "$*"
    ;;
  dns-list)
    [ -n "$ZONE_ID" ] || { echo "Set CF_ZONE_ID first" >&2; exit 1; }
    wrangler dns record list --zone-id "$ZONE_ID" --name "$DOMAIN"
    ;;
  docker-web) docker build -f "$ROOT_DIR/Dockerfile.web" -t kurtmorales-web:latest "$ROOT_DIR" ;;
  sync)
    (cd "$ROOT_DIR" && git fetch --all --prune && git status --short && git log --oneline -5)
    ;;
  ""|-h|--help) usage ;;
  *) echo "Unknown command: $1" >&2; usage; exit 1 ;;
esac
