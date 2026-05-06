import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from 'cloudflare:workers'
import { DEFAULT_RSS_SOURCES, type RssSource } from '../automation/rssSources'

type Env = {
  AI: Ai
  RSS_BLOG_WORKFLOW: Workflow<WorkflowParams>
  PAYLOAD_API_URL: string
  PUBLIC_SITE_URL?: string
  RSS_FEED_URLS?: string
  MAX_ITEMS_PER_RUN?: string
  MAX_ITEMS_PER_FEED?: string
  CONTENT_AUTOMATION_TOKEN?: string
  RSS_WORKER_TRIGGER_TOKEN?: string
}

type WorkflowParams = {
  source?: 'cron' | 'manual'
  feedUrls?: string[]
  limit?: number
}

type FeedItem = {
  source: string
  sourceUrl: string
  topic: string
  title: string
  link: string
  publishedAt: string
  summary: string
}

type BlogDraft = {
  title: string
  slug: string
  excerpt: string
  contentMarkdown: string
  tags: string[]
  readTime: string
}

type PublishResult = {
  sourceTitle: string
  slug: string
  status: 'published' | 'skipped' | 'failed'
  reason?: string
  postId?: string | number
}

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }
const MAX_FEED_BYTES = 1_000_000

export class RssBlogWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    const params = event.payload ?? {}

    const feeds = await step.do('resolve rss feeds', async () => resolveFeeds(this.env, params))
    const articles = await step.do(
      'fetch rss articles',
      { retries: { limit: 2, delay: '10 seconds', backoff: 'exponential' }, timeout: '2 minutes' },
      async () => fetchArticles(feeds, this.env, params),
    )

    const results: PublishResult[] = []

    for (const article of articles) {
      const slug = makeSlug(article.title)
      const exists = await step.do(`check existing ${slug}`, async () => postExists(this.env, slug))
      if (exists) {
        results.push({ sourceTitle: article.title, slug, status: 'skipped', reason: 'post already exists' })
        continue
      }

      const draft = await step.do(
        `draft ${slug}`,
        { retries: { limit: 2, delay: '15 seconds', backoff: 'exponential' }, timeout: '2 minutes' },
        async () => draftWithWorkersAI(this.env, article, slug),
      )

      const published = await step.do(
        `publish ${draft.slug}`,
        { retries: { limit: 2, delay: '10 seconds', backoff: 'exponential' }, timeout: '1 minute' },
        async () => publishPost(this.env, draft),
      )

      results.push({ sourceTitle: article.title, slug: draft.slug, status: 'published', postId: published.id })
    }

    return {
      source: params.source ?? 'manual',
      checkedFeeds: feeds.length,
      checkedArticles: articles.length,
      published: results.filter((result) => result.status === 'published').length,
      skipped: results.filter((result) => result.status === 'skipped').length,
      results,
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname === '/') {
      return Response.json({
        ok: true,
        service: 'kurtmorales-rss-blog-workflow',
        endpoints: {
          'POST /trigger': 'Start RSS → Workers AI → Payload publish workflow',
          'GET /status?id=<workflow-instance-id>': 'Read workflow status',
        },
      })
    }

    if (request.method === 'POST' && url.pathname === '/trigger') {
      if (!(await isAuthorized(request, env))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const payload = await safeJson<WorkflowParams>(request)
      const instance = await env.RSS_BLOG_WORKFLOW.create({
        id: `manual-${new Date().toISOString().replace(/[^0-9A-Za-z_-]/g, '-').slice(0, 32)}-${crypto.randomUUID().slice(0, 8)}`,
        params: { ...payload, source: 'manual' },
      })

      return Response.json({ id: instance.id, status: await instance.status() })
    }

    if (request.method === 'GET' && url.pathname === '/status') {
      if (!(await isAuthorized(request, env))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const id = url.searchParams.get('id')
      if (!id) return Response.json({ error: 'Missing id query parameter' }, { status: 400 })

      const instance = await env.RSS_BLOG_WORKFLOW.get(id)
      return Response.json({ id: instance.id, status: await instance.status() })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      env.RSS_BLOG_WORKFLOW.create({
        id: `cron-${controller.scheduledTime}`,
        params: { source: 'cron' },
        retention: { successRetention: '7 days', errorRetention: '14 days' },
      }),
    )
  },
}

function resolveFeeds(env: Env, params: WorkflowParams): RssSource[] {
  if (params.feedUrls?.length) {
    return params.feedUrls.map((url) => ({ name: hostname(url), url, topic: 'technology and business news' }))
  }

  if (env.RSS_FEED_URLS?.trim()) {
    return env.RSS_FEED_URLS.split(',')
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ name: hostname(url), url, topic: 'technology and business news' }))
  }

  return DEFAULT_RSS_SOURCES
}

async function fetchArticles(feeds: RssSource[], env: Env, params: WorkflowParams): Promise<FeedItem[]> {
  const maxItemsPerFeed = clampNumber(env.MAX_ITEMS_PER_FEED, 1, 5, 2)
  const maxItemsPerRun = clampNumber(String(params.limit ?? env.MAX_ITEMS_PER_RUN ?? ''), 1, 10, 3)
  const articles: FeedItem[] = []

  for (const feed of feeds) {
    const response = await fetch(feed.url, {
      headers: { accept: 'application/rss+xml, application/atom+xml, text/xml, */*', 'user-agent': 'KurtMoralesRSSWorkflow/1.0' },
    })

    if (!response.ok) throw new Error(`Failed to fetch ${feed.url}: ${response.status}`)

    const length = Number(response.headers.get('content-length') ?? '0')
    if (length > MAX_FEED_BYTES) throw new Error(`Feed too large: ${feed.url}`)

    const xml = await response.text()
    articles.push(...parseFeed(xml, feed).slice(0, maxItemsPerFeed))

    if (articles.length >= maxItemsPerRun) break
  }

  return articles.slice(0, maxItemsPerRun)
}

function parseFeed(xml: string, feed: RssSource): FeedItem[] {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0])
  const atomBlocks = blocks.length ? [] : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0])

  return (blocks.length ? blocks : atomBlocks)
    .map((block) => ({
      source: feed.name,
      sourceUrl: feed.url,
      topic: feed.topic,
      title: cleanXmlText(readTag(block, 'title')),
      link: cleanXmlText(readTag(block, 'link') || readAtomLink(block)),
      publishedAt: cleanXmlText(readTag(block, 'pubDate') || readTag(block, 'published') || readTag(block, 'updated')),
      summary: cleanXmlText(readTag(block, 'description') || readTag(block, 'summary') || readTag(block, 'content:encoded')),
    }))
    .filter((item) => item.title && item.link)
}

async function draftWithWorkersAI(env: Env, article: FeedItem, fallbackSlug: string): Promise<BlogDraft> {
  const prompt = `You are writing for kurtmorales.com, a practical web design and AI automation portfolio/blog. Transform the RSS item into an original, concise blog post. Do not copy the article. Add useful context for small businesses, developers, and founders. Return ONLY valid JSON with these keys: title, slug, excerpt, contentMarkdown, tags, readTime.

Rules:
- title: clear, under 70 chars
- slug: lowercase kebab-case
- excerpt: 1-2 sentences
- contentMarkdown: 500-900 words in Markdown, include a source attribution link at the end
- tags: 3-5 short tags
- readTime: like "4 min read"

RSS item:
Source: ${article.source}
Topic: ${article.topic}
Title: ${article.title}
Published: ${article.publishedAt || 'unknown'}
URL: ${article.link}
Summary: ${article.summary || 'No summary provided'}`

  const output = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You write original, useful technology blog posts and return strict JSON only.' },
      { role: 'user', content: prompt },
    ],
  })

  const text = typeof output === 'string' ? output : String((output as { response?: string }).response ?? JSON.stringify(output))
  const parsed = parseJsonObject<Partial<BlogDraft>>(text)
  const title = String(parsed.title || article.title).slice(0, 90)
  const slug = makeSlug(String(parsed.slug || fallbackSlug))
  const tags = Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 5) : ['AI', 'Technology', article.source]
  const contentMarkdown = String(parsed.contentMarkdown || fallbackMarkdown(article))

  return {
    title,
    slug,
    excerpt: String(parsed.excerpt || article.summary || `A quick take on ${article.title}`).slice(0, 280),
    contentMarkdown: ensureAttribution(contentMarkdown, article),
    tags,
    readTime: String(parsed.readTime || estimateReadTime(contentMarkdown)),
  }
}

async function postExists(env: Env, slug: string): Promise<boolean> {
  const apiUrl = payloadUrl(env, `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
  const response = await fetch(apiUrl, { headers: payloadHeaders(env) })
  if (!response.ok) throw new Error(`Payload lookup failed: ${response.status} ${await response.text()}`)
  const data = (await response.json()) as { totalDocs?: number; docs?: unknown[] }
  return Number(data.totalDocs ?? data.docs?.length ?? 0) > 0
}

async function publishPost(env: Env, draft: BlogDraft): Promise<{ id: string | number }> {
  const response = await fetch(payloadUrl(env, '/api/posts'), {
    method: 'POST',
    headers: payloadHeaders(env),
    body: JSON.stringify({
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      contentMarkdown: draft.contentMarkdown,
      date: new Date().toISOString(),
      readTime: draft.readTime,
      tags: draft.tags.map((tag) => ({ tag })),
      status: 'published',
    }),
  })

  if (!response.ok) throw new Error(`Payload publish failed: ${response.status} ${await response.text()}`)
  return (await response.json()) as { id: string | number }
}

function payloadHeaders(env: Env): HeadersInit {
  const headers: Record<string, string> = { ...JSON_HEADERS }
  if (env.CONTENT_AUTOMATION_TOKEN) headers['x-automation-token'] = env.CONTENT_AUTOMATION_TOKEN
  return headers
}

function payloadUrl(env: Env, path: string): string {
  const base = env.PAYLOAD_API_URL || 'http://localhost:3001'
  return `${base.replace(/\/$/, '')}${path}`
}

async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  if (!env.RSS_WORKER_TRIGGER_TOKEN) return true
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || request.headers.get('x-trigger-token') || ''
  return timingSafeEqual(supplied, env.RSS_WORKER_TRIGGER_TOKEN)
}

async function safeJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    return {} as T
  }
}

function readTag(block: string, tagName: string): string {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'))
  return match?.[1] ?? ''
}

function readAtomLink(block: string): string {
  return block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? ''
}

function cleanXmlText(value: string): string {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
}

function parseJsonObject<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error(`Workers AI did not return JSON: ${text.slice(0, 200)}`)
  return JSON.parse(cleaned.slice(start, end + 1)) as T
}

function ensureAttribution(markdown: string, article: FeedItem): string {
  if (markdown.includes(article.link)) return markdown
  return `${markdown.trim()}\n\n---\n\nSource: [${article.source} — ${article.title}](${article.link})`
}

function fallbackMarkdown(article: FeedItem): string {
  return `## What happened\n\n${article.summary || article.title}\n\n## Why it matters\n\nThis update is worth tracking because it can affect how teams plan websites, automations, cloud infrastructure, and AI-enabled workflows.\n\n## Practical takeaway\n\nWatch the underlying trend, test it on a small project, and document what changes for your customers or internal workflow.`
}

function estimateReadTime(markdown: string): string {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function clampNumber(value: string | undefined, min: number, max: number, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, Math.floor(parsed)))
}

function timingSafeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder()
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  if (leftBytes.length !== rightBytes.length) return false

  let diff = 0
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index]
  }
  return diff === 0
}
