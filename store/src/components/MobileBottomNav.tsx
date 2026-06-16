'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, ShoppingCart, Phone, Grid3X3, BookOpen } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useConfig } from '@/lib/config-context';
import { useModuleActive } from '@/lib/modules';
import clsx from 'clsx';

const iconMap: Record<string, React.ElementType> = {
  '/': Home,
  '/products': Grid3X3,
  '/cart': ShoppingCart,
  '/blog': Newspaper,
  '/lookbook': BookOpen,
  '/contact': Phone,
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const config = useConfig();
  const mobileConfig = config.mobile_nav_config;
  const blogActive = useModuleActive('blog');
  const lookbookActive = useModuleActive('lookbook');

  if (mobileConfig?.enabled === false) return null;

  let items = mobileConfig?.useNavigation !== false
    ? (config._navigation || [])
        .filter((item) => {
          if (item.url === '/blog' && !blogActive) return false;
          if (item.url === '/lookbook' && !lookbookActive) return false;
          return true;
        })
        .slice(0, mobileConfig?.maxItems || 5)
        .map((item) => ({
          href: item.url,
          icon: iconMap[item.url] || Home,
          label: item.label.fa,
          badge: item.url === '/cart',
        }))
    : [
        { href: '/', icon: Home, label: 'خانه', badge: false },
        { href: '/products', icon: Grid3X3, label: 'فروشگاه', badge: false },
        { href: '/cart', icon: ShoppingCart, label: 'سبد', badge: true },
        { href: '/contact', icon: Phone, label: 'تماس', badge: false },
      ];

  if (!items.find((i) => i.href === '/cart')) {
    items = [...items.slice(0, 4), { href: '/cart', icon: ShoppingCart, label: 'سبد', badge: true }];
  }

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 mobile-bottom-nav safe-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-2 py-2 min-w-[52px] transition-all',
                isActive ? 'text-[var(--color-blue-deep)]' : 'text-[var(--color-text-muted)]'
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {badge && totalItems > 0 && (
                  <span className="absolute -top-1 -left-1.5 min-w-[14px] h-3.5 px-0.5 bg-[var(--color-blue-deep)] text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[9px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
