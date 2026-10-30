// Generates the small logo files the site actually loads from the 1024px
// original in public/logo.png. The artwork itself is never altered — only resized.
// Run again after replacing public/logo.png:  npm run icons
import sharp from 'sharp';

const src = 'public/logo.png';
const out = (name) => `public/${name}`;

await Promise.all([
  sharp(src).resize(192).webp({ quality: 88 }).toFile(out('logo-192.webp')),
  sharp(src).resize(384).webp({ quality: 88 }).toFile(out('logo-384.webp')),
  sharp(src).resize(32).png().toFile(out('favicon-32.png')),
  sharp(src).resize(180).png().toFile(out('apple-touch-icon.png')),
  sharp(src).resize(512).png().toFile(out('logo-512.png')),
]);

// Open Graph card: logo centred on the brand's espresso brown.
const logo = await sharp(src).resize(440).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#2B1810' },
})
  .composite([{ input: logo, gravity: 'center' }])
  .jpeg({ quality: 86 })
  .toFile(out('og-image.jpg'));

console.log('Logo variants written to public/');
