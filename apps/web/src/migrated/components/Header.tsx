/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const isHome = location.pathname === "/";
  const closeMenu = () => setMenuOpen(false);

  const links = isHome ? (
    <>
      <a href="#projects" onClick={closeMenu} className="hover:text-white transition-colors">Projects</a>
      <a href="#agency" onClick={closeMenu} className="hover:text-white transition-colors">Agency</a>
      <a href="#shop" onClick={closeMenu} className="hover:text-white transition-colors">Shop</a>
      <a href="#articles" onClick={closeMenu} className="hover:text-white transition-colors">Articles</a>
      <a href="#contact" onClick={closeMenu} className="hover:text-white transition-colors">Contact</a>
    </>
  ) : (
    <>
      <Link to="/" onClick={closeMenu} className="hover:text-white transition-colors">Home</Link>
      <Link to="/#projects" onClick={closeMenu} className="hover:text-white transition-colors">Projects</Link>
      <Link to="/#agency" onClick={closeMenu} className="hover:text-white transition-colors">Agency</Link>
      <Link to="/#articles" onClick={closeMenu} className="hover:text-white transition-colors">Articles</Link>
      <Link to="/#contact" onClick={closeMenu} className="hover:text-white transition-colors">Contact</Link>
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/10" : "bg-transparent py-6"}`}>
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" onClick={closeMenu}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter"
          >
            KURT<span className="text-blue-500">.</span>
          </motion.div>
        </Link>

        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          {links}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 border-t border-white/10 bg-black/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-4 text-sm font-medium text-gray-300 [&>a]:rounded-lg [&>a]:px-2 [&>a]:py-2.5 [&>a]:hover:bg-white/5">
            {links}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
