import { Hono } from 'hono';
import { z } from 'zod';
import { zCreateProject, zUpdateProject, type InsertProject } from '../schemas';
import { getDb, schema } from '../drizzle/db';
import { eq } from 'drizzle-orm';

const projectsApp = new Hono();

// GET /api/projects — public
projectsApp.get('/', async (c) => {
  const db = getDb(c.env);
  const limitStr = c.req.query('limit') ?? '50';
  const limit = Math.max(1, Math.min(parseInt(limitStr, 10) || 50, 200));
  const rows = await db
    .select()
    .from(schema.projects)
    .orderBy(schema.projects.sortOrder)
    .limit(limit);
  return c.json({ docs: rows, totalDocs: rows.length });
});

// GET /api/projects/:id — admin
projectsApp.get('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ doc: row });
});

// POST /api/projects — admin
projectsApp.post('/', requireAuth, async (c) => {
  const db = getDb(c.env);
  const body = await c.req.json().catch(() => null);
  const parsed = zCreateProject.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const newProject: InsertProject = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.insert(schema.projects).values(newProject);
  const [created] = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, newProject.id))
    .limit(1);
  return c.json({ doc: created }, 201);
});

// PUT /api/projects/:id — admin
projectsApp.put('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  const parsed = zUpdateProject.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [existing] = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, id))
    .limit(1);
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const data = parsed.data;
  await db
    .update(schema.projects)
    .set({
      title: data.title ?? existing.title,
      type: data.type ?? existing.type,
      tech: data.tech ?? existing.tech,
      description: data.description ?? existing.description,
      link: data.link ?? existing.link,
      imageUrl: data.image?.url ?? existing.imageUrl,
      imageAlt: data.image?.alt ?? existing.imageAlt,
      sortOrder: data.order ?? existing.sortOrder,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.projects.id, id));

  const [updated] = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, id))
    .limit(1);
  return c.json({ doc: updated });
});

// DELETE /api/projects/:id — admin
projectsApp.delete('/:id', requireAuth, async (c) => {
  const db = getDb(c.env);
  const id = c.req.param('id');
  const result = await db.delete(schema.projects).where(eq(schema.projects.id, id));
  if ((result.changes ?? 0) === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

import { requireAuth } from '../middleware/auth';
export { projectsApp };
