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

export default function SeoPage() {
  const [settings, setSettings] = useState<Setting[]>([]);

  const load = () => {
    api<Setting[]>('/config/settings?category=SEO').then(setSettings);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت سئو</h1>
        <p className="text-gray-500 text-sm mt-1">متا تگ‌ها، sitemap، robots.txt، JSON-LD</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingEditor key={setting.id} setting={setting} onUpdate={load} />
        ))}
      </div>
    </AdminLayout>
  );
}
