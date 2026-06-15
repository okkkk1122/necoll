'use client';

import { Fragment } from 'react';
import { useConfig } from '@/lib/config-context';
import HeroSlider from './HeroSlider';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import LookbookGrid from './LookbookGrid';
import NewsletterForm from './NewsletterForm';
import ModuleGate from './ModuleGate';
import ParallaxSection from './ParallaxSection';
import ParallaxHero from './ParallaxHero';
import ParallaxDivider from './ParallaxDivider';
import Link from 'next/link';
import { Truck, Newspaper, Mail, ArrowLeft } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

const PARALLAX_META: Record<
  string,
  { pattern?: 'dress' | 'fabric' | 'arcs' | 'editorial' | 'none'; patternPosition?: 'left' | 'right' | 'both'; tinted?: boolean }
> = {
  categories: { pattern: 'dress', patternPosition: 'left', tinted: true },
  featured_products: { pattern: 'fabric', patternPosition: 'right' },
  lookbook: { pattern: 'editorial', patternPosition: 'both' },
  banner: { pattern: 'arcs', patternPosition: 'left' },
  new_arrivals: { pattern: 'dress', patternPosition: 'right', tinted: true },
  blog_posts: { pattern: 'fabric', patternPosition: 'left', tinted: true },
  newsletter: { pattern: 'arcs', patternPosition: 'both' },
};

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

interface BlogPost {
  id: string;
  slug: string;
  title: { fa: string };
  excerpt?: { fa: string };
  image?: string | null;
}

interface HomeBlocksProps {
  featuredProducts: Product[];
  newProducts: Product[];
  categories: Category[];
  blogPosts?: BlogPost[];
}

function getSection(config: ReturnType<typeof useConfig>, key: string) {
  return config.section_labels?.[key] || {};
}

export default function HomeBlocks({ featuredProducts, newProducts, categories, blogPosts = [] }: HomeBlocksProps) {
  const config = useConfig();
  const banner = config.banner_config;
  const newsletter = config.newsletter_config;
  const categoryDisplay = config.category_display || {};

  const blocks = config.home_layout_blocks || [
    'hero_slider', 'featured_products', 'categories', 'lookbook', 'banner', 'new_arrivals',
  ];

  const blockComponents: Record<string, React.ReactNode> = {
    hero_slider: (
      <ScrollReveal direction="fade" duration={1000}>
        <HeroSlider />
      </ScrollReveal>
    ),

    categories: (
      <ScrollReveal delay={100}>
        <section className="page-container-wide py-10 sm:py-14 md:py-20">
          <SectionHeader
            title={getSection(config, 'categories').title?.fa || 'کالکشن‌های زنانه'}
            subtitle={getSection(config, 'categories').subtitle?.fa}
            label={getSection(config, 'categories').label?.fa}
            centered
            linkHref="/products"
            linkText={getSection(config, 'categories').linkText?.fa}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {categories.map((cat, i) => {
              const display = categoryDisplay[cat.slug];
              const imageUrl = resolveMediaUrl(display?.image);
              return (
                <ScrollReveal key={cat.id} delay={i * 100} direction="up">
                  <Link href={`/products?category=${cat.id}`} className="category-tile group">
                    {imageUrl ? (
                      <img src={imageUrl} alt={cat.name.fa} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div
                        className="category-tile-bg group-hover:scale-105"
                        style={{ background: display?.gradient || 'var(--gradient-hero)' }}
                      />
                    )}
                    <div className="category-tile-overlay">
                      <p className="fashion-label text-white/70 mb-2">Collection</p>
                      <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide font-nav">{cat.name.fa}</h3>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </ScrollReveal>
    ),

    featured_products: featuredProducts.length > 0 ? (
      <ScrollReveal delay={100}>
        <section className="page-container-wide py-10 sm:py-14 md:py-20 bg-[var(--color-surface)]">
          <SectionHeader
            title={getSection(config, 'featured_products').title?.fa || 'منتخب ویژه'}
            subtitle={getSection(config, 'featured_products').subtitle?.fa}
            label={getSection(config, 'featured_products').label?.fa}
            centered
            linkHref="/products?featured=true"
            linkText={getSection(config, 'featured_products').linkText?.fa}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {featuredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    ) : null,

    lookbook: (
      <ModuleGate module="lookbook">
        <ScrollReveal delay={100}>
          <LookbookGrid limit={3} />
        </ScrollReveal>
      </ModuleGate>
    ),

    banner: banner?.enabled !== false ? (
      <ScrollReveal direction="up">
        <section className="page-container-wide py-6 sm:py-8 md:py-12">
          <div className="editorial-banner relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue-pale)] via-[var(--color-accent)]/25 to-[var(--color-blue-light)]/40" />
            <div className="relative">
              {banner?.label?.fa && <p className="fashion-label mb-4">{banner.label.fa}</p>}
              <h2 className="fashion-title text-3xl md:text-4xl mb-4">{banner?.title?.fa || ''}</h2>
              <div className="fashion-divider" />
              {banner?.subtitle?.fa && (
                <p className="text-[var(--color-text-muted)] text-base mb-8 max-w-lg mx-auto font-light tracking-wide">{banner.subtitle.fa}</p>
              )}
              <Link href={banner?.buttonLink || '/products'} className="btn-primary group inline-flex">
                <Truck size={15} strokeWidth={1.5} />
                <span className="uppercase text-sm tracking-[0.12em]">{banner?.buttonText?.fa || 'شروع خرید'}</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    ) : null,

    new_arrivals: newProducts.length > 0 ? (
      <ScrollReveal delay={100}>
        <section className="page-container-wide py-10 sm:py-14 md:py-20">
          <SectionHeader
            title={getSection(config, 'new_arrivals').title?.fa || 'جدیدترین‌ها'}
            subtitle={getSection(config, 'new_arrivals').subtitle?.fa}
            label={getSection(config, 'new_arrivals').label?.fa}
            centered
            linkHref="/products"
            linkText={getSection(config, 'new_arrivals').linkText?.fa}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {newProducts.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    ) : null,

    blog_posts: (
      <ModuleGate module="blog">
        {blogPosts.length > 0 ? (
          <ScrollReveal delay={100}>
            <section className="page-container-wide py-10 sm:py-14 md:py-20 bg-[var(--color-blue-mist)]">
              <SectionHeader
                title={getSection(config, 'blog_posts').title?.fa || 'مجله مد'}
                subtitle={getSection(config, 'blog_posts').subtitle?.fa}
                label={getSection(config, 'blog_posts').label?.fa}
                centered
                linkHref="/blog"
                linkText={getSection(config, 'blog_posts').linkText?.fa}
              />
              <div className="grid md:grid-cols-3 gap-5 md:gap-8">
                {blogPosts.slice(0, 3).map((post, i) => {
                  const imageUrl = resolveMediaUrl(post.image);
                  return (
                  <ScrollReveal key={post.id} delay={i * 120}>
                    <Link href={`/blog/${post.slug}`} className="card-fashion group block">
                      <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-blue-pale)] to-[var(--color-blue-light)] overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title.fa}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper size={28} strokeWidth={1} className="text-[var(--color-blue-deep)]/30 group-hover:text-[var(--color-blue-deep)]/50 transition-colors" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="fashion-label mb-2">Article</p>
                        <h3 className="text-lg font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-blue-deep)] transition-colors tracking-wide leading-relaxed font-heading">
                          {post.title.fa}
                        </h3>
                        {post.excerpt?.fa && (
                          <p className="text-base text-[var(--color-text-muted)] mt-3 line-clamp-2 font-light">{post.excerpt.fa}</p>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>
        ) : null}
      </ModuleGate>
    ),

    newsletter: (
      <ModuleGate module="newsletter">
        {newsletter?.enabled !== false ? (
          <ScrollReveal direction="up">
            <section className="page-container-wide py-10 sm:py-14 md:py-20">
              <div className="max-w-xl mx-auto text-center border border-[var(--color-border)] p-6 sm:p-10 md:p-14 bg-[var(--color-surface)]">
                <Mail size={24} strokeWidth={1} className="mx-auto mb-5 text-[var(--color-blue-deep)]" />
                {newsletter?.label?.fa && <p className="fashion-label mb-3">{newsletter.label.fa}</p>}
                <h2 className="section-title mb-2">{newsletter?.title?.fa || 'عضویت در خبرنامه'}</h2>
                <div className="fashion-divider" />
                {newsletter?.subtitle?.fa && <p className="text-[var(--color-text-muted)] text-base mb-8 font-light">{newsletter.subtitle.fa}</p>}
                <NewsletterForm />
              </div>
            </section>
          </ScrollReveal>
        ) : null}
      </ModuleGate>
    ),

    testimonials: (
      <ScrollReveal delay={100}>
        <section className="page-container-wide py-16 text-center">
          <p className="fashion-label mb-3">Testimonials</p>
          <h2 className="section-title">نظرات مشتریان</h2>
          <div className="fashion-divider" />
          <p className="text-[var(--color-text-muted)] text-sm font-light">به زودی...</p>
        </section>
      </ScrollReveal>
    ),

    brands: (
      <ScrollReveal delay={100}>
        <section className="page-container-wide py-16 text-center">
          <p className="fashion-label mb-3">Brands</p>
          <h2 className="section-title">برندهای همکار</h2>
          <div className="fashion-divider" />
          <p className="text-[var(--color-text-muted)] text-sm font-light">به زودی...</p>
        </section>
      </ScrollReveal>
    ),
  };

  const visibleBlocks = blocks.filter((block) => blockComponents[block]);

  return (
    <div className="parallax-home">
      {visibleBlocks.map((block, index) => {
        const content = blockComponents[block];
        const meta = PARALLAX_META[block];

        if (block === 'hero_slider') {
          return (
            <ParallaxHero key={block}>
              {content}
            </ParallaxHero>
          );
        }

        return (
          <Fragment key={block}>
            {index > 0 && <ParallaxDivider />}
            <ParallaxSection
              pattern={meta?.pattern ?? 'none'}
              patternPosition={meta?.patternPosition ?? 'right'}
              tinted={meta?.tinted}
            >
              {content}
            </ParallaxSection>
          </Fragment>
        );
      })}
    </div>
  );
}
