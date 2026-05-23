import { Hono } from 'hono';
import { z } from 'zod';
import {
  zCreateNewsletter,
  zUpdateNewsletter,
  zBulkDelete,
  type InsertNewsletter,
} from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const newslettersApp = new Hono();

// GET /api/newsletters — public (published only)
newslettersApp.get('/', async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '50';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 50, 500));
  const rows = await db
    .select()
    .from(schema.newsletters)
    .orderBy(schema.newsletters.createdAt)
    .limit(limit);
  return c.json({ docs: rows, totalDocs: rows.length });
});

// GET /api/newsletters/:id — public
newslettersApp.get('/:id', async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [row] = await db
    .select()
    .from(schema.newsletters)
    .where(eq(schema.newsletters.id, id))
    .limit(1);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: row });
});

// PATCH /api/newsletters/:id — admin
newslettersApp.patch('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Invalid JSON body' }, 400);

  const status = body.status;
  if (status !== undefined && status !== 'draft' && status !== 'sending' && status !== 'sent') {
    return c.json({ error: 'Invalid newsletter status' }, 400);
  }

  const parsed = zUpdateNewsletter.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [existing] = await db
    .select()
    .from(schema.newsletters)
    .where(eq(schema.newsletters.id, id))
    .limit(1);
  if (!existing) return c.json({ error: 'Not found' }, 404);

  await db
    .update(schema.newsletters)
    .set({
      title: parsed.data.title ?? existing.title,
      subject: parsed.data.subject ?? existing.subject,
      preheader: parsed.data.preheader ?? existing.preheader,
      contentMarkdown: parsed.data.contentMarkdown ?? existing.contentMarkdown,
      html: parsed.data.html ?? existing.html,
      text: parsed.data.text ?? existing.text,
      status: parsed.data.status ?? existing.status,
      sentAt: parsed.data.sentAt ?? existing.sentAt,
      recipientsCount: parsed.data.recipientsCount ?? existing.recipientsCount,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.newsletters.id, id));

  const [updated] = await db
    .select()
    .from(schema.newsletters)
    .where(eq(schema.newsletters.id, id))
    .limit(1);
  return c.json({ doc: updated });
});

// ---- Admin: list all newsletters (incl drafts) ----
// Static "/list" route MUST come before dynamic "/:id" to avoid conflict
newslettersApp.get('/list', requireAuth, async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '200';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 200, 10000));
  const statusFilter = c.req.query('where[status][equals]') as
    | 'draft'
    | 'sending'
    | 'sent'
    | undefined;

  let query = db.select().from(schema.newsletters).$dynamic();
  if (statusFilter) query = query.where(eq(schema.newsletters.status, statusFilter));
  const rows = await query.orderBy(schema.newsletters.createdAt).limit(limit);

  return c.json({ docs: rows, totalDocs: rows.length });
});

// DELETE /api/newsletters — admin bulk delete
newslettersApp.delete('/', requireAuth, async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zBulkDelete.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const result = await db
    .delete(schema.newsletters)
    .where(eq(schema.newsletters.id, parsed.data.id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

export { newslettersApp };
