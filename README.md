# KurtMorales — Portfolio & Blog

Monorepo for [kurtmorales.com](https://kurtmorales.com), with:

- `apps/web/`: React + Vite frontend (canonical website)
- `backend/`: Bun + SQLite content API

## Prerequisites

- [Bun](https://bun.sh) `1.3.13+`
- Node is not required for normal dev flow

## Quick start

```bash
bun install
bun run seed
bun run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

## Repository architecture

- `apps/web/` — React 19 + Vite site, Tailwind v4 visual system, static build output in `apps/web/dist`
- `backend/` — Bun HTTP server (`backend/src/server.ts`) with SQLite DB layer (`backend/src/db.ts`)
- `scripts/` — deployment + RSS automation scripts
- `content/` — generated RSS content artifacts

## Commands

| Command                     | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `bun run dev`               | Run backend + frontend together                       |
| `bun run dev:backend`       | Run backend only                                      |
| `bun run dev:web`           | Run frontend only                                     |
| `bun run seed`              | Seed local backend SQLite data                        |
| `bun run build`             | Build backend bundle + React frontend static site     |
| `bun run clean`             | Remove build artifacts                                |
| `bun run format`            | Format repo with Prettier                             |
| `bun run format:check`      | CI-style Prettier check (no writes)                   |
| `bun run rss:publish-local` | Pull RSS content and update local generated blog data |
| `bun run rss:cron`          | Run RSS pipeline + build + deploy web                 |

## Environment variables

### Root / scripts

| Variable              | Default                 | Used for                                    |
| --------------------- | ----------------------- | ------------------------------------------- |
| `CF_PAGES_PROJECT`    | `kurtmorales-modern`    | Cloudflare Pages project for deploy scripts |
| `CF_D1_DATABASE_NAME` | `kurtmorales-modern-db` | D1 helper commands                          |
| `CF_ZONE_ID`          | _unset_                 | DNS helper command                          |
| `CF_DOMAIN`           | `kurtmorales.com`       | DNS helper command                          |
| `RSS_BLOG_LIMIT`      | `1`                     | RSS cron generation limit                   |
| `BLOG_DOMAIN`         | `blogs.kurtmorales.com` | RSS cron output URL                         |

### Frontend (`apps/web/`)

| Variable             | Default                 | Notes                                                  |
| -------------------- | ----------------------- | ------------------------------------------------------ |
| `VITE_API_BASE_URL`  | `http://localhost:3001` | Primary API base URL used by `apps/web/src/lib/api.ts` |
| `PUBLIC_BACKEND_URL` | none                    | Compatibility fallback API base URL                    |
| `BACKEND_URL`        | none                    | Secondary compatibility fallback API base URL          |

If backend requests fail, frontend pages fall back to static data in `apps/web/src/lib/fallback.ts`.

### Backend (`backend/`)

| Variable               | Default                                         | Notes                                         |
| ---------------------- | ----------------------------------------------- | --------------------------------------------- |
| `PORT`                 | `3001`                                          | Backend listen port                           |
| `DATABASE_PATH`        | `backend/data/kurtmorales.db`                   | SQLite file location                          |
| `CORS_ORIGINS`         | `http://localhost:3000,https://kurtmorales.com` | Comma-separated allow list                    |
| `BACKEND_ADMIN_SECRET` | _unset_                                         | Enables auth for `PATCH /api/newsletters/:id` |

## Backend API

Base URL (local): `http://localhost:3001`

- `GET /health` (also available as `GET /api/health`)
- `GET /api/posts`
  - supports `where[status][equals]=published|draft`
  - supports `where[slug][equals]=...`
  - supports `sort=-date` and `limit`
- `GET /api/projects?limit=50`
- `GET /api/templates?limit=50`
- `GET /api/subscribers?limit=1000`
- `POST /api/subscribers`
- `GET /api/newsletters?limit=50`
- `GET /api/newsletters/:id`
- `PATCH /api/newsletters/:id` (requires `Authorization: Bearer <secret>` when secret is configured)
- `POST /api/contact`

## Deployment notes

### GitHub Actions CI/CD

The repository includes GitHub Actions workflows for validation and Cloudflare Pages deployment:

- `.github/workflows/ci.yml` runs Bun install, Prettier check, tests, and the full backend + frontend build on pull requests and selected branch pushes.
- `.github/workflows/deploy-web.yml` builds the frontend, deploys preview builds for pull requests, and deploys production when `main` is pushed.

Required GitHub secrets:

| Secret | Purpose |
| ------ | ------- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages deploy access |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

Optional GitHub repository variables:

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `CF_PAGES_PROJECT` | `kurtmorales-modern` | Cloudflare Pages project name |
| `VITE_API_BASE_URL` | `https://kurtmorales.com` | Frontend API URL for production builds |
| `PUBLIC_BACKEND_URL` | `https://kurtmorales.com` | Compatibility backend URL fallback |

### Cloudflare Pages (manual React web deploy)

```bash
bun run build
bun run cf:deploy
```

Helpful ops commands:

```bash
bun run tools:status
bun run cf:whoami
bun run cf:preview
```

More detail: [`BUILDTOOLS.md`](./BUILDTOOLS.md).

### RSS automation

`bun run rss:cron` runs:

1. RSS generation (`bun run rss:publish-local`)
2. frontend build
3. `wrangler pages deploy`

Script location: `scripts/rss-blog-cron.sh`.
