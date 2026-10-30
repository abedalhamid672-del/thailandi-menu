import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 1600;
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
import { categories, dishes } from '../data/menu.ts';
import { site } from '../data/site.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { Reveal } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    // A plain rAF loop: framer's animate() would pull its whole engine into the main bundle.
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setValue(Math.round(easeOutCubic(progress) * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

export function About() {
  const { t, locale } = useLocale();
  // Counted from the menu unless the owner overrides them in site.ts.
  const stats = [
    { value: site.stats.menuItems ?? dishes.length, label: t.about.statItems },
    { value: site.stats.categories ?? categories.length, label: t.about.statCategories },
    { value: site.stats.desserts ?? dishes.filter((d) => d.category === 'desserts').length, label: t.about.statDesserts },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="grain relative overflow-hidden bg-brown-950 py-20 text-cream-50 sm:py-28">
      <img
        src="/logo-384.webp"
        alt=""
        width={384}
        height={384}
        loading="lazy"
        className="pointer-events-none absolute -end-24 -top-24 size-96 opacity-[0.06] grayscale"
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="about-title" eyebrow={t.about.eyebrow} title={t.about.title} dark />
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-lg leading-loose text-latte-200 sm:text-xl">{locale === 'ar' ? site.aboutAr : site.aboutEn}</p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
          {stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.1} className="h-full rounded-2xl border border-latte-300/20 bg-brown-900/60 px-2 py-6 text-center sm:px-6 sm:py-8">
                <p className="font-display text-4xl text-gold-500 sm:text-6xl">
                  <Counter to={s.value} />
                </p>
                <p className="mt-2 text-xs font-semibold text-latte-200 sm:text-base">{s.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
