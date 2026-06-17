import StaticPageLayout from '@/components/StaticPageLayout';

export default function TermsPage() {
  return (
    <StaticPageLayout title="شرایط و قوانین">
      <div className="space-y-6 text-[var(--color-text-muted)] font-nav leading-relaxed text-sm">
        <p>
          استفاده از وب‌سایت نکال به منزله پذیرش شرایط و قوانین زیر است. لطفاً پیش از خرید، این صفحه را مطالعه کنید.
        </p>
        <section>
          <h2 className="text-[var(--color-text)] font-semibold mb-2">خرید و پرداخت</h2>
          <p>تمامی قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده است. پرداخت از طریق درگاه‌های معتبر انجام می‌شود.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text)] font-semibold mb-2">ارسال</h2>
          <p>سفارش‌ها پس از تایید، در بازه زمانی اعلام‌شده ارسال می‌شوند. هزینه ارسال بر اساس مقصد محاسبه می‌گردد.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text)] font-semibold mb-2">مرجوعی</h2>
          <p>امکان مرجوعی کالا تا ۷ روز پس از دریافت، در صورت سالم بودن بسته‌بندی و برچسب محصول وجود دارد.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
