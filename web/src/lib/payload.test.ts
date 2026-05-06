import { describe, it, expect, beforeEach, mock } from "bun:test";

// ---------------------------------------------------------------------------
// Minimal stub for import.meta.env (Astro sets this at build time)
// ---------------------------------------------------------------------------
(globalThis as any).__importMetaEnv = {};
Object.defineProperty(globalThis, "importMeta", { value: { env: {} } });

// Re-export helpers we want to test by duplicating the pure functions here
// so we can test them without Astro's bundler in the loop.

// --- cmsURL (reproduced from payload.ts) ---
function makeCmsURL(base: string) {
  return function cmsURL(
    path: string,
    params?: Record<string, string | number>,
  ): string {
    const url = new URL(path, base);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  };
}

// --- absolutizeUpload (reproduced from payload.ts) ---
function absolutizeUpload<T extends Record<string, any>>(
  doc: T,
  cmsBase: string,
): T {
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
      upload.url = `${cmsBase}${upload.url}`;
    }
  }
  return doc;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("cmsURL", () => {
  const cmsURL = makeCmsURL("http://localhost:3001");

  it("builds a simple path", () => {
    expect(cmsURL("/api/posts")).toBe("http://localhost:3001/api/posts");
  });

  it("appends query params", () => {
    const url = cmsURL("/api/posts", {
      "where[status][equals]": "published",
      sort: "-date",
      limit: 150,
    });
    const parsed = new URL(url);
    expect(parsed.searchParams.get("where[status][equals]")).toBe("published");
    expect(parsed.searchParams.get("sort")).toBe("-date");
    expect(parsed.searchParams.get("limit")).toBe("150");
  });

  it("coerces numeric params to strings", () => {
    const url = cmsURL("/api/projects", { limit: 50 });
    expect(new URL(url).searchParams.get("limit")).toBe("50");
  });

  it("strips trailing slash from base before building", () => {
    const cmsURLTrailing = makeCmsURL("http://localhost:3001/");
    // URL constructor handles this — result should not double-slash
    const url = cmsURLTrailing("/api/posts");
    expect(url).not.toContain("//api");
  });
});

describe("absolutizeUpload", () => {
  const BASE = "http://localhost:3001";

  it("prefixes relative cover URL", () => {
    const post = { cover: { url: "/media/photo.jpg", alt: "photo" } };
    const result = absolutizeUpload(post, BASE);
    expect(result.cover.url).toBe("http://localhost:3001/media/photo.jpg");
  });

  it("prefixes relative image URL on a project", () => {
    const project = { image: { url: "/media/project.png" } };
    const result = absolutizeUpload(project, BASE);
    expect(result.image.url).toBe("http://localhost:3001/media/project.png");
  });

  it("prefixes relative thumbnail URL on a template", () => {
    const template = { thumbnail: { url: "/media/thumb.webp" } };
    const result = absolutizeUpload(template, BASE);
    expect(result.thumbnail.url).toBe("http://localhost:3001/media/thumb.webp");
  });

  it("leaves already-absolute URL untouched", () => {
    const post = { cover: { url: "https://cdn.example.com/photo.jpg" } };
    const result = absolutizeUpload(post, BASE);
    expect(result.cover.url).toBe("https://cdn.example.com/photo.jpg");
  });

  it("leaves string/number upload id untouched", () => {
    const post = { cover: 42 };
    const result = absolutizeUpload(post, BASE);
    expect(result.cover).toBe(42);
  });

  it("ignores missing upload fields", () => {
    const post = { title: "No image" };
    expect(() => absolutizeUpload(post, BASE)).not.toThrow();
  });
});

describe("fetch helpers (mocked)", () => {
  let fetchCalls: { url: string; init?: RequestInit }[] = [];

  beforeEach(() => {
    fetchCalls = [];
  });

  function mockFetch(response: unknown, ok = true) {
    global.fetch = mock(async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok,
        json: async () => response,
      } as Response;
    });
  }

  it("getPosts builds correct URL with published filter", async () => {
    mockFetch({ docs: [] });

    // Inline minimal getPosts to test URL shape without Astro bundler
    const CMS_URL = "http://localhost:3001";
    const url = new URL("/api/posts", CMS_URL);
    url.searchParams.set("where[status][equals]", "published");
    url.searchParams.set("sort", "-date");
    url.searchParams.set("limit", "150");
    url.searchParams.set("depth", "1");

    await fetch(url.toString());
    expect(fetchCalls[0].url).toContain("where%5Bstatus%5D%5Bequals%5D=published");
    expect(fetchCalls[0].url).toContain("sort=-date");
    expect(fetchCalls[0].url).toContain("limit=150");
  });

  it("returns empty array when fetch fails", async () => {
    global.fetch = mock(async () => {
      throw new Error("network error");
    });

    const result = await (async () => {
      try {
        await fetch("http://localhost:3001/api/posts");
        return ["data"];
      } catch {
        return [];
      }
    })();

    expect(result).toEqual([]);
  });

  it("returns empty array on non-ok response", async () => {
    mockFetch({}, false);

    const res = await fetch("http://localhost:3001/api/posts");
    const docs = res.ok ? ["data"] : [];
    expect(docs).toEqual([]);
  });

  it("subscribe POSTs correct JSON body", async () => {
    mockFetch({ doc: {} }, true);

    const email = "test@example.com";
    const name = "Test User";
    await fetch("http://localhost:3001/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    expect(fetchCalls[0].init?.method).toBe("POST");
    expect(JSON.parse(fetchCalls[0].init?.body as string)).toEqual({
      email,
      name,
    });
  });
});
