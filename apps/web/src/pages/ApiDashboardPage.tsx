import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminDeleteContactMessage,
  adminDeleteNewsletter,
  adminDeletePost,
  adminDeleteSubscriber,
  adminListContactMessages,
  adminListNewsletters,
  adminListPosts,
  adminListProjects,
  adminListSubscribers,
  adminListTemplates,
  adminLogin,
  adminLogout,
  apiURL,
  getBackendBaseURL,
  isAdminAuthenticated,
} from '../lib/api';
import { useSeo } from '../lib/seo';
import type { ContactMessage, Newsletter, Subscriber } from '../types';

type Tab = 'probes' | 'posts' | 'projects' | 'templates' | 'subscribers' | 'messages' | 'newsletters';

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

type ProbeRow = {
  id: string;
  label: string;
  description: string;
  url: string;
  method: 'GET';
  status: ProbeStatus;
  httpStatus?: number;
  ms?: number;
  error?: string;
  summary?: string;
};

const PROBE_DEFS: Omit<ProbeRow, 'status' | 'httpStatus' | 'ms' | 'error' | 'summary'>[] = [
  { id: 'health', label: 'Health', description: 'Service heartbeat and SQLite row counts.', url: apiURL('/health'), method: 'GET' },
  { id: 'posts', label: 'Posts API', description: 'Published posts list (limit 1).', url: apiURL('/api/posts', { 'where[status][equals]': 'published', limit: 1, sort: '-date' }), method: 'GET' },
  { id: 'projects', label: 'Projects API', description: 'Ordered project cards.', url: apiURL('/api/projects', { sort: 'order', limit: 5 }), method: 'GET' },
  { id: 'templates', label: 'Templates API', description: 'Template marketplace entries.', url: apiURL('/api/templates', { sort: 'order', limit: 5 }), method: 'GET' },
  { id: 'subscribers', label: 'Subscribers API', description: 'List endpoint (read-only probe).', url: apiURL('/api/subscribers', { limit: 5 }), method: 'GET' },
  { id: 'newsletters', label: 'Newsletters API', description: 'Newsletter index.', url: apiURL('/api/newsletters', { limit: 5 }), method: 'GET' },
];

function summarizeJson(text: string): string {
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (data.counts && typeof data.counts === 'object') return `counts: ${JSON.stringify(data.counts)}`;
    if (Array.isArray(data.docs)) return `${data.docs.length} doc(s)${data.totalDocs != null ? ` · totalDocs ${String(data.totalDocs)}` : ''}`;
    if (data.ok === true) return 'ok: true';
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  } catch {
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  }
}

async function runProbe(row: ProbeRow): Promise<Partial<ProbeRow>> {
  const started = performance.now();
  try {
    const res = await fetch(row.url, { method: row.method, headers: { Accept: 'application/json, text/plain;q=0.9, */*;q=0.8' } });
    const ms = Math.round(performance.now() - started);
    const text = await res.text();
    let summary: string | undefined;
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('json')) summary = summarizeJson(text);
    else if (text) summary = text.slice(0, 120) + (text.length > 120 ? '…' : '');
    if (!res.ok) return { status: 'error', httpStatus: res.status, ms, error: `HTTP ${String(res.status)}`, summary };
    return { status: 'ok', httpStatus: res.status, ms, summary };
  } catch (e) {
    const ms = Math.round(performance.now() - started);
    return { status: 'error', ms, error: e instanceof Error ? e.message : String(e) };
  }
}

function TabButton({ tab, current, label, onSelect }: { tab: Tab; current: Tab; label: string; onSelect: (t: Tab) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tab)}
      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-colors ${tab === current ? 'bg-brand text-white' : 'km-text-muted hover:text-brand hover:bg-[var(--km-surface-muted)]'}`}
    >
      {label}
    </button>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await adminLogin(secret);
    setLoading(false);
    if (ok) { onLogin(); } else { setError('Invalid admin secret'); }
  }

  return (
    <div className="km-panel rounded-[1.75rem] p-8 max-w-md mx-auto">
      <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)] mb-2">Admin Login</h2>
      <p className="text-xs text-[var(--km-muted)] mb-6">Enter your BACKEND_ADMIN_SECRET to access the admin panel.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Admin secret"
          className="w-full rounded-xl border km-border-soft bg-transparent px-4 py-3 text-sm km-text-strong placeholder:text-[var(--km-muted)] focus:outline-none focus:ring-2 focus:ring-brand"
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading || !secret} className="km-button km-button-primary w-full">
          {loading ? 'Verifying…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onDelete,
  emptyMessage,
}: {
  columns: { key: string; label: string; render?: (val: unknown, row: T) => string }[];
  data: T[];
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return <p className="text-xs text-[var(--km-muted)] py-4">{emptyMessage ?? 'No data'}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border km-border-soft">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[var(--km-surface-muted)]">
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left font-bold uppercase tracking-wider km-text-muted">{col.label}</th>
            ))}
            {onDelete && <th className="px-3 py-2 w-16" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={String(row.id ?? i)} className="border-t km-border-soft hover:bg-[var(--km-surface-muted)]/50">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 km-text-strong truncate max-w-[200px]">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {onDelete && (
                <td className="px-3 py-2">
                  <button type="button" onClick={() => onDelete(String(row.id))} className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApiDashboardPage() {
  const base = useMemo(() => getBackendBaseURL(), []);
  const [tab, setTab] = useState<Tab>('probes');
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated);

  // Probes
  const [rows, setRows] = useState<ProbeRow[]>(() => PROBE_DEFS.map((d) => ({ ...d, status: 'idle' as const })));
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [running, setRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Admin data
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useSeo('API dashboard — KurtMorales', 'Monitor Bun content API latency, health, and list endpoints from the browser.', { canonical: '/dashboard', noindex: true });

  const refreshProbes = useCallback(async () => {
    setRunning(true);
    setRows((prev) => prev.map((r) => ({ ...r, status: 'loading' })));
    const next: ProbeRow[] = [];
    for (const def of PROBE_DEFS) {
      const row: ProbeRow = { ...def, status: 'loading' };
      const result = await runProbe(row);
      next.push({ ...row, ...result, status: result.status ?? 'error' });
    }
    setRows(next);
    setLastRun(new Date());
    setRunning(false);
  }, []);

  const fetchAdminData = useCallback(async () => {
    if (!authenticated) return;
    const [p, pr, t, s, m, n] = await Promise.all([
      adminListPosts(),
      adminListProjects(),
      adminListTemplates(),
      adminListSubscribers(),
      adminListContactMessages(),
      adminListNewsletters(),
    ]);
    setPosts(p.map((doc) => ({ ...doc, id: String(doc.id), _status: (doc as Record<string, unknown>).status as string })));
    setProjects(pr.map((doc) => ({ ...doc, id: String(doc.id) })));
    setTemplates(t.map((doc) => ({ ...doc, id: String(doc.id) })));
    setSubscribers(s);
    setMessages(m);
    setNewsletters(n);
  }, [authenticated]);

  useEffect(() => { void refreshProbes(); }, [refreshProbes]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => { void refreshProbes(); }, 30_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, refreshProbes]);

  useEffect(() => { if (authenticated) void fetchAdminData(); }, [authenticated, fetchAdminData]);

  async function handleDeletePost(id: string) {
    await adminDeletePost(id);
    void fetchAdminData();
  }
  async function handleDeleteSubscriber(id: string) {
    await adminDeleteSubscriber(id);
    void fetchAdminData();
  }
  async function handleDeleteMessage(id: string) {
    await adminDeleteContactMessage(id);
    void fetchAdminData();
  }
  async function handleDeleteNewsletter(id: string) {
    await adminDeleteNewsletter(id);
    void fetchAdminData();
  }

  function handleLogout() {
    adminLogout();
    setAuthenticated(false);
    setPosts([]);
    setProjects([]);
    setTemplates([]);
    setSubscribers([]);
    setMessages([]);
    setNewsletters([]);
  }

  const healthy = rows.filter((r) => r.status === 'ok').length;
  const total = rows.length;

  return (
    <main id="main-content" className="pt-12 pb-32">
      <section className="mx-auto max-w-6xl px-6 space-y-8">
        <div className="km-panel rounded-[2rem] p-8 md:p-10 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Operations</p>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-[var(--km-text-strong)]">Dashboard</h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--km-muted)]">
                Live probes + admin content management. Login with your admin secret to manage posts, projects, templates, and more.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/studio/blog" className="km-button km-button-secondary text-[10px]">Blog studio</Link>
              {authenticated && (
                <button type="button" onClick={handleLogout} className="km-button km-button-secondary text-[10px]">Logout</button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface-muted)] px-4 py-4 text-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--km-muted)]">Backend base URL</p>
                <code className="mt-1 block break-all text-[13px] text-[var(--km-text-strong)]">{base}</code>
              </div>
              <a href={`${base}/health`} target="_blank" rel="noreferrer" className="km-button km-button-secondary text-[10px]">Open /health</a>
            </div>
            {lastRun && <p className="mt-3 text-xs text-[var(--km-muted)]">Last run: {lastRun.toLocaleString()} · {healthy}/{total} endpoints OK</p>}
          </div>
        </div>

        {!authenticated && <AdminLogin onLogin={() => setAuthenticated(true)} />}

        {authenticated && (
          <div className="flex flex-wrap gap-2 border-b km-border-soft pb-3">
            <TabButton tab="probes" current={tab} label="Probes" onSelect={setTab} />
            <TabButton tab="posts" current={tab} label="Posts" onSelect={setTab} />
            <TabButton tab="projects" current={tab} label="Projects" onSelect={setTab} />
            <TabButton tab="templates" current={tab} label="Templates" onSelect={setTab} />
            <TabButton tab="subscribers" current={tab} label="Subscribers" onSelect={setTab} />
            <TabButton tab="messages" current={tab} label="Messages" onSelect={setTab} />
            <TabButton tab="newsletters" current={tab} label="Newsletters" onSelect={setTab} />
          </div>
        )}

        {tab === 'probes' && (
          <>
            <div className="flex gap-2">
              <button type="button" className="km-button km-button-primary" disabled={running} onClick={() => void refreshProbes()}>
                {running ? 'Checking…' : 'Refresh all'}
              </button>
              <label className="km-button km-button-secondary cursor-pointer inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-[var(--km-border)]" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Auto / 30s</span>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {rows.map((row) => (
                <article key={row.id} className="km-panel rounded-[1.75rem] p-6 space-y-3 border border-[var(--km-border)]" data-live-card>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">{row.label}</h2>
                      <p className="text-xs text-[var(--km-muted)] leading-relaxed mt-1">{row.description}</p>
                    </div>
                    <span className={`km-pill shrink-0 text-[9px] font-black uppercase tracking-[0.2em] ${row.status === 'ok' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : row.status === 'loading' || row.status === 'idle' ? 'text-[var(--km-muted)]' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                      {row.status === 'ok' ? 'OK' : row.status === 'loading' ? '…' : row.status === 'idle' ? '—' : 'Fail'}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="text-[var(--km-muted)] font-semibold uppercase tracking-wider">Latency</dt><dd className="text-[var(--km-text-strong)] tabular-nums font-medium">{row.ms != null ? `${String(row.ms)} ms` : '—'}</dd></div>
                    <div><dt className="text-[var(--km-muted)] font-semibold uppercase tracking-wider">HTTP</dt><dd className="text-[var(--km-text-strong)] tabular-nums font-medium">{row.httpStatus != null ? String(row.httpStatus) : '—'}</dd></div>
                  </dl>
                  {row.error && <p className="text-xs text-red-600 dark:text-red-400">{row.error}</p>}
                  {row.summary && <p className="text-xs text-[var(--km-muted)] font-mono leading-relaxed break-all">{row.summary}</p>}
                  <a href={row.url} target="_blank" rel="noreferrer" className="inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:underline">Open request</a>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'posts' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">All Posts ({posts.length})</h2>
            <DataTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'slug', label: 'Slug' },
                { key: 'status', label: 'Status', render: (v) => String(v) },
                { key: 'date', label: 'Date' },
              ]}
              data={posts}
              onDelete={handleDeletePost}
              emptyMessage="No posts yet"
            />
          </div>
        )}

        {tab === 'projects' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">Projects ({projects.length})</h2>
            <DataTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'type', label: 'Type' },
                { key: 'order', label: 'Order', render: (v) => String(v) },
              ]}
              data={projects}
              emptyMessage="No projects yet"
            />
          </div>
        )}

        {tab === 'templates' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">Templates ({templates.length})</h2>
            <DataTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'price', label: 'Price', render: (v) => `$${String(v)}` },
                { key: 'featured', label: 'Featured', render: (v) => v ? 'Yes' : 'No' },
              ]}
              data={templates}
              emptyMessage="No templates yet"
            />
          </div>
        )}

        {tab === 'subscribers' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">Subscribers ({subscribers.length})</h2>
            <DataTable
              columns={[
                { key: 'email', label: 'Email' },
                { key: 'name', label: 'Name', render: (v) => v ? String(v) : '—' },
                { key: 'status', label: 'Status' },
              ]}
              data={subscribers as unknown as Record<string, unknown>[]}
              onDelete={(id) => void handleDeleteSubscriber(id)}
              emptyMessage="No subscribers yet"
            />
          </div>
        )}

        {tab === 'messages' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">Contact Messages ({messages.length})</h2>
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'project', label: 'Project', render: (v) => v ? String(v) : '—' },
                { key: 'budget', label: 'Budget', render: (v) => v ? String(v) : '—' },
                { key: 'message', label: 'Message', render: (v) => String(v).slice(0, 60) + (String(v).length > 60 ? '…' : '') },
                { key: 'createdAt', label: 'Date', render: (v) => new Date(String(v)).toLocaleDateString() },
              ]}
              data={messages as unknown as Record<string, unknown>[]}
              onDelete={(id) => void handleDeleteMessage(id)}
              emptyMessage="No messages yet"
            />
          </div>
        )}

        {tab === 'newsletters' && (
          <div className="km-panel rounded-[1.75rem] p-6 space-y-4">
            <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">Newsletters ({newsletters.length})</h2>
            <DataTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'subject', label: 'Subject' },
                { key: 'status', label: 'Status' },
                { key: 'recipientsCount', label: 'Recipients', render: (v) => String(v) },
              ]}
              data={newsletters as unknown as Record<string, unknown>[]}
              onDelete={(id) => void handleDeleteNewsletter(id)}
              emptyMessage="No newsletters yet"
            />
          </div>
        )}
      </section>
    </main>
  );
}
