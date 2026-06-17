'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useConfig } from '@/lib/config-context';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'splash';
  showText?: boolean;
  iconOnly?: boolean;
  className?: string;
  linkToHome?: boolean;
}

const sizes = {
  sm: { n: 'text-[2.5rem] sm:text-[3rem]', word: 'text-[1.35rem] sm:text-[1.6rem]', icon: 'h-8 w-8' },
  md: { n: 'text-[3.25rem]', word: 'text-[1.75rem]', icon: 'h-10 w-10' },
  lg: { n: 'text-[4.25rem]', word: 'text-[2.25rem]', icon: 'h-12 w-12' },
  splash: { n: 'text-[5rem] sm:text-[6rem]', word: 'text-[2.5rem] sm:text-[3.25rem]', icon: 'h-14 w-14' },
};

function formatBrandEn(name?: string): string {
  const raw = (name || 'necoll').trim();
  if (!raw) return 'Necoll';
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export default function Logo({
  size = 'md',
  showText = true,
  iconOnly = false,
  className,
  linkToHome = true,
}: LogoProps) {
  const config = useConfig();
  const s = sizes[size];
  const brandName = formatBrandEn(config.site_name?.en);
  const monogram = brandName.charAt(0);
  const brandRest = brandName.slice(1);
  const siteNameFa = config.site_name?.fa || 'نکال';
  const logoSrc = config.site_logo && config.site_logo !== '/logo.svg' ? config.site_logo : '/logo.png';

  const content = iconOnly ? (
    <img
      src={logoSrc}
      alt={siteNameFa}
      className={clsx('logo-icon object-contain', s.icon, className)}
    />
  ) : (
    <div
      className={clsx('logo-mark', size === 'splash' && 'logo-mark--splash', className)}
      dir="ltr"
    >
      <span className={clsx('logo-mark__n', s.n)} aria-hidden="true">
        {monogram}
      </span>
      {showText && (
        <span className={clsx('logo-mark__word', s.word)}>{brandRest.toLowerCase()}</span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="logo-mark-link inline-flex" dir="ltr" aria-label={`صفحه اصلی ${siteNameFa}`}>
        {content}
      </Link>
    );
  }
  return content;
}
