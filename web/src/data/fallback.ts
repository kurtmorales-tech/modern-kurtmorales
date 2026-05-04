import type { PayloadPost, PayloadProject } from '../lib/payload';

export const fallbackPosts: PayloadPost[] = [
  {
    id: 'f1', slug: 'building-ai-powered-websites-2026',
    title: 'Building AI-Powered Websites in 2026',
    excerpt: "How I'm integrating Google Gemini and other AI tools into modern React apps — practical lessons from real client projects.",
    date: '2026-05-01', readTime: '5 min read', status: 'published',
    tags: [{ tag: 'AI' }, { tag: 'React' }, { tag: 'Cloudflare' }],
    contentMarkdown: `## Why AI-First Development Matters Now\n\nEvery website I build today has some form of AI baked in. Not as a gimmick — but as a genuine upgrade to the user experience.\n\nFor **Braids by Jaira**, I built an AI styling assistant using Google's Gemini API. Instead of scrolling through a static gallery, clients can describe their ideal look and get personalized recommendations instantly.\n\n## The Stack I Use\n\nFor AI-powered React apps in 2026, my go-to stack is:\n\n- **React + Vite + TypeScript** — fast dev experience, strong types\n- **Tailwind CSS** — utility-first, no CSS bloat\n- **Google Gemini API** — best multimodal model for web integrations\n- **Cloudflare Workers + Pages** — edge deployment, zero cold starts\n\n## Lessons Learned\n\n1. **Prompt engineering matters more than model choice** — a well-crafted prompt on Gemini Flash beats a lazy prompt on Opus.\n2. **Stream the response** — users expect real-time output.\n3. **Handle failures gracefully** — AI APIs have rate limits. Always have a fallback.\n\nIf you're building web projects and not using AI tooling yet, 2026 is the year to start.`,
  },
  {
    id: 'f2', slug: 'cloudflare-workers-for-freelancers',
    title: 'Why I Deploy Everything to Cloudflare Workers',
    excerpt: "Serverless edge computing changed how I deliver client projects. Here's my full workflow from dev to production.",
    date: '2026-04-20', readTime: '4 min read', status: 'published',
    tags: [{ tag: 'Cloudflare' }, { tag: 'Serverless' }, { tag: 'DevOps' }],
    contentMarkdown: `## The Problem with Traditional Hosting\n\nWhen I started freelancing, I was deploying client sites to shared hosting or cheap VPS instances. The problems were predictable: slow cold starts, manual SSL renewals, and painful deployment pipelines.\n\nCloudflare Workers changed everything.\n\n## My Current Deployment Flow\n\n\`\`\`bash\nnpm run build\nnpx wrangler deploy\n\`\`\`\n\nThat's it. Two commands and the site is live globally on Cloudflare's edge network — 300+ locations.\n\n## The Economics Make Sense\n\nThe free tier covers 100,000 requests/day. For most small business clients, they never leave the free tier.\n\n## Verdict\n\nIf you're a freelancer deploying React + TypeScript sites, Cloudflare Workers is the best DX/cost combo available today.`,
  },
  {
    id: 'f3', slug: 'freelancing-web-dev-las-vegas',
    title: "Freelancing as a Web Dev in 2026 — What's Actually Working",
    excerpt: 'Honest take on landing clients, pricing projects, and building a sustainable solo dev business from Las Vegas.',
    date: '2026-04-10', readTime: '6 min read', status: 'published',
    tags: [{ tag: 'Freelancing' }, { tag: 'Business' }, { tag: 'Career' }],
    contentMarkdown: `## How I Started\n\nI started KM Web Design in late 2025 after years of side projects and open-source work. The transition from "developer who builds things" to "freelancer who gets paid" required a different mindset.\n\nThe tech was never the hard part.\n\n## What Actually Lands Clients\n\n**Portfolio > Resume.** Every client I've signed came through seeing something I built, not reading my CV.\n\n**Niche, then broaden.** My first clients were small local businesses — a hair salon, a pool league directory.\n\n**Pricing by value, not hours.** Charging hourly creates incentives to work slowly.\n\n## Looking Ahead\n\nI'm building toward productized services: fixed-price packages for common deliverables.\n\nIf you're thinking about freelancing, just start. Ship something. The rest follows.`,
  },
];

export const fallbackProjects: PayloadProject[] = [
  { id: 'p1', title: 'Braids by Jaira', type: 'Client Concept', tech: 'React / Vite', description: 'Boutique hair styling site with booking flow, gallery, and AI-powered consult.', link: 'https://github.com/Kacmnetworkk/Braids-by-jairah', order: 1 },
  { id: 'p2', title: 'RavFia Platform', type: 'Platform', tech: 'Cloudflare', description: 'Open-source platform focused on AI tooling and serverless deployment.', link: 'https://github.com/Kacmnetworkk/ravfia', order: 2 },
  { id: 'p3', title: 'QuickCart', type: 'Ecommerce', tech: 'Next / Tailwind', description: 'Minimal e-commerce starter template made for fast online store launches.', link: 'https://github.com/Kacmnetworkk/QuickCart', order: 3 },
  { id: 'p4', title: 'Cuepal Directory', type: 'Directory', tech: 'TypeScript', description: 'A pool league finder concept connecting players with local game communities.', link: 'https://github.com/Kacmnetworkk/Cuepal-Directory', order: 4 },
  { id: 'p5', title: 'RavFia SecurePass', type: 'Tooling', tech: 'API Concept', description: 'Cryptographic password generation and privacy-first tooling direction.', link: 'https://github.com/Kacmnetworkk', order: 5 },
  { id: 'p6', title: 'KurtMorales Design', type: 'Studio', tech: 'Web Design', description: 'Brand focused on modern, fast, SEO-conscious websites for local companies.', link: 'https://kurtmorales.com', order: 6 },
];
