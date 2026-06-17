import { Suspense } from 'react';
import { fetchAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductsHeader from '@/components/ProductsHeader';

interface Product {
  id: string;
  slug: string;
  name: { fa: string };
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  badges?: Array<{ type: string; payload: Record<string, unknown> }>;
}

function buildQueryString(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.featured) params.set('featured', searchParams.featured);
  if (searchParams.section) params.set('section', searchParams.section);
  if (searchParams.item) params.set('item', searchParams.item);
  if (searchParams.sale) params.set('sale', searchParams.sale);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('limit', '12');
  return params.toString();
}

function buildPageHref(page: number, searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.featured) params.set('featured', searchParams.featured);
  if (searchParams.section) params.set('section', searchParams.section);
  if (searchParams.item) params.set('item', searchParams.item);
  if (searchParams.sale) params.set('sale', searchParams.sale);
  return `/products?${params.toString()}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
    featured?: string;
    section?: string;
    item?: string;
    sale?: string;
  };
}) {
  let products: Product[] = [];
  let pagination = { page: 1, total: 0, pages: 1 };

  try {
    const productData = await fetchAPI<{ products: Product[]; pagination: typeof pagination }>(
      `/products?${buildQueryString(searchParams)}`
    );
    products = productData.products;
    pagination = productData.pagination;
  } catch {
    // empty
  }

  return (
    <div className="page-container">
      <Suspense fallback={<div className="h-16 mb-12 animate-pulse bg-gray-100" />}>
        <ProductsHeader />
      </Suspense>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-6xl mb-4">📦</p>
          <p>محصولی یافت نشد</p>
        </div>
      ) : (
        <>
          <div className="monaie-shop-products__grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={buildPageHref(page, searchParams)}
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.page ? 'text-white' : 'bg-white border hover:bg-gray-50'
                  }`}
                  style={
                    page === pagination.page
                      ? { backgroundColor: 'var(--color-primary)' }
                      : undefined
                  }
                >
                  {page}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
