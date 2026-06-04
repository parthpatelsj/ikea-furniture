import { initScene } from '@webspatial/react-sdk';
import type { Product } from '@/types';

const SPATIAL_SCENE_NAME = 'ikea-product-spatial-view';

export function getSpatialProductPath(productId: Product['id']) {
  return `/spatial/${productId}`;
}

export function openProductSpatialView(product: Product) {
  const url = getSpatialProductPath(product.id);

  initScene(SPATIAL_SCENE_NAME, (defaultConfig) => ({
    ...defaultConfig,
    type: 'volume',
    defaultSize: {
      width: 960,
      height: 720,
      depth: 720,
    },
    worldAlignment: 'gravityAligned',
    worldScaling: 'dynamic',
  }));

  window.open(url, SPATIAL_SCENE_NAME)?.focus();
}
