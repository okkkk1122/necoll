'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface BusinessRule {
  id: string;
  name: string;
  description: string | null;
  condition: { field: string; operator: string; value: unknown };
  action: { type: string; payload: Record<string, unknown> };
  isActive: boolean;
  priority: number;
}

export default function BusinessRulesPage() {
  const [rules, setRules] = useState<BusinessRule[]>([]);

  useEffect(() => {
    api<BusinessRule[]>('/business-rules').then(setRules);
  }, []);

  const toggleRule = async (id: string, isActive: boolean) => {
    await api(`/business-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !isActive }),
    });
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !isActive } : r))
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">قوانین کسب‌وکار</h1>
          <p className="text-gray-500 text-sm mt-1">تعریف قوانین شرطی برای نمایش خودکار</p>
        </div>
        <button className="admin-btn-primary flex items-center gap-1">
          <Plus size={16} /> قانون جدید
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{rule.name}</h3>
                {rule.description && (
                  <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>
                    شرط: {rule.condition.field} {rule.condition.operator} {String(rule.condition.value)}
                  </span>
                  <span>عمل: {rule.action.type}</span>
                  <span>اولویت: {rule.priority}</span>
                </div>
                {typeof rule.action.payload?.text === 'string' && (
                  <span
                    className="inline-block mt-2 text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: (rule.action.payload.color as string) || '#10B981' }}
                  >
                    {rule.action.payload.text}
                  </span>
                )}
              </div>
              <button onClick={() => toggleRule(rule.id, rule.isActive)}>
                {rule.isActive ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
