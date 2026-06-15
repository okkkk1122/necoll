'use client';

import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/** Scroll-based parallax offset relative to viewport center */
export function useParallax(speed = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) return;

    let ticking = false;

    const update = () => {
      const el = ref.current;
      if (!el) {
        ticking = false;
        return;
      }
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height * 0.5;
      const delta = (centerY - window.innerHeight * 0.5) * speed;
      setOffset(delta);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, reduced]);

  return {
    ref,
    style: reduced
      ? undefined
      : ({ transform: `translate3d(0, ${offset}px, 0)`, willChange: 'transform' } as const),
  };
}
