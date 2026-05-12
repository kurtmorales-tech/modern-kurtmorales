# KurtMorales Backend (Bun + SQLite)

HTTP API used by the React frontend.

## Run locally

From repo root:

```bash
bun run dev:backend
```

Or from this directory:

```bash
cd backend
bun run dev
```

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `bun run dev`   | Start backend with watch mode      |
| `bun run start` | Start backend once                 |
| `bun run build` | Build Bun bundle to `backend/dist` |
| `bun run seed`  | Seed SQLite with bundled content   |

## Environment variables

| Variable               | Default                                         | Notes                                 |
| ---------------------- | ----------------------------------------------- | ------------------------------------- |
| `PORT`                 | `3001`                                          | Server port                           |
| `DATABASE_PATH`        | `backend/data/kurtmorales.db`                   | SQLite file path                      |
| `CORS_ORIGINS`         | `http://localhost:3000,https://kurtmorales.com` | Comma-separated origins               |
| `BACKEND_ADMIN_SECRET` | _unset_                                         | Protects `PATCH /api/newsletters/:id` |

## API endpoints

- `GET /` — status text including DB path
- `GET /health` and `GET /api/health` — health summary + table counts
- `GET /api/posts`
  - query: `where[status][equals]`, `where[slug][equals]`, `sort`, `limit`
- `GET /api/projects`
- `GET /api/templates`
- `GET /api/subscribers`
- `POST /api/subscribers`
- `POST /api/contact`
- `GET /api/newsletters`
- `GET /api/newsletters/:id`
- `PATCH /api/newsletters/:id` (Bearer auth required if admin secret is configured)

## Data model tables

- `posts`
- `projects`
- `templates`
- `subscribers`
- `newsletters`
- `contact_messages`

Schema + query implementation: `backend/src/db.ts`.
