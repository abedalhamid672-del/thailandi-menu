import { ChefHat, Flame, Leaf, Star } from 'lucide-react';
import type { Dish } from '../../data/menu.ts';
import { useLocale } from '../../hooks/useLocale.tsx';
import { formatPrice, hasPriceRange, startingPrice } from '../../lib/pricing.ts';

export function Price({ dish, className = '' }: { dish: Dish; className?: string }) {
  const { t, locale } = useLocale();
  const price = startingPrice(dish);
  if (price === 0) return <span className={`text-sm font-semibold text-brown-500 ${className}`}>{t.dish.priceOnRequest}</span>;
  return (
    <span className={`whitespace-nowrap ${className}`}>
      {hasPriceRange(dish) && <span className="me-1 text-xs font-medium text-brown-500">{t.dish.from}</span>}
      <span className="text-lg font-extrabold text-brown-900">{formatPrice(price, locale)}</span>
    </span>
  );
}

export function SpiceLevel({ level, className = '' }: { level: number; className?: string }) {
  const { t } = useLocale();
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${t.dish.spice}: ${level}/3`}>
      {[1, 2, 3].map((n) => (
        <Flame key={n} size={16} aria-hidden="true" className={n <= level ? 'fill-chili/20 text-chili' : 'text-latte-200'} />
      ))}
    </span>
  );
}

const pill = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none';

export function DishBadges({ dish, className = '' }: { dish: Dish; className?: string }) {
  const { t } = useLocale();
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {dish.badge === 'popular' && (
        <span className={`${pill} bg-gold-500 text-brown-950`}>
          <Star size={12} className="fill-current" aria-hidden="true" />
          {t.dish.badge.popular}
        </span>
      )}
      {dish.badge === 'chef' && (
        <span className={`${pill} bg-brown-900 text-latte-100`}>
          <ChefHat size={12} aria-hidden="true" />
          {t.dish.badge.chef}
        </span>
      )}
      {dish.badge === 'new' && <span className={`${pill} bg-brown-700 text-cream-50`}>{t.dish.badge.new}</span>}
      {!!dish.spiceLevel && dish.spiceLevel >= 2 && (
        <span className={`${pill} bg-cream-50/95 text-chili`}>
          <Flame size={12} aria-hidden="true" />
          {t.dish.spicyBadge}
        </span>
      )}
      {dish.vegetarian && ['shawarma', 'eastern', 'grills', 'sandwiches', 'pizza'].includes(dish.category) && (
        <span className={`${pill} bg-cream-50/95 text-brown-700`}>
          <Leaf size={12} aria-hidden="true" />
          {t.dish.vegetarianBadge}
        </span>
      )}
    </div>
  );
}
