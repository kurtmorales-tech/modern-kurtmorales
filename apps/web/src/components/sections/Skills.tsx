const skills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'TypeScript',
  'React',
  'Vite',
  'Tailwind CSS',
  'Cloudflare Pages',
  'Cloudflare Workers',
  'Google Cloud',
  'GitHub',
  'Linux',
  'AI Integration',
  'SEO Fundamentals',
  'Node.js',
  'Bun',
  'SQLite',
];

export function Skills() {
  return (
    <section id="skills" className="py-24 overflow-hidden border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
        <div className="reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">
            Toolkit
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight mb-6 text-brand">
            Architectural foundations.
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8 text-sm">
            Focusing on practical tools that help businesses launch quickly: clean interfaces,
            responsive frontends, and cloud deployment workflows.
          </p>
          <div className="flex items-center gap-4 text-gray-300">
            <span>☁</span>
            <span>⌘</span>
            <span>◎</span>
          </div>
        </div>
        <div className="reveal-right">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={skill}
                className="px-4 py-2 bg-white text-gray-600 font-bold text-[10px] uppercase tracking-widest border border-gray-100 transition-all duration-300 hover:bg-brand hover:text-white hover:border-brand hover:-translate-y-0.5 cursor-default"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-8 relative overflow-hidden py-4 border-t border-gray-100">
            <div className="flex gap-8 marquee-track whitespace-nowrap">
              {[...skills, ...skills].map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
