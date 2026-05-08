# Bun Backend

Lightweight content API for the KurtMorales frontend.

## Run

```bash
cd backend
bun run dev
```

Server defaults:
- `PORT=3001`
- `DATABASE_PATH=./data/kurtmorales.db`

Optional env:
- `BACKEND_ADMIN_SECRET` — protects newsletter mutation routes when set
- `CORS_ORIGINS` — comma-separated allowed origins

## Endpoints

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
