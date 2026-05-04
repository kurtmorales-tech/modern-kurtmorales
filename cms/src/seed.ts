import { getPayload } from 'payload'
import config from './payload.config'

const posts = [
  {
    slug: 'building-ai-powered-websites-2026',
    title: 'Building AI-Powered Websites in 2026',
    excerpt: "How I'm integrating Google Gemini and other AI tools into modern React apps — practical lessons from real client projects.",
    date: '2026-05-01',
    readTime: '5 min read',
    tags: [{ tag: 'AI' }, { tag: 'React' }, { tag: 'Cloudflare' }],
    status: 'published' as const,
    contentMarkdown: `## Why AI-First Development Matters Now

Every website I build today has some form of AI baked in. Not as a gimmick — but as a genuine upgrade to the user experience.

For **Braids by Jaira**, I built an AI styling assistant using Google's Gemini API. Instead of scrolling through a static gallery, clients can describe their ideal look and get personalized recommendations instantly.

## The Stack I Use

For AI-powered React apps in 2026, my go-to stack is:

- **React + Vite + TypeScript** — fast dev experience, strong types
- **Tailwind CSS** — utility-first, no CSS bloat
- **Google Gemini API** — best multimodal model for web integrations
- **Cloudflare Workers + Pages** — edge deployment, zero cold starts

## Practical Integration Pattern

\`\`\`typescript
import { GoogleGenerativeAI } from "@google/genai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

async function askAI(prompt: string) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
\`\`\`

Keep it simple. Most AI integrations don't need a complex backend — a direct client call with a scoped API key is enough for most use cases.

## Lessons Learned

1. **Prompt engineering matters more than model choice** — a well-crafted prompt on Gemini Flash beats a lazy prompt on Opus.
2. **Stream the response** — users expect real-time output. Use \`generateContentStream\` for better UX.
3. **Handle failures gracefully** — AI APIs have rate limits. Always have a fallback.

## What's Next

I'm exploring AI-generated image assets for client sites and automated SEO meta generation. The tooling is getting good enough that these aren't experiments anymore — they're production features.

If you're building web projects and not using AI tooling yet, 2026 is the year to start.`,
  },
  {
    slug: 'cloudflare-workers-for-freelancers',
    title: 'Why I Deploy Everything to Cloudflare Workers',
    excerpt: "Serverless edge computing changed how I deliver client projects. Here's my full workflow from dev to production.",
    date: '2026-04-20',
    readTime: '4 min read',
    tags: [{ tag: 'Cloudflare' }, { tag: 'Serverless' }, { tag: 'DevOps' }],
    status: 'published' as const,
    contentMarkdown: `## The Problem with Traditional Hosting

When I started freelancing, I was deploying client sites to shared hosting or cheap VPS instances. The problems were predictable: slow cold starts, manual SSL renewals, and painful deployment pipelines.

Cloudflare Workers changed everything.

## My Current Deployment Flow

\`\`\`bash
# Build
npm run build

# Deploy to Cloudflare
npx wrangler deploy
\`\`\`

That's it. Two commands and the site is live globally on Cloudflare's edge network — 300+ locations.

## What I Deploy to Workers

- **Static sites + SPAs** — using Cloudflare Pages or Workers Assets
- **API endpoints** — lightweight Hono-based APIs
- **Edge middleware** — auth, rate limiting, geolocation redirects

## The Economics Make Sense

The free tier covers 100,000 requests/day. For most small business clients, they never leave the free tier. When they do scale, the pricing is competitive.

For freelancers, this means you can host client sites essentially for free until they're generating real traffic.

## Wrangler Tips

\`\`\`jsonc
// wrangler.jsonc
{
  "name": "my-client-site",
  "compatibility_date": "2026-04-01",
  "assets": {
    "not_found_handling": "single-page-application"
  }
}
\`\`\`

The \`single-page-application\` not_found_handling is essential for React Router apps — it serves index.html for all unknown paths.

## Verdict

If you're a freelancer deploying React + TypeScript sites, Cloudflare Workers is the best DX/cost combo available today.`,
  },
  {
    slug: 'freelancing-web-dev-las-vegas',
    title: "Freelancing as a Web Dev in 2026 — What's Actually Working",
    excerpt: 'Honest take on landing clients, pricing projects, and building a sustainable solo dev business from Las Vegas.',
    date: '2026-04-10',
    readTime: '6 min read',
    tags: [{ tag: 'Freelancing' }, { tag: 'Business' }, { tag: 'Career' }],
    status: 'published' as const,
    contentMarkdown: `## How I Started

I started KM Web Design in late 2025 after years of side projects and open-source work. The transition from "developer who builds things" to "freelancer who gets paid" required a different mindset.

The tech was never the hard part.

## What Actually Lands Clients

**Portfolio > Resume.** Every client I've signed came through seeing something I built, not reading my CV. My GitHub profile and this site have driven more leads than any job board.

**Niche, then broaden.** My first clients were small local businesses — a hair salon, a pool league directory. Solving specific problems for specific industries makes word-of-mouth work.

**Pricing by value, not hours.** Charging hourly creates incentives to work slowly. I price projects based on the business outcome, not my time.

## My Current Services

1. **Custom websites** — React + Tailwind, deployed to Cloudflare
2. **AI integrations** — Adding Gemini/ChatGPT features to existing sites
3. **Cloud migrations** — Moving legacy sites to modern stacks

## Tools I Use Daily

- **VS Code** with GitHub Copilot
- **Figma** for wireframes (even rough ones help clients commit)
- **Linear** for project tracking
- **Cloudflare** for everything infrastructure

## What's Challenging

Client communication takes more time than coding. Setting expectations early — timelines, revision limits, payment terms — prevents most problems.

## Looking Ahead

I'm building toward productized services: fixed-price packages for common deliverables. Less custom quoting, more repeatable value.

If you're thinking about freelancing, just start. Ship something. The rest follows.`,
  },
]

const projects = [
  { title: 'Braids by Jaira', type: 'Client Concept', tech: 'React / Vite', description: 'Boutique hair styling site with booking flow, gallery, and AI-powered consult.', link: 'https://github.com/Kacmnetworkk/Braids-by-jairah', order: 1 },
  { title: 'RavFia Platform', type: 'Platform', tech: 'Cloudflare', description: 'Open-source platform focused on AI tooling and serverless deployment.', link: 'https://github.com/Kacmnetworkk/ravfia', order: 2 },
  { title: 'QuickCart', type: 'Ecommerce', tech: 'Next / Tailwind', description: 'Minimal e-commerce starter template made for fast online store launches.', link: 'https://github.com/Kacmnetworkk/QuickCart', order: 3 },
  { title: 'Cuepal Directory', type: 'Directory', tech: 'TypeScript', description: 'A pool league finder concept connecting players with local game communities.', link: 'https://github.com/Kacmnetworkk/Cuepal-Directory', order: 4 },
  { title: 'RavFia SecurePass', type: 'Tooling', tech: 'API Concept', description: 'Cryptographic password generation and privacy-first tooling direction.', link: 'https://github.com/Kacmnetworkk', order: 5 },
  { title: 'KurtMorales Design', type: 'Studio', tech: 'Web Design', description: 'Brand focused on modern, fast, SEO-conscious websites for local companies.', link: 'https://kurtmorales.com', order: 6 },
]

async function seed() {
  console.log('🌱 Seeding PayloadCMS...')

  const payload = await getPayload({ config })

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@kurtmorales.com',
        password: 'changeme123',
        name: 'Kurt Morales',
      },
    })
    console.log('✅ Admin user created')
  } catch (e: any) {
    console.log('⚠️  Admin user may already exist:', e.message)
  }

  // Seed posts
  for (const post of posts) {
    try {
      await payload.create({ collection: 'posts', data: post })
      console.log(`✅ Post: ${post.title}`)
    } catch (e: any) {
      console.log(`⚠️  Post "${post.title}":`, e.message)
    }
  }

  // Seed projects
  for (const project of projects) {
    try {
      await payload.create({ collection: 'projects', data: project })
      console.log(`✅ Project: ${project.title}`)
    } catch (e: any) {
      console.log(`⚠️  Project "${project.title}":`, e.message)
    }
  }

  console.log('🌱 Seeding complete!')
  process.exit(0)
}

seed()
