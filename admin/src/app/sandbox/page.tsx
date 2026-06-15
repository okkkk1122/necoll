'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { FlaskConical, Play, Trash2, Plus } from 'lucide-react';

interface SandboxSession {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  _count: { overrides: number };
}

export default function SandboxPage() {
  const [sessions, setSessions] = useState<SandboxSession[]>([]);
  const [creating, setCreating] = useState(false);

  const loadSessions = () => {
    api<SandboxSession[]>('/config/sandbox').then(setSessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const createSandbox = async () => {
    setCreating(true);
    try {
      await api('/config/sandbox', {
        method: 'POST',
        body: JSON.stringify({ name: `Sandbox ${new Date().toLocaleString('fa-IR')}` }),
      });
      loadSessions();
    } finally {
      setCreating(false);
    }
  };

  const applySandbox = async (id: string) => {
    if (!confirm('تغییرات sandbox روی سایت زنده اعمال شود؟')) return;
    const res = await api<{ appliedCount: number }>(`/config/sandbox/${id}/apply`, {
      method: 'POST',
    });
    alert(`${res.appliedCount} تنظیم اعمال شد`);
    loadSessions();
  };

  const discardSandbox = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await api(`/config/sandbox/${id}`, { method: 'DELETE' });
    loadSessions();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">شبیه‌ساز تنظیمات</h1>
          <p className="text-gray-500 text-sm mt-1">
            تست تغییرات قبل از اعمال روی سایت زنده
          </p>
        </div>
        <button
          onClick={createSandbox}
          disabled={creating}
          className="admin-btn-primary flex items-center gap-1"
        >
          <Plus size={16} />
          {creating ? 'ایجاد...' : 'Sandbox جدید'}
        </button>
      </div>

      <div className="admin-card bg-blue-50 border-blue-200 mb-6">
        <div className="flex items-start gap-3">
          <FlaskConical className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-800">نحوه کار Sandbox</h3>
            <p className="text-sm text-blue-600 mt-1">
              ۱. یک sandbox ایجاد کنید ۲. تنظیمات را در sandbox تغییر دهید ۳. پیش‌نمایش کنید
              ۴. در صورت رضایت، «اعمال» را بزنید
            </p>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FlaskConical size={48} className="mx-auto mb-4 opacity-30" />
          <p>هیچ sandbox فعالی وجود ندارد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="admin-card flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{session.name}</h3>
                <p className="text-sm text-gray-500">
                  {session._count.overrides} تغییر • ایجاد:{' '}
                  {new Date(session.createdAt).toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => applySandbox(session.id)}
                  className="admin-btn-primary text-sm flex items-center gap-1"
                >
                  <Play size={14} /> اعمال
                </button>
                <button
                  onClick={() => discardSandbox(session.id)}
                  className="admin-btn-secondary text-sm flex items-center gap-1 text-red-500"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
