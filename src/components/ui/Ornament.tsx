/**
 * Thin divider with a small lotus-and-diamond motif — a light nod to Thai
 * ornament, used only under section titles.
 */
export function Ornament({ className = '', tone = 'latte' }: { className?: string; tone?: 'latte' | 'gold' }) {
  const color = tone === 'gold' ? 'text-gold-500' : 'text-latte-300';
  return (
    <div className={`flex items-center justify-center gap-3 ${color} ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
      <svg width="44" height="18" viewBox="0 0 44 18" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 2c2.6 2.8 2.6 6.2 0 9-2.6-2.8-2.6-6.2 0-9Z" fill="currentColor" fillOpacity=".25" />
        <path d="M22 11c-3.2-.2-5.8-1.8-7.4-4.6 3.2.2 5.8 1.8 7.4 4.6Zm0 0c3.2-.2 5.8-1.8 7.4-4.6-3.2.2-5.8 1.8-7.4 4.6Z" />
        <path d="M22 13.2 23.6 15 22 16.8 20.4 15 22 13.2Z" fill="currentColor" />
        <circle cx="9" cy="9" r="1.2" fill="currentColor" />
        <circle cx="35" cy="9" r="1.2" fill="currentColor" />
      </svg>
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
    </div>
  );
}
