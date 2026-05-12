import { Link, NavLink } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'kurtmorales-theme';

type MegaLink = {
  href: string;
  label: string;
  hint?: string;
};

type MegaColumn = {
  title: string;
  links: MegaLink[];
};

const megaColumns: MegaColumn[] = [
  {
    title: 'Showcase',
    links: [
      { href: '/#services', label: 'Services', hint: 'Home · services strip' },
      { href: '/#projects', label: 'Featured work', hint: 'Home · projects' },
      { href: '/projects', label: 'All projects', hint: 'Dedicated archive' },
    ],
  },
  {
    title: 'Content & build',
    links: [
      { href: '/blog', label: 'Blog', hint: 'Articles & playbooks' },
      { href: '/templates', label: 'Templates', hint: 'Starters & themes' },
      { href: '/products', label: 'Products', hint: 'Marketplace picks' },
      { href: '/resources', label: 'Resources', hint: 'SEO & launch hub' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '/dashboard', label: 'API dashboard', hint: 'Health & latency probes' },
      { href: '/studio/blog', label: 'Blog studio', hint: 'Drafts & editor index' },
      { href: '/about', label: 'About', hint: 'Background & approach' },
      { href: '/contact', label: 'Contact', hint: 'Start a project' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function MegaLinkItem({ link, onNavigate }: { link: MegaLink; onNavigate?: () => void }) {
  const className =
    'group block rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--km-surface-muted)]';
  const title = link.hint ? `${link.label} — ${link.hint}` : link.label;

  if (link.href.startsWith('/#')) {
    return (
      <a href={link.href} onClick={onNavigate} className={className} title={title}>
        <span className="block text-[13px] font-semibold text-[var(--km-text-strong)] group-hover:text-brand">
          {link.label}
        </span>
        {link.hint && (
          <span className="mt-0.5 block text-[11px] leading-snug text-[var(--km-muted)]">
            {link.hint}
          </span>
        )}
      </a>
    );
  }

  return (
    <NavLink
      to={link.href}
      onClick={onNavigate}
      className={({ isActive }) => `${className} ${isActive ? 'bg-[var(--km-surface-muted)]' : ''}`}
      title={title}
    >
      {({ isActive }) => (
        <>
          <span
            className={`block text-[13px] font-semibold ${isActive ? 'text-brand' : 'text-[var(--km-text-strong)] group-hover:text-brand'}`}
          >
            {link.label}
          </span>
          {link.hint && (
            <span className="mt-0.5 block text-[11px] leading-snug text-[var(--km-muted)]">
              {link.hint}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaWrapRef = useRef<HTMLDivElement>(null);

  const closeMega = useCallback(() => setMegaOpen(false), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem(STORAGE_KEY)) setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [megaOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = megaWrapRef.current;
      if (el && !el.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [megaOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <header
        id="site-header"
        className={`sticky top-0 z-50 border-b km-border-soft km-glass transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <nav
          className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 relative ${scrolled ? 'h-16' : 'h-20'}`}
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 text-xl font-bold tracking-tight km-text-strong transition-colors duration-300 hover:text-brand shrink-0"
          >
            <span className="inline-flex h-3 w-3 rounded-full bg-brand/80 shadow-[0_0_0_6px_rgba(244,129,32,0.12)]" />
            Kurt
            <span className="text-brand transition-colors duration-300 group-hover:text-brand-dark">
              Morales
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-3 xl:gap-5 text-[10px] font-black uppercase tracking-[0.2em] km-text-muted">
            <div ref={megaWrapRef} className="relative">
              <button
                type="button"
                className={`link-underline inline-flex items-center gap-1.5 py-2 transition-colors duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded ${megaOpen ? 'text-brand' : ''}`}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                aria-controls="site-mega-menu"
                id="mega-menu-button"
                onClick={() => setMegaOpen((v) => !v)}
              >
                Explore
                <span className="text-[9px] opacity-70" aria-hidden>
                  {megaOpen ? '▴' : '▾'}
                </span>
              </button>

              {megaOpen && (
                <div
                  id="site-mega-menu"
                  role="region"
                  aria-labelledby="mega-menu-button"
                  className="absolute left-1/2 z-50 w-[min(100vw-2rem,56rem)] -translate-x-1/2 pt-3 transition-opacity duration-200"
                >
                  <div className="km-panel rounded-[1.75rem] border border-[var(--km-border)] p-6 md:p-8 shadow-xl">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                      {megaColumns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-brand">
                            {col.title}
                          </p>
                          <ul className="space-y-0.5">
                            {col.links.map((link) => (
                              <li key={link.href + link.label}>
                                <MegaLinkItem link={link} onNavigate={closeMega} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--km-border)] pt-6">
                      <p className="text-xs text-[var(--km-muted)] max-w-md leading-relaxed">
                        Jump to any section of the site. API dashboard runs live probes against your
                        Bun content API.
                      </p>
                      <Link
                        to="/contact"
                        onClick={closeMega}
                        className="km-button km-button-primary px-5 py-3 text-[10px]"
                      >
                        Start a project
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `link-underline py-2 transition-colors duration-300 hover:text-brand ${isActive ? 'text-brand' : ''}`
              }
            >
              Dashboard
            </NavLink>

            <Link to="/contact" className="km-button km-button-primary px-5 py-3 text-[10px] ml-1">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="theme-toggle live-card inline-flex h-11 w-11 items-center justify-center rounded-full border km-border-strong km-glass km-text-strong transition-all duration-300 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
              data-live-card
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            <button
              className="live-card lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border km-border-strong km-glass km-text-strong transition-all duration-300 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              data-live-card
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div
            id="mobile-menu"
            className="absolute top-[calc(100%+0.75rem)] left-4 right-4 rounded-[1.75rem] p-5 lg:hidden km-panel shadow-xl max-h-[min(80vh,32rem)] overflow-y-auto"
          >
            <div className="space-y-6">
              {megaColumns.map((col) => (
                <div key={col.title}>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand mb-2">
                    {col.title}
                  </p>
                  <ul className="space-y-1">
                    {col.links.map((link) => (
                      <li key={link.href + link.label}>
                        {link.href.startsWith('/#') ? (
                          <a
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-2 py-2 text-sm font-semibold km-text-muted hover:text-brand"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-2 py-2 text-sm font-semibold km-text-muted hover:text-brand"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                to="/contact"
                className="km-button km-button-primary mt-2 w-full"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
