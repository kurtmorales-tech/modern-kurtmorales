import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogEndcap } from '../components/BlogEndcap';
import { getPosts } from '../lib/api';
import { useSeo } from '../lib/seo';
import type { Post } from '../types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogPage() {
  useSeo(
    'Blog — KurtMorales',
    'Thoughts on web development, freelancing, AI integration, and building for the modern web.',
    { canonical: '/blog' },
  );
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const latestPost = posts[0];
  const featuredTags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.tag) ?? []))].slice(0, 4),
    [posts],
  );

  return (
    <main id="main-content" className="pt-12 pb-24">
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="km-pill km-text-muted mb-6 text-[10px] font-black uppercase tracking-[0.28em]">
                <span className="h-2 w-2 rounded-full bg-brand pulse-dot" />
                Blog archive
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-medium leading-[0.94] km-text-strong mb-6">
                Cloudflare-fast notes for <span className="text-brand">modern web work.</span>
              </h1>
              <p className="km-text-muted text-lg leading-relaxed max-w-2xl">
                Writing on web development, freelancing, AI, delivery workflows, and the small
                design decisions that make a site feel sharper in motion.
              </p>
              {featuredTags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {featuredTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border km-border-strong km-surface-soft px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] km-text-muted backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <aside className="km-panel live-card rounded-[2rem] p-7 md:p-9" data-live-card>
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] km-text-soft block mb-2">
                    Live archive
                  </span>
                  <p className="text-sm km-text-muted">
                    Fresh writing plus evergreen how-to content.
                  </p>
                </div>
                <span className="number-chip">{String(posts.length).padStart(2, '0')}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.5rem] border km-border-strong km-surface-soft p-5 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 block mb-3">
                    Latest
                  </span>
                  {latestPost ? (
                    <Link
                      to={`/blog/${latestPost.slug}`}
                      className="text-lg font-display font-medium km-text-strong hover:text-brand transition-colors duration-300"
                    >
                      {latestPost.title}
                    </Link>
                  ) : (
                    <p className="text-lg font-display font-medium km-text-strong">
                      Publishing soon
                    </p>
                  )}
                </div>
                <div className="rounded-[1.5rem] border km-border-strong km-surface-soft p-5 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-brand/70 block mb-3">
                    Focus
                  </span>
                  <p className="text-sm leading-relaxed km-text-muted">
                    Design systems, launch workflows, local SEO, CMS structure, and AI-assisted
                    delivery.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="km-panel rounded-[2rem] px-8 py-16 text-center">
              <p className="km-text-soft">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="km-panel live-card group block rounded-[2rem] p-7 md:p-10"
                  data-live-card
                >
                  <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex flex-col sm:flex-row gap-6 flex-1">
                      <span className="number-chip shrink-0 self-start">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3 mb-4">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag.tag}
                              className="text-[10px] font-black uppercase tracking-[0.22em] km-text-soft border km-border-strong km-surface-soft px-3 py-2 rounded-full"
                            >
                              {tag.tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl md:text-[2rem] font-display font-medium km-text-strong tracking-tight mb-4 group-hover:text-brand transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="km-text-muted text-sm md:text-base leading-relaxed max-w-3xl">
                          {post.excerpt}
                        </p>
                        <div className="mt-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand/70">
                          <span>Read article</span>
                          <span aria-hidden>→</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.24em] km-text-soft shrink-0 xl:pt-2">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <BlogEndcap
        latestHref={latestPost ? `/blog/${latestPost.slug}` : '/blog'}
        latestLabel={
          latestPost
            ? `Continue with “${latestPost.title}”.`
            : 'Jump into the newest article in the archive.'
        }
      />
    </main>
  );
}
