import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';
import ProductImage from '@/components/ProductImage';
import ReviewSection from '@/components/ReviewSection';

interface Product {
  id: string;
  slug: string;
  name: { fa: string };
  description?: { fa: string };
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  dynamicFields: Record<string, string>;
  badges?: Array<{ type: string; payload: Record<string, unknown> }>;
  reviews?: Array<{ rating: number; comment: string; user: { name: string } }>;
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null;

  try {
    product = await fetchAPI<Product>(`/products/${params.slug}`);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  return (
    <div className="page-container">
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:underline">خانه</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">فروشگاه</Link>
        <span className="mx-2">/</span>
        <span>{product.name.fa}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name.fa}
            fill
            priority
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-product">{product.name.fa}</h1>

          {product.badges?.map((badge, i) => (
            <span
              key={i}
              className="inline-block text-xs px-3 py-1 rounded-full text-white mr-2 mb-4"
              style={{ backgroundColor: (badge.payload.color as string) || '#10B981' }}
            >
              {badge.payload.text as string}
            </span>
          ))}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-extrabold font-price" style={{ color: 'var(--color-primary)' }}>
              {new Intl.NumberFormat('fa-IR').format(price)} تومان
            </span>
            {comparePrice && comparePrice > price && (
              <>
                <span className="text-gray-400 line-through">
                  {new Intl.NumberFormat('fa-IR').format(comparePrice)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">
                  {discount}٪ تخفیف
                </span>
              </>
            )}
          </div>

          {product.description?.fa && (
            <p className="text-gray-600 mb-6 leading-relaxed font-body">{product.description.fa}</p>
          )}

          {Object.keys(product.dynamicFields || {}).length > 0 && (
            <div className="border rounded-xl p-4 mb-6 space-y-2">
              <h3 className="font-semibold mb-2">مشخصات</h3>
              {Object.entries(product.dynamicFields).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          <ProductActions
            productId={product.id}
            slug={product.slug}
            name={product.name.fa}
            price={price}
            stock={product.stock}
          />
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
}
