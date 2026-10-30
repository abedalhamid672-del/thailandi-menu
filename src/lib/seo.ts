// Runs in Node (vite.config.ts) at build time — keep it free of browser APIs.
import { categories, dishes } from '../data/menu.ts';
import { site } from '../data/site.ts';

/** schema.org Restaurant + Menu, built from the same data the page renders. */
export function buildJsonLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.nameAr,
    alternateName: site.nameEn,
    url: site.url,
    logo: `${site.url}/logo-512.png`,
    image: `${site.url}/og-image.jpg`,
    telephone: `+${site.whatsapp}`,
    servesCuisine: ['شاورما', 'مشاوي', 'بيتزا', 'حلويات', 'Middle Eastern'],
    priceRange: '₪',
    currenciesAccepted: 'ILS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.addressAr,
      addressLocality: site.cityAr,
      addressCountry: 'PS',
    },
    hasMap: site.mapsUrl,
    ...(site.hours.length > 0 && {
      openingHoursSpecification: site.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    ...(sameAs.length > 0 && { sameAs }),
    hasMenu: {
      '@type': 'Menu',
      name: `منيو ${site.nameAr}`,
      inLanguage: 'ar',
      hasMenuSection: categories.map((c) => ({
        '@type': 'MenuSection',
        name: c.nameAr,
        hasMenuItem: dishes
          .filter((d) => d.category === c.id)
          .map((d) => ({
            '@type': 'MenuItem',
            name: d.nameAr,
            description: d.descriptionAr,
            ...(d.price > 0 && {
              offers: { '@type': 'Offer', price: d.price, priceCurrency: 'ILS' },
            }),
            ...(d.vegetarian && { suitableForDiet: 'https://schema.org/VegetarianDiet' }),
          })),
      })),
    },
  };
}
