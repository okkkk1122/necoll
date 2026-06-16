'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConfig } from '@/lib/config-context';
import { Search, Menu, X } from 'lucide-react';
import CartBadge from './CartBadge';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { SocialIcon, getSocialMeta, type SocialKey } from './SocialIcons';
import { useState } from 'react';
import clsx from 'clsx';

export default function Header() {
  const config = useConfig();
  const pathname = usePathname();
  const navigation = config._navigation || [];
  const socialLinks = config.social_links || {};
  const socialEnabled = config.social_enabled || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSocials = Object.entries(socialLinks).filter(
    ([key, url]) => url && socialEnabled[key]
  ) as [SocialKey, string][];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="z-50">
      {config.announcement_bar?.enabled !== false && config.announcement_bar?.text?.fa && (
        <div className="announcement-bar">
          {config.announcement_bar.link ? (
            <Link href={config.announcement_bar.link} className="block truncate px-4">
              {config.announcement_bar.text.fa}
            </Link>
          ) : (
            <span className="block truncate px-4">{config.announcement_bar.text.fa}</span>
          )}
        </div>
      )}

      <div className="site-header border-b border-[var(--color-border-light)]">
        <div className="container mx-auto px-3 sm:px-4 md:px-8 max-w-full">
          {/* Mobile & tablet header — logo absolutely centered */}
          <div className="relative flex items-center justify-between h-[60px] sm:h-[68px] lg:hidden">
            <button
              className="btn-ghost text-[var(--color-text)] shrink-0 z-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="منو"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="header-logo-center pointer-events-none absolute inset-0 flex items-center justify-center z-20">
              <div className="pointer-events-auto">
                <Logo size="sm" showText />
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0 z-10">
              <DarkModeToggle variant="header" />
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost text-[var(--color-text-muted)] w-9 h-9 sm:w-10 sm:h-10"
                aria-label="جستجو"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <div className="text-[var(--color-text)]">
                <CartBadge />
              </div>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-between h-[76px]">
            <nav className="flex items-center gap-8 flex-1">
              {navigation.slice(0, Math.ceil(navigation.length / 2)).map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={clsx('nav-link', isActive && 'nav-link-active')}
                  >
                    {item.label.fa}
                  </Link>
                );
              })}
            </nav>

            <Logo size="md" showText />

            <div className="flex items-center gap-1 flex-1 justify-end">
              <nav className="flex items-center gap-8">
                {navigation.slice(Math.ceil(navigation.length / 2)).map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <Link
                      key={item.id}
                      href={item.url}
                      className={clsx('nav-link', isActive && 'nav-link-active')}
                    >
                      {item.label.fa}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-0.5 mr-4 pr-4 border-r border-[var(--color-border-light)] hidden xl:flex">
                {activeSocials.slice(0, 3).map(([key, url]) => {
                  const meta = getSocialMeta(key);
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      title={meta.label}
                      style={{ color: meta.color }}
                    >
                      <SocialIcon platform={key} size={15} />
                    </a>
                  );
                })}
              </div>

              <DarkModeToggle variant="header" />

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost text-[var(--color-text-muted)] w-10 h-10"
                aria-label="جستجو"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>

              <div className="text-[var(--color-text)]">
                <CartBadge />
              </div>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-4 sm:pb-5 border-t border-[var(--color-border-light)] pt-3 sm:pt-4">
              <div className="relative max-w-xl mx-auto">
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصول..."
                  className="input-modern pr-11 text-center tracking-wide"
                  autoFocus
                />
              </div>
            </form>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-b border-[var(--color-border-light)] bg-[var(--color-header)] max-h-[70vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4 sm:py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={clsx(
                    'block py-3 px-2 text-sm tracking-widest uppercase transition-colors border-b border-[var(--color-border-light)] last:border-0',
                    isActive ? 'text-[var(--color-blue-deep)]' : 'text-[var(--color-text-muted)]'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label.fa}
                </Link>
              );
            })}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-2 pt-4">
                {activeSocials.map(([key, url]) => {
                  const meta = getSocialMeta(key);
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      style={{ color: meta.color }}
                    >
                      <SocialIcon platform={key} size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
