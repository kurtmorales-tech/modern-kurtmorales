import { getPayload } from 'payload'

import config from '../src/payload.config'
import { DEFAULT_RSS_SOURCES, type RssSource } from '../src/automation/rssSources'

type FeedItem = {
  source: string
  sourceUrl: string
  topic: string
  title: string
  link: string
  publishedAt: string
  summary: string
}

type GeneratedPost = {
  title: string
  slug: string
  excerpt: string
  date: string
  readTime: string
  tags: { tag: string }[]
  status: 'published' | 'draft'
  contentMarkdown: string
}

const EXTRA_RSS_SOURCES: RssSource[] = [
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', topic: 'startups, software engineering, AI, product trends' },
  { name: 'TechCrunch', url: 'https://feeds.feedburner.com/TechCrunch/', topic: 'startups, venture funding, AI products, platform shifts' },
  { name: 'NVIDIA Blog', url: 'https://www.nvidia.com/en-us/about-nvidia/blog/feed/', topic: 'accelerated computing, GPUs, AI infrastructure' },
  { name: 'Microsoft Blog', url: 'https://blogs.microsoft.com/feed/', topic: 'AI, productivity, cloud platforms, enterprise software' },
  { name: 'Apple Newsroom', url: 'https://www.apple.com/newsroom/rss-feed.rss', topic: 'Apple products, privacy, mobile platforms, creative tools' },
  { name: 'Meta Newsroom', url: 'https://about.fb.com/news/feed/', topic: 'social platforms, AI, mixed reality, open source models' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss.xml', topic: 'AI safety, Claude, model releases, enterprise AI' },
  { name: 'Chrome Developers', url: 'https://developer.chrome.com/static/blog/feed.xml', topic: 'web platform APIs, browser performance, frontend development' },
  { name: 'web.dev', url: 'https://web.dev/feed.xml', topic: 'web performance, accessibility, frontend best practices' },
  { name: 'GitHub Blog', url: 'https://github.blog/feed/', topic: 'developer tooling, DevOps, open source, AI coding' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', topic: 'web design, frontend UX, CSS, accessibility' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', topic: 'CSS, frontend design systems, developer workflow' },
  { name: 'Mozilla Blog', url: 'https://blog.mozilla.org/en/feed/', topic: 'open web, privacy, browsers, web standards' },
  { name: 'Shopify Engineering', url: 'https://shopify.engineering/rss', topic: 'commerce engineering, web performance, infrastructure' },
  { name: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/feed', topic: 'software architecture, data engineering, platform reliability' },
  { name: 'Meta Engineering', url: 'https://engineering.fb.com/feed/', topic: 'software engineering, AI systems, infrastructure' },
  { name: 'Spotify Engineering', url: 'https://engineering.atspotify.com/feed/', topic: 'engineering culture, backend systems, data platforms' },
  { name: 'Tailscale Blog', url: 'https://tailscale.com/blog/index.xml', topic: 'networking, security, developer infrastructure' },
  { name: 'Deno Blog', url: 'https://deno.com/feed', topic: 'JavaScript runtimes, TypeScript, edge development' },
  { name: 'InfoQ', url: 'https://feed.infoq.com/', topic: 'software architecture, DevOps, AI, engineering leadership' },
]

const ALL_SOURCES = [...DEFAULT_RSS_SOURCES, ...EXTRA_RSS_SOURCES]
const MAX_FEED_BYTES = 1_500_000

const angles = [
  'what small businesses should do next',
  'the practical developer takeaway',
  'why founders should pay attention',
  'how this changes modern websites',
  'the automation opportunity hiding inside the news',
  'what it means for customer experience',
  'how lean teams can turn it into an advantage',
]

const visualStyles = [
  'cinematic editorial tech illustration, bold lighting, clean negative space',
  'futuristic dashboard scene, glassmorphism, deep navy and electric blue',
  'modern startup workspace, warm contrast, premium magazine cover style',
  'abstract AI network, neon gradients, high detail, professional web design',
  'minimal geometric cloud architecture, crisp vector depth, dramatic shadows',
  'small business owner using AI tools, modern website visuals, optimistic mood',
  'developer console and product interface, sharp composition, vibrant accent colors',
]

function argValue(name: string): string | undefined {
  return process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
}

const targetCount = clamp(Number(argValue('limit') ?? 100), 1, 500)
const status = (argValue('status') === 'draft' ? 'draft' : 'published') as 'published' | 'draft'
const dryRun = process.argv.includes('--dry-run')
const includeImages = !process.argv.includes('--no-images')

async function main() {
  console.log(`RSS batch: target=${targetCount} status=${status} images=${includeImages ? 'pollinations-flux-url' : 'off'} dryRun=${dryRun}`)

  const items = await collectFeedItems(ALL_SOURCES)
  const selected = dedupeByLink(items).slice(0, Math.max(targetCount * 2, targetCount))
  console.log(`Fetched ${items.length} items, ${selected.length} unique candidates`)

  if (selected.length < targetCount) {
    console.log(`Warning: only ${selected.length} RSS candidates available; will create at most that many posts`)
  }

  const payload = dryRun ? null : await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const [index, item] of selected.entries()) {
    if (created >= targetCount) break

    const post = generatePost(item, index, status, includeImages)
    const existing = payload
      ? await payload.find({ collection: 'posts', limit: 1, where: { slug: { equals: post.slug } } })
      : { totalDocs: 0 }

    if (existing.totalDocs > 0) {
      skipped += 1
      continue
    }

    if (dryRun) {
      console.log(`DRY ${created + 1}. ${post.title} (${post.slug})`)
    } else {
      await payload!.create({ collection: 'posts', data: post })
      if ((created + 1) % 10 === 0 || created === 0) console.log(`Created ${created + 1}: ${post.title}`)
    }

    created += 1
  }

  console.log(`Done. created=${created} skipped=${skipped}`)
  process.exit(0)
}

async function collectFeedItems(sources: RssSource[]): Promise<FeedItem[]> {
  const shuffledSources = shuffle([...sources], 20260505)
  const results = await Promise.allSettled(shuffledSources.map(fetchFeedItems))
  return shuffle(
    results.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])).filter(isRelevantFeedItem),
    Date.now(),
  )
}

async function fetchFeedItems(feed: RssSource): Promise<FeedItem[]> {
  try {
    const response = await fetch(feed.url, {
      headers: { accept: 'application/rss+xml, application/atom+xml, text/xml, */*', 'user-agent': 'KurtMoralesRSSBatch/1.0' },
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) throw new Error(`${response.status}`)

    const length = Number(response.headers.get('content-length') ?? '0')
    if (length > MAX_FEED_BYTES) throw new Error('feed too large')

    const xml = await response.text()
    return parseFeed(xml, feed).slice(0, 25)
  } catch (error) {
    console.log(`Feed skipped: ${feed.name} (${String((error as Error).message ?? error)})`)
    return []
  }
}

function generatePost(item: FeedItem, index: number, status: 'published' | 'draft', includeImage: boolean): GeneratedPost {
  const seed = hash(`${item.link}|${index}`)
  const pick = <T>(values: T[], offset = 0) => values[(seed + offset) % values.length]
  const angle = pick(angles)
  const title = makeTitle(item.title, angle, seed)
  const slug = uniqueSlug(`${makeSlug(title)}-${shortHash(item.link)}`)
  const topic = item.topic || 'technology and business news'
  const summary = normalizeSummary(item.summary, item.title)
  const imagePrompt = `${title}, ${topic}, ${pick(visualStyles, 3)}, no text, no logos, 16:9 hero image`
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=630&model=flux&nologo=true&private=true&seed=${seed}`
  const imageBlock = includeImage
    ? `<figure>\n  <img src="${imageUrl}" alt="AI-generated hero image for ${escapeHtml(title)}" loading="lazy" decoding="async" />\n  <figcaption>AI-generated concept image based on the article topic.</figcaption>\n</figure>\n\n`
    : ''
  const body = `${imageBlock}${articleMarkdown(item, title, summary, angle, topic, seed)}`

  return {
    title,
    slug,
    excerpt: makeExcerpt(item, angle),
    date: postDate(item.publishedAt, index),
    readTime: estimateReadTime(body),
    tags: makeTags(item, topic, seed),
    status,
    contentMarkdown: body,
  }
}

function articleMarkdown(item: FeedItem, title: string, summary: string, angle: string, topic: string, seed: number): string {
  const audience = pickSeed(seed, ['small business owners', 'founders', 'freelancers', 'developers', 'marketing teams', 'operators'])
  const action = pickSeed(seed + 1, ['audit', 'prototype', 'document', 'test', 'simplify', 'measure'])
  const channel = pickSeed(seed + 2, ['website', 'customer journey', 'content workflow', 'automation stack', 'analytics setup', 'sales funnel'])

  return `## Quick read\n\n${summary}\n\nThe bigger story is not only the headline from ${item.source}. It is how teams can translate this update into better decisions about ${topic}. For ${audience}, the useful question is simple: what changes, what stays the same, and where is the opportunity?\n\n## What happened\n\n${item.title} points to a continuing shift in how digital tools are being built, packaged, and adopted. The signal is important because modern web projects no longer live in one lane. Search, AI, performance, privacy, and customer experience now overlap in almost every product decision.\n\nRather than treating this as isolated news, it helps to read it as a planning input. A stronger website or automation system is built from many small choices: what content gets published, how fast pages load, which tools reduce manual work, and how clearly a visitor can move from interest to action.\n\n## Why it matters\n\nFor small businesses, the practical impact is speed. When the market shifts, the teams that win are usually the ones that can update their message, test a new offer, and improve the user experience without waiting weeks for a full rebuild.\n\nFor developers and technical founders, the lesson is flexibility. Tools change quickly, but durable systems still depend on clean architecture, clear content models, secure integrations, and measurable outcomes. If a new platform feature saves time, it should also make the customer experience easier to understand.\n\n## The opportunity for ${audience}\n\nThe strongest move is to connect the news to a specific workflow. Use this as a reason to ${action} your ${channel}. Look for places where customers pause, where staff repeat the same task, or where content takes too long to publish. Those friction points are usually where new technology creates the fastest return.\n\nA practical response could include:\n\n- Reviewing the pages that receive the most traffic and refreshing outdated messaging\n- Turning repeated customer questions into helpful FAQ or blog content\n- Testing one automation before redesigning an entire process\n- Checking whether analytics can prove that the change improved conversions\n- Keeping a clear source of truth in the CMS so content stays maintainable\n\n## What to watch next\n\nThe risk is chasing novelty. Not every announcement deserves a rebuild, a new subscription, or a major strategy change. The better approach is to separate signal from noise. Ask whether the update improves speed, trust, clarity, cost, or revenue. If it does not affect one of those outcomes, it may be interesting but not urgent.\n\nTeams should also watch for second-order effects. A change in AI tooling can affect content production. A browser update can affect performance and accessibility. A cloud platform release can change deployment costs. A consumer product trend can reset customer expectations for convenience.\n\n## Practical takeaway\n\nUse this story as a prompt to make one useful improvement this week. Pick a workflow, define the outcome, and ship a small test. The goal is not to react to every news cycle. The goal is to build a business and web presence that can adapt without becoming chaotic.\n\nIf you want help turning technology updates into practical website, CMS, or automation improvements, start with a focused audit and a short action plan.\n\n---\n\nSource: [${item.source} — ${escapeMarkdown(item.title)}](${item.link})`
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

function isRelevantFeedItem(item: FeedItem): boolean {
  const text = `${item.title} ${item.summary} ${item.topic}`.toLowerCase()
  const blocked = [
    'promo code',
    'coupon',
    'deal',
    'discount',
    'gift guide',
    'gift to buy',
    'arcade adds',
    'formula 1',
    'celebrity',
    'dubbing',
    'food gifts',
    'mattress',
    'litter-robot',
    'portable power station',
    'court appearance',
  ]
  if (blocked.some((term) => text.includes(term))) return false

  const required = [
    'ai',
    'web',
    'cloud',
    'developer',
    'software',
    'security',
    'data',
    'automation',
    'search',
    'browser',
    'css',
    'javascript',
    'typescript',
    'startup',
    'business',
    'infrastructure',
    'performance',
    'accessibility',
    'commerce',
    'privacy',
  ]
  return required.some((term) => text.includes(term))
}

function makeTitle(sourceTitle: string, angle: string, seed: number): string {
  const cleaned = sourceTitle.replace(/\s+/g, ' ').replace(/[|].*$/, '').trim()
  const prefixes = ['What', 'How', 'Why', 'A Practical Look at', 'The Business Takeaway From']
  const prefix = pickSeed(seed, prefixes)
  const base = cleaned.length > 58 ? `${cleaned.slice(0, 55).replace(/\s+\S*$/, '')}...` : cleaned
  const title = `${prefix} ${base}`.replace(/^What What\b/i, 'What').replace(/^How How\b/i, 'How').replace(/^Why Why\b/i, 'Why')
  if (title.length <= 78) return title
  return `${base}: ${angle.split(' ').slice(0, 5).join(' ')}`.slice(0, 82).replace(/\s+\S*$/, '')
}

function makeExcerpt(item: FeedItem, angle: string): string {
  const summary = normalizeSummary(item.summary, item.title)
  return `${summary.slice(0, 150).replace(/\s+\S*$/, '')}. A practical take on ${angle}.`.replace('..', '.')
}

function normalizeSummary(summary: string, fallback: string): string {
  const cleaned = cleanXmlText(summary).replace(/\s+/g, ' ').trim()
  if (cleaned.length > 80) return cleaned.slice(0, 320).replace(/\s+\S*$/, '').trim() + '.'
  return `${fallback} is a useful signal for teams watching technology, web strategy, AI adoption, and customer experience.`
}

function makeTags(item: FeedItem, topic: string, seed: number): { tag: string }[] {
  const base = [item.source.replace(/\s+(Blog|Newsroom)$/i, ''), ...topic.split(',').map((tag) => tag.trim())]
  const extras = ['AI', 'Web Design', 'Automation', 'Business', 'Cloud', 'UX', 'SEO', 'DevTools']
  return [...new Set([...shuffle(base, seed), ...shuffle(extras, seed + 9)])]
    .filter(Boolean)
    .slice(0, 5)
    .map((tag) => ({ tag: titleCase(tag).slice(0, 28) }))
}

function postDate(value: string, index: number): string {
  const parsed = value ? new Date(value) : new Date(Number.NaN)
  const date = Number.isNaN(parsed.getTime()) ? new Date(Date.now() - index * 60 * 60 * 1000) : parsed
  return date.toISOString()
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

function dedupeByLink(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const normalizedLink = item.link.replace(/[?#].*$/, '')
    const key = `${normalizedLink}|${item.title.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '')
}

function uniqueSlug(slug: string): string {
  return slug.replace(/-+/g, '-').slice(0, 90).replace(/-+$/g, '')
}

function estimateReadTime(markdown: string): string {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return `${Math.max(2, Math.ceil(words / 220))} min read`
}

function shuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  let state = seed || 1
  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const j = state % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickSeed<T>(seed: number, values: T[]): T {
  return values[Math.abs(seed) % values.length]
}

function hash(input: string): number {
  let value = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function shortHash(input: string): string {
  return hash(input).toString(36).slice(0, 6)
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.floor(value)))
}

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeMarkdown(value: string): string {
  return value.replace(/([\[\]])/g, '\\$1')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
