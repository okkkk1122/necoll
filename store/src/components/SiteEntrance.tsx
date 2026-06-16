'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Logo from './Logo';

const INTRO_KEY = 'necal_intro_seen';

export default function SiteEntrance() {
  const [phase, setPhase] = useState<'hidden' | 'active' | 'exit'>('hidden');

  const tagline = 'Women\'s Fashion Boutique';

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem(INTRO_KEY, '1');
        return;
      }
    } catch {
      return;
    }

    setPhase('active');
    document.body.style.overflow = 'hidden';

    const exitTimer = window.setTimeout(() => setPhase('exit'), 3400);
    const hideTimer = window.setTimeout(() => {
      setPhase('hidden');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 4200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`site-entrance ${phase === 'exit' ? 'site-entrance--exit' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="site-entrance__bg" />
      <div className="site-entrance__mesh" />

      <div className="site-entrance__ring site-entrance__ring--1" />
      <div className="site-entrance__ring site-entrance__ring--2" />
      <div className="site-entrance__ring site-entrance__ring--3" />

      <div className="site-entrance__particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="site-entrance__particle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <div className="site-entrance__curtain site-entrance__curtain--left" />
      <div className="site-entrance__curtain site-entrance__curtain--right" />

      <div className="site-entrance__content">
        <p className="site-entrance__eyebrow font-nav">Welcome to</p>

        <div className="site-entrance__brand-logo">
          <Logo size="splash" showText linkToHome={false} className="justify-center" />
        </div>

        <p className="site-entrance__tagline font-nav">{tagline}</p>

        <div className="site-entrance__progress">
          <div className="site-entrance__progress-bar" />
        </div>
      </div>
    </div>
  );
}
