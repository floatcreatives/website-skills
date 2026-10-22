/**
 * Builds a srcset string from a base image path.
 * Responsive variants live in /images/responsive/{basename}-{width}w.webp
 */
export function buildSrcset(src: string, widths: number[] = [480, 768, 1080, 1536]): string {
  const base = src.replace(/^\/images\//, '').replace(/\.webp$/, '');
  // Encode spaces for valid URLs (filenames contain spaces)
  const encodedBase = base.replace(/ /g, '%20');
  const encodedSrc = src.replace(/ /g, '%20');
  const parts: string[] = [];
  for (const w of widths) {
    parts.push(`/images/responsive/${encodedBase}-${w}w.webp ${w}w`);
  }
  // Original as the largest fallback
  parts.push(`${encodedSrc} 1600w`);
  return parts.join(', ');
}

/**
 * Builds a sizes attribute for full-width hero/background images
 */
export const heroSizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1080px) 1080px, 1536px';

/**
 * Builds a sizes attribute for half-width content images
 */
export const halfSizes = '(max-width: 768px) 100vw, 50vw';

/**
 * Builds a sizes attribute for third-width images
 */
export const thirdSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';

/**
 * Builds a sizes attribute for quarter-width images
 */
export const quarterSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
