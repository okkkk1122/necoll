'use client';

import { useConfig } from '@/lib/config-context';
import HomeBlocks from './HomeBlocks';
import HeroSlider from './HeroSlider';
import LookbookGrid from './LookbookGrid';
import NewsletterForm from './NewsletterForm';

function HomeBanner() {
  const config = useConfig();
  const banner = config.banner_config as
    | {
        enabled?: boolean;
        title?: { fa?: string };
        subtitle?: { fa?: string };
        buttonText?: { fa?: string };
        buttonLink?: string;
        image?: string;
      }
    | undefined;

  if (banner?.enabled === false || !banner?.title?.fa) return null;

  return (
    <section className="monaie-home-banner border-b border-[var(--color-border)] py-10 px-4 text-center">
      <h2 className="text-xl font-heading font-bold mb-2">{banner.title.fa}</h2>
      {banner.subtitle?.fa && (
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{banner.subtitle.fa}</p>
      )}
      {banner.buttonText?.fa && banner.buttonLink && (
        <a
          href={banner.buttonLink}
          className="inline-block text-sm border border-[var(--color-text)] px-6 py-2 hover:bg-[var(--color-text)] hover:text-white transition-colors"
        >
          {banner.buttonText.fa}
        </a>
      )}
    </section>
  );
}

const blockRenderers: Record<string, () => JSX.Element | null> = {
  hero_slider: () => <HeroSlider />,
  categories: () => <HomeBlocks />,
  banner: () => <HomeBanner />,
  lookbook: () => <LookbookGrid />,
  newsletter: () => <NewsletterForm />,
};

export default function HomePageLayout() {
  const config = useConfig();
  const blocks = (config.home_layout_blocks as string[] | undefined) || ['categories'];

  return (
    <>
      {blocks.map((blockId) => {
        const render = blockRenderers[blockId];
        if (!render) return null;
        return <div key={blockId}>{render()}</div>;
      })}
    </>
  );
}
