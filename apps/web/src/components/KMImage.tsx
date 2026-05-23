import { useMemo } from 'react';
import type { Upload } from '../types';

interface KMImageProps {
  src: Upload | string | number | null | undefined;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  aspect?: string; // e.g., "aspect-[4/3]"
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * KMImage: Optimized image component for the KurtMorales portfolio.
 * Supports Cloudflare Image Resizing when available and provides
 * safe fallbacks for local development.
 */
export function KMImage({
  src,
  alt,
  className,
  width,
  height,
  aspect = 'aspect-square',
  sizes = '100vw',
  loading = 'lazy',
}: KMImageProps) {
  const imageUrl = useMemo(() => {
    if (!src) return '';
    if (typeof src === 'string') return src;
    if (typeof src === 'object' && 'url' in src) return src.url || '';
    return '';
  }, [src]);

  const imageAlt = useMemo(() => {
    if (alt) return alt;
    if (src && typeof src === 'object' && 'alt' in src) return src.alt || '';
    return '';
  }, [src, alt]);

  // Cloudflare Image Resizing logic
  // We only apply this if the URL is absolute or specifically from our backend
  // Note: Only works on domains with Cloudflare Image Resizing enabled.
  const optimizedUrl = useMemo(() => {
    if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // Example of using Cloudflare's CDN-CGI if we're in production
    // For local dev, we just return the raw URL
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isLocal && width) {
      // Return Cloudflare Resizing URL
      // Adjust path if your Cloudflare setup differs
      return `/cdn-cgi/image/width=${width},format=auto,quality=80/${imageUrl}`;
    }

    return imageUrl;
  }, [imageUrl, width]);

  if (!imageUrl) {
    return (
      <div className={`${aspect} ${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs italic">No Image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      <img
        src={optimizedUrl}
        alt={imageAlt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        sizes={sizes}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if resizing fails or image is missing
          const target = e.target as HTMLImageElement;
          if (target.src !== imageUrl) {
            target.src = imageUrl;
          }
        }}
      />
    </div>
  );
}
