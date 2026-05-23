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

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
  createdAt: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed';
};

export type Newsletter = {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  contentMarkdown?: string;
  html?: string;
  text?: string;
  status: 'draft' | 'sending' | 'sent';
  sentAt?: string;
  recipientsCount?: number;
};
