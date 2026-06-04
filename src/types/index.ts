export type CategoryId =
  | 'sofas'
  | 'beds'
  | 'tables-chairs'
  | 'storage'
  | 'wardrobes'
  | 'sideboards';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductDimensions {
  width?: number;
  depth?: number;
  height?: number;
  length?: number;
}

export interface Product {
  id: string;
  name: string;
  series: string;
  description: string;
  longDescription: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  currency: 'USD';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  colors: ProductColor[];
  materials: string[];
  dimensions: ProductDimensions;
  images: string[];
  features: string[];
  model: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
