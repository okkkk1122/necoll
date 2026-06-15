'use client';

import { ReactNode } from 'react';
import { useParallax } from '@/hooks/useParallax';
import FashionPatterns from './FashionPatterns';

interface ParallaxHeroProps {
  children: ReactNode;
}

export default function ParallaxHero({ children }: ParallaxHeroProps) {
  const bgSlow = useParallax(0.25);
  const bgMid = useParallax(0.15);
  const decorLeft = useParallax(0.35);
  const decorRight = useParallax(-0.2);
  const content = useParallax(-0.06);

  return (
    <div className="parallax-hero relative overflow-hidden">
      <div
        ref={bgSlow.ref}
        style={bgSlow.style}
        className="parallax-hero-layer parallax-hero-layer-slow pointer-events-none"
        aria-hidden
      >
        <FashionPatterns variant="hero" className="w-[min(90vw,520px)] h-auto text-[var(--color-blue-deep)]" opacity={0.18} />
      </div>

      <div
        ref={bgMid.ref}
        style={bgMid.style}
        className="parallax-hero-layer parallax-hero-layer-mid pointer-events-none"
        aria-hidden
      >
        <FashionPatterns variant="fabric" className="w-[min(70vw,400px)] h-auto text-white" opacity={0.2} />
      </div>

      <div
        ref={decorLeft.ref}
        style={decorLeft.style}
        className="parallax-hero-decor parallax-hero-decor-left pointer-events-none"
        aria-hidden
      >
        <FashionPatterns variant="dress" className="w-32 md:w-48 h-auto text-white" opacity={0.22} />
      </div>

      <div
        ref={decorRight.ref}
        style={decorRight.style}
        className="parallax-hero-decor parallax-hero-decor-right pointer-events-none"
        aria-hidden
      >
        <FashionPatterns variant="arcs" className="w-28 md:w-40 h-auto text-white" opacity={0.18} />
      </div>

      <div ref={content.ref} style={content.style} className="relative z-[2]">
        {children}
      </div>
    </div>
  );
}
