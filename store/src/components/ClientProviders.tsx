'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import MobileBottomNav from './MobileBottomNav';
import SiteEntrance from './SiteEntrance';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SiteEntrance />
      {children}
      <MobileBottomNav />
    </ThemeProvider>
  );
}
