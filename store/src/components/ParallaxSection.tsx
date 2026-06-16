'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  pattern?: string;
  patternPosition?: string;
  tinted?: boolean;
}

export default function ParallaxSection({
  children,
  className,
  id,
}: ParallaxSectionProps) {
  return (
    <div id={id} className={clsx('relative', className)}>
      {children}
    </div>
  );
}
