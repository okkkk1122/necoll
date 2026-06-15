'use client';

import Link from 'next/link';
import { useConfig } from '@/lib/config-context';
import { resolveMediaUrl } from '@/lib/media';
import ScrollReveal from './ScrollReveal';

interface LookbookGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default function LookbookGrid({ limit, showHeader = true }: LookbookGridProps) {
  const config = useConfig();
  const lookbook = config.lookbook_config;
  const labels = config.section_labels?.lookbook;

  if (!lookbook?.enabled || !lookbook.items?.length) return null;

  const items = limit ? lookbook.items.slice(0, limit) : lookbook.items;

  return (
    <section className="page-container-wide py-16 md:py-20">
      {showHeader && (
        <div className="text-center mb-10 md:mb-14">
          {labels?.label?.fa && <p className="fashion-label mb-3">{labels.label.fa}</p>}
          <h2 className="section-title">{labels?.title?.fa || lookbook.pageTitle?.fa || 'لوک‌بوک'}</h2>
          <div className="fashion-divider" />
          {(labels?.subtitle?.fa || lookbook.pageSubtitle?.fa) && (
            <p className="section-subtitle">{labels?.subtitle?.fa || lookbook.pageSubtitle?.fa}</p>
          )}
          {labels?.linkText?.fa && (
            <Link href="/lookbook" className="link-arrow group mt-6 inline-flex">
              <span>{labels.linkText.fa}</span>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((item, i) => {
          const isVideo = item.mediaType === 'video' && item.video;
          const imageUrl = resolveMediaUrl(item.image);
          const videoUrl = resolveMediaUrl(item.video);
          const href = item.link || '/lookbook';

          return (
            <ScrollReveal key={item.id} delay={i * 100}>
              <Link href={href} className="category-tile group block">
                {isVideo && videoUrl ? (
                  <video src={videoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : imageUrl ? (
                  <img src={imageUrl} alt={item.title.fa} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="category-tile-bg" />
                )}
                <div className="category-tile-overlay">
                  <p className="fashion-label text-white/70 mb-2">Lookbook</p>
                  <h3 className="text-white text-lg md:text-xl font-light tracking-wide">{item.title.fa}</h3>
                  {item.subtitle?.fa && <p className="text-white/70 text-sm mt-1">{item.subtitle.fa}</p>}
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
