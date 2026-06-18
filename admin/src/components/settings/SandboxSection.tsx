'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/paths';
import { api } from '@/lib/api';
import { FlaskConical, Play, Trash2, Plus, Settings } from 'lucide-react';

interface SandboxSession {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  _count: { overrides: number };
}

export default function SandboxSection() {
  const [sessions, setSessions] = useState<SandboxSession[]>([]);
  const [creating, setCreating] = useState(false);

  const load = () => api<SandboxSession[]>('/config/sandbox').then(setSessions);

  useEffect(() => { load(); }, []);

  const createSandbox = async () => {
    setCreating(true);
    try {
      await api('/config/sandbox', { method: 'POST', body: JSON.stringify({ name: `Sandbox ${new Date().toLocaleString('fa-IR')}` }) });
      load();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="admin-card bg-blue-50 border-blue-200 mb-6">
        <div className="flex items-start gap-3">
          <FlaskConical className="text-blue-500 mt-0.5" size={20} />
          <p className="text-sm text-blue-600">Sandbox ایجاد کنید، تنظیمات را ویرایش کنید، سپس اعمال کنید.</p>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={createSandbox} disabled={creating} className="admin-btn-primary text-sm flex items-center gap-1">
          <Plus size={16} /> {creating ? 'ایجاد...' : 'Sandbox جدید'}
        </button>
      </div>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{session.name}</h3>
              <p className="text-sm text-gray-500">{session._count.overrides} تغییر • {new Date(session.createdAt).toLocaleString('fa-IR')}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`${routes.settings}?tab=config&sandbox=${session.id}`} className="admin-btn-secondary text-sm flex items-center gap-1">
                <Settings size={14} /> ویرایش
              </Link>
              <button onClick={async () => { if (!confirm('اعمال شود؟')) return; const r = await api<{ appliedCount: number }>(`/config/sandbox/${session.id}/apply`, { method: 'POST' }); alert(`${r.appliedCount} تنظیم اعمال شد`); load(); }} className="admin-btn-primary text-sm flex items-center gap-1">
                <Play size={14} /> اعمال
              </button>
              <button onClick={async () => { if (!confirm('حذف شود؟')) return; await api(`/config/sandbox/${session.id}`, { method: 'DELETE' }); load(); }} className="admin-btn-secondary text-sm text-red-500 flex items-center gap-1">
                <Trash2 size={14} /> حذف
              </button>
            </div>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-center text-gray-500 py-8">Sandbox فعالی نیست</p>}
      </div>
    </div>
  );
}
