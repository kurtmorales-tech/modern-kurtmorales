import { createMiddleware } from 'hono/factory';

const adminSecret = process.env.BACKEND_ADMIN_SECRET || '';

/**
 * Hono middleware that validates the `Authorization: Bearer <secret>` header.
 * Returns 401 JSON if invalid.
 */
export const requireAuth = createMiddleware(async (c, next) => {
  if (!adminSecret) {
    return c.json({ error: 'Admin secret not configured' }, 500);
  }

  const auth = c.req.header('Authorization');
  if (auth !== `Bearer ${adminSecret}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
});