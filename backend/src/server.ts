import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getDb, getDbPath, getHealthSummary } from './drizzle/db';
import { postsApp } from './routes/posts';
import { projectsApp } from './routes/projects';
import { templatesApp } from './routes/templates';
import { subscribersApp } from './routes/subscribers';
import { newslettersApp } from './routes/newsletters';
import { contactApp } from './routes/contact';
import { authApp } from './routes/auth';

const app = new Hono();

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://kurtmorales.com')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

app.use('*', cors({
  origin: (origin) => (origin && allowedOrigins.includes(origin) ? origin : '*'),
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Root and Health
app.get('/', (c) => {
  return c.text(`KurtMorales Bun backend running on port ${process.env.PORT || 3001}\nDB: ${getDbPath()}`);
});

app.get('/health', (c) => {
  const db = getDb(c.env);
  return c.json({
    ok: true,
    service: 'kurtmorales-backend',
    ...getHealthSummary(db),
  });
});

app.get('/api/health', (c) => {
  const db = getDb(c.env);
  return c.json({
    ok: true,
    service: 'kurtmorales-backend',
    ...getHealthSummary(db),
  });
});

// Routes
app.route('/api/posts', postsApp);
app.route('/api/projects', projectsApp);
app.route('/api/templates', templatesApp);
app.route('/api/subscribers', subscribersApp);
app.route('/api/newsletters', newslettersApp);
app.route('/api/contact', contactApp);
app.route('/api/admin', authApp);

// Export for Worker deployment
export default app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT || 3001);
  console.log(`🚀 KurtMorales backend listening on http://localhost:${port}`);
  console.log(`🗄️  SQLite database: ${getDbPath()}`);
  Bun.serve({
    port,
    fetch: app.fetch,
  });
}
