import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
}

export function ProductGrid({ products, priorityCount = 0 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-ikea-gray-600">
        No products match your criteria.
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
      role="list"
    >
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
