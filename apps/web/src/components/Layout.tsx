import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { SiteAssistant } from './SiteAssistant';

function useRevealAndLiveCards() {
  const location = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];
    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

    const reveal = (target: HTMLElement) => target.classList.add('revealed');

    if (reduceMotion) {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(reveal);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
      );

      const revealIfInView = () => {
        document.querySelectorAll<HTMLElement>(SELECTOR).forEach((target) => {
          if (target.classList.contains('revealed')) return;
          const rect = target.getBoundingClientRect();
          if (rect.top < window.innerHeight + 80) {
            target.classList.add('revealed');
            observer.unobserve(target);
          } else {
            observer.observe(target);
          }
        });
      };
      revealIfInView();

      const onScroll = () => window.requestAnimationFrame(revealIfInView);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);

      const mo = new MutationObserver(() => revealIfInView());
      mo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        mo.disconnect();
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    }

    // Ensure any reveal elements added later (async data) become visible
    if (reduceMotion) {
      const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches(SELECTOR)) node.classList.add('revealed');
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach((t) => t.classList.add('revealed'));
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => mo.disconnect());
    }

    document.querySelectorAll<HTMLElement>('[data-live-card]').forEach((el) => {
      const reset = () => {
        el.style.setProperty('--pointer-active', '0');
        if (!reduceMotion) el.style.removeProperty('transform');
      };
      const enter = () => el.style.setProperty('--pointer-active', '1');
      const move = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        el.style.setProperty('--pointer-x', `${x}px`);
        el.style.setProperty('--pointer-y', `${y}px`);
        el.style.setProperty('--pointer-active', '1');

        if (!reduceMotion) {
          const rotateY = (x / rect.width - 0.5) * 5;
          const rotateX = (y / rect.height - 0.5) * -5;
          el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        }
      };

      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset, true);
      cleanups.push(() => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', reset);
        el.removeEventListener('blur', reset, true);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

export function Layout() {
  useRevealAndLiveCards();
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <SiteAssistant />
    </>
  );
}
