import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Tahoma', 'sans-serif'],
        body: ['var(--font-body)', 'Tahoma', 'sans-serif'],
        heading: ['var(--font-heading)', 'IranianSans', 'sans-serif'],
        product: ['var(--font-product)', 'IranianSans', 'sans-serif'],
        nav: ['var(--font-nav)', 'Yekan', 'sans-serif'],
        price: ['var(--font-price)', 'IranianSans', 'sans-serif'],
        editorial: ['var(--font-editorial)', 'IranianSans', 'sans-serif'],
        cta: ['var(--font-cta)', 'Farhang', 'Yekan', 'sans-serif'],
        display: ['var(--font-heading)', 'Yekan', 'sans-serif'],
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
