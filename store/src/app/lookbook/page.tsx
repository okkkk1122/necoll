import { fetchAPI } from '@/lib/api';
import LookbookGrid from '@/components/LookbookGrid';

export default async function LookbookPage() {
  let config: Record<string, unknown> = {};
  try {
    config = await fetchAPI('/config/public');
  } catch { /* empty */ }

  const lookbook = config.lookbook_config as {
    pageTitle?: { fa: string };
    pageSubtitle?: { fa: string };
  } | undefined;

  return (
    <div>
      <div className="text-center py-12 md:py-16 px-4">
        <p className="fashion-label mb-3">Lookbook</p>
        <h1 className="fashion-title">{lookbook?.pageTitle?.fa || 'لوک‌بوک'}</h1>
        {lookbook?.pageSubtitle?.fa && (
          <p className="text-[var(--color-text-muted)] text-sm mt-2">{lookbook.pageSubtitle.fa}</p>
        )}
      </div>
      <LookbookGrid showHeader={false} />
    </div>
  );
}
