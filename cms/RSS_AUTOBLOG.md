# RSS → Workers AI → Payload Blog Workflow

This CMS package includes a Cloudflare Worker + Workflow that reads RSS feeds, asks Workers AI to draft original Markdown posts, and publishes them to PayloadCMS `posts`.

## Files

- `src/automation/rssSources.ts` — default RSS sources.
- `src/worker/rss-blog-workflow.ts` — Worker routes, cron handler, and Workflow steps.
- `wrangler.jsonc` — Workflow, Workers AI binding, cron trigger.
- `tsconfig.worker.json` — typecheck config for Worker code.

## Local setup

1. Add the Payload automation token to `cms/.env`:

```bash
CONTENT_AUTOMATION_TOKEN=change-me-local-secret
```

2. Copy Worker local vars:

```bash
cp .dev.vars.example .dev.vars
```

3. Start PayloadCMS on port 3001:

```bash
bun run dev
```

4. In another terminal, start the Worker:

```bash
bun run rss:dev
```

5. Trigger manually:

```bash
RSS_WORKER_TRIGGER_TOKEN=change-me-trigger-secret bun run rss:trigger -- --limit=1
```

Or with curl:

```bash
curl -X POST http://localhost:8787/trigger \
  -H 'content-type: application/json' \
  -H 'x-trigger-token: change-me-trigger-secret' \
  --data '{"limit":1}'
```

## Deploy

Set secrets in Cloudflare:

```bash
bunx wrangler secret put CONTENT_AUTOMATION_TOKEN --config wrangler.jsonc
bunx wrangler secret put RSS_WORKER_TRIGGER_TOKEN --config wrangler.jsonc
```

Deploy:

```bash
bun run rss:deploy
```

The cron in `wrangler.jsonc` runs every 6 hours:

```jsonc
"triggers": { "crons": ["0 */6 * * *"] }
```

Manual production trigger:

```bash
curl -X POST https://kurtmorales-rss-blog-workflow.<your-subdomain>.workers.dev/trigger \
  -H "authorization: Bearer $RSS_WORKER_TRIGGER_TOKEN" \
  -H 'content-type: application/json' \
  --data '{"limit":3}'
```
