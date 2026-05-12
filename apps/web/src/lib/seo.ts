import { useEffect } from 'react';

type ArticleSeo = {
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
};

type SeoOptions = {
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: ArticleSeo;
  noindex?: boolean;
};

const SITE_URL = 'https://kurtmorales.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  for (const [key, value] of Object.entries(attrs)) tag.setAttribute(key, value);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

function setJsonLd(id: string, data: unknown) {
  let tag = document.getElementById(id) as HTMLScriptElement | null;
  if (!tag) {
    tag = document.createElement('script');
    tag.id = id;
    tag.type = 'application/ld+json';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

export function useSeo(title: string, description: string, options: SeoOptions = {}) {
  useEffect(() => {
    const canonical = `${SITE_URL}${options.canonical ?? window.location.pathname}`;
    const ogImage = options.ogImage ?? DEFAULT_IMAGE;
    const ogType = options.ogType ?? 'website';

    document.title = title;
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });
    upsertMeta('meta[name="keywords"]', {
      name: 'keywords',
      content:
        'web designer las vegas, freelance web developer las vegas, kurtmorales, small business website las vegas, react developer las vegas, cloudflare pages developer',
    });
    upsertMeta('meta[name="author"]', {
      name: 'author',
      content: 'Kurt Anthony Morales',
    });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: options.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    upsertLink('canonical', canonical);

    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: ogType,
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical,
    });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: ogImage,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'KurtMorales',
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:site"]', {
      name: 'twitter:site',
      content: '@xkamhype',
    });
    upsertMeta('meta[name="twitter:creator"]', {
      name: 'twitter:creator',
      content: '@xkamhype',
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: ogImage,
    });

    upsertMeta('meta[name="geo.region"]', {
      name: 'geo.region',
      content: 'US-NV',
    });
    upsertMeta('meta[name="geo.placename"]', {
      name: 'geo.placename',
      content: 'Las Vegas, Nevada',
    });

    setJsonLd('km-person-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Kurt Anthony Morales',
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      jobTitle: 'Freelance Web Designer & Developer',
      worksFor: {
        '@type': 'Organization',
        name: 'KurtMorales Studio',
        url: SITE_URL,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Las Vegas',
        addressRegion: 'NV',
        addressCountry: 'US',
      },
      sameAs: [
        'https://github.com/kurtmorales-tech',
        'https://www.linkedin.com/in/kurtanthonymorales/',
        'https://x.com/xkamhype',
      ],
    });

    setJsonLd('km-website-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'KurtMorales',
      url: SITE_URL,
      description: 'Freelance web designer & developer in Las Vegas, NV.',
      author: { '@type': 'Person', name: 'Kurt Anthony Morales' },
    });

    if (ogType === 'article' && options.article) {
      setJsonLd('km-article-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: ogImage,
        datePublished: options.article.publishedTime,
        dateModified: options.article.modifiedTime || options.article.publishedTime,
        author: {
          '@type': 'Person',
          name: options.article.author ?? 'Kurt Anthony Morales',
          url: `${SITE_URL}/about`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'KurtMorales',
          url: SITE_URL,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        keywords: options.article.tags?.join(', '),
      });
    } else {
      document.getElementById('km-article-jsonld')?.remove();
    }
  }, [
    title,
    description,
    options.canonical,
    options.ogImage,
    options.ogType,
    options.noindex,
    JSON.stringify(options.article),
  ]);
}
