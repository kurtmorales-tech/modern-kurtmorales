const services = [
  {
    title: 'Brand Websites',
    desc: 'High-clarity interfaces designed to build trust and present your services effectively.',
    num: '01',
  },
  {
    title: 'Conversion Pages',
    desc: 'Goal-oriented landing pages optimized for maximum lead acquisition and sales.',
    num: '02',
  },
  {
    title: 'Custom Tools',
    desc: 'Bespoke dashboards, booking systems, and interactive calculators for business workflows.',
    num: '03',
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-24 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Expertise
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand">
            Digital products for service providers.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="reveal group relative bg-white border border-gray-100 p-10 card-lift overflow-hidden"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span className="absolute -top-4 -right-2 text-[8rem] font-display font-bold text-gray-50 leading-none select-none group-hover:text-brand/5 transition-colors duration-500">
                {service.num}
              </span>
              <div className="relative z-10">
                <div className="mb-8 p-4 border border-gray-100 w-fit group-hover:border-brand/30 group-hover:bg-brand/5 transition-all duration-300 text-gray-400 group-hover:text-brand">
                  ✦
                </div>
                <h3 className="text-xl font-bold mb-4 text-black tracking-tight group-hover:text-brand transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">{service.desc}</p>
                <div className="mt-8 h-[2px] w-0 bg-brand group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
