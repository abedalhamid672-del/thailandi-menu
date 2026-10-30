import type { Dish } from '../data/menu.ts';

/**
 * Folds the spelling variants people actually type in Arabic so that
 * "شاورما" finds "شاورمة", "اسكالوب" finds "إسكالوب", "كريب" finds "كْريب", etc.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '') // harakat + tatweel
    .replace(/[̀-ͯ]/g, '') // Latin accents (crêpe → crepe)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

const index = new WeakMap<Dish, string>();

function haystack(dish: Dish): string {
  let text = index.get(dish);
  if (text === undefined) {
    text = normalize(
      [dish.nameAr, dish.nameEn, dish.descriptionAr, dish.descriptionEn, ...(dish.ingredients ?? []), ...(dish.sizes ?? []).map((s) => s.label)]
        .filter(Boolean)
        .join(' '),
    );
    index.set(dish, text);
  }
  return text;
}

/** Every word of the query must appear somewhere in the dish's text. */
export function matchesQuery(dish: Dish, query: string): boolean {
  const words = normalize(query).split(' ').filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(dish);
  return words.every((w) => text.includes(w));
}
