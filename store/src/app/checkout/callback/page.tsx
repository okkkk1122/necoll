'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    orderNumber?: string;
    refId?: number;
  } | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');

    if (!orderId) {
      setResult({ success: false, message: 'اطلاعات سفارش یافت نشد' });
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(
      `${apiUrl}/payment/verify?orderId=${orderId}&Authority=${authority}&Status=${status}`
    )
      .then((r) => r.json())
      .then(setResult)
      .catch(() => setResult({ success: false, message: 'خطا در تأیید پرداخت' }));
  }, [searchParams]);

  if (!result) {
    return (
      <div className="text-center py-16">
        <Loader className="animate-spin mx-auto mb-4 text-gray-400" size={48} />
        <p>در حال تأیید پرداخت...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      {result.success ? (
        <>
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">پرداخت موفق!</h1>
          <p className="text-gray-600 mb-2">{result.message}</p>
          {result.orderNumber && (
            <p className="text-sm text-gray-500 mb-1">شماره سفارش: {result.orderNumber}</p>
          )}
          {result.refId && (
            <p className="text-sm text-gray-500 mb-6">کد پیگیری: {result.refId}</p>
          )}
        </>
      ) : (
        <>
          <XCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">پرداخت ناموفق</h1>
          <p className="text-gray-600 mb-6">{result.message}</p>
        </>
      )}
      <Link href="/" className="btn-primary inline-block">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">در حال بارگذاری...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
