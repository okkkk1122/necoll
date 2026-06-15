import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';

interface BlogPost {
  id: string;
  slug: string;
  title: { fa: string };
  excerpt?: { fa: string };
  image?: string | null;
  createdAt: string;
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await fetchAPI<BlogPost[]>('/blog');
  } catch {
    // empty
  }

  return (
    <div className="page-container">
      <nav className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 sm:mb-6">
        <Link href="/" className="hover:text-[var(--color-blue-deep)]">خانه</Link>
        <span className="mx-2">/</span>
        <span>وبلاگ</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">وبلاگ نکال</h1>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-center py-12">مقاله‌ای منتشر نشده</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => {
            const imageUrl = resolveMediaUrl(post.image);
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card-fashion group block overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-blue-pale)] to-[var(--color-blue-light)] overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={post.title.fa}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <p className="fashion-label mb-2">Article</p>
                  <h2 className="font-bold text-base sm:text-lg mb-2 group-hover:text-[var(--color-blue-deep)] transition-colors">
                    {post.title.fa}
                  </h2>
                  {post.excerpt?.fa && (
                    <p className="text-[var(--color-text-muted)] text-sm line-clamp-3">{post.excerpt.fa}</p>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] mt-4">
                    {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
