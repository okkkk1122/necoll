import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#1B2A3E',
          secondary: '#A67B5B',
          accent: '#3B82F6',
          sidebar: '#0F172A',
          surface: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};

export default config;
