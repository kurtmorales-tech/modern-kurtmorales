import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kurtmorales-theme';

type NavItem = {
  href: string;
  label: string;
};

const primaryNav: NavItem[] = [
  { href: '/#services', label: 'Services' },
  { href: '/#projects', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/templates', label: 'Templates' },
];

const secondaryNav: NavItem[] = [
  { href: '/products', label: 'Products' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
];

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const className = 'link-underline py-2 transition-colors duration-300 hover:text-brand';

  if (item.href.startsWith('/#')) {
    return (
      <a href={item.href} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) => `${className} ${isActive ? 'text-brand' : ''}`}
    >
      {item.label}
    </NavLink>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const className =
    'block rounded-lg px-3 py-2.5 text-sm font-semibold km-text-muted hover:text-brand';

  if (item.href.startsWith('/#')) {
    return (
      <a href={item.href} onClick={onNavigate} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} onClick={onNavigate} className={className}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

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

          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[10px] font-black uppercase tracking-[0.18em] km-text-muted">
            <div className="flex items-center gap-3 xl:gap-5">
              {primaryNav.map((item) => (
                <DesktopNavItem key={item.href} item={item} />
              ))}
            </div>
            <span className="h-5 w-px bg-[var(--km-border)]" aria-hidden="true" />
            <div className="flex items-center gap-3 xl:gap-5">
              {secondaryNav.map((item) => (
                <DesktopNavItem key={item.href} item={item} />
              ))}
            </div>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand mb-2">
                  Main
                </p>
                <ul className="space-y-1">
                  {primaryNav.map((item) => (
                    <li key={item.href}>
                      <MobileNavItem item={item} onNavigate={closeMobile} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand mb-2">
                  Explore
                </p>
                <ul className="space-y-1">
                  {secondaryNav.map((item) => (
                    <li key={item.href}>
                      <MobileNavItem item={item} onNavigate={closeMobile} />
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/contact"
                className="km-button km-button-primary mt-2 w-full sm:col-span-2"
                onClick={closeMobile}
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
