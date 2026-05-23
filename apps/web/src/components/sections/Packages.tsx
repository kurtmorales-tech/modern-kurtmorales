const packages = [
  {
    title: 'Starter Website',
    desc: 'For personal brands and small service businesses that need a polished online presence.',
    items: ['1–3 core pages', 'Responsive design', 'Basic SEO setup', 'Contact CTA', 'Deployment support'],
  },
  {
    title: 'Growth Website',
    desc: 'For businesses that need stronger positioning, service pages, and conversion-focused structure.',
    items: [
      '4–8 pages',
      'Conversion-focused copy structure',
      'Portfolio or gallery section',
      'Performance optimization',
      'Analytics-ready setup',
    ],
    featured: true,
  },
  {
    title: 'Custom Build',
    desc: 'For dashboards, booking flows, calculators, directories, and advanced business tools.',
    items: [
      'Custom interface design',
      'TypeScript-friendly architecture',
      'API/integration planning',
      'Admin or workflow logic',
      'Launch and iteration support',
    ],
  },
];

export function Packages() {
  return (
    <section id="packages" className="py-32 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="max-w-2xl mb-20 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Packages
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            Flexible starting points for growing businesses.
          </h2>
          <p className="mt-6 text-gray-500 leading-relaxed">
            Final pricing depends on scope, content, integrations, and timeline. These tracks make
            it easier to choose the right starting point.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((item, index) => (
            <article
              key={item.title}
              className={`reveal relative p-8 border card-lift ${
                item.featured ? 'bg-brand text-white border-brand' : 'bg-white border-gray-100'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item.featured && (
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest bg-white text-brand px-3 py-1.5">
                  Popular
                </span>
              )}
              <h3 className={`text-2xl font-bold mb-4 ${item.featured ? 'text-white' : 'text-black'}`}>
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-8 ${item.featured ? 'text-white/80' : 'text-gray-500'}`}>
                {item.desc}
              </p>
              <ul className="space-y-4">
                {item.items.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                    <span
                      className={`mt-1 h-1.5 w-1.5 flex-shrink-0 ${
                        item.featured ? 'bg-white' : 'bg-brand'
                      }`}
                    />
                    <span className={item.featured ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
