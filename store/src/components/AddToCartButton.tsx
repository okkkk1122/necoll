'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check } from 'lucide-react';

interface Props {
  productId: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  disabled?: boolean;
}

export default function AddToCartButton({ productId, slug, name, price, stock, disabled }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ productId, slug, name, price, stock });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (disabled || stock === 0) {
    return (
      <button className="btn-primary flex-1 opacity-50 cursor-not-allowed" disabled>
        ناموجود
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className="btn-primary flex-1 flex items-center justify-center gap-2">
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {added ? 'اضافه شد!' : 'افزودن به سبد خرید'}
    </button>
  );
}
