'use client';

import { useEffect, useState } from 'react';

const INTRO_KEY = 'necoll_intro_seen';

export default function SiteEntrance() {
  const [phase, setPhase] = useState<'hidden' | 'active' | 'exit'>('hidden');

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

    const exitTimer = window.setTimeout(() => setPhase('exit'), 3000);
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
      className={`bw-splash ${phase === 'exit' ? 'bw-splash--exit' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="bw-splash__panel bw-splash__panel--left" />
      <div className="bw-splash__panel bw-splash__panel--right" />

      <div className="bw-splash__content">
        <div className="bw-splash__logo" dir="ltr">
          <span className="bw-splash__n" aria-hidden="true">
            N
          </span>
          <span className="bw-splash__rest">ecoll</span>
        </div>
        <div className="bw-splash__rule" />
        <p className="bw-splash__tagline">Women&apos;s Fashion Boutique</p>
      </div>
    </div>
  );
}
