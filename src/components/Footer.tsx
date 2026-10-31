import { Phone } from 'lucide-react';
import { site } from '../data/site.ts';
import { useLocale } from '../hooks/useLocale.tsx';
import { whatsappLink } from '../lib/whatsapp.ts';
import { FacebookIcon, GitHubIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './ui/icons.tsx';
import { Ornament } from './ui/Ornament.tsx';

export function Footer() {
  const { t, locale } = useLocale();
  const name = locale === 'ar' ? site.nameAr : site.nameEn;

  // Empty links in site.ts are simply not shown.
  const socials = [
    { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: site.social.tiktok, label: 'TikTok', Icon: TikTokIcon },
    { href: whatsappLink(), label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter((s) => s.href);

  const links = [
    { href: '#top', label: t.nav.home },
    { href: '#menu', label: t.nav.menu },
    { href: '#popular', label: t.nav.popular },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <footer className="grain bg-brown-950 pb-28 pt-16 text-latte-200 sm:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div className="text-center md:text-start">
          <img src="/logo-192.webp" alt={name} width={88} height={88} loading="lazy" className="mx-auto size-22 rounded-full md:mx-0" />
          <p className="mt-4 font-display text-2xl text-cream-50">{name}</p>
          <p className="mt-1 text-sm">{locale === 'ar' ? site.addressAr : site.addressEn}</p>
          <a href={`tel:${site.phone}`} dir="ltr" className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-latte-100 hover:text-cream-50">
            <Phone size={16} aria-hidden="true" />
            {site.phone}
          </a>
        </div>

        <nav aria-label={t.footer.quickLinks} className="text-center">
          <h2 className="font-display text-lg text-cream-50">{t.footer.quickLinks}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center hover:text-cream-50">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-center md:text-end">
          <h2 className="font-display text-lg text-cream-50">{t.footer.follow}</h2>
          <ul className="mt-4 flex justify-center gap-3 md:justify-end">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-12 place-items-center rounded-full border border-latte-300/30 text-latte-100 transition hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500 hover:text-brown-950"
                >
                  <Icon size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <Ornament tone="gold" />
        <p className="mt-6 text-center text-sm font-semibold text-latte-100" dir="ltr">
          Created by{' '}
          <a
            href={site.developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline decoration-latte-300/60 underline-offset-4 hover:text-gold-500"
          >
            <GitHubIcon size={15} />
            {site.developer.name}
          </a>
          ; WhatsApp number:{' '}
          <a
            href={`https://wa.me/${site.developer.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-latte-300/60 underline-offset-4 hover:text-gold-500"
          >
            {site.developer.phoneDisplay}
          </a>
        </p>
      </div>
    </footer>
  );
}
