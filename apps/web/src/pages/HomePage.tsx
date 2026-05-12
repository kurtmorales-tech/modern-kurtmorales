import { useEffect, useState } from 'react';
import { DigitalFootprint } from '../components/sections/DigitalFootprint';
import { ClientReviews } from '../components/sections/ClientReviews';
import { Hero } from '../components/sections/Hero';
import { Metrics } from '../components/sections/Metrics';
import { Projects } from '../components/sections/Projects';
import { Services } from '../components/sections/Services';
import { Skills } from '../components/sections/Skills';
import { Templates } from '../components/sections/Templates';
import { getProjects, getTemplates } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { Project, Template } from '../types';

export function HomePage() {
  useSeo(
    'KurtMorales | Web Designer & Developer Las Vegas NV',
    'KurtMorales — Las Vegas freelance web designer & developer. I build fast, clean, SEO-optimized websites for small businesses, service providers, and startups. Cloudflare Pages and React.',
    { canonical: '/' },
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getProjects().then((items) => setProjects(items.slice(0, 6)));
    getTemplates().then((items) => setTemplates(items.slice(0, 3)));
  }, []);

  return (
    <main id="main-content">
      <Hero />
      <Metrics />
      <Services />
      <ClientReviews />
      <Projects projects={projects} />
      <Templates templates={templates} />
      <Skills />
      <DigitalFootprint />
      <section id="contact" className="relative py-32 bg-gray-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
                Open to New Projects
              </span>
            </span>
          </div>
          <h2
            className="reveal text-4xl md:text-6xl font-display font-medium leading-tight mb-8"
            style={{ transitionDelay: '100ms' }}
          >
            Let&apos;s build something
            <br />
            <span className="text-brand-light">great together.</span>
          </h2>
          <p
            className="reveal text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ transitionDelay: '200ms' }}
          >
            Ready to start a project? Reach out and let&apos;s discuss how I can help grow your
            online presence.
          </p>
          <div
            className="reveal flex flex-wrap justify-center gap-4"
            style={{ transitionDelay: '300ms' }}
          >
            <a href="mailto:email@kurtmorales.com" className="km-button km-button-primary group">
              Start a Conversation <span aria-hidden>→</span>
            </a>
            <a
              href="https://www.linkedin.com/in/kurtanthonymorales/"
              target="_blank"
              rel="noreferrer"
              className="km-button km-button-dark"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
