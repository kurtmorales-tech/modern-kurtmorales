/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, MessageCircle, Link2, ThumbsUp, Share2, Rocket } from "lucide-react";
import { useEffect } from "react";

import { articles, digitalProducts } from "../constants";

export default function ArticleDetail() {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Kurt's Insights`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", article.excerpt);
      }
    }
  }, [article]);

  const shareUrl = window.location.href;
  const shareTitle = article?.title || "";

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Article Not Found</h1>
          <Link to="/" className="text-blue-500 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase">
            <span className={`px-3 py-1 rounded-full bg-white/5 ${article.color}`}>
              {article.tag}
            </span>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-3 h-3" />
              {article.date}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-400 italic leading-relaxed border-l-4 border-blue-500 pl-6">
            {article.excerpt}
          </p>

          <div className="prose prose-invert max-w-none pt-8">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-300 text-lg leading-relaxed mb-6">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg font-black">
                KM
              </div>
              <div>
                <div className="font-bold">Kurt</div>
                <div className="text-sm text-gray-500">AI Explorer & Builder</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                <Share2 className="w-3 h-3" /> Share
              </span>
              <button 
                onClick={shareOnTwitter}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                aria-label="Share on Twitter"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={shareOnLinkedIn}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-600/10 transition-all"
                aria-label="Share on LinkedIn"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button 
                onClick={shareOnFacebook}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                aria-label="Share on Facebook"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RELATED RESOURCES / CTA */}
        <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Rocket className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to build your own?</h3>
              <p className="text-gray-400">
                If you found this article helpful, you'll love my premium resources 
                designed to help you ship faster and smarter.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {digitalProducts.map((product, i) => (
                <Link 
                  key={i}
                  to="/#shop"
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group/item"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/5 text-blue-400 group-hover/item:scale-110 transition-transform">
                      {product.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-500">{product.price}</span>
                  </div>
                  <h4 className="font-bold mb-1">{product.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{product.desc}</p>
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                to="/#contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Or book a custom consultation
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
