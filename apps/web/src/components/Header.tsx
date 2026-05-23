import { Link, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'kurtmorales-theme';

type NavItem = {
  href: string;
  label: string;
  section: 'pages' | 'admin';
};

const navItems: NavItem[] = [
  { href: '/', label: 'Home', section: 'pages' },
  { href: '/#services', label: 'Services', section: 'pages' },
  { href: '/projects', label: 'Projects', section: 'pages' },
  { href: '/blog', label: 'Blog', section: 'pages' },
  { href: '/templates', label: 'Templates', section: 'pages' },
  { href: '/products', label: 'Products', section: 'pages' },
  { href: '/resources', label: 'Resources', section: 'pages' },
  { href: '/about', label: 'About', section: 'pages' },
];

const adminItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', section: 'admin' },
  { href: '/studio/blog', label: 'Blog Studio', section: 'admin' },
];

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function NavItem({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  if (item.href.startsWith('/#')) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className="block rounded-lg px-3 py-2 text-sm font-semibold km-text-muted hover:text-brand hover:bg-[var(--km-surface-muted)] transition-colors"
      >
        {item.label}
      </a>
    );
  }
  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          isActive ? 'text-brand bg-[var(--km-surface-muted)]' : 'km-text-muted hover:text-brand hover:bg-[var(--km-surface-muted)]'
        }`
      }
    >
      {item.label}
    </NavLink>
  );
}

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navWrapRef = useRef<HTMLDivElement>(null);

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
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = navWrapRef.current;
      if (el && !el.contains(e.target as Node)) setNavOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [navOpen]);

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
          {/* LEFT: Logo */}
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

          {/* CENTER: Navigation — hidden on mobile, simple links on desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.href + item.label} item={item} />
            ))}
          </div>

          {/* RIGHT: Buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop admin links */}
            <div className="hidden lg:flex items-center gap-1">
              {adminItems.map((item) => (
                <NavItem key={item.href + item.label} item={item} />
              ))}
            </div>

            {/* Desktop: Navigate dropdown */}
            <div className="hidden lg:flex items-center relative" ref={navWrapRef}>
              <button
                type="button"
                className="link-underline inline-flex items-center gap-1.5 py-2 transition-colors duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded text-[10px] font-black uppercase tracking-[0.2em] km-text-muted"
                aria-expanded={navOpen}
                aria-haspopup="true"
                aria-controls="site-nav-dropdown"
                id="nav-dropdown-button"
                onClick={() => setNavOpen((v) => !v)}
              >
                <span className="hidden xl:inline">More</span>
                <span className="xl:hidden">☰</span>
                <span className="text-[9px] opacity-70" aria-hidden>
                  {navOpen ? '▴' : '▾'}
                </span>
              </button>

              {navOpen && (
                <div
                  id="site-nav-dropdown"
                  role="region"
                  aria-labelledby="nav-dropdown-button"
                  className="absolute right-0 top-full z-50 w-56 pt-3"
                >
                  <div className="km-panel rounded-xl border border-[var(--km-border)] p-3 shadow-xl">
                    <div className="space-y-0.5">
                      <p className="px-3 pb-1 text-[9px] font-black uppercase tracking-[0.24em] text-brand">Pages</p>
                      {navItems.map((item) => (
                        <NavItem key={item.href + item.label} item={item} onClick={() => setNavOpen(false)} />
                      ))}
                      <hr className="my-2 border-[var(--km-border)]" />
                      <p className="px-3 pb-1 text-[9px] font-black uppercase tracking-[0.24em] text-brand">Admin</p>
                      {adminItems.map((item) => (
                        <NavItem key={item.href + item.label} item={item} onClick={() => setNavOpen(false)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact button */}
            <Link to="/contact" className="km-button km-button-primary px-5 py-3 text-[10px] hidden lg:inline-flex">
              Contact
            </Link>

            {/* Theme toggle */}
            <button
              className="live-card inline-flex h-10 w-10 items-center justify-center rounded-full border km-border-strong km-glass km-text-strong transition-all duration-300 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
              data-live-card
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            {/* Mobile hamburger */}
            <button
              className="live-card lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border km-border-strong km-glass km-text-strong transition-all duration-300 hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="absolute top-full left-4 right-4 rounded-xl p-4 lg:hidden km-panel shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-0.5">
              <p className="px-2 pb-1 text-[9px] font-black uppercase tracking-[0.24em] text-brand">Pages</p>
              {navItems.map((item) => (
                <NavItem key={item.href + item.label} item={item} onClick={() => setMobileOpen(false)} />
              ))}
              <hr className="my-2 border-[var(--km-border)]" />
              <p className="px-2 pb-1 text-[9px] font-black uppercase tracking-[0.24em] text-brand">Admin</p>
              {adminItems.map((item) => (
                <NavItem key={item.href + item.label} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
            <Link
              to="/contact"
              className="km-button km-button-primary mt-4 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </header>
    </>
  );
}