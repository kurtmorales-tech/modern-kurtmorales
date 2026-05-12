# Instructions

## Local setup

```bash
bun install
bun run seed
bun run dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:3001`

## Common commands

```bash
# Start services
bun run dev
bun run dev:backend
bun run dev:web

# Database
bun run seed
bun run db:reset

# Build / cleanup
bun run build
bun run clean

# Formatting
bun run format
bun run format:check
```

## Environment notes

- Backend DB path defaults to `backend/data/kurtmorales.db`.
- Frontend API base URL uses `VITE_API_BASE_URL` first, then `PUBLIC_BACKEND_URL`, then `BACKEND_URL`.
- If backend is unavailable, frontend falls back to static content in `apps/web/src/lib/fallback.ts`.
