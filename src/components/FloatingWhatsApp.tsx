import { useCart } from '../hooks/useCart.tsx';
import { useLocale } from '../hooks/useLocale.tsx';
import { whatsappLink } from '../lib/whatsapp.ts';
import { WhatsAppIcon } from './ui/icons.tsx';

/** Bottom-left in RTL (logical "end"). On phones the cart bar replaces it once the cart has items. */
export function FloatingWhatsApp() {
  const { t } = useLocale();
  const { count } = useCart();

  return (
    <a
      href={whatsappLink(t.whatsapp.generic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.floating}
      className={`no-print group fixed bottom-5 end-4 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:end-6 ${
        count > 0 ? 'max-md:hidden' : ''
      }`}
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-whatsapp" aria-hidden="true" />
      <WhatsAppIcon size={28} className="relative" />
      <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-full bg-brown-950 px-3 py-1.5 text-sm font-semibold text-cream-50 opacity-0 shadow-card transition-opacity group-hover:opacity-100 md:block">
        {t.whatsapp.floating}
      </span>
    </a>
  );
}
