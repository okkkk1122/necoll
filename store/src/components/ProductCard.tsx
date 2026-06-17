'use client';

import Link from 'next/link';
import { useConfig } from '@/lib/config-context';
import ProductImage from './ProductImage';

interface Product {
  id: string;
  slug: string;
  name: { fa: string };
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  badges?: Array<{ type: string; payload: Record<string, unknown> }>;
}

function formatPrice(price: number, symbol: string): string {
  return `${new Intl.NumberFormat('fa-IR').format(price)} ${symbol}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const config = useConfig();
  const symbol = config.currency?.symbol || 'تومان';
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const comparePrice = product.comparePrice
    ? typeof product.comparePrice === 'string'
      ? parseFloat(product.comparePrice)
      : product.comparePrice
    : null;

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  const mainImage = product.images?.[0];

  const visibleBadges = product.badges?.filter(
    (badge) => badge.payload?.text !== 'ارسال رایگان'
  );

  return (
    <Link href={`/products/${product.slug}`} className="monaie-product-card group block">
      <div className="monaie-product-card__image relative">
        <ProductImage
          src={mainImage}
          alt={product.name.fa}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="100vw"
        />

        {discount > 0 && (
          <span className="absolute top-3 right-3 badge-discount text-[10px] sm:text-xs z-10">
            -{discount}٪
          </span>
        )}

        {visibleBadges?.map((badge, i) => (
          <span key={i} className="absolute top-3 left-3 badge-new text-[10px] sm:text-xs z-10">
            {badge.payload.text as string}
          </span>
        ))}
      </div>

      <div className="monaie-product-card__body">
        <h3 className="monaie-product-card__title line-clamp-2">{product.name.fa}</h3>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-sm font-bold font-price text-[var(--color-text)]">
            {formatPrice(price, symbol)}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-xs text-[var(--color-text-muted)] line-through font-price">
              {formatPrice(comparePrice, symbol)}
            </span>
          )}
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <p className="text-xs text-[var(--color-text-muted)] mt-2">فقط {product.stock} عدد</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-[var(--color-error)] mt-2">ناموجود</p>
        )}
      </div>
    </Link>
  );
}
