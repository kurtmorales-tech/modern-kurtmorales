import { db, schema } from './src/drizzle/db';
import { eq } from 'drizzle-orm';

async function seed() {
  // Only seed if tables are empty
  const postCount = await db.select({ count: 1 }).from(schema.posts).limit(1);
  if (postCount.length > 0) {
    console.log('Database already seeded.');
    return;
  }

  await db.transaction(async (tx) => {
    // Seed posts
    await tx.insert(schema.posts).values({
      id: crypto.randomUUID(),
      slug: 'welcome',
      title: 'Welcome to KurtMorales',
      excerpt: 'Building clean, fast, SEO-optimized websites.',
      contentMarkdown: '# Welcome\n\nThis is the KurtMorales portfolio blog.',
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      tags: JSON.stringify([{ tag: 'welcome' }]),
    });

    // Seed projects
    await tx.insert(schema.projects).values({
      id: crypto.randomUUID(),
      title: 'KurtMorales Portfolio',
      type: 'Website',
      tech: 'React, Hono, Drizzle, Bun',
      description: 'A modern portfolio website built with cutting-edge tools.',
      sortOrder: 0,
    });

    // Seed templates
    await tx.insert(schema.templates).values({
      id: crypto.randomUUID(),
      title: 'Portfolio Starter',
      description: 'A clean portfolio template to kickstart your next project.',
      tech: 'React, Tailwind CSS, Vite',
      featured: 1,
      price: 0,
      sortOrder: 0,
    });

    // Seed a test newsletter
    await tx.insert(schema.newsletters).values({
      id: crypto.randomUUID(),
      title: 'Launch Edition',
      subject: 'Welcome to the KurtMorales newsletter',
      preheader: 'Updates on projects, tips, and more.',
      contentMarkdown: '# Launch Edition\n\nWelcome aboard!',
      status: 'sent',
      recipientsCount: 0,
    });

    console.log('Seeded database successfully.');
  });
}

seed().catch((e) => {
  console.error('Seed failed:', e);
});