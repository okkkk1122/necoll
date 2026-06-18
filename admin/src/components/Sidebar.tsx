'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Package,
  ShoppingCart,
  Star,
  Users,
  Navigation,
  Inbox,
  LogOut,
} from 'lucide-react';
import { clearToken } from '@/lib/api';
import { adminUrl, routes } from '@/lib/paths';
import clsx from 'clsx';

const menuItems = [
  { href: routes.home, label: 'داشبورد', icon: LayoutDashboard },
  { href: routes.content, label: 'محتوا و ظاهر', icon: FileText },
  { href: routes.products, label: 'فروشگاه', icon: Package },
  { href: routes.blog, label: 'وبلاگ', icon: FileText },
  { href: routes.orders, label: 'سفارشات', icon: ShoppingCart },
  { href: routes.reviews, label: 'نظرات', icon: Star },
  { href: routes.users, label: 'کاربران', icon: Users },
  { href: routes.messages, label: 'پیام‌ها', icon: Inbox },
  { href: routes.navigation, label: 'ناوبری', icon: Navigation },
  { href: routes.settings, label: 'تنظیمات سیستم', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearToken();
    window.location.href = adminUrl(routes.login);
  };

  return (
    <aside className="w-64 bg-admin-sidebar text-white min-h-screen flex flex-col fixed right-0 top-0 z-40">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">نکال</h1>
        <p className="text-xs text-white/50 mt-1">پنل مدیریت</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== routes.home && pathname.startsWith(item.href));
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
