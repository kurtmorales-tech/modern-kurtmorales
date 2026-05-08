import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  seedNewsletters,
  seedPosts,
  seedProjects,
  seedTemplates,
  type SeedNewsletter,
  type SeedPost,
  type SeedProject,
  type SeedTemplate,
} from './seed-data';

export interface Tag {
  tag: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown?: string;
  date: string;
  readTime?: string;
  tags?: Tag[];
  cover?: { url: string; alt?: string };
  status: 'draft' | 'published';
}

export interface Project {
  id: string;
  title: string;
  type?: string;
  tech?: string;
  description?: string;
  link?: string;
  image?: { url: string; alt?: string };
  order?: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail?: { url: string; alt?: string };
  demoUrl?: string;
  sourceUrl?: string;
  tech?: string;
  tags?: Tag[];
  featured?: boolean;
  price?: number;
  order?: number;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed';
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  contentMarkdown?: string;
  html?: string;
  text?: string;
  status: 'draft' | 'sending' | 'sent';
  sentAt?: string;
  recipientsCount?: number;
}

const dataDir = join(import.meta.dir, '..', 'data');
const dbPath = process.env.DATABASE_PATH || join(dataDir, 'kurtmorales.db');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath, { create: true });

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content_markdown TEXT,
    date TEXT NOT NULL,
    read_time TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    cover_url TEXT,
    cover_alt TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    tech TEXT,
    description TEXT,
    link TEXT,
    image_url TEXT,
    image_alt TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    thumbnail_alt TEXT,
    demo_url TEXT,
    source_url TEXT,
    tech TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'subscribed' CHECK(status IN ('subscribed', 'unsubscribed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    preheader TEXT,
    content_markdown TEXT,
    html TEXT,
    text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'sending', 'sent')),
    sent_at TEXT,
    recipients_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project TEXT,
    budget TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
  CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
  CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
  CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order ASC);
  CREATE INDEX IF NOT EXISTS idx_templates_sort_order ON templates(sort_order ASC);
  CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
  CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
`);

// NOTE: seedDatabase() is now called explicitly via `bun run seed`
// Do not auto-run on module import to avoid duplicate data on restarts
// function seedDatabase() is exported and can be called from seed.ts

function parseTags(value: string | null | undefined): Tag[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (typeof item === 'string') return { tag: item };
        if (item && typeof item === 'object' && 'tag' in item && typeof item.tag === 'string') {
          return { tag: item.tag };
        }
        return null;
      })
      .filter((item): item is Tag => item !== null);
  } catch {
    return [];
  }
}

function serializeTags(tags: Tag[] | undefined): string {
  return JSON.stringify(tags ?? []);
}

function toPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    contentMarkdown: row.content_markdown ? String(row.content_markdown) : undefined,
    date: String(row.date),
    readTime: row.read_time ? String(row.read_time) : undefined,
    tags: parseTags(row.tags ? String(row.tags) : '[]'),
    cover: row.cover_url ? { url: String(row.cover_url), alt: row.cover_alt ? String(row.cover_alt) : undefined } : undefined,
    status: String(row.status) as Post['status'],
  };
}

function toProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: String(row.title),
    type: row.type ? String(row.type) : undefined,
    tech: row.tech ? String(row.tech) : undefined,
    description: row.description ? String(row.description) : undefined,
    link: row.link ? String(row.link) : undefined,
    image: row.image_url ? { url: String(row.image_url), alt: row.image_alt ? String(row.image_alt) : undefined } : undefined,
    order: row.sort_order ? Number(row.sort_order) : 0,
  };
}

function toTemplate(row: Record<string, unknown>): Template {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    thumbnail: row.thumbnail_url ? { url: String(row.thumbnail_url), alt: row.thumbnail_alt ? String(row.thumbnail_alt) : undefined } : undefined,
    demoUrl: row.demo_url ? String(row.demo_url) : undefined,
    sourceUrl: row.source_url ? String(row.source_url) : undefined,
    tech: row.tech ? String(row.tech) : undefined,
    tags: parseTags(row.tags ? String(row.tags) : '[]'),
    featured: Number(row.featured ?? 0) === 1,
    price: Number(row.price ?? 0),
    order: Number(row.sort_order ?? 0),
  };
}

function toSubscriber(row: Record<string, unknown>): Subscriber {
  return {
    id: String(row.id),
    email: String(row.email),
    name: row.name ? String(row.name) : undefined,
    status: String(row.status) as Subscriber['status'],
  };
}

function toNewsletter(row: Record<string, unknown>): Newsletter {
  return {
    id: String(row.id),
    title: String(row.title),
    subject: String(row.subject),
    preheader: row.preheader ? String(row.preheader) : undefined,
    contentMarkdown: row.content_markdown ? String(row.content_markdown) : undefined,
    html: row.html ? String(row.html) : undefined,
    text: row.text ? String(row.text) : undefined,
    status: String(row.status) as Newsletter['status'],
    sentAt: row.sent_at ? String(row.sent_at) : undefined,
    recipientsCount: Number(row.recipients_count ?? 0),
  };
}

function seedPostsTable(posts: SeedPost[]) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO posts (
      id, slug, title, excerpt, content_markdown, date, read_time, tags, cover_url, cover_alt, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((items: SeedPost[]) => {
    for (const post of items) {
      insert.run(
        post.id,
        post.slug,
        post.title,
        post.excerpt,
        post.contentMarkdown ?? null,
        post.date,
        post.readTime ?? null,
        serializeTags(post.tags),
        post.cover?.url ?? null,
        post.cover?.alt ?? null,
        post.status,
      );
    }
  });

  tx(posts);
}

function seedProjectsTable(projects: SeedProject[]) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO projects (
      id, title, type, tech, description, link, image_url, image_alt, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((items: SeedProject[]) => {
    for (const project of items) {
      insert.run(
        project.id,
        project.title,
        project.type ?? null,
        project.tech ?? null,
        project.description ?? null,
        project.link ?? null,
        project.image?.url ?? null,
        project.image?.alt ?? null,
        project.order ?? 0,
      );
    }
  });

  tx(projects);
}

function seedTemplatesTable(templates: SeedTemplate[]) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO templates (
      id, title, description, thumbnail_url, thumbnail_alt, demo_url, source_url, tech, tags, featured, price, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((items: SeedTemplate[]) => {
    for (const template of items) {
      insert.run(
        template.id,
        template.title,
        template.description,
        template.thumbnail?.url ?? null,
        template.thumbnail?.alt ?? null,
        template.demoUrl ?? null,
        template.sourceUrl ?? null,
        template.tech ?? null,
        serializeTags(template.tags),
        template.featured ? 1 : 0,
        template.price ?? 0,
        template.order ?? 0,
      );
    }
  });

  tx(templates);
}

function seedNewslettersTable(newsletters: SeedNewsletter[]) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO newsletters (
      id, title, subject, preheader, content_markdown, html, text, status, sent_at, recipients_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((items: SeedNewsletter[]) => {
    for (const newsletter of items) {
      insert.run(
        newsletter.id,
        newsletter.title,
        newsletter.subject,
        newsletter.preheader ?? null,
        newsletter.contentMarkdown ?? null,
        newsletter.html ?? null,
        newsletter.text ?? null,
        newsletter.status,
        newsletter.sentAt ?? null,
        newsletter.recipientsCount ?? 0,
      );
    }
  });

  tx(newsletters);
}

function seedDatabase() {
  seedPostsTable(seedPosts);
  seedProjectsTable(seedProjects);
  seedTemplatesTable(seedTemplates);
  seedNewslettersTable(seedNewsletters);
}

export function getDbPath() {
  return dbPath;
}

export function getHealthSummary() {
  const counts = db
    .query(`
      SELECT
        (SELECT COUNT(*) FROM posts) AS posts,
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM templates) AS templates,
        (SELECT COUNT(*) FROM subscribers) AS subscribers,
        (SELECT COUNT(*) FROM newsletters) AS newsletters,
        (SELECT COUNT(*) FROM contact_messages) AS contactMessages
    `)
    .get() as {
      posts: number;
      projects: number;
      templates: number;
      subscribers: number;
      newsletters: number;
      contactMessages: number;
    };

  return {
    dbPath,
    counts,
  };
}

export function listPosts(options: {
  status?: Post['status'];
  slug?: string;
  limit?: number;
  sort?: string;
} = {}) {
  let sql = 'SELECT * FROM posts';
  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (options.status) {
    clauses.push('status = ?');
    params.push(options.status);
  }

  if (options.slug) {
    clauses.push('slug = ?');
    params.push(options.slug);
  }

  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(' AND ')}`;
  }

  // Handle sort parameter safely - default to date DESC
  if (options.sort) {
    const sortField = options.sort.startsWith('-') ? options.sort.slice(1) : options.sort;
    const sortDirection = options.sort.startsWith('-') ? 'DESC' : 'ASC';
    const validFields = ['date', 'created_at', 'title', 'slug'];
    const field = validFields.includes(sortField) ? sortField : 'date';
    sql += ` ORDER BY ${field} ${sortDirection}`;
  } else {
    sql += ' ORDER BY date DESC';
  }

  sql += ' LIMIT ?';
  params.push(options.limit ?? 150);

  return (db.prepare(sql).all(...params) as Record<string, unknown>[]).map(toPost);
}

export function listProjects(limit = 50) {
  return (db
    .prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC LIMIT ?')
    .all(limit) as Record<string, unknown>[]).map(toProject);
}

export function listTemplates(limit = 50) {
  return (db
    .prepare('SELECT * FROM templates ORDER BY sort_order ASC, created_at ASC LIMIT ?')
    .all(limit) as Record<string, unknown>[]).map(toTemplate);
}

export function listSubscribers(limit = 1000) {
  return (db
    .prepare('SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ?')
    .all(limit) as Record<string, unknown>[]).map(toSubscriber);
}

export function createSubscriber(input: { email: string; name?: string }) {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO subscribers (id, email, name, status, created_at, updated_at)
    VALUES (?, ?, ?, 'subscribed', ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      status = 'subscribed',
      updated_at = excluded.updated_at
  `).run(id, email, name, now, now);

  const row = db.prepare('SELECT * FROM subscribers WHERE email = ? LIMIT 1').get(email) as Record<string, unknown>;
  return toSubscriber(row);
}

export function createContactMessage(input: {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO contact_messages (id, name, email, project, budget, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    input.name.trim(),
    input.email.trim().toLowerCase(),
    input.project?.trim() || null,
    input.budget?.trim() || null,
    input.message.trim(),
    now,
  );

  return {
    id,
    createdAt: now,
  };
}

export function listNewsletters(limit = 50) {
  return (db
    .prepare('SELECT * FROM newsletters ORDER BY created_at DESC LIMIT ?')
    .all(limit) as Record<string, unknown>[]).map(toNewsletter);
}

export function getNewsletterById(id: string) {
  const row = db.prepare('SELECT * FROM newsletters WHERE id = ? LIMIT 1').get(id) as Record<string, unknown> | null;
  return row ? toNewsletter(row) : null;
}

export function updateNewsletter(
  id: string,
  patch: Partial<Pick<Newsletter, 'title' | 'subject' | 'preheader' | 'contentMarkdown' | 'html' | 'text' | 'status' | 'sentAt' | 'recipientsCount'>>,
) {
  const current = getNewsletterById(id);
  if (!current) return null;

  db.prepare(`
    UPDATE newsletters
    SET
      title = ?,
      subject = ?,
      preheader = ?,
      content_markdown = ?,
      html = ?,
      text = ?,
      status = ?,
      sent_at = ?,
      recipients_count = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    patch.title ?? current.title,
    patch.subject ?? current.subject,
    patch.preheader ?? current.preheader ?? null,
    patch.contentMarkdown ?? current.contentMarkdown ?? null,
    patch.html ?? current.html ?? null,
    patch.text ?? current.text ?? null,
    patch.status ?? current.status,
    patch.sentAt ?? current.sentAt ?? null,
    patch.recipientsCount ?? current.recipientsCount ?? 0,
    new Date().toISOString(),
    id,
  );

  return getNewsletterById(id);
}
