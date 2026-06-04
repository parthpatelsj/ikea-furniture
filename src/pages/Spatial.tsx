import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Model } from '@webspatial/react-sdk';
import { productById } from '@/data/products';

export default function Spatial() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? productById[productId] : undefined;

  const [drag, setDrag] = useState({ x: 0, y: 0, z: 0 });
  const baseRef = useRef({ x: 0, y: 0, z: 0 });

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Model not found</h1>
        <Link to="/" className="mt-4 inline-block text-ikea-blue underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-ikea-gray-50">
      <header className="flex items-center justify-between border-b border-ikea-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold">{product.name}</h1>
          <p className="text-sm text-ikea-gray-600">
            {product.series}, {product.description}
          </p>
        </div>
        <Link to={`/product/${product.id}`} className="text-sm text-ikea-blue underline">
          Product details
        </Link>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <Model
          enable-xr
          src={product.model}
          className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate3d(calc(-50% + ${drag.x}px), calc(-50% + ${drag.y}px), ${drag.z}px)`,
          }}
          onSpatialDragStart={() => {
            baseRef.current = { ...drag };
          }}
          onSpatialDrag={(e) => {
            setDrag({
              x: baseRef.current.x + e.translationX,
              y: baseRef.current.y + e.translationY,
              z: baseRef.current.z + e.translationZ,
            });
          }}
        />

        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 text-sm text-ikea-gray-700 shadow-card">
          Drag the model to reposition it in space.
        </p>
      </main>
    </div>
  );
}
