import { Hono } from 'hono';
import { z } from 'zod';
import { zCreatePost, zPostParams, zUpdatePost, type InsertPost } from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';

const postsApp = new Hono();

// GET /api/posts — public
postsApp.get('/', async (c) => {
  const db = getDb(c.env);
  const status = c.req.query('where[status][equals]') as 'draft' | 'published' | undefined;
  const slug = c.req.query('where[slug][equals]');
  const sortRaw = c.req.query('sort') ?? '-date';
  const limitStr = c.req.query('limit') ?? '150';

  let query = db.select().from(schema.posts).$dynamic();

  if (status) query = query.where(eq(schema.posts.status, status));
  if (slug) query = query.where(eq(schema.posts.slug, slug));

  const sortField = sortRaw.startsWith('-') ? sortRaw.slice(1) : sortRaw;
  const sortDir = sortRaw.startsWith('-') ? 'desc' : 'asc';
  const validFields = ['date', 'created_at', 'title', 'slug'] as const;
  const safeField = validFields.includes(sortField as any) ? sortField : 'date';
  // @ts-expect-error — dynamic sort field
  query = query.orderBy(schema.posts[safeField][sortDir]());

  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 150, 500));
  query = query.limit(limit);

  const rows = await query;
  return c.json({ docs: rows, totalDocs: rows.length, limit: rows.length });
});

// GET /api/posts/:id — admin
postsApp.get('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  if (!post) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: post });
});

// POST /api/posts — admin
postsApp.post('/', requireAuth, async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zCreatePost.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const now = new Date().toISOString();
  const newPost: InsertPost = {
    id: crypto.randomUUID(),
    ...parsed.data,
    tags: JSON.stringify(parsed.data.tags ?? []),
    coverUrl: parsed.data.cover?.url ?? null,
    coverAlt: parsed.data.cover?.alt ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(schema.posts).values(newPost);
  const [created] = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.id, newPost.id))
    .limit(1);
  return c.json({ doc: created }, 201);
});

// PUT /api/posts/:id — admin
postsApp.put('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  const parsed = zUpdatePost.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [existing] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const data = parsed.data;
  await db
    .update(schema.posts)
    .set({
      slug: data.slug ?? existing.slug,
      title: data.title ?? existing.title,
      excerpt: data.excerpt ?? existing.excerpt,
      contentMarkdown: data.contentMarkdown ?? existing.contentMarkdown,
      date: data.date ?? existing.date,
      readTime: data.readTime ?? existing.readTime,
      tags: data.tags ? JSON.stringify(data.tags) : existing.tags,
      coverUrl: data.cover?.url ?? existing.coverUrl,
      coverAlt: data.cover?.alt ?? existing.coverAlt,
      status: data.status ?? existing.status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.posts.id, id));

  const [updated] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  return c.json({ doc: updated });
});

// DELETE /api/posts/:id — admin
postsApp.delete('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const result = await db.delete(schema.posts).where(eq(schema.posts.id, id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

import { requireAuth } from '../middleware/auth';
export { postsApp };
