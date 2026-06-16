'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useConfig } from '@/lib/config-context';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'splash';
  showText?: boolean;
  className?: string;
  linkToHome?: boolean;
}

const sizes = {
  sm: { n: 'text-[2.35rem] sm:text-[2.75rem]', word: 'text-[1.55rem] sm:text-[1.85rem]' },
  md: { n: 'text-[2.85rem]', word: 'text-[2rem]' },
  lg: { n: 'text-[3.75rem]', word: 'text-[2.65rem]' },
  splash: { n: 'text-[4.5rem] sm:text-[5.5rem]', word: 'text-[2.75rem] sm:text-[3.5rem]' },
};

function formatBrandEn(name?: string): string {
  const raw = (name || 'necoll').trim();
  if (!raw) return 'Necoll';
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export default function Logo({
  size = 'md',
  showText = true,
  className,
  linkToHome = true,
}: LogoProps) {
  const config = useConfig();
  const s = sizes[size];
  const brandName = formatBrandEn(config.site_name?.en);
  const monogram = brandName.charAt(0);
  const brandRest = brandName.slice(1);
  const siteNameFa = config.site_name?.fa || 'نکال';

  const content = (
    <div
      className={clsx('logo-mark', size === 'splash' && 'logo-mark--splash', className)}
      dir="ltr"
    >
      <span className={clsx('logo-mark__n', s.n)} aria-hidden="true">
        {monogram}
      </span>
      {showText && (
        <span className={clsx('logo-mark__word', s.word)}>{brandRest}</span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="logo-mark-link" dir="ltr" aria-label={`صفحه اصلی ${siteNameFa}`}>
        {content}
      </Link>
    );
  }
  return content;
}
