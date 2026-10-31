/**
 * Restaurant details — every link, number and line of owner-editable copy.
 * Anything left as an empty string is hidden on the site instead of showing
 * a broken link, so fill it in when the information is confirmed.
 *
 * Source: the restaurant's current website (tailandi.company) footer, read on 2026-10-30.
 */

export interface OpeningHours {
  /** Shown to visitors, e.g. "السبت – الخميس". */
  daysAr: string;
  daysEn: string;
  /** 24h "HH:MM" — also used in the Google structured data. */
  opens: string;
  closes: string;
  /** schema.org day names for structured data. */
  schemaDays: string[];
}

export const site = {
  nameAr: 'مطعم التايلندي',
  nameEn: 'Thailandi Restaurant',
  cityAr: 'غزة',
  cityEn: 'Gaza',

  /** Public URL of the deployed site — used for canonical, Open Graph and share links. */
  url: 'https://thailandi-menu.abedalhamid672.workers.dev', // TODO: replace with the custom domain if one is connected

  /** Credit line in the footer. */
  developer: {
    name: 'Engineer Abdel Hamid Al-Khatib',
    github: 'https://github.com/abedalhamid672-del',
    /** Shown as written; the link uses `whatsapp` (digits only). */
    phoneDisplay: '+972597183082',
    whatsapp: '972597183082',
  },

  /** Local mobile number as customers dial it. */
  phone: '0592830888',
  /** International format, digits only, for wa.me links. */
  whatsapp: '972592830888',

  addressAr: 'تقاطع شارع الوحدة مع شارع الثورة، غزة',
  addressEn: 'Al-Wehda St. & Al-Thawra St. junction, Gaza',
  /** Opens Google Maps on the restaurant. Replace with the exact pin link from Google Maps → Share. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('تقاطع شارع الوحدة مع شارع الثورة غزة'),
  /** Embedded map (no API key needed). */
  mapsEmbedUrl: 'https://www.google.com/maps?q=' + encodeURIComponent('تقاطع شارع الوحدة مع شارع الثورة، غزة') + '&z=16&output=embed',

  /** TODO: owner confirms opening hours. While empty, the site asks visitors to call. */
  hours: [] as OpeningHours[],

  social: {
    // The old site's Instagram button pointed to "https://thailandi_gaza/" (a broken link);
    // this is the same handle on instagram.com — confirm it is the right account.
    instagram: 'https://www.instagram.com/thailandi_gaza/',
    facebook: '', // TODO: [FILL IN] Facebook page URL
    tiktok: '', // TODO: [FILL IN] TikTok profile URL
  },

  /** Hero trust badges — keep only claims the owner confirms. */
  heroBadgesAr: ['أكثر من {count} صنفاً', 'اطلب مباشرة عبر واتساب', 'في قلب غزة'],
  heroBadgesEn: ['{count}+ menu items', 'Order directly on WhatsApp', 'In the heart of Gaza'],

  aboutAr:
    'من تقاطع شارع الوحدة مع شارع الثورة، يقدّم مطعم التايلندي لأهل غزة الشاورما بأنواعها، أطباقاً شرقية على أصولها، مشاوي، سندويشات، بيتزا وحلويات — بالمذاق الذي تعرفونه وبعناية في كل طبق.',
  aboutEn:
    'From the junction of Al-Wehda and Al-Thawra streets, Thailandi serves Gaza every kind of shawarma, home-style eastern dishes, grills, sandwiches, pizza and desserts — the taste you know, prepared with care in every plate.',

  /**
   * About-section counters. `null` means "count it from the menu automatically",
   * so the numbers can never drift from the real menu.
   */
  stats: {
    menuItems: null as number | null,
    categories: null as number | null,
    desserts: null as number | null,
  },
} as const;
