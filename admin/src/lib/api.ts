import { adminUrl, routes } from '@/lib/paths';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit & { noAuth?: boolean }
): Promise<T> {
  const token = options?.noAuth ? null : getToken();
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    window.location.href = adminUrl(routes.login);
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token);
  document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken() {
  localStorage.removeItem('admin_token');
  document.cookie = 'admin_token=; path=/; max-age=0';
}
