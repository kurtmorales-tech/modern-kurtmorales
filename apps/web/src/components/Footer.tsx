import { Link } from 'react-router-dom';

const social = [
  { label: 'GitHub', href: 'https://github.com/kurtmorales-tech' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kurtanthonymorales/',
  },
  { label: 'X', href: 'https://x.com/xkamhype' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="km-glass py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-[1.35fr_1fr_1fr] items-start">
          <div className="km-panel live-card p-8 md:p-10" data-live-card>
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight mb-6 inline-flex items-center gap-3 group km-text-strong"
            >
              <span className="inline-flex h-3 w-3 rounded-full bg-brand/80 shadow-[0_0_0_6px_rgba(244,129,32,0.12)]" />
              Kurt
              <span className="text-brand group-hover:text-brand-dark transition-colors duration-300">
                Morales
              </span>
            </Link>
            <p className="text-sm km-text-muted max-w-sm leading-relaxed mb-8">
              Cloudflare-ready websites, sharp content systems, and conversion-focused interfaces
              built for real business use.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:email@kurtmorales.com" className="km-button km-button-secondary">
                Email
              </a>
              <Link to="/contact" className="km-button km-button-primary">
                Start project
              </Link>
            </div>
          </div>

          <div className="km-panel live-card p-8 md:p-10" data-live-card>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] km-text-soft block mb-6">
              $ navigation
            </span>
            <ul className="space-y-4 text-sm km-text-muted font-medium">
              <li>
                <a
                  href="/#services"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/#projects"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Projects
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  API dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="km-panel live-card p-8 md:p-10" data-live-card>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] km-text-soft block mb-6">
              $ legal --meta
            </span>
            <ul className="space-y-4 text-sm km-text-muted font-medium">
              <li>
                <a
                  href="mailto:email@kurtmorales.com"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Admin Support
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/kurtmorales-tech"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-brand transition-colors duration-300"
                >
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] km-text-soft">
            © {year} KurtMorales Studio. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="km-pill km-text-muted hover:text-brand transition-colors duration-300"
                aria-label={item.label}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
