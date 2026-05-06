// PayloadCMS API client — web reads CMS content at build/dev time.
// Falls back to static data in pages when CMS is unavailable.

const CMS_URL = (
  import.meta.env.PUBLIC_CMS_URL ||
  import.meta.env.PUBLIC_PAYLOAD_URL ||
  "http://localhost:3001"
).replace(/\/$/, "");

export interface Post {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content?: unknown;
  contentMarkdown?: string;
  date: string;
  readTime?: string;
  tags?: { id?: string | number; tag: string }[];
  cover?: { url: string; alt?: string } | string | number;
  status: "draft" | "published";
}

export interface Project {
  id: string | number;
  title: string;
  type?: string;
  tech?: string;
  description?: string;
  link?: string;
  image?: { url: string; alt?: string } | string | number;
  order?: number;
}

export interface Template {
  id: string | number;
  title: string;
  description: string;
  thumbnail?: { url: string; alt?: string } | string | number;
  demoUrl?: string;
  sourceUrl?: string;
  tech?: string;
  tags?: { id?: string | number; tag: string }[];
  featured?: boolean;
  price?: number;
  order?: number;
}

export interface Newsletter {
  id: string | number;
  title: string;
  subject: string;
  preheader?: string;
  content?: unknown;
  contentMarkdown?: string;
  status: "draft" | "sending" | "sent";
  sentAt?: string;
  recipientsCount?: number;
}

export interface Subscriber {
  id: string | number;
  email: string;
  name?: string;
  status: "subscribed" | "unsubscribed";
}

type PayloadList<T> = {
  docs?: T[];
};

// Keep PayloadCMS interface aliases for backward compat
export type PayloadPost = Post;
export type PayloadProject = Project;
export type PayloadTemplate = Template;

function cmsURL(path: string, params?: Record<string, string | number>) {
  const url = new URL(path, CMS_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function absolutizeUpload<T extends Post | Project | Template>(doc: T): T {
  const uploadKeys = ["cover", "image", "thumbnail"] as const;

  for (const key of uploadKeys) {
    const upload = doc[key as keyof T];

    if (
      upload &&
      typeof upload === "object" &&
      "url" in upload &&
      typeof upload.url === "string" &&
      upload.url.startsWith("/")
    ) {
      upload.url = `${CMS_URL}${upload.url}`;
    }
  }

  return doc;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      cmsURL("/api/posts", {
        "where[status][equals]": "published",
        sort: "-date",
        limit: 150,
        depth: 1,
      }),
    );

    if (!res.ok) return [];

    const data = (await res.json()) as PayloadList<Post>;
    return (data.docs ?? []).map(absolutizeUpload);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      cmsURL("/api/posts", {
        "where[slug][equals]": slug,
        "where[status][equals]": "published",
        limit: 1,
        depth: 1,
      }),
    );

    if (!res.ok) return null;

    const data = (await res.json()) as PayloadList<Post>;
    const post = data.docs?.[0];

    return post ? absolutizeUpload(post) : null;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      cmsURL("/api/projects", { sort: "order", limit: 50, depth: 1 }),
    );

    if (!res.ok) return [];

    const data = (await res.json()) as PayloadList<Project>;
    return (data.docs ?? []).map(absolutizeUpload);
  } catch {
    return [];
  }
}

export async function getTemplates(): Promise<Template[]> {
  try {
    const res = await fetch(
      cmsURL("/api/templates", { sort: "order", limit: 50, depth: 1 }),
    );

    if (!res.ok) return [];

    const data = (await res.json()) as PayloadList<Template>;
    return (data.docs ?? []).map(absolutizeUpload);
  } catch {
    return [];
  }
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await fetch(
      cmsURL("/api/subscribers", { limit: 1000, depth: 1 }),
    );

    if (!res.ok) return [];

    const data = (await res.json()) as PayloadList<Subscriber>;
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export async function getNewsletters(): Promise<Newsletter[]> {
  try {
    const res = await fetch(
      cmsURL("/api/newsletters", { sort: "-createdAt", limit: 50, depth: 1 }),
    );

    if (!res.ok) return [];

    const data = (await res.json()) as PayloadList<Newsletter>;
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export async function getNewsletterById(
  id: string | number,
): Promise<Newsletter | null> {
  try {
    const res = await fetch(cmsURL(`/api/newsletters/${id}`, { depth: 2 }));

    if (!res.ok) return null;

    const data = (await res.json()) as { doc?: Newsletter };
    return data.doc ?? null;
  } catch {
    return null;
  }
}

export async function subscribe(
  email: string,
  name?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(cmsURL("/api/subscribers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { errors?: { message: string }[] };
      return {
        success: false,
        error: data.errors?.[0]?.message ?? "Subscription failed",
      };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
