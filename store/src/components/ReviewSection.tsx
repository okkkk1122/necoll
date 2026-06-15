'use client';

import { useEffect, useState } from 'react';
import { getClientAPI } from '@/lib/api';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  user: { name: string };
  createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => {
    getClientAPI()
      .get<{ reviews: Review[]; average: number; count: number }>(`/reviews/product/${productId}`)
      .then((data) => {
        setReviews(data.reviews);
        setAverage(data.average || 0);
        setCount(data.count);
      })
      .catch(() => {});
  };

  useEffect(() => { load(); }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('user_token');
    if (!token) {
      setMessage('برای ثبت نظر ابتدا وارد شوید');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await getClientAPI().post('/reviews', { productId, rating, comment }, token);
      setComment('');
      setRating(5);
      setMessage('نظر شما ثبت شد');
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'خطا');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">نظرات</h2>
        {count > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span>{average.toFixed(1)}</span>
            <span className="text-gray-400">({count} نظر)</span>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="card p-4 mb-6">
        <h3 className="font-medium mb-3 text-sm">نظر خود را بنویسید</h3>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star
                size={20}
                className={n <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="تجربه خود از این محصول..."
          className="w-full border rounded-xl px-4 py-2 text-sm h-24 mb-3"
        />
        {message && <p className="text-sm mb-2 text-gray-600">{message}</p>}
        <button type="submit" disabled={loading} className="btn-primary text-sm px-6 disabled:opacity-50">
          {loading ? 'در حال ارسال...' : 'ثبت نظر'}
        </button>
      </form>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{review.user.name}</span>
              <div className="flex">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs text-gray-400 mr-auto">
                {new Date(review.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
            {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm">هنوز نظری ثبت نشده. اولین نفر باشید!</p>
        )}
      </div>
    </section>
  );
}
