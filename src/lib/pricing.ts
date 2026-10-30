import type { Dish, PriceOption } from '../data/menu.ts';
import type { Locale } from '../data/i18n.ts';

export interface Selection {
  sizeIndex?: number;
  extras: number[];
}

/** Lowest price a dish can be ordered at (0 = price on request). */
export function startingPrice(dish: Dish): number {
  if (!dish.sizes?.length) return dish.price;
  return Math.min(...dish.sizes.map((s) => s.price));
}

/** True when sizes have different prices, so cards should say «يبدأ من». */
export function hasPriceRange(dish: Dish): boolean {
  return !!dish.sizes && new Set(dish.sizes.map((s) => s.price)).size > 1;
}

export function selectedSize(dish: Dish, sel: Selection): PriceOption | undefined {
  return sel.sizeIndex === undefined ? undefined : dish.sizes?.[sel.sizeIndex];
}

export function selectedExtras(dish: Dish, sel: Selection): PriceOption[] {
  return sel.extras.flatMap((i) => dish.extras?.[i] ?? []);
}

export function unitPrice(dish: Dish, sel: Selection): number {
  const base = selectedSize(dish, sel)?.price ?? dish.price;
  if (base === 0) return 0;
  return base + selectedExtras(dish, sel).reduce((sum, e) => sum + e.price, 0);
}

const formatters: Record<Locale, Intl.NumberFormat> = {
  // Latin digits: that is how prices are written on menus and receipts in Gaza.
  ar: new Intl.NumberFormat('ar-PS-u-nu-latn', { maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en', { maximumFractionDigits: 2 }),
};

export function formatPrice(amount: number, locale: Locale = 'ar'): string {
  return `${formatters[locale].format(amount)} ₪`;
}
