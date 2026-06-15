'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, LayoutGrid, Star, Filter, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface Category {
  id: string;
  slug: string;
  name: { fa: string };
}

function FilterContent({
  categories,
  search,
  setSearch,
  currentCategory,
  featured,
  updateParams,
  handleSearch,
}: {
  categories: Category[];
  search: string;
  setSearch: (v: string) => void;
  currentCategory: string;
  featured: boolean;
  updateParams: (key: string, value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <form onSubmit={handleSearch}>
        <label className="text-xs font-medium text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
          <Search size={13} /> جستجو
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="نام محصول..."
          className="input-modern !py-2.5"
        />
      </form>

      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
          <LayoutGrid size={13} /> دسته‌بندی
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateParams('category', '')}
            className={`block w-full text-right text-sm px-4 py-2.5 rounded-xl transition-all font-medium ${
              !currentCategory
                ? 'bg-[var(--color-blue-deep)] text-white'
                : 'hover:bg-[var(--color-blue-pale)] text-[var(--color-text)]'
            }`}
          >
            همه محصولات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams('category', cat.id)}
              className={`block w-full text-right text-sm px-4 py-2.5 rounded-xl transition-all ${
                currentCategory === cat.id
                  ? 'bg-[var(--color-blue-deep)] text-white font-medium'
                  : 'hover:bg-[var(--color-blue-pale)] text-[var(--color-text)]'
              }`}
            >
              {cat.name.fa}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 text-sm cursor-pointer p-3 rounded-xl hover:bg-[var(--color-background-alt)] transition-colors">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => updateParams('featured', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded accent-[var(--color-secondary)]"
          />
          <Star size={14} className="text-[var(--color-accent)]" />
          فقط محصولات ویژه
        </label>
      </div>
    </>
  );
}

export default function ProductFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const activeFilters = [currentCategory, featured, searchParams.get('search')].filter(Boolean).length;

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('search', search);
    setMobileOpen(false);
  };

  const filterProps = {
    categories,
    search,
    setSearch,
    currentCategory,
    featured,
    updateParams: (key: string, value: string) => {
      updateParams(key, value);
      if (key !== 'search') setMobileOpen(false);
    },
    handleSearch,
  };

  return (
    <>
      {/* Mobile / tablet toggle */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="card-static w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} className="text-[var(--color-blue-deep)]" />
            فیلتر و جستجو
            {activeFilters > 0 && (
              <span className="bg-[var(--color-blue-deep)] text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilters}
              </span>
            )}
          </span>
          <ChevronDown size={18} className={clsx('transition-transform', mobileOpen && 'rotate-180')} />
        </button>
        {mobileOpen && (
          <aside className="card-static p-4 sm:p-6 space-y-5 mt-2">
            <FilterContent {...filterProps} />
          </aside>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block card-static p-6 space-y-6 h-fit sticky top-28">
        <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-border-light)]">
          <Filter size={18} className="text-[var(--color-secondary)]" />
          <h3 className="fashion-label !text-[var(--color-primary)] !tracking-[0.15em]">فیلترها</h3>
        </div>
        <FilterContent {...filterProps} />
      </aside>
    </>
  );
}
