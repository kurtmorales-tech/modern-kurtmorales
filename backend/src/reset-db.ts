/**
 * Deletes the SQLite file (and WAL sidecars) then runs seed.
 * Stop the backend dev server first so the file is not locked.
 */
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const dataDir = join(import.meta.dir, '..', 'data');
const dbPath = process.env.DATABASE_PATH || join(dataDir, 'kurtmorales.db');

const paths = [dbPath, `${dbPath}-wal`, `${dbPath}-shm`];
for (const p of paths) {
  if (existsSync(p)) {
    unlinkSync(p);
    console.log(`Removed ${p}`);
  }
}

await import('./seed.ts');
