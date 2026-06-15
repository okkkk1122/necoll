'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import SettingEditor from '@/components/SettingEditor';
import { api } from '@/lib/api';

const integrationKeys = [
  'social_links',
  'social_enabled',
  'payment_gateways',
  'zarinpal_merchant',
  'ai_chat_enabled',
  'ai_chat_prompt',
  'openai_api_key',
];

interface Setting {
  id: string;
  key: string;
  value: unknown;
  defaultValue: unknown;
  category: string;
  layer: string;
  label: string | null;
  description: string | null;
  isActive: boolean;
  editableByAdmin: boolean;
}

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);

  const load = () => {
    api<Setting[]>('/config/settings?category=INTEGRATION')
      .then((all) => {
        api<Setting[]>('/config/settings?category=SOCIAL').then((social) => {
          api<Setting[]>('/config/settings?category=PAYMENT').then((payment) => {
            api<Setting[]>('/config/settings?category=SUPPORT').then((support) => {
              const combined = [...all, ...social, ...payment, ...support].filter((s) =>
                integrationKeys.includes(s.key)
              );
              setSettings(combined);
            });
          });
        });
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت یکپارچگی‌ها</h1>
        <p className="text-gray-500 text-sm mt-1">
          شبکه‌های اجتماعی، درگاه پرداخت، چت AI
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingEditor key={setting.id} setting={setting} onUpdate={load} />
        ))}
      </div>
    </AdminLayout>
  );
}
