'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: { fa: string; en?: string };
  url: string;
  children?: NavItem[];
}

interface NavMenuProps {
  items: NavItem[];
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

function isActive(pathname: string, url: string) {
  if (url === '/') return pathname === '/';
  const base = url.split('?')[0];
  return pathname === base || pathname.startsWith(base + '/');
}

export default function NavMenu({ items, variant, onNavigate }: NavMenuProps) {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);

  if (variant === 'desktop') {
    return (
      <nav className="monaie-nav" aria-label="فهرست">
        {items.map((item) => {
          const hasChildren = (item.children?.length ?? 0) > 0;
          const active = isActive(pathname, item.url);
          return (
            <div
              key={item.id}
              className="monaie-nav__item"
              onMouseEnter={() => hasChildren && setOpenId(item.id)}
              onMouseLeave={() => hasChildren && setOpenId(null)}
            >
              <Link
                href={item.url}
                className={clsx('monaie-nav__link', active && 'monaie-nav__link--active')}
              >
                {item.label.fa}
                {hasChildren && <ChevronDown size={12} className="monaie-nav__chevron" />}
              </Link>
              {hasChildren && openId === item.id && (
                <div className="monaie-nav__dropdown">
                  {item.children!.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      className="monaie-nav__dropdown-link"
                    >
                      {child.label.fa}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="monaie-mobile-nav" aria-label="فهرست">
      {items.map((item) => {
        const hasChildren = (item.children?.length ?? 0) > 0;
        const expanded = openId === item.id;
        const active = isActive(pathname, item.url);
        return (
          <div key={item.id} className="monaie-mobile-nav__group">
            <div className="flex items-center justify-between">
              <Link
                href={item.url}
                className={clsx('monaie-mobile-nav__link', active && 'monaie-mobile-nav__link--active')}
                onClick={onNavigate}
              >
                {item.label.fa}
              </Link>
              {hasChildren && (
                <button
                  type="button"
                  className="monaie-mobile-nav__toggle"
                  onClick={() => setOpenId(expanded ? null : item.id)}
                  aria-expanded={expanded}
                >
                  <ChevronDown size={16} className={clsx('transition-transform', expanded && 'rotate-180')} />
                </button>
              )}
            </div>
            {hasChildren && expanded && (
              <div className="monaie-mobile-nav__children">
                {item.children!.map((child) => (
                  <Link
                    key={child.id}
                    href={child.url}
                    className="monaie-mobile-nav__child-link"
                    onClick={onNavigate}
                  >
                    {child.label.fa}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
