const CMS_URL = import.meta.env.PUBLIC_CMS_URL || 'http://localhost:3001';

export interface PayloadPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: any;
  contentMarkdown?: string;
  date: string;
  readTime?: string;
  tags?: { tag: string }[];
  cover?: { url: string; alt?: string };
  status: 'draft' | 'published';
}

export interface PayloadProject {
  id: string;
  title: string;
  type?: string;
  tech?: string;
  description?: string;
  link?: string;
  image?: { url: string; alt?: string };
  order?: number;
}

export async function getPosts(): Promise<PayloadPost[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/posts?where[status][equals]=published&sort=-date&limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs;
  } catch { return []; }
}

export async function getPostBySlug(slug: string): Promise<PayloadPost | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/posts?where[slug][equals]=${slug}&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs[0] || null;
  } catch { return null; }
}

export async function getProjects(): Promise<PayloadProject[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/projects?sort=order&limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs;
  } catch { return []; }
}
