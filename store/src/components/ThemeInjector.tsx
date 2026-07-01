'use client';

import { useConfig } from '@/lib/config-context';
import { useEffect } from 'react';

export default function ThemeInjector() {
  const config = useConfig();
  const colors = config.colors_theme || {};
  const typography = config.typography || {};
  const spacing = config.spacing || {};
  const animations = (config.animations || {}) as { enabled?: boolean; duration?: string };

  useEffect(() => {
    const root = document.documentElement;
    const c = colors as Record<string, string>;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value as string);
    });

    const primary = c.primary;
    const secondary = c.secondary;
    const accent = c.accent;
    const button = c.button || accent;
    const background = c.background || '#F5FAFE';

    if (secondary && accent) {
      root.style.setProperty('--color-blue-soft', secondary);
      root.style.setProperty('--color-blue-light', secondary);
      root.style.setProperty('--color-blue-pale', `${background}`);
      root.style.setProperty('--color-blue-deep', button);
      root.style.setProperty('--color-blue-muted', accent);
      root.style.setProperty('--color-accent-glow', `${accent}33`);

      root.style.setProperty(
        '--gradient-primary',
        `linear-gradient(160deg, ${background} 0%, ${secondary} 50%, ${accent} 100%)`
      );
      root.style.setProperty(
        '--gradient-hero',
        `linear-gradient(165deg, ${accent}55 0%, ${accent} 35%, ${button} 65%, ${secondary} 100%)`
      );
      root.style.setProperty(
        '--gradient-warm',
        `linear-gradient(135deg, ${button} 0%, ${accent} 100%)`
      );
      root.style.setProperty(
        '--gradient-rose',
        `linear-gradient(135deg, ${secondary} 0%, ${accent} 50%, ${background} 100%)`
      );
    }

    if (primary) {
      root.style.setProperty('--logo-text', primary);
      root.style.setProperty(
        '--gradient-editorial',
        `linear-gradient(180deg, transparent 40%, ${primary}8C 100%)`
      );
    }

    if (typography.fontFamily) {
      root.style.setProperty('--font-body', typography.fontFamily as string);
      root.style.setProperty('--font-family', typography.fontFamily as string);
    }
    if (typography.fontBody) {
      root.style.setProperty('--font-body', typography.fontBody as string);
      root.style.setProperty('--font-family', typography.fontBody as string);
    }
    if (typography.fontDisplay || typography.fontHeading) {
      const heading = (typography.fontHeading || typography.fontDisplay) as string;
      root.style.setProperty('--font-heading', heading);
      root.style.setProperty('--font-display', heading);
    }
    if (typography.fontProduct) {
      root.style.setProperty('--font-product', typography.fontProduct as string);
    }
    if (typography.fontNav) {
      root.style.setProperty('--font-nav', typography.fontNav as string);
    }
    if (typography.fontPrice) {
      root.style.setProperty('--font-price', typography.fontPrice as string);
    }
    if (typography.fontEditorial) {
      root.style.setProperty('--font-editorial', typography.fontEditorial as string);
    }
    if (typography.fontCta) {
      root.style.setProperty('--font-cta', typography.fontCta as string);
    }
    if (typography.fontSizeBase) {
      root.style.setProperty('--font-size-base', typography.fontSizeBase as string);
      root.style.fontSize = typography.fontSizeBase as string;
    }
    if (typography.fontSizeH1) {
      root.style.setProperty('--font-size-h1', typography.fontSizeH1 as string);
    }
    if (typography.fontSizeH2) {
      root.style.setProperty('--font-size-h2', typography.fontSizeH2 as string);
    }
    if (typography.fontSizeH3) {
      root.style.setProperty('--font-size-h3', typography.fontSizeH3 as string);
    }
    if (typography.lineHeight) {
      document.body.style.lineHeight = typography.lineHeight as string;
    }
    if (spacing.borderRadius) {
      root.style.setProperty('--border-radius', spacing.borderRadius as string);
    }
    if (animations.duration) {
      root.style.setProperty('--animation-duration', animations.duration as string);
    }
    if (animations.enabled === false) {
      root.style.setProperty('--animation-duration', '0ms');
    }

    const cardStyle = (config.card_style || {}) as Record<string, unknown>;
    if (cardStyle.shadow) {
      root.style.setProperty('--shadow-md', cardStyle.shadow as string);
    }
    if (cardStyle.border === true) {
      root.style.setProperty('--color-border-light', 'var(--color-border)');
    }
  }, [colors, typography, spacing, animations, config.card_style]);

  return null;
}
