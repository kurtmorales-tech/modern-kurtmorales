import { getDbPath, getHealthSummary, seedDatabase } from './db';

// Explicitly call seedDatabase() to populate initial data
seedDatabase();

const summary = getHealthSummary();

console.log('🌱 Bun backend seed complete');
console.log(`DB: ${getDbPath()}`);
console.log(JSON.stringify(summary.counts, null, 2));
