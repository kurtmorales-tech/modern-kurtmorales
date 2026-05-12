import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export function NotFoundPage() {
  useSeo(
    'Page Not Found — KurtMorales',
    'The page you are looking for could not be found. Return to KurtMorales resources, templates, portfolio, or contact.',
    { canonical: '/404', noindex: true },
  );
  return (
    <main id="main-content">
      <section className="relative min-h-[70vh] pt-32 pb-24 overflow-hidden border-b border-gray-100 mesh-gradient grain">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-full">
            <span className="w-2 h-2 bg-brand rounded-full pulse-dot" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
              404
            </span>
          </span>
          <h1 className="text-5xl md:text-[5.5rem] font-display font-medium leading-[0.92] tracking-tight mb-8 text-gray-900">
            Page not
            <br />
            <span className="text-brand">found.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-12">
            This page may have moved, been renamed, or never existed. Here are the fastest ways back
            to useful content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="km-button km-button-primary">
              Go Home
            </Link>
            <Link to="/templates" className="km-button km-button-secondary">
              View Templates
            </Link>
            <Link to="/resources" className="km-button km-button-secondary">
              Resources
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
