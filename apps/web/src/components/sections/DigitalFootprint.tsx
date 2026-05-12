const platforms = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/kurtanthonymorales/' },
  { name: 'GitHub', url: 'https://github.com/kurtmorales-tech' },
  {
    name: 'Google Dev',
    url: 'https://developers.google.com/profile/u/kurtmorales-developer',
  },
  {
    name: 'Google Skills',
    url: 'https://www.skills.google/public_profiles/e568df3b',
  },
  { name: 'MS Learn', url: 'https://learn.microsoft.com/' },
  { name: 'Facebook', url: 'https://www.facebook.com/kamhypeofficial' },
  { name: 'X', url: 'https://x.com/xkamhype' },
];

export function DigitalFootprint() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-24 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Network
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand">
            Presence across platforms.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {platforms.map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="reveal flex flex-col items-center justify-center p-8 bg-white border border-gray-100 group card-lift text-center"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="mb-5 text-gray-300 group-hover:text-brand transition-all duration-300 group-hover:scale-110">
                ●
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand/80 transition-colors duration-300">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
