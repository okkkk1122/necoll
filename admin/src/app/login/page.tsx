'use client';

import { useState } from 'react';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@necoll.ir');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        noAuth: true,
      });
      setToken(res.token);
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-sidebar">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-admin-primary">نکال</h1>
          <p className="text-gray-500 text-sm mt-1">HyperConfig Master Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="admin-label">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>
      </div>
    </div>
  );
}
