'use client';

import { ReactNode } from 'react';
import SiteEntrance from './SiteEntrance';
import ChunkLoadRecovery from './ChunkLoadRecovery';
import ChatWidget from './ChatWidget';
import MobileBottomNav from './MobileBottomNav';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <ChunkLoadRecovery />
      <SiteEntrance />
      {children}
      <MobileBottomNav />
      <ChatWidget />
    </>
  );
}
