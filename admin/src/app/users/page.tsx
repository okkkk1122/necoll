'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';

interface UserRow {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
}

const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CUSTOMER'];

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => api<UserRow[]>('/users').then(setUsers);

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (id: string, patch: Partial<UserRow>) => {
    setSaving(id);
    try {
      const updated = await api<UserRow>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } finally {
      setSaving(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت کاربران</h1>
        <p className="text-gray-500 text-sm mt-1">نقش‌ها، فعال‌سازی و مسدودسازی</p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="admin-card grid md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400" dir="ltr">{user.email}</p>
            </div>
            <select
              className="admin-input"
              value={user.role}
              onChange={(e) => updateUser(user.id, { role: e.target.value })}
              disabled={saving === user.id}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={user.isActive}
                onChange={(e) => updateUser(user.id, { isActive: e.target.checked })}
                disabled={saving === user.id}
              />
              فعال
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={user.isBlocked}
                onChange={(e) => updateUser(user.id, { isBlocked: e.target.checked })}
                disabled={saving === user.id}
              />
              مسدود
            </label>
            <span className="text-xs text-gray-400">
              {new Date(user.createdAt).toLocaleDateString('fa-IR')}
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
