import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, Mail, Phone, Github, Linkedin, Twitter, 
  Menu, X, CheckCircle2, Cloud, Code, Layout, ArrowRight,
  Shield, FileText, Globe, Facebook 
} from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [currentYear] = useState(new Date().getFullYear());

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kurt Anthony Morales",
    "brand": "KurtMorales",
    "jobTitle": "Freelance Web Designer & Junior Developer",
    "url": "https://kurtmorales.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Las Vegas",
      "addressRegion": "NV"
    },
    "sameAs": [
      "https://github.com/kurtmorales-tech",
      "https://www.linkedin.com/in/kurtanthonymorales/",
      "https://x.com/xkamhype",
      "https://www.facebook.com/kamhypeofficial",
      "https://developers.google.com/profile/u/kurtmorales-developer"
    ]
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const Modal = ({ type, onClose }: { type: 'privacy' | 'terms', onClose: () => void }) => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-12 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-display font-medium mb-8 text-black">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h2>
        <div className="prose prose-sm text-gray-500 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last updated: April 2026</p>
          {type === 'privacy' ? (
            <div className="space-y-6">
              <p>At KurtMorales, your privacy is fundamental. This policy outlines how we handle any information collected during our digital design engagements.</p>
              <h3 className="text-black font-bold uppercase tracking-widest text-[10px]">01. Data Collection</h3>
              <p>We only collect data voluntarily provided via contact forms (name, email, project details) to facilitate business communication.</p>
              <h3 className="text-black font-bold uppercase tracking-widest text-[10px]">02. Information Usage</h3>
              <p>Data is used exclusively for project coordination. We do not transmit information to third-party data brokers or marketing services.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p>By using KurtMorales services, you agree to these standard operating terms regarding project delivery and intellectual property.</p>
              <h3 className="text-black font-bold uppercase tracking-widest text-[10px]">01. Service Engagement</h3>
              <p>All projects are governed by a mutually agreed scope of work. KurtMorales reserves the right to adjust timelines based on technical complexity.</p>
              <h3 className="text-black font-bold uppercase tracking-widest text-[10px]">02. Intellectual Property</h3>
              <p>Ownership of produced digital assets is transferred to the client upon receipt of final project payment, unless otherwise specified.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-brand selection:text-white">
      <Helmet>
        <title>KurtMorales | Web Designer & Junior Developer Las Vegas</title>
        <meta name="description" content="KurtMorales - Las Vegas freelance web designer building clean, SEO-optimized websites, booking systems, and lightweight web apps for small businesses." />
        <meta name="keywords" content="KurtMorales, web designer las vegas, junior developer, freelance web design, reactive websites, booking systems for small business" />
        <link rel="canonical" href="https://kurtmorales.com" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <AnimatePresence>
        {legalModal && <Modal type={legalModal} onClose={() => setLegalModal(null)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between" aria-label="Main navigation">
          <a href="#home" className="text-xl font-bold tracking-tight hover:text-brand transition-colors">
            Kurt<span className="text-brand">Morales</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#services" className="hover:text-brand transition-colors">Services</a>
            <a href="#projects" className="hover:text-brand transition-colors">Projects</a>
            <a href="#skills" className="hover:text-brand transition-colors">Skills</a>
            <a href="#contact" className="px-6 py-2 bg-brand text-white rounded-none hover:opacity-90 transition-all active:scale-95">
              Contact
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-white border-b border-gray-200 p-6 flex flex-col gap-4 md:hidden shadow-xl"
            >
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2">Services</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2">Projects</a>
              <a href="#skills" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2">Skills</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold py-2 text-black">Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative pt-32 pb-40 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
            <motion.div {...fadeIn}>
              <span className="inline-block text-[10px] font-black tracking-[0.3em] uppercase mb-8 text-gray-400">
                Web Design & Development
              </span>
              <h1 className="text-5xl md:text-8xl font-display font-medium leading-[0.95] tracking-tight mb-10 text-brand">
                Purposeful design.<br/>Fast performance.
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
                KurtMorales builds high-performance web experiences that focus on clarity, conversion, and long-term business growth.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:email@kurtmorales.com" className="px-10 py-5 bg-brand text-white font-bold flex items-center gap-3 hover:opacity-90 transition-all active:scale-95">
                    Let's Talk Projects <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="#projects" className="px-10 py-5 border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all active:scale-95">
                    Explore Portfolio
                  </a>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Preferred contact: Email or Social Media
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-gray-900 p-10 relative bg-white"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 bg-black" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Current Availability</span>
              </div>
              <h2 className="text-2xl font-display font-medium mb-8 leading-tight">Delivering clean solutions for local & global businesses.</h2>
              <ul className="space-y-5 text-sm text-gray-500">
                {[
                  'Las Vegas based, globally active',
                  'Cloudflare & Vercel deployment',
                  'Modern TypeScript architecture',
                  'User-centric interface design'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1 w-1.5 h-1.5 border border-gray-300 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Metrics Strip */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { val: '19+', label: 'Public repos' },
                { val: '4+', label: 'Badges earned' },
                { val: '100%', label: 'Responsive' },
                { val: 'Fast', label: 'Static delivery' }
              ].map((m, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="text-4xl font-display font-medium text-brand mb-2">{m.val}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mb-24">
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">Expertise</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand">
                Digital products for service providers.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                { 
                  icon: <Layout className="w-5 h-5" />, 
                  title: 'Brand Websites', 
                  desc: 'High-clarity interfaces designed to build trust and present your services effectively.' 
                },
                { 
                  icon: <ArrowRight className="w-5 h-5 rotate-[-45deg]" />, 
                  title: 'Conversion Pages', 
                  desc: 'Goal-oriented landing pages optimized for maximum lead acquisition and sales.' 
                },
                { 
                  icon: <Code className="w-5 h-5" />, 
                  title: 'Custom Tools', 
                  desc: 'Bespoke dashboards, booking systems, and interactive calculators for business workflows.' 
                }
              ].map((s, i) => (
                <motion.article 
                  key={i} 
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="mb-8 p-4 border border-gray-100 w-fit">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-6 text-black tracking-tight">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-32 bg-ice border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mb-24">
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand text-pretty">
                Selected works and digital experiments.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 overflow-hidden">
              {[
                {
                  type: 'Client Concept',
                  tech: 'React / Vite',
                  title: 'Braids by Jaira',
                  desc: 'Boutique hair styling site with booking flow, gallery, and AI-powered consult.',
                  link: 'https://github.com/Kacmnetworkk/Braids-by-jairah'
                },
                {
                  type: 'Platform',
                  tech: 'Cloudflare',
                  title: 'RavFia Platform',
                  desc: 'Open-source platform focused on AI tooling and serverless deployment.',
                  link: 'https://github.com/Kacmnetworkk/ravfia'
                },
                {
                  type: 'Ecommerce',
                  tech: 'Next / Tailwind',
                  title: 'QuickCart',
                  desc: 'Minimal e-commerce starter template made for fast online store launches.',
                  link: 'https://github.com/Kacmnetworkk/QuickCart'
                },
                {
                  type: 'Directory',
                  tech: 'TypeScript',
                  title: 'Cuepal Directory',
                  desc: 'A pool league finder concept connecting players with local game communities.',
                  link: 'https://github.com/Kacmnetworkk/Cuepal-Directory'
                },
                {
                  type: 'Tooling',
                  tech: 'API Concept',
                  title: 'RavFia SecurePass',
                  desc: 'Cryptographic password generation and privacy-first tooling direction.',
                  link: 'https://github.com/Kacmnetworkk'
                },
                {
                  type: 'Studio',
                  tech: 'Web Design',
                  title: 'KurtMorales Design',
                  desc: 'Brand focused on modern, fast, SEO-conscious websites for local companies.',
                  link: 'https://kurtmorales.com'
                }
              ].map((p, i) => (
                <motion.article 
                  key={i}
                  {...fadeIn}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col bg-white p-12 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{p.type}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-black">{p.tech}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black tracking-tight">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-12 flex-grow">{p.desc}</p>
                  <a 
                    href={p.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-100 opacity-60 transition-opacity"
                  >
                    Explore Repository <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-24 overflow-hidden border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
            <div>
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">Toolkit</span>
              <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight mb-6 text-brand">
                Architectural foundations.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                Focusing on practical tools that help businesses launch quickly: clean interfaces, responsive frontends, and cloud deployment workflows.
              </p>
              <div className="flex items-center gap-4 text-gray-300">
                <Cloud className="w-5 h-5" />
                <Code className="w-5 h-5" />
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 
                'Tailwind CSS', 'Cloudflare Pages', 'Cloudflare Workers', 
                'Google Cloud', 'GitHub', 'Linux', 'AI Integration', 'SEO Fundamentals'
              ].map((skill, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-white text-black font-bold text-[10px] uppercase tracking-widest border border-gray-200 transition-colors hover:bg-brand hover:text-white cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* Digital Footprint Section */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
             <div className="max-w-2xl mb-24">
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">Network</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight text-brand">
                Presence across platforms.
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-gray-200 border border-gray-200 overflow-hidden">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/kurtanthonymorales/', icon: <Linkedin className="w-4 h-4" /> },
                { name: 'GitHub', url: 'https://github.com/kurtmorales-tech', icon: <Github className="w-4 h-4" /> },
                { name: 'Google Dev', url: 'https://developers.google.com/profile/u/kurtmorales-developer', icon: <Globe className="w-4 h-4" /> },
                { name: 'Google Skills', url: 'https://www.skills.google/public_profiles/e568df3b', icon: <Shield className="w-4 h-4" /> },
                { name: 'MS Learn', url: 'https://learn.microsoft.com/', icon: <Cloud className="w-4 h-4" /> },
                { name: 'Facebook', url: 'https://www.facebook.com/kamhypeofficial', icon: <Facebook className="w-4 h-4" /> },
                { name: 'X', url: 'https://x.com/xkamhype', icon: <Twitter className="w-4 h-4" /> }
              ].map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-10 bg-white hover:bg-brand group transition-colors text-center h-full"
                >
                  <div className="mb-6 group-hover:text-white transition-colors text-black">
                    {link.icon}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* WordPress Excellence */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl mb-24">
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-6">Expertise</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium leading-[1.1] text-brand mb-10">
                Scalable WordPress solutions for growing businesses.
              </h2>
              <div className="space-y-6 text-gray-500 leading-relaxed">
                <p>
                  WordPress powers over 40% of the web, and for good reason. I help small businesses harness that power by building modern, responsive WordPress websites that go beyond basic templates. My focus is on creating clean, SEO-friendly structures that are easy for you to manage while providing a premium experience for your customers.
                </p>
                <p>
                  Whether you need a brand-new site, a high-converting landing page, or a performance-tuned WooCommerce store, I bridge the gap between design and development to ensure your online presence is as professional as your service.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 overflow-hidden mb-20">
              {[
                { 
                  title: 'Block-Based Design', 
                  desc: 'Crafting custom layouts using the Gutenberg editor for a fast, modular, and easy-to-edit backend.' 
                },
                { 
                  title: 'WooCommerce Setup', 
                  desc: 'Building streamlined online stores that focus on clear product presentation and frictionless checkout.' 
                },
                { 
                  title: 'SEO Implementation', 
                  desc: 'Optimizing site structure, meta data, and speed to help your business rank higher in local searches.' 
                },
                { 
                  title: 'Custom CSS/HTML', 
                  desc: 'Full control over styling to ensure your brand looks unique, moving beyond "off-the-shelf" theme limits.' 
                },
                { 
                  title: 'Performance Tuning', 
                  desc: 'Improving load times and Core Web Vitals to keep users engaged and reduce bounce rates.' 
                },
                { 
                  title: 'Mobile Optimization', 
                  desc: 'Ensuring your WordPress site performs flawlessly on smartphones, tablets, and desktops alike.' 
                }
              ].map((skill, i) => (
                <div key={i} className="bg-white p-12 hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-bold mb-4 text-black tracking-tight">{skill.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a href="#contact" className="inline-flex items-center gap-3 px-10 py-5 bg-brand text-white font-bold hover:opacity-90 transition-all active:scale-95 mb-6">
                Build My WordPress Site <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Starting from design through to final deployment.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-gray-100/50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.6fr_1.4fr] gap-12 items-start">
            <div>
              <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase block mb-4">Workflow</span>
              <h2 className="text-3xl font-display font-medium leading-tight text-brand">
                Simple, results-driven engineering.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Plan', desc: 'Clarify goals, offer, and conversion targets.' },
                { title: 'Design', desc: 'Modern layout with mobile-first hierarchy.' },
                { title: 'Build', desc: 'Clean code focused on speed and SEO.' },
                { title: 'Deploy', desc: 'Instant global delivery via Cloudflare.' }
              ].map((step, i) => (
                <div key={i} className="bg-white p-10 border border-gray-200">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-4">Step 0{i+1}</span>
                  <h3 className="font-bold text-lg mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-40 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div {...fadeIn}>
              <span className="text-gray-400 font-bold text-[10px] tracking-[0.3em] uppercase block mb-10">Collaboration</span>
              <h2 className="text-5xl md:text-8xl font-display font-medium leading-[0.95] tracking-tight mb-16 text-[#473f35]">
                Start your next project.
              </h2>
              <p className="text-lg text-gray-500 mb-20 max-w-xl mx-auto leading-relaxed">
                Connect with KurtMorales for clean, high-performance web solutions.
              </p>
              <div className="grid md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
                <a href="mailto:email@kurtmorales.com" className="bg-white py-16 px-8 flex flex-col items-center gap-4 hover:bg-brand hover:text-white transition-all group overflow-hidden">
                  <Mail className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-white transition-colors">Direct Email</span>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-white/80 transition-colors">email@kurtmorales.com</span>
                  <span className="mt-4 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4 text-white">Send Message</span>
                </a>
                <a href="https://www.linkedin.com/in/kurtanthonymorales/" target="_blank" rel="noreferrer" className="bg-white py-16 px-8 flex flex-col items-center gap-4 hover:bg-brand hover:text-white transition-all group overflow-hidden">
                  <Linkedin className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-white transition-colors">LinkedIn DM</span>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-white/80 transition-colors">Kurt Anthony Morales</span>
                  <span className="mt-4 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4 text-white">Connect Now</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-black py-32 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-20 items-start">
            <div>
              <a href="#home" className="text-2xl font-bold tracking-tight mb-8 block">
                Kurt<span className="text-accent">Morales</span>
              </a>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Professional web solutions for service providers. Building clarity and performance into every pixel.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black block mb-6">Navigation</span>
                <ul className="space-y-4 text-sm text-gray-500 font-medium">
                  <li><a href="#services" className="hover:text-black transition-colors">Services</a></li>
                  <li><a href="#projects" className="hover:text-black transition-colors">Projects</a></li>
                  <li><a href="#skills" className="hover:text-black transition-colors">Skills</a></li>
                  <li><a href="#contact" className="hover:text-black transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black block mb-6">Legal & Meta</span>
                <ul className="space-y-4 text-sm text-gray-500 font-medium">
                  <li><button onClick={() => setLegalModal('privacy')} className="hover:text-black transition-colors text-left">Privacy Policy</button></li>
                  <li><button onClick={() => setLegalModal('terms')} className="hover:text-black transition-colors text-left">Terms of Service</button></li>
                  <li><a href="mailto:admin@kurtmorales.com" className="hover:text-black transition-colors">Admin Support</a></li>
                  <li><a href="https://github.com/kurtmorales-tech" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">System Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              © {currentYear} KurtMorales Studio. All rights reserved.
            </p>
            <div className="flex gap-8">
              {[
                { icon: <Github className="w-4 h-4" />, url: 'https://github.com/kurtmorales-tech' },
                { icon: <Linkedin className="w-4 h-4" />, url: 'https://www.linkedin.com/in/kurtanthonymorales/' },
                { icon: <Twitter className="w-4 h-4" />, url: 'https://x.com/xkamhype' }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-black hover:opacity-100 opacity-30 transition-opacity">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
