import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

const resources = [
  {
    eyebrow: 'Documentation',
    title: 'Launch-ready website playbooks',
    body: 'Plain-English docs for project scoping, content handoff, SEO launch checks, and content operations.',
    href: '/blog/building-cms-for-non-developer-team-members-and-users',
  },
  {
    eyebrow: 'Meta Tags',
    title: 'SEO metadata checklist',
    body: 'Title, description, canonical, Open Graph, Twitter cards, local geo tags, and structured data essentials.',
    href: '#meta-tags',
  },
  {
    eyebrow: 'Backlinks',
    title: 'Authority-building resource list',
    body: 'Directories, partner pages, guest posts, community mentions, social profiles, and portfolio citations.',
    href: '#backlinks',
  },
  {
    eyebrow: 'Products',
    title: 'Marketplace roundup page',
    body: 'Dedicated sections for Temu, Amazon, TikTok Shop, and Alibaba with placeholder links ready for manual updates.',
    href: '/products',
  },
];

const metaChecklist = [
  'One primary keyword per page title',
  'Unique description under 160 characters',
  'Canonical URL for every indexable page',
  'Open Graph image and alt text',
  'Twitter/X summary_large_image card',
  'Schema.org structured data for services, person, website, and articles',
];
const backlinkTargets = [
  'Google Developer profile',
  'LinkedIn services/profile page',
  'GitHub portfolio and project READMEs',
  'Local Las Vegas business directories',
  'Client partner/resource pages',
  'Relevant niche communities and template galleries',
];

function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  if (href.startsWith('/'))
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function ResourcesPage() {
  useSeo(
    'Resources — KurtMorales',
    'Website resources, documentation, SEO meta-tag guidance, and backlink planning for modern small-business websites.',
    { canonical: '/resources' },
  );

  return (
    <main id="main-content">
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-gray-100 mesh-gradient grain">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="reveal inline-flex items-center gap-3 mb-8 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-full">
            <span className="w-2 h-2 bg-brand rounded-full pulse-dot" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
              Resource Hub
            </span>
          </span>
          <h1
            className="reveal text-5xl md:text-[5.5rem] font-display font-medium leading-[0.92] tracking-tight mb-8 text-gray-900"
            style={{ transitionDelay: '100ms' }}
          >
            Docs, metadata,
            <br />
            <span className="text-brand">and backlinks.</span>
          </h1>
          <p
            className="reveal text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed"
            style={{ transitionDelay: '200ms' }}
          >
            A fast reference hub for launching better websites: reusable documentation, technical
            SEO, credibility signals, and authority-building tasks.
          </p>
        </div>
      </section>
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {resources.map((item, index) => (
            <CardLink
              key={item.title}
              href={item.href}
              className="reveal group bg-white border border-gray-100 p-8 card-lift relative overflow-hidden"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-4">
                {item.eyebrow}
              </span>
              <h2 className="text-2xl font-display font-medium text-black mb-4 group-hover:text-brand transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              <div
                className="mt-8 h-[2px] w-0 bg-brand group-hover:w-full transition-all duration-500"
                style={{ transitionDelay: `${index * 90}ms` }}
              />
            </CardLink>
          ))}
        </div>
      </section>
      <section id="meta-tags" className="py-24 bg-surface-alt border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
          <div className="reveal-left">
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
              Meta Tags
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium leading-tight text-brand">
              Launch metadata that search engines understand.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {metaChecklist.map((item, index) => (
              <div
                key={item}
                className="reveal bg-white border border-gray-100 p-6"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="text-[10px] font-black text-brand/60 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-sm font-semibold text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="backlinks" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div className="reveal-left">
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
              Backlink Plan
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium leading-tight text-brand mb-6">
              Build trust signals without spam.
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-xl">
              Backlinks should come from real profiles, useful resources, project case studies,
              partner mentions, and local business citations.
            </p>
          </div>
          <ul className="space-y-4">
            {backlinkTargets.map((item, index) => (
              <li
                key={item}
                className="reveal flex items-start gap-4 bg-white border border-gray-100 p-5"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="mt-1.5 w-2 h-2 bg-brand flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
