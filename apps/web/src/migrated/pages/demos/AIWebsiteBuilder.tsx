/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Globe, Wand2, Layout, Zap, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function AIWebsiteBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = "AI Website Builder Demo | Kurt's Portfolio";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Live demo of the AI Website Builder platform. Generate production-ready websites in seconds using advanced LLMs.");
    }
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <Globe className="w-3 h-3" />
            Live Demo
          </div>
          <h1 className="text-5xl font-black tracking-tight">AI Website Builder</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Transform your ideas into production-ready websites in seconds. 
            Powered by advanced LLMs and optimized for performance.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Try the Generator</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A modern landing page for a coffee shop in Tokyo"
                className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate"}
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="aspect-video rounded-3xl bg-black border border-white/5 flex items-center justify-center relative overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-blue-500" />
                </motion.div>
                <p className="text-gray-500 font-mono text-sm animate-pulse">Architecting layout components...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Layout className="w-16 h-16 text-gray-800 mx-auto" />
                <p className="text-gray-600">Enter a prompt to see the magic happen</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Instant Deployment", desc: "One-click deploy to global edge networks." },
            { icon: <Layout className="w-5 h-5" />, title: "Responsive Design", desc: "Pixel-perfect layouts for all screen sizes." },
            { icon: <Sparkles className="w-5 h-5" />, title: "AI Copywriting", desc: "SEO-optimized content generated automatically." }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit">{f.icon}</div>
              <h4 className="font-bold">{f.title}</h4>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
