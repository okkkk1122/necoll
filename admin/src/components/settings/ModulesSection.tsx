'use client';

import { useEffect, useState } from 'react';
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

export default function ModulesSection() {
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
    setModules((prev) => prev.map((m) => ({ ...m, components: m.components.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)) })));
  };

  const reorderComponents = async (moduleId: string, items: DraggableItem[]) => {
    setSavingModule(moduleId);
    await api('/modules/components/reorder', { method: 'PUT', body: JSON.stringify({ items: items.map((item, i) => ({ id: item.id, sortOrder: i })) }) });
    load();
    setSavingModule(null);
  };

  const moduleItems: DraggableItem[] = modules.map((m) => ({ id: m.id, label: m.name, sublabel: m.slug, isActive: m.isActive }));

  return (
    <div>
      <div className="admin-card mb-6">
        <h2 className="font-bold mb-4">ترتیب ماژول‌ها</h2>
        <DraggableList
          items={moduleItems}
          onReorder={async (items) => {
            await Promise.all(items.map((item, i) => api(`/modules/${item.id}`, { method: 'PUT', body: JSON.stringify({ sortOrder: i }) })));
            load();
          }}
          onToggle={(id) => { const m = modules.find((x) => x.id === id); if (m) toggleModule(id, m.isActive); }}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Puzzle size={20} /></div>
                <div><h3 className="font-semibold">{mod.name}</h3><p className="text-xs text-gray-400">{mod.slug}</p></div>
              </div>
              <button onClick={() => toggleModule(mod.id, mod.isActive)}>
                {mod.isActive ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-400" />}
              </button>
            </div>
            {mod.components.length > 0 && (
              <div className="border-t pt-3">
                {savingModule === mod.id && <span className="text-xs text-green-600 flex items-center gap-1 mb-2"><Save size={12} /> ذخیره شد</span>}
                <DraggableList
                  items={mod.components.map((c) => ({ id: c.id, label: c.name, sublabel: c.type, badge: c.slug, isActive: c.isActive }))}
                  onReorder={(items) => reorderComponents(mod.id, items)}
                  onToggle={(id) => { const c = mod.components.find((x) => x.id === id); if (c) toggleComponent(id, c.isActive); }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
