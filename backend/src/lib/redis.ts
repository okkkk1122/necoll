import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.warn('[Redis] Connection error:', err.message);
    });
  }

  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Cache failures should not break the app
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch {
    // Ignore cache deletion errors
  }
}
