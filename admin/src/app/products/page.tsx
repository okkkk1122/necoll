'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: { fa: string };
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: { fa: string } };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ products: Product[] }>('/products?limit=50')
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    await api(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isFeatured: !current }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
    );
  };

  const deactivate = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await api(`/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">مدیریت محصولات</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} محصول</p>
        </div>
        <a href="/admin/products/edit" className="admin-btn-primary flex items-center gap-1">
          <Plus size={16} /> محصول جدید
        </a>
      </div>

      {loading ? (
        <div className="text-center py-12">در حال بارگذاری...</div>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right">
                <th className="pb-3 font-medium">نام</th>
                <th className="pb-3 font-medium">قیمت</th>
                <th className="pb-3 font-medium">موجودی</th>
                <th className="pb-3 font-medium">دسته</th>
                <th className="pb-3 font-medium">ویژه</th>
                <th className="pb-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{product.name.fa}</td>
                  <td className="py-3">
                    {new Intl.NumberFormat('fa-IR').format(Number(product.price))} تومان
                  </td>
                  <td className="py-3">
                    <span className={product.stock < 5 ? 'text-amber-600' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{product.category?.name?.fa || '-'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleFeatured(product.id, product.isFeatured)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                      }`}
                    >
                      {product.isFeatured ? 'ویژه' : 'عادی'}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <a href={`/admin/products/edit?slug=${product.slug}`} className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </a>
                      <button
                        onClick={() => deactivate(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
