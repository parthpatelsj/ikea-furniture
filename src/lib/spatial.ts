import { initScene } from '@webspatial/react-sdk';
import type { Product } from '@/types';

export function openSpatialModel(product: Product): void {
  const sceneName = `model-${product.id}`;
  initScene(
    sceneName,
    (pre) => ({
      ...pre,
      defaultSize: { width: 800, height: 800, depth: 800 },
      worldAlignment: 'adaptive',
    }),
    { type: 'volume' },
  );
  window.open(`/spatial/${product.id}`, sceneName);
}
