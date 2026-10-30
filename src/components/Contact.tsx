import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { site } from '../data/site.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { whatsappLink } from '../lib/whatsapp.ts';
import { WhatsAppIcon } from './ui/icons.tsx';
import { Reveal } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

function InfoRow({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-latte-100 text-brown-700">{icon}</span>
      <div>
        <h3 className="text-sm font-bold text-brown-500">{title}</h3>
        <div className="mt-0.5 text-lg font-semibold text-brown-900">{children}</div>
      </div>
    </div>
  );
}

export function Contact() {
  const { t, locale } = useLocale();
  const ar = locale === 'ar';

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="contact-title" title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col gap-7 rounded-2xl bg-cream-50 p-6 shadow-card ring-1 ring-latte-200 sm:p-8">
            <InfoRow icon={<Clock size={22} aria-hidden="true" />} title={t.contact.hours}>
              {site.hours.length > 0 ? (
                <ul className="space-y-1">
                  {site.hours.map((h) => (
                    <li key={h.daysAr}>
                      {ar ? h.daysAr : h.daysEn}: <span dir="ltr">{h.opens} – {h.closes}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-base font-medium text-brown-700">{t.contact.hoursUnknown}</span>
              )}
            </InfoRow>
            <InfoRow icon={<Phone size={22} aria-hidden="true" />} title={t.contact.phone}>
              <a href={`tel:${site.phone}`} dir="ltr" className="underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </InfoRow>
            <InfoRow icon={<MapPin size={22} aria-hidden="true" />} title={t.contact.address}>
              <p>{ar ? site.addressAr : site.addressEn}</p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brown-500 hover:text-brown-900"
              >
                <Navigation size={16} aria-hidden="true" />
                {t.contact.openMaps}
              </a>
            </InfoRow>
            <a
              href={whatsappLink(t.whatsapp.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-whatsapp text-lg font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <WhatsAppIcon size={24} />
              {t.contact.whatsapp}
            </a>
          </Reveal>

          <Reveal delay={0.1} className="min-h-80 overflow-hidden rounded-2xl bg-latte-100 shadow-card ring-1 ring-latte-200">
            <iframe
              title={t.contact.mapTitle}
              src={site.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-80 border-0 sepia-[.25]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
