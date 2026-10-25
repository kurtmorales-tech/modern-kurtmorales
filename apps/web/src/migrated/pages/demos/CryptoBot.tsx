/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Cpu, Zap, TrendingUp, ShieldCheck, ArrowRight, LineChart } from "lucide-react";
import { useState, useEffect } from "react";

export default function CryptoBot() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    document.title = "Crypto Flash Loan Bot Demo | Kurt's Portfolio";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Live demo of the Crypto Flash Loan Bot. Automated arbitrage system exploring DeFi opportunities with smart contract execution.");
    }
  }, []);

  const startBot = () => {
    setStatus("Scanning Pools...");
    setLogs(["[SYSTEM] Initializing node connection...", "[INFO] Fetching liquidity pools from Uniswap V3..."]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "[ALERT] Arbitrage opportunity detected: ETH/USDC", "[EXEC] Calculating flash loan parameters..."]);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, "[TX] Flash loan initiated: 100 ETH", "[SUCCESS] Arbitrage executed. Profit: 0.45 ETH"]);
      setStatus("Active");
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest">
            <Cpu className="w-3 h-3" />
            DeFi Engine
          </div>
          <h1 className="text-5xl font-black tracking-tight">Crypto Flash Loan Bot</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Automated arbitrage system exploring DeFi opportunities with smart contract execution. 
            High-frequency execution across multiple chains.
          </p>
        </div>

        {/* Dashboard Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Execution Terminal</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                <span className="text-xs font-mono text-gray-500">{status}</span>
              </div>
            </div>

            <div className="bg-black rounded-2xl p-6 font-mono text-sm text-green-500/80 min-h-[300px] border border-white/5 space-y-2 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-700 italic">System ready for deployment...</div>
              ) : (
                logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </div>

            <button 
              onClick={startBot}
              disabled={status !== "Idle"}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "Idle" ? "Deploy Bot" : "Bot Running..."}
              <Zap className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit"><TrendingUp className="w-5 h-5" /></div>
              <h4 className="font-bold">Live Yields</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">ETH/USDC</span>
                  <span className="text-green-500">+12.4% APR</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">WBTC/DAI</span>
                  <span className="text-green-500">+8.2% APR</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit"><ShieldCheck className="w-5 h-5" /></div>
              <h4 className="font-bold">Security Protocols</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Multi-sig wallet integration and automated slippage protection for every transaction.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
