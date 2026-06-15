'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useConfig } from '@/lib/config-context';
import { getClientAPI } from '@/lib/api';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const config = useConfig();
  const router = useRouter();
  const shippingConfig = config.shipping_config || { baseCost: 50000, freeThreshold: 1000000 };
  const symbol = config.currency?.symbol || 'تومان';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [auth, setAuth] = useState({ email: '', password: '', name: '', phone: '' });
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
  });

  const shippingCost = subtotal >= shippingConfig.freeThreshold ? 0 : shippingConfig.baseCost;
  const total = subtotal + shippingCost;
  const formatPrice = (n: number) => `${new Intl.NumberFormat('fa-IR').format(n)} ${symbol}`;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">سبد خرید خالی است</p>
        <Link href="/products" className="btn-primary inline-block">بازگشت به فروشگاه</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const api = getClientAPI();

      const authEndpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const authBody =
        mode === 'login'
          ? { email: auth.email, password: auth.password }
          : { email: auth.email, password: auth.password, name: auth.name, phone: auth.phone };

      const authRes = await api.post<{ token: string }>(authEndpoint, authBody);
      localStorage.setItem('user_token', authRes.token);

      const checkoutRes = await api.post<{
        paymentUrl: string | null;
        demo?: boolean;
        order: { orderNumber: string };
      }>(
        '/payment/checkout',
        {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: address,
          notes: '',
          couponCode: couponCode || undefined,
        },
        authRes.token
      );

      clearCart();

      if (checkoutRes.paymentUrl) {
        window.location.href = checkoutRes.paymentUrl;
      } else {
        router.push(`/checkout/success?order=${checkoutRes.order.orderNumber}&demo=1`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت سفارش');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">تسویه حساب</h1>

      <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  mode === 'login' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'
                }`}
              >
                ورود
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  mode === 'register' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'
                }`}
              >
                ثبت‌نام
              </button>
            </div>
            <div className="space-y-3">
              {mode === 'register' && (
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={auth.name}
                  onChange={(e) => setAuth({ ...auth, name: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              )}
              <input
                type="email"
                placeholder="ایمیل"
                value={auth.email}
                onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm"
                dir="ltr"
                required
              />
              <input
                type="password"
                placeholder="رمز عبور"
                value={auth.password}
                onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">آدرس تحویل</h2>
            <div className="space-y-3">
              {[
                { key: 'fullName', placeholder: 'نام گیرنده' },
                { key: 'phone', placeholder: 'شماره تماس' },
                { key: 'province', placeholder: 'استان' },
                { key: 'city', placeholder: 'شهر' },
                { key: 'address', placeholder: 'آدرس کامل' },
                { key: 'postalCode', placeholder: 'کد پستی' },
              ].map((field) => (
                <input
                  key={field.key}
                  type="text"
                  placeholder={field.placeholder}
                  value={address[field.key as keyof typeof address]}
                  onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-3">کد تخفیف</h2>
            <input
              type="text"
              placeholder="کد تخفیف (مثلاً WELCOME10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold mb-4">سفارش شما</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>جمع</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>ارسال</span>
                <span>{shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>قابل پرداخت</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? 'در حال پردازش...' : 'پرداخت با زرین‌پال'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              پرداخت امن از طریق درگاه زرین‌پال
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
