import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { strings, type Locale, type Strings } from '../data/i18n.ts';
import type { CategoryInfo, Dish, PriceOption } from '../data/menu.ts';
import { readJson, writeJson } from '../lib/storage.ts';

interface LocaleContextValue {
  locale: Locale;
  t: Strings;
  toggleLocale: () => void;
  dishName: (d: Dish) => string;
  dishDescription: (d: Dish) => string;
  categoryName: (c: CategoryInfo) => string;
  optionLabel: (o: PriceOption) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = 'thailandi:locale';

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Arabic first (that is what the prerendered HTML contains); a saved choice applies after hydration.
  const [locale, setLocale] = useState<Locale>('ar');

  useEffect(() => {
    if (readJson<Locale>(STORAGE_KEY, 'ar') === 'en') setLocale('en');
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    writeJson(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => setLocale((l) => (l === 'ar' ? 'en' : 'ar')), []);

  const value = useMemo<LocaleContextValue>(() => {
    const en = locale === 'en';
    return {
      locale,
      t: strings[locale],
      toggleLocale,
      dishName: (d) => (en && d.nameEn) || d.nameAr,
      dishDescription: (d) => (en && d.descriptionEn) || d.descriptionAr,
      categoryName: (c) => (en ? c.nameEn : c.nameAr),
      optionLabel: (o) => (en && o.labelEn) || o.label,
    };
  }, [locale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
