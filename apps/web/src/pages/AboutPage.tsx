import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

const principles = [
  {
    num: '01',
    title: 'Clarity over complexity',
    body: "Simple, readable code and simple UIs. If it takes 10 lines, it shouldn't take 100. Every element on a page earns its place.",
  },
  {
    num: '02',
    title: 'Speed is a feature',
    body: "Sub-second load times aren't optional — they're the standard. I optimize for performance from day one, not as an afterthought.",
  },
  {
    num: '03',
    title: 'Own what you ship',
    body: "I stay with projects after launch. Bug fixes, CMS training, performance monitoring — I treat client sites like they're my own.",
  },
];

const credentials = [
  {
    org: 'Google',
    label: 'Google Developer Profile',
    url: 'https://developers.google.com/profile/u/kurtmorales-developer',
    badge: '🔵',
  },
  {
    org: 'Google',
    label: 'Google Skills Boost',
    url: 'https://www.skills.google/public_profiles/e568df3b',
    badge: '🟢',
  },
  { org: 'Microsoft', label: 'Microsoft Learn', url: 'https://learn.microsoft.com/', badge: '🟦' },
  {
    org: 'GitHub',
    label: 'Open Source — kurtmorales-tech',
    url: 'https://github.com/kurtmorales-tech',
    badge: '⚫',
  },
];

export function AboutPage() {
  useSeo(
    'About — KurtMorales',
    'Kurt Anthony Morales — Las Vegas freelance web designer and developer building clean, fast websites for small businesses and service providers.',
    { canonical: '/about' },
  );

  return (
    <main id="main-content">
      <section className="pt-32 pb-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-20 items-start">
          <div>
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6 reveal">
              About
            </span>
            <h1
              className="text-4xl md:text-[4.5rem] font-display font-medium leading-[0.92] tracking-tight mb-8 text-brand reveal"
              style={{ transitionDelay: '100ms' }}
            >
              Building the web,
              <br />
              one pixel at a time.
            </h1>
            <p
              className="text-gray-500 text-lg leading-relaxed max-w-xl reveal"
              style={{ transitionDelay: '200ms' }}
            >
              I&apos;m Kurt Anthony Morales — a freelance web designer and developer based in Las
              Vegas, NV. I specialize in building clean, fast, conversion-focused websites for small
              businesses, service providers, and startups.
            </p>
          </div>
          <div className="reveal-right border border-gray-200 p-10 bg-white/80 backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-12 h-[2px] bg-brand" />
            <div className="absolute top-0 left-0 w-[2px] h-12 bg-brand" />
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Available for Projects
              </span>
            </div>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>📍 Las Vegas, Nevada</li>
              <li>💼 Freelance since 2025</li>
              <li>🌐 Remote-first, globally active</li>
              <li>⚡ Cloudflare &amp; Vercel deployment</li>
              <li>🎓 Google &amp; Microsoft certified</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-24 border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-20 items-start">
          <div className="reveal-left">
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
              My Story
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight text-brand">
              From side projects to client work.
            </h2>
          </div>
          <div className="space-y-6 text-gray-500 leading-relaxed reveal">
            <p>
              I started building for the web out of necessity — I wanted things to exist that
              didn&apos;t. That curiosity turned into a skill set, and that skill set turned into a
              studio.
            </p>
            <p>
              Today, I work with local businesses and founders to build websites that actually
              perform. Not just visually — but in search rankings, load times, and conversion rates.
            </p>
            <p>
              My approach is simple: listen first, build second. Clean code, modern stack, and zero
              bloat.
            </p>
            <p>
              When I&apos;m not building, I&apos;m learning through certifications, open-source
              work, and staying current with AI tooling.
            </p>
          </div>
        </div>
      </section>
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16 reveal-left">
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
              Principles
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight text-brand">
              How I work.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {principles.map((item, index) => (
              <article
                key={item.num}
                className="reveal group relative bg-white border border-gray-100 p-10 card-lift overflow-hidden"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="absolute -top-4 -right-2 text-[8rem] font-display font-bold text-gray-50 leading-none select-none group-hover:text-brand/5 transition-colors duration-500">
                  {item.num}
                </span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-black tracking-tight group-hover:text-brand transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.body}</p>
                  <div className="mt-8 h-[2px] w-0 bg-brand group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16 reveal-left">
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
              Credentials
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight text-brand">
              Certifications & learning.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {credentials.map((item, index) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="reveal group flex items-center gap-6 p-8 bg-white border border-gray-100 card-lift"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="text-2xl">{item.badge}</span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    {item.org}
                  </p>
                  <p className="font-bold text-black group-hover:text-brand transition-colors">
                    {item.label}
                  </p>
                </div>
                <span className="text-gray-200 group-hover:text-brand ml-auto">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="reveal text-4xl md:text-6xl font-display font-medium leading-tight mb-8">
            Ready to start a project?
          </h2>
          <p
            className="reveal text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ transitionDelay: '100ms' }}
          >
            Let&apos;s talk about your goals, timeline, and how I can help your business grow
            online.
          </p>
          <div
            className="reveal flex flex-wrap justify-center gap-4"
            style={{ transitionDelay: '200ms' }}
          >
            <a href="mailto:email@kurtmorales.com" className="km-button km-button-primary">
              Start a Conversation
            </a>
            <Link to="/#projects" className="km-button km-button-dark">
              View My Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
