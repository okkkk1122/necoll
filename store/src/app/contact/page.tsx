'use client';

import { useConfig } from '@/lib/config-context';
import { getClientAPI } from '@/lib/api';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const config = useConfig();
  const contact = config.contact_info as
    | {
        email?: string;
        phone?: string;
        phoneDisplay?: string;
        address?: { fa?: string };
        tagline?: string;
      }
    | undefined;
  const social = config.social_links || {};
  const socialEnabled = config.social_enabled || {};

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await getClientAPI().post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">خانه</Link>
        <span className="mx-2">/</span>
        <span>تماس با ما</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">تماس با ما</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4">اطلاعات تماس</h2>
            <div className="space-y-4 text-sm">
              {contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="hover:underline" dir="ltr">
                    {contact.email}
                  </a>
                </div>
              )}
              {(contact?.phoneDisplay || contact?.phone) && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <a href={contact.phone || '#'} className="hover:underline">
                    {contact.phoneDisplay || contact.phone}
                  </a>
                </div>
              )}
              {contact?.address?.fa && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{contact.address.fa}</span>
                </div>
              )}
            </div>
          </div>

          {socialEnabled.telegram !== false && social.telegram && (
            <div className="card p-6">
              <h2 className="font-bold mb-3">پشتیبانی سریع</h2>
              <a
                href={social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg inline-block hover:bg-blue-600"
              >
                تلگرام پشتیبانی
              </a>
            </div>
          )}
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="font-bold text-lg mb-2">پیام شما ارسال شد</h2>
              <p className="text-gray-500 text-sm">به زودی با شما تماس می‌گیریم</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-blue-500">
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-bold mb-2">فرم تماس</h2>
              {[
                { key: 'name', placeholder: 'نام و نام خانوادگی', type: 'text' },
                { key: 'email', placeholder: 'ایمیل', type: 'email' },
                { key: 'phone', placeholder: 'شماره تماس (اختیاری)', type: 'tel' },
                { key: 'subject', placeholder: 'موضوع', type: 'text' },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                  required={field.key !== 'phone'}
                  dir={field.type === 'email' ? 'ltr' : undefined}
                />
              ))}
              <textarea
                placeholder="پیام شما..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm h-32 outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={16} />
                {loading ? 'در حال ارسال...' : 'ارسال پیام'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
