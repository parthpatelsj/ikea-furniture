import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, Store, ShieldCheck, Box } from 'lucide-react';
import { Model } from '@webspatial/react-sdk';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Image } from '@/components/ui/Image';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getRelatedProducts, productById } from '@/data/products';
import { categoryById } from '@/data/categories';
import { formatDimension, formatPrice } from '@/lib/format';
import { modelUrlForProduct } from '@/data/models';
import { isXR, openProductInSpace } from '@/lib/spatial';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { cn } from '@/lib/cn';

export default function Product() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? productById[productId] : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCart((s) => s.add);
  const isFavorite = useWishlist((s) => (productId ? s.ids.includes(productId) : false));
  const toggleFavorite = useWishlist((s) => s.toggle);

  if (!product) return <Navigate to="/" replace />;

  const related = getRelatedProducts(product.id);
  const category = categoryById[product.category];
  const modelUrl = modelUrlForProduct(product.id);
  const showModel = isXR() && !!modelUrl;

  const handleAdd = () => {
    addToCart(product.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: category.name, to: `/category/${category.id}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          {showModel ? (
            <Model
              enable-xr
              src={modelUrl}
              poster={product.images[0]}
              aria-label={`${product.name} ${product.series} 3D model`}
              className="aspect-square w-full rounded-lg bg-ikea-gray-50"
              style={{ '--xr-depth': '320px' } as CSSProperties}
            />
          ) : (
            <Image
              src={product.images[activeImage]}
              alt={`${product.name} ${product.series} — view ${activeImage + 1}`}
              aspect="square"
              rounded
              loading="eager"
            />
          )}
          {!showModel && product.images.length > 1 && (
            <ul role="list" className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={activeImage === i}
                    className={cn(
                      'block w-full overflow-hidden rounded-md border-2 transition-colors',
                      activeImage === i
                        ? 'border-ikea-blue'
                        : 'border-transparent hover:border-ikea-gray-300',
                    )}
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew && <Badge variant="new" />}
            {product.oldPrice != null && <Badge variant="sale" />}
            {product.isBestseller && !product.isNew && <Badge variant="bestseller" />}
          </div>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-lg text-ikea-gray-600">
            {product.series}, {product.description}
          </p>

          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            {product.oldPrice != null ? (
              <>
                <span className="text-3xl font-bold text-ikea-red">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base text-ikea-gray-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ikea-gray-600">Price incl. taxes</p>

          {product.colors.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">
                Color:{' '}
                <span className="font-normal text-ikea-gray-600">
                  {product.colors[activeColor]?.name}
                </span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setActiveColor(i)}
                    aria-label={c.name}
                    aria-pressed={activeColor === i}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full border-2 p-0.5 transition-colors',
                      activeColor === i
                        ? 'border-ikea-black'
                        : 'border-ikea-gray-200 hover:border-ikea-gray-400',
                    )}
                  >
                    <span
                      className="h-full w-full rounded-full"
                      style={{ background: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className="btn btn-primary h-12 flex-1 px-6 text-base"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {product.inStock ? 'Add to bag' : 'Out of stock'}
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border border-ikea-gray-300 hover:bg-ikea-gray-100',
                isFavorite && 'text-ikea-red',
              )}
            >
              <Heart
                className="h-5 w-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                aria-hidden
              />
            </button>
          </div>

          {isXR() && modelUrlForProduct(product.id) && (
            <button
              type="button"
              onClick={() => openProductInSpace(product)}
              className="btn btn-secondary mt-3 h-12 px-6 text-base"
            >
              <Box className="h-5 w-5" aria-hidden />
              View in a spatial window
            </button>
          )}

          {justAdded && (
            <div
              role="status"
              className="mt-3 rounded-md border border-ikea-green/30 bg-ikea-green/10 px-3 py-2 text-sm text-ikea-green"
            >
              Added to your bag.{' '}
              <Link to="/cart" className="font-semibold underline">
                View bag
              </Link>
            </div>
          )}

          {/* Service strip */}
          <ul className="mt-8 space-y-3 border-t border-ikea-gray-200 pt-6 text-sm">
            <li className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-ikea-blue" aria-hidden />
              <span>
                Home delivery from <strong>$9.99</strong>. Estimated arrival in 3–5
                business days.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Store className="h-5 w-5 text-ikea-blue" aria-hidden />
              <span>Free Click &amp; Collect at your nearest IKEA store.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-ikea-blue" aria-hidden />
              <span>365-day return policy &amp; manufacturer warranty included.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Description, materials, dimensions */}
      <section className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <h2 className="text-2xl font-bold">Product description</h2>
          <p className="mt-3 text-base leading-relaxed text-ikea-gray-600">
            {product.longDescription}
          </p>

          <h3 className="mt-8 text-lg font-semibold">Good to know</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ikea-gray-600">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </article>

        <aside className="rounded-2xl bg-ikea-gray-50 p-6">
          <h3 className="text-lg font-semibold">Specifications</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-ikea-gray-200 pb-2">
              <dt className="text-ikea-gray-600">Materials</dt>
              <dd className="text-right">{product.materials.join(', ')}</dd>
            </div>
            {product.dimensions.width != null && (
              <div className="flex justify-between border-b border-ikea-gray-200 pb-2">
                <dt className="text-ikea-gray-600">Width</dt>
                <dd>{formatDimension(product.dimensions.width)}</dd>
              </div>
            )}
            {product.dimensions.depth != null && (
              <div className="flex justify-between border-b border-ikea-gray-200 pb-2">
                <dt className="text-ikea-gray-600">Depth</dt>
                <dd>{formatDimension(product.dimensions.depth)}</dd>
              </div>
            )}
            {product.dimensions.length != null && (
              <div className="flex justify-between border-b border-ikea-gray-200 pb-2">
                <dt className="text-ikea-gray-600">Length</dt>
                <dd>{formatDimension(product.dimensions.length)}</dd>
              </div>
            )}
            {product.dimensions.height != null && (
              <div className="flex justify-between">
                <dt className="text-ikea-gray-600">Height</dt>
                <dd>{formatDimension(product.dimensions.height)}</dd>
              </div>
            )}
          </dl>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
