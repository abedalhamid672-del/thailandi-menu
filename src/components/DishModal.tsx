import { AnimatePresence, domMax, LazyMotion, m, useDragControls, type PanInfo } from 'framer-motion';
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock, Flame as FlameIcon, Minus, Plus, Share2, ShoppingBag, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { categoryById, dishById, dishes, type Dish } from '../data/menu.ts';
import { site } from '../data/site.ts';
import { useCart } from '../hooks/useCart.tsx';
import { useDialog } from '../hooks/useDialog.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { useMediaQuery } from '../hooks/useViewport.ts';
import { formatPrice, unitPrice, type Selection } from '../lib/pricing.ts';
import { buildOrderMessage, whatsappLink } from '../lib/whatsapp.ts';
import { DishImage } from './ui/DishImage.tsx';
import { DishBadges, SpiceLevel } from './ui/DishMeta.tsx';
import { WhatsAppIcon } from './ui/icons.tsx';

interface Props {
  dishId: string;
  /** Order used for previous/next — the dishes currently visible in the menu. */
  navIds: string[];
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const SIZE_WORDS = /صغير|وسط|كبير|عادي|دبل/;
const MAX_QTY = 50;

function defaultSelection(dish: Dish): Selection {
  return { sizeIndex: dish.sizes?.length ? 0 : undefined, extras: [] };
}

function relatedDishes(dish: Dish): Dish[] {
  const same = dishes.filter((d) => d.category === dish.category && d.id !== dish.id);
  const pool = same.length >= 3 ? same : [...same, ...dishes.filter((d) => d.badge && d.id !== dish.id && d.category !== dish.category)];
  // Stable but varied: start after the current dish so neighbours differ per dish.
  const start = Math.max(0, same.findIndex((d) => d.id > dish.id));
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);
}

export default function DishModal({ dishId, navIds, onNavigate, onClose }: Props) {
  const dish = dishById.get(dishId);
  const { t, locale, dishName, dishDescription, categoryName, optionLabel } = useLocale();
  const cart = useCart();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const [selection, setSelection] = useState<Selection>(() => (dish ? defaultSelection(dish) : { extras: [] }));
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  useDialog(panelRef, true, onClose);

  // Reset choices when moving to another dish, and scroll its content back to the top.
  useEffect(() => {
    if (!dish) return;
    setSelection(defaultSelection(dish));
    setQty(1);
    panelRef.current?.querySelector('[data-scroll]')?.scrollTo({ top: 0 });
  }, [dish]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const order = navIds.includes(dishId) ? navIds : dishes.map((d) => d.id);
  const index = order.indexOf(dishId);
  const prevId = index > 0 ? order[index - 1] : undefined;
  const nextId = index < order.length - 1 ? order[index + 1] : undefined;

  // Arrow keys step through dishes (direction follows reading order).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const forward = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight';
      const back = locale === 'ar' ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === forward && nextId) onNavigate(nextId);
      if (e.key === back && prevId) onNavigate(prevId);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [locale, nextId, prevId, onNavigate]);

  const related = useMemo(() => (dish ? relatedDishes(dish) : []), [dish]);
  if (!dish) return null;

  const name = dishName(dish);
  const category = categoryById.get(dish.category);
  const unit = unitPrice(dish, selection);
  const total = unit * qty;
  const sizesAreSizes = dish.sizes?.every((s) => SIZE_WORDS.test(s.label));
  const isDemoPhoto = !dish.image;
  const orderLink = whatsappLink(buildOrderMessage([{ dish, qty, ...selection }]));

  const toggleExtra = (i: number) =>
    setSelection((s) => ({ ...s, extras: s.extras.includes(i) ? s.extras.filter((x) => x !== i) : [...s.extras, i] }));

  const addToCart = () => {
    cart.add(dish.id, selection, qty);
    setToast(t.dish.added);
  };

  const share = async () => {
    const url = `${site.url}/?dish=${dish.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: dishDescription(dish), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t.dish.copied);
    } catch {
      // Share sheet dismissed — nothing to do.
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  const PrevIcon = locale === 'ar' ? ChevronRight : ChevronLeft;
  const NextIcon = locale === 'ar' ? ChevronLeft : ChevronRight;
  const iconBtn = 'grid size-11 place-items-center rounded-full bg-cream-50/90 text-brown-900 shadow-card backdrop-blur transition hover:bg-cream-50 disabled:opacity-40';

  return (
    // Drag (bottom sheet) needs the larger feature set; it loads with this lazy chunk only.
    <LazyMotion features={domMax}>
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
        <m.div
          className="absolute inset-0 bg-brown-950/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          onClick={onClose}
        />

        <m.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="relative flex max-h-[94svh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-cream-50 shadow-lift outline-none md:max-h-[88vh] md:max-w-5xl md:flex-row md:rounded-3xl"
          initial={isDesktop ? { opacity: 0, scale: 0.94, y: 20 } : { y: '100%' }}
          animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
          exit={isDesktop ? { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18 } } : { y: '100%', transition: { duration: 0.25, ease: 'easeIn' } }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          drag={isDesktop ? false : 'y'}
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.7 }}
          onDragEnd={onDragEnd}
        >
          {/* Image column (left on desktop in RTL). Drag handle area on mobile. */}
          <div
            className="group relative shrink-0 touch-none md:order-2 md:w-[46%] md:touch-auto"
            onPointerDown={(e) => !isDesktop && dragControls.start(e)}
          >
            <div className="absolute inset-x-0 top-2 z-10 flex justify-center md:hidden" aria-hidden="true">
              <span className="h-1.5 w-12 rounded-full bg-cream-50/80 shadow" title={t.dish.dragHint} />
            </div>
            <DishImage
              key={dish.id}
              dish={dish}
              alt={name}
              sizes="(min-width: 768px) 46vw, 100vw"
              widths={[480, 800, 1200]}
              priority
              className="aspect-[16/10] md:aspect-auto md:h-full"
              imgClassName="transition-transform duration-700 ease-out md:group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brown-950/40 via-transparent to-brown-950/30" />
            {isDemoPhoto && (
              <span className="absolute bottom-3 end-3 rounded-full bg-brown-950/60 px-2.5 py-1 text-[11px] font-semibold text-latte-100 backdrop-blur">
                {t.dish.demoPhoto}
              </span>
            )}
            <div className="absolute inset-x-3 top-5 flex items-center justify-between md:top-4">
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className={iconBtn} aria-label={t.dish.close}>
                  <X size={20} aria-hidden="true" />
                </button>
                <button type="button" onClick={share} className={iconBtn} aria-label={t.dish.share}>
                  <Share2 size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => prevId && onNavigate(prevId)} disabled={!prevId} className={iconBtn} aria-label={t.dish.prev}>
                  <PrevIcon size={20} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => nextId && onNavigate(nextId)} disabled={!nextId} className={iconBtn} aria-label={t.dish.next}>
                  <NextIcon size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Details column */}
          <div className="flex min-h-0 flex-1 flex-col md:order-1">
            <div data-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-8 sm:pt-8">
              <p className="text-sm font-bold text-brown-500">{category ? categoryName(category) : ''}</p>
              <h2 id={titleId} className="mt-1 font-display text-3xl text-brown-900 sm:text-4xl">
                {name}
              </h2>
              <DishBadges dish={dish} className="mt-3 [&>span]:bg-latte-100" />
              <p className="mt-4 text-base leading-loose text-brown-700 sm:text-lg">{dishDescription(dish)}</p>

              <p className="mt-4 text-3xl font-extrabold text-brown-900">
                {unit > 0 ? formatPrice(unit, locale) : <span className="text-xl text-brown-500">{t.dish.priceOnRequest}</span>}
              </p>

              {dish.sizes && dish.sizes.length > 1 && (
                <fieldset className="mt-6">
                  <legend className="mb-2.5 text-sm font-bold text-brown-900">{sizesAreSizes ? t.dish.size : t.dish.variant}</legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {dish.sizes.map((s, i) => {
                      const checked = selection.sizeIndex === i;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          onClick={() => setSelection((sel) => ({ ...sel, sizeIndex: i }))}
                          className={`flex min-h-12 flex-col items-center justify-center rounded-xl border-2 px-4 py-1.5 text-sm font-bold transition ${
                            checked ? 'border-brown-900 bg-brown-900 text-cream-50' : 'border-latte-200 bg-cream-50 text-brown-700 hover:border-latte-300'
                          }`}
                        >
                          {optionLabel(s)}
                          {s.price > 0 && <span className={`text-xs font-semibold ${checked ? 'text-latte-200' : 'text-brown-500'}`}>{formatPrice(s.price, locale)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {dish.extras && dish.extras.length > 0 && (
                <fieldset className="mt-6">
                  <legend className="mb-2.5 text-sm font-bold text-brown-900">{t.dish.extras}</legend>
                  <div className="flex flex-wrap gap-2">
                    {dish.extras.map((ex, i) => {
                      const on = selection.extras.includes(i);
                      return (
                        <label
                          key={ex.label}
                          className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-500 ${
                            on ? 'border-brown-700 bg-latte-100 text-brown-900' : 'border-latte-200 text-brown-700 hover:bg-latte-100/60'
                          }`}
                        >
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleExtra(i)} />
                          <span className={`grid size-5 place-items-center rounded-md border ${on ? 'border-brown-900 bg-brown-900 text-cream-50' : 'border-latte-300'}`}>
                            {on && <Check size={14} aria-hidden="true" />}
                          </span>
                          {optionLabel(ex)}
                          {ex.price > 0 && <span className="text-brown-500">+{formatPrice(ex.price, locale)}</span>}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {(!!dish.spiceLevel || dish.prepTimeMin || dish.calories) && (
                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {!!dish.spiceLevel && (
                    <div className="rounded-xl bg-latte-100/70 p-3">
                      <dt className="flex items-center gap-1 text-xs font-bold text-brown-500">
                        <FlameIcon size={14} aria-hidden="true" />
                        {t.dish.spice}
                      </dt>
                      <dd className="mt-1">
                        <SpiceLevel level={dish.spiceLevel} />
                      </dd>
                    </div>
                  )}
                  {dish.prepTimeMin && (
                    <div className="rounded-xl bg-latte-100/70 p-3">
                      <dt className="flex items-center gap-1 text-xs font-bold text-brown-500">
                        <Clock size={14} aria-hidden="true" />
                        {t.dish.prepTime}
                      </dt>
                      <dd className="mt-1 font-bold text-brown-900">{t.dish.minutes(dish.prepTimeMin)}</dd>
                    </div>
                  )}
                  {dish.calories && (
                    <div className="rounded-xl bg-latte-100/70 p-3">
                      <dt className="text-xs font-bold text-brown-500">{t.dish.calories}</dt>
                      <dd className="mt-1 font-bold text-brown-900">{dish.calories}</dd>
                    </div>
                  )}
                </dl>
              )}

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2.5 text-sm font-bold text-brown-900">{t.dish.ingredients}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ing) => (
                      <li key={ing} className="rounded-full bg-latte-100 px-3 py-1.5 text-sm font-semibold text-brown-700">
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dish.allergensAr && (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-gold-500/10 p-3 text-sm font-semibold text-brown-700">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span>
                    {t.dish.allergens}: {dish.allergensAr}
                  </span>
                </p>
              )}

              {related.length > 0 && (
                <div className="mt-8 border-t border-latte-200 pt-6">
                  <h3 className="font-display text-xl text-brown-900">{t.dish.related}</h3>
                  <ul className="mt-3 grid grid-cols-3 gap-3">
                    {related.map((r) => (
                      <li key={r.id}>
                        <button type="button" onClick={() => onNavigate(r.id)} className="group/rel w-full text-start">
                          <DishImage dish={r} alt="" sizes="160px" widths={[200, 320]} className="aspect-square rounded-xl" imgClassName="transition-transform duration-500 group-hover/rel:scale-[1.06]" />
                          <span className="mt-1.5 line-clamp-2 block text-sm font-bold leading-snug text-brown-900">{dishName(r)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Order bar stays visible while the details scroll. */}
            <div className="border-t border-latte-200 bg-cream-50 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center rounded-full border border-latte-200" role="group" aria-label={t.dish.quantity}>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="grid size-11 place-items-center rounded-full text-brown-900 hover:bg-latte-100 disabled:opacity-40"
                    aria-label={t.dish.decrease}
                  >
                    <Minus size={18} aria-hidden="true" />
                  </button>
                  <span className="w-8 text-center text-lg font-extrabold tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                    className="grid size-11 place-items-center rounded-full text-brown-900 hover:bg-latte-100"
                    aria-label={t.dish.increase}
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-end">
                  <span className="block text-xs font-bold text-brown-500">{t.dish.total}</span>
                  <span className="text-xl font-extrabold text-brown-900">{total > 0 ? formatPrice(total, locale) : t.dish.priceOnRequest}</span>
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brown-900 font-bold text-cream-50 transition hover:bg-brown-700"
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  {t.dish.addToCart}
                </button>
                <a
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-white transition hover:brightness-110"
                >
                  <WhatsAppIcon size={20} />
                  {t.dish.orderWhatsapp}
                </a>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {toast && (
              <m.p
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="pointer-events-none absolute inset-x-0 bottom-36 z-20 mx-auto w-fit rounded-full bg-brown-950 px-5 py-2.5 text-sm font-bold text-cream-50 shadow-lift"
              >
                <Check size={16} className="me-1.5 inline text-gold-500" aria-hidden="true" />
                {toast}
              </m.p>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </LazyMotion>
  );
}
