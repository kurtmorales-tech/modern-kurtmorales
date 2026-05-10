import { generateContentDrafts, type ContentGenerateRequest } from './lib/content-generator';

/**
 * Worker entrypoint for Workers + Assets.
 * Static assets are served automatically from dist/.
 * Handles API endpoints and redirects.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  project?: string;
  budget?: string;
}

interface BlogEditorPostRecord {
  sourceId: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'draft' | 'published';
  coverUrl: string;
  coverAlt: string;
  createdAt?: string;
  updatedAt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── Redirects ──────────────────────────────────────────────

    // www → non-www
    if (url.hostname === 'www.kurtmorales.com') {
      url.hostname = 'kurtmorales.com';
      return Response.redirect(url.toString(), 301);
    }

    // blogs.kurtmorales.com → /blog
    if (url.hostname === 'blogs.kurtmorales.com') {
      if (url.pathname === '/') {
        return Response.redirect('https://kurtmorales.com/blog', 302);
      }
      url.hostname = 'kurtmorales.com';
      if (!url.pathname.startsWith('/blog')) {
        url.pathname = '/blog' + url.pathname;
      }
      return Response.redirect(url.toString(), 302);
    }

    // ── API Routes ─────────────────────────────────────────────

    // POST /api/contact — contact form submission
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request);
    }

    if (url.pathname === '/api/content/generate' && request.method === 'POST') {
      return handleContentGenerate(request, env);
    }

    const blogEditorMatch = url.pathname.match(/^\/api\/blog-editor\/posts\/([^/]+)$/);
    if (blogEditorMatch) {
      return handleBlogEditor(request, env, decodeURIComponent(blogEditorMatch[1]));
    }

    // ── Static Assets ──────────────────────────────────────────

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

function unauthorized() {
  return json({ error: 'Unauthorized' }, 401);
}

function requireBearerAuth(request: Request, secret: string | undefined, missingSecretMessage: string) {
  if (!secret) {
    return json({ error: missingSecretMessage }, 503);
  }

  return request.headers.get('authorization') === `Bearer ${secret}`
    ? null
    : unauthorized();
}

function requireEditorAuth(request: Request, env: Env) {
  return requireBearerAuth(request, env.BLOG_EDITOR_TOKEN, 'BLOG_EDITOR_TOKEN is not configured');
}

function requireAdminAuth(request: Request, env: Env) {
  return requireBearerAuth(request, env.ADMIN_SECRET, 'ADMIN_SECRET is not configured');
}

async function handleContentGenerate(request: Request, env: Env): Promise<Response> {
  const authError = requireAdminAuth(request, env);
  if (authError) return authError;

  if (!env.BLOG_EDITOR_DB) {
    return json({ error: 'BLOG_EDITOR_DB binding is not configured' }, 503);
  }

  let body: ContentGenerateRequest = {};

  try {
    const rawBody = await request.text();
    body = rawBody ? (JSON.parse(rawBody) as ContentGenerateRequest) : {};
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (body.source !== undefined && typeof body.source !== 'string') {
    return json({ error: 'source must be a string' }, 400);
  }

  if (body.limit !== undefined && (!Number.isFinite(body.limit) || body.limit < 1)) {
    return json({ error: 'limit must be a positive number' }, 400);
  }

  const existing = await env.BLOG_EDITOR_DB.prepare(
    `SELECT slug, source_id
     FROM blog_editor_posts
     WHERE source_id LIKE 'rss:%'`,
  ).all<Record<string, unknown>>();

  const existingRows = existing.results ?? [];
  const existingSlugs = existingRows
    .map((row) => (typeof row.slug === 'string' ? row.slug : ''))
    .filter(Boolean);
  const existingSourceIds = existingRows
    .map((row) => (typeof row.source_id === 'string' ? row.source_id : ''))
    .filter(Boolean);

  console.log(
    JSON.stringify({
      level: 'info',
      event: 'content-generate.requested',
      source: body.source ?? 'all',
      limit: body.limit ?? 1,
    }),
  );

  const { drafts, warnings, usedSources } = await generateContentDrafts({
    source: body.source,
    limit: body.limit,
    existingSlugs,
    existingSourceIds,
  });

  if (drafts.length === 0) {
    return json({
      ok: true,
      saved: 0,
      docs: [],
      usedSources,
      warnings,
      message: 'No new content candidates were generated.',
    });
  }

  const now = new Date().toISOString();

  for (const draft of drafts) {
    await env.BLOG_EDITOR_DB.prepare(
      `INSERT INTO blog_editor_posts (
        slug, source_id, title, excerpt, content_markdown, date, read_time, tags_json, status, cover_url, cover_alt, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        source_id = excluded.source_id,
        title = excluded.title,
        excerpt = excluded.excerpt,
        content_markdown = excluded.content_markdown,
        date = excluded.date,
        read_time = excluded.read_time,
        tags_json = excluded.tags_json,
        status = excluded.status,
        cover_url = excluded.cover_url,
        cover_alt = excluded.cover_alt,
        updated_at = excluded.updated_at`,
    )
      .bind(
        draft.slug,
        draft.sourceId,
        draft.title,
        draft.excerpt,
        draft.contentMarkdown,
        draft.date,
        draft.readTime || null,
        JSON.stringify(draft.tags),
        draft.status,
        draft.coverUrl || null,
        draft.coverAlt || null,
        now,
        now,
      )
      .run();
  }

  console.log(
    JSON.stringify({
      level: 'info',
      event: 'content-generate.saved',
      count: drafts.length,
      slugs: drafts.map((draft) => draft.slug),
    }),
  );

  return json(
    {
      ok: true,
      saved: drafts.length,
      docs: drafts,
      usedSources,
      warnings,
    },
  );
}

async function handleBlogEditor(request: Request, env: Env, slug: string): Promise<Response> {
  const authError = requireEditorAuth(request, env);
  if (authError) return authError;

  if (!env.BLOG_EDITOR_DB) {
    return json({ error: 'BLOG_EDITOR_DB binding is not configured' }, 503);
  }

  if (request.method === 'GET') {
    const row = await env.BLOG_EDITOR_DB.prepare(
      `SELECT slug, source_id, title, excerpt, content_markdown, date, read_time, tags_json, status, cover_url, cover_alt, created_at, updated_at
       FROM blog_editor_posts
       WHERE slug = ?
       LIMIT 1`,
    )
      .bind(slug)
      .first<Record<string, unknown>>();

    return json({ doc: row ? toBlogEditorDoc(row) : null });
  }

  if (request.method === 'PUT') {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const payload = validateBlogEditorPayload(body, slug);
    if (!payload) {
      return json({ error: 'Invalid blog editor payload' }, 400);
    }

    const now = new Date().toISOString();
    await env.BLOG_EDITOR_DB.prepare(
      `INSERT INTO blog_editor_posts (
        slug, source_id, title, excerpt, content_markdown, date, read_time, tags_json, status, cover_url, cover_alt, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        source_id = excluded.source_id,
        title = excluded.title,
        excerpt = excluded.excerpt,
        content_markdown = excluded.content_markdown,
        date = excluded.date,
        read_time = excluded.read_time,
        tags_json = excluded.tags_json,
        status = excluded.status,
        cover_url = excluded.cover_url,
        cover_alt = excluded.cover_alt,
        updated_at = excluded.updated_at`,
    )
      .bind(
        payload.slug,
        payload.sourceId,
        payload.title,
        payload.excerpt,
        payload.contentMarkdown,
        payload.date,
        payload.readTime || null,
        JSON.stringify(payload.tags),
        payload.status,
        payload.coverUrl || null,
        payload.coverAlt || null,
        now,
        now,
      )
      .run();

    console.log(
      JSON.stringify({
        level: 'info',
        event: 'blog-editor.saved',
        slug: payload.slug,
        status: payload.status,
      }),
    );

    const savedRow = await env.BLOG_EDITOR_DB.prepare(
      `SELECT slug, source_id, title, excerpt, content_markdown, date, read_time, tags_json, status, cover_url, cover_alt, created_at, updated_at
       FROM blog_editor_posts
       WHERE slug = ?
       LIMIT 1`,
    )
      .bind(payload.slug)
      .first<Record<string, unknown>>();

    return json({ doc: savedRow ? toBlogEditorDoc(savedRow) : { ...payload, createdAt: now, updatedAt: now } });
  }

  return json({ error: 'Method not allowed' }, 405, { Allow: 'GET, PUT' });
}

function validateBlogEditorPayload(body: unknown, slug: string): BlogEditorPostRecord | null {
  if (!body || typeof body !== 'object') return null;

  const record = body as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const excerpt = typeof record.excerpt === 'string' ? record.excerpt.trim() : '';
  const contentMarkdown = typeof record.contentMarkdown === 'string' ? record.contentMarkdown : '';
  const date = typeof record.date === 'string' ? record.date.trim() : '';
  const sourceId = typeof record.sourceId === 'string' ? record.sourceId.trim() : '';
  const status = record.status === 'published' ? 'published' : record.status === 'draft' ? 'draft' : null;
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean)
    : null;

  if (!title || !excerpt || !contentMarkdown || !date || !sourceId || !status || !tags) {
    return null;
  }

  return {
    sourceId,
    slug,
    title,
    excerpt,
    contentMarkdown,
    date,
    readTime: typeof record.readTime === 'string' ? record.readTime.trim() : '',
    tags,
    status,
    coverUrl: typeof record.coverUrl === 'string' ? record.coverUrl.trim() : '',
    coverAlt: typeof record.coverAlt === 'string' ? record.coverAlt.trim() : '',
  };
}

function toBlogEditorDoc(row: Record<string, unknown>): BlogEditorPostRecord {
  let tags: string[] = [];

  if (typeof row.tags_json === 'string') {
    try {
      const parsed = JSON.parse(row.tags_json);
      if (Array.isArray(parsed)) {
        tags = parsed.filter((tag): tag is string => typeof tag === 'string');
      }
    } catch {
      tags = [];
    }
  }

  return {
    sourceId: typeof row.source_id === 'string' ? row.source_id : '',
    slug: typeof row.slug === 'string' ? row.slug : '',
    title: typeof row.title === 'string' ? row.title : '',
    excerpt: typeof row.excerpt === 'string' ? row.excerpt : '',
    contentMarkdown: typeof row.content_markdown === 'string' ? row.content_markdown : '',
    date: typeof row.date === 'string' ? row.date : '',
    readTime: typeof row.read_time === 'string' ? row.read_time : '',
    tags,
    status: row.status === 'published' ? 'published' : 'draft',
    coverUrl: typeof row.cover_url === 'string' ? row.cover_url : '',
    coverAlt: typeof row.cover_alt === 'string' ? row.cover_alt : '',
    createdAt: typeof row.created_at === 'string' ? row.created_at : undefined,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : undefined,
  };
}

async function handleContact(request: Request): Promise<Response> {
  try {
    const payload: ContactPayload = await request.json();

    const { name, email, message, project, budget } = payload;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // In production, this would forward to an email service.
    // For now, we accept the submission and log it.
    console.log(
      JSON.stringify({
        level: 'info',
        event: 'contact.submission',
        name,
        email,
        project: project || 'not specified',
        budget: budget || 'not specified',
        message: message.slice(0, 200),
      }),
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

interface Env {
  ASSETS: Fetcher;
  BLOG_EDITOR_DB: D1Database;
  BLOG_EDITOR_TOKEN?: string;
  ADMIN_SECRET?: string;
  ENVIRONMENT: string;
  SITE_URL: string;
}
