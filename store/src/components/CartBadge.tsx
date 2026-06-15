'use client';



import Link from 'next/link';

import { ShoppingBag } from 'lucide-react';

import { useCart } from '@/lib/cart-context';



export default function CartBadge() {

  const { totalItems } = useCart();



  return (

    <Link

      href="/cart"

      className="relative flex items-center justify-center w-10 h-10 btn-ghost"

      aria-label="سبد خرید"

    >

      <ShoppingBag size={19} strokeWidth={1.5} className="text-[var(--color-text-muted)]" />

      {totalItems > 0 && (

        <span className="absolute -top-0.5 -left-0.5 min-w-[16px] h-4 px-0.5 bg-[var(--color-blue-deep)] text-white text-[9px] font-medium rounded-full flex items-center justify-center">

          {totalItems > 9 ? '9+' : totalItems}

        </span>

      )}

    </Link>

  );

}


