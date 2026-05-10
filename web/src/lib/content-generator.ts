export interface ContentGenerateRequest {
  source?: string;
  limit?: number;
}

export interface GeneratedContentDraft {
  sourceId: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'draft';
  coverUrl: string;
  coverAlt: string;
  sourceName: string;
  sourceFeedUrl: string;
  sourceLink: string;
}

interface RssSource {
  name: string;
  url: string;
  topic: string;
}

interface FeedItem {
  source: string;
  sourceUrl: string;
  topic: string;
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
}

const DEFAULT_RSS_SOURCES: RssSource[] = [
  { name: 'Cloudflare Blog', url: 'https://blog.cloudflare.com/rss/', topic: 'Cloudflare, edge computing, Workers, security, AI infrastructure' },
  { name: 'AWS News Blog', url: 'https://aws.amazon.com/blogs/aws/feed/', topic: 'AWS launches, cloud architecture, developer infrastructure' },
  { name: 'OpenAI News', url: 'https://openai.com/news/rss.xml', topic: 'OpenAI, AI products, model releases, AI strategy' },
  { name: 'Google Blog', url: 'https://blog.google/rss/', topic: 'Google, AI, search, web platforms, developer tools' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', topic: 'consumer technology, platforms, software, AI industry news' },
];

const maxFeedBytes = 1_500_000;

export async function generateContentDrafts(options: {
  source?: string;
  limit?: number;
  existingSourceIds?: Iterable<string>;
  existingSlugs?: Iterable<string>;
}): Promise<{ drafts: GeneratedContentDraft[]; warnings: string[]; usedSources: string[] }> {
  const limit = clamp(options.limit ?? 1, 1, 10);
  const selectedSources = selectSources(options.source);

  if (selectedSources.length === 0) {
    return {
      drafts: [],
      warnings: options.source ? [`No RSS source matched "${options.source}".`] : ['No RSS sources configured.'],
      usedSources: [],
    };
  }

  const { items, warnings } = await collectFeedItems(selectedSources);
  const seenSourceIds = new Set(options.existingSourceIds ?? []);
  const seenSlugs = new Set(options.existingSlugs ?? []);
  const drafts: GeneratedContentDraft[] = [];

  for (const item of dedupeByLink(items)) {
    if (drafts.length >= limit) break;

    const draft = generateDraft(item);
    if (seenSourceIds.has(draft.sourceId) || seenSlugs.has(draft.slug)) continue;

    drafts.push(draft);
    seenSourceIds.add(draft.sourceId);
    seenSlugs.add(draft.slug);
  }

  return { drafts, warnings, usedSources: selectedSources.map((source) => source.name) };
}

function selectSources(source: string | undefined): RssSource[] {
  const query = source?.trim().toLowerCase();
  if (!query || query === 'all') return DEFAULT_RSS_SOURCES;

  return DEFAULT_RSS_SOURCES.filter((entry) => {
    const haystack = `${entry.name} ${entry.topic} ${entry.url}`.toLowerCase();
    return haystack.includes(query);
  });
}

async function collectFeedItems(sources: RssSource[]): Promise<{ items: FeedItem[]; warnings: string[] }> {
  const results = await Promise.allSettled(sources.map(fetchFeedItems));
  const items: FeedItem[] = [];
  const warnings: string[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
      continue;
    }

    warnings.push(String(result.reason));
  }

  return { items: items.filter(isRelevantFeedItem), warnings };
}

async function fetchFeedItems(feed: RssSource): Promise<FeedItem[]> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        accept: 'application/rss+xml, application/atom+xml, text/xml, */*',
        'user-agent': 'KurtMoralesContentWorker/1.0',
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) throw new Error(`${feed.name} returned ${response.status}`);

    const length = Number(response.headers.get('content-length') ?? '0');
    if (length > maxFeedBytes) throw new Error(`${feed.name} feed too large`);

    const xml = await response.text();
    return parseFeed(xml, feed).slice(0, 10);
  } catch (error) {
    throw new Error(`Feed skipped: ${feed.name} (${String((error as Error).message ?? error)})`);
  }
}

function generateDraft(item: FeedItem): GeneratedContentDraft {
  const seed = hash(`${item.link}|${item.title}`);
  const title = makeTitle(item.title, seed);
  const slug = `${makeSlug(title)}-${shortHash(item.link)}`.slice(0, 90).replace(/-+$/g, '');
  const summary = normalizeSummary(item.summary, item.title);
  const contentMarkdown = articleMarkdown(item, summary, seed);

  return {
    sourceId: `rss:${shortHash(item.link)}`,
    slug,
    title,
    excerpt: makeExcerpt(summary, seed),
    date: postDate(item.publishedAt),
    readTime: estimateReadTime(contentMarkdown),
    tags: makeTags(item, seed),
    contentMarkdown,
    status: 'draft',
    coverUrl: '',
    coverAlt: '',
    sourceName: item.source,
    sourceFeedUrl: item.sourceUrl,
    sourceLink: item.link,
  };
}

function articleMarkdown(item: FeedItem, summary: string, seed: number): string {
  const audience = pickSeed(seed, ['small businesses', 'founders', 'developers', 'creative teams', 'operators']);
  const action = pickSeed(seed + 1, ['audit', 'prototype', 'simplify', 'measure', 'document']);
  const workflow = pickSeed(seed + 2, ['website', 'CMS', 'automation stack', 'customer journey', 'content workflow']);

  return `## Quick read\n\n${summary}\n\nThe useful part of this story is not just the headline. It is how ${audience} can turn the signal into a clearer, faster digital workflow. When technology shifts, the teams that benefit most are usually the ones that connect the update to one practical improvement.\n\n## What happened\n\n${item.title} is a reminder that modern websites, AI tools, cloud platforms, and customer expectations now move together. A product announcement can affect content strategy. A browser or platform update can affect performance. A new AI capability can change how teams publish, support customers, or analyze demand.\n\nThat makes RSS monitoring valuable for a business website. Instead of waiting for trends to become obvious, you can watch credible sources and turn the best signals into timely, useful content.\n\n## Why it matters\n\nFor ${audience}, speed matters. A relevant update can become a blog post, an internal checklist, a landing page improvement, or a small automation. The goal is not to chase every news cycle. The goal is to build a system that notices useful changes and turns them into action.\n\nThe same principle applies to a CMS. A good publishing workflow should keep source material, editorial notes, metadata, and the public website connected. When that pipeline is working, publishing becomes repeatable instead of chaotic.\n\n## Practical takeaway\n\nUse this update as a prompt to ${action} one part of your ${workflow}. Look for a place where visitors need clearer information, where staff repeat a manual step, or where a small content improvement could answer common customer questions.\n\nA focused response could include:\n\n- Turning a recurring customer question into an evergreen article\n- Refreshing an outdated service page with clearer positioning\n- Testing one AI-assisted workflow before changing the whole process\n- Checking Core Web Vitals and accessibility after any major content change\n- Keeping source attribution so research stays traceable\n\n## Source\n\n- Original source: [${escapeMarkdown(item.title)}](${item.link})\n- Feed: ${item.source}\n`;
}

function parseFeed(xml: string, feed: RssSource): FeedItem[] {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const atomBlocks = blocks.length ? [] : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);

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
    .filter((item) => item.title && item.link);
}

function isRelevantFeedItem(item: FeedItem): boolean {
  const text = `${item.title} ${item.summary} ${item.topic}`.toLowerCase();
  const blocked = ['coupon', 'deal', 'discount', 'gift guide', 'celebrity', 'sports', 'movie trailer'];
  if (blocked.some((term) => text.includes(term))) return false;

  const required = ['ai', 'web', 'cloud', 'developer', 'software', 'security', 'data', 'automation', 'search', 'browser', 'startup', 'business', 'infrastructure', 'performance', 'accessibility'];
  return required.some((term) => text.includes(term));
}

function dedupeByLink(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = normalizeLink(item.link);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function makeTitle(sourceTitle: string, seed: number): string {
  const cleaned = sourceTitle.replace(/\s+/g, ' ').replace(/[|].*$/, '').trim();
  const base = cleaned.length > 62 ? `${cleaned.slice(0, 59).replace(/\s+\S*$/, '')}...` : cleaned;
  const title = /^(what|why|how|when|where)\b/i.test(base)
    ? base
    : `${pickSeed(seed, ['What', 'Why', 'How', 'A Practical Look at'])} ${base}`;
  return title.length <= 82 ? title : title.slice(0, 82).replace(/\s+\S*$/, '');
}

function makeExcerpt(summary: string, seed: number): string {
  const angle = pickSeed(seed, ['website strategy', 'AI automation', 'modern publishing', 'small-business execution']);
  return `${summary.slice(0, 150).replace(/\s+\S*$/, '')}. A practical take on ${angle}.`.replace('..', '.');
}

function makeTags(item: FeedItem, seed: number): string[] {
  const base = [item.source.replace(/\s+(Blog|Newsroom)$/i, ''), ...item.topic.split(',').map((tag) => tag.trim())];
  const extras = ['AI', 'Web Design', 'Automation', 'Business', 'Cloud', 'SEO'];

  return [...new Set([...shuffle(base, seed), ...shuffle(extras, seed + 3)])]
    .filter(Boolean)
    .slice(0, 5)
    .map((tag) => titleCase(tag).slice(0, 28));
}

function normalizeSummary(summary: string, fallback: string): string {
  const cleaned = cleanXmlText(summary).replace(/\s+/g, ' ').trim();
  if (cleaned.length > 80) return `${cleaned.slice(0, 320).replace(/\s+\S*$/, '').trim()}.`;
  return `${fallback} is a useful signal for teams watching web strategy, AI adoption, automation, and customer experience.`;
}

function postDate(value: string): string {
  const parsed = value ? new Date(value) : new Date(Number.NaN);
  return (Number.isNaN(parsed.getTime()) ? new Date() : parsed).toISOString();
}

function readTag(block: string, tagName: string): string {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match?.[1] ?? '';
}

function readAtomLink(block: string): string {
  return block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
}

function cleanXmlText(value: string): string {
  return decodeEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)));
}

function makeSlug(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/g, '');
}

function estimateReadTime(markdown: string): string {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 220))} min read`;
}

function normalizeLink(link: string): string {
  return link.replace(/[?#].*$/, '').replace(/\/$/, '');
}

function shuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let state = seed || 1;

  for (let index = arr.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const next = state % (index + 1);
    [arr[index], arr[next]] = [arr[next], arr[index]];
  }

  return arr;
}

function pickSeed<T>(seed: number, values: T[]): T {
  return values[Math.abs(seed) % values.length];
}

function hash(input: string): number {
  let value = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }

  return value >>> 0;
}

function shortHash(input: string): string {
  return hash(input).toString(36).slice(0, 8);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function escapeMarkdown(value: string): string {
  return value.replace(/([\[\]])/g, '\\$1');
}
