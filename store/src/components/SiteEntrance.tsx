'use client';

import { useConfig } from '@/lib/config-context';
import { resolveLogoUrl } from '@/lib/media';
import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const INTRO_KEY = 'necal_intro_seen';

export default function SiteEntrance() {
  const config = useConfig();
  const [phase, setPhase] = useState<'hidden' | 'active' | 'exit'>('hidden');

  const siteNameFa = config.site_name?.fa || 'نکال';
  const siteNameEn = config.site_name?.en || 'necoll';
  const tagline = 'Women\'s Fashion Boutique';
  const logoSrc = resolveLogoUrl(config.site_logo);

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

        <div className="site-entrance__logo-wrap">
          <div className="site-entrance__logo-orbit" />
          <div className="site-entrance__logo-ring">
            <div className="site-entrance__logo">
              <Image
                src={logoSrc}
                alt={siteNameFa}
                fill
                className="object-cover"
                priority
                sizes="140px"
                unoptimized
              />
            </div>
          </div>
        </div>

        <h1 className="site-entrance__brand font-heading">
          {siteNameFa.split('').map((char, i) => (
            <span key={i} className="site-entrance__brand-char" style={{ '--ci': i } as CSSProperties}>
              {char}
            </span>
          ))}
        </h1>

        <p className="site-entrance__brand-en">{siteNameEn}</p>
        <p className="site-entrance__tagline font-nav">{tagline}</p>

        <div className="site-entrance__progress">
          <div className="site-entrance__progress-bar" />
        </div>
      </div>
    </div>
  );
}
