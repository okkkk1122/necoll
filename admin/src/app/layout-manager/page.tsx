'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import DraggableList, { DraggableItem } from '@/components/DraggableList';
import { api } from '@/lib/api';
import { Save, RotateCcw, Layout } from 'lucide-react';

const blockLabels: Record<string, string> = {
  hero_slider: 'اسلایدر اصلی',
  featured_products: 'محصولات ویژه',
  categories: 'دسته‌بندی‌ها',
  banner: 'بنر تبلیغاتی',
  new_arrivals: 'جدیدترین‌ها',
  lookbook: 'لوک‌بوک',
  blog_posts: 'مقالات وبلاگ',
  newsletter: 'خبرنامه',
  testimonials: 'نظرات مشتریان',
  brands: 'برندها',
};

const allBlocks = Object.keys(blockLabels);

export default function LayoutManagerPage() {
  const [blocks, setBlocks] = useState<DraggableItem[]>([]);
  const [inactiveBlocks, setInactiveBlocks] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<{ value: string[] }>('/config/setting/home_layout_blocks').then((data) => {
      const active = data.value || [];
      const inactive = allBlocks.filter((b) => !active.includes(b));
      setBlocks(
        active.map((id) => ({
          id,
          label: blockLabels[id] || id,
          isActive: true,
        }))
      );
      setInactiveBlocks(inactive);
    });
  }, []);

  const handleReorder = (newItems: DraggableItem[]) => {
    setBlocks(newItems);
    setSaved(false);
  };

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

  const addBlock = (id: string) => {
    setInactiveBlocks((prev) => prev.filter((b) => b !== id));
    setBlocks((prev) => [...prev, { id, label: blockLabels[id] || id, isActive: true }]);
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const activeBlocks = blocks.filter((b) => b.isActive !== false).map((b) => b.id);
      await api('/config/settings/home_layout_blocks', {
        method: 'PUT',
        body: JSON.stringify({ value: activeBlocks }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    await api('/config/settings/home_layout_blocks/reset', { method: 'POST', body: '{}' });
    window.location.reload();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary flex items-center gap-2">
            <Layout size={24} />
            مدیریت چیدمان صفحه اصلی
          </h1>
          <p className="text-gray-500 text-sm mt-1">Drag & Drop — جابجایی و فعال/غیرفعال بلوک‌ها</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="admin-btn-secondary text-sm flex items-center gap-1">
            <RotateCcw size={14} /> بازگشت
          </button>
          <button onClick={save} disabled={saving} className="admin-btn-primary flex items-center gap-1">
            <Save size={14} />
            {saving ? 'ذخیره...' : saved ? '✓ ذخیره شد' : 'ذخیره چیدمان'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="font-bold mb-4">بلوک‌های فعال (قابل جابجایی)</h2>
          {blocks.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">بلوک فعالی وجود ندارد</p>
          ) : (
            <DraggableList items={blocks} onReorder={handleReorder} onToggle={handleToggle} />
          )}
        </div>

        <div className="admin-card">
          <h2 className="font-bold mb-4">بلوک‌های غیرفعال</h2>
          {inactiveBlocks.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">همه بلوک‌ها فعال هستند</p>
          ) : (
            <div className="space-y-2">
              {inactiveBlocks.map((id) => (
                <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                  <span className="text-sm">{blockLabels[id] || id}</span>
                  <button
                    onClick={() => addBlock(id)}
                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                  >
                    + افزودن
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-card mt-6">
        <h2 className="font-bold mb-3">پیش‌نمایش ترتیب</h2>
        <div className="flex flex-wrap gap-2">
          {blocks
            .filter((b) => b.isActive !== false)
            .map((block, i) => (
              <div
                key={block.id}
                className="px-4 py-2 bg-admin-primary/10 text-admin-primary rounded-lg text-sm font-medium"
              >
                {i + 1}. {block.label}
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
