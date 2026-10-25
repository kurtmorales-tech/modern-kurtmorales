import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListContactMessages, adminListNewsletters, adminListPosts, adminListProjects, adminListSubscribers, adminLogin, adminLogout, isAdminAuthenticated } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { ContactMessage, Newsletter, Post, Project, Subscriber } from '../types';

type OwnerData = {
  messages: ContactMessage[];
  subscribers: Subscriber[];
  posts: Post[];
  projects: Project[];
  newsletters: Newsletter[];
};

const emptyData: OwnerData = { messages: [], subscribers: [], posts: [], projects: [], newsletters: [] };

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="km-panel p-6" data-live-card>
      <p className="km-terminal-label">{label}</p>
      <p className="mt-3 text-4xl font-display text-[var(--km-text-strong)]">{value}</p>
      <p className="mt-2 text-xs km-text-muted">{detail}</p>
    </article>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const ok = await adminLogin(secret);
    setLoading(false);
    if (ok) onLogin();
    else setError('Unable to verify the owner credential.');
  }
  return (
    <div className="mx-auto max-w-md km-panel p-8">
      <p className="km-terminal-label">Private workspace</p>
      <h1 className="mt-3 text-3xl font-display text-[var(--km-text-strong)]">Owner dashboard</h1>
      <p className="mt-3 text-sm leading-6 km-text-muted">Use the same protected admin credential as Operations.</p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input className="w-full border km-border-soft bg-transparent px-4 py-3 text-sm" type="password" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Owner credential" autoFocus />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <button className="km-button km-button-primary w-full" type="submit" disabled={!secret || loading}>{loading ? 'Checking...' : 'Open dashboard'}</button>
      </form>
    </div>
  );
}

export function OwnerDashboardPage() {
  useSeo('Owner Dashboard | KM Web Design', 'Private owner dashboard for KM Web Design content and lead operations.', { canonical: '/owner', noindex: true });
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated);
  const [data, setData] = useState<OwnerData>(emptyData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    Promise.all([adminListContactMessages(), adminListSubscribers(), adminListPosts(), adminListProjects(), adminListNewsletters()])
      .then(([messages, subscribers, posts, projects, newsletters]) => setData({ messages, subscribers, posts, projects, newsletters }))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!authenticated) return <main id="main-content" className="px-6 py-24"><Login onLogin={() => setAuthenticated(true)} /></main>;

  const recentLeads = [...data.messages].sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? ''))).slice(0, 5);
  const publishedPosts = data.posts.filter((post) => post.status === 'published').length;

  return (
    <main id="main-content" className="px-6 py-12 pb-32">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="km-terminal-label text-brand">KM Web Design / owner view</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-display text-[var(--km-text-strong)]">Business snapshot</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 km-text-muted">Live CRM, content, and delivery metrics from the KM Web Design backend. Traffic analytics are intentionally separate until a provider is connected.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard" className="km-button km-button-secondary">Operations</Link>
            <button type="button" className="km-button km-button-secondary" onClick={() => { adminLogout(); setAuthenticated(false); }}>Log out</button>
          </div>
        </header>

        {loading ? <p className="km-text-muted">Refreshing live data...</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="New leads" value={data.messages.length} detail="Contact submissions" />
          <Metric label="Subscribers" value={data.subscribers.length} detail="Email audience" />
          <Metric label="Published" value={publishedPosts} detail="Live blog posts" />
          <Metric label="Projects" value={data.projects.length} detail="Portfolio records" />
          <Metric label="Newsletters" value={data.newsletters.length} detail="Campaign records" />
        </div>

        <section className="km-panel p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="km-terminal-label">Lead pipeline</p>
              <h2 className="mt-2 text-2xl font-display text-[var(--km-text-strong)]">Recent inquiries</h2>
            </div>
            <Link to="/dashboard" className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Open full operations</Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            {recentLeads.length === 0 ? <p className="py-6 text-sm km-text-muted">No lead submissions yet.</p> : (
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead><tr className="border-b km-border-soft text-[10px] uppercase tracking-[0.18em] km-text-soft"><th className="pb-3">Name</th><th className="pb-3">Project</th><th className="pb-3">Budget</th><th className="pb-3">Received</th></tr></thead>
                <tbody>{recentLeads.map((lead) => <tr key={lead.id} className="border-b km-border-soft"><td className="py-4 font-semibold text-[var(--km-text-strong)]">{lead.name}</td><td className="py-4 km-text-muted">{lead.project || 'General inquiry'}</td><td className="py-4 km-text-muted">{lead.budget || 'Not specified'}</td><td className="py-4 km-text-muted">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Unknown'}</td></tr>)}</tbody>
              </table>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
