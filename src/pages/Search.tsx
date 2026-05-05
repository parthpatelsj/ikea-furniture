import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '@/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="container-page py-8">
      <p className="text-sm text-ikea-gray-600">Search results</p>
      <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
        {query ? `“${query}”` : 'Search'}
      </h1>
      <p className="mt-2 text-sm text-ikea-gray-600">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      <div className="mt-8">
        {query.trim().length === 0 ? (
          <p className="text-ikea-gray-600">Enter a search term to find products.</p>
        ) : results.length === 0 ? (
          <div className="py-12">
            <p className="text-base">
              No products matched your search. Try another keyword, or{' '}
              <Link to="/" className="link-underline">
                browse all categories
              </Link>
              .
            </p>
          </div>
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </div>
  );
}
