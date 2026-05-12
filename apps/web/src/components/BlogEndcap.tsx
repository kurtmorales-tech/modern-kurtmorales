import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const baseNavigationItems = [
  {
    number: '01',
    title: 'Home',
    body: 'Start from the main landing page and current availability.',
    href: '/',
    cta: 'Open home',
  },
  {
    number: '02',
    title: 'Services',
    body: 'Review core offers, delivery style, and working model.',
    href: '/#services',
    cta: 'See services',
  },
  {
    number: '03',
    title: 'Portfolio',
    body: 'Scan selected builds, experiments, and client-facing work.',
    href: '/#projects',
    cta: 'View work',
  },
  {
    number: '04',
    title: 'Templates',
    body: 'Browse ready-made products and reusable launch assets.',
    href: '/templates',
    cta: 'Browse templates',
  },
  {
    number: '05',
    title: 'Resources',
    body: 'Open launch docs, SEO notes, and technical guidance.',
    href: '/resources',
    cta: 'Open resources',
  },
  {
    number: '06',
    title: 'About',
    body: 'See background, workflow, and platform preferences.',
    href: '/about',
    cta: 'Meet Kurt',
  },
  {
    number: '07',
    title: 'Contact',
    body: 'Start a conversation about scope, timeline, or delivery.',
    href: '/contact',
    cta: 'Start inquiry',
  },
];

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith('http') || href.includes('#'))
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export function BlogEndcap({
  latestHref = '/blog',
  latestLabel = 'Jump into the newest article in the archive.',
}: {
  latestHref?: string;
  latestLabel?: string;
}) {
  const navigationItems = [
    ...baseNavigationItems,
    {
      number: '08',
      title: 'Latest Post',
      body: latestLabel,
      href: latestHref,
      cta: 'Read now',
    },
  ];

  return (
    <section className="pb-8 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="km-panel live-card rounded-[2rem] p-8 md:p-12 lg:p-14" data-live-card>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="km-pill km-text-muted mb-6 text-[10px] font-black uppercase tracking-[0.28em]">
                <span className="h-2 w-2 rounded-full bg-brand pulse-dot" />
                Blog endcap
              </span>
              <h2 className="max-w-3xl text-3xl md:text-5xl font-display font-medium leading-[0.96] km-text-strong mb-6">
                Want a portfolio UI that feels <span className="text-brand">fast, live,</span> and
                platform-ready?
              </h2>
              <p className="max-w-2xl text-base md:text-lg leading-relaxed km-text-muted">
                I build conversion-focused sites with sharp content structure, Cloudflare-ready
                delivery, and interaction that stays useful instead of noisy.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Edge-ready', 'React, Bun, and Cloudflare-first workflows.'],
                ['UI systems', 'Reusable panels, buttons, and structured content.'],
                ['Launch focus', 'SEO, speed, accessibility, and clean handoff.'],
              ].map(([label, body]) => (
                <div
                  key={label}
                  className="rounded-[1.5rem] border km-border-strong km-surface-soft px-5 py-5 backdrop-blur-sm"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 mb-3">
                    {label}
                  </p>
                  <p className="text-sm leading-relaxed km-text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="km-button km-button-primary">
              Start a project
            </Link>
            <a href="mailto:email@kurtmorales.com" className="km-button km-button-secondary">
              Email directly
            </a>
          </div>
        </div>

        <div className="mt-6 mb-6 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.28em] km-text-soft block mb-3">
              Navigation
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-medium km-text-strong">
              01 → 08 quick path
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-relaxed km-text-muted">
            A numbered jump grid for the rest of the site. Fast to scan. Easy to revisit.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {navigationItems.map((item) => (
            <SmartLink
              key={item.number}
              href={item.href}
              className="km-panel live-card group rounded-[1.75rem] p-6 md:p-7 min-h-[15rem] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="number-chip">{item.number}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.24em] km-text-soft group-hover:text-brand/70 transition-colors duration-300">
                  {item.cta}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-display font-medium km-text-strong mb-3 group-hover:text-brand transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed km-text-muted">{item.body}</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand/70">
                  <span>Open</span>
                  <span aria-hidden>→</span>
                </div>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
