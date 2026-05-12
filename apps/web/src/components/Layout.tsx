import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

function useRevealAndLiveCards() {
  const location = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];
    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale',
    );

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add('revealed'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );
      targets.forEach((target) => observer.observe(target));
      cleanups.push(() => observer.disconnect());
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

export function Layout({ children }: PropsWithChildren) {
  useRevealAndLiveCards();
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
