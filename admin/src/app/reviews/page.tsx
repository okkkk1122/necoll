'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Star, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isActive: boolean;
  user: { name: string; email: string };
  product: { name: { fa: string }; slug: string };
  createdAt: string;
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api<Review[]>('/reviews/admin').then(setReviews);
  }, []);

  const toggle = async (id: string, isActive: boolean) => {
    await api(`/reviews/${id}/toggle`, { method: 'PUT' });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !isActive } : r)));
  };

  const remove = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await api(`/reviews/${id}`, { method: 'DELETE' });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت نظرات</h1>
        <p className="text-gray-500 text-sm mt-1">{reviews.length} نظر</p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className={`admin-card ${!review.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  محصول: {review.product.name.fa} • {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                </p>
                {review.comment && <p className="text-sm">{review.comment}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(review.id, review.isActive)}>
                  {review.isActive ? (
                    <ToggleRight size={22} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={22} className="text-gray-400" />
                  )}
                </button>
                <button onClick={() => remove(review.id)} className="text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-500 py-12">نظری ثبت نشده</p>
        )}
      </div>
    </AdminLayout>
  );
}
