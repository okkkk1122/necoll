'use client';

import { useConfig } from './config-context';

export function useModuleActive(slug: string): boolean {
  const config = useConfig();
  const mod = config._modules?.find((m) => m.slug === slug);
  return mod?.isActive ?? true;
}

export function useActiveModules() {
  const config = useConfig();
  return config._modules?.filter((m) => m.isActive) ?? [];
}
