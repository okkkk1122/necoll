'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchOverlayProps {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchOverlay({
  open,
  query,
  onQueryChange,
  onClose,
  onSubmit,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="جستجو">
      <button type="button" className="search-overlay__backdrop" onClick={onClose} aria-label="بستن" />
      <div className="search-overlay__panel">
        <button type="button" className="search-overlay__close" onClick={onClose} aria-label="بستن">
          <X size={22} strokeWidth={1.5} />
        </button>
        <h3 className="search-overlay__title">برای جستجو بنویسید و کلید enter را بزنید</h3>
        <form onSubmit={onSubmit} className="search-overlay__form">
          <Search size={18} className="search-overlay__icon" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="جستجوی محصول..."
            className="search-overlay__input"
          />
        </form>
      </div>
    </div>
  );
}
