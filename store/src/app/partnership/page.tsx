import StaticPageLayout from '@/components/StaticPageLayout';
import Link from 'next/link';

export default function PartnershipPage() {
  return (
    <StaticPageLayout title="همکاری با ما">
      <p className="text-center text-[var(--color-text-muted)] font-nav leading-relaxed mb-8">
        برای همکاری تجاری، نمایندگی و تامین محصول با تیم نکال در تماس باشید.
      </p>
      <div className="text-center">
        <Link href="/contact" className="btn-outline text-sm">
          ارسال درخواست همکاری
        </Link>
      </div>
    </StaticPageLayout>
  );
}
