'use client';

import { useEffect, useState } from 'react';
import DraggableList, { DraggableItem } from '@/components/DraggableList';
import { api } from '@/lib/api';
import { Save, RotateCcw } from 'lucide-react';

const blockLabels: Record<string, string> = {
  hero_slider: 'اسلایدر اصلی',
  featured_products: 'محصولات ویژه',
  categories: 'دسته‌بندی‌ها',
  home_categories: 'دسته‌های صفحه اصلی',
  banner: 'بنر تبلیغاتی',
  new_arrivals: 'جدیدترین‌ها',
  lookbook: 'لوک‌بوک',
  blog_posts: 'مقالات وبلاگ',
  newsletter: 'خبرنامه',
  testimonials: 'نظرات مشتریان',
  brands: 'برندها',
};

const blockAliases: Record<string, string> = { home_categories: 'categories' };
const allBlocks = Object.keys(blockLabels);

function normalizeBlockId(id: string) {
  return blockAliases[id] || id;
}

function displayBlockId(id: string) {
  return blockLabels[id] || blockLabels[blockAliases[id]] || id;
}

export default function LayoutSection() {
  const [blocks, setBlocks] = useState<DraggableItem[]>([]);
  const [inactiveBlocks, setInactiveBlocks] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<{ value: string[] }>('/config/setting/home_layout_blocks').then((data) => {
      const active = (data.value || []).map(normalizeBlockId);
      const uniqueActive = Array.from(new Set(active));
      const inactive = allBlocks.filter((b) => !uniqueActive.includes(normalizeBlockId(b)));
      setBlocks(uniqueActive.map((id) => ({ id, label: displayBlockId(id), isActive: true })));
      setInactiveBlocks(inactive);
    });
  }, []);

  const handleToggle = (id: string) => {
    const item = blocks.find((b) => b.id === id);
    if (!item) return;
    if (item.isActive !== false) {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      setInactiveBlocks((prev) => [...prev, id]);
    } else {
      setInactiveBlocks((prev) => prev.filter((b) => b !== id));
      setBlocks((prev) => [...prev, { ...item, isActive: true }]);
    }
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const activeBlocks = blocks.filter((b) => b.isActive !== false).map((b) => b.id);
      await api('/config/settings/home_layout_blocks', { method: 'PUT', body: JSON.stringify({ value: activeBlocks }) });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={() => api('/config/settings/home_layout_blocks/reset', { method: 'POST', body: '{}' }).then(() => window.location.reload())} className="admin-btn-secondary text-sm flex items-center gap-1">
          <RotateCcw size={14} /> بازگشت
        </button>
        <button onClick={save} disabled={saving} className="admin-btn-primary text-sm flex items-center gap-1">
          <Save size={14} /> {saving ? 'ذخیره...' : saved ? '✓ ذخیره شد' : 'ذخیره چیدمان'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="font-bold mb-4">بلوک‌های فعال</h2>
          {blocks.length === 0 ? <p className="text-gray-500 text-sm">بلوک فعالی نیست</p> : (
            <DraggableList items={blocks} onReorder={setBlocks} onToggle={handleToggle} />
          )}
        </div>
        <div className="admin-card">
          <h2 className="font-bold mb-4">بلوک‌های غیرفعال</h2>
          <div className="space-y-2">
            {inactiveBlocks.map((id) => (
              <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                <span className="text-sm">{displayBlockId(id)}</span>
                <button onClick={() => { setInactiveBlocks((p) => p.filter((b) => b !== id)); setBlocks((p) => [...p, { id, label: displayBlockId(id), isActive: true }]); setSaved(false); }} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">+ افزودن</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
