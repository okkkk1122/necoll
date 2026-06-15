'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useConfig } from '@/lib/config-context';
import { resolveLogoUrl } from '@/lib/media';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  linkToHome?: boolean;
  variant?: 'default' | 'header' | 'footer';
}

const sizes = {
  sm: { img: 52, text: 'text-lg' },
  md: { img: 60, text: 'text-xl' },
  lg: { img: 76, text: 'text-2xl' },
};

export default function Logo({
  size = 'md',
  showText = true,
  className,
  linkToHome = true,
}: LogoProps) {
  const config = useConfig();
  const s = sizes[size];
  const logoSrc = resolveLogoUrl(config.site_logo);
  const brandName = config.site_name?.en || 'necoll';
  const tagline = config.site_description?.en?.slice(0, 30) || "Women's Fashion";

  const content = (
    <div className={clsx('flex items-center gap-3 group', className)}>
      <div
        className="relative shrink-0 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-[1.03] ring-1 ring-[var(--color-blue-soft)]/40 group-hover:ring-[var(--color-blue-deep)]/50 shadow-sm"
        style={{ width: s.img, height: s.img }}
      >
        <Image
          src={logoSrc}
          alt={`${brandName} - Women's Fashion Boutique`}
          fill
          className="object-cover"
          priority
          sizes={`${s.img}px`}
          unoptimized
        />
      </div>
      {showText && (
        <div className="hidden sm:block text-right">
          <span className={clsx('font-display font-semibold tracking-wide block leading-tight lowercase', s.text, 'text-[var(--logo-text)]')}>
            {brandName}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] tracking-[0.18em] uppercase">
            {tagline}
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return <Link href="/" aria-label={`صفحه اصلی ${config.site_name?.fa || 'نکال'}`}>{content}</Link>;
  }
  return content;
}
