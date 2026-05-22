import { KMImage } from '../KMImage';
import { Link } from 'react-router-dom';
import type { Template } from '../../types';

export function Templates({
  templates,
  showBrowseLink = true,
}: {
  templates: Template[];
  showBrowseLink?: boolean;
}) {
  return (
    <section id="templates" className="py-32 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-24 reveal-left">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
            Templates
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
            Ready-to-use website templates.
          </h2>
          <p className="mt-6 text-gray-500 leading-relaxed">
            Professionally designed templates to kickstart your next project. Dynamic previews,
            clean code, and full documentation included.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => {
            return (
              <div
                key={template.id}
                className="reveal group relative bg-white border border-gray-100 overflow-hidden card-lift"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {template.featured && (
                  <span className="absolute top-4 right-4 z-10 text-[9px] font-black uppercase tracking-widest bg-brand text-white px-3 py-1.5">
                    Featured
                  </span>
                )}
                <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                  <KMImage
                    src={template.thumbnail}
                    alt={template.title}
                    aspect="aspect-[4/3]"
                    width={600}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {template.tech && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5">
                        {template.tech}
                      </span>
                    )}
                    {template.price !== undefined && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand/70">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black tracking-tight group-hover:text-brand transition-colors duration-300">
                    {template.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {template.demoUrl && (
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black uppercase tracking-widest text-brand hover:text-brand-dark transition-colors duration-300 flex items-center gap-2"
                      >
                        Live Demo <span aria-hidden>→</span>
                      </a>
                    )}
                    {template.sourceUrl && (
                      <a
                        href={template.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand transition-colors duration-300"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>
        {showBrowseLink && (
          <div className="text-center mt-16">
            <Link
              to="/templates"
              className="inline-flex items-center gap-3 px-10 py-5 border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-300 active:scale-[0.97]"
            >
              Browse All Templates <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
