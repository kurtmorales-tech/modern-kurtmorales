import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiURL, getBackendBaseURL } from '../lib/api';
import { useSeo } from '../lib/seo';

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
  {
    id: 'health',
    label: 'Health',
    description: 'Service heartbeat and SQLite row counts.',
    url: apiURL('/health'),
    method: 'GET',
  },
  {
    id: 'posts',
    label: 'Posts API',
    description: 'Published posts list (limit 1).',
    url: apiURL('/api/posts', {
      'where[status][equals]': 'published',
      limit: 1,
      sort: '-date',
    }),
    method: 'GET',
  },
  {
    id: 'projects',
    label: 'Projects API',
    description: 'Ordered project cards.',
    url: apiURL('/api/projects', { sort: 'order', limit: 5 }),
    method: 'GET',
  },
  {
    id: 'templates',
    label: 'Templates API',
    description: 'Template marketplace entries.',
    url: apiURL('/api/templates', { sort: 'order', limit: 5 }),
    method: 'GET',
  },
  {
    id: 'subscribers',
    label: 'Subscribers API',
    description: 'List endpoint (read-only probe).',
    url: apiURL('/api/subscribers', { limit: 5 }),
    method: 'GET',
  },
  {
    id: 'newsletters',
    label: 'Newsletters API',
    description: 'Newsletter index.',
    url: apiURL('/api/newsletters', { limit: 5 }),
    method: 'GET',
  },
];

function summarizeJson(text: string): string {
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (data.counts && typeof data.counts === 'object')
      return `counts: ${JSON.stringify(data.counts)}`;
    if (Array.isArray(data.docs))
      return `${data.docs.length} doc(s)${data.totalDocs != null ? ` · totalDocs ${String(data.totalDocs)}` : ''}`;
    if (data.ok === true) return 'ok: true';
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  } catch {
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  }
}

async function runProbe(row: ProbeRow): Promise<Partial<ProbeRow>> {
  const started = performance.now();
  try {
    const res = await fetch(row.url, {
      method: row.method,
      headers: { Accept: 'application/json, text/plain;q=0.9, */*;q=0.8' },
    });
    const ms = Math.round(performance.now() - started);
    const text = await res.text();
    let summary: string | undefined;
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('json')) summary = summarizeJson(text);
    else if (text) summary = text.slice(0, 120) + (text.length > 120 ? '…' : '');

    if (!res.ok) {
      return {
        status: 'error',
        httpStatus: res.status,
        ms,
        error: `HTTP ${String(res.status)}`,
        summary,
      };
    }
    return { status: 'ok', httpStatus: res.status, ms, summary };
  } catch (e) {
    const ms = Math.round(performance.now() - started);
    return {
      status: 'error',
      ms,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export function ApiDashboardPage() {
  const base = useMemo(() => getBackendBaseURL(), []);
  const [rows, setRows] = useState<ProbeRow[]>(() =>
    PROBE_DEFS.map((d) => ({ ...d, status: 'idle' as const })),
  );
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [running, setRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [copied, setCopied] = useState(false);

  useSeo(
    'API dashboard — KurtMorales',
    'Monitor Bun content API latency, health, and list endpoints from the browser.',
    {
      canonical: '/dashboard',
      noindex: true,
    },
  );

  const refreshAll = useCallback(async () => {
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

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => {
      void refreshAll();
    }, 30_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, refreshAll]);

  async function copyBase(event: FormEvent) {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(base);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const healthy = rows.filter((r) => r.status === 'ok').length;
  const total = rows.length;

  return (
    <main id="main-content" className="pt-12 pb-32">
      <section className="mx-auto max-w-6xl px-6 space-y-8">
        <div className="km-panel rounded-[2rem] p-8 md:p-10 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">
                Operations
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-[var(--km-text-strong)]">
                API monitoring
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--km-muted)]">
                Live probes against the configured backend base URL. Use this during deploys, local
                dev, or when validating CORS and connectivity from the static site.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="km-button km-button-primary"
                disabled={running}
                onClick={() => void refreshAll()}
              >
                {running ? 'Checking…' : 'Refresh all'}
              </button>
              <label className="km-button km-button-secondary cursor-pointer inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--km-border)]"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Auto / 30s
                </span>
              </label>
              <Link to="/studio/blog" className="km-button km-button-secondary">
                Blog studio
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface-muted)] px-4 py-4 text-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--km-muted)]">
                  Backend base URL
                </p>
                <code className="mt-1 block break-all text-[13px] text-[var(--km-text-strong)]">
                  {base}
                </code>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="km-button km-button-secondary text-[10px]"
                  onClick={copyBase}
                >
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <a
                  href={`${base}/health`}
                  target="_blank"
                  rel="noreferrer"
                  className="km-button km-button-secondary text-[10px]"
                >
                  Open /health
                </a>
              </div>
            </div>
            {lastRun && (
              <p className="mt-3 text-xs text-[var(--km-muted)]">
                Last run: {lastRun.toLocaleString()} · {healthy}/{total} endpoints OK
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <article
              key={row.id}
              className="km-panel rounded-[1.75rem] p-6 space-y-3 border border-[var(--km-border)]"
              data-live-card
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-display font-medium text-[var(--km-text-strong)]">
                    {row.label}
                  </h2>
                  <p className="text-xs text-[var(--km-muted)] leading-relaxed mt-1">
                    {row.description}
                  </p>
                </div>
                <span
                  className={`km-pill shrink-0 text-[9px] font-black uppercase tracking-[0.2em] ${
                    row.status === 'ok'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : row.status === 'loading' || row.status === 'idle'
                        ? 'text-[var(--km-muted)]'
                        : 'bg-red-500/15 text-red-700 dark:text-red-300'
                  }`}
                >
                  {row.status === 'ok'
                    ? 'OK'
                    : row.status === 'loading'
                      ? '…'
                      : row.status === 'idle'
                        ? '—'
                        : 'Fail'}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-[var(--km-muted)] font-semibold uppercase tracking-wider">
                    Latency
                  </dt>
                  <dd className="text-[var(--km-text-strong)] tabular-nums font-medium">
                    {row.ms != null ? `${String(row.ms)} ms` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--km-muted)] font-semibold uppercase tracking-wider">
                    HTTP
                  </dt>
                  <dd className="text-[var(--km-text-strong)] tabular-nums font-medium">
                    {row.httpStatus != null ? String(row.httpStatus) : '—'}
                  </dd>
                </div>
              </dl>
              {row.error && <p className="text-xs text-red-600 dark:text-red-400">{row.error}</p>}
              {row.summary && (
                <p className="text-xs text-[var(--km-muted)] font-mono leading-relaxed break-all">
                  {row.summary}
                </p>
              )}
              <a
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:underline"
              >
                Open request
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
