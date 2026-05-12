import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { Post } from '../types';

export function StudioBlogPage() {
  useSeo(
    'Blog Studio — KurtMorales',
    'Edit blog posts in the browser through the Cloudflare Worker studio.',
    { canonical: '/studio/blog', noindex: true },
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [token, setToken] = useState(() => localStorage.getItem('km-admin-secret') ?? '');
  const [message, setMessage] = useState('Enter the admin token to create RSS-backed draft posts.');
  const [result, setResult] = useState('Waiting for a generation request.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextToken = String(data.get('token') ?? '').trim();
    const source = String(data.get('source') ?? '').trim();
    const limit = Number(data.get('limit') ?? 1);

    if (!nextToken) {
      setMessage('Enter the admin token first.');
      return;
    }

    localStorage.setItem('km-admin-secret', nextToken);
    setToken(nextToken);
    setLoading(true);
    setMessage('Generating content...');
    setResult('Running /api/content/generate ...');

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${nextToken}` },
        body: JSON.stringify({
          source: source || undefined,
          limit: Number.isFinite(limit) ? limit : 1,
        }),
      });
      const payload = await response.json().catch(() => ({ error: 'Unable to parse response.' }));
      setResult(JSON.stringify(payload, null, 2));
      setMessage(
        response.ok
          ? `Generation completed. Saved ${payload.saved ?? 0} draft(s).`
          : (payload.error ?? 'Generation failed.'),
      );
    } catch (error) {
      setMessage('Generation request failed.');
      setResult(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main-content" className="pt-12 pb-32">
      <section className="mx-auto max-w-6xl px-6 space-y-8">
        <div className="km-panel rounded-[2rem] p-8 md:p-10 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">
            Editor Index
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-[var(--km-text-strong)]">
            Blog Studio
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--km-muted)]">
            Open any article in the browser editor, load its Worker draft, and save changes into
            Cloudflare D1 before the next rebuild.
          </p>
        </div>
        <section className="km-panel rounded-[2rem] p-8 md:p-10 space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">
              Admin Actions
            </p>
            <h2 className="text-2xl font-display font-medium text-[var(--km-text-strong)]">
              Generate RSS Drafts
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-[var(--km-muted)]">
              Trigger the protected Worker route to fetch relevant RSS posts and save new draft
              entries into Cloudflare D1.
            </p>
          </div>
          <form
            className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_180px_auto] lg:items-end"
            onSubmit={generate}
          >
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--km-muted)]">
                Admin Token
              </span>
              <input
                className="w-full rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface)] px-4 py-3 text-sm text-[var(--km-text-strong)] outline-none transition focus:border-brand"
                type="password"
                name="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter ADMIN_SECRET"
                autoComplete="off"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--km-muted)]">
                Source
              </span>
              <input
                className="w-full rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface)] px-4 py-3 text-sm text-[var(--km-text-strong)] outline-none transition focus:border-brand"
                type="text"
                name="source"
                placeholder="all or cloudflare"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--km-muted)]">
                Limit
              </span>
              <input
                className="w-full rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface)] px-4 py-3 text-sm text-[var(--km-text-strong)] outline-none transition focus:border-brand"
                type="number"
                name="limit"
                min="1"
                max="10"
                defaultValue="1"
              />
            </label>
            <div className="lg:col-span-3 flex flex-wrap items-center gap-3">
              <button type="submit" className="km-button km-button-primary" disabled={loading}>
                {loading ? 'Generating…' : 'Generate Content'}
              </button>
              <p className="text-sm text-[var(--km-muted)]">{message}</p>
            </div>
          </form>
          <pre className="overflow-x-auto rounded-[1.5rem] border border-[var(--km-border)] bg-[var(--km-surface-muted)] px-4 py-4 text-xs leading-6 text-[var(--km-muted)] whitespace-pre-wrap">
            {result}
          </pre>
        </section>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="km-panel rounded-[2rem] p-6 space-y-4" data-live-card>
              <div className="flex items-center justify-between gap-3">
                <span className="km-pill text-[10px] font-black uppercase tracking-[0.24em] text-[var(--km-muted)]">
                  {post.status}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--km-muted-soft)]">
                  {post.readTime ?? 'editor ready'}
                </span>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-display text-[var(--km-text-strong)]">{post.title}</h2>
                <p className="text-sm leading-6 text-[var(--km-muted)]">{post.excerpt}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag.tag}
                    className="km-pill text-[10px] font-black uppercase tracking-[0.22em] text-[var(--km-muted)]"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to={`/studio/blog/${post.slug}`} className="km-button km-button-primary">
                  Edit Post
                </Link>
                <Link to={`/blog/${post.slug}`} className="km-button km-button-secondary">
                  View Live
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
