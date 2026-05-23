import type { Config } from 'drizzle-kit';

export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  driver: 'bun-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/kurtmorales.db',
  },
} satisfies Config;