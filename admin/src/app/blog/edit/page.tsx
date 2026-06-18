'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { routes } from '@/lib/paths';
import { Save } from 'lucide-react';

function BlogEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugParam = searchParams.get('slug');
  const isNew = !slugParam;

  const [postId, setPostId] = useState('');
  const [form, setForm] = useState({
    slug: '', title: { fa: '', en: '' }, excerpt: { fa: '', en: '' },
    content: { fa: '', en: '' }, isPublished: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slugParam) {
      api<typeof form & { id: string }>(`/blog/${slugParam}`)
        .then((post) => {
          setPostId(post.id);
          setForm({
            slug: post.slug,
            title: post.title || { fa: '', en: '' },
            excerpt: post.excerpt || { fa: '', en: '' },
            content: post.content || { fa: '', en: '' },
            isPublished: post.isPublished,
          });
        })
        .catch(() => setError('مقاله یافت نشد'));
    }
  }, [slugParam]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await api('/blog', { method: 'POST', body: JSON.stringify(form) });
      } else {
        await api(`/blog/${postId}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      router.push(routes.blog);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'مقاله جدید' : 'ویرایش مقاله'}</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <div className="admin-card space-y-4 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">عنوان</label><input className="admin-input w-full mt-1" value={form.title.fa} onChange={(e) => setForm({ ...form, title: { ...form.title, fa: e.target.value } })} /></div>
          <div><label className="text-sm">Slug</label><input className="admin-input w-full mt-1" dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
        </div>
        <div><label className="text-sm">خلاصه</label><textarea className="admin-input w-full mt-1" rows={2} value={form.excerpt.fa} onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, fa: e.target.value } })} /></div>
        <div><label className="text-sm">محتوا</label><textarea className="admin-input w-full mt-1" rows={8} value={form.content.fa} onChange={(e) => setForm({ ...form, content: { ...form.content, fa: e.target.value } })} /></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />منتشر شده</label>
        <button onClick={save} disabled={saving} className="admin-btn-primary flex items-center gap-2"><Save size={16} />{saving ? 'ذخیره...' : 'ذخیره'}</button>
      </div>
    </AdminLayout>
  );
}

export default function BlogEditPage() {
  return <Suspense><BlogEditForm /></Suspense>;
}
