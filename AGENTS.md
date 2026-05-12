# KurtMorales Portfolio — Agent Context

## Architecture
Monorepo with active app packages:
- `apps/web/` — React + Vite frontend, Tailwind v4, Cloudflare Pages
- `backend/` — Bun API, Bun.serve, SQLite content store

## Backend Data Domains
| Domain | Fields |
|--------|--------|
| posts | title, slug, excerpt, contentMarkdown, date, readTime, tags[], cover, status |
| projects | title, type, tech, description, link, image, order |
| templates | title, description, tech, demoUrl, sourceUrl, tags[], featured, price, order |
| subscribers | email, name, status |
| newsletters | title, subject, preheader, contentMarkdown, html, text, status, sentAt, recipientsCount |
| contact_messages | name, email, project, budget, message |

## API Endpoints
- `GET /health`
- `GET /api/posts` — supports `where[status][equals]=published`, `where[slug][equals]=...`, `sort=-date`
- `GET /api/projects?sort=order`
- `GET /api/templates?sort=order`
- `GET /api/subscribers`
- `POST /api/subscribers`
- `GET /api/newsletters`
- `GET /api/newsletters/:id`
- `PATCH /api/newsletters/:id` — optional bearer auth via `BACKEND_ADMIN_SECRET`
- `POST /api/contact`

## Dev Commands
```bash
bun run dev          # Start backend + frontend
bun run dev:backend  # Backend only (port 3001)
bun run dev:web      # Frontend only (port 3000)
bun run seed         # Seed backend SQLite content
bun run build        # Build backend + frontend
bun run clean        # Remove build artifacts
bun run rss:publish-local  # Generate RSS blog content
bun run rss:cron     # Generate RSS content, build, deploy web
```

## Key Files
- `backend/src/server.ts` — Bun HTTP API
- `backend/src/db.ts` — schema, seed, and query layer
- `backend/src/seed-data.ts` — bundled content seed data
- `apps/web/vite.config.ts` — React/Vite frontend config
- `apps/web/src/lib/api.ts` — frontend API client
- `apps/web/src/lib/fallback.ts` — static fallback data
- `apps/web/src/components/Layout.tsx` — shared reveal/live-card interaction wrapper
- `apps/web/src/styles.css` — design tokens, Cloudflare-inspired theme, button/panel utilities
- `apps/web/src/components/BlogEndcap.tsx` — `/blog` CTA + numbered quick navigation (01–08)
- `apps/web/src/pages/BlogPage.tsx` — blog archive layout using the endcap component
- `scripts/rss-blog-cron.ts` — RSS content generation pipeline
- `scripts/rss-sources.ts` — RSS source registry
- `scripts/pi-sdk.ts` — Pi SDK integration

## UI / Theme Rules
- Current visual direction is Cloudflare-inspired: orange primary, restrained purple accent, glass panels, crisp borders.
- Prefer shared utility classes from `apps/web/src/styles.css`: `km-button`, `km-button-primary`, `km-button-secondary`, `km-pill`, `km-panel`.
- Use `data-live-card` for subtle pointer-reactive cards; interaction is initialized globally in `apps/web/src/components/Layout.tsx`.
- Keep motion subtle and functional. Respect reduced-motion users.
- `/blog` should keep the CTA + numbered navigation block before the footer.

## Rules
- Bun backend is the default source of truth for content APIs.
- Frontend should tolerate backend downtime by falling back to `apps/web/src/lib/fallback.ts`.
- RSS automation lives under `scripts/` and `content/`, not a separate CMS package.
- Frontend is static-generated, so set `VITE_API_BASE_URL` or `PUBLIC_BACKEND_URL` for builds that should consume live backend data.
