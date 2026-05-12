import { useSeo } from '../lib/seo';

export function TermsPage() {
  useSeo('Terms of Service — KurtMorales', 'KurtMorales terms of service.', {
    canonical: '/terms',
  });
  return (
    <main id="main-content" className="pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-brand mb-4">
          Terms of Service
        </h1>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-16">
          Last updated: May 2026
        </p>
        <div className="prose max-w-none">
          <p>
            By engaging KurtMorales for web design or development services, you agree to the
            following terms. These govern the relationship between KurtMorales Studio
            (&quot;we&quot;, &quot;us&quot;) and the client (&quot;you&quot;).
          </p>
          <h2>01. Service Engagement</h2>
          <p>
            All projects begin with a mutually agreed scope of work. Timelines may adjust based on
            technical complexity, scope changes, or client response times.
          </p>
          <h2>02. Intellectual Property</h2>
          <p>
            Ownership of produced digital assets is transferred to the client upon receipt of final
            project payment, unless otherwise specified in writing. KurtMorales retains the right to
            display completed work in its portfolio.
          </p>
          <h2>03. Payment</h2>
          <p>
            Projects typically require a 50% deposit before work begins, with the remaining balance
            due upon project completion. Late payments may pause work. All fees are in USD.
          </p>
          <h2>04. Revisions</h2>
          <p>
            Standard projects include up to two rounds of revisions within agreed scope. Additional
            revisions are billed at an agreed hourly rate.
          </p>
          <h2>05. Limitation of Liability</h2>
          <p>
            KurtMorales is not liable for indirect, incidental, or consequential damages arising
            from use or inability to use delivered websites or digital assets.
          </p>
          <h2>06. Termination</h2>
          <p>
            Either party may terminate a project engagement with written notice. Work completed up
            to termination will be invoiced at a prorated rate.
          </p>
          <h2>07. Governing Law</h2>
          <p>These terms are governed by the laws of the State of Nevada, USA.</p>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at{' '}
            <a href="mailto:email@kurtmorales.com">email@kurtmorales.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
