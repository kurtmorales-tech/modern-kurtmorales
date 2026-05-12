import { lazy } from 'react';

/** Code-split route modules — only the active route chunk loads after the shell. */
export const AboutPage = lazy(() =>
  import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
export const ApiDashboardPage = lazy(() =>
  import('../pages/ApiDashboardPage').then((m) => ({ default: m.ApiDashboardPage })),
);
export const BlogPage = lazy(() =>
  import('../pages/BlogPage').then((m) => ({ default: m.BlogPage })),
);
export const ContactPage = lazy(() =>
  import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
export const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
export const PostPage = lazy(() =>
  import('../pages/PostPage').then((m) => ({ default: m.PostPage })),
);
export const PrivacyPage = lazy(() =>
  import('../pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
export const ProductsPage = lazy(() =>
  import('../pages/ProductsPage').then((m) => ({ default: m.ProductsPage })),
);
export const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
export const ResourcesPage = lazy(() =>
  import('../pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })),
);
export const StudioBlogPage = lazy(() =>
  import('../pages/StudioBlogPage').then((m) => ({ default: m.StudioBlogPage })),
);
export const TemplatesPage = lazy(() =>
  import('../pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage })),
);
export const TermsPage = lazy(() =>
  import('../pages/TermsPage').then((m) => ({ default: m.TermsPage })),
);
