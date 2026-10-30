import { AnimatePresence, m } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { site } from '../data/site.ts';
import { useCart } from '../hooks/useCart.tsx';
import { useDialog } from '../hooks/useDialog.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { useScrolled } from '../hooks/useViewport.ts';
import { whatsappLink } from '../lib/whatsapp.ts';
import { WhatsAppIcon } from './ui/icons.tsx';

export function Navbar() {
  const { t, locale, toggleLocale } = useLocale();
  const { count, setOpen: setCartOpen } = useCart();
  const scrolled = useScrolled(40);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useDialog(drawerRef, drawerOpen, () => setDrawerOpen(false));

  const links = [
    { href: '#top', label: t.nav.home },
    { href: '#menu', label: t.nav.menu },
    { href: '#popular', label: t.nav.popular },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];
  const siteName = locale === 'ar' ? site.nameAr : site.nameEn;
  // Over the dark hero the bar is transparent with light text; once scrolled it turns cream.
  const light = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,height] duration-300 ${
        scrolled ? 'h-16 bg-cream-50/85 shadow-[0_1px_0_rgb(200_162_122/0.35)] backdrop-blur-xl' : 'h-20 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6" aria-label={t.nav.menu}>
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label={siteName}>
          <img
            src="/logo-192.webp"
            alt=""
            width={48}
            height={48}
            className={`rounded-full shadow-card transition-all duration-300 ${scrolled ? 'size-10' : 'size-12'}`}
          />
          <span className={`font-display text-lg sm:text-xl ${light ? 'text-cream-50' : 'text-brown-900'}`}>{siteName}</span>
        </a>

        <ul className="ms-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors ${
                  light ? 'text-latte-100 hover:bg-cream-50/10 hover:text-cream-50' : 'text-brown-700 hover:bg-latte-100 hover:text-brown-900'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-1.5 lg:ms-2">
          <button
            type="button"
            onClick={toggleLocale}
            className={`grid size-11 place-items-center rounded-full text-sm font-bold transition-colors ${
              light ? 'text-cream-50 hover:bg-cream-50/10' : 'text-brown-700 hover:bg-latte-100'
            }`}
            aria-label={t.nav.switchLang}
            lang={locale === 'ar' ? 'en' : 'ar'}
          >
            {t.nav.switchLangShort}
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className={`relative grid size-11 place-items-center rounded-full transition-colors ${
              light ? 'text-cream-50 hover:bg-cream-50/10' : 'text-brown-700 hover:bg-latte-100'
            }`}
            aria-label={`${t.nav.cart} (${count})`}
          >
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -top-0.5 -end-0.5 grid min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-extrabold leading-5 text-brown-950">
                {count}
              </span>
            )}
          </button>
          <a
            href={whatsappLink(t.whatsapp.generic)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center gap-2 rounded-full bg-gold-500 px-5 font-bold text-brown-950 shadow-card transition hover:-translate-y-0.5 hover:bg-latte-200 sm:inline-flex"
          >
            <WhatsAppIcon size={18} />
            {t.nav.orderNow}
          </a>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={`grid size-11 place-items-center rounded-full lg:hidden ${light ? 'text-cream-50' : 'text-brown-900'}`}
            aria-label={t.nav.openMenu}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <m.div
              key="scrim"
              className="fixed inset-0 z-40 bg-brown-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <m.div
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.menu}
              tabIndex={-1}
              className="grain fixed inset-y-0 start-0 z-50 flex w-[min(20rem,85vw)] flex-col bg-brown-950 p-6 text-cream-50 shadow-lift outline-none lg:hidden"
              initial={{ x: locale === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '100%' : '-100%', transition: { duration: 0.22, ease: 'easeIn' } }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <img src="/logo-192.webp" alt={siteName} width={56} height={56} className="size-14 rounded-full" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="grid size-11 place-items-center rounded-full hover:bg-cream-50/10"
                  aria-label={t.nav.closeMenu}
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setDrawerOpen(false)}
                      className="block rounded-xl px-4 py-3 font-display text-xl text-latte-100 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(t.whatsapp.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-white"
              >
                <WhatsAppIcon size={20} />
                {t.nav.orderNow}
              </a>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
