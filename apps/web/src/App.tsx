import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MigratedLayout } from './components/MigratedLayout';
import { HomePage } from './pages/HomePage';
import {
  MigratedAIWebsiteBuilder,
  MigratedAITrading,
  MigratedArticleDetail,
  MigratedCryptoBot,
  MigratedProjectShowcase,
  MigratedRestaurantCRM,
  AboutPage,
  ApiDashboardPage,
  BlogPage,
  ContactPage,
  NotFoundPage,
  OwnerDashboardPage,
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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<Layout />}>
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
              <Route path="/owner" element={<OwnerDashboardPage />} />
              <Route path="/studio/blog" element={<StudioBlogPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route element={<MigratedLayout />}>
              <Route path="/work/:id" element={<MigratedProjectShowcase />} />
              <Route path="/articles/:id" element={<MigratedArticleDetail />} />
              <Route path="/demo/ai-website-builder" element={<MigratedAIWebsiteBuilder />} />
              <Route path="/demo/crypto-bot" element={<MigratedCryptoBot />} />
              <Route path="/demo/restaurant-crm" element={<MigratedRestaurantCRM />} />
              <Route path="/demo/ai-trading" element={<MigratedAITrading />} />
            </Route>
          </Routes>
        </Suspense>
    </BrowserRouter>
  );
}
