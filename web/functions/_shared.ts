// Shared types & helpers for all Pages Functions

export interface Env {
  DB: D1Database;
  ADMIN_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_EMAIL?: string;
  ENVIRONMENT?: string;
  SITE_URL?: string;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': status === 200 ? 'public, max-age=60, stale-while-revalidate=300' : 'no-store',
    },
  });
}

export function cors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function parsePost(row: Record<string, unknown>) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    readTime: row.read_time,
    tags: (() => {
      try { return (JSON.parse(row.tags as string) as string[]).map((t: string) => ({ tag: t })); }
      catch { return []; }
    })(),
    cover: row.cover_url ? { url: row.cover_url, alt: row.cover_alt } : undefined,
    status: row.status,
  };
}

export function parseProject(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    tech: row.tech,
    description: row.description,
    link: row.link,
    image: row.image_url ? { url: row.image_url, alt: row.image_alt } : undefined,
    order: row.sort_order,
  };
}

export function isAdmin(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization') || '';
  const secret = env.ADMIN_SECRET || 'change-me-in-production';
  return auth === `Bearer ${secret}`;
}
