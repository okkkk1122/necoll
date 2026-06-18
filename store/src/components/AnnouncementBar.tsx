'use client';

import Link from 'next/link';
import { useConfig } from '@/lib/config-context';

export default function AnnouncementBar() {
  const config = useConfig();
  const bar = config.announcement_bar as
    | { enabled?: boolean; text?: { fa?: string }; link?: string }
    | undefined;

  if (!bar?.enabled || !bar.text?.fa?.trim()) return null;

  const inner = (
    <span className="text-xs sm:text-sm font-nav tracking-wide">{bar.text.fa}</span>
  );

  return (
    <div className="bg-[var(--color-text)] text-white text-center py-2 px-4">
      {bar.link ? (
        <Link href={bar.link} className="block hover:opacity-90 transition-opacity">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
