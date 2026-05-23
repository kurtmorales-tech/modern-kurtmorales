import { Hono } from 'hono';
import { z } from 'zod';
import { zCreateSubscriber, zBulkDelete } from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const subscribersApp = new Hono();

// GET /api/subscribers — public (read-only probe)
subscribersApp.get('/', async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '1000';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 1000, 10000));
  const rows = await db
    .select()
    .from(schema.subscribers)
    .orderBy(schema.subscribers.createdAt)
    .limit(limit);
  return c.json({ docs: rows, totalDocs: rows.length });
});

// POST /api/subscribers — public
subscribersApp.post('/', async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zCreateSubscriber.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const now = new Date().toISOString();
  const newSub: typeof schema.subscribers.$inferInsert = {
    id: crypto.randomUUID(),
    email: parsed.data.email.trim().toLowerCase(),
    name: parsed.data.name?.trim() ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .insert(schema.subscribers)
    .values(newSub)
    .onConflictDoUpdate({
      target: schema.subscribers.email,
      set: { name: newSub.name, status: 'subscribed' as const, updatedAt: now },
    });

  const [row] = await db
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.email, newSub.email))
    .limit(1);
  return c.json({ doc: row }, 201);
});

// GET /api/subscribers/:id — admin
subscribersApp.get('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [row] = await db
    .select()
    .from(schema.subscribers)
    .where(eq(schema.subscribers.id, id))
    .limit(1);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: row });
});

// DELETE /api/subscribers/:id — admin
subscribersApp.delete('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const result = await db.delete(schema.subscribers).where(eq(schema.subscribers.id, id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

export { subscribersApp };
