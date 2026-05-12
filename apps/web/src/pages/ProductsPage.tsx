import { Link } from 'react-router-dom';
import { productPlatforms } from '../data/product-picks';
import { useSeo } from '../lib/seo';

const totalProducts = productPlatforms.reduce((sum, platform) => sum + platform.products.length, 0);

export function ProductsPage() {
  useSeo(
    'Products — KurtMorales',
    'Curated product roundup page with placeholder listings for Temu, Amazon, TikTok Shop, and Alibaba. Links can be updated manually later.',
    { canonical: '/products' },
  );

  return (
    <main id="main-content">
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-gray-100 mesh-gradient grain">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="reveal km-pill km-text-muted mb-8 text-[10px] font-black tracking-[0.3em] uppercase">
            <span className="w-2 h-2 bg-brand rounded-full pulse-dot" />
            Product Hub
          </span>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1
                className="reveal text-5xl md:text-[5.4rem] font-display font-medium leading-[0.92] tracking-tight mb-8 km-text-strong"
                style={{ transitionDelay: '100ms' }}
              >
                Marketplace picks,
                <br />
                <span className="text-brand">organized for later links.</span>
              </h1>
              <p
                className="reveal text-lg md:text-xl km-text-muted max-w-2xl leading-relaxed"
                style={{ transitionDelay: '200ms' }}
              >
                A dedicated roundup page for Temu, Amazon, TikTok Shop, and Alibaba. The structure
                is live now, while outbound product links stay intentionally blank until you update
                them manually.
              </p>
            </div>
            <div
              className="reveal km-panel live-card rounded-[2rem] p-7 md:p-8"
              data-live-card
              style={{ transitionDelay: '300ms' }}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Platforms', productPlatforms.length],
                  ['Products', totalProducts],
                  ['Status', 'Links pending'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.5rem] border km-border-strong km-surface-soft p-5 backdrop-blur-sm"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 block mb-3">
                      {label}
                    </span>
                    <p className="text-3xl font-display font-medium km-text-strong">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="reveal mt-10 rounded-[2rem] border km-border-strong km-glass p-6 md:p-7"
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] km-text-soft block mb-3">
                  Disclosure
                </span>
                <p className="text-sm md:text-base km-text-muted leading-relaxed max-w-3xl">
                  This page intentionally uses placeholder product entries without live affiliate
                  URLs. Add your final Amazon, Temu, TikTok Shop, or Alibaba links manually later.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {productPlatforms.map((platform) => (
                  <a
                    key={platform.slug}
                    href={`#${platform.slug}`}
                    className="km-button km-button-secondary"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {productPlatforms.map((platform, platformIndex) => (
        <section
          key={platform.slug}
          id={platform.slug}
          className={`py-24 border-b border-gray-100 ${platformIndex % 2 === 0 ? 'bg-white' : 'bg-surface-alt'}`}
        >
          <div className="max-w-6xl mx-auto px-6 grid gap-10 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
            <div className="reveal-left xl:sticky xl:top-28">
              <span className="km-text-soft font-bold text-[10px] tracking-widest uppercase block mb-4">
                {platform.eyebrow}
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-medium leading-tight text-brand mb-5">
                {platform.name}
              </h2>
              <p className="km-text-muted leading-relaxed mb-6 max-w-xl">{platform.description}</p>
              <div className="rounded-[1.5rem] border km-border-strong km-surface-soft p-5 backdrop-blur-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 block mb-3">
                  Best use
                </span>
                <p className="text-sm leading-relaxed km-text-muted">{platform.angle}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {platform.products.map((product, productIndex) => (
                <article
                  key={product.name}
                  className="reveal km-panel live-card rounded-[1.75rem] p-6 md:p-7 flex flex-col"
                  data-live-card
                  style={{ transitionDelay: `${productIndex * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <span className="number-chip">{String(productIndex + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] km-text-soft">
                      Link pending
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 block mb-3">
                      {product.category}
                    </span>
                    <h3 className="text-2xl font-display font-medium km-text-strong mb-3">
                      {product.name}
                    </h3>
                    <p className="text-sm leading-relaxed km-text-muted">{product.summary}</p>
                  </div>
                  {product.note && (
                    <div className="mt-auto mb-6 rounded-[1.25rem] border km-border-strong km-surface-tint px-4 py-4 text-sm leading-relaxed km-text-muted">
                      {product.note}
                    </div>
                  )}
                  {product.href ? (
                    <a
                      href={product.href}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="km-button km-button-primary w-full"
                    >
                      View product
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="km-button km-button-secondary w-full opacity-65 cursor-not-allowed"
                    >
                      Add link later
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="km-panel live-card rounded-[2rem] p-8 md:p-10 lg:p-12" data-live-card>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] km-text-soft block mb-4">
                  Update workflow
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-medium leading-[0.96] km-text-strong mb-5">
                  Ready for real links when you are.
                </h2>
                <p className="text-base md:text-lg leading-relaxed km-text-muted max-w-2xl">
                  When you want to go live, update the href fields in
                  apps/web/src/data/product-picks.ts. The cards are already styled and the buttons
                  activate automatically.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link to="/blog" className="km-button km-button-secondary">
                  Back to blog
                </Link>
                <Link to="/contact" className="km-button km-button-primary">
                  Request setup help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
