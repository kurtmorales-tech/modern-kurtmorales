/**
 * Pi SDK Integration for KurtMorales Portfolio
 *
 * Uses Pi SDK exactly as documented:
 * - DefaultResourceLoader for extensions, skills, context discovery
 * - String-based tool selection
 * - Extension factories for custom backend content tools
 * - Session persistence via SessionManager.create()
 *
 * Usage:
 *   npx tsx scripts/pi-sdk.ts                             # Interactive REPL
 *   npx tsx scripts/pi-sdk.ts "check backend health"     # Single prompt
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
const BACKEND_URL = process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001";

function contentExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "backend_health",
    label: "Backend Health",
    description: "Check if the Bun backend is running and report post/project counts",
    parameters: Type.Object({}),
    async execute() {
      try {
        const [healthRes, postsRes, projectsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/health`),
          fetch(`${BACKEND_URL}/api/posts?limit=1`),
          fetch(`${BACKEND_URL}/api/projects?limit=1`),
        ]);
        if (!healthRes.ok) throw new Error(`HTTP ${healthRes.status}`);
        const posts = postsRes.ok ? (await postsRes.json()).totalDocs : "err";
        const projects = projectsRes.ok ? (await projectsRes.json()).totalDocs : "err";
        return {
          content: [{ type: "text", text: `✅ Backend online — ${posts} posts — ${projects} projects — API: ${BACKEND_URL}` }],
          details: {},
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `❌ Backend unreachable: ${e.message}` }],
          details: {},
        };
      }
    },
  });

  pi.registerTool({
    name: "backend_posts",
    label: "List Posts",
    description: "Fetch blog posts from the Bun content API",
    parameters: Type.Object({
      status: Type.Optional(Type.String({ description: "Filter: published | draft" })),
    }),
    async execute(_toolCallId, params) {
      let url = `${BACKEND_URL}/api/posts?sort=-date&limit=100`;
      if (params.status) url += `&where[status][equals]=${params.status}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const lines = data.docs.map((post: any) => `[${post.status}] ${post.title} — ${post.slug} (${post.date})`);
        return {
          content: [{ type: "text", text: `${data.totalDocs} posts:\n${lines.join("\n")}` }],
          details: {},
        };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }], details: {} };
      }
    },
  });

  pi.registerTool({
    name: "backend_projects",
    label: "List Projects",
    description: "Fetch portfolio projects from the Bun content API",
    parameters: Type.Object({}),
    async execute() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/projects?sort=order&limit=50`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const lines = data.docs.map((project: any) => `[${project.type}] ${project.title} — ${project.tech} → ${project.link}`);
        return {
          content: [{ type: "text", text: `${data.totalDocs} projects:\n${lines.join("\n")}` }],
          details: {},
        };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }], details: {} };
      }
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("📦 KurtMorales backend tools loaded", "info");
  });

  pi.registerCommand("backend", {
    description: "Check backend health and list content totals",
    handler: async (_args, ctx) => {
      ctx.ui.notify("Checking backend...", "info");
      try {
        const [postsRes, projectsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/posts?limit=1`),
          fetch(`${BACKEND_URL}/api/projects?limit=1`),
        ]);
        const posts = postsRes.ok ? (await postsRes.json()).totalDocs : "err";
        const projects = projectsRes.ok ? (await projectsRes.json()).totalDocs : "err";
        ctx.ui.notify(`Backend: ${posts} posts, ${projects} projects — ${BACKEND_URL}`, "success");
      } catch (e: any) {
        ctx.ui.notify(`Backend unreachable: ${e.message}`, "error");
      }
    },
  });
}

async function main() {
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.create(authStorage);
  const model = getModel("amazon-bedrock", "us.anthropic.claude-sonnet-4-6") ?? undefined;

  const settingsManager = SettingsManager.create();
  settingsManager.applyOverrides({
    compaction: { enabled: true },
    retry: { enabled: true, maxRetries: 3 },
  });

  const resourceLoader = new DefaultResourceLoader({
    cwd: PROJECT_ROOT,
    agentDir: getAgentDir(),
    settingsManager,
    extensionFactories: [contentExtension],
    systemPromptOverride: () => `You are a project assistant for the KurtMorales portfolio.

## Architecture
Monorepo: web/ (Astro) + backend/ (Bun + SQLite)
Backend API: ${BACKEND_URL} | Frontend: http://localhost:3000

## Custom Tools
- backend_health: Check backend status
- backend_posts: List blog posts
- backend_projects: List portfolio projects

## Commands
- /backend: Quick backend status check

Use backend tools for content status. Use read/bash/edit for code. Be concise.`,
  });
  await resourceLoader.reload();

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
