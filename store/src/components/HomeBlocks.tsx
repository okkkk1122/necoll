'use client';

import { useConfig } from '@/lib/config-context';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';

interface HomeCategory {
  fa: string;
  en: string;
  image: string;
  link: string;
}

export default function HomeBlocks() {
  const config = useConfig();
  const homeCategories = (config.home_categories as HomeCategory[] | undefined) || [];

  if (homeCategories.length === 0) return null;

  return (
    <section className="monaie-home-categories">
      <div className="monaie-home-categories__grid">
        {homeCategories.map((cat, i) => {
          const imageUrl = resolveMediaUrl(cat.image);
          return (
            <Link key={i} href={cat.link} className="monaie-cat-card group">
              <div className="monaie-cat-card__image">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={cat.fa}
                    loading="lazy"
                    decoding="async"
                    className="monaie-cat-card__img transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f0f0]" />
                )}
              </div>
              <div className="monaie-cat-card__body">
                <h3 className="monaie-cat-card__title">{cat.fa}</h3>
                <p className="monaie-cat-card__subtitle">{cat.en}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
