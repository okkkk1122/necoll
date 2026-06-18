'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Plus, Trash2, Save, ChevronDown, ChevronLeft, Route } from 'lucide-react';

interface NavItem {
  id: string;
  label: { fa: string; en?: string };
  url: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: string | null;
  children?: NavItem[];
}

interface RouteConfig {
  id: string;
  path: string;
  pageType: string;
  isActive: boolean;
  redirectTo?: string | null;
  seoConfig?: { title?: string; titleTemplate?: string } | null;
}

type Tab = 'menu' | 'routes';

function NavItemRow({
  item,
  depth,
  onUpdate,
  onDelete,
  onAddChild,
}: {
  item: NavItem;
  depth: number;
  onUpdate: (id: string, patch: Partial<NavItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ fa: item.label.fa, en: item.label.en || '', url: item.url });
  const hasChildren = (item.children?.length ?? 0) > 0;

  const saveEdit = async () => {
    await onUpdate(item.id, {
      label: { fa: draft.fa, en: draft.en },
      url: draft.url,
    });
    setEditing(false);
  };

  return (
    <div>
      <div
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-1"
        style={{ marginRight: depth * 16 }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 shrink-0">
              {expanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          {editing ? (
            <div className="grid md:grid-cols-3 gap-2 flex-1">
              <input className="admin-input text-sm" value={draft.fa} onChange={(e) => setDraft({ ...draft, fa: e.target.value })} placeholder="عنوان فارسی" />
              <input className="admin-input text-sm" dir="ltr" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="/url" />
              <div className="flex gap-1">
                <button onClick={saveEdit} className="admin-btn-primary text-xs px-2"><Save size={12} /></button>
                <button onClick={() => setEditing(false)} className="admin-btn-secondary text-xs px-2">لغو</button>
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <span className="font-medium">{item.label.fa}</span>
              <span className="text-xs text-gray-400 mr-2 font-mono truncate" dir="ltr">{item.url}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-xs text-blue-600">ویرایش</button>
          )}
          {depth < 2 && (
            <button onClick={() => onAddChild(item.id)} className="text-xs text-green-600">+ زیرمنو</button>
          )}
          <button
            onClick={() => onUpdate(item.id, { isActive: !item.isActive })}
            className={`text-xs px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
          >
            {item.isActive ? 'فعال' : 'غیرفعال'}
          </button>
          <button onClick={() => onDelete(item.id)} className="text-red-500"><Trash2 size={16} /></button>
        </div>
      </div>
      {expanded && item.children?.map((child) => (
        <NavItemRow
          key={child.id}
          item={child}
          depth={depth + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
}

export default function NavigationPage() {
  const [tab, setTab] = useState<Tab>('menu');
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [newItem, setNewItem] = useState({ label: { fa: '', en: '' }, url: '', parentId: '' as string | null });
  const [showForm, setShowForm] = useState(false);

  const loadMenu = () => api<NavItem[]>('/navigation/all').then(setNavItems);
  const loadRoutes = () => api<RouteConfig[]>('/navigation/routes').then(setRoutes);

  useEffect(() => {
    loadMenu();
    loadRoutes();
  }, []);

  const updateItem = async (id: string, patch: Partial<NavItem>) => {
    await api(`/navigation/items/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
    loadMenu();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await api(`/navigation/items/${id}`, { method: 'DELETE' });
    loadMenu();
  };

  const addItem = async () => {
    if (!newItem.label.fa || !newItem.url) return;
    await api('/navigation/items', {
      method: 'POST',
      body: JSON.stringify({
        label: newItem.label,
        url: newItem.url,
        parentId: newItem.parentId || null,
        sortOrder: navItems.length + 1,
        isActive: true,
      }),
    });
    setNewItem({ label: { fa: '', en: '' }, url: '', parentId: null });
    setShowForm(false);
    loadMenu();
  };

  const addChild = (parentId: string) => {
    setNewItem({ label: { fa: '', en: '' }, url: '', parentId });
    setShowForm(true);
  };

  const updateRoute = async (route: RouteConfig, patch: Partial<RouteConfig>) => {
    await api(`/navigation/routes/${route.id}`, { method: 'PUT', body: JSON.stringify(patch) });
    loadRoutes();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">ناوبری و مسیرها</h1>
          <p className="text-gray-500 text-sm mt-1">منوی هدر، زیرمنوها و تنظیم مسیرهای سایت</p>
        </div>
        {tab === 'menu' && (
          <button onClick={() => { setNewItem({ label: { fa: '', en: '' }, url: '', parentId: null }); setShowForm(!showForm); }} className="admin-btn-primary text-sm flex items-center gap-1">
            <Plus size={14} /> آیتم سطح اول
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('menu')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'menu' ? 'bg-admin-primary text-white' : 'bg-gray-100'}`}>منوی ناوبری</button>
        <button onClick={() => setTab('routes')} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${tab === 'routes' ? 'bg-admin-primary text-white' : 'bg-gray-100'}`}>
          <Route size={14} /> مسیرها (Routes)
        </button>
      </div>

      {tab === 'menu' && showForm && (
        <div className="admin-card mb-6 space-y-3">
          {newItem.parentId && <p className="text-xs text-gray-500">افزودن زیرمنو</p>}
          <div className="grid md:grid-cols-2 gap-3">
            <input className="admin-input" placeholder="عنوان فارسی" value={newItem.label.fa} onChange={(e) => setNewItem({ ...newItem, label: { ...newItem.label, fa: e.target.value } })} />
            <input className="admin-input" placeholder="/url" dir="ltr" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} />
          </div>
          <button onClick={addItem} className="admin-btn-primary text-sm flex items-center gap-1"><Save size={14} />افزودن</button>
        </div>
      )}

      {tab === 'menu' ? (
        <div className="admin-card space-y-1">
          {navItems.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              depth={0}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onAddChild={addChild}
            />
          ))}
          {navItems.length === 0 && <p className="text-center py-8 text-gray-500">آیتمی وجود ندارد</p>}
        </div>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right">
                <th className="pb-3">مسیر</th>
                <th className="pb-3">نوع صفحه</th>
                <th className="pb-3">عنوان سئو</th>
                <th className="pb-3">وضعیت</th>
                <th className="pb-3">ریدایرکت</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} className="border-b">
                  <td className="py-3 font-mono text-xs" dir="ltr">{route.path}</td>
                  <td className="py-3">{route.pageType}</td>
                  <td className="py-3">
                    <input
                      className="admin-input text-xs w-full"
                      defaultValue={route.seoConfig?.title || route.seoConfig?.titleTemplate || ''}
                      onBlur={(e) => updateRoute(route, {
                        seoConfig: { ...route.seoConfig, title: e.target.value },
                      })}
                    />
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => updateRoute(route, { isActive: !route.isActive })}
                      className={`text-xs px-2 py-1 rounded-full ${route.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}
                    >
                      {route.isActive ? 'فعال' : 'غیرفعال'}
                    </button>
                  </td>
                  <td className="py-3">
                    <input
                      className="admin-input text-xs w-32"
                      dir="ltr"
                      placeholder="—"
                      defaultValue={route.redirectTo || ''}
                      onBlur={(e) => updateRoute(route, { redirectTo: e.target.value || null })}
                    />
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
