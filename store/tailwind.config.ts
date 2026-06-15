import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Tahoma', 'sans-serif'],
        heading: ['var(--font-heading)', 'Kalameh', 'sans-serif'],
        product: ['var(--font-product)', 'Dana', 'sans-serif'],
        nav: ['var(--font-nav)', 'YekanBakh', 'sans-serif'],
        price: ['var(--font-price)', 'Dana', 'sans-serif'],
        editorial: ['var(--font-editorial)', 'Dana', 'sans-serif'],
        display: ['var(--font-heading)', 'Kalameh', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-text-muted)',
      },
      borderRadius: {
        '2xl': 'var(--border-radius)',
        '3xl': 'var(--border-radius-lg)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-md)',
      },
    },
  },
  plugins: [],
};

export default config;
