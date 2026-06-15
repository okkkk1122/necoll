const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3011';

const LEGACY_BROKEN_PREFIXES = ['/slides/', '/logo.svg'];

/** Old seed paths like /products/shirt.jpg that never existed as static files */
const LEGACY_BROKEN_FILES = /^\/products\/[^/]+\.(jpg|jpeg|webp)$/i;

export function isBrokenAssetPath(url?: string | null): boolean {
  if (!url) return true;
  if (url === '/logo.svg') return true;
  if (LEGACY_BROKEN_FILES.test(url)) return true;
  return LEGACY_BROKEN_PREFIXES.some((p) => url.startsWith(p) && !url.startsWith('/uploads/'));
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url || isBrokenAssetPath(url)) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
  if (url.startsWith('/')) return url;
  return url;
}

export function resolveLogoUrl(url?: string | null): string {
  const resolved = resolveMediaUrl(url);
  if (resolved && resolved !== '/logo.svg') return resolved;
  return '/logo.png';
}
