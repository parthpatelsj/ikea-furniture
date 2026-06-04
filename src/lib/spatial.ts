import { initScene, WebSpatialRuntime } from '@webspatial/react-sdk';
import type { Product } from '@/types';

/**
 * Whether we are running inside a WebSpatial Runtime (visionOS via WebSpatial
 * Builder, PICO OS 6, ...) where spatial features such as the `<Model>` element
 * are available. On a regular desktop/mobile browser this is `false`, and the
 * catalog gracefully falls back to 2D product imagery.
 *
 * Uses the SDK's public capability probe rather than ad-hoc DOM sniffing.
 */
export function isXR(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return WebSpatialRuntime.supports('Model');
  } catch {
    return false;
  }
}

/** Stable Spatial Scene name for a product, so re-clicking focuses the same scene. */
export function sceneNameForProduct(id: string): string {
  return `spatial-model-${id}`;
}

/**
 * Open (or focus) a product's 3D model in its own Spatial Scene.
 *
 * The scene is configured as a `volume` so the operating system gives it natural
 * spatial behavior: the user can grab it and move, drag and reposition it in
 * space. `window.open` with a stable scene name focuses an already-open scene
 * instead of creating a duplicate.
 */
export function openProductInSpace(product: Product): void {
  const name = sceneNameForProduct(product.id);

  // `initScene` is a no-op outside a WebSpatial Runtime; guard so the regular
  // web build never throws.
  try {
    initScene(
      name,
      (defaultConfig) => ({
        ...defaultConfig,
        defaultSize: { width: '1.6m', height: '1.2m', depth: '1.2m' },
      }),
      // Scene `type` is configured via the options argument (see confusion.md —
      // the docs example instead returns `type` inside the callback object).
      { type: 'volume' },
    );
  } catch {
    // Ignore: not running inside a WebSpatial Runtime.
  }

  window.open(`/spatial/${product.id}`, name);
}
