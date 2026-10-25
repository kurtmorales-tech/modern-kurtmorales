/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Code2, MessageCircle, Camera, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

const socials = [
  { name: "GitHub", icon: <Code2 className="w-5 h-5" />, href: "https://github.com/kurtmorales-tech" },
  { name: "X", icon: <MessageCircle className="w-5 h-5" />, href: "https://x.com/xkamhype" },
  { name: "Instagram", icon: <Camera className="w-5 h-5" />, href: "https://www.instagram.com/kamhypeofficial/" },
  { name: "Facebook", icon: <ThumbsUp className="w-5 h-5" />, href: "https://www.facebook.com/kamhypeofficial" },
];

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Kurt. Built for the future.
        </div>
        <div className="flex gap-4 text-xs text-gray-600">
          <Link to="/#articles" className="hover:text-white transition-colors">Articles</Link>
          <Link to="/demo/ai-website-builder" className="hover:text-white transition-colors">AI Builder</Link>
          <Link to="/demo/crypto-bot" className="hover:text-white transition-colors">Crypto Bot</Link>
          <Link to="/demo/restaurant-crm" className="hover:text-white transition-colors">CRM SaaS</Link>
          <Link to="/demo/ai-trading" className="hover:text-white transition-colors">Trading AI</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>

      <div className="flex gap-6">
        {socials.map((social) => (
          <a 
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label={social.name}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
