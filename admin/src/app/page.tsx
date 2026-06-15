'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import {
  Settings,
  Package,
  ShoppingCart,
  Users,
  Puzzle,
  TrendingUp,
} from 'lucide-react';

interface DashboardData {
  stats: {
    settingsCount: number;
    activeModules: number;
    productsCount: number;
    ordersCount: number;
    usersCount: number;
  };
  settingsByCategory: Array<{ category: string; _count: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    user: { name: string };
    createdAt: string;
  }>;
}

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<DashboardData>('/config/dashboard')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">داشبورد مرکزی</h1>
        <p className="text-gray-500 text-sm mt-1">کنترل پنل HyperConfig System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'تنظیمات', value: stats?.settingsCount, icon: Settings, color: 'bg-blue-500' },
          { label: 'ماژول‌های فعال', value: stats?.activeModules, icon: Puzzle, color: 'bg-purple-500' },
          { label: 'محصولات', value: stats?.productsCount, icon: Package, color: 'bg-green-500' },
          { label: 'سفارشات', value: stats?.ordersCount, icon: ShoppingCart, color: 'bg-orange-500' },
          { label: 'مشتریان', value: stats?.usersCount, icon: Users, color: 'bg-pink-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="admin-card flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value ?? 0}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            تنظیمات بر اساس دسته
          </h2>
          <div className="space-y-3">
            {data?.settingsByCategory?.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <span className="text-sm">{cat.category}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {cat._count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-bold mb-4">آخرین سفارشات</h2>
          {data?.recentOrders?.length ? (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-gray-500">{order.user.name}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">
                      {new Intl.NumberFormat('fa-IR').format(Number(order.total))} تومان
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">سفارشی ثبت نشده</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
