import { Type, type Static } from '@sinclair/typebox';
import { TagSchema, UploadSchema, Tag, Upload } from './common';

export const PostSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  contentMarkdown: Type.Optional(Type.String()),
  date: Type.String(),
  readTime: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(TagSchema)),
  cover: Type.Union([Type.String(), Type.Number(), UploadSchema, Type.Null()]),
  status: Type.Enum({
    Draft: 'draft',
    Published: 'published',
  }),
});
export type Post = Static<typeof PostSchema>;

export const ProjectSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
  title: Type.String(),
  type: Type.Optional(Type.String()),
  tech: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  link: Type.Optional(Type.String()),
  image: Type.Union([Type.String(), Type.Number(), UploadSchema, Type.Null()]),
  order: Type.Optional(Type.Number()),
});
export type Project = Static<typeof ProjectSchema>;

export const TemplateSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
  title: Type.String(),
  description: Type.String(),
  demoUrl: Type.Optional(Type.String()),
  sourceUrl: Type.Optional(Type.String()),
  tech: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(TagSchema)),
  thumbnail: Type.Union([Type.String(), Type.Number(), UploadSchema, Type.Null()]),
  featured: Type.Optional(Type.Boolean()),
  price: Type.Optional(Type.Number()),
  order: Type.Optional(Type.Number()),
});
export type Template = Static<typeof TemplateSchema>;

export const SubscriberSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  name: Type.Optional(Type.String()),
  status: Type.Enum({
    Subscribed: 'subscribed',
    Unsubscribed: 'unsubscribed',
  }),
});
export type Subscriber = Static<typeof SubscriberSchema>;

export const ContactMessageSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  project: Type.Optional(Type.String()),
  budget: Type.Optional(Type.String()),
  message: Type.String(),
});
export type ContactMessage = Static<typeof ContactMessageSchema>;

export const NewsletterSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  subject: Type.String(),
  preheader: Type.Optional(Type.String()),
  contentMarkdown: Type.Optional(Type.String()),
  html: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
  status: Type.Enum({
    Draft: 'draft',
    Sending: 'sending',
    Sent: 'sent',
  }),
  sentAt: Type.Optional(Type.String()),
  recipientsCount: Type.Optional(Type.Number()),
});
export type Newsletter = Static<typeof NewsletterSchema>;

export { TagSchema, UploadSchema };
export type { Tag, Upload };
