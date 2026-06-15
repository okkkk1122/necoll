'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface ProductField {
  id: string;
  key: string;
  label: { fa: string };
  type: string;
  isActive: boolean;
  showIn: string[];
  sortOrder: number;
}

const showInLabels: Record<string, string> = {
  detail: 'صفحه جزئیات',
  card: 'کارت محصول',
  filter: 'فیلتر سایدبار',
  compare: 'مقایسه',
  checkout: 'چک‌اوت',
};

export default function ProductFieldsPage() {
  const [fields, setFields] = useState<ProductField[]>([]);

  useEffect(() => {
    api<ProductField[]>('/products/fields/definitions').then(setFields);
  }, []);

  const toggleField = async (id: string, isActive: boolean) => {
    await api(`/products/fields/definitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !isActive }),
    });
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, isActive: !isActive } : f)));
  };

  const toggleShowIn = async (field: ProductField, location: string) => {
    const showIn = field.showIn.includes(location)
      ? field.showIn.filter((s) => s !== location)
      : [...field.showIn, location];

    await api(`/products/fields/definitions/${field.id}`, {
      method: 'PUT',
      body: JSON.stringify({ showIn }),
    });
    setFields((prev) =>
      prev.map((f) => (f.id === field.id ? { ...f, showIn } : f))
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت فیلدهای محصول</h1>
        <p className="text-gray-500 text-sm mt-1">فعال/غیرفعال و تعیین محل نمایش هر فیلد</p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{field.label.fa}</h3>
                <p className="text-xs text-gray-400">{field.key} • {field.type}</p>
              </div>
              <button onClick={() => toggleField(field.id, field.isActive)}>
                {field.isActive ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(showInLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleShowIn(field, key)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    field.showIn.includes(key)
                      ? 'bg-admin-accent/10 border-admin-accent text-admin-accent'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
