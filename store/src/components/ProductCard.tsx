'use client';



import Link from 'next/link';

import { useConfig } from '@/lib/config-context';

import ProductImage from './ProductImage';

import { Plus } from 'lucide-react';



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



  return (

    <Link href={`/products/${product.slug}`} className="card-fashion card-fashion-glow block group">

      <div className="relative aspect-[3/4] overflow-hidden">

        <ProductImage src={mainImage} alt={product.name.fa} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />



        {discount > 0 && (

          <span className="absolute top-2 right-2 sm:top-4 sm:right-4 badge-discount text-[10px] sm:text-xs">-{discount}٪</span>

        )}



        {product.badges?.map((badge, i) => (

          <span key={i} className="absolute top-2 left-2 sm:top-4 sm:left-4 badge-new text-[10px] sm:text-xs">

            {badge.payload.text as string}

          </span>

        ))}



        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">

          <span className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-medium tracking-[0.18em] uppercase text-white bg-[var(--color-blue-deep)]/90 backdrop-blur-sm">

            <Plus size={12} strokeWidth={1.5} />

            مشاهده

          </span>

        </div>

      </div>



      <div className="py-4 px-1 text-center">

        <h3 className="text-base font-medium mb-2 group-hover:text-[var(--color-blue-deep)] transition-colors line-clamp-2 tracking-wide leading-relaxed font-product">

          {product.name.fa}

        </h3>

        <div className="flex items-center justify-center gap-3">

          <span className="text-base font-bold tracking-wide font-price" style={{ color: 'var(--color-primary)' }}>

            {formatPrice(price, symbol)}

          </span>

          {comparePrice && comparePrice > price && (

            <span className="text-sm text-[var(--color-text-muted)] line-through font-light">

              {formatPrice(comparePrice, symbol)}

            </span>

          )}

        </div>

        {product.stock < 5 && product.stock > 0 && (

          <p className="badge-stock mt-3 mx-auto w-fit">فقط {product.stock} عدد</p>

        )}

        {product.stock === 0 && (

          <p className="text-xs text-[var(--color-error)] mt-2 tracking-widest uppercase">ناموجود</p>

        )}

      </div>

    </Link>

  );

}


