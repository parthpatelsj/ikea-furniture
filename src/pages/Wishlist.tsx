import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlist';
import { productById } from '@/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const items = ids.map((id) => productById[id]).filter(Boolean);

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Favorites</h1>
      <p className="mt-2 text-sm text-ikea-gray-600">
        {items.length} {items.length === 1 ? 'item' : 'items'} saved
      </p>

      <div className="mt-10">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="mx-auto h-12 w-12 text-ikea-gray-400" aria-hidden />
            <p className="mt-4 text-lg font-semibold">No favorites yet</p>
            <p className="mt-1 text-ikea-gray-600">
              Tap the heart on a product to save it here.
            </p>
            <Link to="/" className="btn btn-primary mt-6">
              Start exploring
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}
