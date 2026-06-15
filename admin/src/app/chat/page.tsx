'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Save, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const [enabled, setEnabled] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [welcome, setWelcome] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ value: boolean }>('/config/setting/ai_chat_enabled'),
      api<{ value: string }>('/config/setting/ai_chat_prompt'),
      api<{ value: string }>('/config/setting/ai_chat_welcome'),
      api<{ value: string }>('/config/setting/openai_api_key'),
    ]).then(([e, p, w, k]) => {
      setEnabled(e.value === true);
      setPrompt(p.value || '');
      setWelcome(w.value || '');
      setApiKey(k.value || '');
    });
  }, []);

  const save = async (key: string, value: unknown) => {
    setSaving(true);
    try {
      await api(`/config/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت چت AI</h1>
        <p className="text-gray-500 text-sm mt-1">فعال‌سازی، پرامپت و تنظیمات چت هوش مصنوعی</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-admin-accent" size={24} />
            <div>
              <h2 className="font-bold">وضعیت چت</h2>
              <p className="text-sm text-gray-500">فعال یا غیرفعال کردن چت</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEnabled(!enabled);
              save('ai_chat_enabled', !enabled);
            }}
            className={`px-6 py-3 rounded-lg font-medium ${
              enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {enabled ? '✅ چت فعال است' : '❌ چت غیرفعال است'}
          </button>
        </div>

        <div className="admin-card">
          <h2 className="font-bold mb-4">OpenAI API Key</h2>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="admin-input mb-3"
            dir="ltr"
            placeholder="sk-..."
          />
          <button
            onClick={() => save('openai_api_key', apiKey)}
            disabled={saving}
            className="admin-btn-primary flex items-center gap-1"
          >
            <Save size={14} /> ذخیره
          </button>
          <p className="text-xs text-gray-400 mt-2">
            بدون API Key، دستیار هوشمند با اطلاعات واقعی سایت (محصولات، ارسال، تخفیف، مرجوعی) پاسخ می‌دهد.
            با API Key، پاسخ‌ها دقیق‌تر و طبیعی‌تر خواهند بود.
          </p>
        </div>

        <div className="admin-card md:col-span-2">
          <h2 className="font-bold mb-4">پرامپت سیستم</h2>
          <p className="text-xs text-gray-500 mb-3">
            اطلاعات محصولات، دسته‌بندی‌ها، ارسال، تخفیف و مقالات به‌صورت خودکار به AI تزریق می‌شود.
            پرامپت فقط لحن و قوانین پاسخ‌دهی را مشخص کنید.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="admin-input h-32"
            placeholder="دستورالعمل‌های AI..."
          />
          <button
            onClick={() => save('ai_chat_prompt', prompt)}
            disabled={saving}
            className="admin-btn-primary mt-3 flex items-center gap-1"
          >
            <Save size={14} /> ذخیره پرامپت
          </button>
        </div>

        <div className="admin-card md:col-span-2">
          <h2 className="font-bold mb-4">پیام خوش‌آمد</h2>
          <input
            type="text"
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            className="admin-input"
          />
          <button
            onClick={() => save('ai_chat_welcome', welcome)}
            disabled={saving}
            className="admin-btn-primary mt-3 flex items-center gap-1"
          >
            <Save size={14} /> ذخیره
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
