import type { ContactMessage, Newsletter, Post, Project, Subscriber, Template, Upload } from '../types';
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
    if (isUpload(upload) && typeof (upload as any).url === 'string' && (upload as any).url.startsWith('/')) {
      (upload as any).url = `${API_BASE}${(upload as any).url}`;
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

// ---- Public APIs ----

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

// ---- Admin API ----

const ADMIN_TOKEN_KEY = 'km-admin-secret';

function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function adminHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function adminLogin(secret: string): Promise<boolean> {
  try {
    const res = await fetch(apiURL('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token?: string };
    if (data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(apiURL(path), {
      ...options,
      headers: { ...adminHeaders(), ...options?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// Posts admin
export async function adminListPosts() {
  const data = await adminFetch<{ docs: Post[] }>('/api/admin/posts', { method: 'GET' });
  return data?.docs ?? [];
}

export async function adminCreatePost(body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Post }>('/api/admin/posts', { method: 'POST', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminUpdatePost(id: string, body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Post }>(`/api/admin/posts/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminDeletePost(id: string) {
  const data = await adminFetch<{ success: boolean }>(`/api/admin/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return data?.success ?? false;
}

// Projects admin
export async function adminListProjects() {
  const data = await adminFetch<{ docs: Project[] }>('/api/admin/projects', { method: 'GET' });
  return data?.docs ?? [];
}

export async function adminCreateProject(body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Project }>('/api/admin/projects', { method: 'POST', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminUpdateProject(id: string, body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Project }>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminDeleteProject(id: string) {
  const data = await adminFetch<{ success: boolean }>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return data?.success ?? false;
}

// Templates admin
export async function adminListTemplates() {
  const data = await adminFetch<{ docs: Template[] }>('/api/admin/templates', { method: 'GET' });
  return data?.docs ?? [];
}

export async function adminCreateTemplate(body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Template }>('/api/admin/templates', { method: 'POST', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminUpdateTemplate(id: string, body: Record<string, unknown>) {
  const data = await adminFetch<{ doc: Template }>(`/api/admin/templates/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) });
  return data?.doc ?? null;
}

export async function adminDeleteTemplate(id: string) {
  const data = await adminFetch<{ success: boolean }>(`/api/admin/templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return data?.success ?? false;
}

// Subscribers admin — uses the same public endpoint with higher limit, plus individual delete
export async function adminListSubscribers() {
  const data = await adminFetch<{ docs: Subscriber[] }>('/api/subscribers', { method: 'GET', limit: 10000 });
  return data?.docs ?? [];
}

export async function adminDeleteSubscriber(id: string) {
  const data = await adminFetch<{ success: boolean }>(`/api/subscribers/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return data?.success ?? false;
}

// Contact messages admin
export async function adminListContactMessages() {
  const data = await adminFetch<{ docs: ContactMessage[] }>('/api/contact/messages', { method: 'GET' });
  return data?.docs ?? [];
}

export async function adminGetContactMessage(id: string) {
  const data = await adminFetch<{ doc: ContactMessage }>(`/api/contact/messages/${encodeURIComponent(id)}`, { method: 'GET' });
  return data?.doc ?? null;
}

export async function adminDeleteContactMessage(id: string) {
  const data = await adminFetch<{ success: boolean }>(`/api/contact/messages/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return data?.success ?? false;
}

// Newsletters admin
export async function adminListNewsletters() {
  const data = await adminFetch<{ docs: Newsletter[] }>('/api/newsletters/list', { method: 'GET' });
  return data?.docs ?? [];
}

export async function adminDeleteNewsletter(id: string) {
  const data = await adminFetch<{ success: boolean }>('/api/newsletters', { method: 'DELETE', body: JSON.stringify({ id }) });
  return data?.success ?? false;
}