// API client — reads from Cloudflare Pages Functions + D1
// Falls back to static data if API is unavailable (build time)

const API = import.meta.env.PUBLIC_API_URL || '';  // empty = same origin (Pages Functions)

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime?: string;
  tags?: { tag: string }[];
  cover?: { url: string; alt?: string };
  status: 'draft' | 'published';
}

export interface Project {
  id: string;
  title: string;
  type?: string;
  tech?: string;
  description?: string;
  link?: string;
  image?: { url: string; alt?: string };
  order?: number;
}

// Keep PayloadCMS interface aliases for backward compat
export type PayloadPost = Post;
export type PayloadProject = Project;

export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/api/posts?status=published&limit=50`);
    if (!res.ok) return [];
    const data = await res.json() as { docs: Post[] };
    return data.docs ?? [];
  } catch { return []; }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API}/api/posts/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json() as Post;
  } catch { return null; }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API}/api/projects`);
    if (!res.ok) return [];
    const data = await res.json() as { docs: Project[] };
    return data.docs ?? [];
  } catch { return []; }
}
