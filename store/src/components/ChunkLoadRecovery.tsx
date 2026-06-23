'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'necoll_chunk_reload';

function isChunkLoadError(reason: unknown): boolean {
  if (!reason) return false;
  if (typeof reason === 'object' && reason !== null && 'name' in reason) {
    if ((reason as { name?: string }).name === 'ChunkLoadError') return true;
  }
  const msg =
    typeof reason === 'object' && reason !== null && 'message' in reason
      ? String((reason as { message?: unknown }).message)
      : String(reason);
  return (
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Failed to fetch dynamically imported module')
  );
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      try {
        if (sessionStorage.getItem(RELOAD_KEY)) return;
        sessionStorage.setItem(RELOAD_KEY, '1');
      } catch {
        /* ignore */
      }
      window.location.reload();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) reloadOnce();
    };

    const onError = (event: ErrorEvent) => {
      const target = event.target;
      if (target instanceof HTMLScriptElement && target.src.includes('/_next/static/')) {
        reloadOnce();
      }
    };

    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError, true);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError, true);
    };
  }, []);

  return null;
}
