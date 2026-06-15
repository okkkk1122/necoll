'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Save, RotateCcw } from 'lucide-react';

type ThemeColors = Record<string, string>;

const colorLabels: Record<string, string> = {
  primary: 'رنگ اصلی',
  secondary: 'رنگ ثانویه',
  accent: 'رنگ تاکیدی',
  background: 'پس‌زمینه',
  surface: 'سطح',
  text: 'متن',
  textMuted: 'متن کم‌رنگ',
  header: 'هدر',
  footer: 'فوتر',
  button: 'دکمه',
  buttonText: 'متن دکمه',
  link: 'لینک',
  card: 'کارت',
  border: 'حاشیه',
};

export default function ThemePage() {
  const [colors, setColors] = useState<ThemeColors>({} as ThemeColors);
  const [typography, setTypography] = useState<Record<string, string>>({});
  const [spacing, setSpacing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ value: ThemeColors }>('/config/setting/colors_theme'),
      api<{ value: Record<string, string> }>('/config/setting/typography'),
      api<{ value: Record<string, string> }>('/config/setting/spacing'),
    ]).then(([c, t, s]) => {
      setColors(c.value);
      setTypography(t.value);
      setSpacing(s.value);
    });
  }, []);

  const saveSetting = async (key: string, value: unknown) => {
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

  const resetSetting = async (key: string) => {
    await api(`/config/settings/${key}/reset`, { method: 'POST' });
    window.location.reload();
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت تم و ظاهر</h1>
        <p className="text-gray-500 text-sm mt-1">تغییر رنگ‌ها، فونت‌ها و فاصله‌گذاری بدون CSS</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">رنگ‌ها</h2>
            <button onClick={() => resetSetting('colors_theme')} className="text-sm text-gray-500 flex items-center gap-1">
              <RotateCcw size={14} /> بازگشت
            </button>
          </div>
          <div className="space-y-3">
            {Object.entries(colorLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={(colors as Record<string, string>)[key] || '#000000'}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    value={(colors as Record<string, string>)[key] || ''}
                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                    className="admin-input text-xs mt-0.5"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => saveSetting('colors_theme', colors)}
            disabled={saving}
            className="admin-btn-primary mt-4 flex items-center gap-1"
          >
            <Save size={14} /> ذخیره رنگ‌ها
          </button>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="font-bold mb-4">تایپوگرافی</h2>
            {Object.entries(typography).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="admin-label">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setTypography({ ...typography, [key]: e.target.value })}
                  className="admin-input"
                  dir="ltr"
                />
              </div>
            ))}
            <button
              onClick={() => saveSetting('typography', typography)}
              className="admin-btn-primary flex items-center gap-1"
            >
              <Save size={14} /> ذخیره
            </button>
          </div>

          <div className="admin-card">
            <h2 className="font-bold mb-4">فاصله‌گذاری</h2>
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="admin-label">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setSpacing({ ...spacing, [key]: e.target.value })}
                  className="admin-input"
                  dir="ltr"
                />
              </div>
            ))}
            <button
              onClick={() => saveSetting('spacing', spacing)}
              className="admin-btn-primary flex items-center gap-1"
            >
              <Save size={14} /> ذخیره
            </button>
          </div>

          <div className="admin-card">
            <h2 className="font-bold mb-4">پیش‌نمایش</h2>
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: colors.background, color: colors.text }}
            >
              <div
                className="rounded-lg p-4 mb-3"
                style={{ backgroundColor: colors.header, color: '#fff' }}
              >
                هدر سایت
              </div>
              <div
                className="rounded-lg p-4 mb-3"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
              >
                <p>کارت محصول نمونه</p>
                <button
                  className="mt-2 px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: colors.button, color: colors.buttonText }}
                >
                  دکمه
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
