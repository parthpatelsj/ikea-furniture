import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Model } from '@webspatial/react-sdk';
import type { Product } from '@/types';
import { Image } from '@/components/ui/Image';
import { modelUrlForProduct } from '@/data/models';
import { isXR } from '@/lib/spatial';

interface ProductModelProps {
  product: Product;
  priority?: boolean;
}

/**
 * Catalog media for a product.
 *
 * In a WebSpatial Runtime each card renders its 3D model via the WebSpatial
 * `<Model>` component. On a regular browser — where spatial features are not
 * available — it falls back to the existing 2D product image. In both cases the
 * default click/tap navigates to the product page within the current window,
 * matching normal product navigation. (Opening a product in a separate spatial
 * window is an explicit, opt-in action exposed on the product page.)
 */
export function ProductModel({ product, priority = false }: ProductModelProps) {
  const modelUrl = modelUrlForProduct(product.id);
  const navigate = useNavigate();
  const label = `${product.name} ${product.series}`;
  const to = `/product/${product.id}`;

  if (!modelUrl || !isXR()) {
    return (
      <Link to={to} className="block" aria-label={label}>
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

  // The wrapping Link handles in-window navigation for pointer clicks; the
  // model's spatial tap is forwarded to the same in-window navigation.
  return (
    <Link to={to} className="block" aria-label={label}>
      <Model
        enable-xr
        src={modelUrl}
        poster={product.images[0]}
        aria-hidden
        onSpatialTap={() => navigate(to)}
        className="block aspect-square w-full cursor-pointer rounded-lg bg-ikea-gray-50"
        style={{ '--xr-depth': '180px' } as CSSProperties}
      />
    </Link>
  );
}
