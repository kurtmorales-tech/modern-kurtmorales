import type { PagesFunction } from '@cloudflare/workers-types';
import type { Env } from '../_shared';
import { json, cors, parseProject } from '../_shared';

// GET /api/projects
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results } = await env.DB
      .prepare('SELECT * FROM projects ORDER BY sort_order ASC')
      .all<Record<string, unknown>>();
    return json({ docs: results.map(parseProject), totalDocs: results.length });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

// POST /api/projects — admin only
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${env.ADMIN_SECRET || 'change-me'}`) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json() as Record<string, unknown>;
    const { title, type, tech, description, link, image_url, image_alt, sort_order } = body;
    if (!title) return json({ error: 'title required' }, 400);

    await env.DB
      .prepare('INSERT INTO projects (title, type, tech, description, link, image_url, image_alt, sort_order) VALUES (?,?,?,?,?,?,?,?)')
      .bind(title, type || null, tech || null, description || null, link || null, image_url || null, image_alt || null, sort_order || 0)
      .run();

    return json({ ok: true }, 201);
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => cors();
