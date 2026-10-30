import type { Dish } from '../data/menu.ts';
import { demoPhotos, heroDishPhoto, heroPhoto } from '../data/photos.ts';

export interface ResolvedImage {
  src: string;
  srcSet?: string;
}

/** Unsplash's CDN resizes and serves WebP/AVIF itself, so one id gives a full srcset. */
export function unsplashUrl(photoId: string, width: number, aspect = 3 / 4, quality = 70): string {
  const h = Math.round(width * aspect);
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${h}&q=${quality}`;
}

function unsplashSet(photoId: string, widths: number[], aspect?: number): ResolvedImage {
  return {
    src: unsplashUrl(photoId, widths[1] ?? widths[0]!, aspect),
    srcSet: widths.map((w) => `${unsplashUrl(photoId, w, aspect)} ${w}w`).join(', '),
  };
}

/** Hero background at 3:2 — dimmed behind a gradient, so lower quality is invisible and saves bandwidth. */
export function heroImage(width: number): string {
  return unsplashUrl(heroPhoto, width, 2 / 3, 50);
}

export function heroDishImage(width: number): string {
  return unsplashUrl(heroDishPhoto, width, 1);
}

/** The restaurant's own photo wins; otherwise the demo photo; otherwise null (branded fallback). */
export function dishImage(dish: Dish, widths = [360, 560, 840]): ResolvedImage | null {
  if (dish.image) return { src: dish.image };
  const demo = demoPhotos[dish.id];
  return demo ? unsplashSet(demo, widths) : null;
}
