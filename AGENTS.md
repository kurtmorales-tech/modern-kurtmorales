# KurtMorales Portfolio — Agent Context

## Architecture

Monorepo with 3 Bun workspaces. Backend overhauled to **Hono + Drizzle ORM + Zod + OpenAPI/Scalar**.

- `apps/web/` — React 19 + Vite + Tailwind v4 (CSS-only config) frontend
- `backend/` — Hono API server, SQLite via Drizzle ORM, Zod validation, auto-generated OpenAPI docs
- `apps/api/` — (exists but not actively maintained)

**Backend framework**: [Hono](https://hono.dev/) (v4) — used via `OpenAPIHono` for auto-generated OpenAPI 3.1 spec at `/openapi.json` and Scalar UI at `/docs`. Routes are mounted as sub-apps in separate files under `src/routes/`. ORM is [Drizzle](https://orm.drizzle.team/) (v0.45) with `bun-sqlite`. Validation is [Zod](https://zod.dev/) with `@hono/zod-openapi` for schema generation.

## Key Files

| File | Role |
|------|------|
| `backend/src/server.ts` | Hono app setup, middleware, OpenAPI spec, mounts all route apps |
| `backend/src/drizzle/schema.ts` | Drizzle ORM table definitions (6 tables) with TypeScript type inference |
| `backend/src/drizzle/db.ts` | DB connection, migrations, `getHealthSummary()`, `getDbPath()` |
| `backend/src/schemas.ts` | All Zod validation schemas (`zCreatePost`, `zUpdatePost`, `zEmail`, `zPhone`, etc.) |
| `backend/src/middleware/auth.ts` | `requireAuth` Hono middleware — checks `Authorization: Bearer <secret>` |
| `backend/src/routes/posts.ts` | CRUD routes for `/api/posts` and `/api/posts/:id` |
| `backend/src/routes/projects.ts` | CRUD routes for `/api/projects` and `/api/projects/:id` |
| `backend/src/routes/templates.ts` | CRUD routes for `/api/templates` and `/api/templates/:id` |
| `backend/src/routes/subscribers.ts` | List/subscribe (public), get/delete by ID (admin) |
| `backend/src/routes/newsletters.ts` | List/get (public), patch/list-all/delete (admin) |
| `backend/src/routes/contact.ts` | POST (public), list/get/delete messages (admin) |
| `backend/src/routes/auth.ts` | `POST /api/admin/login`, `GET /api/admin/verify` |
| `backend/src/seed.ts` | Seeds demo data into database via Drizzle |
| `backend/src/reset-db.ts` | Deletes DB, re-runs migrations, optional seed |
| `backend/drizzle.config.json` | Drizzle CLI config (migration output, dialect) |
| `backend/drizzle/` | Generated SQL migration files + `meta/` directory |
| `apps/web/src/styles.css` | Tailwind import, custom design tokens (`--km-*`), theme (`@theme`), fonts |
| `apps/web/src/lib/api.ts` | Frontend API client — public + admin endpoints with typed fetch |
| `apps/web/src/types.ts` | Shared TypeScript types (`Post`, `Project`, `Template`, `Subscriber`, `Newsletter`, `ContactMessage`) |
| `apps/web/src/components/Header.tsx` | Nav: logo (left), links (center), buttons/menu (right) |
| `apps/web/src/pages/ApiDashboardPage.tsx` | Tabbed admin panel: API probes + CRUD tables for all entities |
| `apps/web/src/components/Layout.tsx` | Shell (Header + children + Footer) + reveal/live-card interactions |
| `apps/web/src/lib/fallback.ts` | Static fallback data (used when backend is down) |
| `apps/web/vite.config.ts` | React + Tailwind v4 Vite plugins only |
| `scripts/rss-blog-cron.ts` | RSS content generation pipeline |
| `scripts/rss-sources.ts` | RSS source registry |
| `scripts/pi-sdk.ts` | Pi SDK integration (run via `bun run agent`) |

## Dev Commands

```bash
bun run dev              # Backend (port 3001) + Frontend (port 3000)
bun run dev:backend      # Backend only (Hono + watch)
bun run dev:web          # Frontend only (Vite dev server)
bun run dev:api          # Apps API (if apps/api package exists)
bun run build            # Build backend + frontend
bun run seed             # Seed SQLite content via Drizzle
bun run db:reset         # Delete DB + re-migrate + re-seed
bun run clean            # Remove build artifacts
bun run test             # Run RSS source tests
bun run rss:publish-local # Generate RSS content locally
bun run rss:cron         # Generate RSS + build + deploy to Cloudflare
bun run agent            # Pi SDK agent prompt (env var API key)
```

## Frontend Font

**System font stack** — no Google Fonts, zero network requests:

```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif, ...;
```

Was previously `Inter` + `Space Grotesk` from Google Fonts.

## Backend Auth Model

- Single env var: `BACKEND_ADMIN_SECRET`
- Bearer token auth: `Authorization: Bearer <secret>`
- Login endpoint: `POST /api/admin/login` with `{ secret }` → returns `{ token, expiresAt, permissions }`
- Token stored in browser `localStorage` under `km-admin-secret`
- `requireAuth()` Hono middleware returns `401` for unauthenticated admin routes

## Complete API Routes

### Public (no auth)

```
GET  /health                             Service health + table row counts
GET  /api/posts                          List published posts (filter/sort/pagination)
GET  /api/posts?where[slug][equals]=x    Single post by slug
GET  /api/projects                       List projects (sorted by order)
GET  /api/templates                      List templates (sorted by order)
GET  /api/subscribers                    List subscribers
POST /api/subscribers                    Create subscriber { email, name? }
GET  /api/newsletters                    List newsletters
GET  /api/newsletters/:id                Get single newsletter
POST /api/contact                        Submit contact form
```

### Admin (require `Bearer <BACKEND_ADMIN_SECRET>`)

```
POST /api/admin/login                   Login with secret → { token }
GET  /api/admin/verify                  Check token validity

GET  /api/admin/posts                   List all posts (incl. drafts)
POST /api/admin/posts                   Create post (slug, title, excerpt required)
GET  /api/admin/posts/:id               Get single post
PUT  /api/admin/posts/:id               Update post
DELETE /api/admin/posts/:id             Delete post

GET    /api/admin/projects              List projects
POST   /api/admin/projects              Create project
GET    /api/admin/projects/:id          Get project
PUT    /api/admin/projects/:id          Update project
DELETE /api/admin/projects/:id          Delete project

GET    /api/admin/templates             List templates
POST   /api/admin/templates             Create template
GET    /api/admin/templates/:id         Get template
PUT    /api/admin/templates/:id         Update template
DELETE /api/admin/templates/:id         Delete template

GET    /api/subscribers                  List subscribers (admin uses higher limit)
GET    /api/subscribers/:id             Get subscriber
DELETE /api/subscribers/:id             Delete subscriber

GET    /api/newsletters/list            List all newsletters (incl. drafts)
GET    /api/newsletters/:id             Get newsletter
PATCH  /api/newsletters/:id             Update newsletter status/content
DELETE /api/newsletters                 Bulk delete { id }

GET    /api/contact/messages            List contact messages
GET    /api/contact/messages/:id        Get single message
DELETE /api/contact/messages/:id        Delete message
```

### API UI

- **Scalar**: `http://localhost:3001/docs` (interactive API reference from OpenAPI spec)
- **Raw spec**: `http://localhost:3001/openapi.json`

## Backend Data (Drizzle tables)

| Table | Key fields |
|-------|-----------|
| `posts` | slug (unique), title, excerpt, contentMarkdown, date, status (draft/published), tags[] |
| `projects` | title, type, tech, description, link, image, sortOrder |
| `templates` | title, description, thumbnail, demoUrl, sourceUrl, tech, featured, price, sortOrder |
| `subscribers` | email (unique), name, status |
| `newsletters` | title, subject, preheader, status (draft/sending/sent), sentAt, recipientsCount |
| `contact_messages` | name, email, project, budget, message |

## Database

- SQLite via `bun:sqlite` + Drizzle ORM
- Default path: `backend/data/kurtmorales.db`
- Set `DATABASE_PATH` env var to override
- Migrations: `backend/drizzle/` (generated by `drizzle-kit generate`)
- Run `bun run seed` to populate seed data

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BACKEND_ADMIN_SECRET` | (none) | Admin auth token (required for all admin routes) |
| `DATABASE_PATH` | `backend/data/kurtmorales.db` | SQLite file location |
| `PORT` | 3001 | Backend port |
| `CORS_ORIGINS` | `http://localhost:3000,https://kurtmorales.com` | CORS allowlist |
| `VITE_API_BASE_URL` | `http://localhost:3001` | Frontend API base (set for production builds) |
| `PUBLIC_BACKEND_URL` | — | Alternative Vite env prefix |

## Style Conventions

- Use shared utility classes from `apps/web/src/styles.css`: `km-button`, `km-button-primary`, `km-button-secondary`, `km-pill`, `km-panel`
- `data-live-card` attribute for pointer-reactive cards (handled globally in `Layout.tsx`)
- Motion should be subtle; respect `prefers-reduced-motion`
- Font-smoothing already set in `styles.css` `html` block
- `/blog` page must keep CTA + numbered navigation before footer

## Linked Skills

- [Bun Bundler](https://bun.com/docs/llms.txt) — Backend built with `bun build src/server.ts --target bun --outdir dist`. Key options: `entrypoints`, `outdir`, `target`, `splitting`, `external`, `define`, `minify`.

## Testing New Admin Features

1. Set `BACKEND_ADMIN_SECRET=your-secret-here` in your env
2. Start dev: `bun run dev`
3. Open `http://localhost:3001/docs` to explore the auto-generated API docs
4. Login via `POST /api/admin/login` with `{ "secret": "your-secret-here" }`
5. Dashboard at `/dashboard` in the frontend shows API health probes + CRUD tables