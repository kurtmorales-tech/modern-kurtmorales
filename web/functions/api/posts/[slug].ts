import type { PagesFunction } from '@cloudflare/workers-types';
import type { Env } from '../../_shared';
import { json, cors, parsePost } from '../../_shared';

// GET /api/posts/[slug]
export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ params, env }) => {
  try {
    const row = await env.DB
      .prepare('SELECT * FROM posts WHERE slug = ? LIMIT 1')
      .bind(params.slug)
      .first<Record<string, unknown>>();

    if (!row) return json({ error: 'Not found' }, 404);
    return json(parsePost(row));
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

// PUT /api/posts/[slug] — admin only
export const onRequestPut: PagesFunction<Env, 'slug'> = async ({ params, request, env }) => {
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${env.ADMIN_SECRET || 'change-me'}`) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json() as Record<string, unknown>;
    const fields = ['title','excerpt','content','date','read_time','tags','cover_url','cover_alt','status'];
    const sets: string[] = [];
    const vals: unknown[] = [];

    fields.forEach(f => {
      if (body[f] !== undefined) {
        sets.push(`${f} = ?`);
        vals.push(f === 'tags' && Array.isArray(body[f]) ? JSON.stringify(body[f]) : body[f]);
      }
    });

    if (!sets.length) return json({ error: 'Nothing to update' }, 400);
    sets.push('updated_at = ?'); vals.push(new Date().toISOString());
    vals.push(params.slug);

    await env.DB.prepare(`UPDATE posts SET ${sets.join(', ')} WHERE slug = ?`).bind(...vals).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

// DELETE /api/posts/[slug] — admin only
export const onRequestDelete: PagesFunction<Env, 'slug'> = async ({ params, request, env }) => {
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${env.ADMIN_SECRET || 'change-me'}`) return json({ error: 'Unauthorized' }, 401);

  await env.DB.prepare('DELETE FROM posts WHERE slug = ?').bind(params.slug).run();
  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = async () => cors();
