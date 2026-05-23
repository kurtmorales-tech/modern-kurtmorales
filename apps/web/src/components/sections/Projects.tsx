import type { Project } from '../../types';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-32 km-surface-tint">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-24 reveal-left">
          <span className="font-mono km-text-soft font-bold text-[10px] tracking-widest uppercase block mb-6">
            $ portfolio
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            Selected works and digital experiments.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.link ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="reveal group relative km-panel p-10 card-lift live-card block overflow-hidden"
              data-live-card
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="absolute top-6 right-6 font-mono text-[10px] font-black km-text-soft tabular-nums group-hover:text-brand/60 transition-colors duration-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest km-text-muted bg-[var(--km-surface-muted)] px-3 py-1.5 group-hover:bg-brand/10 group-hover:text-brand transition-all duration-300">
                    {project.type}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand/50">
                    {project.tech}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 km-text-strong tracking-tight group-hover:text-brand transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="km-text-muted text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest km-text-soft group-hover:text-brand transition-all duration-300">
                  <span>View Project</span>
                  <span aria-hidden>→</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
