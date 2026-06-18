/** مسیرهای داخلی — basePath `/admin` خودکار اضافه می‌شود */
export const routes = {
  home: '/',
  login: '/login',
  content: '/content',
  products: '/products',
  productsEdit: '/products/edit',
  blog: '/blog',
  blogEdit: '/blog/edit',
  orders: '/orders',
  reviews: '/reviews',
  users: '/users',
  messages: '/messages',
  navigation: '/navigation',
  settings: '/settings',
} as const;

/** URL کامل مرورگر (برای window.location) */
export function adminUrl(path: string) {
  if (path === '/') return '/admin';
  return `/admin${path}`;
}
