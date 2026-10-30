import { ArrowUpDown, Search, X } from 'lucide-react';
import { useLocale } from '../hooks/useLocale.tsx';

export type SortOrder = 'default' | 'asc' | 'desc';

export interface MenuFilters {
  query: string;
  spicy: boolean;
  vegetarian: boolean;
  popular: boolean;
  sort: SortOrder;
}

export const emptyFilters: MenuFilters = { query: '', spicy: false, vegetarian: false, popular: false, sort: 'default' };

interface Props {
  filters: MenuFilters;
  onChange: (f: MenuFilters) => void;
  resultCount: number;
}

export function MenuToolbar({ filters, onChange, resultCount }: Props) {
  const { t } = useLocale();
  const set = <K extends keyof MenuFilters>(key: K, value: MenuFilters[K]) => onChange({ ...filters, [key]: value });
  const isFiltering = filters.query !== '' || filters.spicy || filters.vegetarian || filters.popular;

  const toggles: { key: 'spicy' | 'vegetarian' | 'popular'; label: string }[] = [
    { key: 'spicy', label: t.menu.spicy },
    { key: 'vegetarian', label: t.menu.vegetarian },
    { key: 'popular', label: t.menu.popular },
  ];

  return (
    <div className="no-print mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search size={20} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-brown-500" aria-hidden="true" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder={t.menu.searchPlaceholder}
          aria-label={t.menu.searchLabel}
          className="h-13 w-full rounded-full border border-latte-200 bg-cream-50 ps-12 pe-12 text-base text-brown-900 shadow-card outline-none transition placeholder:text-brown-500/70 focus:border-brown-500 focus:ring-4 focus:ring-latte-200/60 [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => set('query', '')}
            className="absolute end-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-brown-500 hover:bg-latte-100"
            aria-label={t.menu.clearSearch}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {toggles.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filters[key]}
            onClick={() => set(key, !filters[key])}
            className={`h-11 rounded-full border px-4 text-sm font-bold transition ${
              filters[key]
                ? 'border-brown-900 bg-brown-900 text-cream-50'
                : 'border-latte-200 bg-cream-50 text-brown-700 hover:border-latte-300 hover:bg-latte-100'
            }`}
          >
            {label}
          </button>
        ))}

        <label className="relative inline-flex h-11 items-center rounded-full border border-latte-200 bg-cream-50 text-sm font-bold text-brown-700 hover:bg-latte-100">
          <ArrowUpDown size={16} className="pointer-events-none absolute start-3.5 text-brown-500" aria-hidden="true" />
          <span className="sr-only">{t.menu.sort}</span>
          <select
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value as SortOrder)}
            className="h-full cursor-pointer appearance-none rounded-full bg-transparent ps-9 pe-4 outline-none"
          >
            <option value="default">{t.menu.sortDefault}</option>
            <option value="asc">{t.menu.sortAsc}</option>
            <option value="desc">{t.menu.sortDesc}</option>
          </select>
        </label>
      </div>

      {isFiltering && (
        <p className="text-sm font-semibold text-brown-500 lg:ms-2" role="status" aria-live="polite">
          {t.menu.results(resultCount)}
        </p>
      )}
    </div>
  );
}
