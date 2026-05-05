/**
 * Build a deterministic placeholder image URL.
 * In a real production app these would resolve to a CDN-hosted asset
 * (e.g. https://images.ikea.com/...) and be served via an `<img srcset>`.
 */
export function placeholderImage(seed: string, width = 800, height = 800): string {
  const safe = encodeURIComponent(seed);
  return `https://picsum.photos/seed/ikea-${safe}/${width}/${height}`;
}
