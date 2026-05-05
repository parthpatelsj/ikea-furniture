import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { categoryById } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import type { CategoryId } from '@/types';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
];

export default function Category() {
  const { categoryId } = useParams<{ categoryId: CategoryId }>();
  const [sort, setSort] = useState<SortKey>('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);

  const category = categoryId ? categoryById[categoryId] : undefined;

  const products = useMemo(() => {
    if (!category) return [];
    let list = getProductsByCategory(category.id);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [category, sort, inStockOnly]);

  if (!category) return <Navigate to="/" replace />;

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/' },
          { label: category.name },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-base text-ikea-gray-600">{category.tagline}</p>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-ikea-gray-200 py-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-ikea-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-ikea-gray-300 text-ikea-blue focus:ring-ikea-blue"
            />
            In stock only
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ikea-gray-600">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-ikea-gray-300 bg-white px-3 py-1.5 text-sm focus:border-ikea-blue"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-10">
        <ProductGrid products={products} priorityCount={4} />
      </div>
    </div>
  );
}
