import Link from 'next/link';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  return (
    <div className="page-container py-12 md:py-16 max-w-3xl">
      <nav className="text-sm text-[var(--color-text-muted)] mb-8 font-nav">
        <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{title}</span>
      </nav>
      <h1 className="section-title text-center mb-10">{title}</h1>
      <div className="prose-monaie">{children}</div>
    </div>
  );
}
