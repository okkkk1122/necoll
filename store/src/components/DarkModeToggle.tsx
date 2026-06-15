'use client';



import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/theme-context';



export default function DarkModeToggle({ variant = 'header' }: { variant?: 'header' | 'floating' }) {

  const { theme, toggleTheme } = useTheme();



  const baseClass =

    variant === 'header'

      ? 'btn-ghost text-[var(--color-text-muted)] hover:text-[var(--color-blue-deep)] w-10 h-10'

      : 'fixed bottom-24 left-24 z-40 w-11 h-11 card-static flex items-center justify-center shadow-lg hover:scale-105 transition-transform';



  return (

    <button

      onClick={toggleTheme}

      className={baseClass}

      aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}

      title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}

    >

      {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}

    </button>

  );

}


