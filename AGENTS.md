# KurtMorales Portfolio — Agent Context

## Architecture
Monorepo with two packages:
- `web/` — Astro 5 frontend, Tailwind v4, React islands, Cloudflare Pages
- `cms/` — PayloadCMS v3, Next.js 15, SQLite, Lexical editor

## CMS Collections
| Collection | Fields |
|------------|--------|
| posts | title, slug, excerpt, content (richText), contentMarkdown, date, readTime, tags[], cover, status |
| projects | title, type, tech, description, link, image, order |
| media | alt, upload (image/*) |
| users | email, password, name |

## API Endpoints
- `GET /api/posts` — list posts (supports `where[status][equals]=published`, `sort=-date`)
- `GET /api/posts?where[slug][equals]=:slug` — get post by slug
- `GET /api/projects?sort=order` — list projects
- `POST /api/posts` — create post (requires auth)
- `POST /api/projects` — create project (requires auth)

## Dev Commands
```bash
npm run dev          # Start both CMS + frontend
npm run dev:cms      # CMS only (port 3001)
npm run dev:web      # Frontend only (port 3000)
npm run seed         # Seed CMS with initial content
npm run build        # Build both
npm run clean        # Remove build artifacts
```

## Key Files
- `cms/src/payload.config.ts` — CMS config
- `cms/src/collections/` — Collection definitions
- `cms/src/seed.ts` — Seed script
- `web/astro.config.mjs` — Astro config
- `web/src/lib/payload.ts` — CMS API client
- `web/src/data/fallback.ts` — Static fallback data
- `scripts/pi-sdk.ts` — Pi SDK integration

## Rules
- CMS content is source of truth; fallback data is for offline/build-time only
- Always check CMS health before content operations
- Blog posts use Lexical rich text with markdown fallback
- Frontend is static-generated, rebuild after CMS changes
