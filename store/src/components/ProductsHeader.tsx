'use client';

import { useConfig } from '@/lib/config-context';

export default function ProductsHeader() {
  const config = useConfig();
  const labels = config.section_labels?.products_page;

  return (
    <div className="text-center mb-12 md:mb-16">
      {labels?.label?.fa && <p className="fashion-label mb-3">{labels.label.fa}</p>}
      <h1 className="fashion-title">{labels?.title?.fa || 'فروشگاه'}</h1>
      {labels?.subtitle?.fa && (
        <p className="text-[var(--color-text-muted)] text-sm mt-2">{labels.subtitle.fa}</p>
      )}
    </div>
  );
}
