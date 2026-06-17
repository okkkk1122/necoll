'use client';

import StaticPageLayout from '@/components/StaticPageLayout';
import { useState } from 'react';

export default function AccountPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone' && phone.trim()) {
      setStep('code');
    }
  };

  return (
    <StaticPageLayout title="ورود / عضویت">
      <p className="text-center text-[var(--color-text-muted)] font-nav text-sm mb-8">
        یک کد تایید به شماره شما ارسال می‌شود
      </p>
      <form onSubmit={handleContinue} className="max-w-sm mx-auto space-y-4">
        {step === 'phone' ? (
          <div>
            <label className="block text-sm font-nav mb-2 text-[var(--color-text)]">شماره موبایل</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxxx"
              className="input-modern text-left"
              dir="ltr"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-nav mb-2 text-[var(--color-text)]">کد تایید</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="کد ۶ رقمی"
              className="input-modern text-center tracking-widest"
              dir="ltr"
              required
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm font-nav text-[var(--color-text-muted)]">
          <input type="checkbox" className="accent-[var(--color-text)]" />
          مرا به خاطر بسپار
        </label>
        <button type="submit" className="btn-primary w-full text-sm">
          {step === 'phone' ? 'ادامه' : 'ورود'}
        </button>
        {step === 'code' && (
          <button
            type="button"
            className="w-full text-sm text-[var(--color-text-muted)] font-nav hover:text-[var(--color-text)]"
            onClick={() => setStep('phone')}
          >
            تغییر شماره موبایل
          </button>
        )}
      </form>
    </StaticPageLayout>
  );
}
