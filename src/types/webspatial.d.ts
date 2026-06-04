import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    'enable-xr'?: boolean | '';
    'enable-xr-monitor'?: boolean | '';
    onSpatialTap?: (event: unknown) => void;
    onSpatialDragStart?: (event: unknown) => void;
    onSpatialDrag?: (event: unknown) => void;
    onSpatialDragEnd?: (event: unknown) => void;
    onSpatialMagnify?: (event: unknown) => void;
    onSpatialMagnifyEnd?: (event: unknown) => void;
    onSpatialRotate?: (event: unknown) => void;
    onSpatialRotateEnd?: (event: unknown) => void;
  }
}
