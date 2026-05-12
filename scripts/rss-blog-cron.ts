import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULT_RSS_SOURCES, type RssSource } from './rss-sources';

type FeedItem = {
  source: string;
  sourceUrl: string;
  topic: string;
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
};

type WebPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  status: 'published';
  tags: { tag: string }[];
  contentMarkdown: string;
};

type CmsGeneratedPost = WebPost & {
  generatedAt: string;
  sourceName: string;
  sourceFeedUrl: string;
  sourceTitle: string;
  sourceLink: string;
};

type CmsGeneratedStore = {
  updatedAt: string;
  posts: CmsGeneratedPost[];
};

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
const storeOut = path.join(rootDir, 'content/generated-rss-posts.json');
const webOut = path.join(rootDir, 'apps/web/src/data/generated-rss-posts.json');
const maxFeedBytes = 1_500_000;

const targetCount = clamp(Number(argValue('limit') ?? 1), 1, 10);
const keepCount = clamp(Number(argValue('keep') ?? 75), 1, 250);
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const store = await readStore();
  const seenLinks = new Set(store.posts.map((post) => normalizeLink(post.sourceLink)));
  const seenSlugs = new Set(store.posts.map((post) => post.slug));
  const candidates = dedupeByLink(await collectFeedItems(DEFAULT_RSS_SOURCES)).filter(
    (item) => !seenLinks.has(normalizeLink(item.link)),
  );
  const created: CmsGeneratedPost[] = [];

  for (const item of candidates) {
    if (created.length >= targetCount) break;

    const post = generatePost(item);
    if (seenSlugs.has(post.slug)) continue;

    created.push(post);
    seenSlugs.add(post.slug);
    seenLinks.add(normalizeLink(item.link));
  }

  if (created.length === 0) {
    console.log('No new relevant RSS items found.');
    return;
  }

  const nextPosts = [...created, ...store.posts].slice(0, keepCount);
  const nextStore: CmsGeneratedStore = { updatedAt: new Date().toISOString(), posts: nextPosts };
  const webPosts: WebPost[] = nextPosts.map(
    ({ generatedAt, sourceName, sourceFeedUrl, sourceTitle, sourceLink, ...post }) => post,
  );

  if (dryRun) {
    for (const post of created) console.log(`DRY: ${post.title} (${post.slug})`);
    return;
  }

  await mkdir(path.dirname(storeOut), { recursive: true });
  await mkdir(path.dirname(webOut), { recursive: true });
  await writeJson(storeOut, nextStore);
  await writeJson(webOut, webPosts);

  console.log(`Created ${created.length} RSS blog post(s):`);
  for (const post of created) console.log(`- ${post.title} -> /blog/${post.slug}`);
}

async function readStore(): Promise<CmsGeneratedStore> {
  try {
    const parsed = JSON.parse(await readFile(storeOut, 'utf8')) as Partial<CmsGeneratedStore>;
    return {
      updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return { updatedAt: new Date(0).toISOString(), posts: [] };
  }
}

async function writeJson(file: string, data: unknown) {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function collectFeedItems(sources: RssSource[]): Promise<FeedItem[]> {
  const results = await Promise.allSettled(sources.map(fetchFeedItems));
  return results
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .filter(isRelevantFeedItem);
}

async function fetchFeedItems(feed: RssSource): Promise<FeedItem[]> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        accept: 'application/rss+xml, application/atom+xml, text/xml, */*',
        'user-agent': 'KurtMoralesRSSCron/1.0',
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) throw new Error(`${response.status}`);

    const length = Number(response.headers.get('content-length') ?? '0');
    if (length > maxFeedBytes) throw new Error('feed too large');

    const xml = await response.text();
    return parseFeed(xml, feed).slice(0, 10);
  } catch (error) {
    console.log(`Feed skipped: ${feed.name} (${String((error as Error).message ?? error)})`);
    return [];
  }
}

function generatePost(item: FeedItem): CmsGeneratedPost {
  const seed = hash(`${item.link}|${item.title}`);
  const title = makeTitle(item.title, seed);
  const slug = `${makeSlug(title)}-${shortHash(item.link)}`.slice(0, 90).replace(/-+$/g, '');
  const summary = normalizeSummary(item.summary, item.title);
  const contentMarkdown = articleMarkdown(item, title, summary, seed);

  return {
    id: `rss-${shortHash(item.link)}`,
    slug,
    title,
    excerpt: makeExcerpt(summary, seed),
    date: postDate(item.publishedAt),
    readTime: estimateReadTime(contentMarkdown),
    status: 'published',
    tags: makeTags(item, seed),
    contentMarkdown,
    generatedAt: new Date().toISOString(),
    sourceName: item.source,
    sourceFeedUrl: item.sourceUrl,
    sourceTitle: item.title,
    sourceLink: item.link,
  };
}

function articleMarkdown(item: FeedItem, title: string, summary: string, seed: number): string {
  const audience = pickSeed(seed, [
    'small businesses',
    'founders',
    'developers',
    'creative teams',
    'operators',
  ]);
  const action = pickSeed(seed + 1, ['audit', 'prototype', 'simplify', 'measure', 'document']);
  const workflow = pickSeed(seed + 2, [
    'website',
    'CMS',
    'automation stack',
    'customer journey',
    'content workflow',
  ]);

  return `## Quick read\n\n${summary}\n\nThe useful part of this story is not just the headline. It is how ${audience} can turn the signal into a clearer, faster digital workflow. When technology shifts, the teams that benefit most are usually the ones that connect the update to one practical improvement.\n\n## What happened\n\n${item.title} is a reminder that modern websites, AI tools, cloud platforms, and customer expectations now move together. A product announcement can affect content strategy. A browser or platform update can affect performance. A new AI capability can change how teams publish, support customers, or analyze demand.\n\nThat makes RSS monitoring valuable for a business website. Instead of waiting for trends to become obvious, you can watch credible sources and turn the best signals into timely, useful content.\n\n## Why it matters\n\nFor ${audience}, speed matters. A relevant update can become a blog post, an internal checklist, a landing page improvement, or a small automation. The goal is not to chase every news cycle. The goal is to build a system that notices useful changes and turns them into action.\n\nThe same principle applies to a CMS. A good publishing workflow should keep source material, editorial notes, metadata, and the public website connected. When that pipeline is working, publishing becomes repeatable instead of chaotic.\n\n## Practical takeaway\n\nUse this update as a prompt to ${action} one part of your ${workflow}. Look for a place where visitors need clearer information, where staff repeat a manual step, or where a small content improvement could answer common customer questions.\n\nA focused response could include:\n\n- Turning a recurring customer question into an evergreen article\n- Refreshing an outdated service page with clearer positioning\n- Testing one AI-assisted workflow before changing the whole process\n- Checking Core Web Vitals and accessibility after any major content change\n- Keeping source attribution so readers can verify the original context\n\n## What to watch next\n\nThe risk is overreacting. Not every update needs a rebuild, subscription, or strategy change. The better filter is simple: does this improve speed, trust, clarity, cost, or revenue? If the answer is yes, turn it into a small test. If not, save it as background context.\n\n## Bottom line\n\nAutomated RSS-to-blog publishing works best when it adds judgment instead of noise. The pipeline should surface relevant stories, create original commentary, preserve attribution, and rebuild the site so readers see fresh content quickly.\n\n---\n\nSource: [${item.source} — ${escapeMarkdown(item.title)}](${item.link})`;
}

function parseFeed(xml: string, feed: RssSource): FeedItem[] {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const atomBlocks = blocks.length
    ? []
    : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);

  return (blocks.length ? blocks : atomBlocks)
    .map((block) => ({
      source: feed.name,
      sourceUrl: feed.url,
      topic: feed.topic,
      title: cleanXmlText(readTag(block, 'title')),
      link: cleanXmlText(readTag(block, 'link') || readAtomLink(block)),
      publishedAt: cleanXmlText(
        readTag(block, 'pubDate') || readTag(block, 'published') || readTag(block, 'updated'),
      ),
      summary: cleanXmlText(
        readTag(block, 'description') ||
          readTag(block, 'summary') ||
          readTag(block, 'content:encoded'),
      ),
    }))
    .filter((item) => item.title && item.link);
}

function isRelevantFeedItem(item: FeedItem): boolean {
  const text = `${item.title} ${item.summary} ${item.topic}`.toLowerCase();
  const blocked = [
    'coupon',
    'deal',
    'discount',
    'gift guide',
    'celebrity',
    'sports',
    'movie trailer',
  ];
  if (blocked.some((term) => text.includes(term))) return false;

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
    'startup',
    'business',
    'infrastructure',
    'performance',
    'accessibility',
  ];
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
  const cleaned = sourceTitle
    .replace(/\s+/g, ' ')
    .replace(/[|].*$/, '')
    .trim();
  const base = cleaned.length > 62 ? `${cleaned.slice(0, 59).replace(/\s+\S*$/, '')}...` : cleaned;
  const title = /^(what|why|how|when|where)\b/i.test(base)
    ? base
    : `${pickSeed(seed, ['What', 'Why', 'How', 'A Practical Look at'])} ${base}`;
  return title.length <= 82 ? title : title.slice(0, 82).replace(/\s+\S*$/, '');
}

function makeExcerpt(summary: string, seed: number): string {
  const angle = pickSeed(seed, [
    'website strategy',
    'AI automation',
    'modern publishing',
    'small-business execution',
  ]);
  return `${summary.slice(0, 150).replace(/\s+\S*$/, '')}. A practical take on ${angle}.`.replace(
    '..',
    '.',
  );
}

function makeTags(item: FeedItem, seed: number): { tag: string }[] {
  const base = [
    item.source.replace(/\s+(Blog|Newsroom)$/i, ''),
    ...item.topic.split(',').map((tag) => tag.trim()),
  ];
  const extras = ['AI', 'Web Design', 'Automation', 'Business', 'Cloud', 'SEO'];
  return [...new Set([...shuffle(base, seed), ...shuffle(extras, seed + 3)])]
    .filter(Boolean)
    .slice(0, 5)
    .map((tag) => ({ tag: titleCase(tag).slice(0, 28) }));
}

function normalizeSummary(summary: string, fallback: string): string {
  const cleaned = cleanXmlText(summary).replace(/\s+/g, ' ').trim();
  if (cleaned.length > 80)
    return `${cleaned
      .slice(0, 320)
      .replace(/\s+\S*$/, '')
      .trim()}.`;
  return `${fallback} is a useful signal for teams watching web strategy, AI adoption, automation, and customer experience.`;
}

function postDate(value: string): string {
  const parsed = value ? new Date(value) : new Date(Number.NaN);
  return (Number.isNaN(parsed.getTime()) ? new Date() : parsed).toISOString();
}

function readTag(block: string, tagName: string): string {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(
    new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'),
  );
  return match?.[1] ?? '';
}

function readAtomLink(block: string): string {
  return block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
}

function cleanXmlText(value: string): string {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)));
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
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
  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
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
  return value.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

function escapeMarkdown(value: string): string {
  return value.replace(/([[\]])/g, '\\$1');
}

function argValue(name: string): string | undefined {
  return process.argv
    .find((arg) => arg.startsWith(`--${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
