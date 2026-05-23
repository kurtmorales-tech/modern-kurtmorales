import { Hono } from 'hono';
import { z } from 'zod';
import { zAdminLogin } from '../schemas';

const adminSecret = process.env.BACKEND_ADMIN_SECRET || '';

const authApp = new Hono();

// POST /api/admin/login — validate admin secret and return token
authApp.post('/login', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = zAdminLogin.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  if (!adminSecret || parsed.data.secret !== adminSecret) {
    return c.json({ error: 'Invalid secret' }, 401);
  }

  return c.json({
    token: adminSecret,
    expiresAt: null, // session token, no expiry
    permissions: ['read', 'write', 'delete'],
  });
});

// GET /api/admin/verify — check if current token is valid
authApp.get('/verify', async (c) => {
  const auth = c.req.header('Authorization');
  if (auth !== `Bearer ${adminSecret}`) {
    return c.json({ authenticated: false }, 401);
  }
  return c.json({ authenticated: true, permissions: ['read', 'write', 'delete'] });
});

export { authApp };