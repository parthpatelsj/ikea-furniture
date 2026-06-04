import { createElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface SceneConfig {
  type?: 'volume' | 'window';
  defaultSize?: {
    width?: number | string;
    height?: number | string;
    depth?: number | string;
  };
  resizability?: Record<string, number | string>;
  worldScaling?: 'automatic' | 'dynamic';
  worldAlignment?: 'automatic' | 'gravityAligned';
  baseplateVisibility?: 'automatic' | 'hidden';
}

export type SceneConfigurator = (defaultConfig: SceneConfig) => SceneConfig;

export function initScene(_sceneName: string, configure: SceneConfigurator): void {
  configure({});
}

export interface ModelProps {
  src: string;
  className?: string;
  style?: CSSProperties & Record<string, string | number | undefined>;
  children?: ReactNode;
  'enable-xr'?: boolean | '';
  'aria-label'?: string;
  onLoad?: () => void;
  onError?: () => void;
  onSpatialDragStart?: (event: unknown) => void;
  onSpatialDrag?: (event: unknown) => void;
  onSpatialDragEnd?: (event: unknown) => void;
  onSpatialMagnify?: (event: unknown) => void;
  onSpatialMagnifyEnd?: (event: unknown) => void;
  onSpatialRotate?: (event: unknown) => void;
  onSpatialRotateEnd?: (event: unknown) => void;
  onSpatialTap?: (event: unknown) => void;
}

export function Model({ children, ...props }: ModelProps) {
  return createElement('model', props, children);
}
