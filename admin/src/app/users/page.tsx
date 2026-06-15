'use client';

import AdminLayout from '@/components/AdminLayout';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت کاربران</h1>
        <p className="text-gray-500 text-sm mt-1">نقش‌ها، دسترسی‌ها، مسدودسازی</p>
      </div>

      <div className="admin-card text-center py-16">
        <Users size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">مدیریت کاربران از طریق API در دسترس است</p>
        <p className="text-sm text-gray-400 mt-2">
          نقش‌ها: SUPER_ADMIN, ADMIN, MANAGER, CUSTOMER
        </p>
      </div>
    </AdminLayout>
  );
}
