export function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3011';
  return `${base}${path}`;
}
