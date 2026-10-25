/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Rocket, Brain, BarChart3, Zap, ArrowRight, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function AITrading() {
  const [price, setPrice] = useState(65432.10);
  const [sentiment, setSentiment] = useState("Bullish");

  useEffect(() => {
    document.title = "AI Trading Agent Demo | Kurt's Portfolio";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Live demo of the AI Trading Agent. Autonomous AI system for real-time market analysis and high-frequency execution.");
    }

    const interval = setInterval(() => {
      setPrice(prev => prev + (Math.random() * 10 - 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest">
            <Rocket className="w-3 h-3" />
            Coming Soon
          </div>
          <h1 className="text-5xl font-black tracking-tight">AI Trading Agent</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Autonomous AI system for real-time market analysis and high-frequency execution. 
            Harnessing the power of neural networks for predictive trading.
          </p>
        </div>

        {/* Trading Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Market Intelligence</h3>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">BTC/USD</div>
                  <div className="text-2xl font-mono text-green-500">${price.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-3xl bg-black border border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {/* Mock Chart Background */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,50 Q25,30 50,70 T100,20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-500" />
                </svg>
              </div>
              <div className="text-center space-y-4 relative z-10">
                <Brain className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
                <p className="text-gray-400 font-mono text-sm">Neural Network Analyzing Patterns...</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Sentiment</div>
                <div className="text-lg font-bold text-green-500">{sentiment}</div>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Volatility</div>
                <div className="text-lg font-bold text-blue-500">Low</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500 w-fit"><Activity className="w-5 h-5" /></div>
              <h4 className="font-bold">Real-time Analysis</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Processing millions of data points per second to identify micro-trends before they emerge.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500 w-fit"><Zap className="w-5 h-5" /></div>
              <h4 className="font-bold">Low Latency</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Optimized execution engine with millisecond response times across major exchanges.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
