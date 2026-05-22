const steps = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Define your goals, audience, services, competitors, must-have pages, and the primary action visitors should take.',
  },
  {
    num: '02',
    title: 'Structure',
    desc: 'Map the experience, shape conversion-focused content, and set a visual direction that feels clear and trustworthy.',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Develop responsive pages with fast-loading assets, SEO basics, accessible markup, and clean reusable components.',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Test across devices, connect contact flows, deploy to production, and hand off the next steps for confident ownership.',
  },
];

export function Process() {
  return (
    <section id="process" className="py-32 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-20 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Process
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            A simple path from idea to launch.
          </h2>
          <p className="mt-6 text-gray-500 leading-relaxed">
            Every build is organized around clarity: what you need, what your visitors need, and
            what has to happen before the site goes live.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="reveal bg-white border border-gray-100 p-8 card-lift relative overflow-hidden"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-brand/70">
                {step.num}
              </span>
              <h3 className="text-xl font-bold text-black mt-6 mb-4">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 origin-left group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
