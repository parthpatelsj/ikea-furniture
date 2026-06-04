import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Model } from '@webspatial/react-sdk';
import type { Product } from '@/types';
import { Image } from '@/components/ui/Image';
import { modelUrlForProduct } from '@/data/models';
import { isModelSupported, openProductInSpace } from '@/lib/spatial';

interface ProductModelProps {
  product: Product;
  priority?: boolean;
}

/**
 * Catalog media for a product.
 *
 * In a WebSpatial Runtime each card renders its 3D model via the WebSpatial
 * `<Model>` component, and tapping it opens (or focuses) that model in its own
 * draggable Spatial Scene. On a regular browser — where the `<model>` element is
 * not available — it falls back to the existing 2D product image linking to the
 * product page, preserving the original catalog experience.
 */
export function ProductModel({ product, priority = false }: ProductModelProps) {
  const modelUrl = modelUrlForProduct(product.id);
  const label = `${product.name} ${product.series}`;

  if (!modelUrl || !isModelSupported()) {
    return (
      <Link to={`/product/${product.id}`} className="block" aria-label={label}>
        <Image
          src={product.images[0]}
          alt={label}
          aspect="square"
          rounded
          loading={priority ? 'eager' : 'lazy'}
        />
      </Link>
    );
  }

  return (
    <Model
      enable-xr
      src={modelUrl}
      poster={product.images[0]}
      role="button"
      tabIndex={0}
      aria-label={`View ${label} in 3D`}
      onClick={() => openProductInSpace(product)}
      onSpatialTap={() => openProductInSpace(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProductInSpace(product);
        }
      }}
      className="block aspect-square w-full cursor-pointer rounded-lg bg-ikea-gray-50"
      style={{ '--xr-depth': '180px' } as CSSProperties}
    />
  );
}
