const reviews = [
  {
    label: 'Fast turnaround',
    quote:
      'Launch-focused builds with clean milestones, quick feedback loops, and production-ready delivery.',
    name: 'Built for',
    role: 'Small businesses & founders',
  },
  {
    label: 'Clear process',
    quote:
      'Every project starts with goals, audience, pages, content needs, and conversion actions before design begins.',
    name: 'Built for',
    role: 'Structured project planning',
  },
  {
    label: 'Better results',
    quote:
      'Pages are designed around trust, speed, mobile usability, and clear calls-to-action—not just visuals.',
    name: 'Built for',
    role: 'Lead generation & growth',
  },
  {
    label: 'Reliable partner',
    quote:
      'Deployment, responsive QA, performance checks, and post-launch support keep handoff simple.',
    name: 'Built for',
    role: 'Long-term website ownership',
  },
  {
    label: 'Modern build',
    quote:
      'TypeScript-friendly workflows, Cloudflare/Vercel hosting, reusable components, and SEO-conscious structure.',
    name: 'Built for',
    role: 'Scalable digital foundations',
  },
];

export function ClientReviews() {
  return (
    <section id="reviews" className="py-32 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Client Proof
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            Built for clear handoff, faster launches, and measurable business value.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mt-6">
            Real testimonials can be added as projects go live. For now, these cards highlight the
            outcomes and working experience clients can expect.
          </p>
        </div>
        <div className="reviews-shell reveal relative overflow-hidden">
          <div className="reviews-fade reviews-fade-left" aria-hidden="true" />
          <div className="reviews-fade reviews-fade-right" aria-hidden="true" />
          <div className="reviews-marquee">
            {[0, 1].map((duplicate) => (
              <div
                className="reviews-group"
                aria-hidden={duplicate === 1 ? 'true' : undefined}
                key={duplicate}
              >
                {reviews.map((review) => (
                  <article
                    key={`${duplicate}-${review.label}`}
                    className="w-[19rem] md:w-[22rem] flex-shrink-0 bg-white border border-gray-100 p-8 card-lift"
                  >
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {review.label}
                      </span>
                      <div className="text-brand text-lg" aria-hidden="true">
                        ✦
                      </div>
                    </div>
                    <p className="text-base leading-relaxed text-gray-600 mb-8">“{review.quote}”</p>
                    <div className="pt-6 border-t border-gray-100">
                      <p className="text-sm font-bold text-black">{review.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400 mt-2">
                        {review.role}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
