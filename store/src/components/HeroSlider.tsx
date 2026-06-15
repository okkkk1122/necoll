'use client';

import { useConfig } from '@/lib/config-context';
import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';
import { useParallax } from '@/hooks/useParallax';

function ParallaxSlideBg({ children, active }: { children: ReactNode; active: boolean }) {
  const parallax = useParallax(active ? 0.15 : 0);

  return (
    <div ref={parallax.ref} style={parallax.style} className="absolute inset-0 parallax-hero-slide-bg">
      {children}
    </div>
  );
}

export default function HeroSlider() {
  const config = useConfig();
  const slider = config.hero_slider;

  const [current, setCurrent] = useState(0);
  const slides = slider?.slides ?? [];

  useEffect(() => {
    if (!slider?.autoplay || slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, slider.interval || 5000);
    return () => clearInterval(timer);
  }, [slider?.autoplay, slider?.interval, slides.length]);

  if (!slider?.enabled || !slides.length) return null;

  return (
    <section className="hero-slider relative w-full overflow-hidden">
      {slides.map((slide, i) => {
        const isVideo = slide.mediaType === 'video' && slide.video;
        const imageUrl = resolveMediaUrl(slide.image);
        const videoUrl = resolveMediaUrl(slide.video);
        const isActive = i === current;
        const showTextOverlay = Boolean(slide.title?.trim());

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
          >
            <ParallaxSlideBg active={isActive}>
              {isVideo && videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="hero-slider__media"
                />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={slide.title || 'اسلاید فروشگاه نکال'}
                  className="hero-slider__media"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
              )}
            </ParallaxSlideBg>

            <div className="hero-slider__overlay" />

            {showTextOverlay && (
              <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:justify-end z-[2] pointer-events-none pb-14 sm:pb-0">
                <div className="hero-slider__content text-center sm:text-right px-4 sm:px-10 md:px-16 lg:px-20 w-full sm:max-w-xl md:max-w-2xl pointer-events-auto">
                  <p className="fashion-label mb-2 sm:mb-4 md:mb-6 text-white/90 text-[10px] sm:text-xs">
                    {config.site_name?.fa || 'نکال'} · {config.site_name?.en || 'necoll'}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white drop-shadow-md mb-2 sm:mb-4 md:mb-6 font-heading font-black leading-tight">
                    {slide.title}
                  </h2>
                  <div className="fashion-divider bg-white/40 mx-auto sm:mr-0 sm:ml-auto hidden sm:block" />
                  {slide.subtitle && (
                    <p className="text-sm sm:text-base md:text-lg text-white/92 mb-4 sm:mb-6 md:mb-8 font-light tracking-wide leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && (
                    <Link
                      href={slide.link || '/products'}
                      className="btn-outline border-white/70 text-white hover:bg-white/15 hover:border-white group inline-flex text-sm sm:text-base !px-5 !py-2.5 sm:!px-7 sm:!py-3.5"
                    >
                      <span className="tracking-[0.08em] text-xs sm:text-sm">{slide.buttonText}</span>
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            className="hero-slider__nav-btn absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2"
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            className="hero-slider__nav-btn absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2"
            aria-label="اسلاید بعدی"
          >
            <ChevronRight size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
          </button>
          <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-px transition-all duration-500 ${
                  i === current ? 'bg-white w-8 sm:w-10' : 'bg-white/40 w-5 sm:w-6 hover:bg-white/60'
                }`}
                aria-label={`اسلاید ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
