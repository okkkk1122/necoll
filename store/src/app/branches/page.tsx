import StaticPageLayout from '@/components/StaticPageLayout';

export default function BranchesPage() {
  return (
    <StaticPageLayout title="لیست شعب">
      <div className="space-y-8 text-center">
        <div>
          <h2 className="text-lg font-semibold mb-2 font-nav">شعبه ۱</h2>
          <p className="text-[var(--color-text-muted)] font-nav leading-relaxed">
            تهران – سعادت آباد، بالاتر از میدان بهرود
            <br />
            مجتمع تجاری دیدار، طبقه ۱، واحد ۲۰۱
          </p>
          <a href="tel:02126744817" className="block mt-2 font-price" dir="ltr">
            ۰۲۱-۲۶۷۴۴۸۱۷
          </a>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 font-nav">شعبه ۲</h2>
          <p className="text-[var(--color-text-muted)] font-nav leading-relaxed">
            تهران – اندرزگو، مرکز خرید سانا
            <br />
            طبقه G2، واحد ۲۱
          </p>
          <a href="tel:02121004728" className="block mt-2 font-price" dir="ltr">
            ۰۲۱-۲۱۰۰۴۷۲۸
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
}
