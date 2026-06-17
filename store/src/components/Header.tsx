'use client';

import Link from 'next/link';
import { useConfig } from '@/lib/config-context';
import { Search, Menu, X } from 'lucide-react';
import CartBadge from './CartBadge';
import Logo from './Logo';
import NavMenu from './NavMenu';
import SearchOverlay from './SearchOverlay';
import { useState } from 'react';

export default function Header() {
  const config = useConfig();
  const navigation = config._navigation || [];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="site-header">
      <div className="border-b border-[var(--color-border)]">
        {/* Mobile */}
        <div className="lg:hidden">
          <div className="relative flex items-center justify-between h-14 px-3">
            <button
              className="btn-ghost text-[var(--color-text)] shrink-0 z-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="فهرست"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="header-logo-center pointer-events-none absolute inset-0 flex items-center justify-center z-20">
              <div className="pointer-events-auto">
                <Logo size="sm" showText />
              </div>
            </div>
            <div className="flex items-center gap-0 shrink-0 z-10">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost text-[var(--color-text)] w-9 h-9"
                aria-label="جستجو"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <CartBadge />
            </div>
          </div>
        </div>

        {/* Desktop — Monaie */}
        <div className="hidden lg:block">
          <div className="flex justify-center py-6 border-b border-[var(--color-border-light)]">
            <Logo size="md" showText />
          </div>
          <div className="container mx-auto px-6 max-w-full">
            <div className="relative flex items-center min-h-[52px]">
              <div className="absolute left-0 flex items-center gap-2 z-10">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="btn-ghost text-[var(--color-text)] w-10 h-10"
                  aria-label="جستجو"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
                <CartBadge showLabel />
              </div>
              <div className="mx-auto py-2 w-full flex justify-center">
                <NavMenu items={navigation} variant="desktop" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-b border-[var(--color-border)] bg-[var(--color-header)] max-h-[75vh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          <NavMenu
            items={navigation}
            variant="mobile"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <SearchOverlay
        open={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onClose={() => setSearchOpen(false)}
        onSubmit={handleSearch}
      />
    </header>
  );
}
