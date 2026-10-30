import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { About } from './components/About.tsx';
import { CartBar, CartDrawer } from './components/Cart.tsx';
import { Contact } from './components/Contact.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { Footer } from './components/Footer.tsx';
import { Hero } from './components/Hero.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { emptyFilters, type MenuFilters } from './components/MenuToolbar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { NotFound } from './components/NotFound.tsx';
import { PopularCarousel } from './components/PopularCarousel.tsx';
import { Reviews } from './components/Reviews.tsx';
import { dishById } from './data/menu.ts';
import { useLocale } from './hooks/useLocale.tsx';

// The modal is only needed after a tap, so it is split into its own chunk.
const DishModal = lazy(() => import('./components/DishModal.tsx'));

function dishFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const id = new URLSearchParams(window.location.search).get('dish');
  return id && dishById.has(id) ? id : null;
}

function urlWithDish(id: string | null): string {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('dish', id);
  else url.searchParams.delete('dish');
  return url.pathname + url.search + url.hash;
}

/** The page is prerendered as the home page; any other path shows the 404 (see main.tsx). */
export function isHomePath(): boolean {
  return typeof window === 'undefined' || ['/', '/index.html'].includes(window.location.pathname);
}

export default function App() {
  const { t } = useLocale();
  // Starts closed to match the prerendered HTML; a ?dish= link opens it right after hydration.
  const [openId, setOpenIdState] = useState<string | null>(null);
  const openRef = useRef(openId);
  const [filters, setFilters] = useState<MenuFilters>(emptyFilters);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  const setOpenId = (id: string | null) => {
    openRef.current = id;
    setOpenIdState(id);
  };

  // ?dish=<id> makes every dish shareable, and the back button closes the modal.
  useEffect(() => {
    setOpenId(dishFromUrl());
    const onPop = () => setOpenId(dishFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openDish = useCallback((id: string) => {
    // Stepping between dishes replaces the entry, so one Back always closes the modal.
    if (openRef.current) window.history.replaceState({ dish: id }, '', urlWithDish(id));
    else window.history.pushState({ dish: id }, '', urlWithDish(id));
    setOpenId(id);
  }, []);

  const closeDish = useCallback(() => {
    // If we pushed the entry, step back so Back doesn't reopen it; otherwise just clean the URL.
    if (window.history.state?.dish) window.history.back();
    else window.history.replaceState(null, '', urlWithDish(null));
    setOpenId(null);
  }, []);

  if (!isHomePath()) return <NotFound />;

  return (
    // domAnimation is the small feature set; the modal adds drag support when it loads.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#menu"
          className="sr-only z-[60] rounded-full bg-brown-900 px-5 py-3 font-bold text-cream-50 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t.skip}
        </a>
        <Navbar />
        <main>
          <Hero />
          <MenuSection filters={filters} onFiltersChange={setFilters} onOpenDish={openDish} onVisibleChange={setVisibleIds} />
          <PopularCarousel onOpenDish={openDish} />
          <About />
          <Reviews />
          <Contact />
        </main>
        <Footer />

        <FloatingWhatsApp />
        <CartBar />
        <CartDrawer />
        <Suspense fallback={null}>
          <AnimatePresence>
            {openId && <DishModal key="dish-modal" dishId={openId} navIds={visibleIds} onNavigate={openDish} onClose={closeDish} />}
          </AnimatePresence>
        </Suspense>
      </MotionConfig>
    </LazyMotion>
  );
}
