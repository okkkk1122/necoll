'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useConfig } from '@/lib/config-context';

function formatPrice(price: number, symbol: string): string {
  return `${new Intl.NumberFormat('fa-IR').format(price)} ${symbol}`;
}

export default function CartBadge({ showLabel = false }: { showLabel?: boolean }) {
  const { totalItems, subtotal } = useCart();
  const config = useConfig();
  const symbol = config.currency?.symbol || 'تومان';

  return (
    <Link
      href="/cart"
      className="monaie-cart-link"
      aria-label="سبد خرید"
    >
      {showLabel && (
        <span className="monaie-cart-link__price font-price" dir="ltr">
          {formatPrice(subtotal, symbol)}
        </span>
      )}
      <span className="relative flex items-center justify-center w-10 h-10">
        <ShoppingBag size={19} strokeWidth={1.5} className="text-[var(--color-text)]" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -left-0.5 min-w-[16px] h-4 px-0.5 bg-[var(--color-text)] text-white text-[9px] font-medium rounded-full flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </span>
      {showLabel && (
        <span className="monaie-cart-link__label font-nav">سبد خرید</span>
      )}
    </Link>
  );
}
