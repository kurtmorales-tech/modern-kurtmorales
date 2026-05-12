import { useEffect, useState } from 'react';
import { Templates } from '../components/sections/Templates';
import { getTemplates } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { Template } from '../types';

export function TemplatesPage() {
  useSeo(
    'Website Templates | KurtMorales',
    'Ready-to-use website templates for startups, SaaS, ecommerce, and portfolios. Built with modern tech stack.',
    { canonical: '/templates' },
  );
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  return (
    <main id="main-content" className="pt-24">
      <Templates templates={templates} showBrowseLink={false} />
    </main>
  );
}
