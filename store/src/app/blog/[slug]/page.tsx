import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resolveMediaUrl } from '@/lib/media';

interface BlogPost {
  id: string;
  slug: string;
  title: { fa: string };
  content: { fa: string };
  excerpt?: { fa: string };
  image?: string | null;
  createdAt: string;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: BlogPost | null = null;
  try {
    post = await fetchAPI<BlogPost>(`/blog/${params.slug}`);
  } catch {
    notFound();
  }
  if (!post) notFound();

  const imageUrl = resolveMediaUrl(post.image);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <nav className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 sm:mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[var(--color-blue-deep)]">خانه</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[var(--color-blue-deep)]">وبلاگ</Link>
        <span>/</span>
        <span>{post.title.fa}</span>
      </nav>

      <article>
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] sm:aspect-[1024/559] rounded-xl overflow-hidden mb-6 sm:mb-8 border border-[var(--color-border-light)] shadow-sm">
            <img
              src={imageUrl}
              alt={post.title.fa}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 font-heading">{post.title.fa}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(post.createdAt).toLocaleDateString('fa-IR')}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-[var(--color-text)] leading-relaxed whitespace-pre-line text-base sm:text-lg font-editorial">
          {post.content.fa}
        </div>
      </article>
    </div>
  );
}
