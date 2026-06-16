'use client';

import { useConfig } from '@/lib/config-context';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

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
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0">
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
                <div className="absolute inset-0 bg-[var(--color-blue-pale)]" />
              )}
            </div>

            <div className="hero-slider__overlay" />

            {showTextOverlay && (
              <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:justify-end z-[2] pointer-events-none pb-14 sm:pb-0">
                <div className="hero-slider__content text-center sm:text-right px-4 sm:px-10 md:px-16 lg:px-20 w-full sm:max-w-xl md:max-w-2xl pointer-events-auto">
                  <p className="fashion-label mb-2 sm:mb-3 text-white/90 text-xs">
                    {config.site_name?.fa || 'نکال'}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-4xl text-white mb-2 sm:mb-4 font-heading font-bold leading-tight">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && (
                    <Link
                      href={slide.link || '/products'}
                      className="btn-outline border-white/70 text-white hover:bg-white/15 hover:border-white group inline-flex text-sm !px-5 !py-2.5 sm:!px-6 sm:!py-3"
                    >
                      <span>{slide.buttonText}</span>
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
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-px transition-all duration-300 ${
                  i === current ? 'bg-white w-8' : 'bg-white/40 w-5 hover:bg-white/60'
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
