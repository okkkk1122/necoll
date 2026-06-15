'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import DraggableList, { DraggableItem } from '@/components/DraggableList';
import { api } from '@/lib/api';
import { ToggleLeft, ToggleRight, Puzzle, Save } from 'lucide-react';

interface Component {
  id: string;
  slug: string;
  name: string;
  type: string;
  isActive: boolean;
  sortOrder: number;
}

interface Module {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  components: Component[];
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [savingModule, setSavingModule] = useState<string | null>(null);

  const load = () => api<Module[]>('/modules').then(setModules);
  useEffect(() => { load(); }, []);

  const toggleModule = async (id: string, isActive: boolean) => {
    await api(`/modules/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !isActive }) });
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, isActive: !isActive } : m)));
  };

  const toggleComponent = async (id: string, isActive: boolean) => {
    await api(`/modules/components/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !isActive }) });
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        components: m.components.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)),
      }))
    );
  };

  const reorderComponents = async (moduleId: string, items: DraggableItem[]) => {
    setSavingModule(moduleId);
    const payload = items.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));
    await api('/modules/components/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items: payload }),
    });
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const reordered = items.map((item, i) => {
          const comp = m.components.find((c) => c.id === item.id)!;
          return { ...comp, sortOrder: i };
        });
        return { ...m, components: reordered };
      })
    );
    setSavingModule(null);
  };

  const reorderModules = async (items: DraggableItem[]) => {
    await Promise.all(
      items.map((item, index) =>
        api(`/modules/${item.id}`, { method: 'PUT', body: JSON.stringify({ sortOrder: index }) })
      )
    );
    load();
  };

  const moduleItems: DraggableItem[] = modules.map((m) => ({
    id: m.id,
    label: m.name,
    sublabel: m.slug,
    isActive: m.isActive,
  }));

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت ماژول‌ها</h1>
        <p className="text-gray-500 text-sm mt-1">Drag & Drop — جابجایی ماژول‌ها و کامپوننت‌ها</p>
      </div>

      <div className="admin-card mb-6">
        <h2 className="font-bold mb-4">ترتیب ماژول‌ها</h2>
        <DraggableList
          items={moduleItems}
          onReorder={(items) => {
            setModules((prev) => {
              const map = new Map(prev.map((m) => [m.id, m]));
              return items.map((item) => map.get(item.id)!).filter(Boolean);
            });
            reorderModules(items);
          }}
          onToggle={(id) => {
            const mod = modules.find((m) => m.id === id);
            if (mod) toggleModule(id, mod.isActive);
          }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Puzzle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{mod.name}</h3>
                  <p className="text-xs text-gray-400">{mod.slug}</p>
                </div>
              </div>
              <button onClick={() => toggleModule(mod.id, mod.isActive)}>
                {mod.isActive ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>

            {mod.description && <p className="text-sm text-gray-500 mb-3">{mod.description}</p>}

            {mod.components.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-400">کامپوننت‌ها (قابل جابجایی):</p>
                  {savingModule === mod.id && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Save size={12} /> ذخیره شد
                    </span>
                  )}
                </div>
                <DraggableList
                  items={mod.components.map((c) => ({
                    id: c.id,
                    label: c.name,
                    sublabel: c.type,
                    badge: c.slug,
                    isActive: c.isActive,
                  }))}
                  onReorder={(items) => reorderComponents(mod.id, items)}
                  onToggle={(id) => {
                    const comp = mod.components.find((c) => c.id === id);
                    if (comp) toggleComponent(id, comp.isActive);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
