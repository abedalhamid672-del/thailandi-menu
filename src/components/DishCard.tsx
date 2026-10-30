import { ArrowLeft, ArrowRight } from 'lucide-react';
import { memo } from 'react';
import type { Dish } from '../data/menu.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { buildOrderMessage, whatsappLink } from '../lib/whatsapp.ts';
import { DishImage } from './ui/DishImage.tsx';
import { DishBadges, Price } from './ui/DishMeta.tsx';
import { WhatsAppIcon } from './ui/icons.tsx';

interface Props {
  dish: Dish;
  onOpen: (id: string) => void;
  sizes?: string;
  className?: string;
}

export const DishCard = memo(function DishCard({ dish, onOpen, sizes, className = '' }: Props) {
  const { t, locale, dishName, dishDescription } = useLocale();
  const name = dishName(dish);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const quickOrder = whatsappLink(buildOrderMessage([{ dish, qty: 1, sizeIndex: dish.sizes ? 0 : undefined, extras: [] }]));

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-card ring-1 ring-latte-200/70 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift ${className}`}
    >
      <div className="relative">
        <DishImage
          dish={dish}
          alt={name}
          sizes={sizes ?? '(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw'}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <DishBadges dish={dish} className="absolute start-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-brown-900">
            {/* Stretched button: the whole card opens the details, other controls sit above it. */}
            <button
              type="button"
              onClick={() => onOpen(dish.id)}
              className="text-start after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-gold-500"
            >
              {name}
            </button>
          </h3>
          <Price dish={dish} className="pt-0.5" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brown-700/90">{dishDescription(dish)}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brown-500 transition-colors group-hover:text-brown-900">
            {t.dish.details}
            <Arrow size={16} aria-hidden="true" className="transition-transform ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </span>
          <a
            href={quickOrder}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 grid size-11 place-items-center rounded-full bg-whatsapp/10 text-whatsapp transition hover:bg-whatsapp hover:text-white"
            aria-label={`${t.dish.orderWhatsapp}: ${name}`}
          >
            <WhatsAppIcon size={20} />
          </a>
        </div>
      </div>
    </article>
  );
});
