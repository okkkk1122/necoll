'use client';

import { ReactNode } from 'react';
import SiteEntrance from './SiteEntrance';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteEntrance />
      {children}
    </>
  );
}
