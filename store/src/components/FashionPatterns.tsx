'use client';

import clsx from 'clsx';

type PatternVariant = 'dress' | 'fabric' | 'arcs' | 'editorial' | 'hero';

interface FashionPatternsProps {
  variant?: PatternVariant;
  className?: string;
  opacity?: number;
}

/** Abstract modern women's fashion motifs — couture silhouettes & fabric flow */
export default function FashionPatterns({ variant = 'dress', className, opacity = 0.12 }: FashionPatternsProps) {
  const op = opacity;

  if (variant === 'dress') {
    return (
      <svg
        className={clsx('fashion-pattern-svg', className)}
        viewBox="0 0 200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Minimalist dress silhouette — modern editorial */}
        <path
          d="M100 20 C85 20 75 35 75 50 L70 90 C55 95 45 110 45 130 L48 200 C48 240 55 280 60 320 L65 380 L135 380 L140 320 C145 280 152 240 152 200 L155 130 C155 110 145 95 130 90 L125 50 C125 35 115 20 100 20Z"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={op * 2}
        />
        <path
          d="M75 50 Q100 65 125 50"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={op * 1.5}
        />
        <ellipse cx="100" cy="38" rx="18" ry="22" stroke="currentColor" strokeWidth="0.8" opacity={op} />
        <path
          d="M60 130 Q100 160 140 130"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={op}
          strokeDasharray="4 6"
        />
      </svg>
    );
  }

  if (variant === 'fabric') {
    return (
      <svg
        className={clsx('fashion-pattern-svg', className)}
        viewBox="0 0 300 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Flowing scarf / fabric folds */}
        <path
          d="M0 80 Q60 40 120 70 T240 50 T300 90"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={op * 2}
        />
        <path
          d="M0 110 Q80 60 160 100 T300 80"
          stroke="currentColor"
          strokeWidth="1"
          opacity={op * 1.5}
        />
        <path
          d="M0 140 Q50 120 100 145 T200 125 T300 150"
          stroke="currentColor"
          strokeWidth="0.7"
          opacity={op}
          strokeDasharray="3 8"
        />
        <path
          d="M20 60 Q100 20 180 55 Q220 75 280 40"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={op * 0.8}
        />
      </svg>
    );
  }

  if (variant === 'arcs') {
    return (
      <svg
        className={clsx('fashion-pattern-svg', className)}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="120" cy="120" r="90" stroke="currentColor" strokeWidth="0.8" opacity={op} />
        <circle cx="120" cy="120" r="60" stroke="currentColor" strokeWidth="0.6" opacity={op * 1.2} />
        <circle cx="120" cy="120" r="30" stroke="currentColor" strokeWidth="0.5" opacity={op * 1.5} />
        <path
          d="M30 120 A90 90 0 0 1 210 120"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={op * 2}
        />
      </svg>
    );
  }

  if (variant === 'editorial') {
    return (
      <svg
        className={clsx('fashion-pattern-svg', className)}
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Abstract runway / editorial geometry */}
        <rect x="40" y="60" width="80" height="180" stroke="currentColor" strokeWidth="0.6" opacity={op} transform="rotate(-8 80 150)" />
        <path
          d="M200 40 L280 260 L120 260 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity={op * 1.2}
        />
        <line x1="320" y1="50" x2="320" y2="250" stroke="currentColor" strokeWidth="0.5" opacity={op} />
        <line x1="300" y1="80" x2="340" y2="80" stroke="currentColor" strokeWidth="0.5" opacity={op} />
        <path
          d="M160 100 Q200 60 240 100 Q200 140 160 100"
          stroke="currentColor"
          strokeWidth="1"
          opacity={op * 1.5}
        />
      </svg>
    );
  }

  // hero — combined layered motif
  return (
    <svg
      className={clsx('fashion-pattern-svg', className)}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M250 60 C220 60 200 90 200 120 L190 180 C160 190 140 220 140 260 L145 380 L355 380 L360 260 C360 220 340 190 310 180 L300 120 C300 90 280 60 250 60Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity={op}
      />
      <path
        d="M80 200 Q180 120 280 200 T480 160"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity={op * 1.3}
      />
      <circle cx="400" cy="100" r="50" stroke="currentColor" strokeWidth="0.6" opacity={op * 0.8} />
      <circle cx="80" cy="350" r="35" stroke="currentColor" strokeWidth="0.5" opacity={op * 0.7} />
      <path
        d="M200 120 Q250 150 300 120"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity={op * 1.2}
        strokeDasharray="6 4"
      />
    </svg>
  );
}

/** Repeating subtle pattern for section backgrounds */
export function FashionPatternBg({ className }: { className?: string }) {
  return (
    <div
      className={clsx('fashion-pattern-bg', className)}
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q25 15 30 25 Q35 15 30 5 M30 35 Q20 40 30 55 Q40 40 30 35' fill='none' stroke='%233A9FD4' stroke-width='0.4' opacity='0.15'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
