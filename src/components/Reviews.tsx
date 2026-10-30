import { Quote, Star } from 'lucide-react';
import { reviews } from '../data/reviews.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { whatsappLink } from '../lib/whatsapp.ts';
import { WhatsAppIcon } from './ui/icons.tsx';
import { Reveal } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

export function Reviews() {
  const { t, locale } = useLocale();

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-latte-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="reviews-title" title={t.reviews.title} subtitle={t.reviews.subtitle} />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure
                className={`relative flex h-full flex-col rounded-2xl bg-cream-50 p-6 shadow-card sm:p-7 ${
                  r.sample ? 'border-2 border-dashed border-latte-300' : 'ring-1 ring-latte-200'
                }`}
              >
                <Quote size={36} className="text-latte-300 rtl:-scale-x-100" aria-hidden="true" />
                {r.sample && (
                  <span className="absolute end-4 top-4 rounded-full bg-latte-100 px-3 py-1 text-xs font-bold text-brown-500">
                    {t.reviews.sampleLabel}
                  </span>
                )}
                <blockquote className={`mt-3 flex-1 text-base leading-loose ${r.sample ? 'text-brown-500' : 'text-brown-900'}`}>
                  {locale === 'ar' ? r.textAr : r.textEn}
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between border-t border-latte-200 pt-4">
                  <span className="font-bold text-brown-900">{r.name}</span>
                  <span className="flex gap-0.5" role="img" aria-label={`${r.rating}/5`}>
                    {Array.from({ length: 5 }, (_, n) => (
                      <Star key={n} size={16} aria-hidden="true" className={n < r.rating ? 'fill-gold-500 text-gold-500' : 'text-latte-200'} />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={whatsappLink(t.reviews.writeMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-brown-900 px-6 font-bold text-brown-900 transition hover:bg-brown-900 hover:text-cream-50"
          >
            <WhatsAppIcon size={20} />
            {t.reviews.write}
          </a>
        </div>
      </div>
    </section>
  );
}
