import type { Payload } from 'payload'

import { getPayload } from 'payload'

import config from './payload.config'

const ADMIN_EMAIL = 'admin@kurtmorales.com'

const posts = [
  {
    slug: 'building-cms-for-non-developer-team-members-and-users',
    title: 'Building CMS for Non-Developer Team Members & Users',
    excerpt:
      'How I design CMS workflows that let clients, staff, and non-technical users publish content confidently without touching code.',
    date: '2026-05-05',
    readTime: '6 min read',
    tags: [{ tag: 'CMS' }, { tag: 'UX' }, { tag: 'Clients' }],
    status: 'published' as const,
    contentMarkdown: `## A CMS Should Feel Like a Tool, Not a Trap

A good CMS is not just a database with an admin panel. It is the workspace a real team uses when the developer is not in the room.

For non-developer team members, the difference between a useful CMS and a confusing one is clarity: obvious fields, plain-language labels, safe defaults, and workflows that match how people already think about their content.

## Start With the User, Not the Schema

Before building collections, I map out who will actually use the system:

- **Owners** who need to update offers, services, and announcements
- **Marketing teams** who publish posts and landing pages
- **Staff members** who upload images or edit simple details
- **Developers** who still need clean APIs and predictable data

The CMS has to serve all of them without making every user think like an engineer.

## Make Fields Self-Explanatory

Non-technical users should not have to guess what a field does. I use labels, descriptions, placeholders, and grouped sections to make the editing experience feel guided.

Instead of exposing raw implementation details, the CMS should speak in business language:

- "Page headline" instead of "heroTitle"
- "Short summary" instead of "excerpt" when the client needs plain wording
- "Publish status" instead of ambiguous flags

## Build Guardrails Into the Workflow

A CMS for real users needs guardrails. That means required fields where content would break without them, select fields where consistency matters, and drafts when publishing should be reviewed first.

Good guardrails reduce mistakes without slowing people down.

## Keep the Frontend Bound to the CMS

The frontend should read from the CMS as the source of truth. Static fallback data is useful for development and emergency builds, but live content should come from the editorial system.

That gives the client a simple promise: update the CMS, rebuild or refresh the site, and the content changes are reflected online.

## The Goal Is Confidence

The best CMS experience gives non-developer users confidence. They know where to go, what to edit, what will happen when they publish, and how to recover if something is not ready yet.

That is the difference between handing over a website and handing over a working content system.`,
  },
]

const projects = [
  {
    title: 'Braids by Jaira',
    type: 'Client Concept',
    tech: 'React / Vite',
    description: 'Boutique hair styling site with booking flow, gallery, and AI-powered consult.',
    link: 'https://github.com/Kacmnetworkk/Braids-by-jairah',
    order: 1,
  },
  {
    title: 'RavFia Platform',
    type: 'Platform',
    tech: 'Cloudflare',
    description: 'Open-source platform focused on AI tooling and serverless deployment.',
    link: 'https://github.com/Kacmnetworkk/ravfia',
    order: 2,
  },
  {
    title: 'QuickCart',
    type: 'Ecommerce',
    tech: 'Next / Tailwind',
    description: 'Minimal e-commerce starter template made for fast online store launches.',
    link: 'https://github.com/Kacmnetworkk/QuickCart',
    order: 3,
  },
  {
    title: 'Cuepal Directory',
    type: 'Directory',
    tech: 'TypeScript',
    description: 'A pool league finder concept connecting players with local game communities.',
    link: 'https://github.com/Kacmnetworkk/Cuepal-Directory',
    order: 4,
  },
  {
    title: 'RavFia SecurePass',
    type: 'Tooling',
    tech: 'API Concept',
    description: 'Cryptographic password generation and privacy-first tooling direction.',
    link: 'https://github.com/Kacmnetworkk',
    order: 5,
  },
  {
    title: 'KurtMorales Design',
    type: 'Studio',
    tech: 'Web Design',
    description: 'Brand focused on modern, fast, SEO-conscious websites for local companies.',
    link: 'https://kurtmorales.com',
    order: 6,
  },
]

const templates = [
  {
    title: 'SaaS Dashboard',
    description: 'Modern SaaS dashboard template with dark mode, charts, and responsive layout.',
    tech: 'React / Tailwind / Vite',
    demoUrl: 'https://saas-dashboard-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/saas-dashboard',
    tags: [{ tag: 'SaaS' }, { tag: 'Dashboard' }, { tag: 'React' }],
    featured: true,
    price: 49,
    order: 1,
  },
  {
    title: 'Ecommerce Starter',
    description: 'Clean e-commerce starter with product grid, cart, and checkout flow.',
    tech: 'Next.js / Stripe',
    demoUrl: 'https://ecommerce-starter-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/ecommerce-starter',
    tags: [{ tag: 'Ecommerce' }, { tag: 'Next.js' }, { tag: 'Stripe' }],
    featured: false,
    price: 0,
    order: 2,
  },
  {
    title: 'Portfolio Minimal',
    description: 'Minimal portfolio template for creatives with smooth animations.',
    tech: 'Astro / Tailwind',
    demoUrl: 'https://portfolio-minimal-demo.kurtmorales.com',
    sourceUrl: 'https://github.com/Kacmnetworkk/portfolio-minimal',
    tags: [{ tag: 'Portfolio' }, { tag: 'Astro' }, { tag: 'Minimal' }],
    featured: true,
    price: 29,
    order: 3,
  },
]

async function ensureAdminUser(payload: Payload): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'users',
      limit: 1,
      where: { email: { equals: ADMIN_EMAIL } },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: { email: ADMIN_EMAIL, password: 'changeme123', name: 'Kurt Morales' },
      })
      console.log('✅ Admin user created')
    } else {
      console.log('⚠️  Admin user already exists')
    }
  } catch (e: any) {
    console.log('⚠️  Admin user:', e.message)
  }
}

async function upsertPost(payload: Payload, post: (typeof posts)[number]): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'posts',
      limit: 1,
      where: { slug: { equals: post.slug } },
    })

    if (existing.totalDocs > 0) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, data: post })
      console.log(`✅ Updated: ${post.title}`)
    } else {
      await payload.create({ collection: 'posts', data: post })
      console.log(`✅ Created: ${post.title}`)
    }
  } catch (e: any) {
    console.log(`⚠️  "${post.title}":`, e.message)
  }
}

async function createProjectIfNew(payload: Payload, project: (typeof projects)[number]): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'projects',
      limit: 1,
      where: {
        and: [{ title: { equals: project.title } }, { link: { equals: project.link } }],
      },
    })

    if (existing.totalDocs > 0) {
      console.log(`⚠️  "${project.title}" already exists`)
    } else {
      await payload.create({ collection: 'projects', data: project })
      console.log(`✅ Created: ${project.title}`)
    }
  } catch (e: any) {
    console.log(`⚠️  "${project.title}":`, e.message)
  }
}

async function createTemplateIfNew(payload: Payload, template: (typeof templates)[number]): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'templates',
      limit: 1,
      where: { title: { equals: template.title } },
    })

    if (existing.totalDocs > 0) {
      console.log(`⚠️  "${template.title}" already exists`)
    } else {
      await payload.create({ collection: 'templates', data: template })
      console.log(`✅ Created template: ${template.title}`)
    }
  } catch (e: any) {
    console.log(`⚠️  "${template.title}":`, e.message)
  }
}

async function seed() {
  console.log('🌱 Seeding PayloadCMS...')

  const payload = await getPayload({ config })

  await ensureAdminUser(payload)
  await Promise.all(posts.map((post) => upsertPost(payload, post)))
  await Promise.all(projects.map((project) => createProjectIfNew(payload, project)))
  await Promise.all(templates.map((template) => createTemplateIfNew(payload, template)))

  console.log('🌱 Seeding complete!')
  process.exit(0)
}

seed()
