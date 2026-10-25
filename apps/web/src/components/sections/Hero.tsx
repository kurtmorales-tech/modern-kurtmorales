export function Hero() {
  const availability = [
    'Restaurant-first strategy and design',
    'Mobile menus built for hungry guests',
    'Reservations, ordering, and POS integrations',
    'Fast Cloudflare-ready deployment',
  ];

  return (
    <section id="home" className="relative pt-32 pb-40 mesh-gradient grain overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-[var(--km-surface-muted)] blur-2xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-2 lg:gap-20 items-center relative z-10">
        <div>
          <div className="reveal km-pill mb-8">
            <span className="w-2 h-2 bg-green-500 pulse-dot" />
            <span className="text-[10px] font-black tracking-[0.18em] uppercase km-text-muted">
              Las Vegas restaurant web design
            </span>
          </div>
          <h1
            className="reveal text-5xl md:text-[5.5rem] font-display font-medium leading-[0.92] tracking-tight mb-10"
            style={{ transitionDelay: '100ms' }}
          >
            <span className="text-brand">Turn local searches</span>
            <span className="km-text-strong"> into tables.</span>
            <br />
            <span className="km-text-strong">Websites built for </span>
            <span className="text-brand">restaurants.</span>
          </h1>
          <p
            className="reveal text-lg md:text-xl km-text-muted mb-12 max-w-xl leading-relaxed"
            style={{ transitionDelay: '200ms' }}
          >
            KM Web Design is a small Las Vegas team creating custom restaurant websites that make
            menus easier to browse, reservations easier to book, and your business easier to find.
          </p>
          <div className="reveal flex flex-col gap-6" style={{ transitionDelay: '300ms' }}>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="km-button km-button-primary group">Book a discovery call</a>
              <a href="#projects" className="km-button km-button-secondary">
                Explore Portfolio
              </a>
            </div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] km-text-soft">
              Tell us about your restaurant — we reply within one business day
            </p>
          </div>
        </div>
        <div className="reveal-right km-panel p-10 relative card-lift live-card" data-live-card>
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-brand" />
          <div className="absolute top-0 left-0 w-[2px] h-12 bg-brand" />
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-brand" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest km-text-strong">
              What your new site can do
            </span>
          </div>
          <h2 className="text-2xl font-display font-medium mb-8 leading-tight">
            A practical digital front door for your restaurant.
          </h2>
          <ul className="space-y-5 text-sm km-text-muted">
            {availability.map((item) => (
              <li key={item} className="flex items-start gap-4 group/item">
                <span className="mt-1.5 w-1.5 h-1.5 border border-brand/40 group-hover/item:bg-brand group-hover/item:border-brand transition-colors flex-shrink-0" />
                <span className="group-hover/item:text-brand transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
