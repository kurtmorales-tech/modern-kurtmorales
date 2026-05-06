# BuildTools Workflow

Operational workflow for KurtMorales Modern.

## Scope

- Cloudflare Pages deploy for `web/`
- Cloudflare Pages Functions bindings: D1 `DB`, Worker AI `AI`
- D1 seed/migration/query helpers
- DNS helper command
- Docker packaging for web and CMS
- Git sync/push workflow
- PayloadCMS remains the backend/source of truth

## Commands

```bash
# Status
bun run tools:status

# Build
bun run build
bun run build:web
bun run build:cms

# Payload seed
bun run seed

# Cloudflare auth
bun run cf:whoami

# Cloudflare deploy
bun run cf:deploy
bun run cf:preview

# D1
bun run d1:create
bun run d1:migrate
bun run d1:migrate:local
bun run d1:query -- "SELECT COUNT(*) FROM posts"
bun run d1:query:local -- "SELECT COUNT(*) FROM posts"

# DNS
CF_ZONE_ID=your_zone_id bun run dns:list

# Docker
bun run docker:web
bun run docker:cms
```

## Cloudflare Setup

1. Login:

```bash
bunx wrangler login
```

2. Create D1 database if needed:

```bash
bun run d1:create
```

3. Copy returned database ID into `web/wrangler.toml`.

4. Apply migrations:

```bash
bun run d1:migrate
```

5. Deploy frontend:

```bash
CF_PAGES_PROJECT=kurtmorales-modern bun run cf:deploy
```

## Bindings

`web/wrangler.toml` defines:

- `DB` — Cloudflare D1 database
- `AI` — Cloudflare Worker AI
- `SITE_URL` — production URL
- `PUBLIC_CMS_URL` — deployed PayloadCMS URL

## Git Push Workflow

```bash
git status --short
git add .
git commit -m "chore: add cloudflare buildtools workflow"
git push origin main
```

Review `.env`, `.logs/`, `cms/data/`, `web/dist/`, and `cms/.next/` stay ignored before pushing.
