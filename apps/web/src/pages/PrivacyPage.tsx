import { useSeo } from '../lib/seo';

export function PrivacyPage() {
  useSeo('Privacy Policy — KurtMorales', 'KurtMorales privacy policy.', { canonical: '/privacy' });
  return (
    <main id="main-content" className="pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-brand mb-4">
          Privacy Policy
        </h1>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-16">
          Last updated: May 2026
        </p>
        <div className="prose max-w-none">
          <p>
            At KurtMorales, your privacy is fundamental. This policy outlines how we handle
            information collected during digital design engagements.
          </p>
          <h2>01. Data Collection</h2>
          <p>
            We only collect data voluntarily provided via contact forms — specifically your name,
            email address, and project details — to facilitate business communication. We do not use
            tracking pixels, session recording tools, or behavioral analytics.
          </p>
          <h2>02. Information Usage</h2>
          <p>
            Data collected is used exclusively for project coordination and follow-up communication.
            We do not sell, rent, or transmit your information to third-party data brokers,
            advertising networks, or marketing services.
          </p>
          <h2>03. Data Storage</h2>
          <p>
            Contact form submissions are handled through the site API and optionally forwarded by
            email. We do not maintain persistent inquiry data beyond what is necessary for active
            project communication.
          </p>
          <h2>04. Cookies</h2>
          <p>
            This website does not use tracking cookies. Font resources are loaded from Google Fonts,
            which may set performance-related cookies subject to Google&apos;s own privacy policy.
          </p>
          <h2>05. Your Rights</h2>
          <p>
            You have the right to request deletion of any data you&apos;ve submitted. To do so,
            contact us at <a href="mailto:email@kurtmorales.com">email@kurtmorales.com</a>.
          </p>
          <h2>06. Changes</h2>
          <p>
            This policy may be updated periodically. Continued use of this site constitutes
            acceptance of any revised terms.
          </p>
          <h2>Contact</h2>
          <p>
            Questions? Reach out at <a href="mailto:email@kurtmorales.com">email@kurtmorales.com</a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
