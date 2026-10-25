import { type FormEvent, useState } from 'react';
import { submitContact } from '../lib/api';
import { useSeo } from '../lib/seo';

const contactItems = [
  { label: 'Email', value: 'hello@kmwebdesign.xyz', href: 'mailto:hello@kmwebdesign.xyz' },
  {
    label: 'LinkedIn',
    value: 'kurtanthonymorales',
    href: 'https://www.linkedin.com/in/kurtanthonymorales/',
  },
  { label: 'GitHub', value: 'kurtmorales-tech', href: 'https://github.com/kurtmorales-tech' },
];

export function ContactPage() {
  useSeo(
    'Contact KM Web Design | Restaurant Website Projects',
    "Tell KM Web Design about your restaurant, current website, and goals. We build custom restaurant websites in Las Vegas and beyond.",
    { canonical: '/contact' },
  );
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const openMailto = () => {
      const subject = encodeURIComponent(`Contact from ${data.name || 'visitor'}`);
      const body = encodeURIComponent(
        `Name: ${data.name || ''}\nEmail: ${data.email || ''}\nProject: ${data.project || ''}\nBudget: ${data.budget || ''}\nMessage: ${data.message || ''}`,
      );
      window.location.href = `mailto:hello@kmwebdesign.xyz?subject=${subject}&body=${body}`;
    };

    setStatus('sending');
    try {
      const ok = await submitContact({
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        project: String(data.project ?? ''),
        budget: String(data.budget ?? ''),
        message: String(data.message ?? ''),
      });
      if (ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        openMailto();
      }
    } catch {
      openMailto();
      setStatus('idle');
    }
  }

  return (
    <main id="main-content">
      <section className="pt-32 pb-24 border-b border-gray-100 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-20 items-start">
          <div>
            <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6 reveal">
              Contact
            </span>
            <h1
              className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand mb-8 reveal"
              style={{ transitionDelay: '100ms' }}
            >
              Let&apos;s build something great.
            </h1>
            <p
              className="text-gray-500 leading-relaxed mb-12 reveal"
              style={{ transitionDelay: '200ms' }}
            >
              Tell us about your restaurant, your current website, and the guest action you want to
              improve. We&apos;ll get back to you within one business day.
            </p>
            <ul className="space-y-6 reveal" style={{ transitionDelay: '300ms' }}>
              {contactItems.map((item) => (
                <li key={item.label} className="group flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 w-16 shrink-0">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-sm font-bold text-black group-hover:text-brand transition-colors link-underline"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal-right min-w-0 max-w-full bg-white border border-gray-200 p-6 sm:p-10 relative">
            <div className="absolute top-0 left-0 w-12 h-[2px] bg-brand" />
            <div className="absolute top-0 left-0 w-[2px] h-12 bg-brand" />
            <form className="space-y-6" onSubmit={submit}>
              <div className="grid md:grid-cols-2 gap-6">
                <label>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Name *
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white"
                    placeholder="Your name"
                  />
                </label>
                <label>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Email *
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white"
                    placeholder="your@email.com"
                  />
                </label>
              </div>
              <label>
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Project Type
                </span>
                <select
                  name="project"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white text-gray-700"
                >
                  <option value="">Select a service...</option>
                  <option value="restaurant-website">Restaurant Website</option>
                  <option value="menu-ordering">Menu / Online Ordering</option>
                  <option value="local-seo">Local SEO / Performance</option>
                  <option value="custom-tool">Custom Dashboard / Tool</option>
                  <option value="other">Other / Not sure</option>
                </select>
              </label>
              <label>
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Budget Range
                </span>
                <select
                  name="budget"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white text-gray-700"
                >
                  <option value="">Select a range...</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-3k">$1,000 – $3,000</option>
                  <option value="3k-7k">$3,000 – $7,000</option>
                  <option value="7k-plus">$7,000+</option>
                </select>
              </label>
              <label>
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Message *
                </span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-white resize-none"
                  placeholder="Describe your project, goals, and timeline..."
                />
              </label>
              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                  ✅ Message sent! I&apos;ll get back to you within 24 hours.
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  Something went wrong. Please email hello@kmwebdesign.xyz directly.
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group w-full flex items-center justify-center gap-3 px-10 py-5 bg-brand text-white font-bold hover:bg-brand-dark transition-all duration-300 active:scale-[0.98]"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'} <span aria-hidden>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
