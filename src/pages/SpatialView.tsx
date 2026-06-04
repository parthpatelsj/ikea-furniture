import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Model } from '@webspatial/react-sdk';
import type { ModelSpatialDragEvent, ModelSpatialMagnifyEvent } from '@webspatial/react-sdk';
import { productById } from '@/data/products';
import { modelUrlForProduct } from '@/data/models';
import { isModelSupported } from '@/lib/spatial';
import { formatPrice } from '@/lib/format';

/**
 * Standalone Spatial Scene that focuses a single product's 3D model.
 *
 * Opened (in a `volume` scene) when a catalog item is tapped. The volume scene
 * itself can be grabbed and repositioned in space by the OS; on top of that we
 * wire the model's own spatial gestures so the user can drag it to reposition it
 * and pinch to scale it within the scene.
 */
export default function SpatialView() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? productById[productId] : undefined;
  const modelUrl = productId ? modelUrlForProduct(productId) : undefined;

  // Committed position (px) and scale, plus the in-flight drag delta.
  const base = useRef({ x: 0, y: 0, z: 0 });
  const drag = useRef({ x: 0, y: 0, z: 0 });
  const baseScale = useRef(1);
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);

  if (!product || !modelUrl) return <Navigate to="/" replace />;

  const handleDrag = (e: ModelSpatialDragEvent) => {
    // translation values are cumulative from the start of the current gesture.
    drag.current = { x: e.translationX, y: e.translationY, z: e.translationZ };
    setPos({
      x: base.current.x + e.translationX,
      y: base.current.y + e.translationY,
      z: base.current.z + e.translationZ,
    });
  };

  const handleDragEnd = () => {
    base.current = {
      x: base.current.x + drag.current.x,
      y: base.current.y + drag.current.y,
      z: base.current.z + drag.current.z,
    };
    drag.current = { x: 0, y: 0, z: 0 };
  };

  const handleMagnify = (e: ModelSpatialMagnifyEvent) => {
    setScale(baseScale.current * e.magnification);
  };

  const handleMagnifyEnd = () => {
    baseScale.current = scale;
  };

  const modelStyle: CSSProperties = {
    width: '100%',
    height: '70vh',
    // x/y reposition stay on the 2D plane; z moves the plane toward/away (depth).
    transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`,
    '--xr-back': `${pos.z}px`,
    '--xr-depth': '420px',
  } as CSSProperties;

  return (
    <main className="flex min-h-screen flex-col bg-ikea-gray-50">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-bold">
          {product.name}
          <span className="block text-base font-normal text-ikea-gray-600">
            {product.series}, {product.description}
          </span>
        </h1>
        <p className="mt-1 text-lg font-bold">{formatPrice(product.price)}</p>
      </header>

      <div className="flex flex-1 items-center justify-center px-6">
        <Model
          enable-xr
          src={modelUrl}
          poster={product.images[0]}
          aria-label={`${product.name} ${product.series} 3D model`}
          onSpatialDrag={handleDrag}
          onSpatialDragEnd={handleDragEnd}
          onSpatialMagnify={handleMagnify}
          onSpatialMagnifyEnd={handleMagnifyEnd}
          style={modelStyle}
        />
      </div>

      <footer className="px-6 pb-6 text-center text-sm text-ikea-gray-600">
        {isModelSupported()
          ? 'Drag to move and reposition · pinch to resize · grab the window to move it in space'
          : 'Open this app in a WebSpatial runtime (e.g. Apple Vision Pro) to interact with the 3D model in space.'}
      </footer>
    </main>
  );
}
