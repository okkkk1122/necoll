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

  const slide = slides[current];
  const showTextOverlay = Boolean(slide.title?.trim());

  return (
    <section className="monaie-hero hero-slider border-b border-[var(--color-border)]">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px] md:min-h-[420px]">
        {showTextOverlay && (
          <div className="md:col-span-4 bg-[var(--color-primary)] text-white flex flex-col justify-center p-8 md:p-10 lg:p-12 order-2 md:order-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold leading-tight mb-3">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-sm md:text-base text-white/85 leading-relaxed mb-6 max-w-sm">
                {slide.subtitle}
              </p>
            )}
            {slide.buttonText && (
              <Link
                href={slide.link || '/products'}
                className="inline-flex items-center gap-2 text-sm border border-white/60 px-5 py-2.5 w-fit hover:bg-white hover:text-black transition-colors"
              >
                <span>{slide.buttonText}</span>
                <ArrowLeft size={14} />
              </Link>
            )}
          </div>
        )}

        <div
          className={`relative overflow-hidden bg-[#f7f7f7] order-1 md:order-2 ${
            showTextOverlay ? 'md:col-span-8' : 'md:col-span-12'
          } min-h-[260px] md:min-h-full`}
        >
          {slides.map((s, i) => {
            const sVideo = s.mediaType === 'video' && s.video;
            const sImage = resolveMediaUrl(s.image);
            const sVideoUrl = resolveMediaUrl(s.video);
            const active = i === current;

            return (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {sVideo && sVideoUrl ? (
                  <video src={sVideoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : sImage ? (
                  <img
                    src={sImage}
                    alt={s.title || 'اسلاید'}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f0f0]" />
                )}
              </div>
            );
          })}

          {slides.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                className="hero-slider__nav-btn absolute left-3 top-1/2 -translate-y-1/2"
                aria-label="اسلاید قبلی"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="hero-slider__nav-btn absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="اسلاید بعدی"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-px transition-all duration-300 ${
                      i === current ? 'bg-black w-8' : 'bg-black/30 w-5 hover:bg-black/50'
                    }`}
                    aria-label={`اسلاید ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
