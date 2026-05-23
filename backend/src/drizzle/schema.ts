import { sql, type SQL, type TableConfig } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  contentMarkdown: text('content_markdown'),
  date: text('date').notNull(),
  readTime: text('read_time'),
  tags: text('tags').notNull().default('[]'),
  coverUrl: text('cover_url'),
  coverAlt: text('cover_alt'),
  status: text('status', { enum: ['draft', 'published'] })
    .notNull()
    .default('draft'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type'),
  tech: text('tech'),
  description: text('description'),
  link: text('link'),
  imageUrl: text('image_url'),
  imageAlt: text('image_alt'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  thumbnailAlt: text('thumbnail_alt'),
  demoUrl: text('demo_url'),
  sourceUrl: text('source_url'),
  tech: text('tech'),
  tags: text('tags').notNull().default('[]'),
  featured: integer('featured').notNull().default(0),
  price: real('price').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  status: text('status', { enum: ['subscribed', 'unsubscribed'] })
    .notNull()
    .default('subscribed'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

export const newsletters = sqliteTable('newsletters', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subject: text('subject').notNull(),
  preheader: text('preheader'),
  contentMarkdown: text('content_markdown'),
  html: text('html'),
  text: text('text'),
  status: text('status', { enum: ['draft', 'sending', 'sent'] })
    .notNull()
    .default('draft'),
  sentAt: text('sent_at'),
  recipientsCount: integer('recipients_count').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  project: text('project'),
  budget: text('budget'),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

// Indexes
export const idx = {
  postsStatus: sql`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)`,
  postsSlug: sql`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`,
  postsDate: sql`CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC)`,
  projectsSort: sql`CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order ASC)`,
  templatesSort: sql`CREATE INDEX IF NOT EXISTS idx_templates_sort_order ON templates(sort_order ASC)`,
  subscribersEmail: sql`CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email)`,
  newslettersStatus: sql`CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status)`,
} as const;