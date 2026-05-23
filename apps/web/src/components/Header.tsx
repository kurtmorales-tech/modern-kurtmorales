import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'kurtmorales-theme';
const HEADER_HIDE_THRESHOLD = 120;
const HEADER_HIDE_DELAY_MS = 90;

type NavSection = 'primary' | 'more' | 'studio';

type NavIcon = 'home' | 'services' | 'projects' | 'blog' | 'products' | 'templates' | 'resources' | 'about' | 'dashboard' | 'studio';

type NavItem = {
  href: string;
  label: string;
  section: NavSection;
  icon: NavIcon;
  description?: string;
};

const primaryNavItems: NavItem[] = [
  { href: '/', label: 'Home', section: 'primary', icon: 'home' },
  { href: '/#services', label: 'Services', section: 'primary', icon: 'services' },
  { href: '/projects', label: 'Projects', section: 'primary', icon: 'projects' },
  { href: '/blog', label: 'Blog', section: 'primary', icon: 'blog' },
];

const moreNavItems: NavItem[] = [
  {
    href: '/products',
    label: 'Products',
    section: 'more',
    icon: 'products',
    description: 'Digital products and experiments',
  },
  {
    href: '/templates',
    label: 'Templates',
    section: 'more',
    icon: 'templates',
    description: 'Starter kits and reusable builds',
  },
  {
    href: '/resources',
    label: 'Resources',
    section: 'more',
    icon: 'resources',
    description: 'Guides, tools, and references',
  },
  {
    href: '/about',
    label: 'About',
    section: 'more',
    icon: 'about',
    description: 'Background, values, and process',
  },
];

const studioNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    section: 'studio',
    icon: 'dashboard',
    description: 'API health and admin tables',
  },
  {
    href: '/studio/blog',
    label: 'Blog Studio',
    section: 'studio',
    icon: 'studio',
    description: 'Draft and publish content',
  },
];

const mobileSections: Array<{ title: string; items: NavItem[] }> = [
  { title: 'Navigate', items: primaryNavItems },
  { title: 'Explore', items: moreNavItems },
  { title: 'Studio', items: studioNavItems },
];

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function HeaderIcon({ name, className = 'h-3.5 w-3.5' }: { name: NavIcon | 'contact' | 'more' | 'moon' | 'sun' | 'menu' | 'close'; className?: string }) {
  const paths: Record<string, string> = {
    home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z',
    services: 'M4 6h16M4 12h10M4 18h16',
    projects: 'M4 5h16v14H4V5Zm3 4h10M7 13h6',
    blog: 'M6 4h12v16H6V4Zm3 4h6M9 12h6M9 16h4',
    products: 'M5 7 12 3l7 4v10l-7 4-7-4V7Zm7 4 7-4M12 11 5 7M12 11v10',
    templates: 'M4 5h16v6H4V5Zm0 10h7v4H4v-4Zm11 0h5v4h-5v-4Z',
    resources: 'M5 5h14v14H5V5Zm4 4h6M9 13h6M9 17h3',
    about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
    dashboard: 'M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z',
    studio: 'M4 6h16M7 6v12m10-12v12M5 18h14M9 10h6',
    contact: 'M4 6h16v12H4V6Zm1.5 1.5L12 13l6.5-5.5',
    more: 'M12 6v12M6 12h12',
    moon: 'M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z',
    sun: 'M12 4v2m0 12v2m8-8h-2M6 12H4m13.66-5.66-1.41 1.41M7.76 16.24l-1.42 1.42m11.32 0-1.41-1.42M7.76 7.76 6.34 6.34M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    close: 'M6 6l12 12M18 6 6 18',
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function isItemActive(item: NavItem, pathname: string, hash: string) {
  if (item.href.includes('#')) {
    const [path, itemHash] = item.href.split('#');
    return pathname === path && hash === `#${itemHash}`;
  }

  if (item.href === '/') return pathname === '/';
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

const navLinkClass = (isActive: boolean) =>
  `group/link flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
    isActive
      ? 'text-brand bg-[var(--km-surface-muted)]'
      : 'km-text-muted hover:text-brand hover:bg-[var(--km-surface-muted)]'
  }`;

function NavMenuItem({
  item,
  onClick,
  showDescription = false,
}: {
  item: NavItem;
  onClick?: () => void;
  showDescription?: boolean;
}) {
  const { pathname, hash } = useLocation();
  const active = isItemActive(item, pathname, hash);
  const content = (
    <>
      <HeaderIcon name={item.icon} className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover/link:opacity-100" />
      <span className="block min-w-0">
        <span className="block">{item.label}</span>
        {showDescription && item.description ? (
          <span className="mt-0.5 block font-sans text-xs font-medium normal-case leading-snug tracking-normal km-text-muted">
            {item.description}
          </span>
        ) : null}
      </span>
    </>
  );

  if (item.href.includes('#')) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className={navLinkClass(active)}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink to={item.href} onClick={onClick} className={({ isActive }) => navLinkClass(isActive)}>
      {content}
    </NavLink>
  );
}

function MenuSection({
  title,
  items,
  onClick,
}: {
  title: string;
  items: NavItem[];
  onClick?: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-brand">
        {title}
      </p>
      {items.map((item) => (
        <NavMenuItem key={item.href} item={item} onClick={onClick} showDescription />
      ))}
    </div>
  );
}

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const hideDelayTimeoutRef = useRef<number | null>(null);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const isMoreActive = useMemo(
    () =>
      moreNavItems.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname],
  );
  const isStudioActive = useMemo(
    () =>
      studioNavItems.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const clearHideDelay = () => {
      if (hideDelayTimeoutRef.current) {
        window.clearTimeout(hideDelayTimeoutRef.current);
        hideDelayTimeoutRef.current = null;
      }
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollYRef.current;
      const isScrollingDown = currentY > previousY + 6;
      const isScrollingUp = currentY < previousY - 6;

      setScrolled(currentY > 50);

      if (currentY < HEADER_HIDE_THRESHOLD || moreOpen || mobileOpen) {
        clearHideDelay();
        setHidden(false);
      } else if (isScrollingDown) {
        clearHideDelay();
        hideDelayTimeoutRef.current = window.setTimeout(() => {
          setHidden(true);
          hideDelayTimeoutRef.current = null;
        }, HEADER_HIDE_DELAY_MS);
      } else if (isScrollingUp) {
        clearHideDelay();
        setHidden(false);
      }

      lastScrollYRef.current = currentY;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearHideDelay();
      window.removeEventListener('scroll', onScroll);
    };
  }, [mobileOpen, moreOpen]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem(STORAGE_KEY)) setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!moreOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen, mobileOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = menuWrapRef.current;
      if (el && !el.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = mobileMenuRef.current;
      if (el && !el.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [mobileOpen]);

  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

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
        className={`sticky top-0 z-50 km-glass transition-all duration-300 will-change-transform ${hidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} ${scrolled ? 'shadow-sm' : ''}`}
      >
        <nav
          className={`max-w-6xl mx-auto px-6 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4 transition-all duration-300 relative ${scrolled ? 'h-16' : 'h-20'}`}
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group inline-flex items-center justify-self-start gap-3 text-xl font-bold tracking-tight km-text-strong transition-colors duration-300 hover:text-brand shrink-0"
            aria-label="Kurt Morales home"
          >
            <span className="inline-flex h-3 w-3 rounded-full bg-brand/80 shadow-[0_0_0_6px_rgba(244,129,32,0.12)]" />
            Kurt
            <span className="text-brand transition-colors duration-300 group-hover:text-brand-dark">
              Morales
            </span>
          </Link>

          <div
            className="hidden lg:flex items-center justify-center gap-2 justify-self-center"
            aria-label="Primary navigation"
          >
            <div className="flex items-center gap-1">
              {primaryNavItems.map((item) => (
                <NavMenuItem key={item.href} item={item} />
              ))}
            </div>

            <span className="mx-1 h-6 w-px bg-[var(--km-border)]" aria-hidden />

            <div className="flex items-center gap-2" aria-label="Primary actions">
              <div className="relative" ref={menuWrapRef}>
                <button
                  type="button"
                  className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                    isMoreActive || moreOpen
                      ? 'bg-[var(--km-surface-muted)] text-brand'
                      : 'km-glass km-text-strong hover:text-brand'
                  }`}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  aria-controls="site-more-menu"
                  id="site-more-button"
                  onClick={() => setMoreOpen((value) => !value)}
                >
                  More
                  <span className="text-[10px] opacity-70" aria-hidden>
                    {moreOpen ? '▴' : '▾'}
                  </span>
                </button>

                {moreOpen && (
                  <div
                    id="site-more-menu"
                    role="menu"
                    aria-labelledby="site-more-button"
                    className="absolute right-0 top-full z-50 w-72 pt-3"
                  >
                    <div className="km-panel rounded-lg p-3 shadow-xl">
                      <MenuSection
                        title="Explore"
                        items={moreNavItems}
                        onClick={() => setMoreOpen(false)}
                      />
                      <hr className="my-3 border-[var(--km-border)]" />
                      <MenuSection
                        title="Studio"
                        items={studioNavItems}
                        onClick={() => setMoreOpen(false)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isStudioActive ? (
                <span
                  className="inline-flex h-10 items-center rounded-md bg-[var(--km-surface-muted)] px-4 text-[10px] font-black uppercase tracking-[0.18em] text-brand"
                  aria-label="Studio section active"
                >
                  Studio
                </span>
              ) : null}

              <Link
                to="/contact"
                className="km-button km-button-primary inline-flex h-10 items-center border-0 px-5 py-0 text-[10px] [border-radius:0.5rem]"
              >
                Contact
              </Link>

              <button
                className="live-card inline-flex h-10 w-10 items-center justify-center rounded-md km-glass km-text-strong transition-all duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                type="button"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-pressed={theme === 'dark'}
                data-live-card
                onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
              >
                {theme === 'dark' ? '☀' : '☾'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 justify-self-end lg:hidden">
            <button
              className="live-card inline-flex h-10 w-10 items-center justify-center rounded-md km-glass km-text-strong transition-all duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
              data-live-card
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            <button
              className="live-card lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md km-glass km-text-strong transition-all duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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
            ref={mobileMenuRef}
            className="absolute top-full left-4 right-4 rounded-lg p-4 lg:hidden km-panel shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-4">
              {mobileSections.map((section) => (
                <MenuSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
            <Link
              to="/contact"
              className="km-button km-button-primary mt-4 w-full border-0 [border-radius:0.5rem]"
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
