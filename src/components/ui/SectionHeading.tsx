import { Reveal } from './Reveal.tsx';
import { Ornament } from './Ornament.tsx';

interface Props {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, subtitle, dark = false, className = '' }: Props) {
  return (
    <Reveal className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-bold tracking-wide ${dark ? 'text-latte-300' : 'text-brown-500'}`}>{eyebrow}</p>
      )}
      <h2 id={id} className={`font-display text-3xl sm:text-4xl lg:text-5xl ${dark ? 'text-cream-50' : 'text-brown-900'}`}>
        {title}
      </h2>
      <Ornament className="mt-4" tone={dark ? 'gold' : 'latte'} />
      {subtitle && <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-latte-200' : 'text-brown-700'}`}>{subtitle}</p>}
    </Reveal>
  );
}
