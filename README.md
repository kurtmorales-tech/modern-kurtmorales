# KurtMorales — Portfolio & Blog

Monorepo for [kurtmorales.com](https://kurtmorales.com): Astro 5 frontend + PayloadCMS backend.

## Quick Start

```bash
npm install
npm run seed          # Seed CMS with initial content
npm run dev           # Start CMS (3001) + Frontend (3000)
```

## Architecture

| Package | Stack | Port |
|---------|-------|------|
| `web/`  | Astro 5, React 19, Tailwind v4 | 3000 |
| `cms/`  | PayloadCMS 3, Next.js 15, SQLite | 3001 |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both services |
| `npm run dev:web` | Frontend only |
| `npm run dev:cms` | CMS only |
| `npm run build` | Build both |
| `npm run seed` | Seed CMS data |
| `npm run clean` | Remove build artifacts |

## CMS Admin

Visit `http://localhost:3001/admin` — default credentials: `admin@kurtmorales.com` / `changeme123`

## Data Binding

The Astro frontend reads PayloadCMS at build/dev time via `web/src/lib/payload.ts`.

Local env:

```bash
PUBLIC_CMS_URL=http://localhost:3001
```

For production static builds, set `PUBLIC_CMS_URL` to the deployed CMS URL before running `npm run build:web`.

## BuildTools / Cloudflare Workflow

See [`BUILDTOOLS.md`](./BUILDTOOLS.md) for Cloudflare Pages deploy, D1 seed/query/migrations, Worker AI binding, DNS helper, Docker packaging, and Git sync workflow.

Quick commands:

```bash
bun run tools:status
bun run build
bun run cf:deploy
```

## Website Templates

PayloadCMS now includes a `templates` collection for dynamic website template showcases. The frontend reads it via `web/src/lib/payload.ts#getTemplates()` and falls back to `web/src/data/fallback.ts` when the CMS is unavailable.

- Page: `/templates`
- Homepage section: first three templates
- CMS collection: `cms/src/collections/Templates.ts`
- Component: `web/src/components/sections/Templates.astro`

## Resource Hub / SEO

The `/resources` page documents launch resources, meta-tag checks, and backlink planning. BaseLayout includes canonical URLs, Open Graph, Twitter cards, local SEO tags, and structured data.


