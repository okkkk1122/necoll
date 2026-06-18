'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaUploader from '@/components/MediaUploader';
import ThemeSection from '@/components/content/ThemeSection';
import LayoutSection from '@/components/content/LayoutSection';
import { api } from '@/lib/api';
import { Save, Plus, Trash2, Image, Film } from 'lucide-react';

type Tab = 'identity' | 'announcement' | 'hero' | 'home' | 'sections' | 'banner' | 'contact' | 'lookbook' | 'newsletter' | 'footer' | 'footerSettings' | 'pages' | 'mobile' | 'commerce' | 'theme' | 'layout';

type StaticPage = {
  title?: { fa: string };
  content?: { fa: string };
  sections?: Array<{ title: string; content: string }>;
};

const STATIC_PAGE_SLUGS = ['about', 'contact', 'terms', 'club', 'branches', 'careers', 'partnership'] as const;

const PAGE_LABELS: Record<string, string> = {
  about: 'درباره ما',
  contact: 'تماس با ما',
  terms: 'شرایط و قوانین',
  club: 'نکال کلاب',
  branches: 'لیست شعب',
  careers: 'استخدام',
  partnership: 'همکاری با ما',
};

function mergeStaticPages(pages: Record<string, StaticPage>) {
  const merged = { ...pages };
  for (const slug of STATIC_PAGE_SLUGS) {
    if (!merged[slug]) {
      merged[slug] = { title: { fa: PAGE_LABELS[slug] || slug }, content: { fa: '' }, sections: [] };
    } else if (!merged[slug].sections) {
      merged[slug].sections = [];
    }
  }
  return merged;
}

async function loadSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await api<{ value: T }>(`/config/setting/${key}`);
    return data.value ?? fallback;
  } catch {
    return fallback;
  }
}

async function saveSetting(key: string, value: unknown) {
  await api(`/config/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
}

export default function ContentManagerPage() {
  return (
    <Suspense>
      <ContentManagerInner />
    </Suspense>
  );
}

function ContentManagerInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('identity');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [siteName, setSiteName] = useState({ fa: '', en: '' });
  const [siteDesc, setSiteDesc] = useState({ fa: '', en: '' });
  const [siteLogo, setSiteLogo] = useState('');
  const [announcement, setAnnouncement] = useState({ enabled: true, text: { fa: '', en: '' }, link: '' });
  const [hero, setHero] = useState({ enabled: true, slides: [] as Array<Record<string, string>>, autoplay: true, interval: 5000 });
  const [sections, setSections] = useState<Record<string, Record<string, { fa: string }>>>({});
  const [banner, setBanner] = useState<Record<string, unknown>>({});
  const [contact, setContact] = useState<Record<string, unknown>>({});
  const [lookbook, setLookbook] = useState<Record<string, unknown>>({});
  const [newsletter, setNewsletter] = useState<Record<string, unknown>>({});
  const [footerServices, setFooterServices] = useState<Array<{ fa: string; en: string }>>([]);
  const [homeCategories, setHomeCategories] = useState<Array<{ fa: string; en: string; image: string; link: string }>>([]);
  const [footerConfig, setFooterConfig] = useState<Record<string, unknown>>({});
  const [staticPages, setStaticPages] = useState<Record<string, StaticPage>>({});
  const [mobileNav, setMobileNav] = useState({ enabled: false, useNavigation: true, maxItems: 4 });
  const [shipping, setShipping] = useState({ baseCost: 50000, freeThreshold: 1000000, estimatedDays: '2-5' });
  const [minOrder, setMinOrder] = useState(100000);
  const [currency, setCurrency] = useState({ code: 'IRR', symbol: 'تومان', position: 'after' });
  const [footerLinks, setFooterLinks] = useState<Array<{ label: string; url: string }>>([]);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t) setTab(t);
  }, [searchParams]);

  useEffect(() => {
    Promise.all([
      loadSetting('site_name', { fa: 'نکال', en: 'Necoll' }),
      loadSetting('site_description', { fa: '', en: '' }),
      loadSetting('site_logo', '/logo.png'),
      loadSetting('announcement_bar', { enabled: true, text: { fa: '', en: '' }, link: '' }),
      loadSetting('hero_slider', { enabled: true, slides: [], autoplay: true, interval: 5000 }),
      loadSetting('section_labels', {}),
      loadSetting('banner_config', {}),
      loadSetting('contact_info', {}),
      loadSetting('lookbook_config', { enabled: true, items: [] }),
      loadSetting('newsletter_config', {}),
      loadSetting('footer_services', []),
      loadSetting('home_categories', []),
      loadSetting('footer_config', {}),
      loadSetting('static_pages', {}),
      loadSetting('mobile_nav_config', { enabled: false, useNavigation: true, maxItems: 4 }),
      loadSetting('shipping_config', { baseCost: 50000, freeThreshold: 1000000, estimatedDays: '2-5' }),
      loadSetting('min_order_amount', 100000),
      loadSetting('currency', { code: 'IRR', symbol: 'تومان', position: 'after' }),
    ]).then(([sn, sd, sl, ab, hs, sec, bn, ct, lb, nl, fs, hc, fc, sp, mn, sh, mo, cur]) => {
      setSiteName(sn); setSiteDesc(sd); setSiteLogo(sl);
      setAnnouncement(ab); setHero(hs); setSections(sec);
      setBanner(bn); setContact(ct); setLookbook(lb);
      setNewsletter(nl); setFooterServices(fs);
      setHomeCategories(hc as typeof homeCategories);
      setFooterConfig(fc as Record<string, unknown>);
      setStaticPages(mergeStaticPages(sp as Record<string, StaticPage>));
      setMobileNav(mn as typeof mobileNav);
      setShipping(sh as typeof shipping);
      setMinOrder(mo as number);
      setCurrency(cur as typeof currency);
      const links = (fc as { links?: Array<{ label: string; url: string }> }).links || [];
      setFooterLinks(links);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const saves: Record<Tab, () => Promise<void>> = {
        identity: async () => {
          await saveSetting('site_name', siteName);
          await saveSetting('site_description', siteDesc);
          await saveSetting('site_logo', siteLogo);
        },
        announcement: async () => saveSetting('announcement_bar', announcement),
        hero: async () => saveSetting('hero_slider', hero),
        sections: async () => saveSetting('section_labels', sections),
        banner: async () => saveSetting('banner_config', banner),
        contact: async () => saveSetting('contact_info', contact),
        lookbook: async () => saveSetting('lookbook_config', lookbook),
        newsletter: async () => saveSetting('newsletter_config', newsletter),
        footer: async () => saveSetting('footer_services', footerServices),
        home: async () => saveSetting('home_categories', homeCategories),
        footerSettings: async () => saveSetting('footer_config', { ...footerConfig, links: footerLinks }),
        pages: async () => saveSetting('static_pages', staticPages),
        mobile: async () => saveSetting('mobile_nav_config', mobileNav),
        commerce: async () => {
          await saveSetting('shipping_config', shipping);
          await saveSetting('min_order_amount', minOrder);
          await saveSetting('currency', currency);
        },
        theme: async () => {},
        layout: async () => {},
      };
      await saves[tab]();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'identity', label: 'هویت سایت' },
    { id: 'announcement', label: 'نوار اعلان' },
    { id: 'hero', label: 'اسلایدر / ویدیو' },
    { id: 'home', label: 'دسته‌های صفحه اصلی' },
    { id: 'sections', label: 'عناوین بخش‌ها' },
    { id: 'banner', label: 'بنر' },
    { id: 'lookbook', label: 'لوک‌بوک' },
    { id: 'contact', label: 'تماس' },
    { id: 'newsletter', label: 'خبرنامه' },
    { id: 'footer', label: 'خدمات فوتر' },
    { id: 'footerSettings', label: 'تنظیمات فوتر' },
    { id: 'pages', label: 'صفحات ثابت' },
    { id: 'mobile', label: 'ناوبری موبایل' },
    { id: 'commerce', label: 'ارسال و پرداخت' },
    { id: 'theme', label: 'تم و رنگ‌ها' },
    { id: 'layout', label: 'چیدمان صفحه اصلی' },
  ];

  const sectionKeys = ['featured_products', 'categories', 'new_arrivals', 'blog_posts', 'lookbook', 'products_page', 'blog_page'];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">مدیریت محتوای سایت</h1>
          <p className="text-gray-500 text-sm mt-1">تمام جزئیات قابل مشاهده در فروشگاه از اینجا مدیریت می‌شود</p>
        </div>
        <button onClick={handleSave} disabled={saving || tab === 'theme' || tab === 'layout'} className="admin-btn-primary flex items-center gap-2">
          <Save size={16} /> {saving ? 'ذخیره...' : saved ? 'ذخیره شد ✓' : 'ذخیره'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === t.id ? 'bg-admin-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-card space-y-6">
        {tab === 'identity' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">نام فارسی</label><input className="admin-input w-full mt-1" value={siteName.fa} onChange={(e) => setSiteName({ ...siteName, fa: e.target.value })} /></div>
              <div><label className="text-sm font-medium">نام انگلیسی</label><input className="admin-input w-full mt-1" value={siteName.en} onChange={(e) => setSiteName({ ...siteName, en: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">توضیحات فارسی</label><textarea className="admin-input w-full mt-1" rows={3} value={siteDesc.fa} onChange={(e) => setSiteDesc({ ...siteDesc, fa: e.target.value })} /></div>
            <div><label className="text-sm font-medium mb-2 block">لوگو</label><MediaUploader folder="branding" currentUrl={siteLogo} onUploaded={setSiteLogo} /></div>
          </>
        )}

        {tab === 'announcement' && (
          <>
            <label className="flex items-center gap-2"><input type="checkbox" checked={announcement.enabled} onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })} />فعال</label>
            <div><label className="text-sm font-medium">متن نوار اعلان</label><input className="admin-input w-full mt-1" value={announcement.text.fa} onChange={(e) => setAnnouncement({ ...announcement, text: { ...announcement.text, fa: e.target.value } })} /></div>
            <div><label className="text-sm font-medium">لینک (اختیاری)</label><input className="admin-input w-full mt-1" dir="ltr" value={announcement.link || ''} onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })} /></div>
          </>
        )}

        {tab === 'hero' && (
          <>
            <label className="flex items-center gap-2"><input type="checkbox" checked={hero.enabled} onChange={(e) => setHero({ ...hero, enabled: e.target.checked })} />فعال</label>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={hero.autoplay} onChange={(e) => setHero({ ...hero, autoplay: e.target.checked })} />پخش خودکار</label>
              <div><label className="text-xs">فاصله (ms)</label><input type="number" className="admin-input w-full" value={hero.interval} onChange={(e) => setHero({ ...hero, interval: Number(e.target.value) })} /></div>
            </div>
            {(hero.slides as Array<Record<string, string>>).map((slide, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="font-medium">اسلاید {i + 1}</span>
                  <button onClick={() => setHero({ ...hero, slides: hero.slides.filter((_, j) => j !== i) })} className="text-red-500"><Trash2 size={16} /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-xs">نوع رسانه</label>
                    <select className="admin-input w-full" value={slide.mediaType || 'image'} onChange={(e) => { const s = [...hero.slides]; s[i] = { ...s[i], mediaType: e.target.value }; setHero({ ...hero, slides: s }); }}>
                      <option value="image">تصویر</option><option value="video">ویدیو</option>
                    </select>
                  </div>
                  <div><label className="text-xs">عنوان</label><input className="admin-input w-full" value={slide.title || ''} onChange={(e) => { const s = [...hero.slides]; s[i] = { ...s[i], title: e.target.value }; setHero({ ...hero, slides: s }); }} /></div>
                  <div><label className="text-xs">زیرعنوان</label><input className="admin-input w-full" value={slide.subtitle || ''} onChange={(e) => { const s = [...hero.slides]; s[i] = { ...s[i], subtitle: e.target.value }; setHero({ ...hero, slides: s }); }} /></div>
                  <div><label className="text-xs">لینک</label><input className="admin-input w-full" dir="ltr" value={slide.link || ''} onChange={(e) => { const s = [...hero.slides]; s[i] = { ...s[i], link: e.target.value }; setHero({ ...hero, slides: s }); }} /></div>
                  <div><label className="text-xs">متن دکمه</label><input className="admin-input w-full" value={slide.buttonText || ''} onChange={(e) => { const s = [...hero.slides]; s[i] = { ...s[i], buttonText: e.target.value }; setHero({ ...hero, slides: s }); }} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-xs flex items-center gap-1"><Image size={12} />تصویر</label>
                    <MediaUploader folder="hero" currentUrl={slide.image} onUploaded={(url) => { const s = [...hero.slides]; s[i] = { ...s[i], image: url }; setHero({ ...hero, slides: s }); }} />
                  </div>
                  <div><label className="text-xs flex items-center gap-1"><Film size={12} />ویدیو</label>
                    <MediaUploader folder="hero" accept="video" currentUrl={slide.video} onUploaded={(url) => { const s = [...hero.slides]; s[i] = { ...s[i], video: url, mediaType: 'video' }; setHero({ ...hero, slides: s }); }} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setHero({ ...hero, slides: [...hero.slides, { mediaType: 'image', image: '', video: '', title: '', subtitle: '', link: '/products', buttonText: 'مشاهده' }] })} className="admin-btn-outline flex items-center gap-1"><Plus size={14} />اسلاید جدید</button>
          </>
        )}

        {tab === 'sections' && sectionKeys.map((key) => (
          <div key={key} className="border-b pb-4">
            <h3 className="font-medium mb-3">{key}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {['label', 'title', 'subtitle', 'linkText'].map((field) => (
                <div key={field}>
                  <label className="text-xs">{field}</label>
                  <input className="admin-input w-full" value={sections[key]?.[field]?.fa || ''} onChange={(e) => setSections({ ...sections, [key]: { ...sections[key], [field]: { fa: e.target.value } } })} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {tab === 'banner' && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={(banner as { enabled?: boolean }).enabled !== false} onChange={(e) => setBanner({ ...banner, enabled: e.target.checked })} />فعال</label>
            {['label', 'title', 'subtitle', 'buttonText'].map((f) => (
              <div key={f}><label className="text-xs">{f}</label><input className="admin-input w-full" value={(banner as Record<string, { fa: string }>)[f]?.fa || ''} onChange={(e) => setBanner({ ...banner, [f]: { fa: e.target.value } })} /></div>
            ))}
            <div><label className="text-xs">لینک دکمه</label><input className="admin-input w-full" dir="ltr" value={(banner as { buttonLink?: string }).buttonLink || ''} onChange={(e) => setBanner({ ...banner, buttonLink: e.target.value })} /></div>
          </div>
        )}

        {tab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs">ایمیل</label><input className="admin-input w-full" dir="ltr" value={(contact as { email?: string }).email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
            <div><label className="text-xs">تلفن (لینک)</label><input className="admin-input w-full" dir="ltr" value={(contact as { phone?: string }).phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
            <div><label className="text-xs">نمایش تلفن</label><input className="admin-input w-full" value={(contact as { phoneDisplay?: string }).phoneDisplay || ''} onChange={(e) => setContact({ ...contact, phoneDisplay: e.target.value })} /></div>
            <div><label className="text-xs">آدرس</label><input className="admin-input w-full" value={(contact as { address?: { fa: string } }).address?.fa || ''} onChange={(e) => setContact({ ...contact, address: { fa: e.target.value } })} /></div>
          </div>
        )}

        {tab === 'lookbook' && (
          <>
            <label className="flex items-center gap-2"><input type="checkbox" checked={(lookbook as { enabled?: boolean }).enabled !== false} onChange={(e) => setLookbook({ ...lookbook, enabled: e.target.checked })} />فعال</label>
            <div className="grid md:grid-cols-2 gap-3">
              <div><label className="text-xs">عنوان صفحه</label><input className="admin-input w-full" value={(lookbook as { pageTitle?: { fa: string } }).pageTitle?.fa || ''} onChange={(e) => setLookbook({ ...lookbook, pageTitle: { fa: e.target.value } })} /></div>
              <div><label className="text-xs">زیرعنوان</label><input className="admin-input w-full" value={(lookbook as { pageSubtitle?: { fa: string } }).pageSubtitle?.fa || ''} onChange={(e) => setLookbook({ ...lookbook, pageSubtitle: { fa: e.target.value } })} /></div>
            </div>
            {((lookbook as { items?: Array<Record<string, unknown>> }).items || []).map((item, i) => (
              <div key={String(item.id || i)} className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span>آیتم {i + 1}</span>
                  <button onClick={() => { const items = [...((lookbook as { items: unknown[] }).items)]; items.splice(i, 1); setLookbook({ ...lookbook, items }); }} className="text-red-500"><Trash2 size={16} /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-xs">عنوان</label><input className="admin-input w-full" value={(item.title as { fa: string })?.fa || ''} onChange={(e) => { const items = [...((lookbook as { items: Record<string, unknown>[] }).items)]; items[i] = { ...items[i], title: { fa: e.target.value } }; setLookbook({ ...lookbook, items }); }} /></div>
                  <div><label className="text-xs">لینک</label><input className="admin-input w-full" dir="ltr" value={(item.link as string) || ''} onChange={(e) => { const items = [...((lookbook as { items: Record<string, unknown>[] }).items)]; items[i] = { ...items[i], link: e.target.value }; setLookbook({ ...lookbook, items }); }} /></div>
                </div>
                <MediaUploader folder="lookbook" currentUrl={item.image as string} onUploaded={(url) => { const items = [...((lookbook as { items: Record<string, unknown>[] }).items)]; items[i] = { ...items[i], image: url, mediaType: 'image' }; setLookbook({ ...lookbook, items }); }} />
              </div>
            ))}
            <button onClick={() => setLookbook({ ...lookbook, items: [...((lookbook as { items?: unknown[] }).items || []), { id: String(Date.now()), title: { fa: '' }, image: '', link: '/products', mediaType: 'image' }] })} className="admin-btn-outline flex items-center gap-1"><Plus size={14} />آیتم جدید</button>
          </>
        )}

        {tab === 'newsletter' && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={(newsletter as { enabled?: boolean }).enabled !== false} onChange={(e) => setNewsletter({ ...newsletter, enabled: e.target.checked })} />فعال</label>
            {['label', 'title', 'subtitle', 'buttonText'].map((f) => (
              <div key={f}><label className="text-xs">{f}</label><input className="admin-input w-full" value={(newsletter as Record<string, { fa: string }>)[f]?.fa || ''} onChange={(e) => setNewsletter({ ...newsletter, [f]: { fa: e.target.value } })} /></div>
            ))}
            <div><label className="text-xs">placeholder</label><input className="admin-input w-full" value={(newsletter as { placeholder?: string }).placeholder || ''} onChange={(e) => setNewsletter({ ...newsletter, placeholder: e.target.value })} /></div>
          </div>
        )}

        {tab === 'home' && homeCategories.map((cat, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3">
            <div className="flex justify-between"><span className="font-medium">دسته {i + 1}</span>
              <button onClick={() => setHomeCategories(homeCategories.filter((_, j) => j !== i))} className="text-red-500"><Trash2 size={16} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input className="admin-input" placeholder="نام فارسی" value={cat.fa} onChange={(e) => { const c = [...homeCategories]; c[i] = { ...c[i], fa: e.target.value }; setHomeCategories(c); }} />
              <input className="admin-input" placeholder="نام انگلیسی" value={cat.en} onChange={(e) => { const c = [...homeCategories]; c[i] = { ...c[i], en: e.target.value }; setHomeCategories(c); }} />
              <input className="admin-input md:col-span-2" placeholder="لینک" dir="ltr" value={cat.link} onChange={(e) => { const c = [...homeCategories]; c[i] = { ...c[i], link: e.target.value }; setHomeCategories(c); }} />
            </div>
            <MediaUploader folder="home" currentUrl={cat.image} onUploaded={(url) => { const c = [...homeCategories]; c[i] = { ...c[i], image: url }; setHomeCategories(c); }} />
          </div>
        ))}
        {tab === 'home' && (
          <button onClick={() => setHomeCategories([...homeCategories, { fa: '', en: '', image: '', link: '/products' }])} className="admin-btn-outline flex items-center gap-1"><Plus size={14} />دسته جدید</button>
        )}

        {tab === 'footerSettings' && (
          <div className="space-y-4">
            <div><label className="text-xs">کپی‌رایت</label><input className="admin-input w-full" value={(footerConfig as { copyright?: string }).copyright || ''} onChange={(e) => setFooterConfig({ ...footerConfig, copyright: e.target.value })} /></div>
            <div><label className="text-xs">تصویر نماد اعتماد</label><MediaUploader folder="branding" currentUrl={(footerConfig as { trustBadgeImage?: string }).trustBadgeImage} onUploaded={(url) => setFooterConfig({ ...footerConfig, trustBadgeImage: url })} /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={(footerConfig as { showSocial?: boolean }).showSocial !== false} onChange={(e) => setFooterConfig({ ...footerConfig, showSocial: e.target.checked })} />نمایش شبکه‌های اجتماعی</label>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">لینک‌های فوتر</h3>
              {footerLinks.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className="admin-input flex-1" placeholder="عنوان" value={link.label} onChange={(e) => { const l = [...footerLinks]; l[i] = { ...l[i], label: e.target.value }; setFooterLinks(l); }} />
                  <input className="admin-input flex-1" dir="ltr" placeholder="/url" value={link.url} onChange={(e) => { const l = [...footerLinks]; l[i] = { ...l[i], url: e.target.value }; setFooterLinks(l); }} />
                  <button onClick={() => setFooterLinks(footerLinks.filter((_, j) => j !== i))} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setFooterLinks([...footerLinks, { label: '', url: '' }])} className="admin-btn-outline text-sm flex items-center gap-1"><Plus size={14} />لینک جدید</button>
            </div>
          </div>
        )}

        {tab === 'pages' && STATIC_PAGE_SLUGS.map((slug) => {
          const page = staticPages[slug] || { title: { fa: '' }, content: { fa: '' }, sections: [] };
          return (
            <div key={slug} className="border rounded-xl p-4 space-y-3">
              <h3 className="font-medium">{PAGE_LABELS[slug] || slug} <span className="text-xs text-gray-400 font-mono">/{slug}</span></h3>
              <input className="admin-input w-full" placeholder="عنوان" value={page.title?.fa || ''} onChange={(e) => setStaticPages({ ...staticPages, [slug]: { ...page, title: { fa: e.target.value } } })} />
              <textarea className="admin-input w-full" rows={4} placeholder="محتوا" value={page.content?.fa || ''} onChange={(e) => setStaticPages({ ...staticPages, [slug]: { ...page, content: { fa: e.target.value } } })} />
              {(page.sections || []).map((section, si) => (
                <div key={si} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">بخش {si + 1}</span>
                    <button onClick={() => { const sections = [...(page.sections || [])]; sections.splice(si, 1); setStaticPages({ ...staticPages, [slug]: { ...page, sections } }); }} className="text-red-500"><Trash2 size={14} /></button>
                  </div>
                  <input className="admin-input w-full text-sm" placeholder="عنوان بخش" value={section.title} onChange={(e) => { const sections = [...(page.sections || [])]; sections[si] = { ...sections[si], title: e.target.value }; setStaticPages({ ...staticPages, [slug]: { ...page, sections } }); }} />
                  <textarea className="admin-input w-full text-sm" rows={2} placeholder="محتوای بخش" value={section.content} onChange={(e) => { const sections = [...(page.sections || [])]; sections[si] = { ...sections[si], content: e.target.value }; setStaticPages({ ...staticPages, [slug]: { ...page, sections } }); }} />
                </div>
              ))}
              <button onClick={() => setStaticPages({ ...staticPages, [slug]: { ...page, sections: [...(page.sections || []), { title: '', content: '' }] } })} className="admin-btn-outline text-sm flex items-center gap-1"><Plus size={14} />بخش جدید</button>
            </div>
          );
        })}

        {tab === 'mobile' && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={mobileNav.enabled} onChange={(e) => setMobileNav({ ...mobileNav, enabled: e.target.checked })} />نوار پایین موبایل فعال</label>
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={mobileNav.useNavigation} onChange={(e) => setMobileNav({ ...mobileNav, useNavigation: e.target.checked })} />استفاده از منوی ناوبری</label>
            <div><label className="text-xs">حداکثر آیتم</label><input type="number" className="admin-input w-full" value={mobileNav.maxItems} onChange={(e) => setMobileNav({ ...mobileNav, maxItems: Number(e.target.value) })} /></div>
          </div>
        )}

        {tab === 'commerce' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">واحد پول</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div><label className="text-xs">کد</label><input className="admin-input w-full" dir="ltr" value={currency.code} onChange={(e) => setCurrency({ ...currency, code: e.target.value })} /></div>
                <div><label className="text-xs">نماد</label><input className="admin-input w-full" value={currency.symbol} onChange={(e) => setCurrency({ ...currency, symbol: e.target.value })} /></div>
                <div><label className="text-xs">موقعیت (before/after)</label><input className="admin-input w-full" dir="ltr" value={currency.position} onChange={(e) => setCurrency({ ...currency, position: e.target.value })} /></div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">تنظیمات ارسال</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div><label className="text-xs">هزینه پایه (تومان)</label><input type="number" className="admin-input w-full" value={shipping.baseCost} onChange={(e) => setShipping({ ...shipping, baseCost: Number(e.target.value) })} /></div>
                <div><label className="text-xs">آستانه ارسال رایگان</label><input type="number" className="admin-input w-full" value={shipping.freeThreshold} onChange={(e) => setShipping({ ...shipping, freeThreshold: Number(e.target.value) })} /></div>
                <div><label className="text-xs">زمان تحویل</label><input className="admin-input w-full" value={shipping.estimatedDays} onChange={(e) => setShipping({ ...shipping, estimatedDays: e.target.value })} /></div>
              </div>
            </div>
            <div>
              <label className="text-xs">حداقل مبلغ سفارش (تومان)</label>
              <input type="number" className="admin-input w-full max-w-xs mt-1" value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} />
            </div>
          </div>
        )}

        {tab === 'theme' && <ThemeSection />}
        {tab === 'layout' && <LayoutSection />}

        {tab === 'footer' && footerServices.map((item, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input className="admin-input flex-1" value={item.fa} onChange={(e) => { const s = [...footerServices]; s[i] = { ...s[i], fa: e.target.value }; setFooterServices(s); }} />
            <button onClick={() => setFooterServices(footerServices.filter((_, j) => j !== i))} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        {tab === 'footer' && (
          <button onClick={() => setFooterServices([...footerServices, { fa: '', en: '' }])} className="admin-btn-outline flex items-center gap-1"><Plus size={14} />خدمت جدید</button>
        )}
      </div>
    </AdminLayout>
  );
}
