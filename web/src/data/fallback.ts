import type { PayloadPost, PayloadProject, Template } from '../lib/payload';
import generatedRssPosts from './generated-rss-posts.json';
import howToPosts from './how-to-posts.json';

export const fallbackPosts: PayloadPost[] = [
  ...(howToPosts as PayloadPost[]),
  ...(generatedRssPosts as PayloadPost[]),
  {
    id: 'f1',
    slug: 'building-cms-for-non-developer-team-members-and-users',
    title: 'Building CMS for Non-Developer Team Members & Users',
    excerpt: 'How I design CMS workflows that let clients, staff, and non-technical users publish content confidently without touching code.',
    date: '2026-05-05',
    readTime: '6 min read',
    status: 'published',
    tags: [{ tag: 'CMS' }, { tag: 'UX' }, { tag: 'Clients' }],
    contentMarkdown: `## A CMS Should Feel Like a Tool, Not a Trap\n\nA good CMS is not just a database with an admin panel. It is the workspace a real team uses when the developer is not in the room.\n\nFor non-developer team members, the difference between a useful CMS and a confusing one is clarity: obvious fields, plain-language labels, safe defaults, and workflows that match how people already think about their content.\n\n## Start With the User, Not the Schema\n\nBefore building collections, I map out who will actually use the system:\n\n- **Owners** who need to update offers, services, and announcements\n- **Marketing teams** who publish posts and landing pages\n- **Staff members** who upload images or edit simple details\n- **Developers** who still need clean APIs and predictable data\n\nThe CMS has to serve all of them without making every user think like an engineer.\n\n## Make Fields Self-Explanatory\n\nNon-technical users should not have to guess what a field does. I use labels, descriptions, placeholders, and grouped sections to make the editing experience feel guided.\n\nInstead of exposing raw implementation details, the CMS should speak in business language:\n\n- “Page headline” instead of “heroTitle”\n- “Short summary” instead of “excerpt” when the client needs plain wording\n- “Publish status” instead of ambiguous flags\n\n## Build Guardrails Into the Workflow\n\nA CMS for real users needs guardrails. That means required fields where content would break without them, select fields where consistency matters, and drafts when publishing should be reviewed first.\n\nGood guardrails reduce mistakes without slowing people down.\n\n## Keep the Frontend Bound to the CMS\n\nThe frontend should read from the CMS as the source of truth. Static fallback data is useful for development and emergency builds, but live content should come from the editorial system.\n\nThat gives the client a simple promise: update the CMS, rebuild or refresh the site, and the content changes are reflected online.\n\n## The Goal Is Confidence\n\nThe best CMS experience gives non-developer users confidence. They know where to go, what to edit, what will happen when they publish, and how to recover if something is not ready yet.\n\nThat is the difference between handing over a website and handing over a working content system.`,
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

export const fallbackTemplates: Template[] = [
  {
    id: 't1',
    title: 'SaaS Dashboard',
    description: 'Modern SaaS dashboard template with dark mode, charts, and responsive layout.',
    tech: 'React / Tailwind / Vite',
    thumbnail: { url: '/template-previews/saas-dashboard.png', alt: 'SaaS Dashboard template preview' },
    demoUrl: 'https://saas-dashboard-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/saas-dashboard',
    tags: [{ tag: 'SaaS' }, { tag: 'Dashboard' }, { tag: 'React' }],
    featured: true,
    price: 49,
    order: 1,
  },
  {
    id: 't2',
    title: 'Ecommerce Starter',
    description: 'Clean e-commerce starter with product grid, cart, and checkout flow.',
    tech: 'Next.js / Stripe',
    thumbnail: { url: '/template-previews/ecommerce-starter.png', alt: 'Ecommerce Starter template preview' },
    demoUrl: 'https://ecommerce-starter-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/ecommerce-starter',
    tags: [{ tag: 'Ecommerce' }, { tag: 'Next.js' }, { tag: 'Stripe' }],
    featured: false,
    price: 0,
    order: 2,
  },
  {
    id: 't3',
    title: 'Portfolio Minimal',
    description: 'Minimal portfolio template for creatives with smooth animations.',
    tech: 'Astro / Tailwind',
    thumbnail: { url: '/template-previews/portfolio-minimal.png', alt: 'Portfolio Minimal template preview' },
    demoUrl: 'https://portfolio-minimal-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/portfolio-minimal',
    tags: [{ tag: 'Portfolio' }, { tag: 'Astro' }, { tag: 'Minimal' }],
    featured: true,
    price: 29,
    order: 3,
  },
  {
    id: 't4',
    title: 'SecurePass',
    description: 'AI-assisted password security template with generator flows, encrypted vault patterns, QR tools, and master-password strength checks.',
    tech: 'React / Vite / Gemini',
    thumbnail: { url: '/template-previews/securepass.png', alt: 'SecurePass template preview' },
    sourceUrl: 'https://github.com/Kacmnetworkk/SecurePass',
    tags: [{ tag: 'Security' }, { tag: 'React' }, { tag: 'AI' }],
    featured: false,
    price: 0,
    order: 4,
  },
  {
    id: 't5',
    title: 'Portfolio Theme',
    description: 'Clean, responsive portfolio template for freelancers and creatives. Built with semantic HTML, CSS, and vanilla JS — ready for Cloudflare Pages deploy.',
    tech: 'HTML / CSS / JS',
    thumbnail: { url: '/template-previews/portfolio-theme.png', alt: 'Portfolio Theme template preview' },
    sourceUrl: 'https://github.com/kurtmorales-tech/km-portfolio-themed',
    tags: [{ tag: 'Portfolio' }, { tag: 'Static' }, { tag: 'Freelance' }],
    featured: false,
    price: 0,
    order: 5,
  },
];
