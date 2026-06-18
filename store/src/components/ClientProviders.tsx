'use client';

import { ReactNode } from 'react';
import SiteEntrance from './SiteEntrance';
import ChatWidget from './ChatWidget';
import MobileBottomNav from './MobileBottomNav';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteEntrance />
      {children}
      <MobileBottomNav />
      <ChatWidget />
    </>
  );
}
