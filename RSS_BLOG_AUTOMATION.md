# RSS Blog Automation

## What runs

Local cron runs every 6 hours:

```cron
17 */6 * * * cd /home/kacm/Desktop/kurtmorales_modern && /home/kacm/Desktop/kurtmorales_modern/scripts/rss-blog-cron.sh
```

The script:

1. Reads RSS sources from `scripts/rss-sources.ts`.
2. Generates one original attributed blog post per run.
3. Writes the internal generated-content store to `content/generated-rss-posts.json`.
4. Mirrors public fallback content to `apps/web/src/data/generated-rss-posts.json`.
5. Builds the React app in `apps/web/`.
6. Deploys `apps/web/dist` to Cloudflare Pages project `kurtmorales-modern`.

Logs:

```text
/home/kacm/Desktop/kurtmorales_modern/logs/rss-blog-cron.log
```

Manual run:

```bash
cd /home/kacm/Desktop/kurtmorales_modern
RSS_BLOG_LIMIT=1 bun run rss:cron
```

Generate without deploy:

```bash
cd /home/kacm/Desktop/kurtmorales_modern
bun run rss:publish-local --limit=1
```

## Cloudflare

- Pages project: `kurtmorales-modern`
- Primary live URL: `https://kurtmorales.com/blog`
- Requested blog domain: `https://blogs.kurtmorales.com/blog`

## Current blocker

`blogs.kurtmorales.com` was attached to the Pages project, but Cloudflare reports it as pending because the CNAME is not set. The current Wrangler OAuth token has `zone:read` but not DNS edit.

Required DNS record:

```text
Type: CNAME
Name: blogs
Target: kurtmorales-modern.pages.dev
Proxy: enabled
```

After DNS propagates, `https://blogs.kurtmorales.com/blog` should serve the same deployed blog.
