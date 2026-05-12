export function Hero() {
  const availability = [
    'Las Vegas based, globally active',
    'Cloudflare & Vercel deployment',
    'Modern TypeScript architecture',
    'User-centric interface design',
  ];

  return (
    <section
      id="home"
      className="relative pt-32 pb-40 border-b border-gray-100 mesh-gradient grain overflow-hidden"
    >
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand/3 rounded-full blur-2xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-20 items-center relative z-10">
        <div>
          <div className="reveal inline-flex items-center gap-3 mb-8 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
              Available for Projects
            </span>
          </div>
          <h1
            className="reveal text-5xl md:text-[5.5rem] font-display font-medium leading-[0.92] tracking-tight mb-10"
            style={{ transitionDelay: '100ms' }}
          >
            <span className="text-brand">Purposeful</span>
            <span className="text-gray-900"> design.</span>
            <br />
            <span className="text-gray-900">Fast </span>
            <span className="text-brand">performance.</span>
          </h1>
          <p
            className="reveal text-lg md:text-xl text-gray-500 mb-12 max-w-xl leading-relaxed"
            style={{ transitionDelay: '200ms' }}
          >
            KurtMorales builds high-performance web experiences that focus on clarity, conversion,
            and long-term business growth.
          </p>
          <div className="reveal flex flex-col gap-6" style={{ transitionDelay: '300ms' }}>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:email@kurtmorales.com" className="km-button km-button-primary group">
                Let&apos;s Talk Projects <span aria-hidden>→</span>
              </a>
              <a href="#projects" className="km-button km-button-secondary">
                Explore Portfolio
              </a>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Preferred contact: Email or Social Media
            </p>
          </div>
        </div>
        <div
          className="reveal-right border border-gray-200 p-10 relative bg-white/80 backdrop-blur-sm card-lift live-card"
          data-live-card
        >
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-brand" />
          <div className="absolute top-0 left-0 w-[2px] h-12 bg-brand" />
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
              Current Availability
            </span>
          </div>
          <h2 className="text-2xl font-display font-medium mb-8 leading-tight">
            Delivering clean solutions for local & global businesses.
          </h2>
          <ul className="space-y-5 text-sm text-gray-500">
            {availability.map((item) => (
              <li key={item} className="flex items-start gap-4 group/item">
                <span className="mt-1.5 w-1.5 h-1.5 border border-brand/40 group-hover/item:bg-brand group-hover/item:border-brand transition-colors flex-shrink-0" />
                <span className="group-hover/item:text-gray-700 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
