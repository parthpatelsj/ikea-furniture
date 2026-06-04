import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Model } from '@webspatial/react-sdk';
import type { Product } from '@/types';
import { cn } from '@/lib/cn';

interface SpatialDragEventLike {
  translationX?: number;
  translationY?: number;
  translationZ?: number;
}

interface SpatialMagnifyEventLike {
  magnification?: number;
}

interface SpatialRotateEventLike {
  quaternion?: { x?: number; y?: number; z?: number; w?: number };
}

interface ProductModelProps {
  product: Product;
  interactive?: boolean;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function ProductModel({ product, interactive = false, className }: ProductModelProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: -8, y: 22, z: 0 });
  const [dragOrigin, setDragOrigin] = useState(position);
  const [scaleOrigin, setScaleOrigin] = useState(scale);

  return (
    <Model
      enable-xr
      src={product.modelSrc}
      aria-label={`${product.name} ${product.series} 3D model`}
      className={cn('block h-full w-full cursor-grab', interactive && 'cursor-move', className)}
      style={
        {
          '--xr-depth': interactive ? '620px' : '240px',
          transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale3d(${scale}, ${scale}, ${scale})`,
        } as CSSProperties & Record<string, string>
      }
      onSpatialDragStart={() => {
        if (!interactive) return;
        setDragOrigin(position);
      }}
      onSpatialDrag={(event) => {
        if (!interactive) return;
        const dragEvent = event as SpatialDragEventLike;
        setPosition({
          x: dragOrigin.x + (dragEvent.translationX ?? 0),
          y: dragOrigin.y + (dragEvent.translationY ?? 0),
          z: dragOrigin.z + (dragEvent.translationZ ?? 0),
        });
      }}
      onSpatialMagnify={(event) => {
        if (!interactive) return;
        const magnifyEvent = event as SpatialMagnifyEventLike;
        setScale(clamp(scaleOrigin * (magnifyEvent.magnification ?? 1), 0.45, 2.25));
      }}
      onSpatialMagnifyEnd={() => {
        if (!interactive) return;
        setScaleOrigin(scale);
      }}
      onSpatialRotate={(event) => {
        if (!interactive) return;
        const rotateEvent = event as SpatialRotateEventLike;
        const q = rotateEvent.quaternion;
        if (!q) return;
        setRotation((current) => ({
          x: current.x + (q.x ?? 0) * 12,
          y: current.y + (q.y ?? 0) * 12,
          z: current.z + (q.z ?? 0) * 12,
        }));
      }}
    />
  );
}
