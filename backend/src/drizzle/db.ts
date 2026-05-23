import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as schema from './schema';
import { drizzle as drizzleBun } from 'drizzle-orm/bun-sqlite';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';

export const dataDir = join(import.meta.dir, '..', 'data');
export const dbPath = process.env.DATABASE_PATH || join(dataDir, 'kurtmorales.db');

mkdirSync(dataDir, { recursive: true });

// Local cache for the Bun SQLite instance
let localDb: any = null;

export function getDb(env?: any) {
  if (env?.DB) {
    // Cloudflare D1
    return drizzleD1(env.DB, { schema });
  }

  // Local Bun SQLite
  if (!localDb) {
    const sqlite = new Database(dbPath);
    localDb = drizzleBun(sqlite, { schema });
  }
  return localDb;
}

export function getDbPath() {
  return dbPath;
}

export function getHealthSummary(db: any) {
  const counts = db
    .query(
      `
      SELECT
        (SELECT COUNT(*) FROM posts) AS posts,
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM templates) AS templates,
        (SELECT COUNT(*) FROM subscribers) AS subscribers,
        (SELECT COUNT(*) FROM newsletters) AS newsletters,
        (SELECT COUNT(*) FROM contact_messages) AS contactMessages
    `,
    )
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

// Run migrations in production; in dev, drizzle-kit handles schema via migration files
if (process.env.NODE_ENV === 'production') {
  const sqlite = new Database(dbPath);
  migrate(sqlite, { migrationsFolder: join(import.meta.dir, 'drizzle') });
}

export { schema };
export type {
  Post,
  InsertPost,
  Project,
  InsertProject,
  Template,
  InsertTemplate,
  Subscriber,
  InsertSubscriber,
  Newsletter,
  InsertNewsletter,
  ContactMessage,
  InsertContactMessage,
} from './schema';
