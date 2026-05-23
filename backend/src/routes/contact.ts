import { Hono } from 'hono';
import { z } from 'zod';
import { zCreateContactMessage, zBulkDelete } from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const contactApp = new Hono();

// POST /api/contact — public
contactApp.post('/', async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zCreateContactMessage.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [newMsg] = await db
    .insert(schema.contactMessages)
    .values({
      id: crypto.randomUUID(),
      name: parsed.data.name,
      email: parsed.data.email.trim().toLowerCase(),
      project: parsed.data.project ?? null,
      budget: parsed.data.budget ?? null,
      message: parsed.data.message,
    })
    .returning();

  return c.json({ success: true, doc: newMsg }, 201);
});

// GET /api/contact/messages — admin
contactApp.get('/messages', requireAuth, async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '200';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 200, 10000));
  const rows = await db
    .select()
    .from(schema.contactMessages)
    .orderBy(schema.contactMessages.createdAt)
    .limit(limit);
  return c.json({ docs: rows, totalDocs: rows.length });
});

// GET /api/contact/messages/:id — admin
contactApp.get('/messages/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [row] = await db
    .select()
    .from(schema.contactMessages)
    .where(eq(schema.contactMessages.id, id))
    .limit(1);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: row });
});

// DELETE /api/contact/messages/:id — admin
contactApp.delete('/messages/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const result = await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

export { contactApp };
