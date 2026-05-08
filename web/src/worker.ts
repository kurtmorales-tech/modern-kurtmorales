/**
 * Worker entrypoint for Workers + Assets.
 * Static assets are served automatically from dist/.
 * Handles API endpoints and redirects.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  project?: string;
  budget?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── Redirects ──────────────────────────────────────────────

    // www → non-www
    if (url.hostname === 'www.kurtmorales.com') {
      url.hostname = 'kurtmorales.com';
      return Response.redirect(url.toString(), 301);
    }

    // blogs.kurtmorales.com → /blog
    if (url.hostname === 'blogs.kurtmorales.com') {
      if (url.pathname === '/') {
        return Response.redirect('https://kurtmorales.com/blog', 302);
      }
      url.hostname = 'kurtmorales.com';
      if (!url.pathname.startsWith('/blog')) {
        url.pathname = '/blog' + url.pathname;
      }
      return Response.redirect(url.toString(), 302);
    }

    // ── API Routes ─────────────────────────────────────────────

    // POST /api/contact — contact form submission
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request);
    }

    // ── Static Assets ──────────────────────────────────────────

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request): Promise<Response> {
  try {
    const payload: ContactPayload = await request.json();

    const { name, email, message, project, budget } = payload;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // In production, this would forward to an email service.
    // For now, we accept the submission and log it.
    console.log(
      JSON.stringify({
        level: 'info',
        event: 'contact.submission',
        name,
        email,
        project: project || 'not specified',
        budget: budget || 'not specified',
        message: message.slice(0, 200),
      }),
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

interface Env {
  ASSETS: Fetcher;
  ENVIRONMENT: string;
  SITE_URL: string;
}
