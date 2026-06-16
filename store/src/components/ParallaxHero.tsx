'use client';

import { ReactNode } from 'react';

interface ParallaxHeroProps {
  children: ReactNode;
}

export default function ParallaxHero({ children }: ParallaxHeroProps) {
  return <div className="relative">{children}</div>;
}
