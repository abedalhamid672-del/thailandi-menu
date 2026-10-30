// Writes the server-rendered home page into dist/index.html, so the hero and menu
// paint from plain HTML before any JavaScript runs (faster first paint, and crawlers
// see real content). The browser bundle then hydrates it.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href);
const template = await readFile('dist/index.html', 'utf8');
const marker = '<div id="root"></div>';

if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);

await writeFile('dist/index.html', template.replace(marker, `<div id="root">${render()}</div>`));
// Vercel and Netlify serve 404.html (with a real 404 status) for unknown paths; the app shows its 404 page there.
await writeFile('dist/404.html', template.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex" />'));
await rm('dist-ssr', { recursive: true, force: true });
console.log('Prerendered dist/index.html');
