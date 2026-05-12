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
} from './db';

const port = Number(process.env.PORT || 3001);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://kurtmorales.com')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const adminSecret = process.env.BACKEND_ADMIN_SECRET || '';

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

function json(request: Request, body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
      ...headers,
    },
  });
}

function text(request: Request, body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...corsHeaders(request),
    },
  });
}

function parseLimit(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}

function isAuthorized(request: Request) {
  if (!adminSecret) return false;
  return request.headers.get('authorization') === `Bearer ${adminSecret}`;
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    try {
      if (pathname === '/') {
        return text(request, `KurtMorales Bun backend running on :${port}\nDB: ${getDbPath()}`);
      }

      if ((pathname === '/health' || pathname === '/api/health') && request.method === 'GET') {
        return json(request, {
          ok: true,
          service: 'kurtmorales-backend',
          ...getHealthSummary(),
        });
      }

      if (pathname === '/api/posts' && request.method === 'GET') {
        const docs = listPosts({
          status:
            (searchParams.get('where[status][equals]') as 'draft' | 'published' | null) ??
            undefined,
          slug: searchParams.get('where[slug][equals]') ?? undefined,
          limit: parseLimit(searchParams.get('limit'), 150),
          sort: searchParams.get('sort') ?? '-date',
        });

        return json(request, {
          docs,
          totalDocs: docs.length,
          limit: docs.length,
        });
      }

      if (pathname === '/api/projects' && request.method === 'GET') {
        const docs = listProjects(parseLimit(searchParams.get('limit'), 50));
        return json(request, {
          docs,
          totalDocs: docs.length,
          limit: docs.length,
        });
      }

      if (pathname === '/api/templates' && request.method === 'GET') {
        const docs = listTemplates(parseLimit(searchParams.get('limit'), 50));
        return json(request, {
          docs,
          totalDocs: docs.length,
          limit: docs.length,
        });
      }

      if (pathname === '/api/subscribers' && request.method === 'GET') {
        const docs = listSubscribers(parseLimit(searchParams.get('limit'), 1000));
        return json(request, {
          docs,
          totalDocs: docs.length,
          limit: docs.length,
        });
      }

      if (pathname === '/api/subscribers' && request.method === 'POST') {
        const body = await readJson<{ email?: string; name?: string }>(request);

        if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
          return json(request, { error: 'A valid email is required' }, 400);
        }

        const doc = createSubscriber({ email: body.email, name: body.name });
        return json(request, { doc }, 201);
      }

      if (pathname === '/api/contact' && request.method === 'POST') {
        const body = await readJson<{
          name?: string;
          email?: string;
          project?: string;
          budget?: string;
          message?: string;
        }>(request);

        if (!body?.name?.trim()) {
          return json(request, { error: 'Name is required' }, 400);
        }

        if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
          return json(request, { error: 'A valid email is required' }, 400);
        }

        if (!body?.message?.trim()) {
          return json(request, { error: 'Message is required' }, 400);
        }

        const doc = createContactMessage({
          name: body.name,
          email: body.email,
          project: body.project,
          budget: body.budget,
          message: body.message,
        });

        return json(request, { success: true, doc }, 201);
      }

      if (pathname === '/api/newsletters' && request.method === 'GET') {
        const docs = listNewsletters(parseLimit(searchParams.get('limit'), 50));
        return json(request, {
          docs,
          totalDocs: docs.length,
          limit: docs.length,
        });
      }

      const newsletterMatch = pathname.match(/^\/api\/newsletters\/([^/]+)$/);
      if (newsletterMatch) {
        const id = decodeURIComponent(newsletterMatch[1]);

        if (request.method === 'GET') {
          const doc = getNewsletterById(id);
          return doc ? json(request, { doc }) : json(request, { error: 'Not found' }, 404);
        }

        if (request.method === 'PATCH') {
          if (!isAuthorized(request)) {
            return json(request, { error: 'Unauthorized' }, 401);
          }

          const body = await readJson<Record<string, unknown>>(request);
          if (!body) {
            return json(request, { error: 'Invalid JSON body' }, 400);
          }

          const status = body.status;
          if (
            status !== undefined &&
            status !== 'draft' &&
            status !== 'sending' &&
            status !== 'sent'
          ) {
            return json(request, { error: 'Invalid newsletter status' }, 400);
          }

          const doc = updateNewsletter(id, {
            title: typeof body.title === 'string' ? body.title : undefined,
            subject: typeof body.subject === 'string' ? body.subject : undefined,
            preheader: typeof body.preheader === 'string' ? body.preheader : undefined,
            contentMarkdown:
              typeof body.contentMarkdown === 'string' ? body.contentMarkdown : undefined,
            html: typeof body.html === 'string' ? body.html : undefined,
            text: typeof body.text === 'string' ? body.text : undefined,
            status:
              typeof status === 'string' ? (status as 'draft' | 'sending' | 'sent') : undefined,
            sentAt: typeof body.sentAt === 'string' ? body.sentAt : undefined,
            recipientsCount:
              typeof body.recipientsCount === 'number' ? body.recipientsCount : undefined,
          });

          return doc ? json(request, { doc }) : json(request, { error: 'Not found' }, 404);
        }
      }

      return json(request, { error: 'Not found' }, 404);
    } catch (error) {
      console.error('[backend]', error);
      return json(request, { error: 'Internal server error', details: String(error) }, 500);
    }
  },
});

console.log(`🚀 KurtMorales backend listening on http://localhost:${server.port}`);
console.log(`🗄️  SQLite database: ${getDbPath()}`);
