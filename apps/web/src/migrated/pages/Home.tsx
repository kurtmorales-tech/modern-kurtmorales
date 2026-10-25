/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useState, FormEvent, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Globe, 
  Rocket,
  ArrowRight,
  CheckCircle2,
  Zap,
  Layers,
  Download,
  Terminal,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

import { 
  projects, 
  articles, 
  testimonials, 
  digitalProducts 
} from "../constants";

export default function Home() {
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = selectedTag 
    ? articles.filter(a => a.tag === selectedTag)
    : articles;

  const allTags = Array.from(new Set(articles.map(a => a.tag)));

  useEffect(() => {
    document.title = "Kurt | Builder, AI Explorer & Entrepreneur";
    
    // SEO Meta Tags
    const metaTags = [
      { name: "description", content: "Kurt is a builder focused on AI, crypto, SaaS, and business systems." },
      { name: "keywords", content: "AI, Crypto, SaaS, Web Development, Entrepreneurship, Flash Loans, CRM" },
      { name: "author", content: "Kurt" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" }
    ];

    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (element) {
        element.setAttribute("content", tag.content);
      } else {
        element = document.createElement('meta');
        (element as HTMLMetaElement).name = tag.name;
        (element as HTMLMetaElement).content = tag.content;
        document.head.appendChild(element);
      }
    });
  }, []);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    window.location.href = `mailto:email@kmwebdesign.xyz?subject=Portfolio Contact&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 relative z-10"
        >
          {/* Animated Avatar */}
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
              <div className="relative w-32 h-32 rounded-full bg-black border border-white/10 flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden">
                <span className="bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                  KM
                </span>
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full scale-110"
                />
              </div>
            </motion.div>

            {/* Live Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Available for Q3 Projects
              </span>
              <div className="w-px h-3 bg-white/10 mx-1" />
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Verified Builder
              </span>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-black tracking-tight"
            >
              Kurt
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 font-medium"
            >
              Builder <span className="text-blue-500">•</span> AI Explorer <span className="text-purple-500">•</span> Entrepreneur
            </motion.p>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            I architect systems at the intersection of AI, crypto, and SaaS. 
            My obsession is transforming complex technical concepts into 
            high-impact, real-world products.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#projects" 
              className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2 group"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* KM WEBDESIGN AGENCY SECTION */}
      <section id="agency" className="mt-40 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Agency
                </div>
                <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">My Agency</h2>
                <h3 className="text-5xl font-black leading-tight">
                  KM Webdesign <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Digital Empires
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Transforming ambitious visions into high-performance realities. 
                  From custom design systems to enterprise-grade web applications.
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter">SEO Optimized</span>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://kmwebdesign.pages.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all group shadow-xl shadow-blue-600/20"
                >
                  Visit Agency
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black/40 backdrop-blur-sm">
                <iframe 
                  src="https://kmwebdesign.pages.dev" 
                  className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                  title="KM Webdesign"
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* THE KM BLUEPRINT (PROCESS) */}
      <section id="process" className="mt-40 scroll-mt-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Execution</h2>
          <h3 className="text-4xl font-bold">The KM Blueprint</h3>
          <p className="text-gray-500 max-w-xl mx-auto">How I transform ideas into production-ready systems.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Audit", desc: "Technical roadmap & feasibility analysis." },
            { step: "02", title: "Architect", desc: "System design & protocol integration." },
            { step: "03", title: "Build", desc: "Rapid prototyping & AI orchestration." },
            { step: "04", title: "Scale", desc: "Optimization & business automation." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative group"
            >
              <div className="text-4xl font-black text-white/5 group-hover:text-blue-500/20 transition-colors mb-4">{item.step}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="mt-40 scroll-mt-32">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Portfolio</h2>
            <h3 className="text-4xl font-bold">Featured Projects</h3>
          </div>
          <div className="hidden md:block text-gray-500 text-sm font-medium">
            Live sites, local builds, and shipped experiments
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/20"
            >
              <div className={`pointer-events-none absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${p.color} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`} />

              <Link
                to={p.path}
                aria-label={`Open the ${p.title} case study`}
                className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              />

              {p.image && (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/5 bg-white/[0.02]">
                  <img
                    src={p.image}
                    alt={`${p.title} interface`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${
                      p.imageFit === "contain"
                        ? "object-contain p-8"
                        : "object-cover object-top"
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent" />
                </div>
              )}

              <div className="relative z-0 flex flex-1 flex-col p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div className="rounded-2xl bg-white/5 p-3 text-white transition-transform group-hover:scale-110">
                    {p.icon}
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-tighter ${p.live ? 'border-green-500/50 text-green-500' : 'border-blue-500/50 text-blue-500'}`}>
                    {p.status}
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-blue-400">{p.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-400">{p.desc}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                    {p.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors group-hover:text-white">
                    Case study
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.hrefLabel ?? "Launch"} — ${p.title}`}
                  className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  Launch
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <Link
            to="/#contact"
            className="group flex flex-col gap-6 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-white/[0.02] to-purple-500/10 p-8 transition-colors hover:border-blue-400/40 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                Next
              </p>
              <h3 className="mt-2 text-2xl font-bold">Have a build in mind?</h3>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                I take on AI, web, and internal-tooling projects.
                <span className="inline-flex items-center gap-2 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Available for projects
                </span>
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white">
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </section>

      {/* ARTICLES SECTION */}
      <section id="articles" className="mt-40 scroll-mt-32">
        <div className="flex flex-wrap items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-purple-500 uppercase tracking-widest">Insights</h2>
            <h3 className="text-4xl font-bold">Latest Articles</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${!selectedTag ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${selectedTag === tag ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredArticles.map((article, i) => (
            <Link 
              key={article.id}
              to={`/articles/${article.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedTag(article.tag);
                      }}
                      className={`${article.color} hover:underline`}
                    >
                      {article.tag}
                    </button>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{article.date}</span>
                  </div>
                  <h4 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{article.title}</h4>
                  <p className="text-gray-400 max-w-2xl">{article.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-medium whitespace-nowrap">{article.readTime}</span>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="mt-40 scroll-mt-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Social Proof</h2>
          <h3 className="text-4xl font-bold">What Collaborators Say</h3>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 inline mr-1 text-blue-500" />
            Verified via Client Feedback
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all space-y-6 relative group"
            >
              {t.verified && (
                <div className="absolute top-4 right-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-400 italic leading-relaxed">
                "{t.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DIGITAL PRODUCTS & MONETIZATION */}
      <section id="shop" className="mt-40 scroll-mt-32">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Store</h2>
            <h3 className="text-4xl font-bold">Digital Products</h3>
          </div>
          <div className="hidden md:block text-gray-500 text-sm font-medium">
            Premium assets for serious builders
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {digitalProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-orange-600/5 border border-orange-600/10 hover:border-orange-600/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <div className="text-2xl font-black text-orange-500/20 group-hover:text-orange-500/40 transition-colors">{product.price}</div>
              </div>
              
              <div className="space-y-6">
                <div className="p-3 w-fit rounded-2xl bg-orange-600/10 text-orange-500">
                  {product.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{product.tag}</div>
                  <h4 className="text-2xl font-bold">{product.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{product.desc}</p>
                </div>
                <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Get Access
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MONETIZATION & TRAFFIC (NEWSLETTER & CONSULTATION) */}
      <section id="growth" className="mt-40 scroll-mt-32">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Newsletter / Lead Magnet */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[2.5rem] bg-blue-600/10 border border-blue-600/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">The AI & Crypto Edge</h3>
              <p className="text-gray-400 leading-relaxed">
                Join 5,000+ builders. Get weekly insights on autonomous systems, 
                DeFi protocols, and SaaS scaling strategies delivered to your inbox.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 rounded-full bg-black border border-white/10 focus:border-blue-500 outline-none transition-all"
                />
                <button className="px-8 py-4 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition-all">
                  Join
                </button>
              </form>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                No spam. Just high-signal engineering.
              </p>
            </div>
          </motion.div>

          {/* Direct Monetization / Consultation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[2.5rem] bg-purple-600/10 border border-purple-600/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Strategy Consultation</h3>
              <p className="text-gray-400 leading-relaxed">
                Need to architect a complex AI system or a DeFi-economic model? 
                Book a 1-on-1 session to audit your technical roadmap.
              </p>
              <div className="pt-4">
                <a 
                  href="https://kmwebdesign-booking.base44.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20"
                >
                  Book a Session
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                Limited slots available for Q2 2026.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MINDSET SECTION */}
      <section id="mindset" className="mt-40 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Code2 className="w-32 h-32" />
          </div>
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Philosophy</h2>
            <h3 className="text-4xl font-bold mb-6 italic">"I learn by building."</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Theory is a starting point, but execution is the only true validator. 
              I focus on building autonomous systems, business automation, and 
              crypto-economic structures that solve actual problems. 
              If it doesn't run, it doesn't count.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="mt-40 scroll-mt-32">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Connect</h2>
              <h3 className="text-5xl font-bold">Let's build something great.</h3>
              <p className="text-gray-400 text-lg">
                Whether you have a project in mind or just want to talk tech, 
                reach out through any of these channels.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a 
                href="https://wa.me/17027585543" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-green-500 uppercase tracking-tighter">WhatsApp</div>
                  <div className="text-lg font-semibold">+1 (702) 758-5543</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-600/10 border border-blue-600/20">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-500 uppercase tracking-tighter">Email</div>
                  <div className="text-lg font-semibold">email@kmwebdesign.xyz</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                <textarea
                  className="w-full p-4 rounded-2xl bg-black border border-white/10 focus:border-blue-500 outline-none transition-all min-h-[200px] resize-none text-gray-300"
                  placeholder="Tell me about your idea..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
