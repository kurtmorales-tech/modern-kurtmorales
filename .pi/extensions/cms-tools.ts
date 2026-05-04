/**
 * KurtMorales CMS Extension
 *
 * Project-local Pi extension — auto-discovered at .pi/extensions/cms-tools.ts
 * Follows: docs/extensions.md §Quick Start, §Custom Tools, §Events
 *
 * Registers CMS tools + /cms command when Pi runs from this project.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";

const CMS_URL = process.env.PUBLIC_CMS_URL || "http://localhost:3001";

export default function (pi: ExtensionAPI) {
  // ── Tool: cms_health ──────────────────────────
  pi.registerTool({
    name: "cms_health",
    label: "CMS Health",
    description: "Check if PayloadCMS is running and return post/project counts",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, _ctx) {
      try {
        const res = await fetch(`${CMS_URL}/api/posts?limit=1`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: `✅ CMS online — ${data.totalDocs} posts — ${CMS_URL}` }],
          details: {},
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `❌ CMS unreachable: ${e.message}` }],
          details: {},
        };
      }
    },
  });

  // ── Tool: cms_posts ───────────────────────────
  pi.registerTool({
    name: "cms_posts",
    label: "List Posts",
    description: "Fetch blog posts from PayloadCMS with optional status filter",
    parameters: Type.Object({
      status: Type.Optional(Type.String({ description: "Filter: published | draft" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      let url = `${CMS_URL}/api/posts?sort=-date&limit=100`;
      if (params.status) url += `&where[status][equals]=${params.status}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const lines = data.docs.map((p: any) => `[${p.status}] ${p.title} — ${p.slug} (${p.date})`);
        return {
          content: [{ type: "text", text: `${data.totalDocs} posts:\n${lines.join("\n")}` }],
          details: {},
        };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }], details: {} };
      }
    },
  });

  // ── Tool: cms_projects ────────────────────────
  pi.registerTool({
    name: "cms_projects",
    label: "List Projects",
    description: "Fetch portfolio projects from PayloadCMS sorted by order",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, _ctx) {
      try {
        const res = await fetch(`${CMS_URL}/api/projects?sort=order&limit=50`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const lines = data.docs.map((p: any) => `[${p.type}] ${p.title} — ${p.tech} → ${p.link}`);
        return {
          content: [{ type: "text", text: `${data.totalDocs} projects:\n${lines.join("\n")}` }],
          details: {},
        };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }], details: {} };
      }
    },
  });

  // ── Tool: cms_create_post ─────────────────────
  pi.registerTool({
    name: "cms_create_post",
    label: "Create Post",
    description: "Create a new blog post in PayloadCMS via REST API",
    parameters: Type.Object({
      title: Type.String({ description: "Post title" }),
      slug: Type.String({ description: "URL slug" }),
      excerpt: Type.String({ description: "Short excerpt" }),
      contentMarkdown: Type.String({ description: "Markdown body" }),
      date: Type.String({ description: "YYYY-MM-DD" }),
      readTime: Type.Optional(Type.String()),
      tags: Type.Optional(Type.Array(Type.String())),
      status: Type.Optional(Type.String({ description: "published | draft" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const body: Record<string, any> = {
        title: params.title,
        slug: params.slug,
        excerpt: params.excerpt,
        contentMarkdown: params.contentMarkdown,
        date: params.date,
        readTime: params.readTime || "3 min read",
        status: params.status || "draft",
      };
      if (params.tags) body.tags = params.tags.map((t: string) => ({ tag: t }));

      try {
        const res = await fetch(`${CMS_URL}/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: `✅ Created: "${data.doc.title}" (id: ${data.doc.id})` }],
          details: {},
        };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }], details: {} };
      }
    },
  });

  // ── Command: /cms ─────────────────────────────
  pi.registerCommand("cms", {
    description: "Quick CMS status — shows post and project counts",
    handler: async (_args, ctx) => {
      try {
        const [postsRes, projRes] = await Promise.all([
          fetch(`${CMS_URL}/api/posts?limit=1`),
          fetch(`${CMS_URL}/api/projects?limit=1`),
        ]);
        const posts = postsRes.ok ? (await postsRes.json()).totalDocs : "err";
        const projs = projRes.ok ? (await projRes.json()).totalDocs : "err";
        ctx.ui.notify(`CMS: ${posts} posts, ${projs} projects — ${CMS_URL}`, "success");
      } catch (e: any) {
        ctx.ui.notify(`CMS unreachable: ${e.message}`, "error");
      }
    },
  });

  // ── Event: session_start ──────────────────────
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("📦 CMS tools active: cms_health, cms_posts, cms_projects, cms_create_post", "info");
  });
}
