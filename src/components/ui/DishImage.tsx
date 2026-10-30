import { useEffect, useRef, useState } from 'react';
import type { Dish } from '../../data/menu.ts';
import { dishImage } from '../../lib/images.ts';

interface Props {
  dish: Dish;
  alt: string;
  sizes: string;
  widths?: number[];
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

/**
 * Dish photo with a shimmer placeholder that cross-fades to the image,
 * and a branded latte card with the logo when there is no photo (or it fails).
 */
export function DishImage({ dish, alt, sizes, widths, className = '', imgClassName = '', priority = false }: Props) {
  const image = dishImage(dish, widths);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(image ? 'loading' : 'error');
  const imgRef = useRef<HTMLImageElement>(null);

  // With prerendered HTML the photo can finish loading before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  return (
    <div className={`relative overflow-hidden bg-latte-100 ${className}`}>
      {status !== 'loaded' && (
        <div className={`absolute inset-0 ${status === 'loading' ? 'shimmer-bg' : 'bg-gradient-to-br from-latte-200 via-latte-100 to-cream-50'}`}>
          {status === 'error' && (
            <img
              src="/logo-192.webp"
              alt=""
              width={96}
              height={96}
              className="absolute inset-0 m-auto size-1/3 max-w-24 opacity-25 mix-blend-multiply"
            />
          )}
        </div>
      )}
      {image && status !== 'error' && (
        <img
          ref={imgRef}
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          alt={alt}
          width={800}
          height={600}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`size-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  );
}
