import { m } from 'framer-motion';
import { ChevronDown, MapPin, Sparkles, UtensilsCrossed } from 'lucide-react';
import { dishes } from '../data/menu.ts';
import { site } from '../data/site.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { heroDishImage, heroImage } from '../lib/images.ts';
import { whatsappLink } from '../lib/whatsapp.ts';
import { WhatsAppIcon } from './ui/icons.tsx';

const badgeIcons = [UtensilsCrossed, Sparkles, MapPin];
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, locale } = useLocale();
  // Rounded down to a tidy number so "+70" stays true as items are added or removed.
  const count = Math.floor(dishes.length / 10) * 10;
  const badges = (locale === 'ar' ? site.heroBadgesAr : site.heroBadgesEn).map((b) => b.replace('{count}', String(count)));

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brown-950 pb-16 pt-28">
      <img
        src={heroImage(1280)}
        srcSet={`${heroImage(640)} 640w, ${heroImage(1280)} 1280w, ${heroImage(1920)} 1920w`}
        sizes="100vw"
        alt=""
        width={1600}
        height={1067}
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover opacity-55"
      />
      {/* Espresso gradient keeps text readable on any photo; heavier on the text side. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-brown-950 via-brown-950/85 to-brown-900/40 ltr:bg-gradient-to-r" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brown-950 via-transparent to-brown-950/50" />
      <div className="grain absolute inset-0 -z-10 opacity-70" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="text-center lg:text-start">
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-latte-300/40 bg-brown-950/40 px-4 py-1.5 text-sm font-semibold text-latte-200 backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-gold-500" aria-hidden="true" />
            {t.hero.eyebrow}
          </m.p>

          <m.h1
            // No fade on the headline or subtitle: they are the LCP text and must paint on the first frame.
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="font-display text-[2.6rem] leading-[1.25] text-cream-50 sm:text-6xl lg:text-7xl"
          >
            {t.hero.titleA}
            <span className="block text-gold-500">{t.hero.titleB}</span>
          </m.h1>

          <m.p
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-xl text-lg text-latte-100/90 sm:text-xl lg:mx-0"
          >
            {t.hero.subtitle}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <a
              href="#menu"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-latte-200 px-8 text-lg font-bold text-brown-950 shadow-lift transition hover:-translate-y-0.5 hover:bg-cream-50"
            >
              {t.hero.browse}
              <ChevronDown size={20} aria-hidden="true" />
            </a>
            <a
              href={whatsappLink(t.whatsapp.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-latte-300/50 bg-cream-50/5 px-8 text-lg font-bold text-cream-50 backdrop-blur transition hover:-translate-y-0.5 hover:border-whatsapp hover:bg-whatsapp"
            >
              <WhatsAppIcon size={22} />
              {t.hero.whatsapp}
            </a>
          </m.div>

          <m.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-latte-200 lg:justify-start"
          >
            {badges.map((b, i) => {
              const Icon = badgeIcons[i % badgeIcons.length]!;
              return (
                <li key={b} className="inline-flex items-center gap-2">
                  <Icon size={16} className="text-gold-500" aria-hidden="true" />
                  {b}
                </li>
              );
            })}
          </m.ul>
        </div>

        {/* Floating dish: decorative on mobile (hidden), the visual anchor on desktop. */}
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
        >
          <div className="absolute inset-0 rounded-full border border-latte-300/30" />
          <div className="absolute inset-6 rounded-full border border-dashed border-latte-300/25" />
          <div className="animate-float absolute inset-12 overflow-hidden rounded-full shadow-[0_40px_80px_-20px_rgb(0_0_0/0.7)] ring-8 ring-brown-900/60">
            <img
              src={heroDishImage(640)}
              loading="lazy"
              alt={t.hero.dishAlt}
              width={800}
              height={640}
              className="size-full object-cover"
            />
          </div>
          <img
            src="/logo-192.webp"
            alt=""
            width={112}
            height={112}
            className="absolute bottom-6 start-2 size-28 rounded-full shadow-lift ring-4 ring-brown-950"
          />
        </m.div>
      </div>
    </section>
  );
}
