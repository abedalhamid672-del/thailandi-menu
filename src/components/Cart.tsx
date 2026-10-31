import { AnimatePresence, m } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCart } from '../hooks/useCart.tsx';
import { useDialog } from '../hooks/useDialog.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { formatPrice, selectedExtras, selectedSize, unitPrice } from '../lib/pricing.ts';
import { readJson, writeJson } from '../lib/storage.ts';
import { buildOrderMessage, whatsappLink } from '../lib/whatsapp.ts';
import { DishImage } from './ui/DishImage.tsx';
import { WhatsAppIcon } from './ui/icons.tsx';

const DETAILS_KEY = 'thailandi:order-details';
const MAX_NAME = 60;
const MAX_NOTES = 400; // keeps the wa.me link well under browser URL limits

/** Stored values are user-editable: keep only strings, trimmed to the field limits. */
function loadDetails(): { name: string; notes: string } {
  const raw = readJson<Record<string, unknown>>(DETAILS_KEY, {});
  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  return { name: text(raw?.name, MAX_NAME), notes: text(raw?.notes, MAX_NOTES) };
}

/** Sticky bottom bar on phones: item count, running total and a one-tap send. */
export function CartBar() {
  const { t, locale } = useLocale();
  const { count, total, setOpen } = useCart();

  return (
    <AnimatePresence>
      {count > 0 && (
        <m.div
          initial={{ y: '120%' }}
          animate={{ y: 0 }}
          exit={{ y: '120%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="no-print fixed inset-x-3 bottom-3 z-30 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-16 w-full items-center gap-3 rounded-2xl bg-brown-950 px-4 text-start text-cream-50 shadow-lift ring-1 ring-latte-300/30"
          >
            <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-brown-700">
              <ShoppingBag size={20} aria-hidden="true" />
              <span className="absolute -end-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-extrabold leading-5 text-brown-950">
                {count}
              </span>
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-xs font-semibold text-latte-200">
                {t.cart.title} · {t.cart.items(count)}
              </span>
              <span className="block text-lg font-extrabold">{total > 0 ? formatPrice(total, locale) : t.dish.priceOnRequest}</span>
            </span>
            <span className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-whatsapp px-3.5 text-sm font-bold text-white">
              <WhatsAppIcon size={18} />
              {t.cart.send}
            </span>
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function CartPanel() {
  const { t, locale, dishName, optionLabel } = useLocale();
  const { lines, total, setQty, remove, clear, setOpen } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [details, setDetails] = useState(loadDetails);
  useDialog(panelRef, true, () => setOpen(false));

  const updateDetails = (patch: Partial<typeof details>) => {
    const next = { ...details, ...patch };
    setDetails(next);
    writeJson(DETAILS_KEY, next);
  };

  const hasUnpriced = lines.some((l) => unitPrice(l.dish, l) === 0);
  const message = buildOrderMessage(lines, details);

  return (
    <div className="fixed inset-0 z-50">
      <m.div
        className="absolute inset-0 bg-brown-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        tabIndex={-1}
        className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream-50 shadow-lift outline-none"
        initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: locale === 'ar' ? '-100%' : '100%', transition: { duration: 0.22, ease: 'easeIn' } }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
      >
        <div className="flex items-center justify-between border-b border-latte-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-2xl text-brown-900">
            <ShoppingBag size={22} className="text-brown-500" aria-hidden="true" />
            {t.cart.title}
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-latte-100" aria-label={t.cart.close}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid size-20 place-items-center rounded-full bg-latte-100 text-latte-300">
              <ShoppingBag size={36} aria-hidden="true" />
            </span>
            <p className="max-w-60 text-brown-700">{t.cart.empty}</p>
            <a href="#menu" onClick={() => setOpen(false)} className="inline-flex h-11 items-center rounded-full bg-brown-900 px-6 font-bold text-cream-50">
              {t.hero.browse}
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-latte-200 overflow-y-auto overscroll-contain px-5">
              {lines.map((line) => {
                const size = selectedSize(line.dish, line);
                const extras = selectedExtras(line.dish, line);
                const unit = unitPrice(line.dish, line);
                return (
                  <li key={line.key} className="flex gap-3 py-4">
                    <DishImage dish={line.dish} alt="" sizes="72px" widths={[150, 220]} className="size-18 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold leading-snug text-brown-900">
                          {dishName(line.dish)}
                          {size && <span className="font-semibold text-brown-500"> · {optionLabel(size)}</span>}
                        </p>
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-brown-500 hover:bg-latte-100 hover:text-chili"
                          aria-label={`${t.cart.remove}: ${dishName(line.dish)}`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                      {extras.length > 0 && <p className="text-xs text-brown-500">{extras.map(optionLabel).join('، ')}</p>}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-latte-200">
                          <button type="button" onClick={() => setQty(line.key, line.qty - 1)} className="grid size-11 place-items-center rounded-full hover:bg-latte-100" aria-label={t.dish.decrease}>
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-extrabold tabular-nums">{line.qty}</span>
                          <button type="button" onClick={() => setQty(line.key, line.qty + 1)} className="grid size-11 place-items-center rounded-full hover:bg-latte-100" aria-label={t.dish.increase}>
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-extrabold text-brown-900">{unit > 0 ? formatPrice(unit * line.qty, locale) : t.dish.priceOnRequest}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-latte-200 bg-latte-100/50 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-brown-700">{t.cart.nameLabel}</span>
                <input
                  value={details.name}
                  onChange={(e) => updateDetails({ name: e.target.value })}
                  autoComplete="name"
                  maxLength={MAX_NAME}
                  className="h-11 w-full rounded-xl border border-latte-200 bg-cream-50 px-3 outline-none focus:border-brown-500 focus:ring-2 focus:ring-latte-200"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-brown-700">{t.cart.notesLabel}</span>
                <textarea
                  value={details.notes}
                  onChange={(e) => updateDetails({ notes: e.target.value })}
                  rows={2}
                  maxLength={MAX_NOTES}
                  className="w-full resize-none rounded-xl border border-latte-200 bg-cream-50 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-latte-200"
                />
              </label>
              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={clear} className="min-h-11 text-sm font-bold text-brown-500 underline-offset-4 hover:text-chili hover:underline">
                  {t.cart.clear}
                </button>
                <p className="text-end">
                  <span className="block text-xs font-bold text-brown-500">{t.cart.total}</span>
                  <span className="text-2xl font-extrabold text-brown-900">{formatPrice(total, locale)}</span>
                </p>
              </div>
              {hasUnpriced && <p className="text-xs font-semibold text-brown-500">{t.cart.unpricedNote}</p>}
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-whatsapp text-lg font-bold text-white shadow-lift transition hover:brightness-110"
              >
                <WhatsAppIcon size={22} />
                {t.cart.sendFull}
              </a>
            </div>
          </>
        )}
      </m.div>
    </div>
  );
}

export function CartDrawer() {
  const { isOpen } = useCart();
  return <AnimatePresence>{isOpen && <CartPanel />}</AnimatePresence>;
}
