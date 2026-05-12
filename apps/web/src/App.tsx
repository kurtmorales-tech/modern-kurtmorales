import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import {
  AboutPage,
  ApiDashboardPage,
  BlogPage,
  ContactPage,
  NotFoundPage,
  PostPage,
  PrivacyPage,
  ProductsPage,
  ProjectsPage,
  ResourcesPage,
  StudioBlogPage,
  TemplatesPage,
  TermsPage,
} from './routes/lazy-pages';
import { RouteFallback } from './routes/route-fallback';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<ApiDashboardPage />} />
            <Route path="/studio/blog" element={<StudioBlogPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
