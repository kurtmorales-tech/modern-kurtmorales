/**
 * Pi SDK Integration for KurtMorales Portfolio
 *
 * Uses Pi SDK exactly as documented:
 * - DefaultResourceLoader for extensions, skills, context discovery
 * - String-based tool selection
 * - Extension factories for custom CMS tools
 * - Session persistence via SessionManager.create()
 *
 * Usage:
 *   npx tsx scripts/pi-sdk.ts                    # Interactive REPL
 *   npx tsx scripts/pi-sdk.ts "seed the CMS"     # Single prompt
 *
 * Docs: https://github.com/mariozechner/pi-coding-agent/blob/main/docs/sdk.md
 */

import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  SessionManager,
  SettingsManager,
  AuthStorage,
  ModelRegistry,
} from "@mariozechner/pi-coding-agent";
import { getModel } from "@mariozechner/pi-ai";
import { Type } from "typebox";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const PROJECT_ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CMS_URL = process.env.PUBLIC_CMS_URL || "http://localhost:3001";

// ─── Extension Factory (inline, per SDK docs §06-extensions) ────

function cmsExtension(pi: ExtensionAPI) {
  // CMS Health Check
  pi.registerTool({
    name: "cms_health",
    label: "CMS Health",
    description: "Check if PayloadCMS backend is running and return post/project counts",
    parameters: Type.Object({}),
    async execute() {
      try {
        const res = await fetch(`${CMS_URL}/api/posts?limit=1`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: `✅ CMS online — ${data.totalDocs} posts — API: ${CMS_URL}` }],
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

  // List Posts
  pi.registerTool({
    name: "cms_posts",
    label: "List CMS Posts",
    description: "Fetch blog posts from PayloadCMS REST API",
    parameters: Type.Object({
      status: Type.Optional(Type.String({ description: "Filter: published | draft" })),
    }),
    async execute(_toolCallId, params) {
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

  // List Projects
  pi.registerTool({
    name: "cms_projects",
    label: "List CMS Projects",
    description: "Fetch portfolio projects from PayloadCMS REST API",
    parameters: Type.Object({}),
    async execute() {
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

  // Create Post
  pi.registerTool({
    name: "cms_create_post",
    label: "Create Blog Post",
    description: "Create a new blog post via PayloadCMS REST API",
    parameters: Type.Object({
      title: Type.String({ description: "Post title" }),
      slug: Type.String({ description: "URL slug" }),
      excerpt: Type.String({ description: "Short excerpt" }),
      contentMarkdown: Type.String({ description: "Post body in markdown" }),
      date: Type.String({ description: "YYYY-MM-DD" }),
      readTime: Type.Optional(Type.String()),
      tags: Type.Optional(Type.Array(Type.String())),
      status: Type.Optional(Type.String({ description: "published | draft" })),
    }),
    async execute(_toolCallId, params) {
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

  // Notify on session start
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("📦 KurtMorales CMS tools loaded", "info");
  });

  // Register /cms command
  pi.registerCommand("cms", {
    description: "Check CMS health and list content",
    handler: async (_args, ctx) => {
      ctx.ui.notify("Checking CMS...", "info");
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
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.create(authStorage);

  // Per SDK docs §02: find model, fallback gracefully
  const model = getModel("amazon-bedrock", "us.anthropic.claude-sonnet-4-6") ?? undefined;

  // Per SDK docs §10: settings with overrides
  const settingsManager = SettingsManager.create();
  settingsManager.applyOverrides({
    compaction: { enabled: true },
    retry: { enabled: true, maxRetries: 3 },
  });

  // Per SDK docs §06: DefaultResourceLoader with extension factory
  const resourceLoader = new DefaultResourceLoader({
    cwd: PROJECT_ROOT,
    agentDir: getAgentDir(),
    settingsManager,
    extensionFactories: [cmsExtension],
    systemPromptOverride: () => `You are a project assistant for the KurtMorales portfolio.

## Architecture
Monorepo: web/ (Astro 5) + cms/ (PayloadCMS v3 + Next.js 15, SQLite)
CMS API: ${CMS_URL} | Admin: ${CMS_URL}/admin | Frontend: http://localhost:3000

## Custom Tools
- cms_health: Check CMS status
- cms_posts: List blog posts (filter by status)
- cms_projects: List portfolio projects
- cms_create_post: Create a blog post via API

## Commands
- /cms: Quick CMS status check

Use CMS tools for content. Use read/bash/edit for code. Be concise.`,
  });
  await resourceLoader.reload();

  // Per SDK docs §11: persistent session
  const { session } = await createAgentSession({
    cwd: PROJECT_ROOT,
    agentDir: getAgentDir(),
    model,
    thinkingLevel: "medium",
    authStorage,
    modelRegistry,
    tools: ["read", "bash", "edit", "write", "grep", "find", "ls"],
    resourceLoader,
    sessionManager: SessionManager.create(PROJECT_ROOT),
    settingsManager,
  });

  // Per SDK docs: event subscription
  session.subscribe((event) => {
    switch (event.type) {
      case "message_update":
        if (event.assistantMessageEvent.type === "text_delta") {
          process.stdout.write(event.assistantMessageEvent.delta);
        }
        break;
      case "tool_execution_start":
        process.stderr.write(`\n🔧 ${event.toolName}\n`);
        break;
      case "tool_execution_end":
        process.stderr.write(`${event.isError ? "❌" : "✅"} done\n`);
        break;
      case "agent_end":
        process.stdout.write("\n");
        break;
    }
  });

  // Single prompt or interactive REPL
  const prompt = process.argv.slice(2).join(" ");
  if (prompt) {
    await session.prompt(prompt);
    session.dispose();
  } else {
    const readline = await import("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
    process.stderr.write("🤖 KurtMorales Pi Agent — type 'exit' to quit\n\n");

    const ask = () => {
      rl.question("> ", async (input) => {
        if (!input || input.trim() === "exit") {
          session.dispose();
          rl.close();
          process.exit(0);
        }
        await session.prompt(input.trim());
        ask();
      });
    };
    ask();
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
