import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

interface PageContent {
  title: { fa: string };
  content: { fa: string };
  sections?: Array<{ title: string; content: string }>;
}

async function getPage() {
  try {
    return await fetchAPI<PageContent>('/pages/about');
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const page = await getPage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">خانه</Link>
        <span className="mx-2">/</span>
        <span>درباره ما</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6">
        {page?.title?.fa || 'درباره نکال'}
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 font-editorial">
        <p>{page?.content?.fa || 'فروشگاه آنلاین نکال با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب تأسیس شده است.'}</p>

        {page?.sections?.map((section, i) => (
          <div key={i} className="card p-6 mt-6">
            <h2 className="text-xl font-bold mb-3">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}

        {!page?.sections && (
          <>
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-bold mb-3">ماموریت ما</h2>
              <p>ارائه تجربه خرید آنلاین ساده، امن و لذت‌بخش برای همه ایرانیان</p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-3">چرا نکال؟</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>ضمانت اصالت کالا</li>
                <li>ارسال سریع به سراسر کشور</li>
                <li>پشتیبانی ۲۴ ساعته</li>
                <li>امکان مرجوعی تا ۷ روز</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
