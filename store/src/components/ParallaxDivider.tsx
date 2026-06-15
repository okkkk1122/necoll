'use client';

import { useParallax } from '@/hooks/useParallax';
import FashionPatterns from './FashionPatterns';

export default function ParallaxDivider() {
  const line = useParallax(0.1);
  const decor = useParallax(0.22);

  return (
    <div className="parallax-divider relative py-6 md:py-10 overflow-hidden" aria-hidden>
      <div
        ref={line.ref}
        style={line.style}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90%,600px)] h-px bg-gradient-to-r from-transparent via-[var(--color-blue-soft)] to-transparent"
      />
      <div
        ref={decor.ref}
        style={decor.style}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-blue-deep)]"
      >
        <FashionPatterns variant="arcs" className="w-16 h-16 md:w-20 md:h-20" opacity={0.35} />
      </div>
    </div>
  );
}
