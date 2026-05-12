import type { Post, Project, Template, Upload } from '../types';
import { fallbackPosts, fallbackProjects, fallbackTemplates } from './fallback';

export function getBackendBaseURL(): string {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.PUBLIC_BACKEND_URL ||
    import.meta.env.BACKEND_URL ||
    'http://localhost:3001'
  ).replace(/\/$/, '');
}

const API_BASE = getBackendBaseURL();

type ListResponse<T> = { docs?: T[] };

type UploadKey = 'cover' | 'image' | 'thumbnail';

export function apiURL(path: string, params?: Record<string, string | number>): string {
  const url = new URL(path, API_BASE);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function isUpload(value: unknown): value is Upload {
  return Boolean(value && typeof value === 'object' && 'url' in value);
}

export function absolutizeUpload<T extends Record<string, unknown>>(doc: T): T {
  const uploadKeys: UploadKey[] = ['cover', 'image', 'thumbnail'];

  for (const key of uploadKeys) {
    const upload = doc[key];
    if (isUpload(upload) && typeof upload.url === 'string' && upload.url.startsWith('/')) {
      upload.url = `${API_BASE}${upload.url}`;
    }
  }

  return doc;
}

async function fetchList<T>(path: string, params?: Record<string, string | number>): Promise<T[]> {
  try {
    const res = await fetch(apiURL(path, params));
    if (!res.ok) return [];
    const data = (await res.json()) as ListResponse<T>;
    return (data.docs ?? []).map((doc) =>
      typeof doc === 'object' && doc !== null
        ? (absolutizeUpload(doc as Record<string, unknown>) as T)
        : doc,
    );
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  const posts = await fetchList<Post>('/api/posts', {
    'where[status][equals]': 'published',
    sort: '-date',
    limit: 150,
  });
  return posts.length ? posts : fallbackPosts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      apiURL('/api/posts', {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        limit: 1,
      }),
    );
    if (!res.ok) return fallbackPosts.find((p) => p.slug === slug) ?? null;
    const data = (await res.json()) as ListResponse<Post>;
    const post = data.docs?.[0];
    return post
      ? (absolutizeUpload(post as unknown as Record<string, unknown>) as Post)
      : (fallbackPosts.find((p) => p.slug === slug) ?? null);
  } catch {
    return fallbackPosts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const items = await fetchList<Project>('/api/projects', {
    sort: 'order',
    limit: 50,
  });
  return items.length ? items : fallbackProjects;
}

export async function getTemplates(): Promise<Template[]> {
  const items = await fetchList<Template>('/api/templates', {
    sort: 'order',
    limit: 50,
  });
  return items.length ? items : fallbackTemplates;
}

export async function getSubscribers(): Promise<unknown[]> {
  return fetchList('/api/subscribers', { limit: 1000 });
}

export async function subscribe(email: string, name?: string): Promise<boolean> {
  try {
    const res = await fetch(apiURL('/api/subscribers'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitContact(payload: {
  name?: string;
  email?: string;
  project?: string;
  budget?: string;
  message?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(apiURL('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
