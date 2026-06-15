'use client';

import { ReactNode } from 'react';
import { useModuleActive } from '@/lib/modules';

export default function ModuleGate({ module, children, fallback = null }: {
  module: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const active = useModuleActive(module);
  if (!active) return <>{fallback}</>;
  return <>{children}</>;
}
