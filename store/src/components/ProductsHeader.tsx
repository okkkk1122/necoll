'use client';

import { useConfig } from '@/lib/config-context';
import { useSearchParams } from 'next/navigation';
import { resolveProductsTitle } from '@/lib/shop-nav';

export default function ProductsHeader() {
  const config = useConfig();
  const searchParams = useSearchParams();
  const title = resolveProductsTitle(config._navigation, searchParams);

  return (
    <div className="text-center mb-12 md:mb-16">
      <h1 className="fashion-title">{title}</h1>
    </div>
  );
}
