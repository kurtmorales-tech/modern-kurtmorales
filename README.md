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
