// Self-hosted fonts: each file carries a unicode-range, so only the Arabic/Latin subsets in use download.
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
import '@fontsource/reem-kufi/400.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { isHomePath } from './App.tsx';
import { Root } from './Root.tsx';
import './styles/index.css';

const container = document.getElementById('root')!;

// The production build ships the home page prerendered (scripts/prerender.mjs), so hydrate it.
// In dev, or on a 404 path (served the same HTML), render from scratch instead.
if (container.hasChildNodes() && isHomePath()) {
  hydrateRoot(container, <Root />);
} else {
  container.textContent = '';
  createRoot(container).render(<Root />);
}
