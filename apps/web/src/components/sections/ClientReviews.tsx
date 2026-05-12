const reviews = [
  {
    label: 'Fast turnaround',
    quote:
      'Swap this with a real client quote about speed, clarity, or delivery. The carousel is built and ready for production copy.',
    name: 'Client Name',
    role: 'Business / Role',
  },
  {
    label: 'Clear process',
    quote:
      'Use this card for feedback about communication, clean handoff, or how smooth the project felt from start to launch.',
    name: 'Client Name',
    role: 'Founder / Owner',
  },
  {
    label: 'Better results',
    quote:
      'Drop in a short review that highlights stronger conversions, a cleaner brand presence, or a faster website experience.',
    name: 'Client Name',
    role: 'Marketing Lead',
  },
  {
    label: 'Reliable partner',
    quote: 'Dependable timelines, quick revisions, and confidence after launch.',
    name: 'Client Name',
    role: 'Startup Team',
  },
  {
    label: 'Modern build',
    quote: 'Polished design, mobile responsiveness, and overall quality of the finished site.',
    name: 'Client Name',
    role: 'Creative Brand',
  },
];

export function ClientReviews() {
  return (
    <section id="reviews" className="py-32 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Client Reviews
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            Fast-moving social proof.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mt-6">
            Auto-sliding review cards. Hover to pause. Replace the starter copy with real
            testimonials anytime.
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
                      <div
                        className="flex items-center gap-1 text-brand"
                        aria-label="5 star review"
                      >
                        ★★★★★
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
