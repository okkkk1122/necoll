'use client';

import { useEffect, useState } from 'react';
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

export default function FilteredSettings({
  categories,
  keys,
  sandboxId,
}: {
  categories?: string[];
  keys?: string[];
  sandboxId?: string;
}) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const fetches = categories?.length
      ? Promise.all(categories.map((c) => api<Setting[]>(`/config/settings?category=${c}${sandboxId ? `&sandbox=${sandboxId}` : ''}`)))
      : api<Setting[]>(`/config/settings${sandboxId ? `?sandbox=${sandboxId}` : ''}`).then((s) => [s]);

    fetches
      .then((groups) => {
        let combined = groups.flat();
        if (keys?.length) combined = combined.filter((s) => keys.includes(s.key));
        const seen = new Set<string>();
        setSettings(combined.filter((s) => { if (seen.has(s.key)) return false; seen.add(s.key); return true; }));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [sandboxId]);

  if (loading) return <div className="text-center py-8 text-gray-500">در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      {settings.map((s) => (
        <SettingEditor key={s.id} setting={s} onUpdate={load} sandboxId={sandboxId} />
      ))}
      {settings.length === 0 && <p className="text-gray-500 text-center py-8">تنظیمی یافت نشد</p>}
    </div>
  );
}
