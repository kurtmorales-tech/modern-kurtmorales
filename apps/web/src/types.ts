export type Tag = { tag: string };

export type Upload = {
  url?: string;
  alt?: string;
};

export type Post = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown?: string;
  date: string;
  readTime?: string;
  tags?: Tag[];
  cover?: Upload | string | number | null;
  status: 'draft' | 'published';
};

export type Project = {
  id: string | number;
  title: string;
  type?: string;
  tech?: string;
  description?: string;
  link?: string;
  image?: Upload | string | number | null;
  order?: number;
};

export type Template = {
  id: string | number;
  title: string;
  description: string;
  demoUrl?: string;
  sourceUrl?: string;
  tech?: string;
  tags?: Tag[];
  thumbnail?: Upload | string | number | null;
  featured?: boolean;
  price?: number;
  order?: number;
};
