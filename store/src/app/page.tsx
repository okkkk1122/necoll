import type { Metadata } from 'next';

import HomePageLayout from '@/components/HomePageLayout';

export const metadata: Metadata = {
  other: {
    enamad: '60974624',
  },
};

export default function HomePage() {
  return <HomePageLayout />;
}
