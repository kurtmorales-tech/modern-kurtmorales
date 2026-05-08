# KurtMorales — Portfolio & Blog

Monorepo for [kurtmorales.com](https://kurtmorales.com): Astro frontend + Bun backend.

## Quick Start

```bash
bun install
bun run seed          # initialize SQLite content data
bun run dev           # start backend (3001) + frontend (3000)
```

## Architecture

| Package | Stack | Port |
|---------|-------|------|
| `web/` | Astro 6, React 19, Tailwind v4 | 3000 |
| `backend/` | Bun, Bun.serve, SQLite (`bun:sqlite`) | 3001 |

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Bun backend + frontend |
| `bun run dev:backend` | Backend only |
| `bun run dev:web` | Frontend only |
| `bun run build` | Build backend bundle + frontend |
| `bun run seed` | Initialize backend SQLite data |
| `bun run clean` | Remove build artifacts |
| `bun run rss:publish-local` | Generate RSS-driven blog content locally |
| `bun run rss:cron` | Generate RSS content, build, and deploy the frontend |

## Frontend Design Notes

The current frontend theme is Cloudflare-inspired:
- primary accent: warm orange (`--color-brand`)
- secondary accent: restrained purple (`--color-accent`)
- glass/panel surfaces via `km-panel`, `km-pill`, and `km-button*`
- shared live hover interaction via `data-live-card` in `BaseLayout.astro`
- global reveal observer also lives in `BaseLayout.astro`

### Blog Endcap

The `/blog` archive now ends with a reusable CTA + numbered navigation component:
- component: `web/src/components/BlogEndcap.astro`
- page usage: `web/src/pages/blog/index.astro`
- numbered quick-nav: `01` to `08`

## Data Binding

The Astro frontend reads the Bun API via `web/src/lib/payload.ts`.

Local env:

```bash
PUBLIC_BACKEND_URL=http://localhost:3001
```

If the backend is unavailable, the frontend falls back to static content in `web/src/data/fallback.ts`.

RSS source definitions live in `scripts/rss-sources.ts`.
Generated RSS store lives in `content/generated-rss-posts.json`.
Public generated blog data lives in `web/src/data/generated-rss-posts.json`.

## Backend API

Primary endpoints:
- `GET /health`
- `GET /api/posts`
- `GET /api/projects`
- `GET /api/templates`
- `GET /api/subscribers`
- `POST /api/subscribers`
- `GET /api/newsletters`
- `GET /api/newsletters/:id`
- `PATCH /api/newsletters/:id`
- `POST /api/contact`

## BuildTools / Cloudflare Workflow

See [`BUILDTOOLS.md`](./BUILDTOOLS.md) for Cloudflare Pages deploy, D1 seed/query/migrations, Docker packaging, and Git sync workflow.

Quick commands:

```bash
bun run tools:status
bun run build
bun run cf:deploy
```
