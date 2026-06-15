'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { useParallax } from '@/hooks/useParallax';
import FashionPatterns, { FashionPatternBg } from './FashionPatterns';

type PatternType = 'dress' | 'fabric' | 'arcs' | 'editorial' | 'none';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  pattern?: PatternType;
  patternPosition?: 'left' | 'right' | 'both';
  bgSpeed?: number;
  decorSpeed?: number;
  tinted?: boolean;
  id?: string;
}

const PATTERN_ROTATION: Record<Exclude<PatternType, 'none'>, string> = {
  dress: '-rotate-6',
  fabric: 'rotate-3',
  arcs: '',
  editorial: '-rotate-12',
};

export default function ParallaxSection({
  children,
  className,
  pattern = 'none',
  patternPosition = 'right',
  bgSpeed = 0.08,
  decorSpeed = 0.18,
  tinted = false,
  id,
}: ParallaxSectionProps) {
  const bg = useParallax(bgSpeed);
  const decorLeft = useParallax(decorSpeed);
  const decorRight = useParallax(decorSpeed * 1.35);

  return (
    <div id={id} className={clsx('parallax-section relative overflow-hidden', className)}>
      {tinted && (
        <div
          ref={bg.ref}
          style={bg.style}
          className="parallax-section-bg absolute inset-0 -z-10 pointer-events-none"
          aria-hidden
        >
          <FashionPatternBg className="absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-blue-pale)]/30 to-transparent" />
        </div>
      )}

      {pattern !== 'none' && (
        <>
          {(patternPosition === 'left' || patternPosition === 'both') && (
            <div
              ref={decorLeft.ref}
              style={decorLeft.style}
              className={clsx(
                'parallax-decor parallax-decor-left pointer-events-none',
                PATTERN_ROTATION[pattern]
              )}
              aria-hidden
            >
              <FashionPatterns variant={pattern} opacity={0.14} />
            </div>
          )}
          {(patternPosition === 'right' || patternPosition === 'both') && (
            <div
              ref={decorRight.ref}
              style={decorRight.style}
              className={clsx(
                'parallax-decor parallax-decor-right pointer-events-none',
                pattern === 'dress' ? 'rotate-6' : PATTERN_ROTATION[pattern]
              )}
              aria-hidden
            >
              <FashionPatterns variant={pattern} opacity={0.12} />
            </div>
          )}
        </>
      )}

      <div className="parallax-section-content relative z-[1]">{children}</div>
    </div>
  );
}
