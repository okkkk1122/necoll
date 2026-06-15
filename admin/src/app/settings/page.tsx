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

const categoryLabels: Record<string, string> = {
  GENERAL: 'عمومی',
  APPEARANCE: 'ظاهر',
  PRODUCT: 'محصولات',
  NAVIGATION: 'ناوبری',
  PAYMENT: 'پرداخت',
  SOCIAL: 'شبکه‌های اجتماعی',
  SEO: 'سئو',
  NOTIFICATION: 'اعلان‌ها',
  INTEGRATION: 'یکپارچگی',
  BUSINESS_RULE: 'قوانین',
  LAYOUT: 'چیدمان',
  MODULE: 'ماژول',
  SUPPORT: 'پشتیبانی',
};

const layerLabels: Record<string, string> = {
  SYSTEM: 'سیستمی',
  MODULE: 'ماژول',
  COMPONENT: 'کامپوننت',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [filter, setFilter] = useState({ category: '', layer: '' });
  const [loading, setLoading] = useState(true);

  const loadSettings = () => {
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.layer) params.set('layer', filter.layer);
    api<Setting[]>(`/config/settings?${params}`)
      .then(setSettings)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, [filter]);

  const categories = Array.from(new Set(settings.map((s) => s.category)));

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">تنظیمات HyperConfig</h1>
        <p className="text-gray-500 text-sm mt-1">مدیریت سه‌لایه تنظیمات سیستم</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filter.layer}
          onChange={(e) => setFilter({ ...filter, layer: e.target.value })}
          className="admin-input w-auto"
        >
          <option value="">همه لایه‌ها</option>
          {Object.entries(layerLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="admin-input w-auto"
        >
          <option value="">همه دسته‌ها</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <SettingEditor key={setting.id} setting={setting} onUpdate={loadSettings} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
