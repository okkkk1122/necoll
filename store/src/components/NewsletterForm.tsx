'use client';

import { useState } from 'react';
import { useConfig } from '@/lib/config-context';
import { getClientAPI } from '@/lib/api';

export default function NewsletterForm() {
  const config = useConfig();
  const newsletter = config.newsletter_config;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!newsletter?.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await getClientAPI().post('/newsletter/subscribe', { email: email.trim() });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={newsletter.placeholder || 'ایمیل شما'}
        className="input-modern flex-1 text-center"
        dir="ltr"
        required
      />
      <button type="submit" disabled={status === 'loading'} className="btn-primary shrink-0 uppercase text-sm tracking-[0.12em]">
        {status === 'loading' ? '...' : newsletter.buttonText?.fa || 'عضویت'}
      </button>
      {status === 'success' && <p className="text-xs text-[var(--color-success)] sm:hidden">عضویت با موفقیت انجام شد</p>}
      {status === 'error' && <p className="text-xs text-[var(--color-error)] sm:hidden">خطا در عضویت</p>}
    </form>
  );
}
