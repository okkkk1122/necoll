'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Plus, Trash2, Save } from 'lucide-react';

interface NavItem {
  id: string;
  label: { fa: string; en?: string };
  url: string;
  isActive: boolean;
  sortOrder: number;
}

export default function NavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [newItem, setNewItem] = useState({ label: { fa: '', en: '' }, url: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api<NavItem[]>('/navigation/all').then(setNavItems);

  useEffect(() => { load(); }, []);

  const toggleActive = async (item: NavItem) => {
    await api(`/navigation/items/${item.id}`, { method: 'PUT', body: JSON.stringify({ isActive: !item.isActive }) });
    load();
  };

  const addItem = async () => {
    if (!newItem.label.fa || !newItem.url) return;
    await api('/navigation/items', {
      method: 'POST',
      body: JSON.stringify({ ...newItem, sortOrder: navItems.length + 1, isActive: true }),
    });
    setNewItem({ label: { fa: '', en: '' }, url: '' });
    setShowForm(false);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await api(`/navigation/items/${id}`, { method: 'DELETE' });
    load();
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= navItems.length) return;
    const items = [...navItems];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    await api('/navigation/items/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items: items.map((item, i) => ({ id: item.id, sortOrder: i + 1 })) }),
    });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">ناوبری سایت</h1>
          <p className="text-gray-500 text-sm mt-1">منوی هدر و نوار موبایل از اینجا کنترل می‌شود</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn-primary text-sm flex items-center gap-1">
          <Plus size={14} /> آیتم جدید
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-6 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="admin-input" placeholder="عنوان فارسی" value={newItem.label.fa} onChange={(e) => setNewItem({ ...newItem, label: { ...newItem.label, fa: e.target.value } })} />
            <input className="admin-input" placeholder="/url" dir="ltr" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} />
          </div>
          <button onClick={addItem} className="admin-btn-primary text-sm flex items-center gap-1"><Save size={14} />افزودن</button>
        </div>
      )}

      <div className="admin-card space-y-2">
        {navItems.map((item, i) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem(i, -1)} className="text-xs text-gray-400 hover:text-gray-600">▲</button>
                <button onClick={() => moveItem(i, 1)} className="text-xs text-gray-400 hover:text-gray-600">▼</button>
              </div>
              <div>
                <span className="font-medium">{item.label.fa}</span>
                <span className="text-xs text-gray-400 mr-2 font-mono" dir="ltr">{item.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleActive(item)} className={`text-xs px-3 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                {item.isActive ? 'فعال' : 'غیرفعال'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
