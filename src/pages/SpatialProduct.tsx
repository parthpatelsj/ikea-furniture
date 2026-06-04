import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductModel } from '@/components/spatial/ProductModel';
import { productById } from '@/data/products';
import { formatPrice } from '@/lib/format';

export default function SpatialProduct() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? productById[productId] : undefined;

  if (!product) return <Navigate to="/" replace />;

  return (
    <main className="min-h-[calc(100vh-9rem)] bg-ikea-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to={`/product/${product.id}`} className="btn btn-secondary h-11 px-4">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Product details
          </Link>
          <p className="rounded-full bg-white px-4 py-2 text-sm text-ikea-gray-600 shadow-card">
            Drag to move, pinch to resize, and rotate naturally in WebSpatial.
          </p>
        </div>

        <section className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-[520px] rounded-3xl bg-white p-4 shadow-card sm:p-8" enable-xr>
            <ProductModel product={product} interactive className="min-h-[480px]" />
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-card" enable-xr>
            <p className="text-sm font-semibold uppercase tracking-wide text-ikea-blue">
              Spatial preview
            </p>
            <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-ikea-gray-600">
              {product.series}, {product.description}
            </p>
            <p className="mt-5 text-2xl font-bold">{formatPrice(product.price)}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-ikea-gray-200 pb-3">
                <dt className="text-ikea-gray-600">Width</dt>
                <dd>{product.dimensions.width ?? '—'} cm</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-ikea-gray-200 pb-3">
                <dt className="text-ikea-gray-600">Depth / length</dt>
                <dd>{product.dimensions.depth ?? product.dimensions.length ?? '—'} cm</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ikea-gray-600">Height</dt>
                <dd>{product.dimensions.height ?? '—'} cm</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}
