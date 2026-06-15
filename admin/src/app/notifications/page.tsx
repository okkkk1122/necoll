'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import SettingEditor from '@/components/SettingEditor';
import { api } from '@/lib/api';

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

export default function NotificationsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);

  const load = () => {
    api<Setting[]>('/config/settings?category=NOTIFICATION').then(setSettings);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت اعلان‌ها</h1>
        <p className="text-gray-500 text-sm mt-1">ایمیل، پیامک، نوتیفیکیشن و قالب‌ها</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingEditor key={setting.id} setting={setting} onUpdate={load} />
        ))}
      </div>
    </AdminLayout>
  );
}
