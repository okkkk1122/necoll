import StaticPageLayout from '@/components/StaticPageLayout';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <StaticPageLayout title="استخدام در نکال">
      <p className="text-center text-[var(--color-text-muted)] font-nav leading-relaxed mb-8">
        به تیم نکال بپیوندید. برای ارسال رزومه و اطلاعات تماس با بخش منابع انسانی در ارتباط باشید.
      </p>
      <div className="text-center">
        <Link href="/contact" className="btn-outline text-sm">
          تماس با ما
        </Link>
      </div>
    </StaticPageLayout>
  );
}
