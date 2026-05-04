import type { PagesFunction } from '@cloudflare/workers-types';
import type { Env } from '../_shared';
import { json, cors, parsePost } from '../_shared';

// GET /api/posts
// Query params: ?status=published&limit=20&slug=some-slug
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slug   = url.searchParams.get('slug');
  const status = url.searchParams.get('status') || 'published';
  const limit  = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

  try {
    if (slug) {
      const row = await env.DB
        .prepare('SELECT * FROM posts WHERE slug = ? LIMIT 1')
        .bind(slug)
        .first<Record<string, unknown>>();
      if (!row) return json({ error: 'Not found' }, 404);
      return json({ docs: [parsePost(row)] });
    }

    const { results } = await env.DB
      .prepare('SELECT * FROM posts WHERE status = ? ORDER BY date DESC LIMIT ?')
      .bind(status, limit)
      .all<Record<string, unknown>>();

    return json({ docs: results.map(parsePost), totalDocs: results.length });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

// POST /api/posts — admin only
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${env.ADMIN_SECRET || 'change-me'}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await request.json() as Record<string, unknown>;
    const { slug, title, excerpt, content, date, read_time, tags, cover_url, cover_alt, status } = body;

    if (!slug || !title || !excerpt) return json({ error: 'slug, title, excerpt required' }, 400);

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

    const result = await env.DB
      .prepare(`INSERT INTO posts (slug, title, excerpt, content, date, read_time, tags, cover_url, cover_alt, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(slug, title, excerpt, content || '', date || new Date().toISOString().slice(0,10), read_time || null, tagsJson, cover_url || null, cover_alt || null, status || 'draft')
      .run();

    return json({ ok: true, meta: result.meta }, 201);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => cors();
