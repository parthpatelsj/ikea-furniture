import { Link } from 'react-router-dom';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PromoStrip } from '@/components/home/PromoStrip';
import { ProductGrid } from '@/components/product/ProductGrid';
import { products } from '@/data/products';

export default function Home() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <>
      <Hero />

      <CategoryGrid />

      <PromoStrip />

      <section className="container-page mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">New for 2026</h2>
            <p className="mt-1 text-sm text-ikea-gray-600">
              Fresh arrivals from this season's collection.
            </p>
          </div>
          <Link to="/category/sofas" className="link-underline text-sm">
            See all
          </Link>
        </div>
        <ProductGrid products={newArrivals} priorityCount={2} />
      </section>

      <section className="container-page mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Bestsellers</h2>
            <p className="mt-1 text-sm text-ikea-gray-600">
              Tried, tested and loved by customers.
            </p>
          </div>
          <Link to="/category/storage" className="link-underline text-sm">
            See all
          </Link>
        </div>
        <ProductGrid products={bestsellers} />
      </section>
    </>
  );
}
