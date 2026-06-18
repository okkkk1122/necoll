'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, Save } from 'lucide-react';

interface BusinessRule {
  id: string;
  name: string;
  description: string | null;
  condition: { field: string; operator: string; value: unknown };
  action: { type: string; payload: Record<string, unknown> };
  isActive: boolean;
  priority: number;
}

const emptyForm = { name: '', description: '', field: 'stock', operator: 'lt', value: '5', actionType: 'show_badge', badgeText: '', badgeColor: '#F59E0B', priority: 0 };

export default function RulesSection() {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api<BusinessRule[]>('/business-rules').then(setRules);
  useEffect(() => { load(); }, []);

  const buildPayload = () => ({
    name: form.name, description: form.description || null,
    condition: { field: form.field, operator: form.operator, value: form.value },
    action: { type: form.actionType, payload: { text: form.badgeText, color: form.badgeColor } },
    priority: form.priority,
  });

  const saveRule = async () => {
    setSaving(true);
    try {
      if (editingId) await api(`/business-rules/${editingId}`, { method: 'PUT', body: JSON.stringify(buildPayload()) });
      else await api('/business-rules', { method: 'POST', body: JSON.stringify({ ...buildPayload(), isActive: true }) });
      setForm(emptyForm); setEditingId(null); setShowForm(false); await load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }} className="admin-btn-primary text-sm flex items-center gap-1"><Plus size={14} /> قانون جدید</button>
      </div>
      {showForm && (
        <div className="admin-card mb-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="admin-input" placeholder="نام" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="admin-input" placeholder="فیلد شرط" dir="ltr" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
            <input className="admin-input" placeholder="عملگر" dir="ltr" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} />
            <input className="admin-input" placeholder="مقدار" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            <input className="admin-input" placeholder="متن نشان" value={form.badgeText} onChange={(e) => setForm({ ...form, badgeText: e.target.value })} />
            <input type="number" className="admin-input" placeholder="اولویت" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>
          <button onClick={saveRule} disabled={saving || !form.name} className="admin-btn-primary text-sm"><Save size={14} className="inline ml-1" />ذخیره</button>
        </div>
      )}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{rule.name}</h3>
              <p className="text-xs text-gray-400">{rule.condition.field} {rule.condition.operator} {String(rule.condition.value)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditingId(rule.id); setForm({ name: rule.name, description: rule.description || '', field: rule.condition.field, operator: rule.condition.operator, value: String(rule.condition.value), actionType: rule.action.type, badgeText: String(rule.action.payload?.text || ''), badgeColor: String(rule.action.payload?.color || '#10B981'), priority: rule.priority }); setShowForm(true); }} className="text-blue-500"><Pencil size={16} /></button>
              <button onClick={async () => { if (!confirm('حذف؟')) return; await api(`/business-rules/${rule.id}`, { method: 'DELETE' }); load(); }} className="text-red-400"><Trash2 size={16} /></button>
              <button onClick={async () => { await api(`/business-rules/${rule.id}`, { method: 'PUT', body: JSON.stringify({ isActive: !rule.isActive }) }); load(); }}>
                {rule.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
