import { useEffect, useState } from 'react';
import { Projects } from '../components/sections/Projects';
import { getProjects } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { Project } from '../types';

export function ProjectsPage() {
  useSeo('Projects — KurtMorales', 'Selected projects and digital experiments from KurtMorales.', {
    canonical: '/projects',
  });
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <main id="main-content" className="pt-24">
      <Projects projects={projects} />
    </main>
  );
}
