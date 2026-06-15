import { Suspense } from 'react';
import { fetchAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
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

interface Category {
  id: string;
  slug: string;
  name: { fa: string };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string; featured?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.featured) params.set('featured', searchParams.featured);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('limit', '12');

  let products: Product[] = [];
  let categories: Category[] = [];
  let pagination = { page: 1, total: 0, pages: 1 };

  try {
    const [productData, cats] = await Promise.all([
      fetchAPI<{ products: Product[]; pagination: typeof pagination }>(`/products?${params.toString()}`),
      fetchAPI<Category[]>('/categories'),
    ]);
    products = productData.products;
    pagination = productData.pagination;
    categories = cats;
  } catch {
    // empty
  }

  return (
    <div className="page-container">
      <ProductsHeader />

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8">
        <Suspense fallback={<div className="animate-pulse h-16 lg:h-64 bg-gray-100 rounded-xl" />}>
          <ProductFilter categories={categories} />
        </Suspense>

        <div className="lg:col-span-3 min-w-0">
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-6xl mb-4">📦</p>
              <p>محصولی یافت نشد</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <a
                      key={page}
                      href={`/products?page=${page}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.featured ? '&featured=true' : ''}`}
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
      </div>
    </div>
  );
}
