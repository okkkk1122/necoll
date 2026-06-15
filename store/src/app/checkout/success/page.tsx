'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const isDemo = searchParams.get('demo');

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
      <h1 className="text-2xl font-bold mb-2">سفارش ثبت شد!</h1>
      {orderNumber && (
        <p className="text-gray-600 mb-2">شماره سفارش: <strong>{orderNumber}</strong></p>
      )}
      {isDemo && (
        <p className="text-sm text-amber-600 mb-4">حالت آزمایشی — درگاه پرداخت فعال نیست</p>
      )}
      <p className="text-gray-500 mb-6">از خرید شما متشکریم</p>
      <Link href="/" className="btn-primary inline-block">بازگشت به فروشگاه</Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
