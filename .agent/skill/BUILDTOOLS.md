# BuildTools Workflow

Operational workflow for KurtMorales Modern.

## Scope

- Cloudflare Pages deploy for React app in `apps/web/`
- Cloudflare Pages Functions bindings: D1 `DB`, Worker AI `AI`
- D1 seed/migration/query helpers
- DNS helper command
- Docker packaging for web
- Git sync/push workflow
- Bun backend remains the content API source of truth

## Commands

```bash
# Status
bun run tools:status

# Build
bun run build
bun run build:web

# Seed
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

3. Copy returned database ID into `apps/web/wrangler.toml` if deploying Worker/Page bindings.

4. Apply migrations:

```bash
bun run d1:migrate
```

5. Deploy frontend:

```bash
CF_PAGES_PROJECT=kurtmorales-modern bun run cf:deploy
```

## Bindings

`apps/web/wrangler.toml` defines the React Pages output path. Worker/API bindings for the browser blog studio still need to be re-added if editor routes are deployed from Workers.

## Git Push Workflow

```bash
git status --short
git add .
git commit -m "chore: migrate website frontend to react"
git push origin main
```

Review `.env`, `.logs/`, `content/generated-rss-posts.json`, and `apps/web/dist/` stay ignored before pushing.
