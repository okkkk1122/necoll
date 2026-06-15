'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Save } from 'lucide-react';

function BlogEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const isNew = !id;

  const [form, setForm] = useState({
    slug: '', title: { fa: '', en: '' }, excerpt: { fa: '', en: '' },
    content: { fa: '', en: '' }, isPublished: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      api<typeof form & { id: string }>(`/blog/${id}`).catch(() => {
        api<typeof form[]>(`/blog?published=false`).then((posts) => {
          const post = (posts as unknown as Array<typeof form & { id: string }>).find((p) => p.id === id);
          if (post) setForm(post);
        });
      });
    }
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await api('/blog', { method: 'POST', body: JSON.stringify(form) });
      } else {
        await api(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      router.push('/admin/blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'مقاله جدید' : 'ویرایش مقاله'}</h1>
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
