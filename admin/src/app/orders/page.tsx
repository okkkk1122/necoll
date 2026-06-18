'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
  quantity: number;
  price: number;
  product: { name: { fa: string }; slug: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
  shippingAddress?: Record<string, string>;
  notes?: string;
}

const statusOptions = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار', PAID: 'پرداخت شده', PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده', DELIVERED: 'تحویل شده', CANCELLED: 'لغو شده',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    const q = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) q.set('status', statusFilter);
    api<{ orders: Order[]; pagination: { total: number } }>(`/orders?${q}`).then((d) => {
      setOrders(d.orders);
      setTotal(d.pagination.total);
    });
  };

  useEffect(() => { load(); }, [page, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await api(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت سفارشات</h1>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="admin-input w-auto">
          <option value="">همه وضعیت‌ها</option>
          {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="admin-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{order.user.name} — {order.user.email}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('fa-IR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium">{new Intl.NumberFormat('fa-IR').format(Number(order.total))} تومان</p>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="text-xs border rounded px-2 py-1">
                  {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
                <button onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="text-gray-400">
                  {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            {expanded === order.id && (
              <div className="mt-4 pt-4 border-t text-sm space-y-2">
                <p>جمع: {new Intl.NumberFormat('fa-IR').format(Number(order.subtotal))} + ارسال {new Intl.NumberFormat('fa-IR').format(Number(order.shippingCost))}</p>
                {order.notes && <p className="text-gray-500">یادداشت: {order.notes}</p>}
                <table className="w-full mt-2">
                  <thead><tr className="text-right text-xs text-gray-400"><th className="pb-2">محصول</th><th className="pb-2">تعداد</th><th className="pb-2">قیمت</th></tr></thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{item.product.name.fa}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{new Intl.NumberFormat('fa-IR').format(Number(item.price))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-center py-12 text-gray-500">سفارشی نیست</p>}
      </div>

      <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
        <span>{total} سفارش</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="admin-btn-secondary text-xs">قبلی</button>
          <span>صفحه {page}</span>
          <button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} className="admin-btn-secondary text-xs">بعدی</button>
        </div>
      </div>
    </AdminLayout>
  );
}
