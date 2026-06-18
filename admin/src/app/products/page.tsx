'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { routes } from '@/lib/paths';
import AdminLayout from '@/components/AdminLayout';
import MediaUploader from '@/components/MediaUploader';
import { api } from '@/lib/api';
import { getMediaUrl } from '@/lib/media';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, ChevronDown, ChevronUp } from 'lucide-react';

type Tab = 'products' | 'categories' | 'fields';

interface Product {
  id: string;
  slug: string;
  name: { fa: string };
  price: number;
  stock: number;
  isFeatured: boolean;
  category?: { name: { fa: string } };
}

interface Category {
  id: string;
  slug: string;
  name: { fa: string; en?: string };
  image?: string | null;
  isActive: boolean;
}

interface ProductField {
  id: string;
  key: string;
  label: { fa: string };
  type: string;
  isActive: boolean;
  showIn: string[];
}

const showInLabels: Record<string, string> = {
  detail: 'جزئیات', card: 'کارت', filter: 'فیلتر', compare: 'مقایسه', checkout: 'چک‌اوت',
};

function ProductsHubInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catForm, setCatForm] = useState({ slug: '', nameFa: '', nameEn: '', image: '' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { slug: string; nameFa: string; nameEn: string; image: string }>>({});

  const [fields, setFields] = useState<ProductField[]>([]);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t) setTab(t);
  }, [searchParams]);

  const loadProducts = () => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) q.set('search', search);
    api<{ products: Product[]; pagination: { total: number } }>(`/products?${q}`)
      .then((d) => { setProducts(d.products); setTotal(d.pagination.total); })
      .finally(() => setLoading(false));
  };

  const loadCategories = () => api<Category[]>('/categories/all').then(setCategories);
  const loadFields = () => api<ProductField[]>('/products/fields/definitions').then(setFields);

  useEffect(() => { if (tab === 'products') loadProducts(); }, [tab, page, search]);
  useEffect(() => { if (tab === 'categories') loadCategories(); }, [tab]);
  useEffect(() => { if (tab === 'fields') loadFields(); }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'products', label: 'محصولات' },
    { id: 'categories', label: 'دسته‌بندی‌ها' },
    { id: 'fields', label: 'فیلدهای محصول' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-admin-primary">مدیریت فروشگاه</h1>
        {tab === 'products' && (
          <Link href={routes.productsEdit} className="admin-btn-primary flex items-center gap-1"><Plus size={16} /> محصول جدید</Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm ${tab === t.id ? 'bg-admin-primary text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <div className="mb-4">
            <input className="admin-input max-w-md" placeholder="جستجو..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          {loading ? <div className="text-center py-12">بارگذاری...</div> : (
            <div className="admin-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-right"><th className="pb-3">نام</th><th className="pb-3">قیمت</th><th className="pb-3">موجودی</th><th className="pb-3">دسته</th><th className="pb-3">ویژه</th><th className="pb-3">عملیات</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 font-medium">{p.name.fa}</td>
                      <td className="py-3">{new Intl.NumberFormat('fa-IR').format(Number(p.price))} تومان</td>
                      <td className="py-3">{p.stock}</td>
                      <td className="py-3 text-gray-500">{p.category?.name?.fa || '-'}</td>
                      <td className="py-3">
                        <button onClick={async () => { await api(`/products/${p.id}`, { method: 'PUT', body: JSON.stringify({ isFeatured: !p.isFeatured }) }); loadProducts(); }} className={`text-xs px-2 py-1 rounded-full ${p.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`}>{p.isFeatured ? 'ویژه' : 'عادی'}</button>
                      </td>
                      <td className="py-3 flex gap-2">
                        <Link href={`${routes.productsEdit}?slug=${p.slug}`} className="text-blue-500"><Edit size={16} /></Link>
                        <button onClick={async () => { if (!confirm('حذف؟')) return; await api(`/products/${p.id}`, { method: 'DELETE' }); loadProducts(); }} className="text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{total} محصول</span>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="admin-btn-secondary text-xs">قبلی</button>
                  <span>صفحه {page}</span>
                  <button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} className="admin-btn-secondary text-xs">بعدی</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'categories' && (
        <>
          <div className="admin-card mb-4 grid md:grid-cols-4 gap-3">
            <input className="admin-input" placeholder="slug" dir="ltr" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
            <input className="admin-input" placeholder="نام فارسی" value={catForm.nameFa} onChange={(e) => setCatForm({ ...catForm, nameFa: e.target.value })} />
            <input className="admin-input" placeholder="نام انگلیسی" value={catForm.nameEn} onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })} />
            <button onClick={async () => { if (!catForm.slug || !catForm.nameFa) return; await api('/categories', { method: 'POST', body: JSON.stringify({ slug: catForm.slug, name: { fa: catForm.nameFa, en: catForm.nameEn }, image: catForm.image || null, isActive: true }) }); setCatForm({ slug: '', nameFa: '', nameEn: '', image: '' }); loadCategories(); }} className="admin-btn-primary"><Plus size={16} className="inline" /> افزودن</button>
            <div className="md:col-span-4"><MediaUploader folder="categories" currentUrl={catForm.image} onUploaded={(url) => setCatForm({ ...catForm, image: url })} /></div>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => {
              const isOpen = expandedId === cat.id;
              const edit = edits[cat.id];
              return (
                <div key={cat.id} className="admin-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {cat.image && <img src={getMediaUrl(cat.image)} alt="" className="w-10 h-10 object-cover rounded" />}
                      <div><p className="font-semibold">{cat.name.fa}</p><p className="text-xs text-gray-400">{cat.slug}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={cat.isActive} onChange={async (e) => { await api(`/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify({ isActive: e.target.checked }) }); loadCategories(); }} />
                      <button onClick={() => { if (isOpen) setExpandedId(null); else { setExpandedId(cat.id); setEdits({ ...edits, [cat.id]: { slug: cat.slug, nameFa: cat.name.fa, nameEn: cat.name.en || '', image: cat.image || '' } }); } }} className="text-blue-600 text-sm">{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                      <button onClick={async () => { if (!confirm('غیرفعال شود؟')) return; await api(`/categories/${cat.id}`, { method: 'DELETE' }); loadCategories(); }} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  {isOpen && edit && (
                    <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-3">
                      <input className="admin-input" dir="ltr" value={edit.slug} onChange={(e) => setEdits({ ...edits, [cat.id]: { ...edit, slug: e.target.value } })} />
                      <input className="admin-input" value={edit.nameFa} onChange={(e) => setEdits({ ...edits, [cat.id]: { ...edit, nameFa: e.target.value } })} />
                      <MediaUploader folder="categories" currentUrl={edit.image} onUploaded={(url) => setEdits({ ...edits, [cat.id]: { ...edit, image: url } })} />
                      <button onClick={async () => { await api(`/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify({ slug: edit.slug, name: { fa: edit.nameFa, en: edit.nameEn }, image: edit.image || null }) }); setExpandedId(null); loadCategories(); }} className="admin-btn-primary text-sm md:col-span-2"><Save size={14} className="inline" /> ذخیره</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'fields' && (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="admin-card">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="font-semibold">{field.label.fa}</h3><p className="text-xs text-gray-400">{field.key}</p></div>
                <button onClick={async () => { await api(`/products/fields/definitions/${field.id}`, { method: 'PUT', body: JSON.stringify({ isActive: !field.isActive }) }); loadFields(); }}>
                  {field.isActive ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-400" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(showInLabels).map(([key, label]) => (
                  <button key={key} onClick={async () => { const showIn = field.showIn.includes(key) ? field.showIn.filter((s) => s !== key) : [...field.showIn, key]; await api(`/products/fields/definitions/${field.id}`, { method: 'PUT', body: JSON.stringify({ showIn }) }); loadFields(); }} className={`text-xs px-3 py-1.5 rounded-full border ${field.showIn.includes(key) ? 'bg-admin-accent/10 border-admin-accent text-admin-accent' : 'border-gray-200 text-gray-500'}`}>{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default function ProductsPage() {
  return <Suspense><ProductsHubInner /></Suspense>;
}
