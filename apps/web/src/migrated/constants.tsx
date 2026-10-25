import type { ReactNode } from "react";
import { 
  Globe, 
  Rocket, 
  Zap, 
  Layers, 
  Terminal,
  Utensils,
  Building2,
  Coins
} from "lucide-react";

export interface Project {
  /** URL-safe id used by the /work/:id showcase route. */
  id: string;
  title: string;
  desc: string;
  tag: string;
  icon: ReactNode;
  /** Short, honest status label shown on the card. */
  status: string;
  /** Green treatment for shipped work; blue for local or in-progress builds. */
  live?: boolean;
  color: string;
  /** Internal case-study route. */
  path: string;
  /** Optional external launch URL (live site or bundled static demo). */
  href?: string;
  hrefLabel?: string;
  /** Card thumbnail, relative to /public. */
  image?: string;
  /** How the hero image should fill its frame; square artwork uses contain. */
  imageFit?: "cover" | "contain";
  /** Extra screens shown on the case-study page. */
  images?: string[];
  stack?: string[];
  role?: string;
  /** The file a developer opens to run the app locally. */
  entry?: string;
  /** Copy-ready local launch command. */
  command?: string;
  /** Caveat the visitor should know before pressing Launch. */
  note?: string;
}

export const projects: Project[] = [
  {
    id: "kmwebdesign-agency",
    title: "KM Webdesign — Digital Empires",
    desc: "The agency site: a dark, gradient-led landing page with an AI Strategy Audit that turns a website or business name into a three-point growth review, backed by services, portfolio, blog, careers, and an admin dashboard.",
    tag: "Agency / AI",
    icon: <Globe className="w-5 h-5" />,
    status: "Live",
    live: true,
    color: "from-blue-500 to-purple-500",
    path: "/work/kmwebdesign-agency",
    href: "https://kmwebdesign.pages.dev",
    hrefLabel: "Launch live site",
    image: "/showcase/kmwebdesign-agency.webp",
    stack: ["React 18", "Vite", "Gemini API", "Recharts"],
    role: "I designed the visual system, built the AI audit flow and admin dashboard, and shipped the Vite build.",
    entry: "components/AIAuditTool.tsx (React entry: src/index.tsx)",
    note: "The audit form calls Gemini. The page renders without a key, but the audit request needs one.",
  },
  {
    id: "kmwebdesign-freelance",
    title: "KM Webdesign — Freelance portfolio",
    desc: "A zero-framework portfolio for small-business clients: services, selected work, skills, and contact, built as one hand-written HTML page with a small vanilla JavaScript layer.",
    tag: "Static site",
    icon: <Layers className="w-5 h-5" />,
    status: "Static demo",
    color: "from-cyan-500 to-blue-500",
    path: "/work/kmwebdesign-freelance",
    href: "/showcase/kmwebdesign-freelance/",
    hrefLabel: "Launch static demo",
    image: "/showcase/kmwebdesign-freelance.webp",
    stack: ["HTML", "CSS", "JavaScript"],
    role: "I wrote the layout, typography, responsive behavior, and the vanilla JavaScript layer.",
    entry: "script.js",
    note: "The demo is bundled into this portfolio and runs from the same origin — no server required.",
  },
  {
    id: "kurtmorales",
    title: "KurtMorales — Portfolio & Blog",
    desc: "A personal portfolio and blog with a React 19 front end, a Tailwind v4 visual system, a Bun + SQLite content API, and RSS automation. The home page leads with a restaurant-focused value proposition.",
    tag: "Portfolio / CMS",
    icon: <Rocket className="w-5 h-5" />,
    status: "Local build",
    color: "from-orange-500 to-amber-500",
    path: "/work/kurtmorales",
    image: "/showcase/kurtmorales.webp",
    stack: ["React 19", "Vite", "Tailwind 4", "Bun · SQLite"],
    role: "I built the visual system, the React front end, the Bun content API, and the RSS automation.",
    entry: "apps/web/src/main.tsx · backend/src/server.ts",
    command: "bun run dev  # frontend :3000 · API :3001",
    note: "The front end reads projects and posts from the local Bun API, so run both processes for the full page.",
  },
  {
    id: "tubeideas",
    title: "TubeIdeas — AI YouTube idea engine",
    desc: "An idea engine for YouTube creators: pick a niche, add an optional topic, and generate high-retention title and thumbnail concepts. Built as a React component with an LLM prompt layer.",
    tag: "AI / Creator tools",
    icon: <Zap className="w-5 h-5" />,
    status: "Prototype",
    color: "from-rose-500 to-orange-500",
    path: "/work/tubeideas",
    href: "/showcase/tubeideas/",
    hrefLabel: "Launch UI demo",
    image: "/showcase/tubeideas.webp",
    stack: ["React", "Vite", "LLM prompts"],
    role: "I designed the prompts and the generator UI, including the idea cards and loading states.",
    entry: "youtube-idea-generator.jsx",
    note: "The bundled demo renders the full interface; generating ideas needs a model endpoint and key.",
  },
  {
    id: "manilabbq",
    title: "Manila BBQ & Seafood Grill",
    desc: "A restaurant web app for a Henderson, Nevada Filipino barbecue and seafood spot: menu, table booking with server-side validation, ordering fallbacks, review aggregation, and a map.",
    tag: "Restaurant / Web app",
    icon: <Utensils className="w-5 h-5" />,
    status: "Local prototype",
    color: "from-amber-500 to-red-500",
    path: "/work/manilabbq",
    image: "/showcase/manilabbq.webp",
    stack: ["Bun", "Vanilla JS", "Zero dependencies"],
    role: "I built the whole app: the Bun HTTP server, booking validation, and the JSON endpoints.",
    entry: "src/server.ts",
    command: "bun src/server.ts  # http://localhost:3137",
    note: "Booking requests persist to a local JSON file; nothing is deployed.",
  },
  {
    id: "ravfia-strategic",
    title: "Ravfia Strategic Operations",
    desc: "The public site for Ravfia Strategic Operations: government and commercial contracting positioning, service capabilities, field notes, and a scope-review flow. Astro + EmDash, deployed on Cloudflare Workers with D1 and R2.",
    tag: "Business site",
    icon: <Building2 className="w-5 h-5" />,
    status: "Live",
    live: true,
    color: "from-slate-400 to-blue-600",
    path: "/work/ravfia-strategic",
    href: "https://ravfiastrategic0perations.com",
    hrefLabel: "Visit live site",
    image: "/showcase/ravfia-strategic.webp",
    images: ["/showcase/ravfia-strategic.webp", "/showcase/ravfia-striping.webp"],
    stack: ["Astro", "EmDash", "Cloudflare Workers", "D1 · R2"],
    role: "I built the brand and UI, the Astro pages, the CMS model, and the Worker security boundary.",
    entry: "src/pages/index.astro",
    note: "The live site currently leads with parking-lot striping; the second screen shows that build.",
  },
  {
    id: "ravfia-coin",
    title: "Ravfia Coin (RFCN)",
    desc: "A fixed-supply SPL token on Solana. The brand system and launch assets present a 1,000,000,000 RFCN supply, with the mint authority permanently revoked.",
    tag: "Solana / Brand",
    icon: <Coins className="w-5 h-5" />,
    status: "On-chain",
    live: true,
    color: "from-violet-500 to-fuchsia-500",
    path: "/work/ravfia-coin",
    href: "/showcase/ravfia-coin.svg",
    hrefLabel: "View token artwork",
    image: "/showcase/ravfia-coin.webp",
    imageFit: "contain",
    stack: ["Solana", "SPL Token", "Brand design"],
    role: "I built the brand system and launch assets, and set the supply and authority decisions.",
    entry: "Token + brand assets — not a web app",
    note: "The mint authority is revoked, so the supply shown on the launch artwork cannot be increased.",
  },
];

export const articles = [
  {
    id: "future-of-ai-web-builders",
    title: "The Future of AI Website Builders",
    excerpt: "How LLMs are fundamentally changing the way we architect and deploy web applications.",
    content: `
      The landscape of web development is undergoing a seismic shift. For decades, the process of building a website involved manual coding, design iterations, and complex deployment pipelines. Today, Large Language Models (LLMs) are automating these steps, allowing anyone to generate production-ready sites from a simple prompt.

      But it's not just about speed. AI-driven builders are introducing a new paradigm: dynamic, intent-based architecture. Instead of static components, we're moving towards interfaces that adapt in real-time to user needs.

      In this article, we explore how these tools are being built, the technical challenges of generating clean, maintainable code, and what this means for the future of the web developer role.
    `,
    date: "March 24, 2026",
    readTime: "5 min read",
    tag: "AI",
    color: "text-blue-500"
  },
  {
    id: "mastering-flash-loans",
    title: "Mastering Flash Loans in DeFi",
    excerpt: "A deep dive into arbitrage strategies and the technical hurdles of smart contract execution.",
    content: `
      Flash loans are one of the most powerful and unique innovations in Decentralized Finance (DeFi). They allow users to borrow millions of dollars in assets without collateral, provided the loan is repaid within the same transaction.

      This opens up incredible opportunities for arbitrage, liquidations, and portfolio rebalancing. However, executing a successful flash loan requires a deep understanding of smart contract logic, gas optimization, and the specific protocols involved.

      We'll break down a real-world flash loan execution, look at the Solidity code required, and discuss the risks and rewards of this high-stakes DeFi strategy.
    `,
    date: "March 18, 2026",
    readTime: "8 min read",
    tag: "Crypto",
    color: "text-purple-500"
  },
  {
    id: "saas-automation-crm",
    title: "SaaS Automation for Small Businesses",
    excerpt: "Why every modern restaurant needs a CRM to survive in the digital-first economy.",
    content: `
      Small businesses, particularly in the hospitality industry, are often the last to adopt modern digital tools. Yet, the benefits of a well-implemented CRM (Customer Relationship Management) system are undeniable.

      Automation can handle everything from table reservations and loyalty programs to targeted marketing and inventory management. By freeing up human staff from repetitive tasks, businesses can focus on what matters most: the customer experience.

      This article outlines the core features of a modern restaurant CRM and how automation can drive significant growth and efficiency for small business owners.
    `,
    date: "March 12, 2026",
    readTime: "4 min read",
    tag: "SaaS",
    color: "text-orange-500"
  }
];

export const testimonials = [
  {
    name: "Alex Rivera",
    role: "Founder, Blockchain Solutions",
    content: "Kurt's understanding of DeFi protocols and their application is unparalleled. He built a custom arbitrage bot for us that outperformed our expectations.",
    avatar: "AR",
    verified: true
  },
  {
    name: "Sarah Chen",
    role: "CTO, Nexus AI",
    content: "The AI Website Builder Kurt architected for us reduced our deployment time by 70%. His ability to bridge complex LLM logic with production-ready code is rare.",
    avatar: "SC",
    verified: true
  },
  {
    name: "Marcus Thorne",
    role: "Owner, Gastronomy Group",
    content: "The CRM system Kurt built for our restaurant chain transformed how we handle reservations. It's not just a tool; it's a growth engine for our business.",
    avatar: "MT",
    verified: false
  }
];

export const digitalProducts = [
  {
    title: "The SaaS Launch Kit",
    desc: "Complete boilerplate for Next.js, Stripe, and AI integration. Save 100+ hours of setup.",
    price: "$49",
    tag: "Template",
    icon: <Layers className="w-5 h-5" />
  },
  {
    title: "AI Prompt Engineering Guide",
    desc: "Advanced techniques for LLM orchestration and autonomous agent development.",
    price: "$29",
    tag: "E-Book",
    icon: <Terminal className="w-5 h-5" />
  }
];
