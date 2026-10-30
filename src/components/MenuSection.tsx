import { Clock, SearchX } from 'lucide-react';
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { categories, dishes, type Dish } from '../data/menu.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { useScrollSpy } from '../hooks/useViewport.ts';
import { startingPrice } from '../lib/pricing.ts';
import { matchesQuery } from '../lib/search.ts';
import { CategoryNav, sectionId } from './CategoryNav.tsx';
import { DishCard } from './DishCard.tsx';
import { emptyFilters, MenuToolbar, type MenuFilters } from './MenuToolbar.tsx';
import { categoryIcons } from './ui/icons.tsx';
import { Ornament } from './ui/Ornament.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

interface Props {
  filters: MenuFilters;
  onFiltersChange: (f: MenuFilters) => void;
  onOpenDish: (id: string) => void;
  /** Reports the visible dish order so the modal's next/previous follows what the visitor sees. */
  onVisibleChange: (ids: string[]) => void;
}

const INITIAL_SECTIONS = 2;

/** Row counts per breakpoint, so off-screen sections reserve roughly their real height (see .menu-section). */
function rowVars(count: number): CSSProperties {
  return {
    '--rows-1': count,
    '--rows-2': Math.ceil(count / 2),
    '--rows-3': Math.ceil(count / 3),
    '--rows-4': Math.ceil(count / 4),
  } as CSSProperties;
}

function applyFilters(list: Dish[], f: MenuFilters): Dish[] {
  const out = list.filter(
    (d) =>
      (!f.spicy || (d.spiceLevel ?? 0) > 0) &&
      (!f.vegetarian || d.vegetarian) &&
      (!f.popular || d.badge === 'popular' || d.badge === 'chef') &&
      matchesQuery(d, f.query),
  );
  if (f.sort === 'default') return out;
  // Price-on-request items go last in both directions.
  const key = (d: Dish) => startingPrice(d) || (f.sort === 'asc' ? Infinity : -Infinity);
  return [...out].sort((a, b) => (f.sort === 'asc' ? key(a) - key(b) : key(b) - key(a)));
}

export function MenuSection({ filters, onFiltersChange, onOpenDish, onVisibleChange }: Props) {
  const { t, locale, categoryName } = useLocale();
  // Typing stays instant; the grid re-renders at lower priority.
  const deferred = useDeferredValue(filters);
  const filtered = useMemo(() => applyFilters(dishes, deferred), [deferred]);

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, items: filtered.filter((d) => d.category === c.id) }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  // The first sections render with the page; the rest follow in a transition, which React
  // renders in small time slices — so ~80 cards never block the main thread in one long task.
  const [showAll, setShowAll] = useState(false);
  const pendingHash = useRef<string | null>(null);
  useEffect(() => {
    // A link straight to a later section (#cat-desserts) can't wait: render it all, then jump.
    if (window.location.hash.startsWith('#cat-')) {
      pendingHash.current = window.location.hash.slice(1);
      setShowAll(true);
      return;
    }
    const id = window.setTimeout(() => startTransition(() => setShowAll(true)), 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!showAll || !pendingHash.current) return;
    document.getElementById(pendingHash.current)?.scrollIntoView();
    pendingHash.current = null;
  }, [showAll]);
  const rendered = showAll ? groups : groups.slice(0, INITIAL_SECTIONS);

  useEffect(() => {
    onVisibleChange(groups.flatMap((g) => g.items.map((d) => d.id)));
  }, [groups, onVisibleChange]);

  const active = useScrollSpy(
    rendered.map((g) => sectionId(g.category.id)),
    150,
  );

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-latte-100/60 pb-20 pt-20 sm:pb-28 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="menu-title" title={t.menu.title} subtitle={t.menu.subtitle} className="mb-10" />

        <CategoryNav items={groups.map((g) => g.category)} active={active} />
        <MenuToolbar filters={filters} onChange={onFiltersChange} resultCount={filtered.length} />

        {groups.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-latte-300 bg-cream-50 p-10 text-center">
            <SearchX size={44} className="mx-auto text-latte-300" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl text-brown-900">{t.menu.emptyTitle}</h3>
            <p className="mt-2 text-brown-700">{t.menu.emptyBody}</p>
            <button
              type="button"
              onClick={() => onFiltersChange(emptyFilters)}
              className="mt-6 h-11 rounded-full bg-brown-900 px-6 font-bold text-cream-50 transition hover:bg-brown-700"
            >
              {t.menu.resetFilters}
            </button>
          </div>
        ) : (
          rendered.map(({ category, items }) => {
            const Icon = categoryIcons[category.icon];
            const note = locale === 'ar' ? category.noteAr : category.noteEn;
            return (
              <section
                key={category.id}
                id={sectionId(category.id)}
                aria-labelledby={`${sectionId(category.id)}-title`}
                className="menu-section pb-4 pt-10"
                style={rowVars(items.length)}
              >
                <div className="mb-7 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brown-900 text-gold-500 shadow-card">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 id={`${sectionId(category.id)}-title`} className="font-display text-2xl text-brown-900 sm:text-3xl">
                        {categoryName(category)}
                      </h3>
                      <p className="text-sm font-semibold text-brown-500">{t.menu.items(items.length)}</p>
                    </div>
                  </div>
                  <Ornament className="hidden sm:flex" />
                </div>
                {note && (
                  <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-brown-700 ring-1 ring-latte-200">
                    <Clock size={16} className="shrink-0 text-gold-500" aria-hidden="true" />
                    {note}
                  </p>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((dish) => (
                    <DishCard key={dish.id} dish={dish} onOpen={onOpenDish} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </section>
  );
}
