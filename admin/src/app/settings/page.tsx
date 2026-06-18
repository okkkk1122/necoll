'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { routes } from '@/lib/paths';
import SettingEditor from '@/components/SettingEditor';
import FilteredSettings from '@/components/settings/FilteredSettings';
import SandboxSection from '@/components/settings/SandboxSection';
import ModulesSection from '@/components/settings/ModulesSection';
import RulesSection from '@/components/settings/RulesSection';
import { api } from '@/lib/api';
import { FlaskConical } from 'lucide-react';

type Tab = 'config' | 'seo' | 'notifications' | 'integrations' | 'sandbox' | 'modules' | 'rules';

const integrationKeys = [
  'social_links', 'social_enabled', 'payment_gateways', 'zarinpal_merchant', 'zarinpal_sandbox',
  'ai_chat_enabled', 'ai_chat_prompt', 'ai_chat_welcome', 'openai_api_key',
];

const tabs: { id: Tab; label: string }[] = [
  { id: 'config', label: 'HyperConfig' },
  { id: 'seo', label: 'سئو' },
  { id: 'notifications', label: 'اعلان‌ها' },
  { id: 'integrations', label: 'یکپارچگی و AI' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'modules', label: 'ماژول‌ها' },
  { id: 'rules', label: 'قوانین کسب‌وکار' },
];

interface Setting {
  id: string;
  key: string;
  value: unknown;
  defaultValue: unknown;
  category: string;
  layer: string;
  label: string | null;
  description: string | null;
  isActive: boolean;
  editableByAdmin: boolean;
}

function SettingsInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('config');
  const sandboxId = searchParams.get('sandbox') || undefined;
  const [settings, setSettings] = useState<Setting[]>([]);
  const [filter, setFilter] = useState({ category: '', layer: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t && tabs.some((x) => x.id === t)) setTab(t);
  }, [searchParams]);

  const loadConfig = () => {
    if (tab !== 'config') return;
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.layer) params.set('layer', filter.layer);
    if (sandboxId) params.set('sandbox', sandboxId);
    api<Setting[]>(`/config/settings?${params}`).then(setSettings).finally(() => setLoading(false));
  };

  useEffect(() => { loadConfig(); }, [tab, filter, sandboxId]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-admin-primary">تنظیمات سیستم</h1>
        <p className="text-gray-500 text-sm mt-1">سئو، اعلان‌ها، یکپارچگی‌ها، ماژول‌ها و قوانین</p>
        {sandboxId && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <FlaskConical size={16} className="text-blue-500" />
            <span>ویرایش در Sandbox</span>
            <Link href={`${routes.settings}?tab=config`} className="text-blue-600 underline mr-auto">خروج</Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm ${tab === t.id ? 'bg-admin-primary text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'config' && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <select value={filter.layer} onChange={(e) => setFilter({ ...filter, layer: e.target.value })} className="admin-input w-auto">
              <option value="">همه لایه‌ها</option>
              <option value="SYSTEM">سیستمی</option>
              <option value="MODULE">ماژول</option>
              <option value="COMPONENT">کامپوننت</option>
            </select>
            <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="admin-input w-auto">
              <option value="">همه دسته‌ها</option>
              {['GENERAL', 'APPEARANCE', 'PRODUCT', 'NAVIGATION', 'PAYMENT', 'SOCIAL', 'SEO', 'NOTIFICATION', 'INTEGRATION', 'LAYOUT', 'MODULE', 'SUPPORT'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {loading ? <div className="text-center py-8 text-gray-500">بارگذاری...</div> : (
            <div className="space-y-4">{settings.map((s) => <SettingEditor key={s.id} setting={s} onUpdate={loadConfig} sandboxId={sandboxId} />)}</div>
          )}
        </>
      )}
      {tab === 'seo' && <FilteredSettings categories={['SEO']} sandboxId={sandboxId} />}
      {tab === 'notifications' && <FilteredSettings categories={['NOTIFICATION']} sandboxId={sandboxId} />}
      {tab === 'integrations' && <FilteredSettings categories={['INTEGRATION', 'SOCIAL', 'PAYMENT', 'SUPPORT']} keys={integrationKeys} sandboxId={sandboxId} />}
      {tab === 'sandbox' && <SandboxSection />}
      {tab === 'modules' && <ModulesSection />}
      {tab === 'rules' && <RulesSection />}
    </AdminLayout>
  );
}

export default function SettingsPage() {
  return <Suspense><SettingsInner /></Suspense>;
}
