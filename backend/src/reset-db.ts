import { migrate } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';

const dbPath = process.env.DATABASE_PATH || join(import.meta.dir, 'data', 'kurtmorales.db');
mkdirSync(dirname(dbPath), { recursive: true });

// Delete existing DB file to start fresh
rmSync(dbPath, { force: true });

// Re-create empty DB and run migrations
const db = new Database(dbPath);
migrate(db, { migrationsFolder: join(import.meta.dir, 'drizzle') });

console.log('Database reset complete. Run `bun run seed` to populate seed data.');