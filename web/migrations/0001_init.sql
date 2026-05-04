-- KurtMorales CMS Schema
-- D1 SQLite

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  excerpt     TEXT NOT NULL,
  content     TEXT,
  date        TEXT NOT NULL DEFAULT (date('now')),
  read_time   TEXT,
  tags        TEXT DEFAULT '[]',   -- JSON array of strings
  cover_url   TEXT,
  cover_alt   TEXT,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  title       TEXT NOT NULL,
  type        TEXT,
  tech        TEXT,
  description TEXT,
  link        TEXT,
  image_url   TEXT,
  image_alt   TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_date   ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug   ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(sort_order);

-- Seed: Posts
INSERT OR IGNORE INTO posts (id, slug, title, excerpt, content, date, read_time, tags, status) VALUES
(
  'p1seed01',
  'building-ai-powered-websites-2026',
  'Building AI-Powered Websites in 2026',
  'How I''m integrating Google Gemini and other AI tools into modern React apps — practical lessons from real client projects.',
  '## Why AI-First Development Matters Now

Every website I build today has some form of AI baked in. Not as a gimmick — but as a genuine upgrade to the user experience.

For **Braids by Jaira**, I built an AI styling assistant using Google''s Gemini API. Instead of scrolling through a static gallery, clients can describe their ideal look and get personalized recommendations instantly.

## The Stack I Use

For AI-powered React apps in 2026, my go-to stack is:

- **React + Vite + TypeScript** — fast dev experience, strong types
- **Tailwind CSS** — utility-first, no CSS bloat
- **Google Gemini API** — best multimodal model for web integrations
- **Cloudflare Workers + Pages** — edge deployment, zero cold starts

## Lessons Learned

1. **Prompt engineering matters more than model choice** — a well-crafted prompt on Gemini Flash beats a lazy prompt on Opus.
2. **Stream the response** — users expect real-time output.
3. **Handle failures gracefully** — AI APIs have rate limits. Always have a fallback.',
  '2026-05-01',
  '5 min read',
  '["AI","React","Cloudflare"]',
  'published'
),
(
  'p2seed01',
  'cloudflare-workers-for-freelancers',
  'Why I Deploy Everything to Cloudflare Workers',
  'Serverless edge computing changed how I deliver client projects. Here''s my full workflow from dev to production.',
  '## The Problem with Traditional Hosting

When I started freelancing, I was deploying client sites to shared hosting or cheap VPS instances. The problems were predictable: slow cold starts, manual SSL renewals, and painful deployment pipelines.

Cloudflare Workers changed everything.

## My Current Deployment Flow

```bash
npm run build
npx wrangler deploy
```

That''s it. Two commands and the site is live globally on Cloudflare''s edge network — 300+ locations.

## The Economics Make Sense

The free tier covers 100,000 requests/day. For most small business clients, they never leave the free tier.',
  '2026-04-20',
  '4 min read',
  '["Cloudflare","Serverless","DevOps"]',
  'published'
),
(
  'p3seed01',
  'freelancing-web-dev-las-vegas',
  'Freelancing as a Web Dev in 2026 — What''s Actually Working',
  'Honest take on landing clients, pricing projects, and building a sustainable solo dev business from Las Vegas.',
  '## How I Started

I started KM Web Design in late 2025 after years of side projects and open-source work. The transition from "developer who builds things" to "freelancer who gets paid" required a different mindset.

The tech was never the hard part.

## What Actually Lands Clients

**Portfolio > Resume.** Every client I''ve signed came through seeing something I built, not reading my CV.

**Niche, then broaden.** My first clients were small local businesses — a hair salon, a pool league directory.

**Pricing by value, not hours.** Charging hourly creates incentives to work slowly.',
  '2026-04-10',
  '6 min read',
  '["Freelancing","Business","Career"]',
  'published'
);

-- Seed: Projects
INSERT OR IGNORE INTO projects (id, title, type, tech, description, link, sort_order) VALUES
('pr1seed', 'Braids by Jaira',    'Client Concept', 'React / Vite',   'Boutique hair styling site with booking flow, gallery, and AI-powered consult.', 'https://github.com/Kacmnetworkk/Braids-by-jairah', 1),
('pr2seed', 'RavFia Platform',    'Platform',       'Cloudflare',     'Open-source platform focused on AI tooling and serverless deployment.',             'https://github.com/Kacmnetworkk/ravfia',           2),
('pr3seed', 'QuickCart',          'Ecommerce',      'Next / Tailwind', 'Minimal e-commerce starter template made for fast online store launches.',          'https://github.com/Kacmnetworkk/QuickCart',        3),
('pr4seed', 'Cuepal Directory',   'Directory',      'TypeScript',     'A pool league finder concept connecting players with local game communities.',       'https://github.com/Kacmnetworkk/Cuepal-Directory', 4),
('pr5seed', 'RavFia SecurePass',  'Tooling',        'API Concept',    'Cryptographic password generation and privacy-first tooling direction.',             'https://github.com/Kacmnetworkk',                  5),
('pr6seed', 'KurtMorales Design', 'Studio',         'Web Design',     'Brand focused on modern, fast, SEO-conscious websites for local companies.',         'https://kurtmorales.com',                           6);
