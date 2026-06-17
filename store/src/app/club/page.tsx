import StaticPageLayout from '@/components/StaticPageLayout';
import Link from 'next/link';

export default function ClubPage() {
  return (
    <StaticPageLayout title="نکال کلاب">
      <p className="text-center text-[var(--color-text-muted)] font-nav leading-relaxed mb-8">
        با عضویت در نکال کلاب از پیشنهادهای ویژه، دسترسی زودهنگام به کالکشن‌های جدید و مزایای اختصاصی بهره‌مند شوید.
      </p>
      <div className="text-center">
        <Link href="/account" className="btn-primary text-sm">
          ورود / عضویت
        </Link>
      </div>
    </StaticPageLayout>
  );
}
