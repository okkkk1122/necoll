'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaUploader from '@/components/MediaUploader';
import { api } from '@/lib/api';
import { Save, Plus, X } from 'lucide-react';

function ProductEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  const isNew = !slug;

  const [form, setForm] = useState({
    slug: '', name: { fa: '', en: '' }, description: { fa: '', en: '' },
    price: 0, comparePrice: 0, stock: 0, sku: '', images: [] as string[],
    categoryId: '', isFeatured: false,
  });
  const [categories, setCategories] = useState<Array<{ id: string; name: { fa: string } }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Array<{ id: string; name: { fa: string } }>>('/categories').then(setCategories);
    if (slug) {
      api<typeof form & { id: string }>(`/products/${slug}`).then((p) => {
        setForm({
          slug: p.slug, name: p.name, description: p.description || { fa: '', en: '' },
          price: Number(p.price), comparePrice: Number(p.comparePrice) || 0,
          stock: p.stock, sku: p.sku || '', images: p.images || [],
          categoryId: (p as { categoryId?: string }).categoryId || '',
          isFeatured: p.isFeatured,
        });
      }).catch(() => {});
    }
  }, [slug]);

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await api('/products', { method: 'POST', body: JSON.stringify(form) });
      } else {
        const existing = await api<{ id: string }>(`/products/${slug}`);
        await api(`/products/${existing.id}`, { method: 'PUT', body: JSON.stringify(form) });
      }
      router.push('/admin/products');
    } finally {
      setSaving(false);
    }
  };

  const addImage = (url: string) => setForm({ ...form, images: [...form.images, url] });
  const removeImage = (i: number) => setForm({ ...form, images: form.images.filter((_, j) => j !== i) });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'محصول جدید' : 'ویرایش محصول'}</h1>
      <div className="admin-card space-y-4 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">نام فارسی</label><input className="admin-input w-full mt-1" value={form.name.fa} onChange={(e) => setForm({ ...form, name: { ...form.name, fa: e.target.value } })} /></div>
          <div><label className="text-sm">Slug</label><input className="admin-input w-full mt-1" dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div><label className="text-sm">قیمت</label><input type="number" className="admin-input w-full mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          <div><label className="text-sm">قیمت قبل تخفیف</label><input type="number" className="admin-input w-full mt-1" value={form.comparePrice || ''} onChange={(e) => setForm({ ...form, comparePrice: Number(e.target.value) })} /></div>
          <div><label className="text-sm">موجودی</label><input type="number" className="admin-input w-full mt-1" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
          <div><label className="text-sm">دسته‌بندی</label>
            <select className="admin-input w-full mt-1" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">انتخاب...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name.fa}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />محصول ویژه</label>
        <div>
          <label className="text-sm mb-2 block">تصاویر محصول</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img.startsWith('/') ? `http://localhost:3011${img}` : img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button onClick={() => removeImage(i)} className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
              </div>
            ))}
          </div>
          <MediaUploader folder="products" onUploaded={addImage} />
        </div>
        <button onClick={save} disabled={saving} className="admin-btn-primary flex items-center gap-2">
          <Save size={16} />{saving ? 'ذخیره...' : 'ذخیره محصول'}
        </button>
      </div>
    </AdminLayout>
  );
}

export default function ProductEditPage() {
  return <Suspense><ProductEditForm /></Suspense>;
}
