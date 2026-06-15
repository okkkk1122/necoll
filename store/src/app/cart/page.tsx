'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useConfig } from '@/lib/config-context';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const config = useConfig();
  const shippingConfig = config.shipping_config || { baseCost: 50000, freeThreshold: 1000000 };
  const symbol = config.currency?.symbol || 'تومان';

  const shippingCost = subtotal >= shippingConfig.freeThreshold ? 0 : shippingConfig.baseCost;
  const total = subtotal + shippingCost;

  const formatPrice = (n: number) => `${new Intl.NumberFormat('fa-IR').format(n)} ${symbol}`;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold mb-2">سبد خرید خالی است</h1>
        <p className="text-gray-500 mb-6">هنوز محصولی اضافه نکرده‌اید</p>
        <Link href="/products" className="btn-primary inline-block">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">سبد خرید ({totalItems} کالا)</h1>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 min-w-0">
          {items.map((item) => (
            <div key={item.productId} className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="font-medium hover:underline line-clamp-2 text-sm sm:text-base">
                    {item.name}
                  </Link>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-bold mb-4">خلاصه سفارش</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">جمع کالاها</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">هزینه ارسال</span>
              <span>{shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}</span>
            </div>
            {shippingCost > 0 && (
              <p className="text-xs text-green-600">
                خرید بالای {new Intl.NumberFormat('fa-IR').format(shippingConfig.freeThreshold)} تومان = ارسال رایگان
              </p>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>مبلغ قابل پرداخت</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center block">
            ادامه و پرداخت
          </Link>
        </div>
      </div>
    </div>
  );
}
