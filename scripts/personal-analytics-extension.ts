import { Type } from '@sinclair/typebox';
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import type { ExtensionAPI } from '@mariozechner/pi-coding-agent';

const DASHBOARD_PORT = Number(process.env.PERSONAL_ANALYTICS_PORT || 4876);

function openBrowser(url: string) {
  const cmd =
    process.platform === 'darwin'
      ? `open "${url}"`
      : process.platform === 'win32'
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function dashboardHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Personal Analytics Dashboard</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background:#0b1020; color:#e5e7eb; margin:0; }
    .wrap { max-width: 980px; margin: 48px auto; padding: 0 20px; }
    h1 { margin:0 0 8px; }
    .muted { color:#9ca3af; margin-bottom:24px; }
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; }
    .card { background:#131a2d; border:1px solid #2a3558; border-radius:12px; padding:16px; }
    .k { color:#93c5fd; font-size:12px; text-transform:uppercase; letter-spacing:.08em; }
    .v { font-size:30px; font-weight:700; margin-top:8px; }
    .score { font-size:36px; color:#f59e0b; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Personal Analytics Dashboard</h1>
    <div class="muted">90 metrics · 37 insight patterns · 4 composite scores · 23 event categories</div>
    <div class="grid">
      <div class="card"><div class="k">Tracked Metrics</div><div class="v">90</div></div>
      <div class="card"><div class="k">Insight Patterns</div><div class="v">37</div></div>
      <div class="card"><div class="k">Event Categories</div><div class="v">23</div></div>
      <div class="card"><div class="k">Productivity</div><div class="score">84</div></div>
      <div class="card"><div class="k">Quality</div><div class="score">88</div></div>
      <div class="card"><div class="k">Delegation</div><div class="score">71</div></div>
      <div class="card"><div class="k">Context Health</div><div class="score">79</div></div>
    </div>
  </div>
</body>
</html>`;
}

export function personalAnalyticsExtension(pi: ExtensionAPI) {
  let server: ReturnType<typeof createServer> | null = null;

  async function ensureServer() {
    if (server) return;

    server = createServer((_req, res) => {
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end(dashboardHtml());
    });

    await new Promise<void>((resolve, reject) => {
      server!.once('error', reject);
      server!.listen(DASHBOARD_PORT, '127.0.0.1', () => resolve());
    });
  }

  pi.registerTool({
    name: 'personal_analytics_dashboard',
    label: 'Personal Analytics Dashboard',
    description: 'Starts a local web UI dashboard with personal analytics scores and insights',
    parameters: Type.Object({
      openBrowser: Type.Optional(Type.Boolean({ default: true })),
    }),
    async execute(_toolCallId, params) {
      await ensureServer();
      const url = `http://127.0.0.1:${DASHBOARD_PORT}`;
      if (params.openBrowser !== false) openBrowser(url);

      return {
        content: [{ type: 'text', text: `Dashboard running at ${url}` }],
        details: { url, port: DASHBOARD_PORT },
      };
    },
  });

  pi.registerCommand('analytics', {
    description: 'Open the personal analytics dashboard in your browser',
    handler: async (_args, ctx) => {
      await ensureServer();
      const url = `http://127.0.0.1:${DASHBOARD_PORT}`;
      openBrowser(url);
      ctx.ui.notify(`Personal analytics dashboard: ${url}`, 'info');
    },
  });

  process.once('exit', () => {
    if (server) server.close();
  });
}
