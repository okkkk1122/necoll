'use client';

import AddToCartButton from './AddToCartButton';

interface Props {
  productId: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
}

export default function ProductActions({ productId, slug, name, price, stock }: Props) {
  return (
    <div>
      <AddToCartButton
        productId={productId}
        slug={slug}
        name={name}
        price={price}
        stock={stock}
        disabled={stock === 0}
      />
      {stock > 0 && stock < 5 && (
        <p className="text-amber-600 text-sm mt-3">
          ⚠️ فقط {stock} عدد در انبار باقی مانده
        </p>
      )}
    </div>
  );
}
