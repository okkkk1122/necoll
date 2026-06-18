import { fetchAPI } from '@/lib/api';
import StaticPageLayout from '@/components/StaticPageLayout';

interface PageContent {
  title?: { fa: string };
  content?: { fa: string };
  sections?: Array<{ title: string; content: string }>;
}

const fallbackTitles: Record<string, string> = {
  terms: 'شرایط و قوانین',
  club: 'نکال کلاب',
  branches: 'لیست شعب',
  careers: 'استخدام',
  partnership: 'همکاری با ما',
};

export default async function ConfigurableStaticPage({ slug }: { slug: string }) {
  let page: PageContent | null = null;
  try {
    page = await fetchAPI<PageContent>(`/pages/${slug}`);
  } catch {
    page = null;
  }

  const title = page?.title?.fa || fallbackTitles[slug] || slug;

  return (
    <StaticPageLayout title={title}>
      <div className="space-y-6 text-[var(--color-text-muted)] font-nav leading-relaxed text-sm">
        {page?.content?.fa && <p>{page.content.fa}</p>}
        {page?.sections?.map((section, i) => (
          <section key={i}>
            <h2 className="text-[var(--color-text)] font-semibold mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}
        {!page?.content?.fa && !page?.sections?.length && (
          <p>محتوای این صفحه از پنل مدیریت قابل ویرایش است.</p>
        )}
      </div>
    </StaticPageLayout>
  );
}
