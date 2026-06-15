'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Palette,
  Layout,
  Package,
  Puzzle,
  Navigation,
  Scale,
  Plug,
  Search,
  Bell,
  MessageSquare,
  FileText,
  Star,
  ShoppingCart,
  Users,
  FlaskConical,
  LogOut,
} from 'lucide-react';
import { clearToken } from '@/lib/api';
import clsx from 'clsx';

const menuItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/content', label: 'مدیریت محتوا', icon: FileText },
  { href: '/admin/settings', label: 'تنظیمات HyperConfig', icon: Settings },
  { href: '/admin/theme', label: 'مدیریت تم', icon: Palette },
  { href: '/admin/layout-manager', label: 'چیدمان صفحه اصلی', icon: Layout },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/blog', label: 'وبلاگ', icon: FileText },
  { href: '/admin/reviews', label: 'نظرات', icon: Star },
  { href: '/admin/product-fields', label: 'فیلدهای محصول', icon: Package },
  { href: '/admin/modules', label: 'ماژول‌ها', icon: Puzzle },
  { href: '/admin/navigation', label: 'ناوبری و مسیرها', icon: Navigation },
  { href: '/admin/business-rules', label: 'قوانین کسب‌وکار', icon: Scale },
  { href: '/admin/integrations', label: 'یکپارچگی‌ها', icon: Plug },
  { href: '/admin/seo', label: 'سئو', icon: Search },
  { href: '/admin/notifications', label: 'اعلان‌ها', icon: Bell },
  { href: '/admin/chat', label: 'چت AI', icon: MessageSquare },
  { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/sandbox', label: 'شبیه‌ساز تنظیمات', icon: FlaskConical },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearToken();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-admin-sidebar text-white min-h-screen flex flex-col fixed right-0 top-0 z-40">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">نکال</h1>
        <p className="text-xs text-white/50 mt-1">HyperConfig Panel</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white border-r-2 border-admin-secondary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm text-white/60 hover:text-white w-full px-2 py-2"
        >
          <LogOut size={18} />
          خروج
        </button>
      </div>
    </aside>
  );
}
