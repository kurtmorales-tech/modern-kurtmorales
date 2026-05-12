import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  createContactMessage,
  createSubscriber,
  getDbPath,
  getHealthSummary,
  getNewsletterById,
  listNewsletters,
  listPosts,
  listProjects,
  listSubscribers,
  listTemplates,
  updateNewsletter,
} from '../../../backend/src/db';

const port = Number(process.env.PORT || 3001);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://kurtmorales.com')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const adminSecret = process.env.BACKEND_ADMIN_SECRET || '';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return '*';
      return allowedOrigins.includes(origin) ? origin : '*';
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

const parseLimit = (value: string | undefined | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
};

const isAuthorized = (authHeader: string | undefined) => {
  if (!adminSecret) return false;
  return authHeader === `Bearer ${adminSecret}`;
};

app.get('/', (c) => c.text(`KurtMorales Hono API running on :${port}\nDB: ${getDbPath()}`));

app.get('/health', (c) =>
  c.json({ ok: true, service: 'kurtmorales-hono-api', ...getHealthSummary() }),
);
app.get('/api/health', (c) =>
  c.json({ ok: true, service: 'kurtmorales-hono-api', ...getHealthSummary() }),
);

app.get('/api/posts', (c) => {
  const docs = listPosts({
    status:
      (c.req.query('where[status][equals]') as 'draft' | 'published' | undefined) ?? undefined,
    slug: c.req.query('where[slug][equals]') ?? undefined,
    limit: parseLimit(c.req.query('limit'), 150),
    sort: c.req.query('sort') ?? '-date',
  });

  return c.json({ docs, totalDocs: docs.length, limit: docs.length });
});

app.get('/api/projects', (c) => {
  const docs = listProjects(parseLimit(c.req.query('limit'), 50));
  return c.json({ docs, totalDocs: docs.length, limit: docs.length });
});

app.get('/api/templates', (c) => {
  const docs = listTemplates(parseLimit(c.req.query('limit'), 50));
  return c.json({ docs, totalDocs: docs.length, limit: docs.length });
});

app.get('/api/subscribers', (c) => {
  const docs = listSubscribers(parseLimit(c.req.query('limit'), 1000));
  return c.json({ docs, totalDocs: docs.length, limit: docs.length });
});

app.post('/api/subscribers', async (c) => {
  const body = await c.req.json<{ email?: string; name?: string }>().catch(() => null);
  if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return c.json({ error: 'A valid email is required' }, 400);
  }

  const doc = createSubscriber({ email: body.email, name: body.name });
  return c.json({ doc }, 201);
});

app.post('/api/contact', async (c) => {
  const body = await c.req
    .json<{
      name?: string;
      email?: string;
      project?: string;
      budget?: string;
      message?: string;
    }>()
    .catch(() => null);

  if (!body?.name?.trim()) return c.json({ error: 'Name is required' }, 400);
  if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email))
    return c.json({ error: 'A valid email is required' }, 400);
  if (!body?.message?.trim()) return c.json({ error: 'Message is required' }, 400);

  const doc = createContactMessage(
    body as {
      name: string;
      email: string;
      project?: string;
      budget?: string;
      message: string;
    },
  );
  return c.json({ success: true, doc }, 201);
});

app.get('/api/newsletters', (c) => {
  const docs = listNewsletters(parseLimit(c.req.query('limit'), 50));
  return c.json({ docs, totalDocs: docs.length, limit: docs.length });
});

app.get('/api/newsletters/:id', (c) => {
  const doc = getNewsletterById(c.req.param('id'));
  return doc ? c.json({ doc }) : c.json({ error: 'Not found' }, 404);
});

app.patch('/api/newsletters/:id', async (c) => {
  if (!isAuthorized(c.req.header('authorization'))) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'Invalid JSON body' }, 400);

  const status = body.status;
  if (status !== undefined && status !== 'draft' && status !== 'sending' && status !== 'sent') {
    return c.json({ error: 'Invalid newsletter status' }, 400);
  }

  const doc = updateNewsletter(c.req.param('id'), {
    title: typeof body.title === 'string' ? body.title : undefined,
    subject: typeof body.subject === 'string' ? body.subject : undefined,
    preheader: typeof body.preheader === 'string' ? body.preheader : undefined,
    contentMarkdown: typeof body.contentMarkdown === 'string' ? body.contentMarkdown : undefined,
    html: typeof body.html === 'string' ? body.html : undefined,
    text: typeof body.text === 'string' ? body.text : undefined,
    status: typeof status === 'string' ? status : undefined,
    sentAt: typeof body.sentAt === 'string' ? body.sentAt : undefined,
    recipientsCount: typeof body.recipientsCount === 'number' ? body.recipientsCount : undefined,
  });

  return doc ? c.json({ doc }) : c.json({ error: 'Not found' }, 404);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((error, c) => {
  console.error('[hono-api]', error);
  return c.json({ error: 'Internal server error', details: String(error) }, 500);
});

Bun.serve({ port, fetch: app.fetch });
console.log(`🚀 Hono API listening on http://localhost:${port}`);
console.log(`🗄️  SQLite database: ${getDbPath()}`);
