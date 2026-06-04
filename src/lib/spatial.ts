import { initScene } from '@webspatial/react-sdk';
import type { Product } from '@/types';

/**
 * Whether the current runtime can render the WebSpatial `<Model>` element as a
 * real 3D object. Inside a WebSpatial Runtime (visionOS via WebSpatial Builder,
 * PICO OS 6, ...) the `<model>` element is available, so we use that as a proxy
 * for "spatial features are active". On a regular desktop/mobile browser this is
 * `false`, and the catalog gracefully falls back to 2D product imagery.
 */
export function isModelSupported(): boolean {
  return typeof window !== 'undefined' && 'HTMLModelElement' in window;
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
