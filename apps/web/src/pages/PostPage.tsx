import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostBySlug } from '../lib/api';
import { useSeo } from '../lib/seo';
import { KMImage } from '../components/KMImage';
import type { Post, Upload } from '../types';

function coverUrl(post: Post) {
  return post.cover && typeof post.cover === 'object' && 'url' in post.cover
    ? (post.cover as Upload).url
    : undefined;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const key = `${part}-${index}`;
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={key}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href =
        link[2].startsWith('http') || link[2].startsWith('/') || link[2].startsWith('#')
          ? link[2]
          : '#';
      return (
        <a key={key} href={href}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function MarkdownContent({ markdown, fallback }: { markdown?: string; fallback: string }) {
  const blocks = (markdown?.trim() || fallback).split(/\n\n+/);

  return (
    <div className="prose max-w-none">
      {blocks.map((block, index) => {
        const key = `${index}-${block.slice(0, 16)}`;
        if (block.startsWith('### ')) return <h3 key={key}>{renderInline(block.slice(4))}</h3>;
        if (block.startsWith('## ')) return <h2 key={key}>{renderInline(block.slice(3))}</h2>;
        if (block.startsWith('# ')) return <h1 key={key}>{renderInline(block.slice(2))}</h1>;
        if (block.startsWith('- ')) {
          return (
            <ul key={key}>
              {block
                .split('\n')
                .filter(Boolean)
                .map((item) => (
                  <li key={item}>{renderInline(item.replace(/^- /, ''))}</li>
                ))}
            </ul>
          );
        }
        return <p key={key}>{renderInline(block)}</p>;
      })}
    </div>
  );
}

export function PostPage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    setPost(undefined);
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  useSeo(
    post ? `${post.title} — KurtMorales` : 'Post — KurtMorales',
    post?.excerpt || 'Blog post by KurtMorales.',
    post
      ? {
          canonical: `/blog/${post.slug}`,
          ogType: 'article',
          ogImage: coverUrl(post) || 'https://kurtmorales.com/og-default.png',
          article: {
            publishedTime: post.date,
            author: 'Kurt Anthony Morales',
            tags: post.tags?.map((tag) => tag.tag),
          },
        }
      : {},
  );

  if (post === undefined)
    return (
      <main id="main-content" className="pt-32 pb-32">
        <div className="max-w-3xl mx-auto px-6 km-text-muted">Loading article…</div>
      </main>
    );
  if (!post)
    return (
      <main id="main-content" className="pt-32 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-display text-brand mb-6">Post not found</h1>
          <Link to="/blog" className="km-button km-button-secondary">
            Back to Blog
          </Link>
        </div>
      </main>
    );

  return (
    <main id="main-content" className="pt-12 pb-32">
      <article className="max-w-3xl mx-auto px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand transition-colors mb-12"
        >
          ← Back to Blog
        </Link>
        <header className="mb-16">
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags?.map((tag) => (
              <span
                key={tag.tag}
                className="text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1"
              >
                {tag.tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-medium leading-tight text-brand mb-6">
            {post.title}
          </h1>
          <KMImage
            src={post.cover}
            alt={post.title}
            aspect="aspect-video"
            width={1200}
            className="mb-8 rounded-2xl border border-gray-100 shadow-sm"
          />
          <p className="text-gray-500 text-lg leading-relaxed mb-8">{post.excerpt}</p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            {post.readTime && <span>{post.readTime}</span>}
          </div>
        </header>
        <MarkdownContent markdown={post.contentMarkdown} fallback={post.excerpt} />
        <footer className="mt-20 pt-10 border-t border-gray-100">
          <Link to="/blog" className="km-button km-button-secondary">
            ← More Articles
          </Link>
        </footer>
      </article>
    </main>
  );
}
