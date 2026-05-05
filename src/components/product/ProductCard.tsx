import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { Image } from '@/components/ui/Image';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { formatPrice } from '@/lib/format';
import { useWishlist } from '@/store/wishlist';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isFavorite = useWishlist((s) => s.ids.includes(product.id));
  const toggle = useWishlist((s) => s.toggle);

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className="block"
          aria-label={`${product.name} ${product.series}`}
        >
          <Image
            src={product.images[0]}
            alt={`${product.name} ${product.series}`}
            aspect="square"
            rounded
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="new" />}
          {product.oldPrice != null && <Badge variant="sale" />}
          {product.isBestseller && !product.isNew && <Badge variant="bestseller" />}
          {!product.inStock && <Badge variant="oos" />}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ikea-black shadow-card transition-transform hover:scale-105',
            isFavorite && 'text-ikea-red',
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          <Heart
            className="h-4 w-4"
            fill={isFavorite ? 'currentColor' : 'none'}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-baseline gap-2">
          {product.oldPrice != null ? (
            <>
              <span className="text-lg font-bold text-ikea-red">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-ikea-gray-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="mt-1">
          <h3 className="text-base font-semibold leading-tight">
            {product.name}
            <span className="block text-sm font-normal text-ikea-gray-600">
              {product.series}, {product.description}
            </span>
          </h3>
        </Link>

        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>

        {product.colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                aria-label={c.name}
                className="h-4 w-4 rounded-full border border-ikea-gray-200"
                style={{ background: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-ikea-gray-600">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
