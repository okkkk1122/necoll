'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: Array<{ product: { name: { fa: string } }; quantity: number }>;
}

const statusOptions = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<{ orders: Order[] }>('/orders').then((data) => setOrders(data.orders));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت سفارشات</h1>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-right">
              <th className="pb-3">شماره</th>
              <th className="pb-3">مشتری</th>
              <th className="pb-3">مبلغ</th>
              <th className="pb-3">وضعیت</th>
              <th className="pb-3">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 font-mono">{order.orderNumber}</td>
                <td className="py-3">{order.user.name}</td>
                <td className="py-3">
                  {new Intl.NumberFormat('fa-IR').format(Number(order.total))} تومان
                </td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">سفارشی ثبت نشده</p>
        )}
      </div>
    </AdminLayout>
  );
}
