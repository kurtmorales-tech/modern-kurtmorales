import { Hono } from 'hono';
import { z } from 'zod';
import { zCreateTemplate, zUpdateTemplate, type InsertTemplate } from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';

const templatesApp = new Hono();

templatesApp.get('/', async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '50';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 50, 200));
  const rows = await db
    .select()
    .from(schema.templates)
    .orderBy(schema.templates.sortOrder)
    .limit(limit);
  // Strip internal fields
  const docs = rows.map((t) => ({
    ...t,
    thumbnailUrl: undefined,
    demoUrl: undefined,
    sourceUrl: undefined,
    price: undefined,
    featured: undefined,
  }));
  return c.json({ docs, totalDocs: rows.length });
});

templatesApp.get('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [row] = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.id, id))
    .limit(1);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: row });
});

templatesApp.post('/', requireAuth, async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zCreateTemplate.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const newTpl: InsertTemplate = {
    id: crypto.randomUUID(),
    ...parsed.data,
    tags: JSON.stringify(parsed.data.tags ?? []),
    thumbnailUrl: parsed.data.thumbnail?.url ?? null,
    thumbnailAlt: parsed.data.thumbnail?.alt ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.insert(schema.templates).values(newTpl);
  const [created] = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.id, newTpl.id))
    .limit(1);
  return c.json({ doc: created }, 201);
});

templatesApp.put('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  const parsed = zUpdateTemplate.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [existing] = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.id, id))
    .limit(1);
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const data = parsed.data;
  await db
    .update(schema.templates)
    .set({
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      thumbnailUrl: data.thumbnail?.url ?? existing.thumbnailUrl,
      thumbnailAlt: data.thumbnail?.alt ?? existing.thumbnailAlt,
      demoUrl: data.demoUrl ?? existing.demoUrl,
      sourceUrl: data.sourceUrl ?? existing.sourceUrl,
      tech: data.tech ?? existing.tech,
      tags: data.tags ? JSON.stringify(data.tags) : existing.tags,
      featured: data.featured ?? existing.featured,
      price: data.price ?? existing.price,
      sortOrder: data.order ?? existing.sortOrder,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.templates.id, id));

  const [updated] = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.id, id))
    .limit(1);
  return c.json({ doc: updated });
});

templatesApp.delete('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const result = await db.delete(schema.templates).where(eq(schema.templates.id, id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

import { requireAuth } from '../middleware/auth';
export { templatesApp };
