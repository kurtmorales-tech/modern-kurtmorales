export type RssSource = {
  name: string;
  url: string;
  topic: string;
};

export const DEFAULT_RSS_SOURCES: RssSource[] = [
  {
    name: 'Cloudflare Blog',
    url: 'https://blog.cloudflare.com/rss/',
    topic: 'Cloudflare, edge computing, Workers, security, AI infrastructure',
  },
  {
    name: 'AWS News Blog',
    url: 'https://aws.amazon.com/blogs/aws/feed/',
    topic: 'AWS launches, cloud architecture, developer infrastructure',
  },
  {
    name: 'OpenAI News',
    url: 'https://openai.com/news/rss.xml',
    topic: 'OpenAI, AI products, model releases, AI strategy',
  },
  {
    name: 'Google Blog',
    url: 'https://blog.google/rss/',
    topic: 'Google, AI, search, web platforms, developer tools',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    topic: 'consumer technology, platforms, software, AI industry news',
  },
];
