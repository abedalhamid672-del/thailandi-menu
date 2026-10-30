import { renderToString } from 'react-dom/server';
import { Root } from './Root.tsx';

/** Build-time render of the home page (used by scripts/prerender.mjs, never shipped to browsers). */
export function render(): string {
  return renderToString(<Root />);
}
