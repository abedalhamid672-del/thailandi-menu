import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { buildJsonLd } from './src/lib/seo.ts';
import { site } from './src/data/site.ts';

/**
 * Injects SEO tags that depend on the data files, so the restaurant's details
 * (name, phone, hours, socials, menu) are written once in src/data and still
 * appear in the static HTML that crawlers and link previews read.
 */
function seoFromData(): Plugin {
  return {
    name: 'seo-from-data',
    transformIndexHtml(html) {
      const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c');
      return html
        .replaceAll('%SITE_URL%', site.url)
        .replace('</head>', `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
    },
  };
}

/** Preloads the Arabic font files the hero uses, so text paints in the brand font without a late swap. */
function preloadFonts(): Plugin {
  const wanted = /(cairo-arabic-(400|700)|reem-kufi-arabic-400)-normal-[\w-]+\.woff2$/;
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      return Object.keys(ctx.bundle ?? {})
        .filter((file) => wanted.test(file))
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
          injectTo: 'head' as const,
        }));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFromData(), preloadFonts()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
});
