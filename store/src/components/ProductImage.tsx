'use client';

import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/media';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function ProductImage({ src, alt, className, fill, priority, sizes }: ProductImageProps) {
  const resolved = resolveMediaUrl(src);

  if (!resolved) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-b from-[var(--color-blue-pale)] to-[var(--color-blush)] ${className || ''}`}>
        <span className="font-display text-5xl text-[var(--color-blue-deep)]/35 font-semibold">n</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className={className || 'object-cover'}
        priority={priority}
        sizes={sizes || '(max-width:768px) 50vw, 25vw'}
        unoptimized={resolved.includes('/uploads/')}
      />
    );
  }

  return (
    <img src={resolved} alt={alt} className={className || 'w-full h-full object-cover'} />
  );
}
