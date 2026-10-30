import { useLocale } from '../hooks/useLocale.tsx';
import { Ornament } from './ui/Ornament.tsx';

export function NotFound() {
  const { t } = useLocale();
  return (
    <main className="grain flex min-h-svh flex-col items-center justify-center bg-brown-950 px-6 text-center text-cream-50">
      <img src="/logo-192.webp" alt="" width={120} height={120} className="size-28 rounded-full shadow-lift" />
      <p className="mt-8 font-display text-7xl text-gold-500">404</p>
      <h1 className="mt-2 font-display text-3xl">{t.notFound.title}</h1>
      <Ornament tone="gold" className="mt-4" />
      <p className="mt-4 max-w-sm text-latte-200">{t.notFound.body}</p>
      <a href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-latte-200 px-7 font-bold text-brown-950 transition hover:bg-cream-50">
        {t.notFound.back}
      </a>
    </main>
  );
}
