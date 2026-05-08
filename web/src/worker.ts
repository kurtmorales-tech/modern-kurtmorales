/**
 * Worker entrypoint for Workers + Assets.
 * Static assets are served automatically from dist/.
 * Handles redirects that _redirects can't (absolute URLs).
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // www → non-www redirect
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

    // Try to serve from static assets
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

interface Env {
  ASSETS: Fetcher;
  ENVIRONMENT: string;
  SITE_URL: string;
}
