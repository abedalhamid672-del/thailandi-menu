import { useEffect, useRef } from 'react';
import type { CategoryInfo } from '../data/menu.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { categoryIcons } from './ui/icons.tsx';

export const sectionId = (id: string) => `cat-${id}`;

interface Props {
  items: CategoryInfo[];
  active: string | null;
}

/** Horizontal chip bar that sticks under the navbar while the menu is on screen. */
export function CategoryNav({ items, active }: Props) {
  const { t, categoryName } = useLocale();
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the active chip visible by scrolling the bar only — never the page.
  useEffect(() => {
    const bar = scroller.current;
    const chip = active ? bar?.querySelector<HTMLElement>(`[data-cat="${active}"]`) : null;
    if (!bar || !chip) return;
    // Rect maths works the same in RTL and LTR (scrollLeft does not).
    const b = bar.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    bar.scrollBy({ left: c.left + c.width / 2 - (b.left + b.width / 2), behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label={t.menu.categories} className="no-print sticky top-16 z-30 -mx-4 border-y border-latte-200/70 bg-cream-50/90 backdrop-blur-xl sm:-mx-6">
      <div ref={scroller} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 [&>:first-child]:ms-auto [&>:last-child]:me-auto">
        {items.map((c) => {
          const Icon = categoryIcons[c.icon];
          const isActive = active === sectionId(c.id);
          return (
            <a
              key={c.id}
              href={`#${sectionId(c.id)}`}
              data-cat={sectionId(c.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-brown-900 text-cream-50 shadow-card'
                  : 'bg-latte-100 text-brown-700 hover:bg-latte-200 hover:text-brown-900'
              }`}
            >
              <Icon size={18} aria-hidden="true" className={isActive ? 'text-gold-500' : 'text-brown-500'} />
              {categoryName(c)}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
