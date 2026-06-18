'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Mail, Trash2, Users } from 'lucide-react';

type Tab = 'contact' | 'newsletter';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

function MessagesInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('contact');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t) setTab(t);
  }, [searchParams]);

  const loadContact = () => {
    setLoading(true);
    api<ContactMessage[]>('/contact/messages').then(setMessages).finally(() => setLoading(false));
  };

  const loadNewsletter = () => {
    setLoading(true);
    api<{ subscribers: string[] }>('/newsletter/subscribers').then((d) => setSubscribers(d.subscribers)).finally(() => setLoading(false));
  };

  useEffect(() => { if (tab === 'contact') loadContact(); else loadNewsletter(); }, [tab]);

  const tabs = [
    { id: 'contact' as Tab, label: 'پیام‌های تماس' },
    { id: 'newsletter' as Tab, label: 'مشترکین خبرنامه' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-admin-primary mb-6">پیام‌ها و خبرنامه</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm ${tab === t.id ? 'bg-admin-primary text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'contact' && (
        <>
          {messages.length > 0 && (
            <div className="flex justify-end mb-4">
              <button onClick={async () => { if (!confirm('همه حذف شوند؟')) return; await api('/contact/messages', { method: 'DELETE' }); loadContact(); }} className="admin-btn-secondary text-sm text-red-500 flex items-center gap-1"><Trash2 size={14} /> پاک کردن همه</button>
            </div>
          )}
          {loading ? <div className="text-center py-12 text-gray-500">بارگذاری...</div> : messages.length === 0 ? (
            <div className="admin-card text-center py-12 text-gray-500"><Mail size={40} className="mx-auto mb-3 opacity-30" />پیامی نیست</div>
          ) : (
            <div className="space-y-4">
              {[...messages].reverse().map((msg) => (
                <div key={msg.id} className="admin-card flex justify-between gap-4">
                  <div>
                    <p className="font-semibold">{msg.name} <span className="text-sm text-gray-400 font-normal" dir="ltr">{msg.email}</span></p>
                    <p className="text-sm font-medium mt-1">{msg.subject}</p>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString('fa-IR')}</p>
                  </div>
                  <button onClick={async () => { await api(`/contact/messages/${msg.id}`, { method: 'DELETE' }); loadContact(); }} className="text-red-400 shrink-0"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'newsletter' && (
        <>
          {subscribers.length > 0 && (
            <div className="flex justify-end mb-4">
              <button onClick={() => { const csv = ['email', ...subscribers].join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'subscribers.csv'; a.click(); }} className="admin-btn-secondary text-sm">دانلود CSV</button>
            </div>
          )}
          {loading ? <div className="text-center py-12 text-gray-500">بارگذاری...</div> : subscribers.length === 0 ? (
            <div className="admin-card text-center py-12 text-gray-500"><Users size={40} className="mx-auto mb-3 opacity-30" />مشترکی نیست</div>
          ) : (
            <div className="admin-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-right"><th className="pb-3">#</th><th className="pb-3">ایمیل</th></tr></thead>
                <tbody>{subscribers.map((email, i) => (<tr key={email} className="border-b"><td className="py-3 text-gray-400">{i + 1}</td><td className="py-3 font-mono" dir="ltr">{email}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default function MessagesPage() {
  return <Suspense><MessagesInner /></Suspense>;
}
