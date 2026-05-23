import { Hono } from 'hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { authApp } from './routes/auth';
import { contactApp } from './routes/contact';
import { newslettersApp } from './routes/newsletters';
import { postsApp } from './routes/posts';
import { projectsApp } from './routes/projects';
import { subscribersApp } from './routes/subscribers';
import { templatesApp } from './routes/templates';

const app = new OpenAPIHono();

// ── Middleware ──────────────────────────────────────────────────────

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://kurtmorales.com')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

app.use('*', cors({
  origin: allowedOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
  credentials: true,
}));

app.use('*', logger());

// ── OpenAPI docs ───────────────────────────────────────────────────

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'KurtMorales API',
    version: '1.0.0',
    description: 'KurtMorales portfolio backend API — Bun + Hono + Drizzle + Zod',
    contact: { name: 'Kurt Morales', url: 'https://kurtmorales.com' },
  },
  servers: [{ url: 'http://localhost:3001', description: 'Development' }],
  tags: [
    { name: 'Health', description: 'Service health checks' },
    { name: 'Posts', description: 'Blog post management' },
    { name: 'Projects', description: 'Portfolio project management' },
    { name: 'Templates', description: 'Template marketplace management' },
    { name: 'Subscribers', description: 'Newsletter subscriber management' },
    { name: 'Newsletters', description: 'Newsletter management' },
    { name: 'Contact', description: 'Contact message submission and management' },
    { name: 'Auth', description: 'Admin authentication' },
  ],
});

// Serve Scalar API reference at /docs
app.get('/docs', (c) => {
  return c.html(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KurtMorales API Docs</title>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/dist/cdn.min.js"></script>
</head>
<body>
  <script>
    const configuration = { spec: { url: '/openapi.json' } };
    const element = document.createElement('api-reference');
    element.setAttribute('configuration', JSON.stringify(configuration));
    document.body.appendChild(element);
  </script>
</body>
</html>`);
});

// ── Health (public) ───────────────────────────────────────────────

import { getDbPath, getHealthSummary } from './drizzle/db';

app.get('/health', (c) => {
  return c.json({ ok: true, service: 'kurtmorales-backend', ...getHealthSummary() });
});

app.get('/api/health', (c) => {
  return c.json({ ok: true, service: 'kurtmorales-backend', ...getHealthSummary() });
});

// ── Mount route apps ──────────────────────────────────────────────

// Auth
app.route('/api/admin', authApp);

// Public content APIs
app.route('/api/posts', postsApp);
app.route('/api/projects', projectsApp);
app.route('/api/templates', templatesApp);
app.route('/api/subscribers', subscribersApp);
app.route('/api/newsletters', newslettersApp);
app.route('/api/contact', contactApp);

// ── 404 fallback ──────────────────────────────────────────────────

app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// ── Error handler ─────────────────────────────────────────────────

app.onError((err, c) => {
  console.error(`[ERROR] ${c.req.method} ${c.req.path}:`, err);
  return c.json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? String(err) : undefined }, 500);
});

// ── Start ─────────────────────────────────────────────────────────

const port = Number(process.env.PORT || 3001);

export default app;

if (import.meta.main) {
  console.log(`🚀 KurtMorales backend listening on http://localhost:${port}`);
  console.log(`🗄️  SQLite database: ${getDbPath()}`);
  console.log(`📖 OpenAPI docs:     http://localhost:${port}/swagger`);
  console.log(`🔑 Admin login:      POST /api/admin/login { secret: "..." }`);

  Bun.serve({
    fetch: app.fetch,
    port,
  });
}