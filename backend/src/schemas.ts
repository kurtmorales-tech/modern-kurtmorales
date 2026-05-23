import { z } from 'zod';

// ── Shared schemas ──────────────────────────────────────────────────

/** Bundled phone validator: E.164 format (+1-555-555-5555) */
export const zPhone = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Must be a valid E.164 phone number (e.g. +15555555555)')
  .describe('E.164 phone number');

/** Bundled email validator */
export const zEmail = z
  .string()
  .email('Must be a valid email address')
  .max(254)
  .describe('Email address');

/** Slug: lowercase, hyphens allowed, alphanumeric */
export const zSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
  .min(2)
  .max(100);

/** UUID validator */
export const zUUID = z.string().uuid();

/** Pagination params */
export const zPagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** ISO date string */
export const zISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)');

// ── Per-entity create / update schemas ──────────────────────────────

// Tags array
export const zTag = z.object({ tag: z.string().max(50) });
export const zTags = z.array(zTag).default([]).optional();

// -- Posts --
export const zCreatePost = z.object({
  slug: zSlug.describe('URL slug for the post'),
  title: z.string().min(1).max(255).describe('Post title'),
  excerpt: z.string().min(1).max(500).describe('Short summary'),
  contentMarkdown: z.string().optional().describe('Full markdown body'),
  date: zISODate.describe('Publication date'),
  readTime: z.string().optional().describe('Estimated read time'),
  tags: zTags.describe('Tag array [{ tag: string }]'),
  cover: z.object({ url: z.string().url(), alt: z.string().optional() }).optional().describe('Cover image'),
  status: z.enum(['draft', 'published']).default('draft').describe('Publish status'),
});

export const zUpdatePost = zCreatePost.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field to update' }
);

export const zPostParams = z.object({ id: zUUID });

// -- Projects --
export const zCreateProject = z.object({
  title: z.string().min(1).max(255).describe('Project title'),
  type: z.string().max(100).optional().describe('Project type'),
  tech: z.string().max(255).optional().describe('Tech stack'),
  description: z.string().max(2000).optional().describe('Description'),
  link: z.string().url().optional().describe('Project URL'),
  image: z.object({ url: z.string().url(), alt: z.string().optional() }).optional().describe('Project image'),
  order: z.number().int().default(0).describe('Sort order'),
});

export const zUpdateProject = zCreateProject.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field to update' }
);

export const zProjectParams = z.object({ id: zUUID });

// -- Templates --
export const zCreateTemplate = z.object({
  title: z.string().min(1).max(255).describe('Template title'),
  description: z.string().min(1).max(2000).describe('Template description'),
  thumbnail: z.object({ url: z.string().url(), alt: z.string().optional() }).optional().describe('Thumbnail image'),
  demoUrl: z.string().url().optional().describe('Demo URL'),
  sourceUrl: z.string().url().optional().describe('Source URL'),
  tech: z.string().max(255).optional().describe('Tech stack'),
  tags: zTags.describe('Tag array [{ tag: string }]'),
  featured: z.boolean().default(false).describe('Is featured'),
  price: z.number().min(0).default(0).describe('Price in USD'),
  order: z.number().int().default(0).describe('Sort order'),
});

export const zUpdateTemplate = zCreateTemplate.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field to update' }
);

export const zTemplateParams = z.object({ id: zUUID });

// -- Subscribers --
export const zCreateSubscriber = z.object({
  email: zEmail.describe('Subscriber email'),
  name: z.string().max(255).optional().describe('Subscriber name'),
});

export const zSubscriberParams = z.object({ id: zUUID });

// -- Newsletters --
export const zCreateNewsletter = z.object({
  title: z.string().min(1).max(255).describe('Newsletter title'),
  subject: z.string().min(1).max(500).describe('Email subject line'),
  preheader: z.string().max(300).optional().describe('Preview text'),
  contentMarkdown: z.string().optional().describe('Newsletter markdown body'),
  html: z.string().optional().describe('Rendered HTML'),
  text: z.string().optional().describe('Plain text version'),
  status: z.enum(['draft', 'sending', 'sent']).default('draft').describe('Send status'),
});

export const zUpdateNewsletter = zCreateNewsletter.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field to update' }
);

export const zNewsletterParams = z.object({ id: zUUID });

export const zNewsletterStatus = z.enum(['draft', 'sending', 'sent']).describe('Newsletter status filter');

// -- Contact Messages --
export const zCreateContactMessage = z.object({
  name: z.string().min(1).max(100).describe('Sender name'),
  email: zEmail.describe('Sender email'),
  project: z.string().max(255).optional().describe('Project name (optional)'),
  budget: z.string().max(100).optional().describe('Budget range'),
  message: z.string().min(1).max(5000).describe('Message body'),
});

export const zContactMessageParams = z.object({ id: zUUID });

// -- Admin auth --
export const zAdminLogin = z.object({
  secret: z.string().min(1).describe('Admin secret'),
});

// -- Bulk delete --
export const zBulkDelete = z.object({
  id: zUUID.describe('Record ID to delete'),
});