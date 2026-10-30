import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { dishes } from '../data/menu.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { DishCard } from './DishCard.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

// Best-sellers first, then house specials; six cards at most.
const featured = [...dishes.filter((d) => d.badge === 'popular'), ...dishes.filter((d) => d.badge === 'chef')].slice(0, 6);

/** Native scroll-snap carousel: swipeable on touch, arrow buttons on desktop, no JS slider library. */
export function PopularCarousel({ onOpenDish }: { onOpenDish: (id: string) => void }) {
  const { t, locale } = useLocale();
  const track = useRef<HTMLDivElement>(null);
  if (featured.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // In RTL, "next" moves toward negative scrollLeft.
    const step = el.clientWidth * 0.8 * dir * (locale === 'ar' ? -1 : 1);
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const arrow = 'grid size-12 place-items-center rounded-full border border-latte-300 bg-cream-50 text-brown-900 shadow-card transition hover:bg-brown-900 hover:text-cream-50';

  return (
    <section id="popular" aria-labelledby="popular-title" className="overflow-hidden bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="popular-title" title={t.popular.title} subtitle={t.popular.subtitle} className="md:mx-0 md:text-start [&>div]:md:justify-start" />
          <div className="no-print hidden gap-2 md:flex">
            <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label={t.popular.prev}>
              {locale === 'ar' ? <ChevronRight size={22} aria-hidden="true" /> : <ChevronLeft size={22} aria-hidden="true" />}
            </button>
            <button type="button" className={arrow} onClick={() => scroll(1)} aria-label={t.popular.next}>
              {locale === 'ar' ? <ChevronLeft size={22} aria-hidden="true" /> : <ChevronRight size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          ref={track}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-6 pt-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
        >
          {featured.map((dish) => (
            <div key={dish.id} className="flex w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[31%] xl:w-[23.5%]">
              <DishCard dish={dish} onOpen={onOpenDish} sizes="(min-width: 1024px) 30vw, 80vw" className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
