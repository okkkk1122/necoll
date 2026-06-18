'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaUploader from '@/components/MediaUploader';
import { api } from '@/lib/api';
import { routes } from '@/lib/paths';
import { getMediaUrl } from '@/lib/media';
import { Save, X } from 'lucide-react';

const MENU_SECTIONS = [
  { value: '', label: '— بدون بخش —' },
  { value: 'clothing', label: 'پوشاک' },
  { value: 'scarves', label: 'روسری و شال' },
  { value: 'accessories', label: 'اکسسوری' },
  { value: 'sports', label: 'ورزشی' },
  { value: 'shoes-bags', label: 'کیف و کفش' },
];

const MENU_ITEMS: Record<string, { value: string; label: string }[]> = {
  sports: [
    { value: 'sport-set', label: 'ست ورزشی' },
    { value: 'sport-top', label: 'تاپ ورزشی' },
  ],
  scarves: [
    { value: 'shal', label: 'شال' },
    { value: 'rosari', label: 'روسری' },
  ],
  accessories: [
    { value: 'socks', label: 'جوراب' },
    { value: 'tote', label: 'توت بگ' },
  ],
  'shoes-bags': [
    { value: 'bags', label: 'کیف' },
    { value: 'shoes', label: 'کفش' },
  ],
};

interface FieldDef {
  id: string;
  key: string;
  label: { fa: string };
  type: string;
  isActive: boolean;
}

function ProductEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  const isNew = !slug;

  const [form, setForm] = useState({
    slug: '', name: { fa: '', en: '' }, description: { fa: '', en: '' },
    price: 0, comparePrice: 0, stock: 0, sku: '', images: [] as string[],
    categoryId: '', isFeatured: false,
    dynamicFields: {} as Record<string, string>,
  });
  const [categories, setCategories] = useState<Array<{ id: string; name: { fa: string } }>>([]);
  const [fieldDefs, setFieldDefs] = useState<FieldDef[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Array<{ id: string; name: { fa: string } }>>('/categories').then(setCategories);
    api<FieldDef[]>('/products/fields/definitions').then((fields) =>
      setFieldDefs(fields.filter((f) => f.isActive && !['menuSection', 'menuItem'].includes(f.key)))
    );
    if (slug) {
      api<typeof form & { id: string }>(`/products/${slug}`).then((p) => {
        setForm({
          slug: p.slug, name: p.name, description: p.description || { fa: '', en: '' },
          price: Number(p.price), comparePrice: Number(p.comparePrice) || 0,
          stock: p.stock, sku: p.sku || '', images: p.images || [],
          categoryId: (p as { categoryId?: string }).categoryId || '',
          isFeatured: p.isFeatured,
          dynamicFields: Object.fromEntries(
            Object.entries((p as { dynamicFields?: Record<string, string> }).dynamicFields || {}).map(([k, v]) => [k, String(v)])
          ),
        });
      }).catch(() => {});
    }
  }, [slug]);

  const menuSection = form.dynamicFields.menuSection || '';
  const menuItemOptions = MENU_ITEMS[menuSection] || [];

  const setDynamicField = (key: string, value: string) => {
    const next = { ...form.dynamicFields, [key]: value };
    if (key === 'menuSection') delete next.menuItem;
    setForm({ ...form, dynamicFields: next });
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, dynamicFields: form.dynamicFields };
      if (isNew) {
        await api('/products', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        const existing = await api<{ id: string }>(`/products/${slug}`);
        await api(`/products/${existing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      router.push(routes.products);
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
          <div><label className="text-sm">نام انگلیسی</label><input className="admin-input w-full mt-1" value={form.name.en} onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })} /></div>
          <div><label className="text-sm">SKU</label><input className="admin-input w-full mt-1" dir="ltr" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
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
        <div><label className="text-sm">توضیحات</label><textarea className="admin-input w-full mt-1" rows={4} value={form.description.fa} onChange={(e) => setForm({ ...form, description: { ...form.description, fa: e.target.value } })} /></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />محصول ویژه</label>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">فیلتر منو (بخش فروشگاه)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">بخش منو (menuSection)</label>
              <select className="admin-input w-full mt-1" value={menuSection} onChange={(e) => setDynamicField('menuSection', e.target.value)}>
                {MENU_SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {menuItemOptions.length > 0 && (
              <div>
                <label className="text-sm">زیربخش (menuItem)</label>
                <select className="admin-input w-full mt-1" value={form.dynamicFields.menuItem || ''} onChange={(e) => setDynamicField('menuItem', e.target.value)}>
                  <option value="">—</option>
                  {menuItemOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {fieldDefs.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">فیلدهای داینامیک</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fieldDefs.map((field) => (
                <div key={field.id}>
                  <label className="text-sm">{field.label.fa}</label>
                  <input
                    className="admin-input w-full mt-1"
                    value={form.dynamicFields[field.key] || ''}
                    onChange={(e) => setDynamicField(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm mb-2 block">تصاویر محصول</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={getMediaUrl(img)} alt="" className="w-20 h-20 object-cover rounded-lg" />
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
