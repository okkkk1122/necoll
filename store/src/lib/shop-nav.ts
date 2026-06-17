export interface NavItem {
  id: string;
  label: { fa: string; en?: string };
  url: string;
  children?: NavItem[];
}

function queryFromUrl(url: string): URLSearchParams {
  const idx = url.indexOf('?');
  if (idx === -1) return new URLSearchParams();
  return new URLSearchParams(url.slice(idx + 1));
}

function isProductsUrl(url: string) {
  return url === '/products' || url.startsWith('/products?');
}

export function paramsMatchNav(itemUrl: string, current: URLSearchParams): boolean {
  if (!isProductsUrl(itemUrl)) return false;
  const itemParams = queryFromUrl(itemUrl);

  if (itemUrl === '/products' && current.toString() === '') return true;

  if (itemParams.toString() === '') return false;

  for (const [key, value] of itemParams.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

export function navMatchScore(itemUrl: string, current: URLSearchParams): number {
  if (!paramsMatchNav(itemUrl, current)) return -1;
  if (itemUrl === '/products' && current.toString() === '') return 0;
  return queryFromUrl(itemUrl).toString().split('&').filter(Boolean).length;
}

export function findNavPath(
  items: NavItem[],
  current: URLSearchParams,
  ancestors: NavItem[] = []
): NavItem[] | null {
  let best: { path: NavItem[]; score: number } | null = null;

  for (const item of items) {
    const path = [...ancestors, item];
    const score = navMatchScore(item.url, current);

    if (score >= 0 && (!best || score > best.score)) {
      best = { path, score };
    }

    if (item.children?.length) {
      const childPath = findNavPath(item.children, current, path);
      if (childPath) {
        const childItem = childPath[childPath.length - 1];
        const childScore = navMatchScore(childItem.url, current);
        if (childScore >= 0 && (!best || childScore > best.score)) {
          best = { path: childPath, score: childScore };
        }
      }
    }
  }

  return best?.path ?? null;
}

export function resolveProductsTitle(nav: NavItem[] | undefined, current: URLSearchParams): string {
  if (!nav?.length) return 'فروشگاه';

  const path = findNavPath(nav, current);
  if (!path?.length) return 'فروشگاه';

  const item = path[path.length - 1];
  if (item.url === '/products' && current.toString() === '') return 'فروشگاه';

  if (path.length >= 2) {
    const parent = path[path.length - 2];
    if (isProductsUrl(parent.url)) {
      return `${parent.label.fa} / ${item.label.fa}`;
    }
  }

  return item.label.fa;
}

const SECTION_KEYS = new Set(['section', 'item', 'category', 'featured']);

export function getShopFilterSections(nav: NavItem[] | undefined): NavItem[] {
  if (!nav?.length) return [];
  return nav.filter((item) => {
    const params = queryFromUrl(item.url);
    return params.has('section') || (params.has('featured') && item.url.includes('/products'));
  });
}

export function getShopFilterItems(nav: NavItem[] | undefined, current: URLSearchParams): NavItem[] {
  if (!nav?.length) return [];

  const path = findNavPath(nav, current);
  if (path && path.length >= 2) {
    const parent = path[path.length - 2];
    if (parent.children?.length && isProductsUrl(parent.url)) {
      return parent.children;
    }
  }

  if (path?.length) {
    const currentItem = path[path.length - 1];
    if (currentItem.children?.length && isProductsUrl(currentItem.url)) {
      return currentItem.children;
    }
  }

  const section = current.get('section');
  if (section) {
    for (const item of nav) {
      const params = queryFromUrl(item.url);
      if (params.get('section') === section && item.children?.length) {
        return item.children;
      }
    }
  }

  return getShopFilterSections(nav);
}

export function isFilterActive(itemUrl: string, current: URLSearchParams): boolean {
  if (itemUrl === '/products') {
    return filterQueryString(current) === '';
  }
  return filterQueryString(queryFromUrl(itemUrl)) === filterQueryString(current);
}

function filterQueryString(params: URLSearchParams): string {
  const keys = ['section', 'item', 'category', 'featured'] as const;
  return keys
    .filter((key) => params.get(key))
    .map((key) => `${key}=${params.get(key)}`)
    .join('&');
}

export function preservePaginationParams(current: URLSearchParams, itemUrl: string): string {
  const target = queryFromUrl(itemUrl);
  const merged = new URLSearchParams(target.toString());
  const search = current.get('search');
  if (search) merged.set('search', search);
  const qs = merged.toString();
  return qs ? `/products?${qs}` : '/products';
}

export function countActiveShopFilters(current: URLSearchParams): number {
  let count = 0;
  if (current.get('section') || current.get('item') || current.get('category')) count++;
  if (current.get('featured') === 'true') count++;
  if (current.get('search')) count++;
  return count;
}
